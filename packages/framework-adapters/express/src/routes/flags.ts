import type { LibreFlag } from "libreflag";
import { Router } from "express";
import type { Request, Response } from "express";

const FLAGS_PREFIX = "/feature-flags/flags";

export function FlagsRouter(provider: LibreFlag): Router {
  const router = Router();

  router.get(`${FLAGS_PREFIX}/`, async (_req: Request, res: Response) => {
    const { status, body } = await provider.getAllFlags();

    res.status(status).json(body);
  });

  router.get(
    `${FLAGS_PREFIX}/:flagKey`,
    async (req: Request, res: Response) => {
      const { status, body } = await provider.getFlag(
        req.params.flagKey as string,
      );

      if (!body) {
        res.sendStatus(status);
        return;
      }

      res.status(status).json(body);
    },
  );

  router.post(`${FLAGS_PREFIX}/`, async (req: Request, res: Response) => {
    const { status, body } = await provider.createFlag(req.body);

    if (!body) {
      res.sendStatus(status);
      return;
    }

    res.status(status).json(body);
  });

  router.put(
    `${FLAGS_PREFIX}/:flagKey`,
    async (req: Request, res: Response) => {
      const flagKey = req.params.flagKey as string;
      const { status, body } = await provider.updateFlag(flagKey, req.body);

      if (!body) {
        res.sendStatus(status);
        return;
      }

      res.status(status).json(body);
    },
  );

  router.delete(
    `${FLAGS_PREFIX}/:flagKey`,
    async (req: Request, res: Response) => {
      const { status } = await provider.deleteFlag(
        req.params.flagKey as string,
      );

      res.sendStatus(status);
    },
  );

  return router;
}
