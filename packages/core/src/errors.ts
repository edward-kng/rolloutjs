export abstract class LibreFlagError extends Error {}

export class NotFoundError extends LibreFlagError {
  constructor(message?: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class ValidationError extends LibreFlagError {
  constructor(message?: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class ConflictError extends LibreFlagError {
  constructor(message?: string) {
    super(message);
    this.name = "ConflictError";
  }
}
