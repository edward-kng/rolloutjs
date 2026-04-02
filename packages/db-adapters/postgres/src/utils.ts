import type { FlagValue, StoredFlag, StoredOverride } from "libreflag";
import type { flagsTable, overridesTable } from "./db/schema.js";

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
    flagKey: row.flag_key as string,
    targetingKey: row.targeting_key,
    value: row.value as FlagValue,
  };
}
