import APIClient from "./client";
import type { Override, Segment } from "libreflag";

export async function listSegments() {
  return APIClient.get<Segment[]>("/segments");
}

export async function createSegment(segment: Segment) {
  return APIClient.post("/segments", segment);
}

export async function updateSegment(key: string, segment: Partial<Segment>) {
  return APIClient.put(`/segments/${encodeURIComponent(key)}`, segment);
}

export async function deleteSegment(key: string) {
  return APIClient.delete(`/segments/${encodeURIComponent(key)}`);
}

export async function getSegmentOverrides(segmentKey: string) {
  return APIClient.get<Override[]>(
    `/segments/${encodeURIComponent(segmentKey)}/overrides`,
  );
}
