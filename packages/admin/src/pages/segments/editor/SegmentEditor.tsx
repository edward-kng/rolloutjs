import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useCreateSegment } from "@/hooks/api/useCreateSegment";
import { useSegments } from "@/hooks/api/useSegments";
import { useUpdateSegment } from "@/hooks/api/useUpdateSegment";
import type { Segment } from "libreflag";
import { useState, type SubmitEvent } from "react";
import RulesEditor from "./RulesEditor";

interface SegmentEditorProps {
  segment?: Segment;
  onClose: () => void;
}

export default function SegmentEditor({
  segment,
  onClose,
}: SegmentEditorProps) {
  const [name, setName] = useState(segment?.name ?? "");
  const [key, setKey] = useState(segment?.key ?? "");
  const [description, setDescription] = useState(segment?.description ?? "");
  const [rules, setRules] = useState(segment?.rules ?? []);

  const { data: segments } = useSegments();
  const { mutateAsync: updateSegment, isPending: isUpdating } =
    useUpdateSegment();
  const { mutateAsync: createSegment, isPending: isCreating } =
    useCreateSegment();

  const invalidKey = !segment && !!segments?.find((s) => s.key === key);
  const isPending = isUpdating || isCreating;

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    const updatedRules = rules
      .map((rule) => ({
        conditions: rule.conditions.filter(
          (condition) =>
            !!condition.attribute || condition.operator === "percent",
        ),
      }))
      .filter((rule) => rule.conditions.length >= 0);

    if (segment) {
      await updateSegment({
        key,
        segment: {
          name,
          description,
          rules: updatedRules,
        },
      });
    } else {
      await createSegment({
        key,
        name,
        description,
        rules: updatedRules,
      });
    }

    onClose();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My Segment"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="key">Key</Label>
          <Input
            id="key"
            value={key}
            onChange={(e) => {
              setKey(e.target.value);
            }}
            placeholder="my-segment"
            required
            disabled={!!segment}
            className="font-mono"
          />
          {invalidKey && (
            <p className="text-sm text-destructive">
              A segment with this key already exists.
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What does this segment target?"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label>Rules</Label>
        <RulesEditor rules={rules} setRules={setRules} />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={!key || invalidKey || isPending}>
          {isPending ? (
            <Spinner />
          ) : segment ? (
            "Save Changes"
          ) : (
            "Create Segment"
          )}
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
