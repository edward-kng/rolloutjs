import type {
  ErrorCode,
  EvaluationContext,
  FlagValue,
  ResolutionReason,
} from "@openfeature/core";
import type { ApiResponse } from "./api.js";

export interface EvaluationResult {
  key: string;
  value?: FlagValue;
  reason?: ResolutionReason;
  errorCode?: ErrorCode;
  errorDetails?: string;
}

export type EvaluationResponse = ApiResponse<EvaluationResult>;

export type BulkEvaluationResponse = ApiResponse<{
  flags: EvaluationResult[];
  errorCode?: ErrorCode;
  errorDetails?: string;
}>;

export interface EvaluationBody {
  context: EvaluationContext;
}
