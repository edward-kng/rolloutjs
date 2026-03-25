import type { Flag } from "../types/api";
import APIClient from "./client";

export async function getAllFlags() {
  return APIClient.get<Flag[]>("/flags");
}
