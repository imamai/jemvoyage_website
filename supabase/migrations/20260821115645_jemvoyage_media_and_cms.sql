-- =============================================================================
-- JEMVOYAGE LTD — 0004 · Media library, CMS, SEO, settings
-- =============================================================================
-- This migration is what makes requirements §34–§49 enforceable: no public-facing
-- image or copy is ever hard-coded in a component. Every visual surface resolves
-- through jemvoyage_media, and every media row is replaceable from the admin CMS
-- with zero code changes and zero redeploys.
-- =============================================================================


-- ---------------------------------------------------------------- media -----
create table if not exists public.jemvoyage_media (
  id             uuid primary key default gen_random_uuid(),
  storage_bucket text        not null default 'jemvoyage-media',
  file_path      text        not null,
  file_name      text        not null,
  title          text,
  alt_text       text,
  caption        text,
  description    text,
  category       text        not null default 'general',
  tags           text[]      not null default '{}',
  width          integer,
  height         integer,
  file_size      bigint,
  mime_type      text,
  focal_x        numeric(4,3) not null default 0.5,   -- art-directed crop centre
  focal_y        numeric(4,3) not null default 0.5,
  blur_data_url  text,                                -- LQIP for next/image
  credit         text,
  source_url     text,
  license        text,
  is_placeholder boolean     not null default false,  -- §48: flagged in admin, invisible to public
  is_active      boolean     not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  uploaded_by    uuid references auth.users(id) on delete set null,
  deleted_at     timestamptz,
  constraint jemvoyage_media_bucket_ck check (storage_bucket like 'jemvoyage-%'),
  constraint jemvoyage_media_category_ck check (category in (
    'general','hero','tours','safaris','destinations','vehicles','fleet','lodging',
    'activities','blog','offers','corporate','team','testimonials','documents','inspections'
  ))
);

create unique index if not exists jemvoyage_media_path_uq   on public.jemvoyage_media (storage_bucket, file_path) where deleted_at is null;
create index if not exists jemvoyage_media_category_idx     on public.jemvoyage_media (category) where deleted_at is null;
create index if not exists jemvoyage_media_placeholder_idx  on public.jemvoyage_media (is_placeholder) where deleted_at is null;
create index if not exists jemvoyage_media_tags_idx         on public.jemvoyage_media using gin (tags);
create index if not exists jemvoyage_media_title_trgm_idx   on public.jemvoyage_media using gin (coalesce(title,'') gin_trgm_ops);
select public.jemvoyage_attach_touch('public.jemvoyage_media');

-- Deferred FK from 0002 (jemvoyage_users predates jemvoyage_media).
alter table public.jemvoyage_users drop constraint if exists jemvoyage_users_avatar_media_fk;
alter table public.jemvoyage_users
  add constraint jemvoyage_users_avatar_media_fk
  foreign key (avatar_media_id) references public.jemvoyage_media(id) on delete set null;

-- §44: when a real image is removed and nothing replaces it, fall back to a
-- category-appropriate placeholder rather than rendering a broken box.
create or replace function public.jemvoyage_resolve_media(p_media_id uuid, p_category text default 'general')
returns public.jemvoyage_media
language sql
stable
set search_path = public
as $$
  select m.* from public.jemvoyage_media m
   where m.id = p_media_id and m.is_active and m.deleted_at is null
  union all
  select m.* from public.jemvoyage_media m
   where m.is_placeholder and m.is_active and m.deleted_at is null
     and m.category = p_category
     and not exists (
       select 1 from public.jemvoyage_media x
        where x.id = p_media_id and x.is_active and x.deleted_at is null
     )
   order by 1
   limit 1;
$$;


-- ------------------------------------------------------------- settings -----
create table if not exists public.jemvoyage_settings (
  key         text primary key,
  value       jsonb       not null default '{}'::jsonb,
  label       text,
  description text,
  group_name  text        not null default 'general',
  is_public   boolean     not null default false,   -- gates anon SELECT
  updated_at  timestamptz not null default now(),
  updated_by  uuid references auth.users(id) on delete set null
);
select public.jemvoyage_attach_touch('public.jemvoyage_settings');


