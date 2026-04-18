import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { FlagValue } from "rolloutjs";
import {
  coerceValue,
  formatValue,
  inferType,
  serializeValue,
} from "@/utils/flags";
import { cn } from "@/utils/ui";

interface FlagValueCellProps {
  value: FlagValue;
  onChange?: (value: FlagValue) => void;
}

export function FlagValueCell({ value, onChange }: FlagValueCellProps) {
  const isBoolean = typeof value === "boolean";
  const isNumber = typeof value === "number";
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
      onChange?.(coerceValue(draft, inferType(value)));
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
        type={isNumber ? "number" : "text"}
      />
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          "font-mono rounded px-1.5 py-0.5",
          editable && "cursor-pointer hover:bg-accent",
        )}
        onClick={handleEdit}
      >
        {formatValue(value)}
      </span>
    </div>
  );
}
