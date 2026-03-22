import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import {
  ADVISORY_LOCK_ID,
  MIGRATIONS_DIR,
  MIGRATIONS_SCHEMA,
  MIGRATIONS_TABLE,
} from "./constant.js";

export async function migrateDb(db: NodePgDatabase) {
  await db.execute(sql`SELECT pg_advisory_lock(${ADVISORY_LOCK_ID})`);
  try {
    await migrate(db, {
      migrationsFolder: MIGRATIONS_DIR,
      migrationsSchema: MIGRATIONS_SCHEMA,
      migrationsTable: MIGRATIONS_TABLE,
    });
  } finally {
    await db.execute(sql`SELECT pg_advisory_unlock(${ADVISORY_LOCK_ID})`);
  }
}
