import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/utils/ui";

type EditMode = "json" | "key-value";

type KeyValuePair = { key: string; value: string };

function objToKeyValues(obj: Record<string, unknown>): KeyValuePair[] {
  const entries = Object.entries(obj).map(([key, value]) => ({
    key,
    value: typeof value === "string" ? value : JSON.stringify(value),
  }));

  return entries.length > 0 ? entries : [{ key: "", value: "" }];
}

function keyValuesToObj(pairs: KeyValuePair[]): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const { key, value } of pairs) {
    if (!key.trim()) continue;

    try {
      result[key] = JSON.parse(value);
    } catch {
      result[key] = value;
    }
  }

  return result;
}

interface KeyValueEditorProps {
  value: Record<string, unknown>;
  onChange: (value: Record<string, unknown>) => void;
}

export function KeyValueEditor({ value, onChange }: KeyValueEditorProps) {
  const [editMode, setEditMode] = useState<EditMode>("key-value");
  const [jsonValue, setJsonValue] = useState(JSON.stringify(value, null, 2));
  const [pairs, setPairs] = useState<KeyValuePair[]>(objToKeyValues(value));

  function switchMode(mode: EditMode) {
    if (mode === editMode) return;

    if (mode === "json") {
      const obj = keyValuesToObj(pairs);
      setJsonValue(JSON.stringify(obj, null, 2));
      onChange(obj);
    } else {
      try {
        const parsed = JSON.parse(jsonValue) as Record<string, unknown>;
        setPairs(objToKeyValues(parsed));
        onChange(parsed);
      } catch {
        setPairs([{ key: "", value: "" }]);
      }
    }

    setEditMode(mode);
  }

  function updatePair(index: number, field: "key" | "value", val: string) {
    setPairs((prev) => {
      const next = prev.map((p, i) =>
        i === index ? { ...p, [field]: val } : p,
      );
      onChange(keyValuesToObj(next));
      return next;
    });
  }

  function removePair(index: number) {
    setPairs((prev) => {
      const next = prev.filter((_, i) => i !== index);
      const result = next.length > 0 ? next : [{ key: "", value: "" }];
      onChange(keyValuesToObj(result));
      return result;
    });
  }

  function addPair() {
    setPairs((prev) => [...prev, { key: "", value: "" }]);
  }

  function handleJsonChange(raw: string) {
    setJsonValue(raw);
    try {
      onChange(JSON.parse(raw) as Record<string, unknown>);
    } catch {
      // invalid JSON — don't propagate
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <div className="flex gap-1 rounded-md border p-0.5">
          <button
            type="button"
            className={cn(
              "rounded p-2 text-xs transition-colors",
              editMode === "key-value"
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
            onClick={() => switchMode("key-value")}
          >
            Key-Value
          </button>
          <button
            type="button"
            className={cn(
              "rounded p-2 text-xs transition-colors",
              editMode === "json"
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
            onClick={() => switchMode("json")}
          >
            JSON
          </button>
        </div>
      </div>

      {editMode === "json" ? (
        <Input
          value={jsonValue}
          onChange={(e) => handleJsonChange(e.target.value)}
          className="font-mono"
          placeholder="{}"
        />
      ) : (
        <div className="flex flex-col gap-2">
          {pairs.map((pair, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={pair.key}
                onChange={(e) => updatePair(index, "key", e.target.value)}
                placeholder="key"
                className="font-mono"
              />
              <Input
                value={pair.value}
                onChange={(e) => updatePair(index, "value", e.target.value)}
                placeholder="value"
                className="font-mono"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0"
                onClick={() => removePair(index)}
                disabled={pairs.length === 1}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="self-start"
            onClick={addPair}
          >
            <Plus className="size-4" />
            Add entry
          </Button>
        </div>
      )}
    </div>
  );
}
