import { integer, json, pgSchema, primaryKey, text } from "drizzle-orm/pg-core";

export const schema = pgSchema("libreflag");

export const configTable = schema.table("config", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  version: integer().notNull().default(0),
});

export const flagsTable = schema.table("flags", {
  key: text().primaryKey(),
  default_value: json().notNull(),
});

export const overridesTable = schema.table(
  "overrides",
  {
    flag_key: text().references(() => flagsTable.key),
    targeting_key: text().notNull(),
    value: json().notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.targeting_key, table.flag_key],
    }),
  ],
);
