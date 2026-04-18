import { SearchInput } from "@/components/search-input";
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
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";
import { Badge } from "@/components/ui/badge";
import { useSegments } from "@/hooks/api/useSegments";
import { useDeleteSegment } from "@/hooks/api/useDeleteSegment";
import { useUpdateSegment } from "@/hooks/api/useUpdateSegment";
import { useOverrides } from "@/hooks/api/useOverrides";
import { ROUTES } from "@/constants/routes";
import type { Segment } from "rolloutjs";
import { Spinner } from "@/components/ui/spinner";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";

function SortableRow({
  segment,
  overrideCount,
  onEdit,
  onDelete,
  disabled,
}: {
  segment: Segment;
  overrideCount: number;
  onEdit: (segment: Segment) => void;
  onDelete: (key: string) => void;
  disabled: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: segment.key, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={isDragging ? "opacity-50" : undefined}
    >
      <TableCell className="w-8">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab touch-none text-muted-foreground hover:text-foreground disabled:cursor-default disabled:opacity-0"
          disabled={disabled}
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </TableCell>
      <TableCell
        className="hover:underline cursor-pointer"
        onClick={() => onEdit(segment)}
      >
        <span className="font-medium">{segment.name || segment.key}</span>
      </TableCell>
      <TableCell>
        <span className="text-sm">{segment.key}</span>
      </TableCell>
      <TableCell>
        <Badge variant="secondary">{segment.rules.length} rules</Badge>
      </TableCell>
      <TableCell>
        <Badge variant="outline">{overrideCount} overrides</Badge>
      </TableCell>
      <TableCell>
        <div className="flex gap-1">
          <Button size="icon" variant="outline" onClick={() => onEdit(segment)}>
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
                  onClick={() => onDelete(segment.key)}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default function SegmentsTable() {
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const { data: segments, isPending: isLoadingSegments } = useSegments();
  const { data: overrides } = useOverrides();
  const { mutate: deleteSegment } = useDeleteSegment();
  const { mutate: updateSegment } = useUpdateSegment();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor),
  );

  const filtered = (segments ?? []).filter(
    (segment) =>
      segment.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      segment.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const isSearching = searchQuery.length > 0;

  function getOverrideCount(segmentKey: string) {
    return (overrides ?? []).filter((o) => o.segmentKey === segmentKey).length;
  }

  function handleEdit(segment: Segment) {
    navigate(`${ROUTES.SEGMENTS}/${segment.key}`);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over, delta } = event;
    if (!over || active.id === over.id || !segments) return;

    const oldIndex = segments.findIndex((s) => s.key === active.id);
    const newIndex = segments.findIndex((s) => s.key === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const priority = delta.y > 0 ? newIndex + 1 : newIndex;

    updateSegment({
      key: segments[oldIndex].key,
      segment: { priority },
    });
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

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={filtered.map((s) => s.key)}
          strategy={verticalListSortingStrategy}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8" />
                <TableHead>Name</TableHead>
                <TableHead>Key</TableHead>
                <TableHead>Rules</TableHead>
                <TableHead>Overrides</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((segment) => (
                <SortableRow
                  key={segment.key}
                  segment={segment}
                  overrideCount={getOverrideCount(segment.key)}
                  onEdit={handleEdit}
                  onDelete={deleteSegment}
                  disabled={isSearching}
                />
              ))}
              {filtered.length === 0 && (
                <TableRow className="py-8 text-muted-foreground">
                  <TableCell colSpan={6}>
                    {searchQuery
                      ? "No matching segments found."
                      : "No segments yet. Create your first segment to get started."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </SortableContext>
      </DndContext>
    </div>
  );
}
