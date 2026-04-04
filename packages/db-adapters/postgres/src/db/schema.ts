import {
  check,
  integer,
  json,
  pgSchema,
  text,
  unique,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const schema = pgSchema("libreflag");

export const configTable = schema.table("config", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  version: integer().notNull().default(0),
});

export const flagsTable = schema.table("flags", {
  key: text().primaryKey(),
  name: text(),
  description: text(),
  default_value: json().notNull(),
});

export const overridesTable = schema.table(
  "overrides",
  {
    flag_key: text()
      .references(() => flagsTable.key, { onDelete: "cascade" })
      .notNull(),
    targeting_key: text(),
    segment_key: text().references(() => segmentsTable.key, {
      onDelete: "cascade",
    }),
    value: json().notNull(),
  },
  (table) => [
    unique().on(table.targeting_key, table.flag_key),
    unique().on(table.segment_key, table.flag_key),
    check(
      "targeting_or_segment_key",
      sql`(targeting_key IS NOT NULL AND segment_key IS NULL) OR (targeting_key IS NULL AND segment_key IS NOT NULL)`,
    ),
  ],
);

export const segmentsTable = schema.table("segments", {
  key: text().primaryKey(),
  name: text(),
  description: text(),
  rules: json().notNull(),
});
