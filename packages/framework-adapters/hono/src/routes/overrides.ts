import { Hono } from "hono";
import type { ContentfulStatusCode, StatusCode } from "hono/utils/http-status";
import type { LibreFlagServer } from "libreflag";

export function OverrideRoutes(libreflag: LibreFlagServer) {
  const app = new Hono();

  app.get("/", async (c) => {
    const { status, body } = await libreflag.http.listOverrides();

    if (!body) {
      return c.body(null, status as StatusCode);
    }

    return c.json(body, status as ContentfulStatusCode);
  });

  app.get("/:targetingKey", async (c) => {
    const { status, body } = await libreflag.http.getUserOverrides(
      c.req.param("targetingKey"),
    );

    if (!body) {
      return c.body(null, status as StatusCode);
    }

    return c.json(body, status as ContentfulStatusCode);
  });

  app.put("/:targetingKey/:flagKey", async (c) => {
    const reqBody = await c.req.json();
    const { status, body } = await libreflag.http.setUserOverride(
      c.req.param("targetingKey"),
      c.req.param("flagKey"),
      reqBody?.value,
    );

    if (!body) {
      return c.body(null, status as StatusCode);
    }

    return c.json(body, status as ContentfulStatusCode);
  });

  app.delete("/:targetingKey/:flagKey", async (c) => {
    const { status, body } = await libreflag.http.deleteUserOverride(
      c.req.param("targetingKey"),
      c.req.param("flagKey"),
    );

    if (!body) {
      return c.body(null, status as StatusCode);
    }

    return c.json(body, status as ContentfulStatusCode);
  });

  return app;
}
