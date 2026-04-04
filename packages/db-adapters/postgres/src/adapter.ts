import type { FlagValue, LibreFlagStore, Flag, Segment } from "libreflag";
import { ConflictError } from "libreflag";
import {
  configTable,
  flagsTable,
  overridesTable,
  segmentsTable,
} from "./db/schema.js";
import { and, eq, isNotNull, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import {
  ADVISORY_LOCK_ID,
  MIGRATIONS_DIR,
  MIGRATIONS_SCHEMA,
  MIGRATIONS_TABLE,
} from "./db/constants.js";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import {
  toFlag,
  toOverride,
  toSegment,
  toSegmentOverride,
  toUserOverride,
} from "./utils.js";

export function PostgresAdapter(dbUrl: string): LibreFlagStore {
  const db = drizzle(dbUrl);

  return {
    getConfigVersion: async () => {
      const [row] = await db
        .select()
        .from(configTable)
        .where(eq(configTable.id, 1));

      return row?.version ?? 0;
    },
    incrementConfigVersion: async () => {
      await db
        .update(configTable)
        .set({ version: sql`${configTable.version} + 1` })
        .where(eq(configTable.id, 1));
    },

    listFlags: async () => {
      const flags = await db.select().from(flagsTable);

      return flags.map(toFlag);
    },
    getFlag: async (key: string) => {
      const [row] = await db
        .select()
        .from(flagsTable)
        .where(eq(flagsTable.key, key));

      return row ? toFlag(row) : null;
    },
    createFlag: async (flag: Flag) => {
      try {
        await db.insert(flagsTable).values({
          name: flag.name,
          description: flag.description,
          key: flag.key,
          default_value: flag.defaultValue,
        });
      } catch (e) {
        if (e instanceof Error && "code" in e && e.code === "23505") {
          throw new ConflictError(`Flag '${flag.key}' already exists`);
        }
        throw e;
      }
    },
    updateFlag: async (key, params) => {
      const result = await db
        .update(flagsTable)
        .set({
          ...(params.name !== undefined && { name: params.name }),
          ...(params.description !== undefined && {
            description: params.description,
          }),
          ...(params.defaultValue !== undefined && {
            default_value: params.defaultValue,
          }),
        })
        .where(eq(flagsTable.key, key))
        .returning();

      return result.length > 0;
    },
    deleteFlag: async (key: string) => {
      const result = await db
        .delete(flagsTable)
        .where(eq(flagsTable.key, key))
        .returning();

      return result.length > 0;
    },

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
      await db
        .insert(overridesTable)
        .values({
          flag_key: flagKey,
          targeting_key: targetingKey,
          segment_key: null,
          value,
        })
        .onConflictDoUpdate({
          target: [overridesTable.targeting_key, overridesTable.flag_key],
          set: { value },
        });
    },
    deleteUserOverride: async (targetingKey: string, flagKey: string) => {
      const result = await db
        .delete(overridesTable)
        .where(
          and(
            eq(overridesTable.flag_key, flagKey),
            eq(overridesTable.targeting_key, targetingKey),
          ),
        )
        .returning();

      return result.length > 0;
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
      await db
        .insert(overridesTable)
        .values({
          flag_key: flagKey,
          targeting_key: null,
          segment_key: segmentKey,
          value,
        })
        .onConflictDoUpdate({
          target: [overridesTable.segment_key, overridesTable.flag_key],
          set: { value },
        });
    },
    deleteSegmentOverride: async (segmentKey: string, flagKey: string) => {
      const result = await db
        .delete(overridesTable)
        .where(
          and(
            eq(overridesTable.flag_key, flagKey),
            eq(overridesTable.segment_key, segmentKey),
          ),
        )
        .returning();

      return result.length > 0;
    },

    listSegments: async () => {
      const segments = await db.select().from(segmentsTable);

      return segments.map(toSegment);
    },
    createSegment: async (segment: Segment) => {
      try {
        await db.insert(segmentsTable).values({
          key: segment.key,
          name: segment.name,
          description: segment.description,
          rules: segment.rules,
        });
      } catch (e) {
        if (e instanceof Error && "code" in e && e.code === "23505") {
          throw new ConflictError(`Segment '${segment.key}' already exists`);
        }
        throw e;
      }
    },
    updateSegment: async (key, params) => {
      const result = await db
        .update(segmentsTable)
        .set({
          ...(params.name !== undefined && { name: params.name }),
          ...(params.description !== undefined && {
            description: params.description,
          }),
          ...(params.rules !== undefined && { rules: params.rules }),
        })
        .where(eq(segmentsTable.key, key))
        .returning();

      return result.length > 0;
    },
    deleteSegment: async (key: string) => {
      const result = await db
        .delete(segmentsTable)
        .where(eq(segmentsTable.key, key))
        .returning();

      return result.length > 0;
    },

    migrate: async () => {
      await db.execute(sql`SELECT pg_advisory_lock(${ADVISORY_LOCK_ID})`);
      try {
        await migrate(db, {
          migrationsFolder: MIGRATIONS_DIR,
          migrationsSchema: MIGRATIONS_SCHEMA,
          migrationsTable: MIGRATIONS_TABLE,
        });
      } finally {
        await db.execute(sql`SELECT pg_advisory_unlock(${ADVISORY_LOCK_ID})`);
      }
    },
  };
}