-- ------------------------------------------------------------------ SEO -----
create table if not exists public.jemvoyage_seo_metadata (
  id               uuid primary key default gen_random_uuid(),
  entity_type      text not null,          -- 'tour' | 'destination' | 'page' | 'route'
  entity_id        uuid,
  path             text,                   -- for static routes with no entity row
  seo_title        text,
  meta_description text,
  canonical_url    text,
  og_media_id      uuid references public.jemvoyage_media(id) on delete set null,
  og_title         text,
  og_description   text,
  robots           text not null default 'index,follow',
  schema_type      text,
  schema_json      jsonb,
  keywords         text[] not null default '{}',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  created_by       uuid references auth.users(id) on delete set null,
  updated_by       uuid references auth.users(id) on delete set null
);
create unique index if not exists jemvoyage_seo_entity_uq on public.jemvoyage_seo_metadata (entity_type, entity_id) where entity_id is not null;
create unique index if not exists jemvoyage_seo_path_uq   on public.jemvoyage_seo_metadata (path) where path is not null;
select public.jemvoyage_attach_touch('public.jemvoyage_seo_metadata');


-- ------------------------------------------------------------ CMS pages -----
create table if not exists public.jemvoyage_cms_pages (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  title         text not null,
  subtitle      text,
  body          jsonb not null default '[]'::jsonb,   -- ordered block list
  hero_media_id uuid references public.jemvoyage_media(id) on delete set null,
  status        text not null default 'draft',
  published_at  timestamptz,
  display_order integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  created_by    uuid references auth.users(id) on delete set null,
  updated_by    uuid references auth.users(id) on delete set null,
  deleted_at    timestamptz,
  constraint jemvoyage_cms_pages_status_ck check (status in ('draft','published','archived'))
);
create index if not exists jemvoyage_cms_pages_status_idx on public.jemvoyage_cms_pages (status) where deleted_at is null;
select public.jemvoyage_attach_touch('public.jemvoyage_cms_pages');


-- ----------------------------------------------------------- hero slides -----
-- §39: desktop and mobile art direction are separate media rows, never one
-- desktop image squeezed into a phone viewport.
create table if not exists public.jemvoyage_hero_slides (
  id                  uuid primary key default gen_random_uuid(),
  placement           text not null default 'home',
  eyebrow             text,
  headline            text not null,
  subheadline         text,
  desktop_media_id    uuid references public.jemvoyage_media(id) on delete set null,
  mobile_media_id     uuid references public.jemvoyage_media(id) on delete set null,
  video_url           text,
  overlay_style       text not null default 'gradient-bottom',
  overlay_opacity     numeric(3,2) not null default 0.45,
  cta_label           text,
  cta_url             text,
  secondary_cta_label text,
  secondary_cta_url   text,
  is_active           boolean not null default true,
  display_order       integer not null default 0,
  starts_at           timestamptz,
  ends_at             timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  created_by          uuid references auth.users(id) on delete set null,
  updated_by          uuid references auth.users(id) on delete set null,
  constraint jemvoyage_hero_overlay_ck check (overlay_style in ('none','gradient-bottom','gradient-left','scrim','vignette')),
  constraint jemvoyage_hero_opacity_ck check (overlay_opacity between 0 and 1)
);
create index if not exists jemvoyage_hero_placement_idx on public.jemvoyage_hero_slides (placement, display_order) where is_active;
select public.jemvoyage_attach_touch('public.jemvoyage_hero_slides');


-- ----------------------------------------------------- homepage sections -----
-- §11: all 15 homepage bands are rows here, so ordering, copy, imagery and CTAs
-- are editable without touching the page component.
create table if not exists public.jemvoyage_homepage_sections (
  id            uuid primary key default gen_random_uuid(),
  section_key   text not null unique,
  eyebrow       text,
  heading       text not null,
  subheading    text,
  body          text,
  media_id      uuid references public.jemvoyage_media(id) on delete set null,
  cta_label     text,
  cta_url       text,
  layout        text not null default 'grid',
  item_limit    integer not null default 6,
  is_active     boolean not null default true,
  display_order integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  updated_by    uuid references auth.users(id) on delete set null
);
select public.jemvoyage_attach_touch('public.jemvoyage_homepage_sections');


