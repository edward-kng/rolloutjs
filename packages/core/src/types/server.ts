import type { EvaluationContext, FlagValue } from "@openfeature/server-sdk";
import type { ApiResponse, Flag, User, UserOverride } from "./api.js";
import type {
  BulkEvaluationResponse,
  EvaluationResponse,
  EvaluationResult,
} from "./ofrep.js";

export interface LibreFlagHttpMethods {
  evaluate: (
    key: string,
    context?: EvaluationContext,
  ) => Promise<EvaluationResponse>;
  evaluateAll: (context?: EvaluationContext) => Promise<BulkEvaluationResponse>;

  getFlag(key: string): Promise<ApiResponse<Flag>>;
  getAllFlags(): Promise<ApiResponse<Flag[]>>;
  createFlag(flag: Flag): Promise<ApiResponse>;
  updateFlag(key: string, flag: Partial<Flag>): Promise<ApiResponse>;
  deleteFlag(key: string): Promise<ApiResponse>;

  getUser(key: string): Promise<ApiResponse<User>>;
  getAllUsers(): Promise<ApiResponse<User[]>>;
  createUser(user: User): Promise<ApiResponse>;
  updateUser(key: string, user: Partial<User>): Promise<ApiResponse>;
  deleteUser(key: string): Promise<ApiResponse>;

  getUserOverrides(userKey: string): Promise<ApiResponse<UserOverride[]>>;
  setUserOverride(
    userKey: string,
    flagKey: string,
    value: FlagValue,
  ): Promise<ApiResponse>;
  deleteUserOverride(userKey: string, flagKey: string): Promise<ApiResponse>;
}

export interface LibreFlagServer {
  evaluate: (
    key: string,
    context?: EvaluationContext,
  ) => Promise<EvaluationResult>;
  evaluateAll: (context?: EvaluationContext) => Promise<EvaluationResult[]>;
  getFlagValue: (
    key: string,
    defaultValue: FlagValue,
    context?: EvaluationContext,
  ) => Promise<FlagValue>;

  getFlag(key: string): Promise<Flag>;
  getAllFlags(): Promise<Flag[]>;
  createFlag(flag: Flag): Promise<void>;
  updateFlag(key: string, flag: Partial<Flag>): Promise<void>;
  deleteFlag(key: string): Promise<void>;

  getUser(key: string): Promise<User>;
  getAllUsers(): Promise<User[]>;
  createUser(user: User): Promise<void>;
  updateUser(key: string, user: Partial<User>): Promise<void>;
  deleteUser(key: string): Promise<void>;

  getUserOverrides(userKey: string): Promise<UserOverride[]>;
  setUserOverride(
    userKey: string,
    flagKey: string,
    value: FlagValue,
  ): Promise<void>;
  deleteUserOverride(userKey: string, flagKey: string): Promise<void>;

  getHttpMethods(): LibreFlagHttpMethods;
}
