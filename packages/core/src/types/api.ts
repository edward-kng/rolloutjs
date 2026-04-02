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
  targetingKey: string;
  value: FlagValue;
}
