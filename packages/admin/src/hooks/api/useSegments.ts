import { useQuery } from "@tanstack/react-query";
import { listSegments } from "../../api/segments";

export function useSegments() {
  return useQuery({
    queryKey: ["segments"],
    queryFn: async () => {
      const response = await listSegments();

      return response.data;
    },
  });
}
