import type { LibreFlagServer } from "libreflag";
import { Router } from "express";
import type { Request, Response } from "express";

export function FlagsRouter(libreflag: LibreFlagServer): Router {
  const router = Router();

  router.get("/", async (_req: Request, res: Response) => {
    const { status, body } = await libreflag.http.listFlags();

    if (!body) {
      res.sendStatus(status);
      return;
    }

    res.status(status).json(body);
  });

  router.get("/:flagKey", async (req: Request, res: Response) => {
    const { status, body } = await libreflag.http.getFlag(
      req.params.flagKey as string,
    );

    if (!body) {
      res.sendStatus(status);
      return;
    }

    res.status(status).json(body);
  });

  router.post("/", async (req: Request, res: Response) => {
    const { status, body } = await libreflag.http.createFlag(req.body);

    if (!body) {
      res.sendStatus(status);
      return;
    }

    res.status(status).json(body);
  });

  router.put("/:flagKey", async (req: Request, res: Response) => {
    const flagKey = req.params.flagKey as string;
    const { status, body } = await libreflag.http.updateFlag(flagKey, req.body);

    if (!body) {
      res.sendStatus(status);
      return;
    }

    res.status(status).json(body);
  });

  router.delete("/:flagKey", async (req: Request, res: Response) => {
    const { status, body } = await libreflag.http.deleteFlag(
      req.params.flagKey as string,
    );

    if (!body) {
      res.sendStatus(status);
      return;
    }

    res.status(status).json(body);
  });

  router.get("/:flagKey/overrides", async (req: Request, res: Response) => {
    const { status, body } = await libreflag.http.getFlagOverrides(
      req.params.flagKey as string,
    );

    if (!body) {
      res.sendStatus(status);
      return;
    }

    res.status(status).json(body);
  });

  return router;
}
