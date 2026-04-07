import type { EvaluationContext, FlagValue } from "@openfeature/core";
import type { EvaluationResult } from "./ofrep.js";
import type { Flag, UpdateFlagParams } from "./flags.js";
import type { Override, SegmentOverride, UserOverride } from "./overrides.js";
import type {
  CreateSegmentParams,
  Segment,
  UpdateSegmentParams,
} from "./segments.js";
import type { ApiRoute } from "./api.js";

export interface LibreFlagServer {
  evaluate: (
    flagKey: string,
    context?: EvaluationContext,
  ) => Promise<EvaluationResult>;
  evaluateAll: (context?: EvaluationContext) => Promise<EvaluationResult[]>;
  getFlagValue: (
    flagKey: string,
    defaultValue: FlagValue,
    context?: EvaluationContext,
  ) => Promise<FlagValue>;

  listFlags(): Promise<Flag[]>;
  getFlag(key: string): Promise<Flag>;
  createFlag(flag: Flag): Promise<void>;
  updateFlag(key: string, flag: UpdateFlagParams): Promise<void>;
  deleteFlag(key: string): Promise<void>;

  listOverrides: () => Promise<Override[]>;
  getFlagOverrides: (flagKey: string) => Promise<Override[]>;
  getUserOverrides: (targetingKey: string) => Promise<UserOverride[]>;
  getUserOverride: (
    flagKey: string,
    targetingKey: string,
  ) => Promise<UserOverride>;
  setUserOverride: (
    flagKey: string,
    targetingKey: string,
    value: FlagValue,
  ) => Promise<void>;
  deleteUserOverride: (flagkey: string, targetingKey: string) => Promise<void>;
  listSegmentOverrides: () => Promise<SegmentOverride[]>;
  getSegmentOverrides: (segmentKey: string) => Promise<SegmentOverride[]>;
  setSegmentOverride: (
    segmentKey: string,
    flagKey: string,
    value: FlagValue,
  ) => Promise<void>;
  deleteSegmentOverride: (segmentKey: string, flagkey: string) => Promise<void>;

  listSegments: () => Promise<Segment[]>;
  createSegment: (params: CreateSegmentParams) => Promise<void>;
  updateSegment: (key: string, segment: UpdateSegmentParams) => Promise<void>;
  deleteSegment: (key: string) => Promise<void>;

  routes: ApiRoute[];
}
