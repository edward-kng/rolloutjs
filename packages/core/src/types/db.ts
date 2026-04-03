import type { FlagValue } from "@openfeature/core";
import type { Rule } from "./api.js";

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
  targetingKey?: string;
  segmentKey?: string;
  value: FlagValue;
}

export interface StoredSegment {
  key: string;
  rules: Rule[];
}

export type UpdateStoredSegmentParams = Omit<Partial<StoredSegment>, "key">;
