import type { FlagStore, FlagValue } from "libreflag";
import { flagsTable } from "./db/schema.js";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";

export function PostgresAdapter(dbUrl: string): FlagStore {
  const db = drizzle(dbUrl);

  return {
    getAllFlags: async () => {
      const flags = await db.select().from(flagsTable);

      return flags.map((flag) => ({
        key: flag.key,
        defaultValue: flag.default_value as FlagValue,
      }));
    },
    getFlagByKey: async (key: string) => {
      const [flag] = await db
        .select()
        .from(flagsTable)
        .where(eq(flagsTable.key, key));

      return flag
        ? {
            key: flag.key,
            defaultValue: flag.default_value as FlagValue,
          }
        : null;
    },
  };
}
