import { useState, type SubmitEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateFlag } from "@/hooks/api/useUpdateFlag";
import { useCreateFlag } from "@/hooks/api/useCreateFlag";
import type { Flag, FlagValue } from "libreflag";
import { coerceValue, inferType, serializeValue } from "@/utils/flags";
import type { ValueType } from "@/types/flags";
import { Label } from "@/components/ui/label";
import { useFlags } from "@/hooks/api/useFlags";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { FlagValueEditor } from "@/components/flags/flag-value-editor";
import { Separator } from "@/components/ui/separator";
import FlagOverridesTable from "./flag-overrides-table";

interface FlagEditorProps {
  flag?: Flag;
  onClose: () => void;
}

export default function FlagEditor({ flag, onClose }: FlagEditorProps) {
  const initialType = flag ? inferType(flag.defaultValue) : "boolean";
  const initialObj =
    flag && initialType === "json"
      ? (flag.defaultValue as Record<string, unknown>)
      : {};

  const [key, setKey] = useState(flag?.key ?? "");
  const [name, setName] = useState(flag?.name ?? "");
  const [description, setDescription] = useState(flag?.description ?? "");
  const [valueType, setValueType] = useState<ValueType>(initialType);
  const [value, setValue] = useState(
    flag ? serializeValue(flag.defaultValue) : "false",
  );
  const [objValue, setObjValue] = useState<Record<string, unknown>>(initialObj);

  const { data: flags } = useFlags();
  const { mutateAsync: updateFlag, isPending: isUpdating } = useUpdateFlag();
  const { mutateAsync: createFlag, isPending: isCreating } = useCreateFlag();

  const isCreate = !flag;
  const invalidKey = isCreate && !!flags?.find((f) => f.key === key);
  const isPending = isUpdating || isCreating;
  const missingFields = !key || !(value || objValue);

  function handleTypeChange(type: ValueType) {
    setValueType(type);
    setValue("");
    if (type === "json") {
      setObjValue({});
    }
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();

    const coerced =
      valueType === "json"
        ? (objValue as FlagValue)
        : coerceValue(value, valueType);

    if (isCreate) {
      await createFlag({ key, name, description, defaultValue: coerced });
    } else {
      await updateFlag({
        key: flag.key,
        flag: { name, description, defaultValue: coerced },
      });
    }

    onClose();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="My Feature"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            placeholder="my-feature"
            required
            disabled={!isCreate}
            className="font-mono"
          />
          {invalidKey && (
            <p className="text-sm text-destructive">
              A flag with this key already exists.
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="What does this flag control?"
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Value Type</Label>
          <Select
            value={valueType}
            onValueChange={(v) => handleTypeChange(v as ValueType)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="boolean">Boolean</SelectItem>
              <SelectItem value="string">String</SelectItem>
              <SelectItem value="number">Number</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Value</Label>
        <FlagValueEditor
          valueType={valueType}
          value={value}
          setValue={setValue}
          objValue={objValue}
          setObjValue={setObjValue}
        />
      </div>

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={missingFields || invalidKey || isPending}
        >
          {isPending ? <Spinner /> : flag ? "Save Changes" : "Create Flag"}
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
      {flag && (
        <div className="pt-6 flex flex-col gap-6">
          <Separator />
          <FlagOverridesTable flag={flag} />
        </div>
      )}
    </form>
  );
}
