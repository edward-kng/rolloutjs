import { Hono } from "hono";
import type { ContentfulStatusCode, StatusCode } from "hono/utils/http-status";
import type { LibreFlagServer } from "libreflag";

export function SegmentRoutes(libreflag: LibreFlagServer) {
  const app = new Hono();

  app.get("/", async (c) => {
    const { status, body } = await libreflag.http.listSegments();

    if (!body) {
      return c.body(null, status as StatusCode);
    }

    return c.json(body, status as ContentfulStatusCode);
  });

  app.post("/", async (c) => {
    const { status, body } = await libreflag.http.createSegment(
      await c.req.json(),
    );

    if (!body) {
      return c.body(null, status as StatusCode);
    }

    return c.json(body, status as ContentfulStatusCode);
  });

  app.put("/:segmentKey", async (c) => {
    const { status, body } = await libreflag.http.updateSegment(
      c.req.param("segmentKey"),
      await c.req.json(),
    );

    if (!body) {
      return c.body(null, status as StatusCode);
    }

    return c.json(body, status as ContentfulStatusCode);
  });

  app.delete("/:segmentKey", async (c) => {
    const { status, body } = await libreflag.http.deleteSegment(
      c.req.param("segmentKey"),
    );

    if (!body) {
      return c.body(null, status as StatusCode);
    }

    return c.json(body, status as ContentfulStatusCode);
  });

  app.get("/:segmentKey/overrides", async (c) => {
    const { status, body } = await libreflag.http.getSegmentOverrides(
      c.req.param("segmentKey"),
    );

    if (!body) {
      return c.body(null, status as StatusCode);
    }

    return c.json(body, status as ContentfulStatusCode);
  });

  app.put("/:segmentKey/overrides/:flagKey", async (c) => {
    const reqBody = await c.req.json();
    const { status, body } = await libreflag.http.setSegmentOverride(
      c.req.param("segmentKey"),
      c.req.param("flagKey"),
      reqBody?.value,
    );

    if (!body) {
      return c.body(null, status as StatusCode);
    }

    return c.json(body, status as ContentfulStatusCode);
  });

  app.delete("/:segmentKey/overrides/:flagKey", async (c) => {
    const { status, body } = await libreflag.http.deleteSegmentOverride(
      c.req.param("segmentKey"),
      c.req.param("flagKey"),
    );

    if (!body) {
      return c.body(null, status as StatusCode);
    }

    return c.json(body, status as ContentfulStatusCode);
  });

  return app;
}
