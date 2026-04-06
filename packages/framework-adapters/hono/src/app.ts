import { Hono, type MiddlewareHandler } from "hono";
import type { LibreFlagServer } from "libreflag";
import { FlagRoutes } from "./routes/flags.js";
import { OverrideRoutes } from "./routes/overrides.js";
import { SegmentRoutes } from "./routes/segments.js";
import { OFREPRoutes } from "./routes/ofrep.js";
import { AdminRoutes } from "./routes/admin.js";
import { ROUTES } from "./constants/routes.js";
import { cors } from "hono/cors";

export interface LibreFlagHonoOptions {
  adminMiddleware?: MiddlewareHandler;
  evalMiddleware?: MiddlewareHandler;
}

export function LibreFlagHono(
  libreFlag: LibreFlagServer,
  {
    adminMiddleware = async (c) => {
      return c.body(null, 403);
    },
    evalMiddleware = cors({
      origin: (origin) => origin,
      exposeHeaders: ["ETag"],
    }),
  }: LibreFlagHonoOptions = {},
) {
  const app = new Hono();

  const admin = new Hono();
  admin.use("/*", adminMiddleware);
  admin.route(ROUTES.FLAGS, FlagRoutes(libreFlag));
  admin.route(ROUTES.OVERRIDES, OverrideRoutes(libreFlag));
  admin.route(ROUTES.SEGMENTS, SegmentRoutes(libreFlag));
  admin.route(ROUTES.ADMIN, AdminRoutes());
  app.route("/", admin);

  const ofrep = new Hono();
  ofrep.use("/*", evalMiddleware);
  ofrep.route(ROUTES.OFREP, OFREPRoutes(libreFlag));
  app.route("/", ofrep);

  return app;
}
