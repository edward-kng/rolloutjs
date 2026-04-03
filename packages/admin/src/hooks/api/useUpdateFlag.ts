import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateFlag } from "@/api/flags";
import type { Flag } from "libreflag";

export function useUpdateFlag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ key, flag }: { key: string; flag: Partial<Flag> }) =>
      updateFlag(key, flag),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flags"] });
    },
  });
}
