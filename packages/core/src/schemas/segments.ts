import z from "zod";
import { OPERATORS } from "../types/segments.js";

export const operatorSchema = z.enum(OPERATORS, {
  error: "Invalid condition operator",
});

const baseCondition = {
  value: z.union([z.string(), z.number()], "Invalid condition value"),
  negated: z.boolean("Invalid condition negated"),
};

export const conditionSchema = z.discriminatedUnion("operator", [
  z.object({
    attribute: z.string("Invalid condition attribute"),
    operator: z.literal("percent"),
    ...baseCondition,
  }),
  ...OPERATORS.filter((op) => op !== "percent").map((op) =>
    z.object({
      attribute: z
        .string("Invalid condition attribute")
        .min(1, "Invalid condition attribute"),
      operator: z.literal(op),
      ...baseCondition,
    }),
  ),
]);

export const ruleSchema = z.object({
  conditions: z.array(conditionSchema, "Invalid conditions"),
});

export const segmentSchema = z.object({
  key: z.string("Invalid segment key").min(1, "Invalid segment key"),
  name: z.string("Invalid segment name").optional(),
  description: z.string("Invalid segment description").optional(),
  rules: z.array(ruleSchema, "Invalid rules"),
  priority: z.number("Invalid priority").optional(),
});

export const updateSegmentSchema = segmentSchema.omit({ key: true }).partial();
