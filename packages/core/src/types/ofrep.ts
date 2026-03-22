import type {
  ErrorCode,
  FlagValue,
  ResolutionReason,
} from "@openfeature/server-sdk";

type EvaluationResult = {
  key: string;
  value?: FlagValue;
  reason?: ResolutionReason;
  errorCode?: ErrorCode;
};

export type EvaluationResponse = {
  status: number;
  body: EvaluationResult;
};

export type BulkEvaluationResponse = {
  status: number;
  body: {
    flags: EvaluationResult[];
  };
};
