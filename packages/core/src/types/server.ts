import type { FlagValue } from "@openfeature/server-sdk";
import type { ApiResponse, Flag } from "./api.js";
import type {
  BulkEvaluationResponse,
  EvaluationResponse,
  EvaluationResult,
} from "./ofrep.js";

export interface LibreFlagHttpMethods {
  evaluate: (key: string, context?: object) => Promise<EvaluationResponse>;
  evaluateAll: (context?: object) => Promise<BulkEvaluationResponse>;
  getFlag(key: string): Promise<ApiResponse<Flag>>;
  getAllFlags(): Promise<ApiResponse<Flag[]>>;
  createFlag(flag: Flag): Promise<ApiResponse>;
  updateFlag(key: string, flag: Partial<Flag>): Promise<ApiResponse>;
  deleteFlag(key: string): Promise<ApiResponse>;
}

export interface LibreFlagServer {
  evaluate: (key: string, context?: object) => Promise<EvaluationResult>;
  evaluateAll: (context: object) => Promise<EvaluationResult[]>;
  getFlagValue: (
    key: string,
    defaultValue: FlagValue,
    context?: object,
  ) => Promise<FlagValue>;
  getFlag(key: string): Promise<Flag>;
  getAllFlags(): Promise<Flag[]>;
  createFlag(flag: Flag): Promise<void>;
  updateFlag(key: string, flag: Partial<Flag>): Promise<void>;
  deleteFlag(key: string): Promise<void>;
  getHttpMethods(): LibreFlagHttpMethods;
}
