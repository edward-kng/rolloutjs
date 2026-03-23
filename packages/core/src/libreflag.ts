import { ErrorCode, StandardResolutionReasons } from "@openfeature/server-sdk";
import type {
  BulkEvaluationResponse,
  EvaluationResponse,
} from "./types/ofrep.js";
import type { APIResponse, Flag } from "./types/api.js";
import type { FlagStore } from "./types/flag-store.js";
import { FlagAlreadyExistsError } from "./errors.js";

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

  async getFlag(key: string): Promise<APIResponse> {
    const flag = await this.store.getFlagByKey(key);

    if (!flag) {
      return { status: 404 };
    }

    return { status: 200, body: flag };
  }

  async getAllFlags(): Promise<APIResponse> {
    const flags = await this.store.getAllFlags();

    return { status: 200, body: flags };
  }

  async createFlag(flag: Flag): Promise<APIResponse> {
    try {
      const created = await this.store.createFlag(flag);

      return { status: 201, body: created };
    } catch (error: unknown) {
      if (error instanceof FlagAlreadyExistsError) {
        return { status: 409 };
      }
      throw error;
    }
  }

  async updateFlag(key: string, flag: Partial<Flag>): Promise<APIResponse> {
    const updated = await this.store.updateFlag(key, flag);

    if (!updated) {
      return { status: 404 };
    }

    return { status: 200, body: updated };
  }

  async deleteFlag(key: string): Promise<APIResponse> {
    const deleted = await this.store.deleteFlag(key);

    if (!deleted) {
      return { status: 404 };
    }

    return { status: 204 };
  }
}
