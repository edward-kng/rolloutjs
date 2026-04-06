import type { EvaluationContext, FlagValue } from "@openfeature/core";
import type { ApiResponse } from "./api.js";
import type {
  BulkEvaluationResponse,
  EvaluationBody,
  EvaluationResponse,
  EvaluationResult,
} from "./ofrep.js";
import type { Flag, UpdateFlagParams } from "./flags.js";
import type { Override, SegmentOverride, UserOverride } from "./overrides.js";
import type {
  CreateSegmentParams,
  Segment,
  UpdateSegmentParams,
} from "./segments.js";

export interface LibreFlagHttpMethods {
  evaluate: (
    flagKey: string,
    context?: EvaluationBody,
  ) => Promise<EvaluationResponse>;
  evaluateAll: (
    context?: EvaluationBody,
    ifNoneMatch?: string,
  ) => Promise<BulkEvaluationResponse>;

  listFlags(): Promise<ApiResponse<Flag[]>>;
  getFlag(key: string): Promise<ApiResponse<Flag>>;
  createFlag(flag: Flag): Promise<ApiResponse>;
  updateFlag(key: string, flag: UpdateFlagParams): Promise<ApiResponse>;
  deleteFlag(key: string): Promise<ApiResponse>;

  listOverrides(): Promise<ApiResponse<Override[]>>;
  getFlagOverrides(flagKey: string): Promise<ApiResponse<Override[]>>;
  getUserOverrides(targetingKey: string): Promise<ApiResponse<UserOverride[]>>;
  setUserOverride(
    targetingKey: string,
    flagKey: string,
    value: FlagValue,
  ): Promise<ApiResponse>;
  deleteUserOverride(
    targetingKey: string,
    flagKey: string,
  ): Promise<ApiResponse>;
  getSegmentOverrides: (
    segmentKey: string,
  ) => Promise<ApiResponse<SegmentOverride[]>>;
  setSegmentOverride: (
    segmentKey: string,
    flagKey: string,
    value: FlagValue,
  ) => Promise<ApiResponse>;
  deleteSegmentOverride: (
    segmentKey: string,
    flagkey: string,
  ) => Promise<ApiResponse>;

  listSegments: () => Promise<ApiResponse<Segment[]>>;
  createSegment: (params: CreateSegmentParams) => Promise<ApiResponse>;
  updateSegment: (
    key: string,
    segment: UpdateSegmentParams,
  ) => Promise<ApiResponse>;
  deleteSegment: (key: string) => Promise<ApiResponse>;
}

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

  http: LibreFlagHttpMethods;
}
