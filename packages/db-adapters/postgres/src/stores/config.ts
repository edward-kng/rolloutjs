import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { eq, sql } from "drizzle-orm";
import { configTable } from "../db/schema.js";

export function createConfigStore(db: NodePgDatabase) {
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
  };
}
