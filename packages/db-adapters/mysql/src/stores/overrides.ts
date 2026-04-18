import type { MySql2Database } from "drizzle-orm/mysql2";
import { eq, isNotNull, and } from "drizzle-orm";
import { overridesTable } from "../db/schema.js";
import {
  isForeignKeyViolation,
  toOverride,
  toSegmentOverride,
  toUserOverride,
} from "../utils.js";
import { NotFoundError, type FlagValue } from "rolloutjs";

export function createOverrideStore(db: MySql2Database) {
  return {
    listOverrides: async () => {
      const overrides = await db.select().from(overridesTable);

      return overrides.map(toOverride);
    },
    getFlagOverrides: async (flagKey: string) => {
      const overrides = await db
        .select()
        .from(overridesTable)
        .where(eq(overridesTable.flag_key, flagKey));

      return overrides.map(toOverride);
    },
    getUserOverrides: async (targetingKey: string) => {
      const overrides = await db
        .select()
        .from(overridesTable)
        .where(eq(overridesTable.targeting_key, targetingKey));

      return overrides.map(toUserOverride);
    },
    getUserOverride: async (targetingKey: string, flagKey: string) => {
      const [override] = await db
        .select()
        .from(overridesTable)
        .where(
          and(
            eq(overridesTable.flag_key, flagKey),
            eq(overridesTable.targeting_key, targetingKey),
          ),
        );

      return override ? toUserOverride(override) : null;
    },
    setUserOverride: async (
      targetingKey: string,
      flagKey: string,
      value: FlagValue,
    ) => {
      try {
        await db
          .insert(overridesTable)
          .values({
            flag_key: flagKey,
            targeting_key: targetingKey,
            segment_key: null,
            value,
          })
          .onDuplicateKeyUpdate({
            set: { value },
          });
      } catch (e) {
        if (isForeignKeyViolation(e)) {
          throw new NotFoundError(`Flag '${flagKey}' not found`);
        }
        throw e;
      }
    },
    deleteUserOverride: async (targetingKey: string, flagKey: string) => {
      const result = await db
        .delete(overridesTable)
        .where(
          and(
            eq(overridesTable.flag_key, flagKey),
            eq(overridesTable.targeting_key, targetingKey),
          ),
        );

      return result[0].affectedRows > 0;
    },
    listSegmentOverrides: async () => {
      const overrides = await db
        .select()
        .from(overridesTable)
        .where(isNotNull(overridesTable.segment_key));

      return overrides.map(toSegmentOverride);
    },
    getSegmentOverrides: async (segmentKey: string) => {
      const overrides = await db
        .select()
        .from(overridesTable)
        .where(eq(overridesTable.segment_key, segmentKey));

      return overrides.map(toSegmentOverride);
    },
    getSegmentOverridesForFlag: async (flagKey: string) => {
      const overrides = await db
        .select()
        .from(overridesTable)
        .where(
          and(
            eq(overridesTable.flag_key, flagKey),
            isNotNull(overridesTable.segment_key),
          ),
        );

      return overrides.map(toSegmentOverride);
    },
    setSegmentOverride: async (
      segmentKey: string,
      flagKey: string,
      value: FlagValue,
    ) => {
      try {
        await db
          .insert(overridesTable)
          .values({
            flag_key: flagKey,
            targeting_key: null,
            segment_key: segmentKey,
            value,
          })
          .onDuplicateKeyUpdate({
            set: { value },
          });
      } catch (e) {
        if (isForeignKeyViolation(e)) {
          throw new NotFoundError(
            `Segment '${segmentKey}' or flag '${flagKey}' not found`,
          );
        }
        throw e;
      }
    },
    deleteSegmentOverride: async (segmentKey: string, flagKey: string) => {
      const result = await db
        .delete(overridesTable)
        .where(
          and(
            eq(overridesTable.flag_key, flagKey),
            eq(overridesTable.segment_key, segmentKey),
          ),
        );

      return result[0].affectedRows > 0;
    },
  };
}
