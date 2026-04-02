import type { LibreFlagHttpMethods } from "libreflag";
import { Router } from "express";
import type { Request, Response } from "express";

export function OverridesRouter(httpMethods: LibreFlagHttpMethods): Router {
  const router = Router();

  router.get("/:targetingKey", async (req: Request, res: Response) => {
    const { status, body } = await httpMethods.getUserOverrides(
      req.params.targetingKey as string,
    );

    res.status(status).json(body);
  });

  router.put("/:targetingKey/:flagKey", async (req: Request, res: Response) => {
    const { status } = await httpMethods.setUserOverride(
      req.params.targetingKey as string,
      req.params.flagKey as string,
      req.body.value,
    );

    res.sendStatus(status);
  });

  router.delete(
    "/:targetingKey/:flagKey",
    async (req: Request, res: Response) => {
      const { status } = await httpMethods.deleteUserOverride(
        req.params.targetingKey as string,
        req.params.flagKey as string,
      );

      res.sendStatus(status);
    },
  );

  return router;
}
