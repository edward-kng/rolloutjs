import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSegmentOverride } from "@/api/segments";

export function useDeleteSegmentOverride() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      segmentKey,
      flagKey,
    }: {
      segmentKey: string;
      flagKey: string;
    }) => deleteSegmentOverride(segmentKey, flagKey),
    onSuccess: (_, { flagKey }) => {
      queryClient.invalidateQueries({
        queryKey: ["flags", flagKey, "overrides"],
      });
    },
  });
}
