import type { Store, Transaction } from "rolloutjs";

import { sql } from "drizzle-orm";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import {
  ADVISORY_LOCK_ID,
  MIGRATIONS_DIR,
  MIGRATIONS_SCHEMA,
  MIGRATIONS_TABLE,
} from "./db/constants.js";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { createFlagStore } from "./stores/flags.js";
import { createOverrideStore } from "./stores/overrides.js";
import { createConfigStore } from "./stores/config.js";
import { createSegmentStore } from "./stores/segments.js";

function createStore(db: NodePgDatabase) {
  return {
    ...createConfigStore(db),
    ...createFlagStore(db),
    ...createOverrideStore(db),
    ...createSegmentStore(db),

    migrate: async () => {
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
    },
  };
}

export function PostgresStore(dbUrl: string): Store {
  const db = drizzle(dbUrl);
  const store = createStore(db);

  return {
    ...store,
    transaction: async (fn: (tx: Transaction) => Promise<void>) => {
      return db.transaction(async (t) => {
        await fn(createStore(t));
      });
    },
  };
}
