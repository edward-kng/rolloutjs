import apiClient from "./client";
import type {
  CreateSegmentParams,
  FlagValue,
  Override,
  Segment,
} from "rolloutjs";

export async function listSegments() {
  return apiClient.get<Segment[]>("/segments");
}

export async function createSegment(segment: CreateSegmentParams) {
  return apiClient.post("/segments", segment);
}

export async function updateSegment(key: string, segment: Partial<Segment>) {
  return apiClient.put(`/segments/${encodeURIComponent(key)}`, segment);
}

export async function deleteSegment(key: string) {
  return apiClient.delete(`/segments/${encodeURIComponent(key)}`);
}

export async function getSegmentOverrides(segmentKey: string) {
  return apiClient.get<Override[]>(
    `/segments/${encodeURIComponent(segmentKey)}/overrides`,
  );
}

export async function deleteSegmentOverride(
  segmentKey: string,
  flagKey: string,
) {
  return apiClient.delete(
    `/segments/${encodeURIComponent(segmentKey)}/overrides/${encodeURIComponent(flagKey)}`,
  );
}

export async function setSegmentOverride(
  segmentKey: string,
  flagKey: string,
  value: FlagValue,
) {
  return apiClient.put(
    `/segments/${encodeURIComponent(segmentKey)}/overrides/${encodeURIComponent(flagKey)}`,
    { value },
  );
}
