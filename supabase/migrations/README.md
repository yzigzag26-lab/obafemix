# Migrations live here (created in the build phase, in this order)
1. `0001_core_tables.sql` — profile, site_settings, projects, skills, social_links, professional_titles
2. `0002_contact_messages.sql` — contact_messages + rate_limits
3. `0003_storage_buckets.sql` — `media` (public) + `project-images` (public read, admin write)
4. `0004_rls_policies.sql` — public SELECT on published content; admin-only writes (single admin uid)
5. `0005_seed.sql` — also mirrored in `supabase/seed.sql` (current site content)
See `docs/BACKEND.md` for the schema and `docs/API.md` for endpoints.
