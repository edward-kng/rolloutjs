import type { StoredFlag, StoredUser, StoredUserOverride } from "./db.js";

export interface LibreFlagStore {
  migrate: () => Promise<void>;

  getAllFlags: () => Promise<StoredFlag[]>;
  getFlag: (key: string) => Promise<StoredFlag | null>;
  createFlag: (flag: StoredFlag) => Promise<StoredFlag>;
  updateFlag: (
    key: string,
    flag: Partial<StoredFlag>,
  ) => Promise<StoredFlag | null>;
  deleteFlag: (key: string) => Promise<boolean>;

  getAllUsers: () => Promise<StoredUser[]>;
  getUser: (key: string) => Promise<StoredUser | null>;
  createUser: (user: StoredUser) => Promise<StoredUser>;
  updateUser: (
    key: string,
    user: Partial<StoredUser>,
  ) => Promise<StoredUser | null>;
  deleteUser: (key: string) => Promise<boolean>;
  upsertUser: (user: StoredUser) => Promise<StoredUser>;

  getUserOverrides: (userKey: string) => Promise<StoredUserOverride[]>;
  getUserOverride: (
    userKey: string,
    flagKey: string,
  ) => Promise<StoredUserOverride | null>;
  setUserOverride: (
    override: StoredUserOverride,
  ) => Promise<StoredUserOverride>;
  deleteUserOverride: (userKey: string, flagKey: string) => Promise<boolean>;
}
