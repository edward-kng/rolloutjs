import type {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import fastifyStatic from "@fastify/static";
import { createRequire } from "node:module";
import path from "node:path";

export function adminPlugin(
  adminHook: (request: FastifyRequest, reply: FastifyReply) => Promise<void>,
): FastifyPluginAsync {
  return async (fastify: FastifyInstance) => {
    fastify.addHook("preHandler", adminHook);

    const require = createRequire(import.meta.url);
    const adminDistPath = path.dirname(
      require.resolve("@libreflag/admin/package.json"),
    );
    const staticPath = path.join(adminDistPath, "dist");

    await fastify.register(fastifyStatic, {
      root: staticPath,
      wildcard: false,
    });

    fastify.get("/*", async (_request, reply) => {
      return reply.sendFile("index.html");
    });
  };
}
