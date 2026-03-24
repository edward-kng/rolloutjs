import type { LibreFlag } from "libreflag";
import { Router } from "express";
import type { RequestHandler } from "express";
import { OFREPRouter } from "./routes/ofrep.js";
import { FlagsRouter } from "./routes/flags.js";
import { ROUTES } from "./constants/routes.js";

export interface LibreFlagExpressOptions {
  adminAuthMiddleware?: RequestHandler;
}

export function LibreFlagExpress(
  provider: LibreFlag,
  {
    adminAuthMiddleware = (_req, res) => {
      res.status(403).send();
    },
  }: LibreFlagExpressOptions = {},
): Router {
  const router = Router();

  router.use(ROUTES.OFREP, OFREPRouter(provider));
  router.use(ROUTES.FLAGS, adminAuthMiddleware, FlagsRouter(provider));

  return router;
}
