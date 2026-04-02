import type { LibreFlagServer } from "libreflag";
import { Router } from "express";
import type { Request, Response } from "express";

export function OverridesRouter(libreflag: LibreFlagServer): Router {
  const router = Router();

  router.get("/", async (_req: Request, res: Response) => {
    const { status, body } = await libreflag.http.listOverrides();

    if (!body) {
      res.sendStatus(status);
      return;
    }

    res.status(status).json(body);
  });

  router.get("/:targetingKey", async (req: Request, res: Response) => {
    const { status, body } = await libreflag.http.getUserOverrides(
      req.params.targetingKey as string,
    );

    if (!body) {
      res.sendStatus(status);
      return;
    }

    res.status(status).json(body);
  });

  router.put("/:targetingKey/:flagKey", async (req: Request, res: Response) => {
    const { status, body } = await libreflag.http.setUserOverride(
      req.params.targetingKey as string,
      req.params.flagKey as string,
      req.body?.value,
    );

    if (!body) {
      res.sendStatus(status);
      return;
    }

    res.status(status).json(body);
  });

  router.delete(
    "/:targetingKey/:flagKey",
    async (req: Request, res: Response) => {
      const { status, body } = await libreflag.http.deleteUserOverride(
        req.params.targetingKey as string,
        req.params.flagKey as string,
      );

      if (!body) {
        res.sendStatus(status);
        return;
      }

      res.status(status).json(body);
    },
  );

  return router;
}
