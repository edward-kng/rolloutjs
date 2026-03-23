import type { FlagValue } from "@openfeature/server-sdk";

export type APIResponse = {
  status: number;
  body?: object;
};

export type Flag = {
  key: string;
  defaultValue: FlagValue;
};
