import type { EvaluationContext, FlagValue } from "@openfeature/core";
import type { EvaluationResult } from "./ofrep.js";
import type { Flag, UpdateFlagParams } from "./flags.js";
import type { Override, SegmentOverride, UserOverride } from "./overrides.js";
import type {
  CreateSegmentParams,
  Segment,
  UpdateSegmentParams,
} from "./segments.js";
import type { ApiRoute } from "./api.js";

export interface LibreFlagServer {
  /**
   * Evaluates a flag for a given user context
   * @param {string} flagKey
   * @param {EvaluationContext} [context]
   * @returns {Promise<EvaluationResult>} Result with resolved value, reason and/or error
   * @throws {NotFoundError} If the flag doesn't exist
   */
  evaluate: (
    flagKey: string,
    context?: EvaluationContext,
  ) => Promise<EvaluationResult>;
  /**
   * Evaluates all flags for a given user context
   * @param {EvaluationContext} [context]
   * @returns {Promise<EvaluationResult[]>} Results for each flag with resolved value, reason and/or error
   */
  evaluateAll: (context?: EvaluationContext) => Promise<EvaluationResult[]>;
  /**
   * Evaluates a flag for a given user context
   * @param {string} flagKey
   * @param {FlagValue} defaultValue - Default fallback value
   * @param {EvaluationContext} [context]
   * @returns {Promise<FlagValue>} Resolved value. defaultValue if the flag doesn't exist
   */
  getFlagValue: (
    flagKey: string,
    defaultValue: FlagValue,
    context?: EvaluationContext,
  ) => Promise<FlagValue>;

  /**
   * Retrieves all flags
   * @returns {Promise<Flag[]>}
   */
  listFlags(): Promise<Flag[]>;
  /**
   * Retrieves a flag
   * @param {string} key
   * @returns {Promise<Flag>}
   */
  getFlag(key: string): Promise<Flag>;
  /**
   * Creates a flag
   * @param {Flag} flag
   * @returns {Promise<void>}
   */
  createFlag(flag: Flag): Promise<void>;
  /**
   * Updates a flag
   * @param {string} key
   * @param {UpdateFlagParams} flag
   * @returns {Promise<void>}
   * @throws {NotFoundError} if the flag doesn't exist
   */
  updateFlag(key: string, flag: UpdateFlagParams): Promise<void>;
  /**
   * Deletes a flag
   * @param {string} key
   * @returns {Promise<void>}
   * @throws {NotFoundError} if the flag doesn't exist
   */
  deleteFlag(key: string): Promise<void>;

  /**
   * Retrieves all flag overrides for all users and segments
   * @returns {Promise<Override[]>}
   */
  listOverrides: () => Promise<Override[]>;
  /**
   * Retrieves all overrides for a given flag
   * @param {string} flagKey
   * @returns {Promise<Override[]>}
   */
  getFlagOverrides: (flagKey: string) => Promise<Override[]>;
  /**
   * Retrieves all flag overrides for a given user
   * @param {string} targetingKey - Unique user identifier sent with evaluation context
   * @returns {Promise<UserOverride[]>}
   */
  getUserOverrides: (targetingKey: string) => Promise<UserOverride[]>;
  /**
   * Retrieves an override for a given user and flag
   * @param {string} flagKey
   * @param {string} targetingKey - Unique user identifier sent with evaluation context
   * @returns {Promise<UserOverride>}
   * @throws {NotFoundError} if the override doesn't exist
   */
  getUserOverride: (
    flagKey: string,
    targetingKey: string,
  ) => Promise<UserOverride>;
  /**
   * Sets a flag override for a given user
   * @param {string} flagKey
   * @param {string} targetingKey - Unique user identifier sent with evaluation context
   * @param {FlagValue} value
   * @returns {Promise<void>}
   * @throws {NotFoundError} if the flag doesn't exist
   */
  setUserOverride: (
    flagKey: string,
    targetingKey: string,
    value: FlagValue,
  ) => Promise<void>;
  /**
   * Deletes an override for a given user and flag
   * @param {string} flagkey
   * @param {string} targetingKey - Unique user identifier sent with evaluation context
   * @returns {Promise<void>}
   * @throws {NotFoundError} if the override doesn't exist
   */
  deleteUserOverride: (flagkey: string, targetingKey: string) => Promise<void>;
  /**
   * Retrieves all flag overrides tied to a segment
   * @returns {Promise<SegmentOverride[]>}
   */
  listSegmentOverrides: () => Promise<SegmentOverride[]>;
  /**
   * Retrieves all flag overrides for a given segment
   * @param {string} segmentKey
   * @returns {Promise<SegmentOverride[]>}
   */
  getSegmentOverrides: (segmentKey: string) => Promise<SegmentOverride[]>;
  /**
   * Sets an override for a given segment and flag
   * @param {string} segmentKey
   * @param {string} flagKey
   * @param {FlagValue} value
   * @returns {Promise<void>}
   */
  setSegmentOverride: (
    segmentKey: string,
    flagKey: string,
    value: FlagValue,
  ) => Promise<void>;
  /**
   * Deletes an override for a given segment and flag
   * @param {string} segmentKey
   * @param {string} flagkey
   * @returns {Promise<void>}
   */
  deleteSegmentOverride: (segmentKey: string, flagkey: string) => Promise<void>;

  /**
   * Retrieves all segments
   * @returns {Promise<Segment[]>}
   */
  listSegments: () => Promise<Segment[]>;
  /**
   * Creates a segment
   * @param {CreateSegmentParams} params
   * @returns {Promise<void>}
   */
  createSegment: (params: CreateSegmentParams) => Promise<void>;
  /**
   * Updates a segment
   * @param {string} key
   * @param {UpdateSegmentParams} segment
   * @returns {Promise<void>}
   */
  updateSegment: (key: string, segment: UpdateSegmentParams) => Promise<void>;
  /**
   * Deletes a segment
   * @param {string} key
   * @returns {Promise<void>}
   * @throws {NotFoundError} if the segment doesn't exist
   */
  deleteSegment: (key: string) => Promise<void>;

  /**
   * List of all evaluation and management API routes to be exposed by the backend
   */
  routes: ApiRoute[];
}
