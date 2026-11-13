# OBAFEMIX — API Reference

Base URL: same origin as the site (`/api/…`). Machine-readable version: [`openapi.yaml`](./openapi.yaml).
Architecture rationale: [`BACKEND.md`](./BACKEND.md). **Status: specification — endpoints are not live yet.**

## Conventions (apply to every endpoint)

- **Auth classes**: `public` (anyone) · `admin` (Supabase JWT cookie, owner only).
- **Success shape**: `{ "data": … }` (lists add `"meta": { "count": n }`).
- **Error shape** (single envelope, every endpoint): `{ "error": { "code": "VALIDATION", "message": "Human sentence.", "fields": { "email": "Enter a valid email" } } }`
  Codes: `VALIDATION` 400 · `UNAUTHORIZED` 401 · `FORBIDDEN` 403 · `NOT_FOUND` 404 · `RATE_LIMITED` 429 · `SERVER` 500.
- **Validation**: zod schemas in `lib/validation/` shared by the admin forms and these routes — the UI and API can never drift.
- **IDs**: UUIDs in paths; projects also addressable by `slug` on the public read.
- **Writes revalidate** the public caches (`content` tag) so the static-fast site updates within seconds of an admin save.

---

## 1. System

### `GET /api/health` — public
**Features:** liveness + DB connectivity probe for uptime checks; no data leaked.
Response `200`: `{ "data": { "status": "ok", "db": true, "time": "2026-11-13T…" } }`

---

## 2. Public content (cached, CDN-friendly)

### `GET /api/site` — public
**Features:** one-shot aggregate for the whole page — profile, titles, socials, settings — so the homepage makes **one** request. `Cache-Control: s-maxage=300, stale-while-revalidate=86400`.
Response: `{ "data": { "profile": {…}, "titles": ["Student Developer", …], "socials": […], "settings": {…} } }`

### `GET /api/projects` — public
Query: `?category=Web Apps` · `?featured=true` · `?status=live`
**Features:** only `published=true` rows; ordered by `sort_order`; feeds the reference card grid + filter pills (counts computed client-side from the same payload).
Response: `{ "data": [ Project ], "meta": { "count": 1 } }` — `Project` = every field of the admin form (title, aside, category, tags[], featured, status, description, description2, role, contributions[], stack[], liveUrl, githubUrl, image, imageAlt, caption, location, year).

### `GET /api/projects/:slug` — public
**Features:** single project for future detail pages/sharing; `404` envelope if unknown or unpublished.

### `GET /api/skills` — public
Query: `?category=Frontend`
**Features:** all skills with `percent`, `category`, `featured` (the “Showing 8 of 20” default view = `featured=true` subset); powers the percentage bars and the 13 filter pills.

---

## 3. Contact

### `POST /api/contact` — public
Body: `{ name, email, subject, message, company? }` (`company` = honeypot, must be empty)
**Features:** zod validation identical to the on-page form (name ≥ 2, valid email, message ≥ 10) · **rate limit 5/IP/10 min** (`RATE_LIMITED` 429) · stores to `contact_messages` **always** · optional Resend notification email (server key; response honestly reports `"emailed": false` until configured) · replaces today's `mailto:` flow without changing the UI.
Response `201`: `{ "data": { "id": "…", "emailed": true } }`

### `GET /api/contact` — admin
Query: `?unread=true` · `?page=1`
**Features:** inbox list for a future admin “Messages” panel; newest first; IP stored only as a hash.

### `PATCH /api/contact/:id` — admin
Body: `{ read?: boolean, replied?: boolean }` — **Features:** mark read/replied timestamps; no content editing (messages are evidence, not documents).

### `DELETE /api/contact/:id` — admin
**Features:** hard delete for spam cleanup.

---

## 4. Auth & session

Login/logout themselves are **Supabase Auth** calls from the browser (no custom password code, ever — the current “any password works” preview is deleted in this phase).

### `GET /api/auth/session` — public
**Features:** returns `{ "data": { "authenticated": bool, "email": string|null } }` so the navbar/admin UI can render the right state without exposing keys or user tables.

---

## 5. Admin — Projects (replaces the localStorage manager 1:1)

### `POST /api/projects` — admin
**Features:** creates from the exact Add-Project form; slug auto-derived from title (unique-checked); all dropdown domains enforced (category, role, status enums); URL fields must be `https://`; image may be a Storage URL returned by §7.

