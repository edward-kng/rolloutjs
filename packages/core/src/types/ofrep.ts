import type {
  ErrorCode,
  FlagValue,
  ResolutionReason,
} from "@openfeature/server-sdk";
import type { APIResponse } from "./api.js";

type EvaluationResult = {
  key: string;
  value?: FlagValue;
  reason?: ResolutionReason;
  errorCode?: ErrorCode;
};

export type EvaluationResponse = APIResponse & {
  body: EvaluationResult;
};

export type BulkEvaluationResponse = APIResponse & {
  body: {
    flags: EvaluationResult[];
  };
};
