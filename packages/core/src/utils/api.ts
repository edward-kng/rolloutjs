import type { ApiResponse } from "../types/api.js";
import { ConflictError, NotFoundError, ValidationError } from "../errors.js";
import { ErrorCode, FlagNotFoundError } from "@openfeature/core";

export function handleError<T extends object | undefined = undefined>(
  error: Error | unknown,
  metadata?: Record<string, unknown>,
): ApiResponse<T> {
  console.log(error);

  if (error instanceof FlagNotFoundError && metadata?.key) {
    return {
      status: 404,
      body: {
        key: metadata.key,
        errorCode: ErrorCode.FLAG_NOT_FOUND,
        errorDetails: error.message || "Flag not found",
      } as T,
    };
  }

  if (error instanceof NotFoundError) {
    return {
      status: 404,
      body: error.message || "Resource not found",
    };
  }

  if (error instanceof ValidationError) {
    return {
      status: 400,
      body: error.message || "Invalid request",
    };
  }

  if (error instanceof ConflictError) {
    return {
      status: 409,
      body: error.message || "Resource already exists",
    };
  }

  return {
    status: 500,
    body: "Internal server error",
  };
}
