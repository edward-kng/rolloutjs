import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "@/api/users";
import type { User } from "@/types/api";

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ key, user }: { key: string; user: Partial<User> }) =>
      updateUser(key, user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
