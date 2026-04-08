import type { Store } from "../types/store.js";
import type {
  CreateSegmentParams,
  Segment,
  UpdateSegmentParams,
} from "../types/segments.js";
import { segmentSchema, updateSegmentSchema } from "../schemas/segments.js";
import { formatZodError } from "../utils/api.js";
import { getSegmentPriority } from "../utils/segments.js";
import { NotFoundError, ValidationError } from "../errors.js";

export function createSegmentService(store: Store) {
  return {
    listSegments: async (): Promise<Segment[]> => {
      const segments = await store.listSegments();

      return segments.map((segment, i) => ({
        ...segment,
        priority: i,
      }));
    },

    createSegment: async (params: CreateSegmentParams): Promise<void> => {
      const result = segmentSchema.safeParse(params);

      if (!result.success) {
        throw new ValidationError(formatZodError(result.error));
      }

      await store.transaction(async (tx) => {
        await tx.createSegment({
          ...result.data,
          priority: await getSegmentPriority(tx, result.data.priority),
        });

        await tx.incrementConfigVersion();
      });
    },

    updateSegment: async (
      key: string,
      segment: UpdateSegmentParams,
    ): Promise<void> => {
      const result = updateSegmentSchema.safeParse(segment);

      if (!result.success) {
        throw new ValidationError(formatZodError(result.error));
      }

      await store.transaction(async (tx) => {
        const payload =
          result.data.priority !== undefined
            ? {
                ...result.data,
                priority: await getSegmentPriority(tx, result.data.priority),
              }
            : result.data;

        const updated = await tx.updateSegment(key, payload);

        if (!updated) throw new NotFoundError();

        await tx.incrementConfigVersion();
      });
    },

    deleteSegment: async (key: string): Promise<void> => {
      await store.transaction(async (tx) => {
        const deleted = await tx.deleteSegment(key);

        if (!deleted) throw new NotFoundError();

        await tx.incrementConfigVersion();
      });
    },
  };
}
