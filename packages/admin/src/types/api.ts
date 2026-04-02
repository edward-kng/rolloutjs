export type FlagValue = boolean | string | number | object;

export type Flag = {
  key: string;
  defaultValue: FlagValue;
};

export type Override = {
  flagKey: string;
  targetingKey: string;
  value: FlagValue;
};
