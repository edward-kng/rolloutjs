import type { LibreFlagHttpMethods } from "libreflag";
import { Router } from "express";
import type { Request, Response } from "express";

export function OFREPRouter(httpMethods: LibreFlagHttpMethods): Router {
  const router = Router();

  router.post(
    "/evaluate/flags/:flagKey",
    async (req: Request, res: Response) => {
      const { flagKey } = req.params;

      const { status, body } = await httpMethods.evaluate(flagKey as string);

      res.status(status).json(body);
    },
  );

  router.post("/evaluate/flags", async (req: Request, res: Response) => {
    const { status, body } = await httpMethods.evaluateAll(req.body);

    res.status(status).json(body);
  });

  return router;
}
