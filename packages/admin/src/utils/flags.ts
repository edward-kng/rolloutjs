import type { FlagValue } from "libreflag";
import type { ValueType } from "@/types/flags";

export function formatValue(value: FlagValue): string {
  if (typeof value === "object") return JSON.stringify(value);

  if (typeof value === "string") return `"${value}"`;

  return String(value);
}

export function serializeValue(value: FlagValue): string {
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export function coerceValue(raw: string, type: ValueType): FlagValue {
  switch (type) {
    case "boolean":
      return raw === "true";
    case "number":
      return Number(raw);
    case "json":
      return JSON.parse(raw);
    default:
      return raw;
  }
}

export function inferType(value: FlagValue): ValueType {
  if (typeof value === "object") return "json";
  return typeof value as ValueType;
}
