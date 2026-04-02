import type { FlagValue } from "@openfeature/core";

export interface StoredConfig {
  version: number;
}

export interface StoredFlag {
  key: string;
  defaultValue: FlagValue;
}

export type UpdatedStoredFlagParams = Omit<Partial<StoredFlag>, "key">;

export interface StoredOverride {
  flagKey: string;
  targetingKey: string;
  value: FlagValue;
}
