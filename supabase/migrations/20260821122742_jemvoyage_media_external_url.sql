-- JEMVOYAGE LTD — 0007 · External media source
--
-- Development placeholders live on a licensed external CDN rather than being
-- committed as binaries or uploaded into storage. They are still ordinary
-- jemvoyage_media rows, so §49 holds: components never reference an image URL,
-- they reference a media id. When an administrator uploads the real photograph,
-- storage_bucket + file_path are populated and take precedence; external_url is
-- ignored from then on, and the row stops being a placeholder.

alter table public.jemvoyage_media
  add column if not exists external_url text;

-- file_path is only meaningful for stored objects. Placeholders carry an
-- external_url instead, so relax the NOT NULL and assert one source exists.
alter table public.jemvoyage_media
  alter column file_path drop not null,
  alter column file_name drop not null;

alter table public.jemvoyage_media
  drop constraint if exists jemvoyage_media_source_ck;
alter table public.jemvoyage_media
  add constraint jemvoyage_media_source_ck
  check (file_path is not null or external_url is not null);

comment on column public.jemvoyage_media.external_url is
  'Licensed external image URL, used for development placeholders only. Ignored once file_path is set.';;
