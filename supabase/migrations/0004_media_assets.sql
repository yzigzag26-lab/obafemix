-- Repo record of the applied migration "create_media_assets" (2026-11-14).
-- Project images are stored in Postgres and served by GET /api/v1/media/:id,
-- so uploads need only the DATABASE_URL the API already has.
create table if not exists media_assets (
  id uuid primary key default gen_random_uuid(),
  content_type text not null,
  data bytea not null,
  created_at timestamptz not null default now()
);
alter table media_assets enable row level security;
