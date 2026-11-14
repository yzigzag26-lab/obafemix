-- Repo record of the applied migration "add_resume_url_to_settings" (2026-11-14).
-- Hero "Resume" button downloads this PDF; empty = button shows "Coming soon".
alter table site_settings add column if not exists resume_url text not null default '';
