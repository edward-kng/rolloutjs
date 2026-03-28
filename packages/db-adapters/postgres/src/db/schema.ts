import {
  foreignKey,
  integer,
  json,
  pgSchema,
  text,
  unique,
} from "drizzle-orm/pg-core";

export const schema = pgSchema("libreflag");

export const flagsTable = schema.table("flags", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  key: text().notNull().unique(),
  default_value: json().default("false"),
});

export const usersTable = schema.table("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  key: text().notNull().unique(),
  attributes: json().default({}),
});

export const userOverridesTable = schema.table(
  "user_overrides",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    user_key: text().notNull(),
    flag_key: text().notNull(),
    value: json().notNull(),
  },
  (table) => [
    unique().on(table.user_key, table.flag_key),
    foreignKey({
      columns: [table.user_key],
      foreignColumns: [usersTable.key],
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.flag_key],
      foreignColumns: [flagsTable.key],
    }).onDelete("cascade"),
  ],
);
