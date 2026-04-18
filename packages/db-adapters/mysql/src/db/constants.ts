import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const MIGRATIONS_DIR = path.join(__dirname, "..", "..", "drizzle");
export const MIGRATIONS_TABLE = "__rolloutjs_migrations";
export const LOCK_NAME = "rolloutjs_migration_lock";
export const LOCK_TIMEOUT = 10;
