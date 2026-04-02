import type { Flag, Override } from "../types/api";
import APIClient from "./client";

export async function listFlags() {
  return APIClient.get<Flag[]>("/flags");
}

export async function createFlag(flag: Flag) {
  return APIClient.post("/flags", flag);
}

export async function updateFlag(key: string, flag: Partial<Flag>) {
  return APIClient.put(`/flags/${encodeURIComponent(key)}`, flag);
}

export async function deleteFlag(key: string) {
  return APIClient.delete(`/flags/${encodeURIComponent(key)}`);
}

export async function getFlagOverrides(flagKey: string) {
  return APIClient.get<Override[]>(
    `/flags/${encodeURIComponent(flagKey)}/overrides`,
  );
}
