import type { FlagValue } from "@openfeature/core";

export interface Override {
  flagKey: string;
  targetingKey?: string;
  segmentKey?: string;
  value: FlagValue;
}

export interface UserOverride extends Override {
  targetingKey: string;
}

export interface SegmentOverride extends Override {
  segmentKey: string;
}
