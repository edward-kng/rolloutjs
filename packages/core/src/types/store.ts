import type { FlagValue } from "@openfeature/core";
import type { Flag, UpdateFlagParams } from "./flags.js";
import type { Override, SegmentOverride, UserOverride } from "./overrides.js";
import type { Segment, UpdateSegmentParams } from "./segments.js";

export interface LibreFlagStore {
  migrate: () => Promise<void>;

  getConfigVersion: () => Promise<number>;
  incrementConfigVersion: () => Promise<void>;

  listFlags: () => Promise<Flag[]>;
  getFlag: (key: string) => Promise<Flag | null>;
  createFlag: (flag: Flag) => Promise<void>;
  updateFlag: (key: string, flag: UpdateFlagParams) => Promise<boolean>;
  deleteFlag: (key: string) => Promise<boolean>;

  listOverrides: () => Promise<Override[]>;
  getFlagOverrides: (flagKey: string) => Promise<Override[]>;
  getUserOverrides: (targetingKey: string) => Promise<UserOverride[]>;
  getUserOverride: (
    targetingKey: string,
    flagKey: string,
  ) => Promise<UserOverride | null>;
  setUserOverride: (
    targetingKey: string,
    flagKey: string,
    value: FlagValue,
  ) => Promise<void>;
  deleteUserOverride: (
    targetingKey: string,
    flagkey: string,
  ) => Promise<boolean>;
  listSegmentOverrides: () => Promise<SegmentOverride[]>;
  getSegmentOverrides: (segmentKey: string) => Promise<SegmentOverride[]>;
  getSegmentOverridesForFlag: (flagKey: string) => Promise<SegmentOverride[]>;
  setSegmentOverride: (
    segmentKey: string,
    flagKey: string,
    value: FlagValue,
  ) => Promise<void>;
  deleteSegmentOverride: (
    segmentKey: string,
    flagkey: string,
  ) => Promise<boolean>;

  listSegments: () => Promise<Segment[]>;
  createSegment: (segment: Segment) => Promise<void>;
  updateSegment: (
    key: string,
    segment: UpdateSegmentParams,
  ) => Promise<boolean>;
  deleteSegment: (key: string) => Promise<boolean>;
  getMaxSegmentPriority: () => Promise<number | null>;
  getSegmentPriorityByIndex: (index: number) => Promise<number | null>;
  transaction: (
    fn: (tx: Omit<LibreFlagStore, "transaction">) => Promise<void>,
  ) => Promise<void>;
}

export type Transaction = Omit<LibreFlagStore, "transaction">;
