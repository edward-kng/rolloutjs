import { useQuery } from "@tanstack/react-query";
import { getAllFlags } from "../../api/flags";

export function useFlags() {
  return useQuery({
    queryKey: ["flags"],
    queryFn: async () => {
      const response = await getAllFlags();

      return response.data;
    },
  });
}
