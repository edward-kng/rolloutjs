import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageDir = path.resolve(__dirname, "..");
const rootDir = path.resolve(packageDir, "..", "..");
const sourceReadmePath = path.join(rootDir, "README.md");
const packageReadmePath = path.join(packageDir, "README.md");
const markerPath = path.join(packageDir, ".readme-generated");
const command = process.argv[2];

if (command === "prepare") {
  const readme = readFileSync(sourceReadmePath, "utf8");
  mkdirSync(path.dirname(packageReadmePath), { recursive: true });
  writeFileSync(packageReadmePath, readme);
  writeFileSync(markerPath, "");
} else if (command === "clean") {
  rmSync(markerPath, { force: true });
  rmSync(packageReadmePath, { force: true });
} else {
  throw new Error(`Unknown command: ${command}`);
}
