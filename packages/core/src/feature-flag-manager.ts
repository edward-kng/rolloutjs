import { eq } from "drizzle-orm";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { flagsTable } from "./db/schema.js";
import {
  MIGRATIONS_DIR,
  MIGRATIONS_SCHEMA,
  MIGRATIONS_TABLE,
} from "./db/constant.js";

type FeatureFlagValue = boolean | string | number | object;

type FeatureFlagResult = {
  key: string;
  value: FeatureFlagValue;
};

type FeatureFlagError = {
  key: string;
  errorCode: string;
};

type EvaluationResponse = {
  status: number;
  body: FeatureFlagResult | FeatureFlagError;
};

type BulkEvaluationResponse = {
  status: number;
  body: {
    flags: FeatureFlagResult[];
  };
};

export class FeatureFlagManager {
  db: NodePgDatabase;

  constructor(db_url: string) {
    this.db = drizzle(db_url);

    migrate(this.db, {
      migrationsFolder: MIGRATIONS_DIR,
      migrationsSchema: MIGRATIONS_SCHEMA,
      migrationsTable: MIGRATIONS_TABLE,
    });
  }

  async evaluate(key: string, _context?: object): Promise<EvaluationResponse> {
    const [flag] = await this.db
      .select()
      .from(flagsTable)
      .where(eq(flagsTable.key, key));

    if (!flag || !flag.default_value) {
      return {
        status: 404,
        body: {
          key,
          errorCode: "NOT_FOUND",
        },
      };
    }

    return {
      status: 200,
      body: {
        key,
        value: flag.default_value,
      },
    };
  }

  async evaluateAll(_context?: object): Promise<BulkEvaluationResponse> {
    const flags = await this.db.select().from(flagsTable);

    return {
      status: 200,
      body: {
        flags: flags.map((flag) => ({
          key: flag.key,
          value: flag.default_value as FeatureFlagValue,
        })),
      },
    };
  }
}
