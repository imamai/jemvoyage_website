-- JEMVOYAGE LTD — Catalogue: destinations, attractions, activities, tours, itineraries
-- btree_gist is needed later by the fleet/rental exclusion constraints that make
-- double booking impossible at the database level (§17).
create extension if not exists btree_gist;

-- --------------------------------------------------------- destinations -----
create table if not exists public.jemvoyage_destinations (
  id                 uuid primary key default gen_random_uuid(),
  slug               text not null unique,
  name               text not null,
  region             text,
  country            text not null default 'Kenya',
  summary            text,
  description        text,
  hero_media_id      uuid references public.jemvoyage_media(id) on delete set null,
  thumbnail_media_id uuid references public.jemvoyage_media(id) on delete set null,
  map_media_id       uuid references public.jemvoyage_media(id) on delete set null,
  latitude           numeric(9,6),
  longitude          numeric(9,6),
  best_months        smallint[] not null default '{}',
  travel_time_note   text,
  is_featured        boolean not null default false,
  status             text not null default 'draft',
  display_order      integer not null default 0,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  created_by         uuid references auth.users(id) on delete set null,
  updated_by         uuid references auth.users(id) on delete set null,
  deleted_at         timestamptz,
  constraint jemvoyage_destinations_status_ck check (status in ('draft','published','archived')),
  constraint jemvoyage_destinations_lat_ck check (latitude is null or latitude between -90 and 90),
  constraint jemvoyage_destinations_lng_ck check (longitude is null or longitude between -180 and 180)
);
create index if not exists jemvoyage_destinations_status_idx   on public.jemvoyage_destinations (status, display_order) where deleted_at is null;
create index if not exists jemvoyage_destinations_featured_idx on public.jemvoyage_destinations (is_featured) where deleted_at is null;
create index if not exists jemvoyage_destinations_trgm_idx     on public.jemvoyage_destinations using gin (name gin_trgm_ops);
select public.jemvoyage_attach_touch('public.jemvoyage_destinations');

create table if not exists public.jemvoyage_destination_media (
  destination_id uuid not null references public.jemvoyage_destinations(id) on delete cascade,
  media_id       uuid not null references public.jemvoyage_media(id) on delete cascade,
  display_order  integer not null default 0,
  created_at     timestamptz not null default now(),
  primary key (destination_id, media_id)
);

-- ---------------------------------------------------------- attractions -----
create table if not exists public.jemvoyage_attractions (
  id             uuid primary key default gen_random_uuid(),
  destination_id uuid references public.jemvoyage_destinations(id) on delete set null,
  slug           text not null unique,
  name           text not null,
  summary        text,
  description    text,
  category       text,
  media_id       uuid references public.jemvoyage_media(id) on delete set null,
  latitude       numeric(9,6),
  longitude      numeric(9,6),
  is_active      boolean not null default true,
  display_order  integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  created_by     uuid references auth.users(id) on delete set null,
  updated_by     uuid references auth.users(id) on delete set null,
  deleted_at     timestamptz
);
create index if not exists jemvoyage_attractions_dest_idx on public.jemvoyage_attractions (destination_id) where deleted_at is null;
select public.jemvoyage_attach_touch('public.jemvoyage_attractions');

-- ----------------------------------------------------------- activities -----
create table if not exists public.jemvoyage_activities (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,
  name             text not null,
  summary          text,
  description      text,
  category         text,
  media_id         uuid references public.jemvoyage_media(id) on delete set null,
  duration_minutes integer,
  difficulty       text,
  base_price       numeric(12,2),
  currency         text not null default 'KES',
  is_active        boolean not null default true,
  display_order    integer not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  created_by       uuid references auth.users(id) on delete set null,
  updated_by       uuid references auth.users(id) on delete set null,
  deleted_at       timestamptz,
  constraint jemvoyage_activities_difficulty_ck check (difficulty is null or difficulty in ('easy','moderate','challenging','strenuous'))
);
select public.jemvoyage_attach_touch('public.jemvoyage_activities');

