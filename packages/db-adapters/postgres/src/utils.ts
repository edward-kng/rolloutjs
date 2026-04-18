import { DrizzleQueryError } from "drizzle-orm";
import type {
  FlagValue,
  Flag,
  Segment,
  Override,
  Rule,
  UserOverride,
  SegmentOverride,
} from "rolloutjs";
import type { flagsTable, overridesTable, segmentsTable } from "./db/schema.js";

function hasPgErrorCode(e: unknown, code: string): boolean {
  return (
    e instanceof DrizzleQueryError &&
    !!e.cause &&
    "code" in e.cause &&
    e.cause.code === code
  );
}

export function isUniqueViolation(e: unknown): boolean {
  return hasPgErrorCode(e, "23505");
}

export function isForeignKeyViolation(e: unknown): boolean {
  return hasPgErrorCode(e, "23503");
}

export function toFlag(row: typeof flagsTable.$inferSelect): Flag {
  return {
    key: row.key,
    name: row.name ?? undefined,
    description: row.description ?? undefined,
    defaultValue: row.default_value as FlagValue,
  };
}

export function toOverride(row: typeof overridesTable.$inferSelect): Override {
  return {
    flagKey: row.flag_key,
    targetingKey: row.targeting_key ?? undefined,
    segmentKey: row.segment_key ?? undefined,
    value: row.value as FlagValue,
  };
}

export function toUserOverride(
  row: typeof overridesTable.$inferSelect,
): UserOverride {
  return {
    flagKey: row.flag_key,
    targetingKey: row.targeting_key!,
    value: row.value as FlagValue,
  };
}

export function toSegmentOverride(
  row: typeof overridesTable.$inferSelect,
): SegmentOverride {
  return {
    flagKey: row.flag_key,
    segmentKey: row.segment_key!,
    value: row.value as FlagValue,
  };
}

export function toSegment(row: typeof segmentsTable.$inferSelect): Segment {
  return {
    key: row.key,
    name: row.name ?? undefined,
    description: row.description ?? undefined,
    rules: row.rules as Rule[],
    priority: row.priority,
  };
}
