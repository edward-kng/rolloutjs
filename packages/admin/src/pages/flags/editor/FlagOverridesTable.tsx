import { SearchInput } from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFlagOverrides } from "@/hooks/api/useFlagOverrides";
import { type Flag } from "@/types/api";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import FlagOverrideEditor from "./FlagOverrideEditor";
import { FlagValueCell } from "@/components/FlagValueCell";
import { useSetOverride } from "@/hooks/api/useSetOverride";
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
import { useDeleteOverride } from "@/hooks/api/useDeleteOverride";

interface FlagOverridesTableProps {
  flag: Flag;
}

export default function FlagOverridesTable({ flag }: FlagOverridesTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: overrides, isPending: isLoadingOverrides } = useFlagOverrides(
    flag.key,
  );
  const { mutate: setUserOverride } = useSetOverride(flag.key);
  const { mutate: deleteOverride } = useDeleteOverride();

  const filtered = (overrides ?? []).filter((override) =>
    override.targetingKey.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (isLoadingOverrides || !overrides) {
    return <Spinner />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Overrides</h2>
        <FlagOverrideEditor flag={flag} key="create">
          <Button size="sm" variant="outline" type="button">
            <Plus className="mr-1 h-4 w-4" />
            Add Override
          </Button>
        </FlagOverrideEditor>
      </div>
      <SearchInput
        placeholder="Search overrides..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Target</TableHead>
            <TableHead>Value</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {overrides.map((override) => (
            <TableRow key={override.targetingKey}>
              <FlagOverrideEditor override={override} flag={flag}>
                <TableCell>
                  <span className="text-sm hover:underline cursor-pointer">
                    {override.targetingKey}
                  </span>
                </TableCell>
              </FlagOverrideEditor>
              <TableCell>
                <FlagValueCell
                  value={override.value}
                  onChange={(value) =>
                    setUserOverride({
                      targetingKey: override.targetingKey,
                      value,
                    })
                  }
                />
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <FlagOverrideEditor override={override} flag={flag}>
                    <Button size="icon" variant="ghost" type="button">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </FlagOverrideEditor>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="icon" variant="outline">
                        <Button size="icon" variant="ghost" type="button">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete flag</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete override for{" "}
                          <span className="font-medium text-foreground">
                            {override.flagKey}
                          </span>
                          <span>{" and "}</span>
                          <span className="font-medium text-foreground">
                            {override.targetingKey}
                          </span>
                          ? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          variant="destructive"
                          onClick={() =>
                            deleteOverride({
                              targetingKey: override.targetingKey,
                              flagKey: override.flagKey,
                            })
                          }
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
              <TableCell colSpan={3}>
                {searchQuery
                  ? "No matching overrides found."
                  : "No overrides yet. Add an override to get started."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
