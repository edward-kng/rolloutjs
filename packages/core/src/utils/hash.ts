import type { EvaluationContext } from "@openfeature/core";

export function hashContext(
  context: EvaluationContext | undefined,
  version: number,
): string {
  const input = JSON.stringify(context ?? {}) + String(version);

  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }

  return (hash >>> 0).toString(36);
}
