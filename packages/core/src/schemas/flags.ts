import type { FlagValue } from "@openfeature/core";
import z, { ZodType } from "zod";

const jsonLiteralSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
]);

const jsonSchema: ZodType<FlagValue> = z.lazy(() =>
  z.union(
    [jsonLiteralSchema, z.array(jsonSchema), z.record(z.string(), jsonSchema)],
    "Invalid flag value",
  ),
);

export const flagValueSchema = z.union(
  [z.string(), z.number(), z.boolean(), jsonSchema],
  "Invalid flag value",
);

export const flagSchema = z.object({
  key: z.string("Invalid flag key").min(1, "Invalid flag key"),
  name: z.string("Invalid flag name").optional(),
  description: z.string("Invalid flag description").optional(),
  defaultValue: flagValueSchema,
});

export const updateFlagSchema = flagSchema.omit({ key: true }).partial();
