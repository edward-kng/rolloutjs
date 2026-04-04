import type { FlagValue } from "@openfeature/core";
import type {
  StoredFlag,
  StoredOverride,
  StoredSegment,
  UpdatedStoredFlagParams,
  UpdateStoredSegmentParams,
} from "./db.js";

export interface LibreFlagStore {
  migrate: () => Promise<void>;

  getConfigVersion: () => Promise<number>;
  incrementConfigVersion: () => Promise<void>;

  listFlags: () => Promise<StoredFlag[]>;
  getFlag: (key: string) => Promise<StoredFlag | null>;
  createFlag: (flag: StoredFlag) => Promise<void>;
  updateFlag: (key: string, flag: UpdatedStoredFlagParams) => Promise<boolean>;
  deleteFlag: (key: string) => Promise<boolean>;

  listOverrides: () => Promise<StoredOverride[]>;
  getFlagOverrides: (flagKey: string) => Promise<StoredOverride[]>;
  getUserOverrides: (targetingKey: string) => Promise<StoredOverride[]>;
  getUserOverride: (
    targetingKey: string,
    flagKey: string,
  ) => Promise<StoredOverride | null>;
  setUserOverride: (
    targetingKey: string,
    flagKey: string,
    value: FlagValue,
  ) => Promise<void>;
  deleteUserOverride: (
    targetingKey: string,
    flagkey: string,
  ) => Promise<boolean>;
  listSegmentOverrides: () => Promise<StoredOverride[]>;
  getSegmentOverrides: (segmentKey: string) => Promise<StoredOverride[]>;
  getSegmentOverridesForFlag: (flagKey: string) => Promise<StoredOverride[]>;
  setSegmentOverride: (
    segmentKey: string,
    flagKey: string,
    value: FlagValue,
  ) => Promise<void>;
  deleteSegmentOverride: (
    segmentKey: string,
    flagkey: string,
  ) => Promise<boolean>;

  listSegments: () => Promise<StoredSegment[]>;
  createSegment: (segment: StoredSegment) => Promise<void>;
  updateSegment: (
    key: string,
    segment: UpdateStoredSegmentParams,
  ) => Promise<boolean>;
  deleteSegment: (key: string) => Promise<boolean>;
}
