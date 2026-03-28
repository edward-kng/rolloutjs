import type { FlagValue } from "@openfeature/server-sdk";
import { StandardResolutionReasons } from "@openfeature/server-sdk";
import type { EvaluationResult } from "./types/ofrep.js";
import type {
  EvaluationContext,
  Flag,
  User,
  UserOverride,
} from "./types/api.js";
import type { LibreFlagStore } from "./types/store.js";
import type { LibreFlagHttpMethods, LibreFlagServer } from "./types/server.js";
import { FlagNotFoundError, UserNotFoundError } from "./errors.js";
import { handleError } from "./utils/api.js";

export function LibreFlag(store: LibreFlagStore): LibreFlagServer {
  async function evaluate(
    key: string,
    context?: EvaluationContext,
  ): Promise<EvaluationResult> {
    const flag = await store.getFlag(key);

    if (!flag) throw new FlagNotFoundError(key);

    if (context?.key) {
      await store.upsertUser({
        key: context.key,
        attributes: context.attributes ?? {},
      });

      const override = await store.getUserOverride(context.key, flag.key);

      if (override) {
        return {
          key: flag.key,
          value: override.value,
          reason: StandardResolutionReasons.TARGETING_MATCH,
        };
      }
    }

    return {
      key: flag.key,
      value: flag.defaultValue,
      reason: StandardResolutionReasons.STATIC,
    };
  }

  async function evaluateAll(
    context?: EvaluationContext,
  ): Promise<EvaluationResult[]> {
    const flags = await store.getAllFlags();

    if (context?.key) {
      await store.upsertUser({
        key: context.key,
        attributes: context.attributes ?? {},
      });

      const overrides = await store.getUserOverrides(context.key);
      const overrideMap = new Map(overrides.map((o) => [o.flagKey, o.value]));

      return flags.map((flag) => {
        const overrideValue = overrideMap.get(flag.key);

        if (overrideValue !== undefined) {
          return {
            key: flag.key,
            value: overrideValue,
            reason: StandardResolutionReasons.TARGETING_MATCH,
          };
        }

        return {
          key: flag.key,
          value: flag.defaultValue,
          reason: StandardResolutionReasons.STATIC,
        };
      });
    }

    return flags.map((flag) => ({
      key: flag.key,
      value: flag.defaultValue,
      reason: StandardResolutionReasons.STATIC,
    }));
  }

  async function getFlagValue(
    key: string,
    defaultValue: FlagValue,
    context?: EvaluationContext,
  ): Promise<FlagValue> {
    try {
      const result = await evaluate(key, context);
      return result.value!;
    } catch {
      return defaultValue;
    }
  }

  async function getFlag(key: string): Promise<Flag> {
    const flag = await store.getFlag(key);

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

  async function getUser(key: string): Promise<User> {
    const user = await store.getUser(key);

    if (!user) throw new UserNotFoundError(key);

    return { key: user.key, attributes: user.attributes };
  }

  async function getAllUsers(): Promise<User[]> {
    const users = await store.getAllUsers();

    return users.map((user) => ({
      key: user.key,
      attributes: user.attributes,
    }));
  }

  async function createUser(user: User): Promise<void> {
    await store.createUser(user);
  }

  async function updateUser(key: string, user: Partial<User>): Promise<void> {
    const updated = await store.updateUser(key, user);

    if (!updated) throw new UserNotFoundError(key);
  }

  async function deleteUser(key: string): Promise<void> {
    const deleted = await store.deleteUser(key);

    if (!deleted) throw new UserNotFoundError(key);
  }

  async function getUserOverrides(userKey: string): Promise<UserOverride[]> {
    const overrides = await store.getUserOverrides(userKey);

    return overrides.map((o) => ({ flagKey: o.flagKey, value: o.value }));
  }

  async function setUserOverride(
    userKey: string,
    flagKey: string,
    value: FlagValue,
  ): Promise<void> {
    await store.setUserOverride({ userKey, flagKey, value });
  }

  async function deleteUserOverride(
    userKey: string,
    flagKey: string,
  ): Promise<void> {
    const deleted = await store.deleteUserOverride(userKey, flagKey);

    if (!deleted) throw new UserNotFoundError(userKey);
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

      getUser: async (key) => {
        try {
          const user = await getUser(key);
          return { status: 200, body: user };
        } catch (e) {
          return handleError(e);
        }
      },
      getAllUsers: async () => {
        try {
          const users = await getAllUsers();
          return { status: 200, body: users };
        } catch (e) {
          return handleError(e);
        }
      },
      createUser: async (user) => {
        try {
          await createUser(user);
          return { status: 201 };
        } catch (e) {
          return handleError(e);
        }
      },
      updateUser: async (key, user) => {
        try {
          await updateUser(key, user);
          return { status: 200 };
        } catch (e) {
          return handleError(e);
        }
      },
      deleteUser: async (key) => {
        try {
          await deleteUser(key);
          return { status: 204 };
        } catch (e) {
          return handleError(e);
        }
      },

      getUserOverrides: async (userKey) => {
        try {
          const overrides = await getUserOverrides(userKey);
          return { status: 200, body: overrides };
        } catch (e) {
          return handleError(e);
        }
      },
      setUserOverride: async (userKey, flagKey, value) => {
        try {
          await setUserOverride(userKey, flagKey, value);
          return { status: 200 };
        } catch (e) {
          return handleError(e);
        }
      },
      deleteUserOverride: async (userKey, flagKey) => {
        try {
          await deleteUserOverride(userKey, flagKey);
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
    getUser,
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserOverrides,
    setUserOverride,
    deleteUserOverride,
    getHttpMethods,
  };
}
