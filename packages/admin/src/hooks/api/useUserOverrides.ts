import { useQuery } from "@tanstack/react-query";
import { getUserOverrides } from "../../api/users";

export function useUserOverrides(userKey: string | undefined) {
  return useQuery({
    queryKey: ["overrides", userKey],
    queryFn: async () => {
      const response = await getUserOverrides(userKey!);

      return response.data;
    },
    enabled: !!userKey,
  });
}
