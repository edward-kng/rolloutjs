import type { LibreFlagServer } from "libreflag";
import { Router } from "express";
import type { RequestHandler } from "express";
import { OFREPRouter } from "./routes/ofrep.js";
import { FlagsRouter } from "./routes/flags.js";
import { OverridesRouter } from "./routes/overrides.js";
import { AdminRouter } from "./routes/admin.js";
import { ROUTES } from "./constants/routes.js";
import express from "express";
import cors from "cors";

export interface LibreFlagExpressOptions {
  adminMiddleware?: RequestHandler;
  evalMiddleware?: RequestHandler;
}

export function LibreFlagExpress(
  libreflag: LibreFlagServer,
  {
    adminMiddleware = (_req, res) => {
      res.status(403).send();
    },
    evalMiddleware = cors({ origin: true, exposedHeaders: ["ETag"] }),
  }: LibreFlagExpressOptions = {},
): Router {
  const router = Router();

  router.use(express.json());
  router.use(ROUTES.OFREP, evalMiddleware, OFREPRouter(libreflag));
  router.use(ROUTES.FLAGS, adminMiddleware, FlagsRouter(libreflag));
  router.use(ROUTES.OVERRIDES, adminMiddleware, OverridesRouter(libreflag));
  router.use(ROUTES.ADMIN, adminMiddleware, AdminRouter());

  return router;
}
