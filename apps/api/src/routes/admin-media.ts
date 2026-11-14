import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { requireAdmin } from "../auth/session.js";
import { getPool } from "../db/pool.js";

const err = (code: string) => z.object({ error: z.object({ code: z.literal(code), message: z.string() }) });

/** Image storage, v2: files are stored in Postgres (media_assets) and
 *  served by GET /media/:id. Chosen over Supabase Storage so uploads work
 *  with the DATABASE_URL the API already has — no extra secret keys.
 *  projects.image_url stores the absolute /media URL on Save. */

export async function adminMediaRoutes(app: FastifyInstance) {
  const r = app.withTypeProvider<ZodTypeProvider>();
  r.addHook("preValidation", requireAdmin);

  r.post("/admin/media", {
    schema: {
      tags: ["Admin"], summary: "Upload a project image (multipart, field 'file')",
      response: { 201: z.object({ data: z.object({ id: z.string() }) }), 400: err("VALIDATION"), 503: err("SERVER") },
    },
  }, async (req, reply) => {
    const pool = getPool();
    if (!pool) return reply.status(503).send({ error: { code: "SERVER", message: "Database is not connected yet." } });
    const part = await req.file().catch(() => null);
    if (!part) return reply.status(400).send({ error: { code: "VALIDATION", message: "No file received (expected multipart field 'file')." } });
    if (!part.mimetype.startsWith("image/") && part.mimetype !== "application/pdf") return reply.status(400).send({ error: { code: "VALIDATION", message: "Only image files or PDFs are allowed." } });
    const buffer = await part.toBuffer();
    if (!buffer.length || buffer.length > 6 * 1024 * 1024) return reply.status(400).send({ error: { code: "VALIDATION", message: "Image must be between 1 byte and 6 MB." } });
    const row = (await pool.query(
      `insert into media_assets (content_type, data) values ($1, $2) returning id::text`,
      [part.mimetype, buffer]
    )).rows[0];
    return reply.status(201).send({ data: { id: row.id as string } });
  });
}

/** Public image serving — project cards link here. Long immutable cache. */
export async function mediaPublicRoutes(app: FastifyInstance) {
  app.get("/media/:id", async (req, reply) => {
    const pool = getPool();
    if (!pool) return reply.status(503).send({ error: { code: "SERVER", message: "Database is not connected yet." } });
    const { id } = req.params as { id: string };
    if (!/^[0-9a-f-]{36}$/i.test(id)) return reply.status(404).send({ error: { code: "NOT_FOUND", message: "Image not found." } });
    const row = (await pool.query(`select content_type, data from media_assets where id = $1`, [id])).rows[0];
    if (!row) return reply.status(404).send({ error: { code: "NOT_FOUND", message: "Image not found." } });
    const isPdf = (row.content_type as string) === "application/pdf";
    return reply
      .header("Content-Type", row.content_type as string)
      .header("Cache-Control", "public, max-age=31536000, immutable")
      // PDFs download as a file (the Resume button); images display inline.
      .header("Content-Disposition", isPdf ? 'attachment; filename="OBAFEMIX-Resume.pdf"' : "inline")
      .send(row.data as Buffer);
  });
}
