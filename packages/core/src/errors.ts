export abstract class LibreFlagError extends Error {}

export class NotFoundError extends LibreFlagError {
  constructor(message?: string) {
    super(message);
    this.name = "NotFoundError";
  }
}
