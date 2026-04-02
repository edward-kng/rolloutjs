import { useQuery } from "@tanstack/react-query";
import { getFlagOverrides } from "@/api/flags";

export function useFlagOverrides(flagkey: string) {
  return useQuery({
    queryKey: ["flags", flagkey, "overrides"],
    queryFn: async () => {
      const response = await getFlagOverrides(flagkey);

      return response.data;
    },
  });
}
