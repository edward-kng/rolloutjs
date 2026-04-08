import type { FlagValue } from "@openfeature/core";
import type { Store } from "../types/store.js";
import type {
  Override,
  SegmentOverride,
  UserOverride,
} from "../types/overrides.js";
import { flagValueSchema } from "../schemas/flags.js";
import { formatZodError } from "../utils/api.js";
import { NotFoundError, ValidationError } from "../errors.js";

export function createOverrideService(store: Store) {
  return {
    listOverrides: async (): Promise<Override[]> => {
      return store.listOverrides();
    },

    getFlagOverrides: async (flagKey: string) => {
      return store.getFlagOverrides(flagKey);
    },

    getUserOverrides: async (targetingKey: string): Promise<UserOverride[]> => {
      return store.getUserOverrides(targetingKey);
    },

    getUserOverride: async (targetingKey: string, flagKey: string) => {
      const override = await store.getUserOverride(targetingKey, flagKey);

      if (!override)
        throw new NotFoundError(
          `Override not found for user '${targetingKey}' on flag '${flagKey}'`,
        );

      return override;
    },

    setUserOverride: async (
      targetingKey: string,
      flagKey: string,
      value: FlagValue,
    ): Promise<void> => {
      const result = flagValueSchema.safeParse(value);

      if (!result.success) {
        throw new ValidationError(formatZodError(result.error));
      }
      await store.transaction(async (tx) => {
        await tx.setUserOverride(targetingKey, flagKey, result.data);
        await tx.incrementConfigVersion();
      });
    },

    deleteUserOverride: async (
      targetingKey: string,
      flagKey: string,
    ): Promise<void> => {
      await store.transaction(async (tx) => {
        const deleted = await tx.deleteUserOverride(targetingKey, flagKey);

        if (!deleted)
          throw new NotFoundError(
            `Override not found for user '${targetingKey}' on flag '${flagKey}'`,
          );

        await tx.incrementConfigVersion();
      });
    },

    listSegmentOverrides: async (): Promise<SegmentOverride[]> => {
      return store.listSegmentOverrides();
    },

    getSegmentOverrides: async (
      segmentKey: string,
    ): Promise<SegmentOverride[]> => {
      return store.getSegmentOverrides(segmentKey);
    },

    setSegmentOverride: async (
      segmentKey: string,
      flagKey: string,
      value: FlagValue,
    ): Promise<void> => {
      const result = flagValueSchema.safeParse(value);

      if (!result.success) {
        throw new ValidationError(formatZodError(result.error));
      }
      await store.transaction(async (tx) => {
        await tx.setSegmentOverride(segmentKey, flagKey, result.data);
        await tx.incrementConfigVersion();
      });
    },

    deleteSegmentOverride: async (
      segmentKey: string,
      flagKey: string,
    ): Promise<void> => {
      await store.transaction(async (tx) => {
        const deleted = await tx.deleteSegmentOverride(segmentKey, flagKey);

        if (!deleted)
          throw new NotFoundError(
            `Override not found for segment '${segmentKey}' on flag '${flagKey}'`,
          );

        await tx.incrementConfigVersion();
      });
    },
  };
}
