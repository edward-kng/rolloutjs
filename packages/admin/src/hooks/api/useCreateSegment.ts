import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSegment } from "@/api/segments";
import type { CreateSegmentParams } from "libreflag";

export function useCreateSegment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (segment: CreateSegmentParams) => createSegment(segment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["segments"] });
    },
  });
}
