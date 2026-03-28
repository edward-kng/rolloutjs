import type { LibreFlagServer } from "libreflag";
import { Router } from "express";
import type { RequestHandler } from "express";
import { OFREPRouter } from "./routes/ofrep.js";
import { FlagsRouter } from "./routes/flags.js";
import { AdminRouter } from "./routes/admin.js";
import { ROUTES } from "./constants/routes.js";
import express from "express";

export interface LibreFlagExpressOptions {
  adminAuthMiddleware?: RequestHandler;
}

export function LibreFlagExpress(
  server: LibreFlagServer,
  {
    adminAuthMiddleware = (_req, res) => {
      res.status(403).send();
    },
  }: LibreFlagExpressOptions = {},
): Router {
  const router = Router();
  const httpMethods = server.getHttpMethods();

  router.use(express.json());
  router.use(ROUTES.OFREP, OFREPRouter(httpMethods));
  router.use(ROUTES.FLAGS, adminAuthMiddleware, FlagsRouter(httpMethods));
  router.use(ROUTES.ADMIN, adminAuthMiddleware, AdminRouter());

  return router;
}
