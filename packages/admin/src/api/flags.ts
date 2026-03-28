import type { Flag } from "../types/api";
import APIClient from "./client";

export async function getAllFlags() {
  return APIClient.get<Flag[]>("/flags");
}

export async function createFlag(flag: Flag) {
  return APIClient.post<Flag>("/flags", flag);
}

export async function updateFlag(key: string, flag: Partial<Flag>) {
  return APIClient.put<Flag>(`/flags/${encodeURIComponent(key)}`, flag);
}

export async function deleteFlag(key: string) {
  return APIClient.delete(`/flags/${encodeURIComponent(key)}`);
}
