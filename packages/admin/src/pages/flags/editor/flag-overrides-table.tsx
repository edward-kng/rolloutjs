import { SearchInput } from "@/components/search-input";
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
import { type Flag } from "libreflag";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import FlagOverrideEditor from "./flag-override-editor";
import { FlagValueCell } from "@/components/flag-value-cell";
import { useSetUserOverride } from "@/hooks/api/useSetUserOverride";
import { useSetSegmentOverride } from "@/hooks/api/useSetSegmentOverride";
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
import { useDeleteUserOverride } from "@/hooks/api/useDeleteUserOverride";
import { useDeleteSegmentOverride } from "@/hooks/api/useDeleteSegmentOverride";
import { cn } from "@/utils/ui";

interface FlagOverridesTableProps {
  flag: Flag;
}

export default function FlagOverridesTable({ flag }: FlagOverridesTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [mode, setMode] = useState<"users" | "segments">("users");

  const { data: overrides, isPending: isLoadingOverrides } = useFlagOverrides(
    flag.key,
  );
  const { mutate: setUserOverride } = useSetUserOverride(flag.key);
  const { mutate: setSegmentOverride } = useSetSegmentOverride(flag.key);
  const { mutate: deleteUserOverride } = useDeleteUserOverride();
  const { mutate: deleteSegmentOverride } = useDeleteSegmentOverride();

  const filtered = (overrides ?? [])
    .filter((override) => (mode === "users") === !!override.targetingKey)
    .filter((override) => (mode === "segments") === !!override.segmentKey)
    .filter(
      (override) =>
        override?.targetingKey
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        override?.segmentKey?.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  if (isLoadingOverrides || !overrides) {
    return <Spinner />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Overrides</h2>
        <FlagOverrideEditor flag={flag} key="create" mode={mode}>
          <Button size="sm" variant="outline" type="button">
            <Plus className="mr-1 h-4 w-4" />
            Add Override
          </Button>
        </FlagOverrideEditor>
      </div>
      <div className="flex items-center justify-between">
        <SearchInput
          placeholder="Search overrides..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex items-center justify-between">
          <div className="flex gap-1 rounded-md border p-0.5">
            <button
              type="button"
              className={cn(
                "rounded p-2 text-xs transition-colors",
                mode === "users"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
              onClick={() => setMode("users")}
            >
              Users
            </button>
            <button
              type="button"
              className={cn(
                "rounded p-2 text-xs transition-colors",
                mode === "segments"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
              onClick={() => setMode("segments")}
            >
              Segments
            </button>
          </div>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Target</TableHead>
            <TableHead>Value</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((override) => (
            <TableRow key={override.targetingKey}>
              <FlagOverrideEditor override={override} flag={flag} mode={mode}>
                <TableCell>
                  <span className="text-sm hover:underline cursor-pointer">
                    {mode === "users"
                      ? override.targetingKey
                      : override.segmentKey}
                  </span>
                </TableCell>
              </FlagOverrideEditor>
              <TableCell>
                <FlagValueCell
                  value={override.value}
                  onChange={(value) =>
                    override.segmentKey
                      ? setSegmentOverride({
                          segmentKey: override.segmentKey,
                          value,
                        })
                      : setUserOverride({
                          targetingKey: override.targetingKey!,
                          value,
                        })
                  }
                />
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <FlagOverrideEditor
                    override={override}
                    flag={flag}
                    mode={mode}
                  >
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
                            {override.targetingKey ?? override.segmentKey}
                          </span>
                          ? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          variant="destructive"
                          onClick={() =>
                            override.segmentKey
                              ? deleteSegmentOverride({
                                  segmentKey: override.segmentKey,
                                  flagKey: override.flagKey,
                                })
                              : deleteUserOverride({
                                  targetingKey: override.targetingKey!,
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
