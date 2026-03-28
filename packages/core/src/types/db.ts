import type { FlagValue } from "@openfeature/server-sdk";

export interface StoredFlag {
  key: string;
  defaultValue: FlagValue;
}
