import type { User, UserOverride, FlagValue } from "../types/api";
import APIClient from "./client";

export async function getAllUsers() {
  return APIClient.get<User[]>("/users");
}

export async function createUser(user: User) {
  return APIClient.post<User>("/users", user);
}

export async function updateUser(key: string, user: Partial<User>) {
  return APIClient.put<User>(`/users/${encodeURIComponent(key)}`, user);
}

export async function deleteUser(key: string) {
  return APIClient.delete(`/users/${encodeURIComponent(key)}`);
}

export async function getUserOverrides(userKey: string) {
  return APIClient.get<UserOverride[]>(
    `/users/${encodeURIComponent(userKey)}/overrides`,
  );
}

export async function setUserOverride(
  userKey: string,
  flagKey: string,
  value: FlagValue,
) {
  return APIClient.put(
    `/users/${encodeURIComponent(userKey)}/overrides/${encodeURIComponent(flagKey)}`,
    { value },
  );
}

export async function deleteUserOverride(userKey: string, flagKey: string) {
  return APIClient.delete(
    `/users/${encodeURIComponent(userKey)}/overrides/${encodeURIComponent(flagKey)}`,
  );
}
