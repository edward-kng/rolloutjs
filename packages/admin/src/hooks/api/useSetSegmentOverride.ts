import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setSegmentOverride } from "@/api/segments";
import type { FlagValue } from "libreflag";

export function useSetSegmentOverride(flagKey: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      segmentKey,
      value,
    }: {
      segmentKey: string;
      value: FlagValue;
    }) => setSegmentOverride(segmentKey, flagKey, value),
    onSuccess: (_, { segmentKey }) => {
      queryClient.invalidateQueries({
        queryKey: ["segments", segmentKey, "overrides"],
      });
      queryClient.invalidateQueries({
        queryKey: ["flags", flagKey, "overrides"],
      });
    },
  });
}
