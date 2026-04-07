import type { ErrorCode, FlagValue, ResolutionReason } from "@openfeature/core";

export interface EvaluationResult {
  key: string;
  value?: FlagValue;
  reason?: ResolutionReason;
  errorCode?: ErrorCode;
  errorDetails?: string;
}
