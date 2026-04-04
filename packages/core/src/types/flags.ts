import type { FlagValue } from "@openfeature/core";

export interface Flag {
  key: string;
  defaultValue: FlagValue;
}

export type UpdateFlagParams = Omit<Partial<Flag>, "key">;
