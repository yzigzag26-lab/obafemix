import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { getPool } from "../db/pool.js";
import { requireAdmin } from "../auth/session.js";

const ProjectIn = z.object({
  title: z.string().min(2), aside: z.string().default(""),
  category: z.enum(["Web Apps", "African Language Tech", "Open Source", "Mobile Apps", "Backend & APIs", "Other"]),
  tags: z.string().default(""), featured: z.boolean().default(false),
  status: z.enum(["Live", "In Progress", "Completed", "Archived", "Coming Soon"]).default("Live"),
  description: z.string().min(20), description2: z.string().default(""),
  role: z.string().min(1), contributions: z.array(z.string()).default([]),
  stack: z.array(z.string()).default([]),
  liveUrl: z.string().refine((v) => v === "" || /^https:\/\//.test(v), "Live URL must start with https://").default(""),
  githubUrl: z.string().refine((v) => v === "" || /^https:\/\//.test(v), "GitHub URL must start with https://").default(""),
  image: z.string().min(1), imageAlt: z.string().min(1), caption: z.string().default(""),
  location: z.string().default("Nigeria"), year: z.string().default("2026"),
  published: z.boolean().default(true),
});
const SkillIn = z.object({
  name: z.string().min(1), percent: z.number().int().min(0).max(100),
  category: z.string().min(1), color: z.string().default("#a78bfa"), featured: z.boolean().default(false),
});
const STATUS_DB: Record<string, string> = { Live: "live", "In Progress": "in_progress", Completed: "completed", Archived: "archived", "Coming Soon": "coming_soon" };
const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/** Admin write APIs — every route is behind requireAdmin (session cookie). */
export async function adminRoutes(app: FastifyInstance) {
  const r = app.withTypeProvider<ZodTypeProvider>();
  // preValidation (not preHandler) so unauthenticated calls get 401 before body validation runs
  r.addHook("preValidation", requireAdmin);

  const db = (reply: { status: (n: number) => { send: (b: unknown) => void } }) => {
    const pool = getPool();
    if (!pool) reply.status(503).send({ error: { code: "SERVER", message: "Database is not connected yet." } });
    return pool;
  };

  // ---- Projects -------------------------------------------------------------
  r.post("/admin/projects", {
    schema: { tags: ["Admin"], summary: "Create a project", body: ProjectIn,
      response: { 201: z.object({ data: z.object({ id: z.string(), slug: z.string() }) }) } },
  }, async (req, reply) => {
    const pool = db(reply as never); if (!pool) return;
    const p = req.body;
    const slug = slugify(p.title);
    const row = (await pool.query(
      `insert into projects (slug,title,aside,category,tags,featured,status,description,description2,role,contributions,stack,live_url,github_url,image_url,image_alt,caption,location,year,published)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
       on conflict (slug) do update set title=excluded.title returning id::text, slug`,
      [slug, p.title, p.aside, p.category, p.tags.split(",").map((s) => s.trim()).filter(Boolean),
       p.featured, STATUS_DB[p.status], p.description, p.description2, p.role, p.contributions,
       p.stack, p.liveUrl, p.githubUrl, p.image, p.imageAlt, p.caption, p.location, p.year, p.published]
    )).rows[0];
    return reply.status(201).send({ data: row });
  });

  r.put("/admin/projects/:id", {
    schema: { tags: ["Admin"], summary: "Update a project",
      params: z.object({ id: z.string().uuid() }), body: ProjectIn,
      response: { 200: z.object({ data: z.object({ id: z.string() }) }), 404: z.object({ error: z.object({ code: z.literal("NOT_FOUND"), message: z.string() }) }) } },
  }, async (req, reply) => {
    const pool = db(reply as never); if (!pool) return;
    const p = req.body;
    const res = await pool.query(
      `update projects set title=$2,aside=$3,category=$4,tags=$5,featured=$6,status=$7,description=$8,
       description2=$9,role=$10,contributions=$11,stack=$12,live_url=$13,github_url=$14,image_url=$15,
       image_alt=$16,caption=$17,location=$18,year=$19,published=$20,updated_at=now() where id=$1`,
      [req.params.id, p.title, p.aside, p.category, p.tags.split(",").map((s) => s.trim()).filter(Boolean),
       p.featured, STATUS_DB[p.status], p.description, p.description2, p.role, p.contributions,
       p.stack, p.liveUrl, p.githubUrl, p.image, p.imageAlt, p.caption, p.location, p.year, p.published]
    );
    if (!res.rowCount) return reply.status(404).send({ error: { code: "NOT_FOUND", message: "Project not found." } });
    return { data: { id: req.params.id } };
  });

  r.delete("/admin/projects/:id", {
    schema: { tags: ["Admin"], summary: "Delete a project",
      params: z.object({ id: z.string().uuid() }),
      response: { 200: z.object({ data: z.object({ deleted: z.literal(true) }) }), 404: z.object({ error: z.object({ code: z.literal("NOT_FOUND"), message: z.string() }) }) } },
  }, async (req, reply) => {
    const pool = db(reply as never); if (!pool) return;
    const res = await pool.query(`delete from projects where id=$1`, [req.params.id]);
    if (!res.rowCount) return reply.status(404).send({ error: { code: "NOT_FOUND", message: "Project not found." } });
    return { data: { deleted: true as const } };
  });

  // ---- Skills ---------------------------------------------------------------
  r.post("/admin/skills", {
    schema: { tags: ["Admin"], summary: "Create a skill (name, percent, category)",
      body: SkillIn, response: { 201: z.object({ data: z.object({ id: z.string() }) }) } },
  }, async (req, reply) => {
    const pool = db(reply as never); if (!pool) return;
    const s = req.body;
    const row = (await pool.query(
      `insert into skills (name,percent,category,icon_color,featured) values ($1,$2,$3,$4,$5)
       on conflict (name) do update set percent=excluded.percent, category=excluded.category,
         icon_color=excluded.icon_color, featured=excluded.featured returning id::text`,
      [s.name, s.percent, s.category, s.color, s.featured]
    )).rows[0];
    return reply.status(201).send({ data: row });
  });

  r.put("/admin/skills/:id", {
    schema: { tags: ["Admin"], summary: "Update a skill",
      params: z.object({ id: z.string().uuid() }), body: SkillIn,
      response: { 200: z.object({ data: z.object({ id: z.string() }) }), 404: z.object({ error: z.object({ code: z.literal("NOT_FOUND"), message: z.string() }) }) } },
  }, async (req, reply) => {
    const pool = db(reply as never); if (!pool) return;
    const s = req.body;
    const res = await pool.query(
      `update skills set name=$2,percent=$3,category=$4,icon_color=$5,featured=$6 where id=$1`,
      [req.params.id, s.name, s.percent, s.category, s.color, s.featured]
    );
    if (!res.rowCount) return reply.status(404).send({ error: { code: "NOT_FOUND", message: "Skill not found." } });
    return { data: { id: req.params.id } };
  });

  r.delete("/admin/skills/:id", {
    schema: { tags: ["Admin"], summary: "Delete a skill",
      params: z.object({ id: z.string().uuid() }),
      response: { 200: z.object({ data: z.object({ deleted: z.literal(true) }) }), 404: z.object({ error: z.object({ code: z.literal("NOT_FOUND"), message: z.string() }) }) } },
  }, async (req, reply) => {
    const pool = db(reply as never); if (!pool) return;
    const res = await pool.query(`delete from skills where id=$1`, [req.params.id]);
    if (!res.rowCount) return reply.status(404).send({ error: { code: "NOT_FOUND", message: "Skill not found." } });
    return { data: { deleted: true as const } };
  });
}
