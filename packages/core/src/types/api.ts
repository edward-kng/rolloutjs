import type { FlagValue } from "@openfeature/server-sdk";

export interface ApiResponse<T extends object | undefined = undefined> {
  status: number;
  body?: T | undefined;
  errorCode?: string;
}

export interface Flag {
  key: string;
  defaultValue: FlagValue;
}
