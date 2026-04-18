import type { FlagValue, Override, UserOverride } from "rolloutjs";
import apiClient from "./client";

export async function listOverrides() {
  return apiClient.get<Override[]>("/overrides");
}

export async function getUserOverrides(targetingKey: string) {
  return apiClient.get<UserOverride[]>(
    `/overrides/${encodeURIComponent(targetingKey)}`,
  );
}

export async function setUserOverride(
  targetingKey: string,
  flagKey: string,
  value: FlagValue,
) {
  return apiClient.put(
    `/overrides/${encodeURIComponent(targetingKey)}/${encodeURIComponent(flagKey)}`,
    { value },
  );
}

export async function deleteUserOverride(
  targetingKey: string,
  flagKey: string,
) {
  return apiClient.delete(
    `/overrides/${encodeURIComponent(targetingKey)}/${encodeURIComponent(flagKey)}`,
  );
}
