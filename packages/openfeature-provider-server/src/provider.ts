import {
  StandardResolutionReasons,
  type EvaluationContext,
  type FlagValue,
  type JsonValue,
  type Logger,
  type Provider,
  type ResolutionDetails,
} from "@openfeature/server-sdk";
import type { RolloutService } from "rolloutjs";

const PROVIDER_NAME = "rolloutjs-provider";

export class RolloutJsProvider implements Provider {
  metadata = {
    name: PROVIDER_NAME,
  };

  private rolloutjs: RolloutService;

  constructor(rolloutjs: RolloutService) {
    this.rolloutjs = rolloutjs;
  }

  private async resolveTypedEvaluation<T extends FlagValue>(
    flagKey: string,
    defaultValue: T,
    context: EvaluationContext,
    typeGuard?: (v: unknown) => v is T,
  ) {
    const { value, reason } = await this.rolloutjs.evaluate(
      flagKey,
      context.targetingKey
        ? {
            key: context.targetingKey,
            ...context,
          }
        : undefined,
    );

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
