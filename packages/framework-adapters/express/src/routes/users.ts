import type { LibreFlagHttpMethods } from "libreflag";
import { Router } from "express";
import type { Request, Response } from "express";

export function UsersRouter(httpMethods: LibreFlagHttpMethods): Router {
  const router = Router();

  router.get("/", async (_req: Request, res: Response) => {
    const { status, body } = await httpMethods.getAllUsers();

    res.status(status).json(body);
  });

  router.get("/:userKey", async (req: Request, res: Response) => {
    const { status, body } = await httpMethods.getUser(
      req.params.userKey as string,
    );

    if (!body) {
      res.sendStatus(status);
      return;
    }

    res.status(status).json(body);
  });

  router.post("/", async (req: Request, res: Response) => {
    const { status, body } = await httpMethods.createUser(req.body);

    if (!body) {
      res.sendStatus(status);
      return;
    }

    res.status(status).json(body);
  });

  router.put("/:userKey", async (req: Request, res: Response) => {
    const userKey = req.params.userKey as string;
    const { status, body } = await httpMethods.updateUser(userKey, req.body);

    if (!body) {
      res.sendStatus(status);
      return;
    }

    res.status(status).json(body);
  });

  router.delete("/:userKey", async (req: Request, res: Response) => {
    const { status } = await httpMethods.deleteUser(
      req.params.userKey as string,
    );

    res.sendStatus(status);
  });

  router.get("/:userKey/overrides", async (req: Request, res: Response) => {
    const { status, body } = await httpMethods.getUserOverrides(
      req.params.userKey as string,
    );

    res.status(status).json(body);
  });

  router.put(
    "/:userKey/overrides/:flagKey",
    async (req: Request, res: Response) => {
      const { status, body } = await httpMethods.setUserOverride(
        req.params.userKey as string,
        req.params.flagKey as string,
        req.body.value,
      );

      if (!body) {
        res.sendStatus(status);
        return;
      }

      res.status(status).json(body);
    },
  );

  router.delete(
    "/:userKey/overrides/:flagKey",
    async (req: Request, res: Response) => {
      const { status } = await httpMethods.deleteUserOverride(
        req.params.userKey as string,
        req.params.flagKey as string,
      );

      res.sendStatus(status);
    },
  );

  return router;
}
