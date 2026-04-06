import type { MySql2Database } from "drizzle-orm/mysql2";
import { eq, sql } from "drizzle-orm";
import { configTable } from "../db/schema.js";

export function createConfigStore(db: MySql2Database) {
  return {
    getConfigVersion: async () => {
      const [rows] = await db
        .select()
        .from(configTable)
        .where(eq(configTable.id, 1));

      return rows?.version ?? 0;
    },
    incrementConfigVersion: async () => {
      await db
        .update(configTable)
        .set({ version: sql`${configTable.version} + 1` })
        .where(eq(configTable.id, 1));
    },
  };
}
