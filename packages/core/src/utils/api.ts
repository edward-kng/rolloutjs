import type { ApiResponse, ApiRoute } from "../types/api.js";
import { ConflictError, NotFoundError, ValidationError } from "../errors.js";
import {
  ErrorCode,
  FlagNotFoundError,
  type EvaluationContext,
  type FlagValue,
} from "@openfeature/core";
import type { ZodError } from "zod";
import type { RolloutService } from "../types/server.js";
import {
  hashContext,
  type CreateSegmentParams,
  type Flag,
  type Store,
  type UpdateFlagParams,
  type UpdateSegmentParams,
} from "../index.js";

export function formatZodError(error: ZodError): string {
  return error.issues.map((i) => i.message).join("; ");
}

export function handleError(
  error: Error | unknown,
  metadata?: Record<string, unknown>,
): ApiResponse {
  if (error instanceof FlagNotFoundError && metadata?.key) {
    return {
      status: 404,
      body: {
        key: metadata.key,
        errorCode: ErrorCode.FLAG_NOT_FOUND,
        errorDetails: error.message || "Flag not found",
      },
    };
  }

  if (error instanceof NotFoundError) {
    return {
      status: 404,
      body: error.message || "Resource not found",
    };
  }

  if (error instanceof ValidationError) {
    return {
      status: 400,
      body: error.message || "Invalid request",
    };
  }

  if (error instanceof ConflictError) {
    return {
      status: 409,
      body: error.message || "Resource already exists",
    };
  }

  throw error;
}

