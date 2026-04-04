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
import { useNavigate } from "react-router";
import { Badge } from "@/components/ui/badge";
import { useSegments } from "@/hooks/api/useSegments";
import { useDeleteSegment } from "@/hooks/api/useDeleteSegment";
import { useOverrides } from "@/hooks/api/useOverrides";
import { ROUTES } from "@/constants/routes";
import type { Segment } from "libreflag";
import { Spinner } from "@/components/ui/spinner";

export default function SegmentsTable() {
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const { data: segments, isPending: isLoadingSegments } = useSegments();
  const { data: overrides } = useOverrides();
  const { mutate: deleteSegment } = useDeleteSegment();

  const filtered = (segments ?? []).filter(
    (segment) =>
      segment.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      segment.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  function getOverrideCount(segmentKey: string) {
    return (overrides ?? []).filter((o) => o.segmentKey === segmentKey).length;
  }

  function handleEdit(segment: Segment) {
    navigate(`${ROUTES.SEGMENTS}/${segment.key}`);
  }

  if (isLoadingSegments || !segments) {
    return <Spinner />;
  }

  return (
    <div className="flex flex-col gap-4">
      <SearchInput
        placeholder="Search segments..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Key</TableHead>
            <TableHead>Rules</TableHead>
            <TableHead>Overrides</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((segment) => (
            <TableRow key={segment.key}>
              <TableCell
                className="hover:underline cursor-pointer"
                onClick={() => handleEdit(segment)}
              >
                <span className="font-medium">
                  {segment.name || segment.key}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-sm">{segment.key}</span>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{segment.rules.length} rules</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {getOverrideCount(segment.key)} overrides
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleEdit(segment)}
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
                        <AlertDialogTitle>Delete segment</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete{" "}
                          <span className="font-medium text-foreground">
                            {segment.key}
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
                          onClick={() => deleteSegment(segment.key)}
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
                  ? "No matching segments found."
                  : "No segments yet. Create your first segment to get started."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
