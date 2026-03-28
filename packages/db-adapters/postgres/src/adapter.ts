import { FlagAlreadyExistsError } from "libreflag";
import type { FlagValue, LibreFlagStore, StoredFlag } from "libreflag";
import { flagsTable } from "./db/schema.js";
import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import {
  ADVISORY_LOCK_ID,
  MIGRATIONS_DIR,
  MIGRATIONS_SCHEMA,
  MIGRATIONS_TABLE,
} from "./db/constants.js";
import { migrate } from "drizzle-orm/node-postgres/migrator";

function toStoredFlag(flag: typeof flagsTable.$inferSelect): StoredFlag {
  return {
    key: flag.key,
    defaultValue: flag.default_value as FlagValue,
  };
}

export function PostgresAdapter(dbUrl: string): LibreFlagStore {
  const db = drizzle(dbUrl);

  return {
    getAllFlags: async () => {
      const flags = await db.select().from(flagsTable);

      return flags.map(toStoredFlag);
    },
    getFlagByKey: async (key: string) => {
      const [flag] = await db
        .select()
        .from(flagsTable)
        .where(eq(flagsTable.key, key));

      return flag ? toStoredFlag(flag) : null;
    },
    createFlag: async (flag: StoredFlag) => {
      try {
        const [created] = await db
          .insert(flagsTable)
          .values({ key: flag.key, default_value: flag.defaultValue })
          .returning();

        return toStoredFlag(created);
      } catch (error: unknown) {
        if (
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          error.code === "23505"
        ) {
          throw new FlagAlreadyExistsError(flag.key);
        }
        throw error;
      }
    },
    updateFlag: async (key: string, flag: Partial<StoredFlag>) => {
      const [updated] = await db
        .update(flagsTable)
        .set({
          ...(flag.key !== undefined && { key: flag.key }),
          ...(flag.defaultValue !== undefined && {
            default_value: flag.defaultValue,
          }),
        })
        .where(eq(flagsTable.key, key))
        .returning();

      return updated ? toStoredFlag(updated) : null;
    },
    deleteFlag: async (key: string) => {
      const result = await db
        .delete(flagsTable)
        .where(eq(flagsTable.key, key))
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
