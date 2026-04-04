import type { EvaluationContext } from "@openfeature/core";
import type { Condition, Segment } from "../types/api.js";

export function isMember(context: EvaluationContext, segment: Segment) {
  for (const rule of segment.rules) {
    if (
      rule.conditions.reduce(
        (prev, curr) => prev && evaluateCondition(context, curr),
        true,
      )
    ) {
      return true;
    }
  }
}

function evaluateCondition(context: EvaluationContext, condition: Condition) {
  let match = false;
  const contextValue = context[condition.attribute];
  const ruleValue = condition.value;

  if (contextValue === null || contextValue === undefined) {
    return (condition.operator === "exists") !== condition.negated;
  }

  switch (condition.operator) {
    case "eq":
      match = contextValue.toString() === ruleValue.toString();
      break;
    case "starts_with":
      match = contextValue.toString().startsWith(ruleValue.toString());
      break;
    case "ends_with":
      match = contextValue.toString().endsWith(ruleValue.toString());
      break;
    case "matches_regex":
      match =
        typeof contextValue === "string" &&
        new RegExp(ruleValue.toString()).test(contextValue);
      break;
    case "contains":
      match = contextValue.toString().includes(ruleValue.toString());
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
      match = arr.includes(contextValue.toString());
      break;
    }
    case "exists":
      match = true;
  }

  return match !== condition.negated;
}
