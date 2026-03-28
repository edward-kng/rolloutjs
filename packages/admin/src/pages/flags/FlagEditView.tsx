import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { useUpdateFlag } from "@/hooks/api/useUpdateFlag";
import { useCreateFlag } from "@/hooks/api/useCreateFlag";
import { useDeleteFlag } from "@/hooks/api/useDeleteFlag";
import type { Flag, FlagValue } from "@/types/api";
import { serializeValue } from "@/utils/flags";

type ValueType = "boolean" | "string" | "number" | "object";

function inferType(value: FlagValue): ValueType {
  if (typeof value === "object") return "object";
  return typeof value as ValueType;
}

function coerceValue(raw: string, type: ValueType): FlagValue {
  switch (type) {
    case "boolean":
      return raw === "true";
    case "number":
      return Number(raw);
    case "object":
      return JSON.parse(raw) as object;
    default:
      return raw;
  }
}

function getPlaceholder(type: ValueType) {
  if (type == "number") {
    return "0";
  }

  if (type == "object") {
    return "{}";
  }

  return "value";
}

interface FlagEditViewProps {
  flag?: Flag;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function FlagEditView({
  flag,
  open,
  onOpenChange,
}: FlagEditViewProps) {
  const [key, setKey] = useState("");
  const [valueType, setValueType] = useState<ValueType>(
    flag ? inferType(flag.defaultValue) : "boolean",
  );
  const [value, setValue] = useState(
    flag ? serializeValue(flag.defaultValue) : "false",
  );

  const { mutate: updateFlag, isPending: isUpdating } = useUpdateFlag();
  const { mutate: createFlag, isPending: isCreating } = useCreateFlag();
  const { mutate: deleteFlag, isPending: isDeleting } = useDeleteFlag();

  const isCreate = !flag;
  const isPending = isUpdating || isCreating || isDeleting;

  function handleTypeChange(type: ValueType) {
    setValueType(type);
    setValue("");
  }

  function handleSave() {
    const coerced = coerceValue(value, valueType);

    if (isCreate) {
      createFlag(
        { key, defaultValue: coerced },
        { onSuccess: () => onOpenChange(false) },
      );
    } else {
      updateFlag(
        { key: flag.key, flag: { defaultValue: coerced } },
        { onSuccess: () => onOpenChange(false) },
      );
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="md:min-w-2/5 min-w-1/2">
        <SheetHeader>
          <SheetTitle className="font-medium">
            {isCreate ? "Create flag" : flag.key}
          </SheetTitle>
          <SheetDescription>
            {isCreate
              ? "Create a new feature flag."
              : "Edit the default value for this flag."}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-6">
          {isCreate && (
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Key</span>
              <Input
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="flag-key"
                className="font-mono"
              />
            </label>
          )}

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Type</span>
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
                <SelectItem value="object">JSON</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {valueType === "boolean" ? (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Value</span>
              <Switch
                checked={value === "true"}
                onCheckedChange={(checked) => setValue(String(checked))}
              />
            </div>
          ) : (
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Value</span>
              <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="font-mono"
                placeholder={getPlaceholder(valueType)}
              />
            </label>
          )}
        </div>

        <SheetFooter>
          {!isCreate && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isPending}>
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete flag</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete{" "}
                    <span className="font-mono font-medium text-foreground">
                      {flag.key}
                    </span>
                    ? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={() =>
                      deleteFlag(flag.key, {
                        onSuccess: () => onOpenChange(false),
                      })
                    }
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Button
            onClick={handleSave}
            disabled={isPending || (isCreate && !key.trim()) || !value.trim()}
          >
            {isCreating || isUpdating
              ? "Saving..."
              : isCreate
                ? "Create"
                : "Save"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
