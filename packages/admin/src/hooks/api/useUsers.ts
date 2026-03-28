import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../../api/users";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await getAllUsers();

      return response.data;
    },
  });
}
