# OBAFEMIX Backend — Scope (agreed decisions)

> Date: 2026-11-13 · Status: **scope locked, not yet built**
> Supersedes the stack choices in `BACKEND.md` where they differ (that doc's data model,
> caching and abuse rules still apply). Endpoint detail: `API.md` · Machine spec: `openapi.yaml`.

---

## 1. Decisions made

| Question | Decision | One-line reason |
|---|---|---|
| Frontend framework | **Next.js 16** (existing site, unchanged) | Already built, static-fast, SEO. It becomes a *client* of the API. |
| Backend framework | **Fastify** (Node, TypeScript) — a separate small service in `apps/api` | Fast, first-class schema-driven validation + automatic OpenAPI generation; we control auth/rate-limits/AI in one place instead of scattering logic across route handlers. |
| Database | **Supabase — used as hosted Postgres only** | See §2. Supabase *Auth/Storage* are **not** used; Fastify owns auth, files go to Supabase Storage or local disk later if needed. |
| Documentation | **Swagger UI** at `/docs`, generated from code | Schemas are the source of truth — docs cannot drift from the API (see §5). |
| Admin authentication | **One-time password (OTP) read from `.env`** | Single owner, no user table, no sign-ups. Flow + hardening in §4. |
| Hosting | **Render** (API as a free Web Service `obafemix-api`; site as Static Site if possible, else Web Service `obafemix-web`) — blueprint in `render.yaml` | Free tier spins services down after ~15 min idle, so a **keep-alive ping every 10 minutes** is part of the architecture (§8). |
| Database project | **Supabase project `obafemix`** — created 2026-11-13, ref `hryxsusauoiyzlorpcys`, region `eu-west-1`, Postgres 17, free tier, ACTIVE_HEALTHY | DB host: `db.hryxsusauoiyzlorpcys.supabase.co`. The database password was generated at creation and handed to the owner once — it lives only in password managers / Render env vars, never in this repo. |

## 2. Database choice: Supabase (Postgres) vs MongoDB

| Criterion | Supabase (Postgres) | MongoDB (Atlas) | Winner for OBAFEMIX |
|---|---|---|---|
| Data shape | Content is structured: projects/skills with enums (category, status), `percent` 0–100, sort orders, singleton profile/settings rows | Projects/skills are document-like; singletons and enums need app-level enforcement | **Postgres** — the DB itself rejects bad data (checks/enums/FKs) even if a bug ships |
| Integrity | Foreign keys, unique slugs, transactions (reorder = one atomic update) | Multi-doc transactions exist but are heavier; integrity is your code's job | **Postgres** |
| Cost/effort today | Free tier; project can be created from this workspace; SQL migrations already drafted in `supabase/migrations/` | Atlas free tier also fine, but new account/cluster/network setup from scratch | **Postgres** (less new surface) |
| Query needs | Filters by category/featured, ordering, inbox pagination — trivial SQL | Equally easy in Mongo for these reads | Tie |
| Flexibility risk | Adding a project field = migration (5 minutes, versioned) | Schemaless = fast to change, fast to rot | Postgres discipline wins at this scale |
| Lock-in | Plain Postgres — dump & leave anytime; Fastify talks SQL, not Supabase SDK magic | Mongo export is easy too, but queries are Mongo-flavoured everywhere | **Postgres** |

**Verdict: Supabase Postgres as the database, accessed from Fastify via `pg`/Drizzle with the
connection string in `.env` (`DATABASE_URL`).** We deliberately do **not** use Supabase Auth
(auth is §4) and do not call Supabase from the browser at all — one backend (Fastify), one door.
If the project ever outgrows this, the SQL schema ports to any Postgres host unchanged.

## 3. Scope

### In scope (build in this order)
1. **Fastify service** (`apps/api`): TypeScript, `fastify-type-provider-zod`, pino logging, `@fastify/cors` (site origin only), `@fastify/cookie`, `@fastify/rate-limit`, global error handler emitting the shared envelope.
2. **Database**: migrations for `profile, professional_titles, projects, skills, social_links, site_settings, contact_messages, rate_limits` (schema in `BACKEND.md` §3) + seed of today's live content.
3. **Public read APIs** (§6 of API.md): `GET /api/v1/site`, `/projects`, `/projects/:slug`, `/skills`, `/health` — cached (`s-maxage=300, stale-while-revalidate`) so the static-fast frontend stays fast.
4. **Admin auth** (§4) + **admin write APIs**: projects CRUD/reorder, skills CRUD, profile/settings/titles/socials — exactly the fields the existing admin forms already collect; admin UI re-pointed from `localStorage` to these endpoints.
5. **Contact API**: store message (DB is source of truth), admin inbox (list/mark/delete), optional Resend email notification when a key exists.
6. **Media**: signed upload URLs to Supabase Storage (`project-images`, `media` buckets), delete-on-project-delete.
7. **Swagger UI** at `/docs` + `/docs/json` (OpenAPI) generated from the route schemas; `docs/API.md` regenerated/checked against it.
8. **AI endpoint** `POST /api/v1/ai/chat`: same site-knowledge answers server-side initially; real model later behind the same contract.

### Out of scope (explicitly)
- Public user accounts, comments, likes, newsletter, e-commerce, multi-admin roles/permissions.
- Supabase Auth, social login, password resets (there are no user passwords at all — see §4).
- WebSockets/realtime, background job queues, file editing in admin, analytics beyond the optional cookieless ping (Phase 4 in `BACKEND.md`).
- Any change to the public site's design, copy or routes.

## 4. Authentication — one-time password from `.env`

There is exactly **one admin (the owner)**, so instead of a user system:

