import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { flagsTable } from "../db/schema.js";
import { isUniqueViolation, toFlag } from "../utils.js";
import { ConflictError, type Flag, type UpdateFlagParams } from "rolloutjs";

export function createFlagStore(db: NodePgDatabase) {
  return {
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
        if (isUniqueViolation(e)) {
          throw new ConflictError(`Flag '${flag.key}' already exists`);
        }
        throw e;
      }
    },
    updateFlag: async (key: string, params: UpdateFlagParams) => {
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
  };
}
