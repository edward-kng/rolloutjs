import { integer, json, pgSchema, text } from "drizzle-orm/pg-core";

export const flagsSchema = pgSchema("libreflag");

export const flagsTable = flagsSchema.table("flags", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  key: text().notNull().unique(),
  default_value: json().default("false"),
});
