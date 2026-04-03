import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSegment } from "@/api/segments";
import type { Segment } from "libreflag";

export function useCreateSegment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (segment: Segment) => createSegment(segment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["segments"] });
    },
  });
}
