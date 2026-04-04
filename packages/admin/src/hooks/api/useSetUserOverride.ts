import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setUserOverride } from "@/api/overrides";
import type { FlagValue } from "libreflag";

export function useSetUserOverride(flagKey: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      targetingKey,
      value,
    }: {
      targetingKey: string;
      value: FlagValue;
    }) => setUserOverride(targetingKey, flagKey, value),
    onSuccess: (_, { targetingKey }) => {
      queryClient.invalidateQueries({ queryKey: ["overrides", targetingKey] });
      queryClient.invalidateQueries({
        queryKey: ["flags", flagKey, "overrides"],
      });
    },
  });
}
