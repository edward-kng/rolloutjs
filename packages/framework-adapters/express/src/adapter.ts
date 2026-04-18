import type { RolloutService } from "rolloutjs";
import { Router } from "express";
import type { RequestHandler } from "express";
import express from "express";
import cors from "cors";
import { AdminRouter } from "./admin.js";

export interface RolloutExpressOptions {
  adminMiddleware?: RequestHandler;
  evalMiddleware?: RequestHandler;
}

export function RolloutExpress(
  rollout: RolloutService,
  {
    adminMiddleware = (_req, res) => {
      res.status(403).send();
    },
    evalMiddleware = cors({ origin: true, exposedHeaders: ["ETag"] }),
  }: RolloutExpressOptions = {},
): Router {
  const router = Router();
  router.use(express.json());

  for (const route of rollout.routes) {
    router[route.method.toLowerCase() as "get" | "post" | "put" | "delete"](
      route.path,
      route.type === "ADMIN" ? adminMiddleware : evalMiddleware,
      async (req, res) => {
        const { status, body, headers } = await route.handler(
          req.params as Record<string, string>,
          req.body,
          req.headers as Record<string, string>,
        );

        if (headers) res.set(headers);

        if (body) {
          res.status(status).json(body);
          return;
        }

        res.status(status).send();
      },
    );
  }

  router.use("/rolloutjs/admin", adminMiddleware, AdminRouter());

  return router;
}
