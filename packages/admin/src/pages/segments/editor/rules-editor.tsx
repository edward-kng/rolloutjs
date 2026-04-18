import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Condition, Rule } from "libreflag";
import { Plus, Trash2 } from "lucide-react";
import { type Dispatch, type SetStateAction } from "react";
import ConditionsEditor from "./conditions-editor";

interface RulesEditorProps {
  rules: Rule[];
  setRules: Dispatch<SetStateAction<Rule[]>>;
}

export default function RulesEditor({ rules, setRules }: RulesEditorProps) {
  function removeRule(index: number) {
    setRules(rules.filter((_, i) => i !== index));
  }

  function addRule() {
    setRules([
      ...rules,
      {
        conditions: [
          {
            attribute: "",
            operator: "eq",
            value: "",
            negated: false,
          },
        ],
      },
    ]);
  }

  function addCondition(index: number) {
    setRules(
      rules.map((rule, i) =>
        index === i
          ? {
              conditions: [
                ...rule.conditions,
                { attribute: "", operator: "eq", value: "", negated: false },
              ],
            }
          : rule,
      ),
    );
  }

  function updateCondition(
    ruleIndex: number,
    condIndex: number,
    conditon: Condition,
  ) {
    setRules(
      rules.map((rule, i) =>
        i === ruleIndex
          ? {
              conditions: rule.conditions.map((cond, j) =>
                j === condIndex ? conditon : cond,
              ),
            }
          : rule,
      ),
    );
  }

  function removeCondition(ruleIndex: number, condIndex: number) {
    setRules(
      rules.map((rule, i) =>
        i === ruleIndex
          ? {
              conditions: rule.conditions.filter((_, j) => j !== condIndex),
            }
          : rule,
      ),
    );
  }

  return (
    <div className="space-y-3">
      {rules.map((rule, index) => (
        <div key={index}>
          {index > 0 && (
            <div className="flex items-center gap-3 py-2">
              <Separator className="flex-1" />
              <Badge variant="secondary">OR</Badge>
              <Separator className="flex-1" />
            </div>
          )}
          <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Rule {index + 1}
              </span>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={() => removeRule(index)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
            <ConditionsEditor
              conditions={rule.conditions}
              updateCondition={(condIndex, condition) =>
                updateCondition(index, condIndex, condition)
              }
              removeCondition={(condIndex) => removeCondition(index, condIndex)}
            />
            <Button
              type="button"
              size="sm"
              className="text-xs"
              onClick={() => addCondition(index)}
            >
              <Plus className="mr-1 h-3.5 w-3.5" />
              Add Condition (AND)
            </Button>
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addRule}>
        <Plus className="mr-1 h-4 w-4" />
        Add Rule
      </Button>
    </div>
  );
}
