import {
  ErrorCode,
  FlagAlreadyExistsError,
  FlagNotFoundError,
  UserAlreadyExistsError,
  UserNotFoundError,
} from "../errors.js";
import type { ApiResponse } from "../types/api.js";

export function handleError<T extends object | undefined = undefined>(
  error: Error | unknown,
): ApiResponse<T> {
  if (error instanceof FlagNotFoundError)
    return {
      status: 404,
      errorCode: ErrorCode.FLAG_NOT_FOUND,
    };

  if (error instanceof FlagAlreadyExistsError) {
    return {
      status: 409,
      errorCode: ErrorCode.FLAG_ALREADY_EXISTS,
    };
  }

  if (error instanceof UserNotFoundError) {
    return {
      status: 404,
      errorCode: ErrorCode.USER_NOT_FOUND,
    };
  }

  if (error instanceof UserAlreadyExistsError) {
    return {
      status: 409,
      errorCode: ErrorCode.USER_ALREADY_EXISTS,
    };
  }

  return {
    status: 500,
  };
}
