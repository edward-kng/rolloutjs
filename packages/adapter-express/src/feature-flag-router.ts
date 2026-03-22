import type { FeatureFlagProvider } from "@feature-flags/core";
import { Router } from "express";
import type { Request, Response } from "express";

const PATH_PREFIX = "/ofrep/v1";

export function createFeatureFlagRouter(provider: FeatureFlagProvider): Router {
  const router = Router();

  router.post(
    `${PATH_PREFIX}/evaluate/flags/:flagKey`,
    async (req: Request, res: Response) => {
      const { flagKey } = req.params;

      const { status, body } = await provider.evaluate(flagKey as string);

      res.status(status).json(body);
    },
  );

  router.post(
    `${PATH_PREFIX}/evaluate/flags/`,
    async (req: Request, res: Response) => {
      const { status, body } = await provider.evaluateAll(req.body);

      res.status(status).json(body);
    },
  );

  return router;
}
