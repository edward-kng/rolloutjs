import apiClient from "./client";
import type { Flag, Override } from "libreflag";

export async function listFlags() {
  return apiClient.get<Flag[]>("/flags");
}

export async function createFlag(flag: Flag) {
  return apiClient.post("/flags", flag);
}

export async function updateFlag(key: string, flag: Partial<Flag>) {
  return apiClient.put(`/flags/${encodeURIComponent(key)}`, flag);
}

export async function deleteFlag(key: string) {
  return apiClient.delete(`/flags/${encodeURIComponent(key)}`);
}

export async function getFlagOverrides(flagKey: string) {
  return apiClient.get<Override[]>(
    `/flags/${encodeURIComponent(flagKey)}/overrides`,
  );
}
