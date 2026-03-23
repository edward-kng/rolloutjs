import type { LibreFlag } from "libreflag";
import { Router } from "express";
import type { Request, Response } from "express";

const PATH_PREFIX = "feature-flags";
const OFREP_PREFIX = `${PATH_PREFIX}/ofrep/v1`;

export function LibreFlagExpress(provider: LibreFlag): Router {
  const router = Router();

  router.post(
    `${OFREP_PREFIX}/evaluate/flags/:flagKey`,
    async (req: Request, res: Response) => {
      const { flagKey } = req.params;

      const { status, body } = await provider.evaluate(flagKey as string);

      res.status(status).json(body);
    },
  );

  router.post(
    `${OFREP_PREFIX}/evaluate/flags/`,
    async (req: Request, res: Response) => {
      const { status, body } = await provider.evaluateAll(req.body);

      res.status(status).json(body);
    },
  );

  return router;
}
