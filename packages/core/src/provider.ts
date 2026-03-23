import {
  ErrorCode,
  StandardResolutionReasons,
  type EvaluationContext,
  type FlagValue,
  type JsonValue,
  type Logger,
  type Provider,
  type ResolutionDetails,
} from "@openfeature/server-sdk";
import type {
  BulkEvaluationResponse,
  EvaluationResponse,
} from "./types/ofrep.js";
import type { FlagStore } from "./types/flag-store.js";

const PROVIDER_NAME = "libreflag-provider";

export class LibreFlag implements Provider {
  metadata = {
    name: PROVIDER_NAME,
  };
  store: FlagStore;

  constructor(store: FlagStore) {
    this.store = store;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async evaluate(key: string, _context?: object): Promise<EvaluationResponse> {
    const flag = await this.store.getFlagByKey(key);

    if (!flag || !flag.defaultValue) {
      return {
        status: 404,
        body: {
          key,
          errorCode: ErrorCode.FLAG_NOT_FOUND,
        },
      };
    }

    return {
      status: 200,
      body: {
        key,
        value: flag.defaultValue,
        reason: StandardResolutionReasons.STATIC,
      },
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async evaluateAll(_context?: object): Promise<BulkEvaluationResponse> {
    const flags = await this.store.getAllFlags();

    return {
      status: 200,
      body: {
        flags: flags.map((flag) => ({
          key: flag.key,
          value: flag.defaultValue,
          reason: StandardResolutionReasons.STATIC,
        })),
      },
    };
  }

  private async resolveTypedEvaluation<T extends FlagValue>(
    flagKey: string,
    defaultValue: T,
    context: EvaluationContext,
    typeGuard?: (v: unknown) => v is T,
  ) {
    const {
      body: { value, reason },
    } = await this.evaluate(flagKey, context);

    if (!value || (typeGuard && !typeGuard(value))) {
      return {
        value: defaultValue,
        reason: StandardResolutionReasons.DEFAULT,
      };
    }

    return {
      value: value as T,
      reason,
    };
  }

  async resolveBooleanEvaluation(
    flagKey: string,
    defaultValue: boolean,
    context: EvaluationContext,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    logger: Logger,
  ): Promise<ResolutionDetails<boolean>> {
    return this.resolveTypedEvaluation(
      flagKey,
      defaultValue,
      context,
      (v) => typeof v === "boolean",
    );
  }

  async resolveNumberEvaluation(
    flagKey: string,
    defaultValue: number,
    context: EvaluationContext,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    logger: Logger,
  ): Promise<ResolutionDetails<number>> {
    return this.resolveTypedEvaluation(
      flagKey,
      defaultValue,
      context,
      (v) => typeof v === "number",
    );
  }

  async resolveStringEvaluation(
    flagKey: string,
    defaultValue: string,
    context: EvaluationContext,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    logger: Logger,
  ): Promise<ResolutionDetails<string>> {
    return this.resolveTypedEvaluation(
      flagKey,
      defaultValue,
      context,
      (v) => typeof v === "string",
    );
  }

  async resolveObjectEvaluation<T extends JsonValue>(
    flagKey: string,
    defaultValue: T,
    context: EvaluationContext,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    logger: Logger,
  ): Promise<ResolutionDetails<T>> {
    return this.resolveTypedEvaluation<T>(flagKey, defaultValue, context);
  }
}
