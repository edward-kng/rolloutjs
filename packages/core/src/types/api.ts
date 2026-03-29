import type { FlagValue } from "@openfeature/server-sdk";

export interface ApiResponse<T extends object | undefined = undefined> {
  status: number;
  body?: T | undefined;
  errorCode?: string;
  etag?: string;
}

export interface Flag {
  key: string;
  defaultValue: FlagValue;
}

export interface User {
  key: string;
  attributes: Record<string, unknown>;
}

export interface UserOverride {
  flagKey: string;
  value: FlagValue;
}
