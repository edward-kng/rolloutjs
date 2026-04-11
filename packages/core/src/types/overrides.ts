import type { FlagValue } from "@openfeature/core";

export interface Override {
  flagKey: string;
  /**
   * Unique identifier for a user, sent with evaluation context.
   * If set, override applies to that user regardless of segments and default values.
   * Mutually exclusive with segmentKey.
   */
  targetingKey?: string;
  /**
   * Unique identifier for a segment.
   * If set, override applies to all users in that segment, unless user overrides exist.
   * Mutually exclusive with targetingKey.
   */
  segmentKey?: string;
  value: FlagValue;
}

export interface UserOverride extends Override {
  targetingKey: string;
}

export interface SegmentOverride extends Override {
  segmentKey: string;
}
