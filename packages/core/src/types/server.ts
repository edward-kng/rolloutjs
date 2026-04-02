import type { EvaluationContext, FlagValue } from "@openfeature/core";
import type { ApiResponse, Flag, Override, UpdateFlagParams } from "./api.js";
import type {
  BulkEvaluationResponse,
  EvaluationBody,
  EvaluationResponse,
  EvaluationResult,
} from "./ofrep.js";

export interface LibreFlagHttpMethods {
  evaluate: (
    flagKey: string,
    context?: EvaluationBody,
  ) => Promise<EvaluationResponse>;
  evaluateAll: (
    context?: EvaluationBody,
    ifNoneMatch?: string,
  ) => Promise<BulkEvaluationResponse>;

  getFlags(): Promise<ApiResponse<Flag[]>>;
  getFlag(key: string): Promise<ApiResponse<Flag>>;
  createFlag(flag: Flag): Promise<ApiResponse>;
  updateFlag(key: string, flag: UpdateFlagParams): Promise<ApiResponse>;
  deleteFlag(key: string): Promise<ApiResponse>;

  getFlagOverrides(flagKey: string): Promise<ApiResponse<Override[]>>;
  getUserOverrides(targetingKey: string): Promise<ApiResponse<Override[]>>;
  setUserOverride(
    targetingKey: string,
    flagKey: string,
    value: FlagValue,
  ): Promise<ApiResponse>;
  deleteUserOverride(
    targetingKey: string,
    flagKey: string,
  ): Promise<ApiResponse>;
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

  getFlags(): Promise<Flag[]>;
  getFlag(key: string): Promise<Flag>;
  createFlag(flag: Flag): Promise<void>;
  updateFlag(key: string, flag: UpdateFlagParams): Promise<void>;
  deleteFlag(key: string): Promise<void>;

  getFlagOverrides: (flagKey: string) => Promise<Override[]>;
  getUserOverrides: (targetingKey: string) => Promise<Override[]>;
  getUserOverride: (flagKey: string, targetingKey: string) => Promise<Override>;
  setUserOverride: (
    flagKey: string,
    targetingKey: string,
    value: FlagValue,
  ) => Promise<void>;
  deleteUserOverride: (flagkey: string, targetingKey: string) => Promise<void>;

  getHttpMethods(): LibreFlagHttpMethods;
}
