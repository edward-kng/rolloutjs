export enum ErrorCode {
  FLAG_NOT_FOUND = "FLAG_NOT_FOUND",
  FLAG_ALREADY_EXISTS = "FLAG_ALREADY_EXISTS",
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
