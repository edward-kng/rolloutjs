import { useQuery } from "@tanstack/react-query";
import { listOverrides } from "@/api/overrides";

export function useOverrides() {
  return useQuery({
    queryKey: ["overrides"],
    queryFn: async () => {
      const response = await listOverrides();

      return response.data;
    },
  });
}
