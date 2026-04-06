import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";
import { createRequire } from "node:module";
import path from "node:path";
import { readFileSync } from "node:fs";
import { ROUTES } from "../constants/routes.js";

export function AdminRoutes() {
  const app = new Hono();

  const require = createRequire(import.meta.url);
  const adminDistPath = path.dirname(
    require.resolve("@libreflag/admin/package.json"),
  );
  const staticPath = path.join(adminDistPath, "dist");

  app.use(
    "/*",
    serveStatic({
      root: staticPath,
      rewriteRequestPath: (p) => p.replace(ROUTES.ADMIN, ""),
    }),
  );

  app.get("/*", (c) => {
    const html = readFileSync(path.join(staticPath, "index.html"), "utf-8");
    return c.html(html);
  });

  return app;
}
