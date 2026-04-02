import { ErrorCode, FlagNotFoundError } from "@openfeature/core";
import type { ApiResponse } from "../types/api.js";
import { NotFoundError } from "../errors.js";

export function handleError<T extends object | undefined = undefined>(
  error: Error | unknown,
): ApiResponse<T> {
  if (error instanceof FlagNotFoundError) {
    return {
      status: 404,
      errorCode: ErrorCode.FLAG_NOT_FOUND,
    };
  }

  if (error instanceof NotFoundError) {
    return {
      status: 404,
    };
  }

  return {
    status: 500,
  };
}
