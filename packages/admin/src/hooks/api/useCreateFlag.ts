import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFlag } from "@/api/flags";
import type { Flag } from "rolloutjs";

export function useCreateFlag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (flag: Flag) => createFlag(flag),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flags"] });
    },
  });
}
