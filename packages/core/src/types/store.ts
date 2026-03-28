import type { StoredFlag } from "./db.js";

export interface LibreFlagStore {
  migrate: () => Promise<void>;
  getAllFlags: () => Promise<StoredFlag[]>;
  getFlagByKey: (key: string) => Promise<StoredFlag | null>;
  createFlag: (flag: StoredFlag) => Promise<StoredFlag>;
  updateFlag: (
    key: string,
    flag: Partial<StoredFlag>,
  ) => Promise<StoredFlag | null>;
  deleteFlag: (key: string) => Promise<boolean>;
}
