import { FlagValueEditor } from "@/components/FlagValueEditor";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useSetOverride } from "@/hooks/api/useSetOverride";
import type { Flag, FlagValue, Override } from "libreflag";
import type { ValueType } from "@/types/flags";
import { coerceValue, inferType, serializeValue } from "@/utils/flags";
import { useState, type ReactNode } from "react";

interface FlagOverrideEditorProps {
  override?: Override;
  flag: Flag;
  children: ReactNode;
}

export default function FlagOverrideEditor({
  override,
  flag,
  children,
}: FlagOverrideEditorProps) {
  const initialType = override ? inferType(override?.value) : "boolean";
  const initialObj =
    override && initialType === "json"
      ? (override.value as Record<string, unknown>)
      : {};

  const [targetingKey, setTargetingKey] = useState(
    override?.targetingKey ?? "",
  );
  const [valueType, setValueType] = useState<ValueType>(initialType);
  const [value, setValue] = useState(
    override ? serializeValue(override.value) : "false",
  );
  const [objValue, setObjValue] = useState(initialObj);

  const { mutateAsync: setUserOverride, isPending } = useSetOverride(flag.key);

  const isCreate = !override;
  const missingFields = !targetingKey || !(value || objValue);

  function handleTypeChange(type: ValueType) {
    setValueType(type);
    setValue("");
    if (type === "json") {
      setObjValue({});
    }
  }

  async function handleSave() {
    const coerced =
      valueType === "json"
        ? (objValue as FlagValue)
        : coerceValue(value, valueType);

    await setUserOverride({ targetingKey, value: coerced });
  }

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isCreate ? "Add Override" : "Edit Override"}
          </DialogTitle>
        </DialogHeader>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label>Targeting Key</Label>
            <Input
              value={targetingKey}
              onChange={(e) => setTargetingKey(e.target.value)}
              placeholder="user-123"
              className="font-mono"
              disabled={!!override}
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
            <Label>Override Value</Label>
            <FlagValueEditor
              valueType={valueType}
              value={value}
              setValue={setValue}
              objValue={objValue}
              setObjValue={setObjValue}
            />
          </div>

          <div className="flex gap-3 justify-end">
            <DialogClose>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <DialogClose>
              <Button
                type="button"
                disabled={isPending || missingFields}
                onClick={handleSave}
              >
                {isPending ? (
                  <Spinner />
                ) : isCreate ? (
                  "Add Override"
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
