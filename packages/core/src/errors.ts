export class FlagAlreadyExistsError extends Error {
  constructor(key: string) {
    super(`Flag already exists: ${key}`);
    this.name = "FlagAlreadyExistsError";
  }
}
