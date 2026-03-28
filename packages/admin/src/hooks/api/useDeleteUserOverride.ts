import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUserOverride } from "@/api/users";

export function useDeleteUserOverride(userKey: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (flagKey: string) => deleteUserOverride(userKey, flagKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["overrides", userKey] });
    },
  });
}
