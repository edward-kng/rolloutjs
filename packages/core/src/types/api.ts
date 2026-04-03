import type { FlagValue } from "@openfeature/core";

export interface ApiResponse<T extends object | undefined = undefined> {
  status: number;
  body?: T | string | undefined;
  etag?: string;
}

export interface Flag {
  key: string;
  defaultValue: FlagValue;
}

export type UpdateFlagParams = Omit<Partial<Flag>, "key">;

export interface Override {
  flagKey: string;
  targetingKey?: string;
  segmentKey?: string;
  value: FlagValue;
}

export type Operator =
  | "eq"
  | "starts_with"
  | "ends_with"
  | "matches_regex"
  | "contains"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "in"
  | "exists";

export interface Condition {
  attribute: string;
  operator: Operator;
  value: boolean | string | number | string[] | number[];
  negated: boolean;
}

export interface Rule {
  conditions: Condition[];
}

export interface Segment {
  key: string;
  rules: Rule[];
}

export type UpdateSegmentParams = Omit<Partial<Segment>, "key">;
