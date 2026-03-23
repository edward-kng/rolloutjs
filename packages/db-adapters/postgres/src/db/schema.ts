import { integer, json, pgSchema, text } from "drizzle-orm/pg-core";

export const flagsSchema = pgSchema("feature_flags");

export const flagsTable = flagsSchema.table("flags", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  key: text().notNull().unique(),
  default_value: json().default("false"),
});
