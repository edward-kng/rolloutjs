import type { FlagValue } from "@openfeature/core";

export interface Flag {
  key: string;
  name?: string;
  description?: string;
  defaultValue: FlagValue;
}

export type UpdateFlagParams = Omit<Partial<Flag>, "key">;