### `PUT /api/projects/:id` — admin
**Features:** full update (the form always submits the whole project); `updated_at` bump; public cache revalidated.

### `PATCH /api/projects/reorder` — admin
Body: `{ "order": ["uuid", …] }` — **Features:** drag-order persistence for the grid (future UI; `sort_order` rewritten in one transaction).

### `DELETE /api/projects/:id` — admin
**Features:** deletes the row; its Storage image is removed in the same request (no orphan files).

## 6. Admin — Skills, Profile, Settings, Titles, Socials

### `POST /api/skills` · `PUT /api/skills/:id` · `DELETE /api/skills/:id` — admin
**Features:** `percent` 0–100 int (this is where the percentages become owner-editable), category from the 12-value enum, `featured` drives the 8-of-20 home view, duplicate-name guard.

### `PATCH /api/profile` — admin
**Features:** singleton update — display name, headline, description, location, timezone, availability, avatar (Storage URL). Typing roles are *not* here; see titles.

### `POST /api/titles` · `DELETE /api/titles/:id` — admin
**Features:** hero typing roles; hard cap **6** (mirrors today's admin rule), order via `sort_order`.

### `PATCH /api/settings` — admin
**Features:** meta title/description (with the 160-char counter rule), keywords, theme colour (hex-validated), OG image; layout metadata revalidates.

### `PUT /api/socials/:platform` — admin
**Features:** URL + `published` toggle — this is the switch that turns LinkedIn from “Coming soon” to a real link the day the owner provides it.

## 7. Admin — Media (Supabase Storage)

### `POST /api/admin/media` — admin
Body: `{ filename, contentType, bucket: "project-images" | "media" }`
**Features:** returns a **signed upload URL** (file goes browser → Storage directly, never through our server); MIME allowlist (png/jpg/webp/avif), 5 MB cap advised client-side; response includes the final public URL to store in `image_url`/`avatar_url`.

### `DELETE /api/admin/media?bucket=…&path=…` — admin
**Features:** removes a file (used automatically by project delete; exposed for the future media library).

## 8. AI assistant

### `POST /api/ai/chat` — public
Body: `{ message: string (≤1000 chars), history?: [{from, text}] (≤6) }`
**Features:** rate limit 20/IP/hour · today it returns the same site-knowledge answers server-side; phase 4 swaps the internals for a real model (server-side key, knowledge grounded in `/api/site` content) with **zero UI change** · response `{ "data": { "reply": "…" } }` · never logs message content beyond counts.

## 9. Analytics (phase 4, optional)

### `POST /api/analytics/visit` — public
Body: `{ path, referrer }` — **Features:** cookieless, no third parties, UA reduced to class (`mobile|desktop`); fire-and-forget `204`.

### `GET /api/analytics/summary` — admin
**Features:** 30-day views + top paths for the Overview panel; aggregates only, no per-visitor rows exposed.

---

## Endpoint index (17)

| # | Method & path | Auth | Purpose |
|---|---|---|---|
| 1 | GET `/api/health` | public | liveness/DB probe |
| 2 | GET `/api/site` | public | profile+titles+socials+settings aggregate |
| 3 | GET `/api/projects` | public | published projects (filterable) |
| 4 | GET `/api/projects/:slug` | public | one project |
| 5 | GET `/api/skills` | public | skills + percents (filterable) |
| 6 | POST `/api/contact` | public | store (+optionally email) a message |
| 7 | GET `/api/contact` | admin | message inbox |
| 8 | PATCH `/api/contact/:id` | admin | mark read/replied |
| 9 | DELETE `/api/contact/:id` | admin | delete message |
| 10 | GET `/api/auth/session` | public | auth state for UI |
| 11 | POST `/api/projects` | admin | create project |
| 12 | PUT `/api/projects/:id` | admin | update project |
| 13 | PATCH `/api/projects/reorder` | admin | reorder projects |
| 14 | DELETE `/api/projects/:id` | admin | delete project (+image) |
| 15 | POST/PUT/DELETE `/api/skills(/:id)` | admin | skill CRUD |
| 16 | PATCH `/api/profile` · `/api/settings` · titles/socials | admin | site content writes |
| 17 | POST/DELETE `/api/admin/media` · POST `/api/ai/chat` · analytics | admin/public | uploads, AI, stats |