-- ------------------------------------------------------ tour categories -----
create table if not exists public.jemvoyage_tour_categories (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  name          text not null,
  description   text,
  media_id      uuid references public.jemvoyage_media(id) on delete set null,
  is_active     boolean not null default true,
  display_order integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
select public.jemvoyage_attach_touch('public.jemvoyage_tour_categories');

-- ---------------------------------------------------------------- tours -----
create table if not exists public.jemvoyage_tours (
  id                     uuid primary key default gen_random_uuid(),
  slug                   text not null unique,
  title                  text not null,
  subtitle               text,
  category_id            uuid references public.jemvoyage_tour_categories(id) on delete set null,
  primary_destination_id uuid references public.jemvoyage_destinations(id) on delete set null,
  summary                text,
  description            text,
  duration_days          integer not null default 1,
  duration_nights        integer not null default 0,
  price_from             numeric(12,2),
  currency               text not null default 'KES',
  price_basis            text not null default 'per_person',
  min_travellers         integer not null default 1,
  max_travellers         integer,
  accommodation_summary  text,
  transport_summary      text,
  meals_summary          text,
  inclusions             text[] not null default '{}',
  exclusions             text[] not null default '{}',
  difficulty             text,
  best_months            smallint[] not null default '{}',
  primary_media_id       uuid references public.jemvoyage_media(id) on delete set null,
  thumbnail_media_id     uuid references public.jemvoyage_media(id) on delete set null,
  map_media_id           uuid references public.jemvoyage_media(id) on delete set null,
  social_media_id        uuid references public.jemvoyage_media(id) on delete set null,
  video_url              text,
  is_featured            boolean not null default false,
  is_private             boolean not null default false,
  status                 text not null default 'draft',
  published_at           timestamptz,
  display_order          integer not null default 0,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),
  created_by             uuid references auth.users(id) on delete set null,
  updated_by             uuid references auth.users(id) on delete set null,
  deleted_at             timestamptz,
  constraint jemvoyage_tours_status_ck   check (status in ('draft','published','archived')),
  constraint jemvoyage_tours_basis_ck    check (price_basis in ('per_person','per_group','per_vehicle')),
  constraint jemvoyage_tours_duration_ck check (duration_days >= 1 and duration_nights >= 0),
  constraint jemvoyage_tours_pax_ck      check (max_travellers is null or max_travellers >= min_travellers),
  constraint jemvoyage_tours_difficulty_ck check (difficulty is null or difficulty in ('easy','moderate','challenging','strenuous'))
);
create index if not exists jemvoyage_tours_status_idx   on public.jemvoyage_tours (status, display_order) where deleted_at is null;
create index if not exists jemvoyage_tours_category_idx on public.jemvoyage_tours (category_id) where deleted_at is null;
create index if not exists jemvoyage_tours_dest_idx     on public.jemvoyage_tours (primary_destination_id) where deleted_at is null;
create index if not exists jemvoyage_tours_featured_idx on public.jemvoyage_tours (is_featured) where deleted_at is null and status = 'published';
create index if not exists jemvoyage_tours_price_idx    on public.jemvoyage_tours (price_from) where deleted_at is null;
create index if not exists jemvoyage_tours_trgm_idx     on public.jemvoyage_tours using gin (title gin_trgm_ops);
select public.jemvoyage_attach_touch('public.jemvoyage_tours');

create table if not exists public.jemvoyage_tour_media (
  tour_id       uuid not null references public.jemvoyage_tours(id) on delete cascade,
  media_id      uuid not null references public.jemvoyage_media(id) on delete cascade,
  display_order integer not null default 0,
  created_at    timestamptz not null default now(),
  primary key (tour_id, media_id)
);

create table if not exists public.jemvoyage_tour_destinations (
  tour_id        uuid not null references public.jemvoyage_tours(id) on delete cascade,
  destination_id uuid not null references public.jemvoyage_destinations(id) on delete cascade,
  display_order  integer not null default 0,
  primary key (tour_id, destination_id)
);

create table if not exists public.jemvoyage_tour_activities (
  tour_id     uuid not null references public.jemvoyage_tours(id) on delete cascade,
  activity_id uuid not null references public.jemvoyage_activities(id) on delete cascade,
  primary key (tour_id, activity_id)
);

-- ---------------------------------------------------------- itineraries -----
create table if not exists public.jemvoyage_tour_itineraries (
  id                   uuid primary key default gen_random_uuid(),
  tour_id              uuid not null references public.jemvoyage_tours(id) on delete cascade,
  day_number           integer not null,
  title                text not null,
  description          text,
  media_id             uuid references public.jemvoyage_media(id) on delete set null,
  destination_id       uuid references public.jemvoyage_destinations(id) on delete set null,
  overnight_location   text,
  accommodation        text,
  meals                text,
  driving_time_minutes integer,
  distance_km          numeric(8,1),
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  constraint jemvoyage_itinerary_day_ck check (day_number >= 1),
  unique (tour_id, day_number)
);
create index if not exists jemvoyage_itinerary_tour_idx on public.jemvoyage_tour_itineraries (tour_id, day_number);
select public.jemvoyage_attach_touch('public.jemvoyage_tour_itineraries');

