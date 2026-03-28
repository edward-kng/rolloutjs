import { SearchInput } from "@/components/SearchInput";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { User } from "@/types/api";
import { useState } from "react";
import UserEditView from "./UserEditView";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface UsersTableProps {
  users: User[];
}

export default function UsersTable({ users }: UsersTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const filtered = users.filter((user) =>
    user.key.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <SearchInput
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button onClick={() => setIsCreating(true)}>
          <Plus />
          Create user
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Key</TableHead>
              <TableHead>Attributes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length > 0 ? (
              filtered.map((user) => (
                <TableRow key={user.key}>
                  <TableCell
                    className="font-mono font-medium px-4 py-3 text-white hover:underline cursor-pointer"
                    onClick={() => setUserToEdit(user)}
                  >
                    {user.key}
                  </TableCell>
                  <TableCell className="font-mono text-muted-foreground px-4 py-3">
                    {JSON.stringify(user.attributes)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2}>No users found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <UserEditView
        user={userToEdit ?? undefined}
        open={userToEdit !== null || isCreating}
        onOpenChange={(open) => {
          if (!open) setUserToEdit(null);
          setIsCreating(false);
        }}
        key={userToEdit?.key}
      />
    </div>
  );
}
