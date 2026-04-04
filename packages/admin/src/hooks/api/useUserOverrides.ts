import { useQuery } from "@tanstack/react-query";
import { getUserOverrides } from "../../api/overrides";

export function useUserOverrides(targetingKey: string) {
  return useQuery({
    queryKey: ["overrides", targetingKey],
    queryFn: async () => {
      const response = await getUserOverrides(targetingKey);

      return response.data;
    },
  });
}
