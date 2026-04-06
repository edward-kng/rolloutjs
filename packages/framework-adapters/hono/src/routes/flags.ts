import { Hono } from "hono";
import type { ContentfulStatusCode, StatusCode } from "hono/utils/http-status";
import type { LibreFlagServer } from "libreflag";

export function FlagRoutes(libreflag: LibreFlagServer) {
  const app = new Hono();

  app.get("/", async (c) => {
    const { status, body } = await libreflag.http.listFlags();

    if (!body) {
      return c.body(null, status as StatusCode);
    }

    return c.json(body, status as ContentfulStatusCode);
  });

  app.get("/:flagKey", async (c) => {
    const { status, body } = await libreflag.http.getFlag(
      c.req.param("flagKey"),
    );

    if (!body) {
      return c.body(null, status as StatusCode);
    }

    return c.json(body, status as ContentfulStatusCode);
  });

  app.post("/", async (c) => {
    const { status, body } = await libreflag.http.createFlag(
      await c.req.json(),
    );

    if (!body) {
      return c.body(null, status as StatusCode);
    }

    return c.json(body, status as ContentfulStatusCode);
  });

  app.put("/:flagKey", async (c) => {
    const flagKey = c.req.param("flagKey");
    const { status, body } = await libreflag.http.updateFlag(
      flagKey,
      await c.req.json(),
    );

    if (!body) {
      return c.body(null, status as StatusCode);
    }

    return c.json(body, status as ContentfulStatusCode);
  });

  app.delete("/:flagKey", async (c) => {
    const { status, body } = await libreflag.http.deleteFlag(
      c.req.param("flagKey"),
    );

    if (!body) {
      return c.body(null, status as StatusCode);
    }

    return c.json(body, status as ContentfulStatusCode);
  });

  app.get("/:flagKey/overrides", async (c) => {
    const { status, body } = await libreflag.http.getFlagOverrides(
      c.req.param("flagKey"),
    );

    if (!body) {
      return c.body(null, status as StatusCode);
    }

    return c.json(body, status as ContentfulStatusCode);
  });

  return app;
}
