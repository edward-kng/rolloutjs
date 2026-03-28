import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setUserOverride } from "@/api/users";
import type { FlagValue } from "@/types/api";

export function useSetUserOverride(userKey: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ flagKey, value }: { flagKey: string; value: FlagValue }) =>
      setUserOverride(userKey, flagKey, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["overrides", userKey] });
    },
  });
}
