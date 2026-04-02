import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUserOverride } from "@/api/overrides";

export function useDeleteOverride() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      targetingKey,
      flagKey,
    }: {
      targetingKey: string;
      flagKey: string;
    }) => deleteUserOverride(targetingKey, flagKey),
    onSuccess: (_, { flagKey }) => {
      queryClient.invalidateQueries({
        queryKey: ["flags", flagKey, "overrides"],
      });
    },
  });
}
