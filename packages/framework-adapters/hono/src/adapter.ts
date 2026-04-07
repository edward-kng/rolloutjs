import { Hono, type MiddlewareHandler } from "hono";
import type { ContentfulStatusCode, StatusCode } from "hono/utils/http-status";
import type { LibreFlagServer } from "libreflag";
import { AdminRoutes } from "./admin.js";
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

  for (const route of libreFlag.routes) {
    app[route.method.toLowerCase() as "get" | "post" | "put" | "delete"](
      route.path,
      route.type === "ADMIN" ? adminMiddleware : evalMiddleware,
      async (c) => {
        const body = ["POST", "PUT"].includes(route.method)
          ? await c.req.json()
          : undefined;

        const {
          status,
          body: resBody,
          headers,
        } = await route.handler(
          c.req.param(),
          body,
          Object.fromEntries(c.req.raw.headers.entries()),
        );

        if (headers) {
          for (const [key, value] of Object.entries(headers)) {
            c.header(key, value);
          }
        }

        if (resBody) {
          return c.json(resBody, status as ContentfulStatusCode);
        }

        return c.body(null, status as StatusCode);
      },
    );
  }

  app.route("/libreflag/admin", AdminRoutes(adminMiddleware));

  return app;
}
