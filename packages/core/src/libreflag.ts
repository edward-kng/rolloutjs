import type { EvaluationContext, FlagValue } from "@openfeature/core";
import {
  FlagNotFoundError,
  StandardResolutionReasons,
} from "@openfeature/core";
import type { EvaluationResult } from "./types/ofrep.js";
import type { Flag, Override, UpdateFlagParams } from "./types/api.js";
import type { LibreFlagStore } from "./types/store.js";
import type { LibreFlagHttpMethods, LibreFlagServer } from "./types/server.js";
import { handleError } from "./utils/api.js";
import { hashContext } from "./utils/hash.js";
import { NotFoundError } from "./errors.js";

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

    const flag = await store.getFlag(flagKey);

    if (flag) {
      return {
        key: flag.key,
        value: flag.defaultValue,
        reason: StandardResolutionReasons.STATIC,
      };
    }

    throw new FlagNotFoundError();
  }

  async function evaluateAll(
    context: EvaluationContext = {},
  ): Promise<EvaluationResult[]> {
    const flags = await store.getFlags();
    const { targetingKey } = context;
    const overrides = targetingKey
      ? await store.getUserOverrides(targetingKey)
      : [];

    return flags.map((flag) => {
      const override = overrides.find(
        (override) => override.flagKey === flag.key,
      );

      if (override) {
        return {
          key: flag.key,
          value: override.value,
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
    } catch {
      return defaultValue;
    }
  }

  async function getFlag(key: string): Promise<Flag> {
    const flag = await store.getFlag(key);

    if (!flag) throw new NotFoundError();

    return { key: flag.key, defaultValue: flag.defaultValue };
  }

  async function getFlags(): Promise<Flag[]> {
    return store.getFlags();
  }

  async function createFlag(flag: Flag): Promise<void> {
    await store.createFlag(flag);
    await store.incrementConfigVersion();
  }

  async function updateFlag(
    key: string,
    flag: UpdateFlagParams,
  ): Promise<void> {
    const updated = await store.updateFlag(key, flag);

    if (!updated) throw new FlagNotFoundError(key);

    await store.incrementConfigVersion();
  }

  async function deleteFlag(key: string): Promise<void> {
    const deleted = await store.deleteFlag(key);

    if (!deleted) throw new FlagNotFoundError(key);

    await store.incrementConfigVersion();
  }

  async function listOverrides(): Promise<Override[]> {
    return store.listOverrides();
  }

  async function getFlagOverrides(flagKey: string) {
    return store.getFlagOverrides(flagKey);
  }

  async function getUserOverrides(targetingKey: string): Promise<Override[]> {
    return store.getUserOverrides(targetingKey);
  }

  async function getUserOverride(targetingKey: string, flagKey: string) {
    const override = await store.getUserOverride(targetingKey, flagKey);

    if (!override) throw new NotFoundError();

    return override;
  }

  async function setUserOverride(
    targetingKey: string,
    flagKey: string,
    value: FlagValue,
  ): Promise<void> {
    await store.setUserOverride(targetingKey, flagKey, value);
    await store.incrementConfigVersion();
  }

  async function deleteUserOverride(
    targetingKey: string,
    flagKey: string,
  ): Promise<void> {
    const deleted = await store.deleteUserOverride(targetingKey, flagKey);

    if (!deleted) throw new NotFoundError();

    await store.incrementConfigVersion();
  }

  function getHttpMethods(): LibreFlagHttpMethods {
    return {
      evaluate: async (key, body) => {
        try {
          const result = await evaluate(key, body?.context);

          return { status: 200, body: result };
        } catch (e) {
          return handleError(e);
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
      getFlags: async () => {
        try {
          const flags = await getFlags();

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
    };
  }

  return {
    evaluate,
    evaluateAll,
    getFlagValue,
    getFlag,
    getFlags,
    createFlag,
    updateFlag,
    deleteFlag,
    listOverrides,
    getFlagOverrides,
    getUserOverrides,
    getUserOverride,
    setUserOverride,
    deleteUserOverride,
    getHttpMethods,
  };
}
