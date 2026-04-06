#!/usr/bin/env node
import { parseArgs } from "node:util";
import { MySqlStore } from "./store.js";

const commands = ["migrate"] as const;
type Command = (typeof commands)[number];

function usage(): never {
  console.error("Usage: libreflag-mysql <command> [options]");
  console.error("");
  console.error("Commands:");
  console.error("  migrate  Run database migrations");
  console.error("");
  console.error("Options:");
  console.error("  --db-url <url>  MySQL connection URL");
  process.exit(1);
}

const [command] = process.argv.slice(2);

if (!commands.includes(command as Command)) {
  usage();
}

const { values } = parseArgs({
  args: process.argv.slice(3),
  options: {
    "db-url": { type: "string" },
  },
});

const dbUrl = values["db-url"] ?? process.env.LIBREFLAG_DB_URL;

if (!dbUrl) {
  console.error(
    "Error: --db-url or LIBREFLAG_DB_URL environment variable required",
  );
  process.exit(1);
}

if (command === "migrate") {
  const adapter = MySqlStore(dbUrl);
  await adapter.migrate();
  console.log("Migrations applied successfully.");
  process.exit(0);
}
