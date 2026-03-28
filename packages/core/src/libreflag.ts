import type { FlagValue } from "@openfeature/server-sdk";
import { StandardResolutionReasons } from "@openfeature/server-sdk";
import type { EvaluationResult } from "./types/ofrep.js";
import type { Flag } from "./types/api.js";
import type { LibreFlagStore } from "./types/store.js";
import type { LibreFlagHttpMethods, LibreFlagServer } from "./types/server.js";
import { FlagNotFoundError } from "./errors.js";
import { handleError } from "./utils/api.js";

export function LibreFlag(store: LibreFlagStore): LibreFlagServer {
  async function evaluate(
    key: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    context?: object,
  ): Promise<EvaluationResult> {
    const flag = await store.getFlagByKey(key);

    if (!flag) throw new FlagNotFoundError(key);

    return {
      key: flag.key,
      value: flag.defaultValue,
      reason: StandardResolutionReasons.STATIC,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function evaluateAll(context?: object): Promise<EvaluationResult[]> {
    const flags = await store.getAllFlags();

    return flags.map((flag) => ({
      key: flag.key,
      value: flag.defaultValue,
      reason: StandardResolutionReasons.STATIC,
    }));
  }

  async function getFlagValue(
    key: string,
    defaultValue: FlagValue,
    context?: object,
  ): Promise<FlagValue> {
    try {
      const result = await evaluate(key, context);
      return result.value!;
    } catch {
      return defaultValue;
    }
  }

  async function getFlag(key: string): Promise<Flag> {
    const flag = await store.getFlagByKey(key);

    if (!flag) throw new FlagNotFoundError(key);

    return { key: flag.key, defaultValue: flag.defaultValue };
  }

  async function getAllFlags(): Promise<Flag[]> {
    const flags = await store.getAllFlags();

    return flags.map((flag) => ({
      key: flag.key,
      defaultValue: flag.defaultValue,
    }));
  }

  async function createFlag(flag: Flag): Promise<void> {
    await store.createFlag(flag);
  }

  async function updateFlag(key: string, flag: Partial<Flag>): Promise<void> {
    const updated = await store.updateFlag(key, flag);

    if (!updated) throw new FlagNotFoundError(key);
  }

  async function deleteFlag(key: string): Promise<void> {
    const deleted = await store.deleteFlag(key);

    if (!deleted) throw new FlagNotFoundError(key);
  }

  function getHttpMethods(): LibreFlagHttpMethods {
    return {
      evaluate: async (key, context) => {
        try {
          const result = await evaluate(key, context);
          return { status: 200, body: result };
        } catch (e) {
          return handleError(e);
        }
      },
      evaluateAll: async (context) => {
        try {
          const results = await evaluateAll(context);
          return { status: 200, body: { body: { flags: results } } };
        } catch (e) {
          return handleError(e);
        }
      },
      getFlag: async (key) => {
        try {
          const flag = await getFlag(key);
          return { status: 200, body: flag };
        } catch (e) {
          return handleError(e);
        }
      },
      getAllFlags: async () => {
        try {
          const flags = await getAllFlags();
          return { status: 200, body: flags };
        } catch (e) {
          return handleError(e);
        }
      },
      createFlag: async (flag) => {
        try {
          await createFlag(flag);
          return { status: 201 };
        } catch (e) {
          return handleError(e);
        }
      },
      updateFlag: async (key, flag) => {
        try {
          await updateFlag(key, flag);
          return { status: 200 };
        } catch (e) {
          return handleError(e);
        }
      },
      deleteFlag: async (key) => {
        try {
          await deleteFlag(key);
          return { status: 204 };
        } catch (e) {
          return handleError(e);
        }
      },
    };
  }

  return {
    evaluate,
    evaluateAll,
    getFlagValue,
    getFlag,
    getAllFlags,
    createFlag,
    updateFlag,
    deleteFlag,
    getHttpMethods,
  };
}
