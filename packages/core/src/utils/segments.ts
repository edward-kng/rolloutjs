import type { EvaluationContext } from "@openfeature/core";
import type { Condition, Segment } from "../types/segments.js";
import { getRolloutHash } from "./hash.js";
import type { Transaction } from "../types/store.js";

export function isMember(context: EvaluationContext, segment: Segment) {
  for (const rule of segment.rules) {
    if (
      rule.conditions.reduce(
        (prev, curr) => prev && evaluateCondition(context, curr, segment.key),
        true,
      )
    ) {
      return true;
    }
  }

  return false;
}

function evaluateCondition(
  context: EvaluationContext,
  condition: Condition,
  segmentKey: string,
) {
  let match = false;
  const contextValue = context[condition.attribute];
  const ruleValue = condition.value;

  switch (condition.operator) {
    case "eq":
      match = contextValue?.toString() === ruleValue.toString();
      break;
    case "starts_with":
      match =
        contextValue?.toString().startsWith(ruleValue.toString()) ?? false;
      break;
    case "ends_with":
      match = contextValue?.toString().endsWith(ruleValue.toString()) ?? false;
      break;
    case "matches_regex":
      match =
        typeof contextValue === "string" &&
        new RegExp(ruleValue.toString()).test(contextValue);
      break;
    case "contains":
      match = contextValue?.toString().includes(ruleValue.toString()) ?? false;
      break;
    case "gt":
      match = Number(contextValue) > Number(ruleValue);
      break;
    case "gte":
      match = Number(contextValue) >= Number(ruleValue);
      break;
    case "lt":
      match = Number(contextValue) < Number(ruleValue);
      break;
    case "lte":
      match = Number(contextValue) <= Number(ruleValue);
      break;
    case "in": {
      const arr = ruleValue.toString().split(",");
      match =
        !!contextValue?.toString() && arr.includes(contextValue.toString());
      break;
    }
    case "exists":
      match = contextValue !== null && contextValue !== undefined;
      break;
    case "percent":
      match =
        !!context.targetingKey &&
        getRolloutHash(context.targetingKey, segmentKey) <= Number(ruleValue);
  }

  return match !== condition.negated;
}

/**
 * Calculates the priority of the created/updated segment relative to its neighbours. If there is no gap between them, priorities are rebalanced
 */
export async function getSegmentPriority(store: Transaction, index?: number) {
  const GAP = 1000;

  if (index === undefined) {
    const maxPriority = await store.getMaxSegmentPriority();

    return maxPriority === null ? 0 : maxPriority + GAP;
  }

  const prev =
    index > 0 ? await store.getSegmentPriorityByIndex(index - 1) : null;
  const next = await store.getSegmentPriorityByIndex(index);

  if (prev === null && next === null) return 0;

  if (prev === null) return next! - GAP;

  if (next === null) return prev + GAP;

  if (next - prev > 1) return Math.floor((next + prev) / 2);

  const segments = await store.listSegments();

  for (let i = 0; i < segments.length; i++) {
    await store.updateSegment(segments[i].key, {
      priority: i * GAP,
    });
  }

  return (index - 1) * GAP + GAP / 2;
}
