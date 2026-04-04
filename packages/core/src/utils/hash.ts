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

/**
 * Uses the FNV-1a hash algorithm to determine the rollout probability for a given target
 */
export function getRolloutHash(targetingKey: string, segmentKey: string) {
  const input = `${targetingKey}:${segmentKey}`;
  let h = 0x811c9dc5;

  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }

  return (h >>> 0) % 100;
}
