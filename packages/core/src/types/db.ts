import type { FlagValue } from "@openfeature/core";

export interface StoredFlag {
  key: string;
  defaultValue: FlagValue;
}

export interface StoredUser {
  key: string;
  attributes: Record<string, unknown>;
}

export interface StoredUserOverride {
  userKey: string;
  flagKey: string;
  value: FlagValue;
}
