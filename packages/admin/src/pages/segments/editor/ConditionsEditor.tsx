import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { serializeValue } from "@/utils/flags";
import type { Condition, Operator } from "libreflag";
import { Trash2 } from "lucide-react";

interface ConditionsEditorProps {
  conditions: Condition[];
  updateCondition: (index: number, condition: Condition) => void;
  removeCondition: (index: number) => void;
}

const OPERATORS_MAP: Record<Operator, string> = {
  eq: "=",
  starts_with: "starts with",
  ends_with: "ends with",
  matches_regex: "matches regex",
  contains: "contains",
  gt: ">",
  gte: ">=",
  lt: "<",
  lte: "<=",
  in: "in",
  exists: "exists",
};
const NUMBER_OPERATORS = ["gt", "gte", "lt", "lte"];

export default function ConditionsEditor({
  conditions,
  updateCondition,
  removeCondition,
}: ConditionsEditorProps) {
  return (
    <div>
      {conditions.map((condition, index) => (
        <div key={index}>
          <div className="flex items-center gap-2 rounded-md border bg-background p-2">
            <Input
              placeholder="attribute"
              value={condition.attribute}
              onChange={(e) =>
                updateCondition(index, {
                  ...condition,
                  attribute: e.target.value,
                })
              }
              className="flex-1 font-mono text-sm"
            />
            <div className="flex items-center gap-2 px-2 h-full">
              <Checkbox
                id={`negate-${index}`}
                checked={condition.negated}
                onCheckedChange={(checked) =>
                  updateCondition(index, {
                    ...condition,
                    negated: checked === true,
                  })
                }
              />
              <Label
                htmlFor={`negate-${index}`}
                className="text-xs text-muted-foreground"
              >
                not
              </Label>
            </div>
            <Select
              value={condition.operator}
              onValueChange={(v) =>
                updateCondition(index, {
                  ...condition,
                  operator: v as Operator,
                })
              }
            >
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(OPERATORS_MAP).map((operator) => (
                  <SelectItem key={operator} value={operator}>
                    {OPERATORS_MAP[operator as Operator]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder={"value"}
              value={serializeValue(condition.value)}
              onChange={(e) =>
                updateCondition(index, {
                  ...condition,
                  value: NUMBER_OPERATORS.includes(condition.operator)
                    ? Number(e.target.value)
                    : e.target.value,
                })
              }
              className="flex-1 font-mono text-sm"
              type={
                NUMBER_OPERATORS.includes(condition.operator)
                  ? "number"
                  : "text"
              }
            />
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => removeCondition(index)}
              disabled={conditions.length === 1}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
