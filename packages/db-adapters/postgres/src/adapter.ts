import { FlagAlreadyExistsError, UserAlreadyExistsError } from "libreflag";
import type {
  FlagValue,
  LibreFlagStore,
  StoredFlag,
  StoredUser,
  StoredUserOverride,
} from "libreflag";
import { flagsTable, userOverridesTable, usersTable } from "./db/schema.js";
import { and, eq, sql } from "drizzle-orm";
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

function toStoredUser(user: typeof usersTable.$inferSelect): StoredUser {
  return {
    key: user.key,
    attributes: (user.attributes ?? {}) as Record<string, unknown>,
  };
}

function toStoredUserOverride(
  row: typeof userOverridesTable.$inferSelect,
): StoredUserOverride {
  return {
    userKey: row.user_key,
    flagKey: row.flag_key,
    value: row.value as FlagValue,
  };
}

export function PostgresAdapter(dbUrl: string): LibreFlagStore {
  const db = drizzle(dbUrl);

  return {
    getAllFlags: async () => {
      const flags = await db.select().from(flagsTable);

      return flags.map(toStoredFlag);
    },
    getFlag: async (key: string) => {
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

    getAllUsers: async () => {
      const users = await db.select().from(usersTable);

      return users.map(toStoredUser);
    },
    getUser: async (key: string) => {
      const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.key, key));

      return user ? toStoredUser(user) : null;
    },
    createUser: async (user: StoredUser) => {
      try {
        const [created] = await db
          .insert(usersTable)
          .values({ key: user.key, attributes: user.attributes })
          .returning();

        return toStoredUser(created);
      } catch (error: unknown) {
        if (
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          error.code === "23505"
        ) {
          throw new UserAlreadyExistsError(user.key);
        }
        throw error;
      }
    },
    updateUser: async (key: string, user: Partial<StoredUser>) => {
      const [updated] = await db
        .update(usersTable)
        .set({
          ...(user.key !== undefined && { key: user.key }),
          ...(user.attributes !== undefined && {
            attributes: user.attributes,
          }),
        })
        .where(eq(usersTable.key, key))
        .returning();

      return updated ? toStoredUser(updated) : null;
    },
    deleteUser: async (key: string) => {
      const result = await db
        .delete(usersTable)
        .where(eq(usersTable.key, key))
        .returning();

      return result.length > 0;
    },
    upsertUser: async (user: StoredUser) => {
      const [upserted] = await db
        .insert(usersTable)
        .values({ key: user.key, attributes: user.attributes })
        .onConflictDoUpdate({
          target: usersTable.key,
          set: { attributes: user.attributes },
        })
        .returning();

      return toStoredUser(upserted);
    },

    getUserOverrides: async (userKey: string) => {
      const overrides = await db
        .select()
        .from(userOverridesTable)
        .where(eq(userOverridesTable.user_key, userKey));

      return overrides.map(toStoredUserOverride);
    },
    getUserOverride: async (userKey: string, flagKey: string) => {
      const [override] = await db
        .select()
        .from(userOverridesTable)
        .where(
          and(
            eq(userOverridesTable.user_key, userKey),
            eq(userOverridesTable.flag_key, flagKey),
          ),
        );

      return override ? toStoredUserOverride(override) : null;
    },
    setUserOverride: async (override: StoredUserOverride) => {
      const [upserted] = await db
        .insert(userOverridesTable)
        .values({
          user_key: override.userKey,
          flag_key: override.flagKey,
          value: override.value,
        })
        .onConflictDoUpdate({
          target: [userOverridesTable.user_key, userOverridesTable.flag_key],
          set: { value: override.value },
        })
        .returning();

      return toStoredUserOverride(upserted);
    },
    deleteUserOverride: async (userKey: string, flagKey: string) => {
      const result = await db
        .delete(userOverridesTable)
        .where(
          and(
            eq(userOverridesTable.user_key, userKey),
            eq(userOverridesTable.flag_key, flagKey),
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
