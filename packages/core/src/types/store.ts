import type { FlagValue } from "@openfeature/core";
import type {
  StoredFlag,
  StoredOverride,
  UpdatedStoredFlagParams,
} from "./db.js";

export interface LibreFlagStore {
  migrate: () => Promise<void>;

  getConfigVersion: () => Promise<number>;
  incrementConfigVersion: () => Promise<void>;

  listFlags: () => Promise<StoredFlag[]>;
  getFlag: (key: string) => Promise<StoredFlag | null>;
  createFlag: (flag: StoredFlag) => Promise<void>;
  updateFlag: (key: string, flag: UpdatedStoredFlagParams) => Promise<boolean>;
  deleteFlag: (key: string) => Promise<boolean>;

  listOverrides: () => Promise<StoredOverride[]>;
  getFlagOverrides: (flagKey: string) => Promise<StoredOverride[]>;
  getUserOverrides: (targetingKey: string) => Promise<StoredOverride[]>;
  getUserOverride: (
    targetingKey: string,
    flagKey: string,
  ) => Promise<StoredOverride | null>;
  setUserOverride: (
    targetingKey: string,
    flagKey: string,
    value: FlagValue,
  ) => Promise<void>;
  deleteUserOverride: (
    targetingKey: string,
    flagkey: string,
  ) => Promise<boolean>;
}
