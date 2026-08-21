-- JEMVOYAGE LTD — Fleet: vehicles, rates, availability, maintenance, compliance

create table if not exists public.jemvoyage_vehicle_categories (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  name           text not null,
  description    text,
  media_id       uuid references public.jemvoyage_media(id) on delete set null,
  typical_seats  integer,
  is_four_wheel  boolean not null default false,
  is_active      boolean not null default true,
  display_order  integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
select public.jemvoyage_attach_touch('public.jemvoyage_vehicle_categories');

create table if not exists public.jemvoyage_vehicle_features (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  name          text not null,
  icon          text,
  display_order integer not null default 0,
  created_at    timestamptz not null default now()
);

create table if not exists public.jemvoyage_vehicles (
  id                  uuid primary key default gen_random_uuid(),
  slug                text not null unique,
  registration        text not null unique,
  vin                 text unique,
  category_id         uuid references public.jemvoyage_vehicle_categories(id) on delete set null,
  make                text not null,
  model               text not null,
  year                integer,
  colour              text,
  transmission        text not null default 'manual',
  fuel_type           text not null default 'petrol',
  seats               integer not null default 5,
  luggage_capacity    integer,
  is_four_wheel       boolean not null default false,
  has_gps             boolean not null default false,
  current_mileage_km  integer not null default 0,
  purchase_date       date,
  purchase_value      numeric(14,2),
  status              text not null default 'available',
  home_location       text,
  supports_self_drive boolean not null default true,
  supports_chauffeur  boolean not null default true,
  primary_media_id    uuid references public.jemvoyage_media(id) on delete set null,
  description         text,
  rental_terms        text,
  is_published        boolean not null default false,
  display_order       integer not null default 0,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  created_by          uuid references auth.users(id) on delete set null,
  updated_by          uuid references auth.users(id) on delete set null,
  deleted_at          timestamptz,
  constraint jemvoyage_vehicles_status_ck check (status in
    ('available','reserved','rented','on_safari','on_transfer','maintenance','accident','inactive')),
  constraint jemvoyage_vehicles_transmission_ck check (transmission in ('manual','automatic')),
  constraint jemvoyage_vehicles_fuel_ck check (fuel_type in ('petrol','diesel','hybrid','electric')),
  constraint jemvoyage_vehicles_seats_ck check (seats > 0),
  constraint jemvoyage_vehicles_year_ck check (year is null or year between 1950 and 2100)
);
create index if not exists jemvoyage_vehicles_status_idx    on public.jemvoyage_vehicles (status) where deleted_at is null;
create index if not exists jemvoyage_vehicles_category_idx  on public.jemvoyage_vehicles (category_id) where deleted_at is null;
create index if not exists jemvoyage_vehicles_published_idx on public.jemvoyage_vehicles (is_published, display_order) where deleted_at is null;
create index if not exists jemvoyage_vehicles_trgm_idx      on public.jemvoyage_vehicles using gin ((make || ' ' || model) gin_trgm_ops);
select public.jemvoyage_attach_touch('public.jemvoyage_vehicles');

create table if not exists public.jemvoyage_vehicle_images (
  id            uuid primary key default gen_random_uuid(),
  vehicle_id    uuid not null references public.jemvoyage_vehicles(id) on delete cascade,
  media_id      uuid not null references public.jemvoyage_media(id) on delete cascade,
  angle         text,
  display_order integer not null default 0,
  created_at    timestamptz not null default now(),
  constraint jemvoyage_vehicle_images_angle_ck check (angle is null or angle in
    ('front','rear','side','interior','dashboard','boot','other')),
  unique (vehicle_id, media_id)
);
create index if not exists jemvoyage_vehicle_images_idx on public.jemvoyage_vehicle_images (vehicle_id, display_order);

create table if not exists public.jemvoyage_vehicle_feature_map (
  vehicle_id uuid not null references public.jemvoyage_vehicles(id) on delete cascade,
  feature_id uuid not null references public.jemvoyage_vehicle_features(id) on delete cascade,
  primary key (vehicle_id, feature_id)
);

-- ---------------------------------------------------------------- rates -----
create table if not exists public.jemvoyage_vehicle_rates (
  id                    uuid primary key default gen_random_uuid(),
  vehicle_id            uuid references public.jemvoyage_vehicles(id) on delete cascade,
  category_id           uuid references public.jemvoyage_vehicle_categories(id) on delete cascade,
  drive_type            text not null default 'self_drive',
  currency              text not null default 'KES',
  daily_rate            numeric(12,2),
  weekly_rate           numeric(12,2),
  monthly_rate          numeric(12,2),
  daily_mileage_km      integer,
  excess_mileage_rate   numeric(10,2),
  security_deposit      numeric(12,2),
  driver_daily_fee      numeric(12,2),
  valid_from            date,
  valid_to              date,
  is_active             boolean not null default true,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  created_by            uuid references auth.users(id) on delete set null,
  updated_by            uuid references auth.users(id) on delete set null,
  constraint jemvoyage_vehicle_rates_drive_ck check (drive_type in ('self_drive','chauffeur')),
  constraint jemvoyage_vehicle_rates_dates_ck check (valid_to is null or valid_from is null or valid_to >= valid_from),
  -- A rate card attaches to either one vehicle or a whole category, never both
  -- and never neither.
  constraint jemvoyage_vehicle_rates_target_ck check (
    (vehicle_id is not null and category_id is null) or
    (vehicle_id is null and category_id is not null))
);
create index if not exists jemvoyage_vehicle_rates_vehicle_idx  on public.jemvoyage_vehicle_rates (vehicle_id) where is_active;
create index if not exists jemvoyage_vehicle_rates_category_idx on public.jemvoyage_vehicle_rates (category_id) where is_active;
select public.jemvoyage_attach_touch('public.jemvoyage_vehicle_rates');

-- --------------------------------------------------------- availability -----
-- §17: double booking is prevented by the DATABASE, not by application checks.
-- Any two blocking holds on the same vehicle whose periods overlap are rejected
-- by the exclusion constraint, whatever wrote them and however concurrent.
create table if not exists public.jemvoyage_vehicle_availability (
  id           uuid primary key default gen_random_uuid(),
  vehicle_id   uuid not null references public.jemvoyage_vehicles(id) on delete cascade,
  period       tstzrange not null,
  hold_type    text not null,
  status       text not null default 'active',
  reference_id uuid,
  notes        text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  created_by   uuid references auth.users(id) on delete set null,
  constraint jemvoyage_vehicle_avail_type_ck check (hold_type in
    ('reservation','rental','safari','transfer','maintenance','accident','blocked')),
  constraint jemvoyage_vehicle_avail_status_ck check (status in ('active','released','cancelled')),
  constraint jemvoyage_vehicle_avail_period_ck check (not isempty(period)),
  constraint jemvoyage_vehicle_no_double_booking
    exclude using gist (vehicle_id with =, period with &&) where (status = 'active')
);
create index if not exists jemvoyage_vehicle_avail_vehicle_idx on public.jemvoyage_vehicle_availability (vehicle_id) where status = 'active';
create index if not exists jemvoyage_vehicle_avail_period_idx  on public.jemvoyage_vehicle_availability using gist (period);
create index if not exists jemvoyage_vehicle_avail_ref_idx     on public.jemvoyage_vehicle_availability (reference_id);
select public.jemvoyage_attach_touch('public.jemvoyage_vehicle_availability');

create or replace function public.jemvoyage_vehicle_is_available(
  p_vehicle_id uuid, p_from timestamptz, p_to timestamptz
) returns boolean
language sql stable security definer set search_path = public as $$
  select not exists (
    select 1 from public.jemvoyage_vehicle_availability a
     where a.vehicle_id = p_vehicle_id
       and a.status = 'active'
       and a.period && tstzrange(p_from, p_to, '[)')
  );
$$;
revoke all on function public.jemvoyage_vehicle_is_available(uuid, timestamptz, timestamptz) from public, anon;
grant execute on function public.jemvoyage_vehicle_is_available(uuid, timestamptz, timestamptz) to authenticated;

-- ------------------------------------------------ maintenance & running -----
create table if not exists public.jemvoyage_maintenance (
  id              uuid primary key default gen_random_uuid(),
  vehicle_id      uuid not null references public.jemvoyage_vehicles(id) on delete cascade,
  maintenance_type text not null default 'service',
  title           text not null,
  description     text,
  scheduled_date  date,
  completed_date  date,
  mileage_km      integer,
  cost            numeric(12,2),
  currency        text not null default 'KES',
  provider        text,
  invoice_ref     text,
  next_due_date   date,
  next_due_km     integer,
  status          text not null default 'scheduled',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  created_by      uuid references auth.users(id) on delete set null,
  updated_by      uuid references auth.users(id) on delete set null,
  constraint jemvoyage_maintenance_type_ck check (maintenance_type in
    ('service','repair','tyres','bodywork','inspection','other')),
  constraint jemvoyage_maintenance_status_ck check (status in
    ('scheduled','in_progress','completed','cancelled'))
);
create index if not exists jemvoyage_maintenance_vehicle_idx on public.jemvoyage_maintenance (vehicle_id, scheduled_date desc);
create index if not exists jemvoyage_maintenance_due_idx     on public.jemvoyage_maintenance (next_due_date) where status = 'completed';
select public.jemvoyage_attach_touch('public.jemvoyage_maintenance');

create table if not exists public.jemvoyage_fuel_records (
  id          uuid primary key default gen_random_uuid(),
  vehicle_id  uuid not null references public.jemvoyage_vehicles(id) on delete cascade,
  driver_id   uuid,
  filled_at   timestamptz not null default now(),
  litres      numeric(10,2) not null,
  cost        numeric(12,2) not null,
  currency    text not null default 'KES',
  mileage_km  integer,
  station     text,
  receipt_ref text,
  created_at  timestamptz not null default now(),
  created_by  uuid references auth.users(id) on delete set null,
  constraint jemvoyage_fuel_litres_ck check (litres > 0)
);
create index if not exists jemvoyage_fuel_vehicle_idx on public.jemvoyage_fuel_records (vehicle_id, filled_at desc);

create table if not exists public.jemvoyage_insurance (
  id             uuid primary key default gen_random_uuid(),
  vehicle_id     uuid not null references public.jemvoyage_vehicles(id) on delete cascade,
  provider       text not null,
  policy_number  text not null,
  cover_type     text,
  starts_on      date not null,
  expires_on     date not null,
  premium        numeric(12,2),
  currency       text not null default 'KES',
  excess_amount  numeric(12,2),
  document_media_id uuid references public.jemvoyage_media(id) on delete set null,
  notes          text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint jemvoyage_insurance_dates_ck check (expires_on >= starts_on)
);
create index if not exists jemvoyage_insurance_expiry_idx on public.jemvoyage_insurance (expires_on);
select public.jemvoyage_attach_touch('public.jemvoyage_insurance');

create table if not exists public.jemvoyage_vehicle_documents (
  id            uuid primary key default gen_random_uuid(),
  vehicle_id    uuid not null references public.jemvoyage_vehicles(id) on delete cascade,
  document_type text not null,
  reference     text,
  issued_on     date,
  expires_on    date,
  media_id      uuid references public.jemvoyage_media(id) on delete set null,
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint jemvoyage_vehicle_docs_type_ck check (document_type in
    ('logbook','inspection','licence','permit','insurance','other'))
);
create index if not exists jemvoyage_vehicle_docs_expiry_idx on public.jemvoyage_vehicle_documents (expires_on);
select public.jemvoyage_attach_touch('public.jemvoyage_vehicle_documents');

-- ------------------------------------------------------------------ RLS -----
alter table public.jemvoyage_vehicle_categories   enable row level security;
alter table public.jemvoyage_vehicle_features     enable row level security;
alter table public.jemvoyage_vehicles             enable row level security;
alter table public.jemvoyage_vehicle_images       enable row level security;
alter table public.jemvoyage_vehicle_feature_map  enable row level security;
alter table public.jemvoyage_vehicle_rates        enable row level security;
alter table public.jemvoyage_vehicle_availability enable row level security;
alter table public.jemvoyage_maintenance          enable row level security;
alter table public.jemvoyage_fuel_records         enable row level security;
alter table public.jemvoyage_insurance            enable row level security;
alter table public.jemvoyage_vehicle_documents    enable row level security;

create policy jemvoyage_veh_cat_public_read on public.jemvoyage_vehicle_categories
  for select to anon, authenticated using (is_active);
create policy jemvoyage_veh_cat_write on public.jemvoyage_vehicle_categories
  for all to authenticated
  using (public.jemvoyage_has_permission('vehicles.manage'))
  with check (public.jemvoyage_has_permission('vehicles.manage'));

create policy jemvoyage_veh_feat_public_read on public.jemvoyage_vehicle_features
  for select to anon, authenticated using (true);
create policy jemvoyage_veh_feat_write on public.jemvoyage_vehicle_features
  for all to authenticated
  using (public.jemvoyage_has_permission('vehicles.manage'))
  with check (public.jemvoyage_has_permission('vehicles.manage'));

-- Only published vehicles are public, and only the marketing view of them.
create policy jemvoyage_vehicles_public_read on public.jemvoyage_vehicles
  for select to anon, authenticated using (is_published and deleted_at is null);
create policy jemvoyage_vehicles_staff_read on public.jemvoyage_vehicles
  for select to authenticated using (public.jemvoyage_has_permission('vehicles.view'));
create policy jemvoyage_vehicles_write on public.jemvoyage_vehicles
  for all to authenticated
  using (public.jemvoyage_has_permission('vehicles.manage'))
  with check (public.jemvoyage_has_permission('vehicles.manage'));

create policy jemvoyage_veh_img_public_read on public.jemvoyage_vehicle_images
  for select to anon, authenticated
  using (exists (select 1 from public.jemvoyage_vehicles v
                  where v.id = vehicle_id and v.is_published and v.deleted_at is null));
create policy jemvoyage_veh_img_write on public.jemvoyage_vehicle_images
  for all to authenticated
  using (public.jemvoyage_has_permission('vehicles.manage'))
  with check (public.jemvoyage_has_permission('vehicles.manage'));

create policy jemvoyage_veh_featmap_public_read on public.jemvoyage_vehicle_feature_map
  for select to anon, authenticated
  using (exists (select 1 from public.jemvoyage_vehicles v
                  where v.id = vehicle_id and v.is_published and v.deleted_at is null));
create policy jemvoyage_veh_featmap_write on public.jemvoyage_vehicle_feature_map
  for all to authenticated
  using (public.jemvoyage_has_permission('vehicles.manage'))
  with check (public.jemvoyage_has_permission('vehicles.manage'));

create policy jemvoyage_veh_rates_public_read on public.jemvoyage_vehicle_rates
  for select to anon, authenticated
  using (is_active and (
    vehicle_id is null or exists (select 1 from public.jemvoyage_vehicles v
      where v.id = vehicle_id and v.is_published and v.deleted_at is null)));
create policy jemvoyage_veh_rates_write on public.jemvoyage_vehicle_rates
  for all to authenticated
  using (public.jemvoyage_has_permission('pricing.manage') or public.jemvoyage_has_permission('vehicles.manage'))
  with check (public.jemvoyage_has_permission('pricing.manage') or public.jemvoyage_has_permission('vehicles.manage'));

-- Availability is readable by anon so the public booking form can show a
-- calendar, but it exposes only vehicle, period and hold type -- never who
-- booked it or which customer a hold belongs to.
create policy jemvoyage_veh_avail_public_read on public.jemvoyage_vehicle_availability
  for select to anon, authenticated
  using (status = 'active' and exists (select 1 from public.jemvoyage_vehicles v
          where v.id = vehicle_id and v.is_published and v.deleted_at is null));
create policy jemvoyage_veh_avail_staff_read on public.jemvoyage_vehicle_availability
  for select to authenticated using (public.jemvoyage_has_permission('fleet.view'));
create policy jemvoyage_veh_avail_write on public.jemvoyage_vehicle_availability
  for all to authenticated
  using (public.jemvoyage_has_permission('fleet.manage') or public.jemvoyage_has_permission('rentals.manage'))
  with check (public.jemvoyage_has_permission('fleet.manage') or public.jemvoyage_has_permission('rentals.manage'));

-- Operational and cost records: never public.
create policy jemvoyage_maintenance_read on public.jemvoyage_maintenance
  for select to authenticated using (public.jemvoyage_has_permission('maintenance.view'));
create policy jemvoyage_maintenance_write on public.jemvoyage_maintenance
  for all to authenticated
  using (public.jemvoyage_has_permission('maintenance.manage'))
  with check (public.jemvoyage_has_permission('maintenance.manage'));

create policy jemvoyage_fuel_read on public.jemvoyage_fuel_records
  for select to authenticated using (public.jemvoyage_has_permission('fleet.view'));
create policy jemvoyage_fuel_write on public.jemvoyage_fuel_records
  for all to authenticated
  using (public.jemvoyage_has_permission('fleet.manage'))
  with check (public.jemvoyage_has_permission('fleet.manage'));

create policy jemvoyage_insurance_read on public.jemvoyage_insurance
  for select to authenticated using (public.jemvoyage_has_permission('fleet.view'));
create policy jemvoyage_insurance_write on public.jemvoyage_insurance
  for all to authenticated
  using (public.jemvoyage_has_permission('fleet.manage'))
  with check (public.jemvoyage_has_permission('fleet.manage'));

create policy jemvoyage_veh_docs_read on public.jemvoyage_vehicle_documents
  for select to authenticated using (public.jemvoyage_has_permission('fleet.view'));
create policy jemvoyage_veh_docs_write on public.jemvoyage_vehicle_documents
  for all to authenticated
  using (public.jemvoyage_has_permission('fleet.manage'))
  with check (public.jemvoyage_has_permission('fleet.manage'));;
