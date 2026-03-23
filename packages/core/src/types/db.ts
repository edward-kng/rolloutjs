import type { FlagValue } from "@openfeature/server-sdk";

export type StoredFlag = {
  key: string;
  defaultValue: FlagValue;
};
