import {
  check,
  int,
  json,
  mysqlTable,
  varchar,
  unique,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const configTable = mysqlTable("rolloutjs_config", {
  id: int().autoincrement().primaryKey(),
  version: int().notNull().default(0),
});

export const flagsTable = mysqlTable("rolloutjs_flags", {
  key: varchar({ length: 255 }).primaryKey(),
  name: varchar({ length: 255 }),
  description: varchar({ length: 1024 }),
  default_value: json().notNull(),
});

export const segmentsTable = mysqlTable("rolloutjs_segments", {
  key: varchar({ length: 255 }).primaryKey(),
  name: varchar({ length: 255 }),
  description: varchar({ length: 1024 }),
  rules: json().notNull(),
  priority: int().notNull(),
});

export const overridesTable = mysqlTable(
  "rolloutjs_overrides",
  {
    flag_key: varchar({ length: 255 })
      .references(() => flagsTable.key, { onDelete: "cascade" })
      .notNull(),
    targeting_key: varchar({ length: 255 }),
    segment_key: varchar({ length: 255 }).references(() => segmentsTable.key, {
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
