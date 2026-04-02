import { SearchInput } from "@/components/SearchInput";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { inferType } from "@/utils/flags";
import { useNavigate } from "react-router";
import { FlagValueCell } from "@/components/FlagValueCell";
import { Badge } from "@/components/ui/badge";
import { useFlags } from "@/hooks/api/useFlags";
import { useDeleteFlag } from "@/hooks/api/useDeleteFlag";
import { ROUTES } from "@/constants/routes";
import type { Flag } from "@/types/api";
import { Spinner } from "@/components/ui/spinner";

export default function FlagsTable() {
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const { data: flags, isPending: isLoadingFlags } = useFlags();
  const { mutate: deleteFlag } = useDeleteFlag();

  const filtered = (flags ?? []).filter((flag) =>
    flag.key.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  function handleEdit(flag: Flag) {
    navigate(`${ROUTES.FLAGS}/${flag.key}`);
  }

  if (isLoadingFlags || !flags) {
    return <Spinner />;
  }

  return (
    <div className="flex flex-col gap-4">
      <SearchInput
        placeholder="Search flags..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Key</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Value</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((flag) => (
            <TableRow key={flag.key}>
              <TableCell
                className="hover:underline cursor-pointer"
                onClick={() => handleEdit(flag)}
              >
                <span className="font-medium">{flag.key}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm">{flag.key}</span>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {inferType(flag.defaultValue)}
                </Badge>
              </TableCell>
              <TableCell>
                <FlagValueCell value={flag.defaultValue} />
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleEdit(flag)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="icon" variant="outline">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete flag</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete{" "}
                          <span className="font-medium text-foreground">
                            {flag.key}
                          </span>
                          {
                            " and all associated overrides? This action cannot be undone."
                          }
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          variant="destructive"
                          onClick={() => deleteFlag(flag.key)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {filtered.length === 0 && (
            <TableRow className="py-8 text-muted-foreground">
              <TableCell colSpan={5}>
                {searchQuery
                  ? "No matching flags found."
                  : "No flags yet. Create your first flag to get started."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
