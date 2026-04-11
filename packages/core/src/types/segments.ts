export const OPERATORS = [
  "eq",
  "starts_with",
  "ends_with",
  "matches_regex",
  "contains",
  "gt",
  "gte",
  "lt",
  "lte",
  "in",
  "exists",
  "percent",
] as const;

export type Operator = (typeof OPERATORS)[number];

export interface Condition {
  attribute: string;
  operator: Operator;
  value: string | number;
  /**
   * Negates the condition if true (logical NOT)
   */
  negated: boolean;
}

export interface Rule {
  /**
   * List of conditions that must be true for the rule to apply (logical AND)
   */
  conditions: Condition[];
}

export interface Segment {
  /**
   * Unique identifier for the segment
   */
  key: string;
  name?: string;
  description?: string;
  /**
   * List of rules that determine membership if any rule is true (logical OR)
   */
  rules: Rule[];
  /**
   * 0-indexed priority for segment overrides when a user is member of more than one segment.
   * Lower priority means higher precedence.
   */
  priority: number;
}

export interface CreateSegmentParams extends Omit<Segment, "priority"> {
  /**
   * 0-indexed priority for segment overrides when a user is member of more than one segment.
   * Lower priority means higher precedence.
   */
  priority?: number;
}

export type UpdateSegmentParams = Omit<Partial<Segment>, "key">;
