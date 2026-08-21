-- JEMVOYAGE LTD — Drivers, guides, suppliers and contracts

create table if not exists public.jemvoyage_drivers (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid references public.jemvoyage_users(id) on delete set null,
  employee_ref        text unique,
  full_name           text not null,
  phone               text not null,
  alt_phone           text,
  email               citext,
  national_id         text,
  photo_media_id      uuid references public.jemvoyage_media(id) on delete set null,
  licence_number      text not null,
  licence_class       text,
  licence_expires_on  date,
  psv_badge_number    text,
  psv_expires_on      date,
  languages           text[] not null default '{}',
  years_experience    integer,
  home_base           text,
  is_available        boolean not null default true,
  status              text not null default 'active',
  rating_average      numeric(3,2),
  rating_count        integer not null default 0,
  notes               text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  created_by          uuid references auth.users(id) on delete set null,
  updated_by          uuid references auth.users(id) on delete set null,
  deleted_at          timestamptz,
  constraint jemvoyage_drivers_status_ck check (status in ('active','on_leave','suspended','inactive')),
  constraint jemvoyage_drivers_rating_ck check (rating_average is null or rating_average between 0 and 5)
);
create index if not exists jemvoyage_drivers_user_idx      on public.jemvoyage_drivers (user_id) where deleted_at is null;
create index if not exists jemvoyage_drivers_available_idx on public.jemvoyage_drivers (is_available, status) where deleted_at is null;
create index if not exists jemvoyage_drivers_licence_idx   on public.jemvoyage_drivers (licence_expires_on) where deleted_at is null;
select public.jemvoyage_attach_touch('public.jemvoyage_drivers');

create table if not exists public.jemvoyage_guides (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid references public.jemvoyage_users(id) on delete set null,
  full_name          text not null,
  phone              text,
  email              citext,
  photo_media_id     uuid references public.jemvoyage_media(id) on delete set null,
  bio                text,
  languages          text[] not null default '{}',
  specialisations    text[] not null default '{}',
  certification      text,
  certification_expires_on date,
  years_experience   integer,
  is_available       boolean not null default true,
  status             text not null default 'active',
  rating_average     numeric(3,2),
  rating_count       integer not null default 0,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  created_by         uuid references auth.users(id) on delete set null,
  updated_by         uuid references auth.users(id) on delete set null,
  deleted_at         timestamptz,
  constraint jemvoyage_guides_status_ck check (status in ('active','on_leave','suspended','inactive')),
  constraint jemvoyage_guides_rating_ck check (rating_average is null or rating_average between 0 and 5)
);
select public.jemvoyage_attach_touch('public.jemvoyage_guides');

-- Driver assignments carry the same overlap guarantee as vehicles: one driver
-- cannot be committed to two jobs at once.
create table if not exists public.jemvoyage_driver_assignments (
  id              uuid primary key default gen_random_uuid(),
  driver_id       uuid not null references public.jemvoyage_drivers(id) on delete cascade,
  vehicle_id      uuid references public.jemvoyage_vehicles(id) on delete set null,
  assignment_type text not null,
  reference_id    uuid,
  period          tstzrange not null,
  pickup_location text,
  dropoff_location text,
  status          text not null default 'assigned',
  instructions    text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  created_by      uuid references auth.users(id) on delete set null,
  constraint jemvoyage_driver_assign_type_ck check (assignment_type in
    ('rental','transfer','safari','tour','shuttle','other')),
  constraint jemvoyage_driver_assign_status_ck check (status in
    ('assigned','accepted','en_route','in_progress','completed','cancelled')),
  constraint jemvoyage_driver_assign_period_ck check (not isempty(period)),
  constraint jemvoyage_driver_no_double_booking
    exclude using gist (driver_id with =, period with &&)
    where (status in ('assigned','accepted','en_route','in_progress'))
);
create index if not exists jemvoyage_driver_assign_driver_idx on public.jemvoyage_driver_assignments (driver_id);
create index if not exists jemvoyage_driver_assign_period_idx on public.jemvoyage_driver_assignments using gist (period);
create index if not exists jemvoyage_driver_assign_ref_idx    on public.jemvoyage_driver_assignments (reference_id);
select public.jemvoyage_attach_touch('public.jemvoyage_driver_assignments');

