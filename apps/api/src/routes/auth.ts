import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { authConfigured, verifyOtp } from "../auth/password.js";
import { COOKIE, isAdmin, issueSession } from "../auth/session.js";

const err = (code: string, message: string) =>
  z.object({ error: z.object({ code: z.literal(code), message: z.string() }) });

/** Admin auth: one-time password from .env → httpOnly session cookie. */
export async function authRoutes(app: FastifyInstance) {
  const r = app.withTypeProvider<ZodTypeProvider>();

  r.post("/auth/verify", {
    config: { rateLimit: { max: 5, timeWindow: "15 minutes" } },
    schema: {
      tags: ["Auth"], summary: "Verify the admin one-time password and start a session",
      body: z.object({ password: z.string().min(1).max(200) }),
      response: {
        200: z.object({ data: z.object({ authenticated: z.literal(true) }) }),
        401: err("UNAUTHORIZED", "Invalid password."),
        503: err("SERVER", "Auth is not configured on the server."),
      },
    },
  }, async (req, reply) => {
    if (!authConfigured()) {
      return reply.status(503).send({ error: { code: "SERVER", message: "Auth is not configured on the server." } });
    }
    if (!verifyOtp(req.body.password)) {
      return reply.status(401).send({ error: { code: "UNAUTHORIZED", message: "Invalid password." } });
    }
    await issueSession(reply);
    return { data: { authenticated: true as const } };
  });

  r.post("/auth/logout", {
    schema: {
      tags: ["Auth"], summary: "End the admin session",
      response: { 200: z.object({ data: z.object({ authenticated: z.literal(false) }) }) },
    },
  }, async (_req, reply) => {
    reply.clearCookie(COOKIE, { path: "/" });
    return { data: { authenticated: false as const } };
  });

  r.get("/auth/session", {
    schema: {
      tags: ["Auth"], summary: "Current admin session state (for the UI)",
      response: { 200: z.object({ data: z.object({ authenticated: z.boolean() }) }) },
    },
  }, async (req) => ({ data: { authenticated: await isAdmin(req) } }));
}
