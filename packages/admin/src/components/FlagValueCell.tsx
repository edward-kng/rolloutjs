import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import type { Flag, FlagValue } from "@/types/api";
import {
  coerceValue,
  formatValue,
  inferType,
  serializeValue,
} from "@/utils/flags";
import { cn } from "@/utils/ui";
import { Undo2 } from "lucide-react";

interface FlagValueCellProps {
  flag: Flag;
  value: FlagValue;
  onChange?: (value: FlagValue) => void;
  onReset?: () => void;
}

export function FlagValueCell({
  flag,
  value,
  onChange,
  onReset,
}: FlagValueCellProps) {
  const isBoolean = typeof flag.defaultValue === "boolean";
  const editable = !!onChange;

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  function handleEdit() {
    if (!editable) return;
    setDraft(serializeValue(value));
    setEditing(true);
  }

  function handleSubmit() {
    setEditing(false);
    try {
      onChange?.(coerceValue(draft, inferType(flag.defaultValue)));
    } catch {
      // invalid input — discard
    }
  }

  if (isBoolean) {
    return (
      <div className="flex items-center gap-2">
        <Switch
          checked={value === true}
          onCheckedChange={
            editable ? (checked) => onChange(checked) : undefined
          }
          disabled={!editable}
        />
        {onReset && (
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={onReset}
            title="Reset to default"
          >
            <Undo2 className="size-3.5" />
          </Button>
        )}
      </div>
    );
  }

  if (editing) {
    return (
      <Input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSubmit();
          if (e.key === "Escape") setEditing(false);
        }}
        className="font-mono h-7 text-sm"
      />
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          "font-mono rounded px-1.5 py-0.5",
          editable && "cursor-pointer hover:bg-accent",
          onReset ? "text-primary font-medium" : "text-muted-foreground",
        )}
        onClick={handleEdit}
      >
        {formatValue(value)}
      </span>
      {onReset && (
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          onClick={onReset}
          title="Reset to default"
        >
          <Undo2 className="size-3.5" />
        </Button>
      )}
    </div>
  );
}
