import { Router } from "express";
import express from "express";
import { createRequire } from "node:module";
import path from "node:path";

export function AdminRouter(): Router {
  const router = Router();

  const require = createRequire(import.meta.url);
  const adminDistPath = path.dirname(
    require.resolve("@libreflag/admin/package.json"),
  );
  const staticPath = path.join(adminDistPath, "dist");

  router.use(express.static(staticPath));

  router.get("/", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  return router;
}