-- --------------------------------------------------------- availability -----
create table if not exists public.jemvoyage_tour_availability (
  id             uuid primary key default gen_random_uuid(),
  tour_id        uuid not null references public.jemvoyage_tours(id) on delete cascade,
  start_date     date not null,
  end_date       date not null,
  capacity       integer not null default 0,
  seats_booked   integer not null default 0,
  price_override numeric(12,2),
  currency       text,
  status         text not null default 'open',
  notes          text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint jemvoyage_tour_avail_dates_ck  check (end_date >= start_date),
  constraint jemvoyage_tour_avail_seats_ck  check (seats_booked >= 0 and seats_booked <= capacity),
  constraint jemvoyage_tour_avail_status_ck check (status in ('open','limited','full','closed','cancelled')),
  unique (tour_id, start_date)
);
create index if not exists jemvoyage_tour_avail_idx on public.jemvoyage_tour_availability (tour_id, start_date);
select public.jemvoyage_attach_touch('public.jemvoyage_tour_availability');

-- ------------------------------------------------------------------ RLS -----
alter table public.jemvoyage_destinations       enable row level security;
alter table public.jemvoyage_destination_media  enable row level security;
alter table public.jemvoyage_attractions        enable row level security;
alter table public.jemvoyage_activities         enable row level security;
alter table public.jemvoyage_tour_categories    enable row level security;
alter table public.jemvoyage_tours              enable row level security;
alter table public.jemvoyage_tour_media         enable row level security;
alter table public.jemvoyage_tour_destinations  enable row level security;
alter table public.jemvoyage_tour_activities    enable row level security;
alter table public.jemvoyage_tour_itineraries   enable row level security;
alter table public.jemvoyage_tour_availability  enable row level security;

drop policy if exists jemvoyage_destinations_public_read on public.jemvoyage_destinations;
create policy jemvoyage_destinations_public_read on public.jemvoyage_destinations
  for select to anon, authenticated using (status = 'published' and deleted_at is null);
drop policy if exists jemvoyage_destinations_staff_read on public.jemvoyage_destinations;
create policy jemvoyage_destinations_staff_read on public.jemvoyage_destinations
  for select to authenticated using (public.jemvoyage_has_permission('destinations.view'));
drop policy if exists jemvoyage_destinations_write on public.jemvoyage_destinations;
create policy jemvoyage_destinations_write on public.jemvoyage_destinations
  for all to authenticated
  using (public.jemvoyage_has_permission('destinations.manage'))
  with check (public.jemvoyage_has_permission('destinations.manage'));

drop policy if exists jemvoyage_attractions_public_read on public.jemvoyage_attractions;
create policy jemvoyage_attractions_public_read on public.jemvoyage_attractions
  for select to anon, authenticated using (is_active and deleted_at is null);
drop policy if exists jemvoyage_attractions_write on public.jemvoyage_attractions;
create policy jemvoyage_attractions_write on public.jemvoyage_attractions
  for all to authenticated
  using (public.jemvoyage_has_permission('destinations.manage'))
  with check (public.jemvoyage_has_permission('destinations.manage'));

drop policy if exists jemvoyage_activities_public_read on public.jemvoyage_activities;
create policy jemvoyage_activities_public_read on public.jemvoyage_activities
  for select to anon, authenticated using (is_active and deleted_at is null);
drop policy if exists jemvoyage_activities_write on public.jemvoyage_activities;
create policy jemvoyage_activities_write on public.jemvoyage_activities
  for all to authenticated
  using (public.jemvoyage_has_permission('activities.manage'))
  with check (public.jemvoyage_has_permission('activities.manage'));

drop policy if exists jemvoyage_tour_categories_public_read on public.jemvoyage_tour_categories;
create policy jemvoyage_tour_categories_public_read on public.jemvoyage_tour_categories
  for select to anon, authenticated using (is_active);
drop policy if exists jemvoyage_tour_categories_write on public.jemvoyage_tour_categories;
create policy jemvoyage_tour_categories_write on public.jemvoyage_tour_categories
  for all to authenticated
  using (public.jemvoyage_has_permission('tours.manage'))
  with check (public.jemvoyage_has_permission('tours.manage'));

drop policy if exists jemvoyage_tours_public_read on public.jemvoyage_tours;
create policy jemvoyage_tours_public_read on public.jemvoyage_tours
  for select to anon, authenticated
  using (status = 'published' and deleted_at is null and not is_private);
drop policy if exists jemvoyage_tours_staff_read on public.jemvoyage_tours;
create policy jemvoyage_tours_staff_read on public.jemvoyage_tours
  for select to authenticated using (public.jemvoyage_has_permission('tours.view'));
