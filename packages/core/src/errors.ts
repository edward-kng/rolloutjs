export enum ErrorCode {
  FLAG_NOT_FOUND = "FLAG_NOT_FOUND",
  FLAG_ALREADY_EXISTS = "FLAG_ALREADY_EXISTS",
  USER_NOT_FOUND = "USER_NOT_FOUND",
  USER_ALREADY_EXISTS = "USER_ALREADY_EXISTS",
}

export class FlagAlreadyExistsError extends Error {
  errorCode = ErrorCode.FLAG_ALREADY_EXISTS;

  constructor(key: string) {
    super(`Flag already exists: ${key}`);
    this.name = "FlagAlreadyExistsError";
  }
}

export class FlagNotFoundError extends Error {
  errorCode = ErrorCode.FLAG_NOT_FOUND;

  constructor(key: string) {
    super(`Flag not found: ${key}`);
    this.name = "FlagNotFoundError";
  }
}

export class UserAlreadyExistsError extends Error {
  errorCode = ErrorCode.USER_ALREADY_EXISTS;

  constructor(key: string) {
    super(`User already exists: ${key}`);
    this.name = "UserAlreadyExistsError";
  }
}

export class UserNotFoundError extends Error {
  errorCode = ErrorCode.USER_NOT_FOUND;

  constructor(key: string) {
    super(`User not found: ${key}`);
    this.name = "UserNotFoundError";
  }
}
