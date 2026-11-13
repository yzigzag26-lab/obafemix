-- Repo record of the applied migration "add_about_bio_to_profile" (2026-11-13).
alter table profile add column if not exists about_bio text;
