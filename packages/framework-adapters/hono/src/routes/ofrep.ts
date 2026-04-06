import { Hono } from "hono";
import type { ContentfulStatusCode, StatusCode } from "hono/utils/http-status";
import type { LibreFlagServer } from "libreflag";

export function OFREPRoutes(libreflag: LibreFlagServer) {
  const app = new Hono();

  app.post("/evaluate/flags/:flagKey", async (c) => {
    const { status, body } = await libreflag.http.evaluate(
      c.req.param("flagKey"),
      await c.req.json(),
    );

    if (!body) {
      return c.body(null, status as StatusCode);
    }

    return c.json(body, status as ContentfulStatusCode);
  });

  app.post("/evaluate/flags", async (c) => {
    const ifNoneMatch = c.req.header("if-none-match");
    const { status, body, etag } = await libreflag.http.evaluateAll(
      await c.req.json(),
      ifNoneMatch,
    );

    if (etag) c.header("ETag", etag);

    if (status === 304) {
      return c.body(null, 304);
    }

    if (!body) {
      return c.body(null, status as StatusCode);
    }

    return c.json(body, status as ContentfulStatusCode);
  });

  return app;
}
