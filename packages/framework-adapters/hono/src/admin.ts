import { Hono, type Handler } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";
import { createRequire } from "node:module";
import path from "node:path";
import { readFileSync } from "node:fs";
export function AdminRoutes(middleware: Handler) {
  const app = new Hono();

  const require = createRequire(import.meta.url);
  const adminDistPath = path.dirname(
    require.resolve("@rolloutjs/admin/package.json"),
  );
  const staticPath = path.join(adminDistPath, "dist");

  app.use(middleware);
  app.use(
    "/*",
    serveStatic({
      root: staticPath,
      rewriteRequestPath: (p) => p.replace("/rolloutjs/admin", ""),
    }),
  );

  app.get("/*", (c) => {
    const html = readFileSync(path.join(staticPath, "index.html"), "utf-8");
    return c.html(html);
  });

  return app;
}
