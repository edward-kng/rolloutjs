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

  getFlags: () => Promise<StoredFlag[]>;
  getFlag: (key: string) => Promise<StoredFlag | null>;
  createFlag: (flag: StoredFlag) => Promise<void>;
  updateFlag: (key: string, flag: UpdatedStoredFlagParams) => Promise<boolean>;
  deleteFlag: (key: string) => Promise<boolean>;

  getFlagOverrides: (flagKey: string) => Promise<StoredOverride[]>;
  getUserOverrides: (targetingKey: string) => Promise<StoredOverride[]>;
  getUserOverride: (
    flagKey: string,
    targetingKey: string,
  ) => Promise<StoredOverride | null>;
  setUserOverride: (
    flagKey: string,
    targetingKey: string,
    value: FlagValue,
  ) => Promise<void>;
  deleteUserOverride: (
    flagkey: string,
    targetingKey: string,
  ) => Promise<boolean>;
}
