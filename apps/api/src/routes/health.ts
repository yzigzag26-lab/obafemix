import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { dbOk } from "../db/pool.js";

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
        db: await dbOk(),
        time: new Date().toISOString(),
      },
    })
  );
}
