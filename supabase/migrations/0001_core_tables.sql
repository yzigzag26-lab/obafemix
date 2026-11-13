-- Applied to Supabase project `obafemix` (hryxsusauoiyzlorpcys) via migration create_obafemix_tables.
-- Full SQL is in the project's migration history; this file is the repo record.
-- Tables: profile(1 row), professional_titles, projects, skills, social_links,
--         site_settings(1 row), contact_messages, rate_limits — all with RLS enabled
--         (no public policies: only the Fastify service, connecting server-side, touches them).
-- Seed (create_obafemix seed migration): profile/settings/titles/socials, WAZOBIA project, 20 skills.
select 'see supabase migration history: create_obafemix_tables + seed_current_site_content' as note;