```
apps/api/.env            (never committed; .env.example documents the names)
  ADMIN_OTP=<the one-time password>          # read ONLY by Fastify, never sent to the browser
  SESSION_SECRET=<long random string>        # signs the session JWT
  SESSION_TTL_MINUTES=60
  DATABASE_URL=postgres://…                  # Supabase Postgres connection string
  PORT=4000
  SITE_ORIGIN=https://<the deployed site>    # CORS allowlist
```

**Flow**
1. Admin page → `POST /api/v1/auth/verify` `{ password }` (rate-limited: **5 attempts / IP / 15 min**, generic error, no hint which part failed).
2. Fastify compares with `ADMIN_OTP` from `process.env` using `crypto.timingSafeEqual` (no timing leaks).
3. On success it sets an **httpOnly, Secure, SameSite=Lax cookie** containing a short-lived JWT (`SESSION_SECRET`, 60 min) with `{ role: "admin" }`. The browser never sees the OTP again and never holds a readable token.
4. Every admin route runs one `requireAdmin` pre-handler that verifies the cookie JWT. `POST /api/v1/auth/logout` clears the cookie; `GET /api/v1/auth/session` reports state for the UI.

**Honest security notes (read before building)**
- “One-time password in `.env`” here means *the single standing admin password lives only in the server's environment* — it is **not** emailed/SMS'd per login and not stored in the DB or the frontend bundle (we grep the build for it in CI).
- Recommended upgrade that keeps the same UX: store only a **hash** (`ADMIN_OTP_HASH`, argon2/bcrypt) in `.env` so a leaked env file doesn't directly reveal the password; verification is identical. We will implement the hash variant unless told otherwise.
- Rotating the password = change `.env`, restart the API. All existing sessions can be killed instantly by rotating `SESSION_SECRET`.
- This is appropriate for a single-owner portfolio. The day a second admin or public accounts appear, this is replaced by real user auth — that is out of scope above.

## 5. Swagger UI — complete & accurate by construction

- Every Fastify route declares **zod request/response schemas** (the same schemas the admin UI imports). `@fastify/swagger` turns those into OpenAPI 3.1; `@fastify/swagger-ui` serves it at **`/docs`** (interactive “Try it out”), raw spec at `/docs/json`.
- Because docs are *generated from the validation schemas*, an undocumented field or a doc/code mismatch is impossible without a type error — that is what “completely and accurately documented” means here, and it's why the hand-written `docs/openapi.yaml` in this repo is marked draft until the service exists to generate the real one.
- `/docs` is public for read endpoints; admin operations display the cookie-auth requirement (they still can't be *executed* without logging in).

## 6. How the pieces talk

```
Browser ──► Next.js 16 site (static/ISR) ──► GET  /api/v1/site|projects|skills   (public, cached)
Browser ──► Fastify (apps/api)            ──► POST /api/v1/contact               (public, rate-limited)
Admin UI ─► Fastify: POST /auth/verify (OTP from .env) ─► cookie JWT ─► admin CRUD ─► Postgres (Supabase)
Fastify ──► Supabase Postgres via DATABASE_URL (server-side only; DB never exposed to the browser)
Fastify ──► Supabase Storage (signed URLs) · Resend (optional email) · AI provider (phase 4, optional)
```

## 7. Build sequence (each step independently shippable)

1. Scaffold `apps/api` + health + Swagger UI skeleton → 2. Migrations + seed → 3. Public reads (site goes live against them) → 4. OTP auth + admin CRUD (localStorage retired) → 5. Contact inbox + media → 6. AI endpoint graduation.

**Owner actions needed to start:** (a) approve creating the Supabase project `obafemix` (free tier), (b) choose the admin one-time password and where the API will be hosted (same host as the site is easiest for cookies/CORS).

## 8. Hosting on Render + never sleeping (keep-alive every 10 minutes)

Render's free Web Services **spin down after ~15 minutes without inbound traffic** and then
cold-start (~50 s) on the next request — exactly the impatient-visitor problem we removed from
the frontend. So the anti-sleep ping is architecture, not an afterthought:

- **What pings:** `.github/workflows/keep-alive.yml` (GitHub Actions, in this repo) runs on
  `cron: "*/10 * * * *"` — **every 10 minutes** — and `curl`s the API's `GET /api/v1/health`.
  It also pings the site root *if* the site is deployed as a Web Service (`SITE_URL` variable);
  a Render **Static Site does not sleep** and needs no ping.
- **Why 10 and not 14:** a 10-minute interval leaves a **~5-minute safety buffer** before the
  15-minute idle limit. GitHub's scheduled workflows can drift a few minutes under load; at
  14 minutes that drift could cross the limit, at 10 it cannot. (10–14 all work on paper —
  this repo ships 10 for the buffer.)
- **After the first Render deploy**, set two repository variables
  (GitHub → Settings → Secrets and variables → Actions → Variables):
  `API_HEALTH_URL=https://obafemix-api.onrender.com/api/v1/health` and, only if the site is a
  Web Service, `SITE_URL=https://<site>/`. Until then the workflow warns and skips — it never fails the repo.
- **Alternatives/complements:** an external uptime monitor (e.g. UptimeRobot, 5-min checks)
  pointed at the same health URL is a fine second layer; Render's paid plans (from $7/mo per
  service) never sleep at all and make all of this unnecessary — that's the upgrade path if
  cold starts ever matter commercially.
- The blueprint for both services (Frankfurt region, to sit near the `eu-west-1` database,
  `healthCheckPath`, env var list with `sync: false` for secrets) lives in **`render.yaml`** at
  the repo root; env var names are mirrored in `apps/api/.env.example`.
