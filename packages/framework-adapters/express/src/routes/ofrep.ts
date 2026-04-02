import type { LibreFlagServer } from "libreflag";
import { Router } from "express";
import type { Request, Response } from "express";

export function OFREPRouter(libreflag: LibreFlagServer): Router {
  const router = Router();

  router.post(
    "/evaluate/flags/:flagKey",
    async (req: Request, res: Response) => {
      const { flagKey } = req.params;

      const { status, body } = await libreflag.http.evaluate(
        flagKey as string,
        req.body,
      );

      if (!body) {
        res.sendStatus(status);
        return;
      }

      res.status(status).json(body);
    },
  );

  router.post("/evaluate/flags", async (req: Request, res: Response) => {
    const ifNoneMatch = req.headers["if-none-match"] as string | undefined;
    const { status, body, etag } = await libreflag.http.evaluateAll(
      req.body,
      ifNoneMatch,
    );

    if (etag) res.set("ETag", etag);

    if (status === 304) {
      res.status(304).end();
      return;
    }

    if (!body) {
      res.sendStatus(status);
      return;
    }

    res.status(status).json(body);
  });

  return router;
}
