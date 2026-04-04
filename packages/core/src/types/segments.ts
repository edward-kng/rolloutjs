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
] as const;

export type Operator = (typeof OPERATORS)[number];

export interface Condition {
  attribute: string;
  operator: Operator;
  value: string | number;
  negated: boolean;
}

export interface Rule {
  conditions: Condition[];
}

export interface Segment {
  key: string;
  name?: string;
  description?: string;
  rules: Rule[];
}

export type UpdateSegmentParams = Omit<Partial<Segment>, "key">;
