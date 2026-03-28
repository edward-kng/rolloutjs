export type FlagValue = boolean | string | number | object;

export type Flag = {
  key: string;
  defaultValue: FlagValue;
};

export type User = {
  key: string;
  attributes: Record<string, unknown>;
};

export type UserOverride = {
  flagKey: string;
  value: FlagValue;
};
