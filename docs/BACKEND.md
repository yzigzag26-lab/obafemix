# OBAFEMIX — Backend Architecture

> Status: **blueprint (not yet built)**. Today the site is fully static: admin edits live in
> `localStorage`, the contact form uses `mailto:`, and the AI assistant answers on-device.
> This document is the agreed structure for the backend phase. Every endpoint is specified in
> [`docs/API.md`](./API.md) (human) and [`docs/openapi.yaml`](./openapi.yaml) (machine-readable).

---

## 1. Decision: one backend, two layers

| Layer | Where | Responsibility |
|---|---|---|
| **Supabase** (hosted) | Postgres + Auth + Storage + RLS | System of record. Content, admin identity, media files. |
| **Next.js API routes** (`app/api/**`) | Same repo, same deploy | The only public HTTP surface. Validation, rate-limiting, caching, email, AI — everything Supabase can't safely do from the browser. |

**Why not call Supabase directly from the browser for everything?**
Reads of published content *may* go browser → Supabase (RLS-protected, anon key).
Everything else (writes, contact form, AI, uploads) goes browser → **our API routes** → Supabase with the service-role key held server-side only. One place for validation, abuse control and honest error messages.

**Supabase project:** none exists for OBAFEMIX yet (checked 2026-11-13 — the account's existing projects are unrelated). Build phase starts by creating project `obafemix` (region: `eu-west-1`, closest sensible to NG traffic) and disabling public sign-up.

## 2. Repo structure (target)

```
app/
  api/
    health/route.ts                 GET  /api/health
    site/route.ts                   GET  /api/site            (public aggregate)
    projects/route.ts               GET  /api/projects        POST (admin)
    projects/[id]/route.ts          GET  /api/projects/:id    PUT · DELETE (admin)
    projects/reorder/route.ts       PATCH (admin)
    skills/route.ts                 GET  /api/skills          POST (admin)
    skills/[id]/route.ts            PUT · DELETE (admin)
    profile/route.ts                GET (public, via /api/site) · PATCH (admin)
    settings/route.ts               PATCH (admin)
    contact/route.ts                POST /api/contact         GET (admin inbox)
    contact/[id]/route.ts           PATCH · DELETE (admin)
    auth/session/route.ts           GET  current admin session
    admin/media/route.ts            POST signed upload URL · DELETE file (admin)
    ai/chat/route.ts                POST /api/ai/chat
  admin/ … (existing UI, re-pointed from localStorage to the APIs above)
lib/
  supabase/
    client.ts        browser client (anon key, RLS-bound)
    server.ts        server client (cookies/JWT of the signed-in admin)
    admin.ts         service-role client — SERVER ONLY, never imported by client code
  validation/        zod schemas, one per resource (shared client+server)
  rate-limit.ts      sliding-window limiter (DB-backed, see §6)
  errors.ts          ApiError + the single error-envelope shape (§7 of API.md)
  revalidate.ts      tag/path revalidation helpers (content is cached until edited)
components/ … (unchanged; data now fetched from /api instead of constants/localStorage)
supabase/
  migrations/        0001…0005 (see migrations/README.md)
  seed.sql           today's exact content (WAZOBIA, 20 skills, profile, settings)
docs/
  BACKEND.md  API.md  openapi.yaml
```

## 3. Data model (Postgres)

All tables: `id uuid pk default gen_random_uuid()`, `created_at`, `updated_at` (trigger), unless noted.

| Table | Key columns | Notes |
|---|---|---|
| `profile` (singleton row) | `display_name, alias, headline, description, location, timezone, avatar_url, availability` | Exactly one row (`id = 1` check). Powers hero + about. |
| `professional_titles` | `label, sort_order` | Hero typing roles, max 6 (DB check + API check). |
| `projects` | `slug unique, title, aside, category, tags text[], featured bool, status enum(live,in_progress,completed,archived,coming_soon), description, description2, role, contributions text[], stack text[], live_url, github_url, image_url, image_alt, caption, location, year, sort_order, published bool` | Mirrors `lib/projects.ts` 1:1 — the admin form already collects every field. |
| `skills` | `name, percent int 0–100, category, icon_color, featured bool, sort_order` | Mirrors `lib/skills.ts`; categories are a check constraint matching the 12 site filters. |
| `social_links` | `platform, url, published bool, sort_order` | LinkedIn ships `published=false` → site renders “Coming soon”. |
| `site_settings` (singleton) | `meta_title, meta_description, keywords, theme_color, og_image_url, contact_email` | Admin “Site Metadata” panel writes here; `app/layout.tsx` reads it. |
| `contact_messages` | `name, email, subject enum, message, ip_hash, user_agent, read_at, replied_at` | Written by `POST /api/contact`. **Never** exposed publicly. |
| `rate_limits` | `key, window_start, count` | Sliding-window counters for contact + AI endpoints. |
| `analytics_events` *(phase 3, optional)* | `type, path, referrer, ua_class, created_at` | Cookieless page-view ping; no third-party tracker. |

**Storage buckets:** `project-images` (public read, admin write, image MIME allowlist, 5 MB cap), `media` (avatar/OG, same policy).

## 4. Auth model (admin only)

- **One human**: the owner. Supabase Auth, email+password, **sign-up disabled**, no social login.
- Login page calls Supabase Auth directly; the session JWT rides in cookies via `@supabase/ssr`.
- Every admin API route: `server.ts` client → `auth.getUser()` → check `app_metadata.role === 'admin'` → else `401/403` in the standard envelope. Service-role client is used *after* that check for the actual write.
- RLS mirrors this as defence-in-depth (policies in migration 0004): public `SELECT` only where `published = true`; all writes `auth.uid() = <owner uid>`.
- This replaces the current labelled frontend-only preview; the amber “no real auth” banner comes down when this ships.

## 5. Caching & performance (protects the first-load work already done)

- `GET /api/site`, `/api/projects`, `/api/skills` are **public, CDN-cacheable**: `Cache-Control: public, s-maxage=300, stale-while-revalidate=86400`, plus Next `revalidateTag('content')` fired by every admin write — content is static-fast until the owner edits something.
- Homepage becomes ISR (`export const revalidate = 300`) reading the DB at build/revalidate time — visitors still get static HTML, not a spinner.
- Images only ever served from Storage/CDN URLs stored in `image_url`; uploads are converted to WebP client-side before upload (same discipline as the current assets).

## 6. Abuse controls

| Endpoint class | Limit | Mechanism |
|---|---|---|
| `POST /api/contact` | 5 / IP / 10 min | `rate_limits` table, hashed IP (never stored raw) |
| `POST /api/ai/chat` | 20 / IP / hour | same + 1,000-char message cap |
| Admin writes | Auth only | JWT + RLS + zod validation |
| All POSTs | — | zod schemas shared with the admin UI, honeypot field on contact, payload size caps |

## 7. Email & AI (server-only secrets)

- **Contact delivery**: `POST /api/contact` stores the message *and* (if `RESEND_API_KEY` is set) emails it via Resend. Storage is the source of truth — email is a notification, so a provider outage never loses a message. Until a key exists, the API still stores messages and returns `201` honestly noting email is off.
- **AI chat**: `POST /api/ai/chat` is the seam where the current on-device answers can graduate to a real model (key server-side, knowledge = site content from the DB). The UI doesn't change. Until then the endpoint returns the same knowledge-base answers server-side.

## 8. Environments & secrets

| Variable | Where | Public? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | client+server | yes (RLS-bound) |
| `SUPABASE_SERVICE_ROLE_KEY` | server only | **never** in client bundles |
| `RESEND_API_KEY`, `CONTACT_NOTIFY_TO` | server only | no |
| `AI_API_KEY` (phase 3) | server only | no |
| `NEXT_PUBLIC_SITE_URL` | build | yes |

Local dev: `supabase start` (CLI) or a staging project; migrations are the source of truth — the hosted project currently does not exist and must be created first (owner action, free tier is enough).

## 9. Build order

1. **Phase 1 — read path**: create project, migrations 0001+0004+seed, `/api/site|projects|skills`, homepage reads real data. (Admin still localStorage.)
2. **Phase 2 — write path**: Auth + admin APIs; admin UI re-pointed; localStorage draft retired (one-time import of any saved draft).
3. **Phase 3 — contact + media**: `/api/contact` inbox in admin, signed uploads, optional Resend.
4. **Phase 4 — AI + analytics** (optional): real model behind `/api/ai/chat`, cookieless stats.

Each phase ships independently; the public site never depends on a phase that hasn't landed.
