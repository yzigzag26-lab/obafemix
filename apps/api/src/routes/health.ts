import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

/** GET /api/v1/health — liveness probe (Render healthCheckPath + keep-alive ping target). */
export async function healthRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/health",
    {
      schema: {
        tags: ["System"],
        summary: "Liveness + DB probe",
        response: {
          200: z.object({
            data: z.object({
              status: z.literal("ok"),
              db: z.boolean().describe("Database reachability — false until DATABASE_URL is wired"),
              time: z.string(),
            }),
          }),
        },
      },
    },
    async () => ({
      data: {
        status: "ok" as const,
        // TODO(database step): run `select 1` via the pg pool and report the result.
        db: Boolean(process.env.DATABASE_URL),
        time: new Date().toISOString(),
      },
    })
  );
}