-- ------------------------------------------------------------ suppliers -----
create table if not exists public.jemvoyage_suppliers (
  id                uuid primary key default gen_random_uuid(),
  slug              text not null unique,
  name              text not null,
  supplier_type     text not null,
  contact_name      text,
  email             citext,
  phone             text,
  website           text,
  address           text,
  city              text,
  country           text not null default 'Kenya',
  destination_id    uuid references public.jemvoyage_destinations(id) on delete set null,
  tax_pin           text,
  payment_terms     text,
  commission_rate   numeric(5,2),
  currency          text not null default 'KES',
  rating            numeric(3,2),
  media_id          uuid references public.jemvoyage_media(id) on delete set null,
  notes             text,
  is_preferred      boolean not null default false,
  is_active         boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  created_by        uuid references auth.users(id) on delete set null,
  updated_by        uuid references auth.users(id) on delete set null,
  deleted_at        timestamptz,
  constraint jemvoyage_suppliers_type_ck check (supplier_type in
    ('hotel','lodge','camp','airline','activity','restaurant','transport','guide','vehicle_partner','other')),
  constraint jemvoyage_suppliers_commission_ck check (commission_rate is null or commission_rate between 0 and 100),
  constraint jemvoyage_suppliers_rating_ck check (rating is null or rating between 0 and 5)
);
create index if not exists jemvoyage_suppliers_type_idx on public.jemvoyage_suppliers (supplier_type) where deleted_at is null;
create index if not exists jemvoyage_suppliers_dest_idx on public.jemvoyage_suppliers (destination_id) where deleted_at is null;
select public.jemvoyage_attach_touch('public.jemvoyage_suppliers');

create table if not exists public.jemvoyage_supplier_rates (
  id             uuid primary key default gen_random_uuid(),
  supplier_id    uuid not null references public.jemvoyage_suppliers(id) on delete cascade,
  name           text not null,
  rate_type      text not null default 'per_person_per_night',
  season         text,
  valid_from     date,
  valid_to       date,
  net_rate       numeric(12,2) not null,
  published_rate numeric(12,2),
  currency       text not null default 'KES',
  occupancy      text,
  meal_plan      text,
  min_nights     integer,
  notes          text,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint jemvoyage_supplier_rates_type_ck check (rate_type in
    ('per_person_per_night','per_room_per_night','per_person','per_group','per_vehicle','per_day','flat')),
  constraint jemvoyage_supplier_rates_dates_ck check (valid_to is null or valid_from is null or valid_to >= valid_from)
);
create index if not exists jemvoyage_supplier_rates_idx on public.jemvoyage_supplier_rates (supplier_id) where is_active;
select public.jemvoyage_attach_touch('public.jemvoyage_supplier_rates');

create table if not exists public.jemvoyage_supplier_contracts (
  id              uuid primary key default gen_random_uuid(),
  supplier_id     uuid not null references public.jemvoyage_suppliers(id) on delete cascade,
  reference       text,
  title           text not null,
  starts_on       date not null,
  ends_on         date,
  commission_rate numeric(5,2),
  payment_terms   text,
  cancellation_terms text,
  document_media_id uuid references public.jemvoyage_media(id) on delete set null,
  status          text not null default 'active',
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  created_by      uuid references auth.users(id) on delete set null,
  constraint jemvoyage_supplier_contracts_status_ck check (status in ('draft','active','expired','terminated')),
  constraint jemvoyage_supplier_contracts_dates_ck check (ends_on is null or ends_on >= starts_on)
);
create index if not exists jemvoyage_supplier_contracts_idx on public.jemvoyage_supplier_contracts (supplier_id, status);
select public.jemvoyage_attach_touch('public.jemvoyage_supplier_contracts');

