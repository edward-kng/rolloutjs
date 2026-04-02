import type { FlagValue, LibreFlagStore, StoredFlag } from "libreflag";
import { configTable, flagsTable, overridesTable } from "./db/schema.js";
import { and, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import {
  ADVISORY_LOCK_ID,
  MIGRATIONS_DIR,
  MIGRATIONS_SCHEMA,
  MIGRATIONS_TABLE,
} from "./db/constants.js";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { toStoredFlag, toStoredOverride } from "./utils.js";

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

    getFlags: async () => {
      const flags = await db.select().from(flagsTable);

      return flags.map(toStoredFlag);
    },
    getFlag: async (key: string) => {
      const [row] = await db
        .select()
        .from(flagsTable)
        .where(eq(flagsTable.key, key));

      return row ? toStoredFlag(row) : null;
    },
    createFlag: async (flag: StoredFlag) => {
      await db
        .insert(flagsTable)
        .values({ key: flag.key, default_value: flag.defaultValue });
    },
    updateFlag: async (key, params) => {
      const result = await db
        .update(flagsTable)
        .set({
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

    getFlagOverrides: async (flagKey: string) => {
      const overrides = await db
        .select()
        .from(overridesTable)
        .where(eq(overridesTable.flag_key, flagKey));

      return overrides.map(toStoredOverride);
    },
    getUserOverrides: async (targetingKey: string) => {
      const overrides = await db
        .select()
        .from(overridesTable)
        .where(eq(overridesTable.targeting_key, targetingKey));

      return overrides.map(toStoredOverride);
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

      return override ? toStoredOverride(override) : null;
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
