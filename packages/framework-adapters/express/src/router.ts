import type { LibreFlag } from "libreflag";
import { Router } from "express";
import { OFREPRouter } from "./routes/ofrep.js";
import { FlagsRouter } from "./routes/flags.js";

export function LibreFlagExpress(provider: LibreFlag): Router {
  const router = Router();

  router.use(OFREPRouter(provider));
  router.use(FlagsRouter(provider));

  return router;
}
