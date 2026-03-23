import type { StoredFlag } from "./db.js";

export interface FlagStore {
  getAllFlags: () => Promise<StoredFlag[]>;
  getFlagByKey: (key: string) => Promise<StoredFlag | null>;
}
