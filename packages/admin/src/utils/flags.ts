import type { FlagValue } from "@/types/api";

export function formatValue(value: FlagValue): string {
  if (typeof value === "object") return JSON.stringify(value);

  if (typeof value === "string") return `"${value}"`;

  return String(value);
}

export function serializeValue(value: FlagValue): string {
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}
