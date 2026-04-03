import { useQuery } from "@tanstack/react-query";
import { getSegmentOverrides } from "@/api/segments";

export function useSegmentOverrides(segmentKey: string) {
  return useQuery({
    queryKey: ["segments", segmentKey, "overrides"],
    queryFn: async () => {
      const response = await getSegmentOverrides(segmentKey);

      return response.data;
    },
  });
}
