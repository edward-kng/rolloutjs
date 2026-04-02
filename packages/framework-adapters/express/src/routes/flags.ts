import type { LibreFlagHttpMethods } from "libreflag";
import { Router } from "express";
import type { Request, Response } from "express";

export function FlagsRouter(httpMethods: LibreFlagHttpMethods): Router {
  const router = Router();

  router.get("/", async (_req: Request, res: Response) => {
    const { status, body } = await httpMethods.getFlags();

    res.status(status).json(body);
  });

  router.get("/:flagKey", async (req: Request, res: Response) => {
    const { status, body } = await httpMethods.getFlag(
      req.params.flagKey as string,
    );

    if (!body) {
      res.sendStatus(status);
      return;
    }

    res.status(status).json(body);
  });

  router.post("/", async (req: Request, res: Response) => {
    const { status, body } = await httpMethods.createFlag(req.body);

    if (!body) {
      res.sendStatus(status);
      return;
    }

    res.status(status).json(body);
  });

  router.put("/:flagKey", async (req: Request, res: Response) => {
    const flagKey = req.params.flagKey as string;
    const { status, body } = await httpMethods.updateFlag(flagKey, req.body);

    if (!body) {
      res.sendStatus(status);
      return;
    }

    res.status(status).json(body);
  });

  router.delete("/:flagKey", async (req: Request, res: Response) => {
    const { status } = await httpMethods.deleteFlag(
      req.params.flagKey as string,
    );

    res.sendStatus(status);
  });

  router.get("/:flagKey/overrides", async (req: Request, res: Response) => {
    const { status, body } = await httpMethods.getFlagOverrides(
      req.params.flagKey as string,
    );

    res.status(status).json(body);
  });

  return router;
}