export function createApiRoutes(
  rollout: Omit<RolloutService, "routes">,
  store: Store,
): ApiRoute[] {
  const {
    evaluate,
    evaluateAll,
    getFlag,
    listFlags,
    createFlag,
    updateFlag,
    deleteFlag,
    listOverrides,
    getFlagOverrides,
    getUserOverrides,
    setUserOverride,
    deleteUserOverride,
    getSegmentOverrides,
    setSegmentOverride,
    deleteSegmentOverride,
    listSegments,
    createSegment,
    updateSegment,
    deleteSegment,
  } = rollout;

  return [
    {
      type: "EVAL",
      path: "/ofrep/v1/evaluate/flags/:flagKey",
      method: "POST",
      handler: async (params, body) => {
        try {
          const result = await evaluate(
            params.flagKey,
            body as EvaluationContext,
          );

          return { status: 200, body: result };
        } catch (e) {
          return handleError(e, { key: params.flagKey });
        }
      },
    },
    {
      type: "EVAL",
      path: "/ofrep/v1/evaluate/flags",
      method: "POST",
      handler: async (_params, body, headers) => {
        try {
          const version = await store.getConfigVersion();
          const { context } = body as { context?: EvaluationContext };
          const etag = hashContext(context, version);

          if (headers["if-none-match"] === etag) {
            return { status: 304, headers: { etag } };
          }

          const results = await evaluateAll(context);

          return { status: 200, body: { flags: results }, headers: { etag } };
        } catch (e) {
          return handleError(e);
        }
      },
    },

    {
      type: "ADMIN",
      path: "/rolloutjs/api/flags",
      method: "GET",
      handler: async () => {
        try {
          const flags = await listFlags();

          return { status: 200, body: flags };
        } catch (e) {
          return handleError(e);
        }
      },
    },
    {
      type: "ADMIN",
      path: "/rolloutjs/api/flags/:flagKey",
      method: "GET",
      handler: async (params) => {
        try {
          const flag = await getFlag(params.flagKey);

          return { status: 200, body: flag };
        } catch (e) {
          return handleError(e);
        }
      },
    },
    {
      type: "ADMIN",
      path: "/rolloutjs/api/flags",
      method: "POST",
      handler: async (_params, body) => {
        try {
          await createFlag(body as Flag);

          return { status: 201 };
        } catch (e) {
          return handleError(e);
        }
      },
    },
    {
      type: "ADMIN",
      path: "/rolloutjs/api/flags/:flagKey",
      method: "PUT",
      handler: async (params, body) => {
        try {
          await updateFlag(params.flagKey, body as UpdateFlagParams);

          return { status: 200 };
        } catch (e) {
          return handleError(e);
        }
      },
    },
    {
      type: "ADMIN",
      path: "/rolloutjs/api/flags/:flagKey",
      method: "DELETE",
      handler: async (params) => {
        try {
          await deleteFlag(params.flagKey);

          return { status: 204 };
        } catch (e) {
          return handleError(e);
        }
      },
    },

    {
      type: "ADMIN",
      path: "/rolloutjs/api/flags/:flagKey/overrides",
      method: "GET",
      handler: async (params) => {
        try {
          const overrides = await getFlagOverrides(params.flagKey);

          return { status: 200, body: overrides };
        } catch (e) {
          return handleError(e);
        }
      },
    },

    {
      type: "ADMIN",
      path: "/rolloutjs/api/overrides",
      method: "GET",
      handler: async () => {
        try {
          const overrides = await listOverrides();

          return { status: 200, body: overrides };
        } catch (e) {
          return handleError(e);
        }
      },
    },
    {
      type: "ADMIN",
      path: "/rolloutjs/api/overrides/:targetingKey",
      method: "GET",
      handler: async (params) => {
        try {
          const overrides = await getUserOverrides(params.targetingKey);

          return { status: 200, body: overrides };
        } catch (e) {
          return handleError(e);
        }
      },
    },
    {
      type: "ADMIN",
      path: "/rolloutjs/api/overrides/:targetingKey/:flagKey",
      method: "PUT",
      handler: async (params, body) => {
        try {
          const { value } = body as { value: FlagValue };
          await setUserOverride(params.targetingKey, params.flagKey, value);

          return { status: 200 };
        } catch (e) {
          return handleError(e);
        }
      },
    },
    {
      type: "ADMIN",
      path: "/rolloutjs/api/overrides/:targetingKey/:flagKey",
      method: "DELETE",
      handler: async (params) => {
        try {
          await deleteUserOverride(params.targetingKey, params.flagKey);

          return { status: 204 };
        } catch (e) {
          return handleError(e);
        }
      },
    },

    {
      type: "ADMIN",
      path: "/rolloutjs/api/segments",
      method: "GET",
      handler: async () => {
        try {
          const segments = await listSegments();

          return { status: 200, body: segments };
        } catch (e) {
          return handleError(e);
        }
      },
    },
    {
      type: "ADMIN",
      path: "/rolloutjs/api/segments",
      method: "POST",
      handler: async (_params, body) => {
        try {
          await createSegment(body as CreateSegmentParams);

          return { status: 201 };
        } catch (e) {
          return handleError(e);
        }
      },
    },
    {
      type: "ADMIN",
      path: "/rolloutjs/api/segments/:segmentKey",
      method: "PUT",
      handler: async (params, body) => {
        try {
          await updateSegment(params.segmentKey, body as UpdateSegmentParams);

          return { status: 200 };
        } catch (e) {
          return handleError(e);
        }
      },
    },
    {
      type: "ADMIN",
      path: "/rolloutjs/api/segments/:segmentKey",
      method: "DELETE",
      handler: async (params) => {
        try {
          await deleteSegment(params.segmentKey);

          return { status: 204 };
        } catch (e) {
          return handleError(e);
        }
      },
    },

    {
      type: "ADMIN",
      path: "/rolloutjs/api/segments/:segmentKey/overrides",
      method: "GET",
      handler: async (params) => {
        try {
          const overrides = await getSegmentOverrides(params.segmentKey);

          return { status: 200, body: overrides };
        } catch (e) {
          return handleError(e);
        }
      },
    },
    {
      type: "ADMIN",
      path: "/rolloutjs/api/segments/:segmentKey/overrides/:flagKey",
      method: "PUT",
      handler: async (params, body) => {
        try {
          const { value } = body as { value: FlagValue };
          await setSegmentOverride(params.segmentKey, params.flagKey, value);

          return { status: 200 };
        } catch (e) {
          return handleError(e);
        }
      },
    },
    {
      type: "ADMIN",
      path: "/rolloutjs/api/segments/:segmentKey/overrides/:flagKey",
      method: "DELETE",
      handler: async (params) => {
        try {
          await deleteSegmentOverride(params.segmentKey, params.flagKey);

          return { status: 204 };
        } catch (e) {
          return handleError(e);
        }
      },
    },
  ];
}
