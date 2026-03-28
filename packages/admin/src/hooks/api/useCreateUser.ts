import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "@/api/users";
import type { User } from "@/types/api";

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (user: User) => createUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
