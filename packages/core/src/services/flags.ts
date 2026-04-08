import type { Store } from "../types/store.js";
import type { Flag, UpdateFlagParams } from "../types/flags.js";
import { flagSchema, updateFlagSchema } from "../schemas/flags.js";
import { formatZodError } from "../utils/api.js";
import { NotFoundError, ValidationError } from "../errors.js";

export function createFlagService(store: Store) {
  return {
    getFlag: async (key: string): Promise<Flag> => {
      const flag = await store.getFlag(key);

      if (!flag) throw new NotFoundError(`Flag '${key}' not found`);

      return { key: flag.key, defaultValue: flag.defaultValue };
    },

    listFlags: async (): Promise<Flag[]> => {
      return store.listFlags();
    },

    createFlag: async (flag: Flag): Promise<void> => {
      const result = flagSchema.safeParse(flag);

      if (!result.success) {
        throw new ValidationError(formatZodError(result.error));
      }

      await store.transaction(async (tx) => {
        await tx.createFlag(result.data);
        await tx.incrementConfigVersion();
      });
    },

    updateFlag: async (key: string, flag: UpdateFlagParams): Promise<void> => {
      const result = updateFlagSchema.safeParse(flag);

      if (!result.success) {
        throw new ValidationError(formatZodError(result.error));
      }

      await store.transaction(async (tx) => {
        const updated = await tx.updateFlag(key, result.data);

        if (!updated) throw new NotFoundError();

        await tx.incrementConfigVersion();
      });
    },

    deleteFlag: async (key: string): Promise<void> => {
      await store.transaction(async (tx) => {
        const deleted = await tx.deleteFlag(key);

        if (!deleted) throw new NotFoundError();

        await tx.incrementConfigVersion();
      });
    },
  };
}
