import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFlag } from "@/api/flags";

export function useDeleteFlag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (key: string) => deleteFlag(key),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flags"] });
    },
  });
}