-- ------------------------------------------------------------------ RLS -----
alter table public.jemvoyage_drivers             enable row level security;
alter table public.jemvoyage_guides              enable row level security;
alter table public.jemvoyage_driver_assignments  enable row level security;
alter table public.jemvoyage_suppliers           enable row level security;
alter table public.jemvoyage_supplier_rates      enable row level security;
alter table public.jemvoyage_supplier_contracts  enable row level security;

-- A driver reads their own profile; dispatch and fleet read all.
create policy jemvoyage_drivers_read on public.jemvoyage_drivers
  for select to authenticated
  using (user_id = auth.uid() or public.jemvoyage_has_permission('drivers.view'));
create policy jemvoyage_drivers_write on public.jemvoyage_drivers
  for all to authenticated
  using (public.jemvoyage_has_permission('drivers.manage'))
  with check (public.jemvoyage_has_permission('drivers.manage'));

create policy jemvoyage_guides_read on public.jemvoyage_guides
  for select to authenticated
  using (user_id = auth.uid() or public.jemvoyage_has_permission('guides.view'));
create policy jemvoyage_guides_write on public.jemvoyage_guides
  for all to authenticated
  using (public.jemvoyage_has_permission('guides.manage'))
  with check (public.jemvoyage_has_permission('guides.manage'));

-- §54: a driver sees ONLY their own assignments.
create policy jemvoyage_driver_assign_own_read on public.jemvoyage_driver_assignments
  for select to authenticated
  using (exists (select 1 from public.jemvoyage_drivers d
                  where d.id = driver_id and d.user_id = auth.uid())
         or public.jemvoyage_has_permission('transfers.view')
         or public.jemvoyage_has_permission('drivers.view'));
-- A driver may progress their own job status, but not reassign it.
create policy jemvoyage_driver_assign_own_update on public.jemvoyage_driver_assignments
  for update to authenticated
  using (exists (select 1 from public.jemvoyage_drivers d
                  where d.id = driver_id and d.user_id = auth.uid()))
  with check (exists (select 1 from public.jemvoyage_drivers d
                  where d.id = driver_id and d.user_id = auth.uid()));
create policy jemvoyage_driver_assign_write on public.jemvoyage_driver_assignments
  for all to authenticated
  using (public.jemvoyage_has_permission('transfers.manage') or public.jemvoyage_has_permission('drivers.manage'))
  with check (public.jemvoyage_has_permission('transfers.manage') or public.jemvoyage_has_permission('drivers.manage'));

-- §54: an external supplier sees only their own record.
create policy jemvoyage_suppliers_read on public.jemvoyage_suppliers
  for select to authenticated
  using (public.jemvoyage_has_permission('suppliers.view'));
create policy jemvoyage_suppliers_write on public.jemvoyage_suppliers
  for all to authenticated
  using (public.jemvoyage_has_permission('suppliers.manage'))
  with check (public.jemvoyage_has_permission('suppliers.manage'));

-- Net rates are commercially sensitive: staff only, never anon, never customers.
create policy jemvoyage_supplier_rates_read on public.jemvoyage_supplier_rates
  for select to authenticated using (public.jemvoyage_has_permission('suppliers.view'));
create policy jemvoyage_supplier_rates_write on public.jemvoyage_supplier_rates
  for all to authenticated
  using (public.jemvoyage_has_permission('suppliers.manage'))
  with check (public.jemvoyage_has_permission('suppliers.manage'));

create policy jemvoyage_supplier_contracts_read on public.jemvoyage_supplier_contracts
  for select to authenticated using (public.jemvoyage_has_permission('suppliers.view'));
create policy jemvoyage_supplier_contracts_write on public.jemvoyage_supplier_contracts
  for all to authenticated
  using (public.jemvoyage_has_permission('suppliers.manage'))
  with check (public.jemvoyage_has_permission('suppliers.manage'));;
