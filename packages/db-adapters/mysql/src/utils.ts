import type {
  FlagValue,
  Flag,
  Segment,
  Override,
  Rule,
  UserOverride,
  SegmentOverride,
} from "libreflag";
import type { flagsTable, overridesTable, segmentsTable } from "./db/schema.js";

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
