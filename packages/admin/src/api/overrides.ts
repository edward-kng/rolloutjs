import type { FlagValue, Override, UserOverride } from "libreflag";
import APIClient from "./client";

export async function listOverrides() {
  return APIClient.get<Override[]>("/overrides");
}

export async function getUserOverrides(targetingKey: string) {
  return APIClient.get<UserOverride[]>(
    `/overrides/${encodeURIComponent(targetingKey)}`,
  );
}

export async function setUserOverride(
  targetingKey: string,
  flagKey: string,
  value: FlagValue,
) {
  return APIClient.put(
    `/overrides/${encodeURIComponent(targetingKey)}/${encodeURIComponent(flagKey)}`,
    { value },
  );
}

export async function deleteUserOverride(
  targetingKey: string,
  flagKey: string,
) {
  return APIClient.delete(
    `/overrides/${encodeURIComponent(targetingKey)}/${encodeURIComponent(flagKey)}`,
  );
}