drop policy if exists jemvoyage_tours_write on public.jemvoyage_tours;
create policy jemvoyage_tours_write on public.jemvoyage_tours
  for all to authenticated
  using (public.jemvoyage_has_permission('tours.manage'))
  with check (public.jemvoyage_has_permission('tours.manage'));

-- Join and child tables inherit their parent's visibility.
drop policy if exists jemvoyage_tour_media_public_read on public.jemvoyage_tour_media;
create policy jemvoyage_tour_media_public_read on public.jemvoyage_tour_media
  for select to anon, authenticated
  using (exists (select 1 from public.jemvoyage_tours t
                  where t.id = tour_id and t.status = 'published' and t.deleted_at is null and not t.is_private));
drop policy if exists jemvoyage_tour_media_write on public.jemvoyage_tour_media;
create policy jemvoyage_tour_media_write on public.jemvoyage_tour_media
  for all to authenticated
  using (public.jemvoyage_has_permission('tours.manage'))
  with check (public.jemvoyage_has_permission('tours.manage'));

drop policy if exists jemvoyage_dest_media_public_read on public.jemvoyage_destination_media;
create policy jemvoyage_dest_media_public_read on public.jemvoyage_destination_media
  for select to anon, authenticated
  using (exists (select 1 from public.jemvoyage_destinations d
                  where d.id = destination_id and d.status = 'published' and d.deleted_at is null));
drop policy if exists jemvoyage_dest_media_write on public.jemvoyage_destination_media;
create policy jemvoyage_dest_media_write on public.jemvoyage_destination_media
  for all to authenticated
  using (public.jemvoyage_has_permission('destinations.manage'))
  with check (public.jemvoyage_has_permission('destinations.manage'));

drop policy if exists jemvoyage_tour_dests_public_read on public.jemvoyage_tour_destinations;
create policy jemvoyage_tour_dests_public_read on public.jemvoyage_tour_destinations
  for select to anon, authenticated
  using (exists (select 1 from public.jemvoyage_tours t
                  where t.id = tour_id and t.status = 'published' and t.deleted_at is null and not t.is_private));
drop policy if exists jemvoyage_tour_dests_write on public.jemvoyage_tour_destinations;
create policy jemvoyage_tour_dests_write on public.jemvoyage_tour_destinations
  for all to authenticated
  using (public.jemvoyage_has_permission('tours.manage'))
  with check (public.jemvoyage_has_permission('tours.manage'));

drop policy if exists jemvoyage_tour_acts_public_read on public.jemvoyage_tour_activities;
create policy jemvoyage_tour_acts_public_read on public.jemvoyage_tour_activities
  for select to anon, authenticated
  using (exists (select 1 from public.jemvoyage_tours t
                  where t.id = tour_id and t.status = 'published' and t.deleted_at is null and not t.is_private));
drop policy if exists jemvoyage_tour_acts_write on public.jemvoyage_tour_activities;
create policy jemvoyage_tour_acts_write on public.jemvoyage_tour_activities
  for all to authenticated
  using (public.jemvoyage_has_permission('tours.manage'))
  with check (public.jemvoyage_has_permission('tours.manage'));

drop policy if exists jemvoyage_itinerary_public_read on public.jemvoyage_tour_itineraries;
create policy jemvoyage_itinerary_public_read on public.jemvoyage_tour_itineraries
  for select to anon, authenticated
  using (exists (select 1 from public.jemvoyage_tours t
                  where t.id = tour_id and t.status = 'published' and t.deleted_at is null and not t.is_private));
drop policy if exists jemvoyage_itinerary_write on public.jemvoyage_tour_itineraries;
create policy jemvoyage_itinerary_write on public.jemvoyage_tour_itineraries
  for all to authenticated
  using (public.jemvoyage_has_permission('tours.manage'))
  with check (public.jemvoyage_has_permission('tours.manage'));

drop policy if exists jemvoyage_tour_avail_public_read on public.jemvoyage_tour_availability;
create policy jemvoyage_tour_avail_public_read on public.jemvoyage_tour_availability
  for select to anon, authenticated
  using (status <> 'cancelled'
         and exists (select 1 from public.jemvoyage_tours t
                      where t.id = tour_id and t.status = 'published' and t.deleted_at is null and not t.is_private));
drop policy if exists jemvoyage_tour_avail_write on public.jemvoyage_tour_availability;
create policy jemvoyage_tour_avail_write on public.jemvoyage_tour_availability
  for all to authenticated
  using (public.jemvoyage_has_permission('tours.manage'))
  with check (public.jemvoyage_has_permission('tours.manage'));;
