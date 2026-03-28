import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const MIGRATIONS_DIR = path.join(__dirname, "..", "..", "drizzle");
export const MIGRATIONS_SCHEMA = "libreflag";
export const MIGRATIONS_TABLE = "__libreflag_migrations";
export const ADVISORY_LOCK_ID = 9182;
