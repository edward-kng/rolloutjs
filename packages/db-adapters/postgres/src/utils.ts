import type {
  FlagValue,
  StoredFlag,
  StoredOverride,
  StoredSegment,
} from "libreflag";
import type { flagsTable, overridesTable, segmentsTable } from "./db/schema.js";

export function toStoredFlag(row: typeof flagsTable.$inferSelect): StoredFlag {
  return {
    key: row.key,
    defaultValue: row.default_value as FlagValue,
  };
}

export function toStoredOverride(
  row: typeof overridesTable.$inferSelect,
): StoredOverride {
  return {
    flagKey: row.flag_key,
    targetingKey: row.targeting_key ?? undefined,
    segmentKey: row.segment_key ?? undefined,
    value: row.value as FlagValue,
  };
}

export function toStoredSegment(
  row: typeof segmentsTable.$inferSelect,
): StoredSegment {
  return {
    key: row.key,
    rules: row.rules as StoredSegment["rules"],
  };
}
