import type { LibreFlag } from "libreflag";
import { Router } from "express";
import type { Request, Response } from "express";

export function FlagsRouter(provider: LibreFlag): Router {
  const router = Router();

  router.get("/", async (_req: Request, res: Response) => {
    const { status, body } = await provider.getAllFlags();

    res.status(status).json(body);
  });

  router.get("/:flagKey", async (req: Request, res: Response) => {
    const { status, body } = await provider.getFlag(
      req.params.flagKey as string,
    );

    if (!body) {
      res.sendStatus(status);
      return;
    }

    res.status(status).json(body);
  });

  router.post("/", async (req: Request, res: Response) => {
    const { status, body } = await provider.createFlag(req.body);

    if (!body) {
      res.sendStatus(status);
      return;
    }

    res.status(status).json(body);
  });

  router.put("/:flagKey", async (req: Request, res: Response) => {
    const flagKey = req.params.flagKey as string;
    const { status, body } = await provider.updateFlag(flagKey, req.body);

    if (!body) {
      res.sendStatus(status);
      return;
    }

    res.status(status).json(body);
  });

  router.delete("/:flagKey", async (req: Request, res: Response) => {
    const { status } = await provider.deleteFlag(req.params.flagKey as string);

    res.sendStatus(status);
  });

  return router;
}
