import type { EvaluationContext, FlagValue } from "@openfeature/core";
import {
  FlagNotFoundError,
  StandardResolutionReasons,
} from "@openfeature/core";
import type { EvaluationResult } from "../types/ofrep.js";
import type { Store } from "../types/store.js";
import { isMember } from "../utils/segments.js";

export function createEvaluationService(store: Store) {
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

  return {
    evaluate,
    evaluateAll,
    getFlagValue,
  };
}
