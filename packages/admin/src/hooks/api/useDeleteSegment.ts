import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSegment } from "@/api/segments";

export function useDeleteSegment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (key: string) => deleteSegment(key),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["segments"] });
    },
  });
}
