import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { KeyValueEditor } from "./key-value-editor";
import type { ValueType } from "@/types/flags";
import { type Dispatch, type SetStateAction } from "react";

interface FlagValueEditorProps {
  valueType: ValueType;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  objValue: Record<string, unknown>;
  setObjValue: Dispatch<SetStateAction<Record<string, unknown>>>;
}

export function FlagValueEditor({
  valueType,
  value,
  setValue,
  objValue,
  setObjValue,
}: FlagValueEditorProps) {
  switch (valueType) {
    case "boolean":
      return (
        <div className="flex items-center gap-3">
          <Switch
            checked={value === "true"}
            onCheckedChange={(checked) => setValue(checked.toString())}
          />
          <Label className="text-sm text-muted-foreground">
            {value ? "Enabled" : "Disabled"}
          </Label>
        </div>
      );
    case "string":
      return (
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter a string value"
        />
      );
    case "number":
      return (
        <Input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter a number value"
        />
      );
    case "json":
      return <KeyValueEditor value={objValue} onChange={setObjValue} />;
  }
}
