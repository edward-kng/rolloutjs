import type { EvaluationContext, FlagValue } from "@openfeature/core";
import {
  FlagNotFoundError,
  StandardResolutionReasons,
} from "@openfeature/core";
import type { EvaluationResult } from "./types/ofrep.js";
import type { LibreFlagStore } from "./types/store.js";
import type { LibreFlagHttpMethods, LibreFlagServer } from "./types/server.js";
import { formatZodError, handleError } from "./utils/api.js";
import { hashContext } from "./utils/hash.js";
import { NotFoundError, ValidationError } from "./errors.js";
import { getSegmentPriority, isMember } from "./utils/segments.js";
import { type Flag, type UpdateFlagParams } from "./types/flags.js";
import {
  type Override,
  type SegmentOverride,
  type UserOverride,
} from "./types/overrides.js";
import {
  type CreateSegmentParams,
  type Segment,
  type UpdateSegmentParams,
} from "./types/segments.js";
import {
  flagSchema,
  flagValueSchema,
  updateFlagSchema,
} from "./schemas/flags.js";
import { segmentSchema, updateSegmentSchema } from "./schemas/segments.js";

export function LibreFlag(store: LibreFlagStore): LibreFlagServer {
  async function evaluate(
    flagKey: string,
    context: EvaluationContext = {},
  ): Promise<EvaluationResult> {
    if (context?.targetingKey) {
      const userOverride = context.targetingKey
        ? await store.getUserOverride(flagKey, context.targetingKey)
        : null;

      if (userOverride) {
        return {
          key: flagKey,
          value: userOverride.value,
          reason: StandardResolutionReasons.TARGETING_MATCH,
        };
      }
    }

    let segments = await store.listSegments();
    segments = segments.filter((segment) => isMember(context, segment));
    const segmentOverrides = await store.getSegmentOverridesForFlag(flagKey);
    const segmentOverride = segmentOverrides
      .filter((override) =>
        segments.find((segment) => segment.key === override.segmentKey),
      )
      .sort((a, b) =>
        segments.findIndex((segment) => segment.key === a.segmentKey) <
        segments.findIndex((segment) => segment.key === b.segmentKey)
          ? -1
          : 1,
      )[0];

    if (segmentOverride) {
      return {
        key: flagKey,
        value: segmentOverride.value,
        reason: StandardResolutionReasons.TARGETING_MATCH,
      };
    }

    const flag = await store.getFlag(flagKey);

    if (flag) {
      return {
        key: flag.key,
        value: flag.defaultValue,
        reason: StandardResolutionReasons.STATIC,
      };
    }

    throw new FlagNotFoundError(`Flag '${flagKey}' not found`);
  }

  async function evaluateAll(
    context: EvaluationContext = {},
  ): Promise<EvaluationResult[]> {
    const flags = await store.listFlags();
    const { targetingKey } = context;
    const userOverrides = targetingKey
      ? await store.getUserOverrides(targetingKey)
      : [];
    let segments = await store.listSegments();
    segments = segments.filter((segment) => isMember(context, segment));
    let segmentOverrides = await store.listSegmentOverrides();
    segmentOverrides = segmentOverrides
      .filter((override) =>
        segments.find((segment) => segment.key === override.segmentKey),
      )
      .sort((a, b) =>
        segments.findIndex((segment) => segment.key === a.segmentKey) <
        segments.findIndex((segment) => segment.key === b.segmentKey)
          ? -1
          : 1,
      );

    return flags.map((flag) => {
      const userOverride = userOverrides.find(
        (override) => override.flagKey === flag.key,
      );

      if (userOverride) {
        return {
          key: flag.key,
          value: userOverride.value,
          reason: StandardResolutionReasons.TARGETING_MATCH,
        };
      }

      const segmentOverride = segmentOverrides.find(
        (override) => override.flagKey === flag.key,
      );

      if (segmentOverride) {
        return {
          key: flag.key,
          value: segmentOverride.value,
          reason: StandardResolutionReasons.TARGETING_MATCH,
        };
      }

      return {
        key: flag.key,
        value: flag.defaultValue,
        reason: StandardResolutionReasons.STATIC,
      };
    });
  }
  async function getFlagValue(
    key: string,
    defaultValue: FlagValue,
    context?: EvaluationContext,
  ): Promise<FlagValue> {
    try {
      const result = await evaluate(key, context);

      return result.value ?? defaultValue;
    } catch (e) {
      if (e instanceof FlagNotFoundError) return defaultValue;
      throw e;
    }
  }

  async function getFlag(key: string): Promise<Flag> {
    const flag = await store.getFlag(key);

    if (!flag) throw new NotFoundError(`Flag '${key}' not found`);

    return { key: flag.key, defaultValue: flag.defaultValue };
  }

  async function listFlags(): Promise<Flag[]> {
    return store.listFlags();
  }

  async function createFlag(flag: Flag): Promise<void> {
    const result = flagSchema.safeParse(flag);
    if (!result.success) {
      throw new ValidationError(formatZodError(result.error));
    }

    await store.createFlag(result.data as Flag);
    await store.incrementConfigVersion();
  }

  async function updateFlag(
    key: string,
    flag: UpdateFlagParams,
  ): Promise<void> {
    const result = updateFlagSchema.safeParse(flag);
    if (!result.success) {
      throw new ValidationError(formatZodError(result.error));
    }

    const updated = await store.updateFlag(key, result.data);

    if (!updated) throw new NotFoundError();

    await store.incrementConfigVersion();
  }

  async function deleteFlag(key: string): Promise<void> {
    const deleted = await store.deleteFlag(key);

    if (!deleted) throw new NotFoundError();

    await store.incrementConfigVersion();
  }

  async function listOverrides(): Promise<Override[]> {
    return store.listOverrides();
  }

  async function getFlagOverrides(flagKey: string) {
    return store.getFlagOverrides(flagKey);
  }

  async function getUserOverrides(
    targetingKey: string,
  ): Promise<UserOverride[]> {
    return store.getUserOverrides(targetingKey);
  }

  async function getUserOverride(targetingKey: string, flagKey: string) {
    const override = await store.getUserOverride(targetingKey, flagKey);

    if (!override)
      throw new NotFoundError(
        `Override not found for user '${targetingKey}' on flag '${flagKey}'`,
      );

    return override;
  }

  async function setUserOverride(
    targetingKey: string,
    flagKey: string,
    value: FlagValue,
  ): Promise<void> {
    if (!targetingKey) {
      throw new ValidationError("Targeting key is required");
    }
    if (!flagKey) {
      throw new ValidationError("Flag key is required");
    }
    const result = flagValueSchema.safeParse(value);
    if (!result.success) {
      throw new ValidationError(formatZodError(result.error));
    }
    await store.setUserOverride(targetingKey, flagKey, result.data);
    await store.incrementConfigVersion();
  }

  async function deleteUserOverride(
    targetingKey: string,
    flagKey: string,
  ): Promise<void> {
    const deleted = await store.deleteUserOverride(targetingKey, flagKey);

    if (!deleted)
      throw new NotFoundError(
        `Override not found for user '${targetingKey}' on flag '${flagKey}'`,
      );

    await store.incrementConfigVersion();
  }

  async function listSegmentOverrides(): Promise<SegmentOverride[]> {
    return store.listSegmentOverrides();
  }

  async function getSegmentOverrides(
    segmentKey: string,
  ): Promise<SegmentOverride[]> {
    return store.getSegmentOverrides(segmentKey);
  }

  async function setSegmentOverride(
    segmentKey: string,
    flagKey: string,
    value: FlagValue,
  ): Promise<void> {
    if (!segmentKey) {
      throw new ValidationError("Segment key is required");
    }
    if (!flagKey) {
      throw new ValidationError("Flag key is required");
    }
    const result = flagValueSchema.safeParse(value);
    if (!result.success) {
      throw new ValidationError(formatZodError(result.error));
    }
    await store.setSegmentOverride(segmentKey, flagKey, result.data);
    await store.incrementConfigVersion();
  }

  async function deleteSegmentOverride(
    segmentKey: string,
    flagKey: string,
  ): Promise<boolean> {
    const deleted = await store.deleteSegmentOverride(segmentKey, flagKey);

    if (!deleted)
      throw new NotFoundError(
        `Override not found for segment '${segmentKey}' on flag '${flagKey}'`,
      );

    await store.incrementConfigVersion();

    return deleted;
  }

  async function listSegments(): Promise<Segment[]> {
    const segments = await store.listSegments();

    return segments.map((segment, i) => ({
      ...segment,
      priority: i,
    }));
  }

  async function createSegment(params: CreateSegmentParams): Promise<void> {
    const result = segmentSchema.safeParse(params);
    if (!result.success) {
      throw new ValidationError(formatZodError(result.error));
    }

    await store.createSegment({
      ...result.data,
      priority: await getSegmentPriority(store, result.data.priority),
    });

    await store.incrementConfigVersion();
  }

  async function updateSegment(
    key: string,
    segment: UpdateSegmentParams,
  ): Promise<boolean> {
    const result = updateSegmentSchema.safeParse(segment);
    if (!result.success) {
      throw new ValidationError(formatZodError(result.error));
    }
    const payload =
      result.data.priority !== undefined
        ? {
            ...result.data,
            priority: await getSegmentPriority(store, result.data.priority),
          }
        : result.data;

    const updated = await store.updateSegment(key, payload);

    if (!updated) throw new NotFoundError();

    await store.incrementConfigVersion();

    return updated;
  }

  async function deleteSegment(key: string): Promise<boolean> {
    const deleted = await store.deleteSegment(key);

    if (!deleted) throw new NotFoundError();

    await store.incrementConfigVersion();

    return deleted;
  }

  const http: LibreFlagHttpMethods = {
    evaluate: async (flagKey, body) => {
      try {
        const result = await evaluate(flagKey, body?.context);

        return { status: 200, body: result };
      } catch (e) {
        return handleError(e, { key: flagKey });
      }
    },
    evaluateAll: async (body, ifNoneMatch) => {
      try {
        const version = await store.getConfigVersion();
        const etag = hashContext(body?.context, version);

        if (ifNoneMatch === etag) {
          return { status: 304, etag };
        }

        const results = await evaluateAll(body?.context);

        return { status: 200, body: { flags: results }, etag };
      } catch (e) {
        return handleError(e);
      }
    },

    getFlag: async (key) => {
      try {
        const flag = await getFlag(key);

        return { status: 200, body: flag };
      } catch (e) {
        return handleError(e);
      }
    },
    listFlags: async () => {
      try {
        const flags = await listFlags();

        return { status: 200, body: flags };
      } catch (e) {
        return handleError(e);
      }
    },
    createFlag: async (flag) => {
      try {
        await createFlag(flag);

        return { status: 201 };
      } catch (e) {
        return handleError(e);
      }
    },
    updateFlag: async (key, flag) => {
      try {
        await updateFlag(key, flag);

        return { status: 200 };
      } catch (e) {
        return handleError(e);
      }
    },
    deleteFlag: async (key) => {
      try {
        await deleteFlag(key);

        return { status: 204 };
      } catch (e) {
        return handleError(e);
      }
    },

    listOverrides: async () => {
      try {
        const overrides = await listOverrides();

        return { status: 200, body: overrides };
      } catch (e) {
        return handleError(e);
      }
    },
    getFlagOverrides: async (flagKey) => {
      try {
        const overrides = await getFlagOverrides(flagKey);

        return { status: 200, body: overrides };
      } catch (e) {
        return handleError(e);
      }
    },
    getUserOverrides: async (targetingKey) => {
      try {
        const overrides = await getUserOverrides(targetingKey);

        return { status: 200, body: overrides };
      } catch (e) {
        return handleError(e);
      }
    },
    setUserOverride: async (targetingKey, flagKey, value) => {
      try {
        await setUserOverride(targetingKey, flagKey, value);

        return { status: 200 };
      } catch (e) {
        return handleError(e);
      }
    },
    deleteUserOverride: async (targetingKey, flagKey) => {
      try {
        await deleteUserOverride(targetingKey, flagKey);

        return { status: 204 };
      } catch (e) {
        return handleError(e);
      }
    },
    getSegmentOverrides: async (segmentKey) => {
      try {
        const overrides = await getSegmentOverrides(segmentKey);

        return { status: 200, body: overrides };
      } catch (e) {
        return handleError(e);
      }
    },
    setSegmentOverride: async (segmentKey, flagKey, value) => {
      try {
        await setSegmentOverride(segmentKey, flagKey, value);

        return { status: 200 };
      } catch (e) {
        return handleError(e);
      }
    },
    deleteSegmentOverride: async (segmentKey, flagKey) => {
      try {
        await deleteSegmentOverride(segmentKey, flagKey);

        return { status: 204 };
      } catch (e) {
        return handleError(e);
      }
    },

    listSegments: async () => {
      try {
        const segments = await listSegments();

        return { status: 200, body: segments };
      } catch (e) {
        return handleError(e);
      }
    },
    createSegment: async (segment) => {
      try {
        await createSegment(segment);

        return { status: 201 };
      } catch (e) {
        return handleError(e);
      }
    },
    updateSegment: async (key, segment) => {
      try {
        await updateSegment(key, segment);

        return { status: 200 };
      } catch (e) {
        return handleError(e);
      }
    },
    deleteSegment: async (key) => {
      try {
        await deleteSegment(key);

        return { status: 204 };
      } catch (e) {
        return handleError(e);
      }
    },
  };

  return {
    evaluate,
    evaluateAll,
    getFlagValue,
    getFlag,
    listFlags,
    createFlag,
    updateFlag,
    deleteFlag,
    listOverrides,
    getFlagOverrides,
    getUserOverrides,
    getUserOverride,
    setUserOverride,
    deleteUserOverride,
    listSegmentOverrides,
    getSegmentOverrides,
    setSegmentOverride,
    deleteSegmentOverride,
    listSegments,
    createSegment,
    updateSegment,
    deleteSegment,
    http,
  };
}
