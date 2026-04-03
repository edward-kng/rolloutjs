import type { LibreFlagServer } from "libreflag";
import { Router } from "express";
import type { Request, Response } from "express";

export function SegmentsRouter(libreflag: LibreFlagServer): Router {
  const router = Router();

  router.get("/", async (_req: Request, res: Response) => {
    const { status, body } = await libreflag.http.listSegments();

    if (!body) {
      res.sendStatus(status);
      return;
    }

    res.status(status).json(body);
  });

  router.post("/", async (req: Request, res: Response) => {
    const { status, body } = await libreflag.http.createSegment(req.body);

    if (!body) {
      res.sendStatus(status);
      return;
    }

    res.status(status).json(body);
  });

  router.put("/:segmentKey", async (req: Request, res: Response) => {
    const { status, body } = await libreflag.http.updateSegment(
      req.params.segmentKey as string,
      req.body,
    );

    if (!body) {
      res.sendStatus(status);
      return;
    }

    res.status(status).json(body);
  });

  router.delete("/:segmentKey", async (req: Request, res: Response) => {
    const { status, body } = await libreflag.http.deleteSegment(
      req.params.segmentKey as string,
    );

    if (!body) {
      res.sendStatus(status);
      return;
    }

    res.status(status).json(body);
  });

  router.get("/:segmentKey/overrides", async (req: Request, res: Response) => {
    const { status, body } = await libreflag.http.getSegmentOverrides(
      req.params.segmentKey as string,
    );

    if (!body) {
      res.sendStatus(status);
      return;
    }

    res.status(status).json(body);
  });

  router.put(
    "/:segmentKey/overrides/:flagKey",
    async (req: Request, res: Response) => {
      const { status, body } = await libreflag.http.setSegmentOverride(
        req.params.segmentKey as string,
        req.params.flagKey as string,
        req.body?.value,
      );

      if (!body) {
        res.sendStatus(status);
        return;
      }

      res.status(status).json(body);
    },
  );

  router.delete(
    "/:segmentKey/overrides/:flagKey",
    async (req: Request, res: Response) => {
      const { status, body } = await libreflag.http.deleteSegmentOverride(
        req.params.segmentKey as string,
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
