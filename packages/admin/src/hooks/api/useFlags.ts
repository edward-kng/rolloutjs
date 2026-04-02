import { useQuery } from "@tanstack/react-query";
import { getFlags } from "../../api/flags";

export function useFlags() {
  return useQuery({
    queryKey: ["flags"],
    queryFn: async () => {
      const response = await getFlags();

      return response.data;
    },
  });
}
