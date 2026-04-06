import type { MySql2Database } from "drizzle-orm/mysql2";
import { DrizzleQueryError, eq, max } from "drizzle-orm";
import { segmentsTable } from "../db/schema.js";
import {
  ConflictError,
  type Segment,
  type UpdateSegmentParams,
} from "libreflag";
import { toSegment } from "../utils.js";

export function createSegmentStore(db: MySql2Database) {
  return {
    listSegments: async () => {
      const segments = await db
        .select()
        .from(segmentsTable)
        .orderBy(segmentsTable.priority);

      return segments.map(toSegment);
    },
    createSegment: async (segment: Segment) => {
      try {
        await db.insert(segmentsTable).values({
          key: segment.key,
          name: segment.name,
          description: segment.description,
          rules: segment.rules,
          priority: segment.priority,
        });
      } catch (e) {
        if (
          e instanceof DrizzleQueryError &&
          e.cause &&
          "code" in e.cause &&
          e.cause.code === "ER_DUP_ENTRY"
        ) {
          throw new ConflictError(`Segment '${segment.key}' already exists`);
        }

        throw e;
      }
    },
    updateSegment: async (key: string, params: UpdateSegmentParams) => {
      const result = await db
        .update(segmentsTable)
        .set({
          ...(params.name !== undefined && { name: params.name }),
          ...(params.description !== undefined && {
            description: params.description,
          }),
          ...(params.rules !== undefined && { rules: params.rules }),
          ...(params.priority !== undefined && { priority: params.priority }),
        })
        .where(eq(segmentsTable.key, key));

      return result[0].affectedRows > 0;
    },
    deleteSegment: async (key: string) => {
      const result = await db
        .delete(segmentsTable)
        .where(eq(segmentsTable.key, key));

      return result[0].affectedRows > 0;
    },
    getMaxSegmentPriority: async () => {
      const result = await db
        .select({
          priority: max(segmentsTable.priority),
        })
        .from(segmentsTable);

      return result.length > 0 ? result[0].priority : null;
    },
    getSegmentPriorityByIndex: async (index: number) => {
      const result = await db
        .select({
          priority: segmentsTable.priority,
        })
        .from(segmentsTable)
        .orderBy(segmentsTable.priority)
        .offset(index)
        .limit(1);

      return result.length > 0 ? result[0].priority : null;
    },
  };
}
