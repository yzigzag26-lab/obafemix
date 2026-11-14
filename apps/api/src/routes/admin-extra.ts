import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { createHash } from "node:crypto";
import { getPool } from "../db/pool.js";
import { requireAdmin } from "../auth/session.js";

const ok = z.object({ data: z.object({ ok: z.literal(true) }) });
const notFound = z.object({ error: z.object({ code: z.literal("NOT_FOUND"), message: z.string() }) });

/** Remaining admin writes (profile, settings, titles, socials) + contact inbox,
 *  and the public contact endpoint. Admin routes are behind requireAdmin. */
export async function adminExtraRoutes(app: FastifyInstance) {
  const r = app.withTypeProvider<ZodTypeProvider>();

  // ---- Public: contact form -------------------------------------------------
  r.post("/contact", {
    config: { rateLimit: { max: 5, timeWindow: "10 minutes" } },
    schema: {
      tags: ["Public"], summary: "Send a contact message (stored in the database)",
      body: z.object({
        name: z.string().min(2), email: z.string().email(),
        subject: z.enum(["Project Collaboration", "Job Opportunity", "Freelance Work", "General Question"]),
        message: z.string().min(10), company: z.string().max(0).optional(), // honeypot
      }),
      response: { 201: z.object({ data: z.object({ id: z.string(), emailed: z.literal(false) }) }),
                  503: z.object({ error: z.object({ code: z.literal("SERVER"), message: z.string() }) }) },
    },
  }, async (req, reply) => {
    const pool = getPool();
    if (!pool) return reply.status(503).send({ error: { code: "SERVER", message: "Database is not connected yet." } });
    const ipHash = createHash("sha256").update(req.ip).digest("hex").slice(0, 32);
    const row = (await pool.query(
      `insert into contact_messages (name,email,subject,message,ip_hash,user_agent) values ($1,$2,$3,$4,$5,$6) returning id::text`,
      [req.body.name, req.body.email, req.body.subject, req.body.message, ipHash, String(req.headers["user-agent"] ?? "").slice(0, 200)]
    )).rows[0];
    // emailed stays false until a Resend key is configured — storage is the source of truth.
    return reply.status(201).send({ data: { id: row.id, emailed: false as const } });
  });

  // ---- Admin-only below -------------------------------------------------------
  const a = r.withTypeProvider<ZodTypeProvider>();
  a.addHook("preValidation", requireAdmin);
  const poolOr503 = (reply: { status: (n: number) => { send: (b: unknown) => void } }) => {
    const pool = getPool();
    if (!pool) reply.status(503).send({ error: { code: "SERVER", message: "Database is not connected yet." } });
    return pool;
  };

  a.patch("/admin/profile", {
    schema: { tags: ["Admin"], summary: "Update profile (incl. About bio)",
      body: z.object({
        displayName: z.string().min(1).optional(), alias: z.string().optional(),
        headline: z.string().optional(), description: z.string().optional(),
        location: z.string().optional(), timezone: z.string().optional(),
        avatarUrl: z.string().optional(), availability: z.string().optional(), aboutBio: z.string().optional(),
      }), response: { 200: ok } },
  }, async (req, reply) => {
    const pool = poolOr503(reply as never); if (!pool) return;
    const b = req.body;
    await pool.query(
      `update profile set display_name=coalesce($2,display_name), alias=coalesce($3,alias),
       headline=coalesce($4,headline), description=coalesce($5,description), location=coalesce($6,location),
       timezone=coalesce($7,timezone), avatar_url=coalesce($8,avatar_url),
       availability=coalesce($9,availability), about_bio=coalesce($10,about_bio), updated_at=now() where id=$1`,
      [1, b.displayName ?? null, b.alias ?? null, b.headline ?? null, b.description ?? null,
       b.location ?? null, b.timezone ?? null, b.avatarUrl ?? null, b.availability ?? null, b.aboutBio ?? null]
    );
    return { data: { ok: true as const } };
  });

  a.patch("/admin/settings", {
    schema: { tags: ["Admin"], summary: "Update site metadata/settings",
      body: z.object({
        metaTitle: z.string().optional(), metaDescription: z.string().max(200).optional(),
        keywords: z.string().optional(),
        themeColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
        ogImageUrl: z.string().optional(), contactEmail: z.string().email().optional(),
      }), response: { 200: ok } },
  }, async (req, reply) => {
    const pool = poolOr503(reply as never); if (!pool) return;
    const b = req.body;
    await pool.query(
      `update site_settings set meta_title=coalesce($2,meta_title), meta_description=coalesce($3,meta_description),
       keywords=coalesce($4,keywords), theme_color=coalesce($5,theme_color),
       og_image_url=coalesce($6,og_image_url), contact_email=coalesce($7,contact_email), updated_at=now() where id=$1`,
      [1, b.metaTitle ?? null, b.metaDescription ?? null, b.keywords ?? null, b.themeColor ?? null, b.ogImageUrl ?? null, b.contactEmail ?? null]
    );
    return { data: { ok: true as const } };
  });

  a.get("/admin/titles", {
    schema: { tags: ["Admin"], summary: "Typing titles with ids",
      response: { 200: z.object({ data: z.array(z.object({ id: z.string(), label: z.string(), sortOrder: z.number() })) }) } },
  }, async (_req, reply) => {
    const pool = poolOr503(reply as never); if (!pool) return;
    const rows = (await pool.query(`select id::text, label, sort_order as "sortOrder" from professional_titles order by sort_order`)).rows;
    return { data: rows };
  });

  a.post("/admin/titles", {
    schema: { tags: ["Admin"], summary: "Add a typing title (max 6)",
      body: z.object({ label: z.string().min(1) }),
      response: { 201: z.object({ data: z.object({ id: z.string() }) }),
                  400: z.object({ error: z.object({ code: z.literal("VALIDATION"), message: z.string() }) }) } },
  }, async (req, reply) => {
    const pool = poolOr503(reply as never); if (!pool) return;
    const count = (await pool.query(`select count(*)::int as n from professional_titles`)).rows[0].n as number;
    if (count >= 6) return reply.status(400).send({ error: { code: "VALIDATION", message: "Maximum of 6 titles." } });
    const row = (await pool.query(
      `insert into professional_titles (label, sort_order) values ($1, $2) returning id::text`,
      [req.body.label, count + 1]
    )).rows[0];
    return reply.status(201).send({ data: row });
  });

  a.delete("/admin/titles/:id", {
    schema: { tags: ["Admin"], summary: "Delete a typing title",
      params: z.object({ id: z.string().uuid() }), response: { 200: ok, 404: notFound } },
  }, async (req, reply) => {
    const pool = poolOr503(reply as never); if (!pool) return;
    const res = await pool.query(`delete from professional_titles where id=$1`, [req.params.id]);
    if (!res.rowCount) return reply.status(404).send({ error: { code: "NOT_FOUND", message: "Title not found." } });
    return { data: { ok: true as const } };
  });

  a.put("/admin/socials/:platform", {
    schema: { tags: ["Admin"], summary: "Set a social link URL + published toggle",
      params: z.object({ platform: z.string().min(1) }),
      body: z.object({ url: z.string().default(""), published: z.boolean() }),
      response: { 200: ok } },
  }, async (req, reply) => {
    const pool = poolOr503(reply as never); if (!pool) return;
    await pool.query(
      `insert into social_links (platform,url,published) values ($1,$2,$3)
       on conflict (platform) do update set url=excluded.url, published=excluded.published`,
      [req.params.platform, req.body.url, req.body.published]
    );
    return { data: { ok: true as const } };
  });

  // ---- Contact inbox ---------------------------------------------------------
  a.get("/admin/contact", {
    schema: { tags: ["Admin"], summary: "Contact message inbox",
      querystring: z.object({ unread: z.coerce.boolean().optional() }),
      response: { 200: z.object({ data: z.array(z.object({
        id: z.string(), name: z.string(), email: z.string(), subject: z.string(), message: z.string(),
        readAt: z.string().nullable(), createdAt: z.string(),
      })), meta: z.object({ count: z.number() }) }) } },
  }, async (req, reply) => {
    const pool = poolOr503(reply as never); if (!pool) return;
    const rows = (await pool.query(
      `select id::text, name, email, subject, message, read_at as "readAt", created_at as "createdAt"
         from contact_messages where ($1::boolean is null or read_at is null) order by created_at desc limit 100`,
      [req.query.unread ?? null]
    )).rows.map((m) => ({ ...m, readAt: m.readAt ? new Date(m.readAt).toISOString() : null, createdAt: new Date(m.createdAt).toISOString() }));
    return { data: rows, meta: { count: rows.length } };
  });

  a.patch("/admin/contact/:id", {
    schema: { tags: ["Admin"], summary: "Mark a message read/replied",
      params: z.object({ id: z.string().uuid() }),
      body: z.object({ read: z.boolean().optional(), replied: z.boolean().optional() }),
      response: { 200: ok, 404: notFound } },
  }, async (req, reply) => {
    const pool = poolOr503(reply as never); if (!pool) return;
    const res = await pool.query(
      `update contact_messages set read_at = case when $2 then coalesce(read_at, now()) else read_at end,
       replied_at = case when $3 then coalesce(replied_at, now()) else replied_at end where id=$1`,
      [req.params.id, req.body.read ?? false, req.body.replied ?? false]
    );
    if (!res.rowCount) return reply.status(404).send({ error: { code: "NOT_FOUND", message: "Message not found." } });
    return { data: { ok: true as const } };
  });

  a.delete("/admin/contact/:id", {
    schema: { tags: ["Admin"], summary: "Delete a message",
      params: z.object({ id: z.string().uuid() }), response: { 200: ok, 404: notFound } },
  }, async (req, reply) => {
    const pool = poolOr503(reply as never); if (!pool) return;
    const res = await pool.query(`delete from contact_messages where id=$1`, [req.params.id]);
    if (!res.rowCount) return reply.status(404).send({ error: { code: "NOT_FOUND", message: "Message not found." } });
    return { data: { ok: true as const } };
  });
}
