import { ErrorCode, StandardResolutionReasons } from "@openfeature/server-sdk";
import type {
  BulkEvaluationResponse,
  EvaluationResponse,
} from "./types/ofrep.js";
import type { FlagStore } from "./types/flag-store.js";

export class LibreFlag {
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
}
