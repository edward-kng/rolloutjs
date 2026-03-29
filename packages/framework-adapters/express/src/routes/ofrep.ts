import type { LibreFlagHttpMethods } from "libreflag";
import { Router } from "express";
import type { Request, Response } from "express";

export function OFREPRouter(httpMethods: LibreFlagHttpMethods): Router {
  const router = Router();

  router.post(
    "/evaluate/flags/:flagKey",
    async (req: Request, res: Response) => {
      const { flagKey } = req.params;

      const { status, body } = await httpMethods.evaluate(
        flagKey as string,
        req.body,
      );

      res.status(status).json(body);
    },
  );

  router.post("/evaluate/flags", async (req: Request, res: Response) => {
    const ifNoneMatch = req.headers["if-none-match"] as string | undefined;
    const { status, body, etag } = await httpMethods.evaluateAll(
      req.body,
      ifNoneMatch,
    );

    if (etag) res.set("ETag", etag);

    if (status === 304) {
      res.status(304).end();
    } else {
      res.status(status).json(body);
    }
  });

  return router;
}
