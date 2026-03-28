import type {
  ErrorCode,
  FlagValue,
  ResolutionReason,
} from "@openfeature/server-sdk";
import type { ApiResponse } from "./api.js";

export interface EvaluationResult {
  key: string;
  value?: FlagValue;
  reason?: ResolutionReason;
  errorCode?: ErrorCode;
}

export type EvaluationResponse = ApiResponse<EvaluationResult>;

export type BulkEvaluationResponse = ApiResponse<{
  body: {
    flags: EvaluationResult[];
  };
}>;
