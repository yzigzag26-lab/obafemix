import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { getPool } from "../db/pool.js";

const Project = z.object({
  id: z.string(), slug: z.string(), title: z.string(), aside: z.string(),
  category: z.string(), tags: z.array(z.string()), featured: z.boolean(),
  status: z.string(), description: z.string(), description2: z.string(),
  role: z.string(), contributions: z.array(z.string()), stack: z.array(z.string()),
  liveUrl: z.string(), githubUrl: z.string(), image: z.string(), imageAlt: z.string(),
  caption: z.string(), location: z.string(), year: z.string(),
});
const Skill = z.object({
  id: z.string(), name: z.string(), percent: z.number(), category: z.string(),
  color: z.string(), featured: z.boolean(),
});
const CACHE = "public, s-maxage=300, stale-while-revalidate=86400";

function unavailable(reply: { status: (n: number) => { send: (b: unknown) => void } }) {
  return reply.status(503).send({ error: { code: "SERVER", message: "Database is not connected yet." } });
}

/** Public read APIs — the frontend's projects/skills/site content. */
export async function publicRoutes(app: FastifyInstance) {
  const r = app.withTypeProvider<ZodTypeProvider>();

  r.get("/projects", {
    schema: {
      tags: ["Public"], summary: "Published projects (filterable)",
      querystring: z.object({ category: z.string().optional(), featured: z.coerce.boolean().optional() }),
      response: { 200: z.object({ data: z.array(Project), meta: z.object({ count: z.number() }) }) },
    },
  }, async (req, reply) => {
    const pool = getPool(); if (!pool) return unavailable(reply as never);
    const { category, featured } = req.query;
    const rows = (await pool.query(
      `select id::text, slug, title, aside, category, tags, featured, status, description,
              description2, role, contributions, stack, live_url as "liveUrl",
              github_url as "githubUrl", image_url as image, image_alt as "imageAlt",
              caption, location, year
         from projects
        where published = true
          and ($1::text is null or category = $1)
          and ($2::boolean is null or featured = $2)
        order by sort_order, created_at`,
      [category ?? null, featured ?? null]
    )).rows;
    reply.header("Cache-Control", CACHE);
    return { data: rows, meta: { count: rows.length } };
  });

  r.get("/skills", {
    schema: {
      tags: ["Public"], summary: "Skills with percentages (filterable)",
      querystring: z.object({ category: z.string().optional(), featured: z.coerce.boolean().optional() }),
      response: { 200: z.object({ data: z.array(Skill), meta: z.object({ count: z.number() }) }) },
    },
  }, async (req, reply) => {
    const pool = getPool(); if (!pool) return unavailable(reply as never);
    const { category, featured } = req.query;
    const rows = (await pool.query(
      `select id::text, name, percent, category, icon_color as color, featured
         from skills
        where ($1::text is null or category = $1)
          and ($2::boolean is null or featured = $2)
        order by sort_order`,
      [category ?? null, featured ?? null]
    )).rows;
    reply.header("Cache-Control", CACHE);
    return { data: rows, meta: { count: rows.length } };
  });

  r.get("/site", {
    schema: {
      tags: ["Public"], summary: "Profile + titles + socials + settings in one request",
      response: { 200: z.object({ data: z.object({
        profile: z.record(z.string(), z.unknown()).nullable(),
        titles: z.array(z.string()),
        socials: z.array(z.record(z.string(), z.unknown())),
        settings: z.record(z.string(), z.unknown()).nullable(),
      }) }) },
    },
  }, async (_req, reply) => {
    const pool = getPool(); if (!pool) return unavailable(reply as never);
    const [profile, titles, socials, settings] = await Promise.all([
      pool.query(`select display_name as "displayName", alias, headline, description, location, timezone, avatar_url as "avatarUrl", availability from profile where id = 1`),
      pool.query(`select label from professional_titles order by sort_order`),
      pool.query(`select platform, url, published from social_links order by sort_order`),
      pool.query(`select meta_title as "metaTitle", meta_description as "metaDescription", keywords, theme_color as "themeColor", og_image_url as "ogImageUrl", contact_email as "contactEmail" from site_settings where id = 1`),
    ]);
    reply.header("Cache-Control", CACHE);
    return {
      data: {
        profile: profile.rows[0] ?? null,
        titles: titles.rows.map((t) => t.label as string),
        socials: socials.rows,
        settings: settings.rows[0] ?? null,
      },
    };
  });
}
