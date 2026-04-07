import type {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import type { LibreFlagServer } from "libreflag";
import cors, { type FastifyCorsOptions } from "@fastify/cors";
import { adminPlugin } from "./admin.js";

export interface LibreFlagFastifyOptions {
  adminHook?: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  evalHook?: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  corsOptions?: FastifyCorsOptions;
}

export function LibreFlagFastify(
  libreFlag: LibreFlagServer,
  {
    adminHook = async (_request, reply) => {
      reply.status(403).send();
    },
    evalHook,
    corsOptions = {
      origin: true,
      exposedHeaders: ["ETag"],
    },
  }: LibreFlagFastifyOptions = {},
): FastifyPluginAsync {
  return async (fastify: FastifyInstance) => {
    await fastify.register(async (scope) => {
      await scope.register(cors, corsOptions);
      for (const route of libreFlag.routes.filter((r) => r.type === "EVAL")) {
        scope[route.method.toLowerCase() as "get" | "post" | "put" | "delete"](
          route.path,
          { preHandler: evalHook },
          async (request, reply) => {
            const { status, body, headers } = await route.handler(
              request.params as Record<string, string>,
              request.body,
              request.headers as Record<string, string>,
            );

            if (headers) reply.headers(headers);
            if (body) return reply.status(status).send(body);
            return reply.status(status).send();
          },
        );
      }
    });

    for (const route of libreFlag.routes.filter((r) => r.type === "ADMIN")) {
      fastify[route.method.toLowerCase() as "get" | "post" | "put" | "delete"](
        route.path,
        { preHandler: adminHook },
        async (request, reply) => {
          const { status, body, headers } = await route.handler(
            request.params as Record<string, string>,
            request.body,
            request.headers as Record<string, string>,
          );

          if (headers) reply.headers(headers);
          if (body) return reply.status(status).send(body);
          return reply.status(status).send();
        },
      );
    }

    await fastify.register(adminPlugin(adminHook), {
      prefix: "/libreflag/admin",
    });
  };
}
