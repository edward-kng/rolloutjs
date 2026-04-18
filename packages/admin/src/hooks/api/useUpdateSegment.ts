import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSegment } from "@/api/segments";
import type { Segment } from "rolloutjs";

export function useUpdateSegment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      key,
      segment,
    }: {
      key: string;
      segment: Partial<Segment>;
    }) => updateSegment(key, segment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["segments"] });
    },
  });
}