-- ---------------------------------------------------------------- menus -----
create table if not exists public.jemvoyage_menus (
  id         uuid primary key default gen_random_uuid(),
  key        text not null unique,
  label      text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.jemvoyage_menu_items (
  id            uuid primary key default gen_random_uuid(),
  menu_id       uuid not null references public.jemvoyage_menus(id) on delete cascade,
  parent_id     uuid references public.jemvoyage_menu_items(id) on delete cascade,
  label         text not null,
  url           text not null,
  description   text,
  icon          text,
  is_active     boolean not null default true,
  opens_new_tab boolean not null default false,
  display_order integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists jemvoyage_menu_items_menu_idx on public.jemvoyage_menu_items (menu_id, display_order);
select public.jemvoyage_attach_touch('public.jemvoyage_menus');
select public.jemvoyage_attach_touch('public.jemvoyage_menu_items');


-- ----------------------------------------------------------------- blog -----
create table if not exists public.jemvoyage_blog_categories (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  name          text not null,
  description   text,
  display_order integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table if not exists public.jemvoyage_blog_posts (
  id                uuid primary key default gen_random_uuid(),
  slug              text not null unique,
  title             text not null,
  excerpt           text,
  body              text,
  category_id       uuid references public.jemvoyage_blog_categories(id) on delete set null,
  featured_media_id uuid references public.jemvoyage_media(id) on delete set null,
  social_media_id   uuid references public.jemvoyage_media(id) on delete set null,
  author_id         uuid references public.jemvoyage_users(id) on delete set null,
  reading_minutes   integer,
  status            text not null default 'draft',
  is_featured       boolean not null default false,
  published_at      timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  created_by        uuid references auth.users(id) on delete set null,
  updated_by        uuid references auth.users(id) on delete set null,
  deleted_at        timestamptz,
  constraint jemvoyage_blog_status_ck check (status in ('draft','published','archived'))
);
create index if not exists jemvoyage_blog_pub_idx  on public.jemvoyage_blog_posts (status, published_at desc) where deleted_at is null;
create index if not exists jemvoyage_blog_cat_idx  on public.jemvoyage_blog_posts (category_id) where deleted_at is null;
create index if not exists jemvoyage_blog_trgm_idx on public.jemvoyage_blog_posts using gin (title gin_trgm_ops);
select public.jemvoyage_attach_touch('public.jemvoyage_blog_categories');
select public.jemvoyage_attach_touch('public.jemvoyage_blog_posts');


-- ----------------------------------------------------------------- FAQs -----
create table if not exists public.jemvoyage_faqs (
  id            uuid primary key default gen_random_uuid(),
  question      text not null,
  answer        text not null,
  category      text not null default 'general',
  is_active     boolean not null default true,
  display_order integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  updated_by    uuid references auth.users(id) on delete set null
);
create index if not exists jemvoyage_faqs_cat_idx on public.jemvoyage_faqs (category, display_order) where is_active;
select public.jemvoyage_attach_touch('public.jemvoyage_faqs');


-- --------------------------------------------------------------- offers -----
create table if not exists public.jemvoyage_offers (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  title          text not null,
  summary        text,
  body           text,
  media_id       uuid references public.jemvoyage_media(id) on delete set null,
  discount_type  text,
  discount_value numeric(12,2),
  promo_code     text,
  applies_to     text not null default 'all',
  starts_at      timestamptz,
  ends_at        timestamptz,
  terms          text,
  is_active      boolean not null default true,
  display_order  integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  created_by     uuid references auth.users(id) on delete set null,
  updated_by     uuid references auth.users(id) on delete set null,
  constraint jemvoyage_offers_discount_ck check (discount_type is null or discount_type in ('percent','fixed')),
  constraint jemvoyage_offers_applies_ck  check (applies_to in ('all','tours','safaris','rentals','transfers','corporate'))
);
create unique index if not exists jemvoyage_offers_promo_uq on public.jemvoyage_offers (upper(promo_code)) where promo_code is not null;
select public.jemvoyage_attach_touch('public.jemvoyage_offers');


-- ---------------------------------------------------- newsletter/contact -----
create table if not exists public.jemvoyage_newsletter_subscribers (
  id              uuid primary key default gen_random_uuid(),
  email           citext not null unique,
  full_name       text,
  source          text not null default 'website',
  segments        text[] not null default '{}',
  is_confirmed    boolean not null default false,
  confirmed_at    timestamptz,
  unsubscribed_at timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
select public.jemvoyage_attach_touch('public.jemvoyage_newsletter_subscribers');


-- ------------------------------------------------------------------ RLS -----
alter table public.jemvoyage_media                  enable row level security;
alter table public.jemvoyage_settings               enable row level security;
alter table public.jemvoyage_seo_metadata           enable row level security;
alter table public.jemvoyage_cms_pages              enable row level security;
alter table public.jemvoyage_hero_slides            enable row level security;
alter table public.jemvoyage_homepage_sections      enable row level security;
alter table public.jemvoyage_menus                  enable row level security;
alter table public.jemvoyage_menu_items             enable row level security;
alter table public.jemvoyage_blog_categories        enable row level security;
alter table public.jemvoyage_blog_posts             enable row level security;
alter table public.jemvoyage_faqs                   enable row level security;
alter table public.jemvoyage_offers                 enable row level security;
alter table public.jemvoyage_newsletter_subscribers enable row level security;

-- Media: marketing imagery is world-readable; customer documents and rental
-- inspection photography are NOT, even though they share the table.
create policy jemvoyage_media_public_read on public.jemvoyage_media
  for select to anon, authenticated
  using (is_active and deleted_at is null and category <> 'documents' and category <> 'inspections');
create policy jemvoyage_media_staff_read on public.jemvoyage_media
  for select to authenticated using (public.jemvoyage_has_permission('media.view'));
create policy jemvoyage_media_write on public.jemvoyage_media
  for all to authenticated
  using (public.jemvoyage_has_permission('media.manage'))
  with check (public.jemvoyage_has_permission('media.manage'));

create policy jemvoyage_settings_public_read on public.jemvoyage_settings
  for select to anon, authenticated using (is_public);
create policy jemvoyage_settings_staff_read on public.jemvoyage_settings
  for select to authenticated using (public.jemvoyage_is_staff());
create policy jemvoyage_settings_write on public.jemvoyage_settings
  for all to authenticated
  using (public.jemvoyage_has_permission('settings.manage'))
  with check (public.jemvoyage_has_permission('settings.manage'));

create policy jemvoyage_seo_public_read on public.jemvoyage_seo_metadata
  for select to anon, authenticated using (true);
create policy jemvoyage_seo_write on public.jemvoyage_seo_metadata
  for all to authenticated
  using (public.jemvoyage_has_permission('seo.manage'))
  with check (public.jemvoyage_has_permission('seo.manage'));

create policy jemvoyage_cms_public_read on public.jemvoyage_cms_pages
  for select to anon, authenticated
  using (status = 'published' and deleted_at is null);
create policy jemvoyage_cms_staff_read on public.jemvoyage_cms_pages
  for select to authenticated using (public.jemvoyage_has_permission('cms.view'));
create policy jemvoyage_cms_write on public.jemvoyage_cms_pages
  for all to authenticated
  using (public.jemvoyage_has_permission('cms.manage'))
  with check (public.jemvoyage_has_permission('cms.manage'));

create policy jemvoyage_hero_public_read on public.jemvoyage_hero_slides
  for select to anon, authenticated
  using (is_active
         and (starts_at is null or starts_at <= now())
         and (ends_at   is null or ends_at   >= now()));
create policy jemvoyage_hero_staff_read on public.jemvoyage_hero_slides
  for select to authenticated using (public.jemvoyage_has_permission('cms.view'));
create policy jemvoyage_hero_write on public.jemvoyage_hero_slides
  for all to authenticated
  using (public.jemvoyage_has_permission('cms.manage'))
  with check (public.jemvoyage_has_permission('cms.manage'));

create policy jemvoyage_homepage_public_read on public.jemvoyage_homepage_sections
  for select to anon, authenticated using (is_active);
create policy jemvoyage_homepage_write on public.jemvoyage_homepage_sections
  for all to authenticated
  using (public.jemvoyage_has_permission('cms.manage'))
  with check (public.jemvoyage_has_permission('cms.manage'));

create policy jemvoyage_menus_public_read on public.jemvoyage_menus
  for select to anon, authenticated using (true);
create policy jemvoyage_menus_write on public.jemvoyage_menus
  for all to authenticated
  using (public.jemvoyage_has_permission('cms.manage'))
  with check (public.jemvoyage_has_permission('cms.manage'));

create policy jemvoyage_menu_items_public_read on public.jemvoyage_menu_items
  for select to anon, authenticated using (is_active);
create policy jemvoyage_menu_items_write on public.jemvoyage_menu_items
  for all to authenticated
  using (public.jemvoyage_has_permission('cms.manage'))
  with check (public.jemvoyage_has_permission('cms.manage'));

create policy jemvoyage_blog_cat_public_read on public.jemvoyage_blog_categories
  for select to anon, authenticated using (true);
create policy jemvoyage_blog_cat_write on public.jemvoyage_blog_categories
  for all to authenticated
  using (public.jemvoyage_has_permission('blog.manage'))
  with check (public.jemvoyage_has_permission('blog.manage'));

create policy jemvoyage_blog_public_read on public.jemvoyage_blog_posts
  for select to anon, authenticated
  using (status = 'published' and deleted_at is null and (published_at is null or published_at <= now()));
create policy jemvoyage_blog_staff_read on public.jemvoyage_blog_posts
  for select to authenticated using (public.jemvoyage_has_permission('blog.view'));
create policy jemvoyage_blog_write on public.jemvoyage_blog_posts
  for all to authenticated
  using (public.jemvoyage_has_permission('blog.manage'))
  with check (public.jemvoyage_has_permission('blog.manage'));

create policy jemvoyage_faqs_public_read on public.jemvoyage_faqs
  for select to anon, authenticated using (is_active);
create policy jemvoyage_faqs_write on public.jemvoyage_faqs
  for all to authenticated
  using (public.jemvoyage_has_permission('cms.manage'))
  with check (public.jemvoyage_has_permission('cms.manage'));

create policy jemvoyage_offers_public_read on public.jemvoyage_offers
  for select to anon, authenticated
  using (is_active
         and (starts_at is null or starts_at <= now())
         and (ends_at   is null or ends_at   >= now()));
create policy jemvoyage_offers_staff_read on public.jemvoyage_offers
  for select to authenticated using (public.jemvoyage_has_permission('offers.view'));
create policy jemvoyage_offers_write on public.jemvoyage_offers
  for all to authenticated
  using (public.jemvoyage_has_permission('offers.manage'))
  with check (public.jemvoyage_has_permission('offers.manage'));

-- Anonymous visitors may subscribe, but may never read the subscriber list back.
create policy jemvoyage_newsletter_insert_public on public.jemvoyage_newsletter_subscribers
  for insert to anon, authenticated with check (true);
create policy jemvoyage_newsletter_staff_read on public.jemvoyage_newsletter_subscribers
  for select to authenticated using (public.jemvoyage_has_permission('notifications.view'));
create policy jemvoyage_newsletter_write on public.jemvoyage_newsletter_subscribers
  for all to authenticated
  using (public.jemvoyage_has_permission('notifications.manage'))
  with check (public.jemvoyage_has_permission('notifications.manage'));
