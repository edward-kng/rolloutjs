import type { Store, Transaction } from "rolloutjs";

import { sql } from "drizzle-orm";
import { drizzle, type MySql2Database } from "drizzle-orm/mysql2";
import {
  LOCK_NAME,
  LOCK_TIMEOUT,
  MIGRATIONS_DIR,
  MIGRATIONS_TABLE,
} from "./db/constants.js";
import { migrate } from "drizzle-orm/mysql2/migrator";
import { createFlagStore } from "./stores/flags.js";
import { createOverrideStore } from "./stores/overrides.js";
import { createConfigStore } from "./stores/config.js";
import { createSegmentStore } from "./stores/segments.js";

function createStore(db: MySql2Database) {
  return {
    ...createConfigStore(db),
    ...createFlagStore(db),
    ...createOverrideStore(db),
    ...createSegmentStore(db),

    migrate: async () => {
      await db.execute(sql`SELECT GET_LOCK(${LOCK_NAME}, ${LOCK_TIMEOUT})`);
      try {
        await migrate(db, {
          migrationsFolder: MIGRATIONS_DIR,
          migrationsTable: MIGRATIONS_TABLE,
        });
      } finally {
        await db.execute(sql`SELECT RELEASE_LOCK(${LOCK_NAME})`);
      }
    },
  };
}

export function MySqlStore(dbUrl: string): Store {
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
