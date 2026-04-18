export abstract class RolloutError extends Error {}

export class NotFoundError extends RolloutError {
  constructor(message?: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class ValidationError extends RolloutError {
  constructor(message?: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class ConflictError extends RolloutError {
  constructor(message?: string) {
    super(message);
    this.name = "ConflictError";
  }
}
