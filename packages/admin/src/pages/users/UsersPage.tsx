import { useUsers } from "@/hooks/api/useUsers";
import UsersTable from "./UsersTable";

export default function UsersPage() {
  const { data: users } = useUsers();

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Users</h1>
      </div>

      <UsersTable users={users ?? []} />
    </div>
  );
}
