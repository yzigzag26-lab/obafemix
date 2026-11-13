import Fastify, { type FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import rateLimit from "@fastify/rate-limit";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { loadEnv, type Env } from "./config/env.js";
import { healthRoutes } from "./routes/health.js";

/**
 * Builds the Fastify app (no listening here — server.ts does that,
 * so tests can import this and use app.inject()).
 *
 * Documentation rule for this codebase: every route declares zod
 * request/response schemas (see routes/health.ts). Swagger UI at /docs
 * is GENERATED from those schemas, so the docs are accurate by construction.
 */
export async function buildApp(env: Env = loadEnv()): Promise<FastifyInstance> {
  const app = Fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  // ---- Plugins -------------------------------------------------------------
  await app.register(cors, {
    origin: env.SITE_ORIGIN, // only the portfolio site may call us from a browser
    credentials: true, // allow the httpOnly admin session cookie
  });
  await app.register(cookie);
  await app.register(rateLimit, { max: 100, timeWindow: "1 minute" }); // per-route overrides for auth/contact

  // ---- Swagger (must be registered before routes) --------------------------
  await app.register(swagger, {
    openapi: {
      info: {
        title: "OBAFEMIX API",
        description:
          "Backend for the OBAFEMIX portfolio. Admin operations require the session cookie issued by POST /auth/verify (one-time password from server .env). Full guide: docs/API.md in the repo.",
        version: "1.0.0",
      },
      servers: [{ url: "/api/v1" }],
      components: {
        securitySchemes: {
          sessionCookie: { type: "apiKey", in: "cookie", name: "obafemix_session" },
        },
      },
    },
    transform: jsonSchemaTransform,
  });
  await app.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: { docExpansion: "list", deepLinking: true },
  });

  // ---- Shared error envelope: { error: { code, message, fields? } } -------
  app.setErrorHandler((error, _req, reply) => {
    const err = error as { validation?: unknown; statusCode?: number; message?: string };
    if (err.validation) {
      return reply.status(400).send({
        error: { code: "VALIDATION", message: "Request failed validation.", fields: err.validation },
      });
    }
    const status = err.statusCode ?? 500;
    return reply.status(status).send({
      error: { code: status === 500 ? "SERVER" : "ERROR", message: err.message ?? "Unexpected error" },
    });
  });

  // ---- Routes (versioned) ---------------------------------------------------
  await app.register(
    async (v1) => {
      await v1.register(healthRoutes);
      // Next steps, one file per resource in src/routes/:
      //   site.ts · projects.ts · skills.ts · contact.ts · auth.ts · admin-media.ts · ai.ts
    },
    { prefix: "/api/v1" }
  );

  return app;
}
