import z from "zod";
import { OPERATORS } from "../types/segments.js";

export const operatorSchema = z.enum(OPERATORS, {
  error: "Invalid condition operator",
});

export const conditionSchema = z.object({
  attribute: z
    .string("Invalid condition attribute")
    .min(1, "Invalid condition attribute"),
  operator: operatorSchema,
  value: z.union([z.string(), z.number()], "Invalid condition value"),
  negated: z.boolean("Invalid condition negated"),
});

export const ruleSchema = z.object({
  conditions: z.array(conditionSchema, "Invalid conditions"),
});

export const segmentSchema = z.object({
  key: z.string("Invalid segment key").min(1, "Invalid segment key"),
  name: z.string("Invalid segment name").optional(),
  description: z.string("Invalid segment description").optional(),
  rules: z.array(ruleSchema, "Invalid rules"),
});

export const updateSegmentSchema = segmentSchema.omit({ key: true }).partial();
