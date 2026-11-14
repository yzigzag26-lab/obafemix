-- Repo record: public Storage bucket for admin-uploaded project images.
-- Applied 2026-11-14 via the Supabase connector. Files are uploaded only
-- by the API (service role); the bucket is public-read so project cards
-- can display images by URL. projects.image_url stores the public URL.
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;
