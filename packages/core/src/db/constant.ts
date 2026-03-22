import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const MIGRATIONS_DIR = path.join(__dirname, "..", "..", "drizzle");
export const MIGRATIONS_SCHEMA = "feature_flags";
export const MIGRATIONS_TABLE = "__feature_flags_migrations";
