import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { requireAdmin } from "../auth/session.js";
import { storageConfigured, uploadProjectImage } from "../storage.js";

const err = (code: string) => z.object({ error: z.object({ code: z.literal(code), message: z.string() }) });

/** POST /admin/media — admin image upload to Supabase Storage.
 *  The browser sends the (already 16:10-cropped) image here with the
 *  session cookie; the API stores it and returns the public URL, which
 *  the dashboard then saves into projects.image_url on Save. */
export async function adminMediaRoutes(app: FastifyInstance) {
  const r = app.withTypeProvider<ZodTypeProvider>();
  r.addHook("preValidation", requireAdmin);

  r.post("/admin/media", {
    schema: {
      tags: ["Admin"], summary: "Upload a project image (multipart, field 'file')",
      response: {
        201: z.object({ data: z.object({ url: z.string() }) }),
        400: err("VALIDATION"), 503: err("SERVER"),
      },
    },
  }, async (req, reply) => {
    if (!storageConfigured()) {
      return reply.status(503).send({ error: { code: "SERVER", message: "Image storage is not configured on the API (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing)." } });
    }
    const part = await req.file().catch(() => null);
    if (!part) return reply.status(400).send({ error: { code: "VALIDATION", message: "No file received (expected multipart field 'file')." } });
    if (!part.mimetype.startsWith("image/")) {
      return reply.status(400).send({ error: { code: "VALIDATION", message: "Only image files are allowed." } });
    }
    const buffer = await part.toBuffer();
    if (!buffer.length || buffer.length > 6 * 1024 * 1024) {
      return reply.status(400).send({ error: { code: "VALIDATION", message: "Image must be between 1 byte and 6 MB." } });
    }
    try {
      const url = await uploadProjectImage(buffer, part.mimetype);
      return reply.status(201).send({ data: { url } });
    } catch (e) {
      req.log.error(e);
      return reply.status(503).send({ error: { code: "SERVER", message: "Storage upload failed — check the API logs." } });
    }
  });
}
