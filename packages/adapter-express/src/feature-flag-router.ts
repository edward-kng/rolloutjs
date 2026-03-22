import { Router } from "express";
import type { Request, Response } from "express";
import type { FeatureFlagManager } from "@feature-flags/core";

const PATH_PREFIX = "/ofrep/v1";

export function createFeatureFlagRouter(
  featureFlagManager: FeatureFlagManager,
): Router {
  const router = Router();

  router.post(
    `${PATH_PREFIX}/evaluate/flags/:flagKey`,
    async (req: Request, res: Response) => {
      const { flagKey } = req.params;

      const { status, body } = await featureFlagManager.evaluate(
        flagKey as string,
      );

      res.status(status).json(body);
    },
  );

  router.post(
    `${PATH_PREFIX}/evaluate/flags/`,
    async (req: Request, res: Response) => {
      const { status, body } = await featureFlagManager.evaluateAll(req.body);

      res.status(status).json(body);
    },
  );

  return router;
}
