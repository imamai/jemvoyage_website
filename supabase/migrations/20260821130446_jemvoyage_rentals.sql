-- JEMVOYAGE LTD — Rentals: agreements, deposits, extensions, inspections, damage, charges

create table if not exists public.jemvoyage_rentals (
  id                  uuid primary key default gen_random_uuid(),
  reference           text not null unique default public.jemvoyage_next_reference('RN'),
  booking_id          uuid references public.jemvoyage_bookings(id) on delete set null,
  customer_id         uuid not null references public.jemvoyage_customers(id) on delete restrict,
  vehicle_id          uuid not null references public.jemvoyage_vehicles(id) on delete restrict,
  availability_id     uuid references public.jemvoyage_vehicle_availability(id) on delete set null,
  drive_type          text not null default 'self_drive',
  driver_id           uuid references public.jemvoyage_drivers(id) on delete set null,
  pickup_location     text not null,
  dropoff_location    text not null,
  starts_at           timestamptz not null,
  ends_at             timestamptz not null,
  returned_at         timestamptz,
  rate_id             uuid references public.jemvoyage_vehicle_rates(id) on delete set null,
  currency            text not null default 'KES',
  daily_rate          numeric(12,2) not null default 0,
  rental_days         integer not null default 1,
  mileage_allowance_km integer,
  excess_mileage_rate numeric(10,2),
  start_mileage_km    integer,
  end_mileage_km      integer,
  start_fuel_level    text,
  end_fuel_level      text,
  subtotal            numeric(14,2) not null default 0,
  extras_total        numeric(14,2) not null default 0,
  discount_amount     numeric(14,2) not null default 0,
  tax_amount          numeric(14,2) not null default 0,
  total               numeric(14,2) not null default 0,
  amount_paid         numeric(14,2) not null default 0,
  balance_due         numeric(14,2) generated always as (total - amount_paid) stored,
  status              text not null default 'reserved',
  notes               text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  created_by          uuid references auth.users(id) on delete set null,
  updated_by          uuid references auth.users(id) on delete set null,
  deleted_at          timestamptz,
  constraint jemvoyage_rentals_drive_ck  check (drive_type in ('self_drive','chauffeur')),
  constraint jemvoyage_rentals_status_ck check (status in
    ('reserved','confirmed','active','overdue','returned','completed','cancelled')),
  constraint jemvoyage_rentals_dates_ck  check (ends_at > starts_at),
  constraint jemvoyage_rentals_days_ck   check (rental_days >= 1),
  constraint jemvoyage_rentals_mileage_ck check (end_mileage_km is null or start_mileage_km is null
    or end_mileage_km >= start_mileage_km),
  -- A chauffeur-driven rental must name a driver.
  constraint jemvoyage_rentals_chauffeur_ck check (drive_type <> 'chauffeur' or driver_id is not null)
);
create index if not exists jemvoyage_rentals_customer_idx on public.jemvoyage_rentals (customer_id) where deleted_at is null;
create index if not exists jemvoyage_rentals_vehicle_idx  on public.jemvoyage_rentals (vehicle_id) where deleted_at is null;
create index if not exists jemvoyage_rentals_status_idx   on public.jemvoyage_rentals (status, starts_at) where deleted_at is null;
create index if not exists jemvoyage_rentals_dates_idx    on public.jemvoyage_rentals (starts_at, ends_at) where deleted_at is null;
select public.jemvoyage_attach_touch('public.jemvoyage_rentals');

create table if not exists public.jemvoyage_rental_agreements (
  id                uuid primary key default gen_random_uuid(),
  rental_id         uuid not null references public.jemvoyage_rentals(id) on delete cascade,
  agreement_number  text not null unique default public.jemvoyage_next_reference('AG'),
  version           integer not null default 1,
  terms             text,
  snapshot          jsonb,
  document_media_id uuid references public.jemvoyage_media(id) on delete set null,
  signed_by_name    text,
  signed_at         timestamptz,
  signature_ip      inet,
  status            text not null default 'draft',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  created_by        uuid references auth.users(id) on delete set null,
  constraint jemvoyage_rental_agr_status_ck check (status in ('draft','issued','signed','void'))
);
create index if not exists jemvoyage_rental_agr_idx on public.jemvoyage_rental_agreements (rental_id, version desc);
select public.jemvoyage_attach_touch('public.jemvoyage_rental_agreements');

-- §18: the deposit lifecycle is tracked in full, including every deduction.
create table if not exists public.jemvoyage_rental_deposits (
  id                 uuid primary key default gen_random_uuid(),
  rental_id          uuid not null references public.jemvoyage_rentals(id) on delete cascade,
  amount_required    numeric(12,2) not null default 0,
  amount_received    numeric(12,2) not null default 0,
  currency           text not null default 'KES',
  method             text,
  received_at        timestamptz,
  damage_deduction   numeric(12,2) not null default 0,
  fuel_deduction     numeric(12,2) not null default 0,
  late_return_deduction numeric(12,2) not null default 0,
  other_deduction    numeric(12,2) not null default 0,
  other_deduction_note text,
  total_deductions   numeric(12,2) generated always as
    (damage_deduction + fuel_deduction + late_return_deduction + other_deduction) stored,
  refund_amount      numeric(12,2),
  refund_status      text not null default 'held',
  refunded_at        timestamptz,
  refund_reference   text,
  notes              text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  created_by         uuid references auth.users(id) on delete set null,
  updated_by         uuid references auth.users(id) on delete set null,
  constraint jemvoyage_rental_dep_status_ck check (refund_status in
    ('pending','held','partially_refunded','refunded','forfeited')),
  constraint jemvoyage_rental_dep_amounts_ck check (
    amount_required >= 0 and amount_received >= 0
    and damage_deduction >= 0 and fuel_deduction >= 0
    and late_return_deduction >= 0 and other_deduction >= 0),
  unique (rental_id)
);
select public.jemvoyage_attach_touch('public.jemvoyage_rental_deposits');

create table if not exists public.jemvoyage_rental_extensions (
  id                uuid primary key default gen_random_uuid(),
  rental_id         uuid not null references public.jemvoyage_rentals(id) on delete cascade,
  requested_at      timestamptz not null default now(),
  previous_ends_at  timestamptz not null,
  new_ends_at       timestamptz not null,
  additional_days   integer not null,
  daily_rate        numeric(12,2) not null default 0,
  additional_amount numeric(14,2) not null default 0,
  currency          text not null default 'KES',
  status            text not null default 'requested',
  decline_reason    text,
  approved_by       uuid references public.jemvoyage_users(id) on delete set null,
  approved_at       timestamptz,
  paid_at           timestamptz,
  notes             text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  created_by        uuid references auth.users(id) on delete set null,
  constraint jemvoyage_rental_ext_status_ck check (status in
    ('requested','approved','declined','awaiting_payment','confirmed','cancelled')),
  constraint jemvoyage_rental_ext_dates_ck check (new_ends_at > previous_ends_at),
  constraint jemvoyage_rental_ext_days_ck check (additional_days > 0)
);
create index if not exists jemvoyage_rental_ext_idx on public.jemvoyage_rental_extensions (rental_id, requested_at desc);
select public.jemvoyage_attach_touch('public.jemvoyage_rental_extensions');

-- §19: identical structure before and after, so the two can be diffed.
create table if not exists public.jemvoyage_rental_inspections (
  id                 uuid primary key default gen_random_uuid(),
  rental_id          uuid not null references public.jemvoyage_rentals(id) on delete cascade,
  inspection_type    text not null,
  inspected_at       timestamptz not null default now(),
  inspector_id       uuid references public.jemvoyage_users(id) on delete set null,
  mileage_km         integer,
  fuel_level         text,
  tyres_condition    text,
  spare_tyre_present boolean,
  tools_present      boolean,
  jack_present       boolean,
  first_aid_present  boolean,
  triangle_present   boolean,
  exterior_notes     text,
  interior_notes     text,
  existing_damage    text,
  documents_present  boolean,
  customer_signature_name text,
  customer_signed_at timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  created_by         uuid references auth.users(id) on delete set null,
  constraint jemvoyage_rental_insp_type_ck check (inspection_type in ('pre_rental','post_rental')),
  constraint jemvoyage_rental_insp_fuel_ck check (fuel_level is null or fuel_level in
    ('empty','quarter','half','three_quarter','full')),
  unique (rental_id, inspection_type)
);
create index if not exists jemvoyage_rental_insp_idx on public.jemvoyage_rental_inspections (rental_id);
select public.jemvoyage_attach_touch('public.jemvoyage_rental_inspections');

create table if not exists public.jemvoyage_rental_inspection_media (
  inspection_id uuid not null references public.jemvoyage_rental_inspections(id) on delete cascade,
  media_id      uuid not null references public.jemvoyage_media(id) on delete cascade,
  angle         text,
  caption       text,
  display_order integer not null default 0,
  created_at    timestamptz not null default now(),
  primary key (inspection_id, media_id)
);

create table if not exists public.jemvoyage_rental_damage_reports (
  id                 uuid primary key default gen_random_uuid(),
  rental_id          uuid not null references public.jemvoyage_rentals(id) on delete cascade,
  pre_inspection_id  uuid references public.jemvoyage_rental_inspections(id) on delete set null,
  post_inspection_id uuid references public.jemvoyage_rental_inspections(id) on delete set null,
  reported_at        timestamptz not null default now(),
  area               text not null,
  severity           text not null default 'minor',
  description        text not null,
  is_pre_existing    boolean not null default false,
  estimated_cost     numeric(12,2),
  actual_cost        numeric(12,2),
  currency           text not null default 'KES',
  charged_to_customer boolean not null default false,
  insurance_claim_ref text,
  status             text not null default 'open',
  resolution_notes   text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  created_by         uuid references auth.users(id) on delete set null,
  constraint jemvoyage_damage_severity_ck check (severity in ('minor','moderate','major','write_off')),
  constraint jemvoyage_damage_status_ck check (status in ('open','assessed','repaired','claimed','closed','disputed'))
);
create index if not exists jemvoyage_damage_rental_idx on public.jemvoyage_rental_damage_reports (rental_id);
select public.jemvoyage_attach_touch('public.jemvoyage_rental_damage_reports');

create table if not exists public.jemvoyage_rental_damage_media (
  damage_report_id uuid not null references public.jemvoyage_rental_damage_reports(id) on delete cascade,
  media_id         uuid not null references public.jemvoyage_media(id) on delete cascade,
  caption          text,
  display_order    integer not null default 0,
  primary key (damage_report_id, media_id)
);

create table if not exists public.jemvoyage_rental_charges (
  id           uuid primary key default gen_random_uuid(),
  rental_id    uuid not null references public.jemvoyage_rentals(id) on delete cascade,
  charge_type  text not null,
  description  text not null,
  quantity     numeric(10,2) not null default 1,
  unit_amount  numeric(12,2) not null default 0,
  amount       numeric(14,2) generated always as (quantity * unit_amount) stored,
  currency     text not null default 'KES',
  is_taxable   boolean not null default true,
  status       text not null default 'pending',
  charged_at   timestamptz,
  notes        text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  created_by   uuid references auth.users(id) on delete set null,
  constraint jemvoyage_rental_charge_type_ck check (charge_type in
    ('extra_day','excess_mileage','fuel','damage','late_return','cleaning',
     'traffic_fine','delivery','collection','extra_driver','child_seat','gps','insurance','other')),
  constraint jemvoyage_rental_charge_status_ck check (status in ('pending','invoiced','paid','waived','disputed'))
);
create index if not exists jemvoyage_rental_charges_idx on public.jemvoyage_rental_charges (rental_id, status);
select public.jemvoyage_attach_touch('public.jemvoyage_rental_charges');

-- ------------------------------------------------------------------ RLS -----
alter table public.jemvoyage_rentals                  enable row level security;
alter table public.jemvoyage_rental_agreements        enable row level security;
alter table public.jemvoyage_rental_deposits          enable row level security;
alter table public.jemvoyage_rental_extensions        enable row level security;
alter table public.jemvoyage_rental_inspections       enable row level security;
alter table public.jemvoyage_rental_inspection_media  enable row level security;
alter table public.jemvoyage_rental_damage_reports    enable row level security;
alter table public.jemvoyage_rental_damage_media      enable row level security;
alter table public.jemvoyage_rental_charges           enable row level security;

create policy jemvoyage_rentals_read on public.jemvoyage_rentals
  for select to authenticated
  using (public.jemvoyage_has_permission('rentals.view')
         or public.jemvoyage_owns_customer(customer_id)
         or exists (select 1 from public.jemvoyage_drivers d
                     where d.id = driver_id and d.user_id = auth.uid()));
create policy jemvoyage_rentals_write on public.jemvoyage_rentals
  for all to authenticated
  using (public.jemvoyage_has_permission('rentals.manage'))
  with check (public.jemvoyage_has_permission('rentals.manage'));

-- Helper so every child table shares one visibility rule.
create or replace function public.jemvoyage_can_view_rental(p_rental_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select public.jemvoyage_has_permission('rentals.view')
      or exists (select 1 from public.jemvoyage_rentals r
                  where r.id = p_rental_id and public.jemvoyage_owns_customer(r.customer_id));
$$;
revoke all on function public.jemvoyage_can_view_rental(uuid) from public, anon;
grant execute on function public.jemvoyage_can_view_rental(uuid) to authenticated;

create policy jemvoyage_rental_agr_read on public.jemvoyage_rental_agreements
  for select to authenticated using (public.jemvoyage_can_view_rental(rental_id));
create policy jemvoyage_rental_agr_write on public.jemvoyage_rental_agreements
  for all to authenticated
  using (public.jemvoyage_has_permission('rentals.manage'))
  with check (public.jemvoyage_has_permission('rentals.manage'));

create policy jemvoyage_rental_dep_read on public.jemvoyage_rental_deposits
  for select to authenticated using (public.jemvoyage_can_view_rental(rental_id));
create policy jemvoyage_rental_dep_write on public.jemvoyage_rental_deposits
  for all to authenticated
  using (public.jemvoyage_has_permission('rentals.manage') or public.jemvoyage_has_permission('payments.manage'))
  with check (public.jemvoyage_has_permission('rentals.manage') or public.jemvoyage_has_permission('payments.manage'));

-- A customer may request an extension on their own rental; only staff decide it.
create policy jemvoyage_rental_ext_read on public.jemvoyage_rental_extensions
  for select to authenticated using (public.jemvoyage_can_view_rental(rental_id));
create policy jemvoyage_rental_ext_request on public.jemvoyage_rental_extensions
  for insert to authenticated with check (public.jemvoyage_can_view_rental(rental_id));
create policy jemvoyage_rental_ext_write on public.jemvoyage_rental_extensions
  for all to authenticated
  using (public.jemvoyage_has_permission('rentals.manage'))
  with check (public.jemvoyage_has_permission('rentals.manage'));

create policy jemvoyage_rental_insp_read on public.jemvoyage_rental_inspections
  for select to authenticated using (public.jemvoyage_can_view_rental(rental_id));
create policy jemvoyage_rental_insp_write on public.jemvoyage_rental_inspections
  for all to authenticated
  using (public.jemvoyage_has_permission('rentals.manage'))
  with check (public.jemvoyage_has_permission('rentals.manage'));

create policy jemvoyage_rental_insp_media_read on public.jemvoyage_rental_inspection_media
  for select to authenticated
  using (exists (select 1 from public.jemvoyage_rental_inspections i
                  where i.id = inspection_id and public.jemvoyage_can_view_rental(i.rental_id)));
create policy jemvoyage_rental_insp_media_write on public.jemvoyage_rental_inspection_media
  for all to authenticated
  using (public.jemvoyage_has_permission('rentals.manage'))
  with check (public.jemvoyage_has_permission('rentals.manage'));

create policy jemvoyage_damage_read on public.jemvoyage_rental_damage_reports
  for select to authenticated using (public.jemvoyage_can_view_rental(rental_id));
create policy jemvoyage_damage_write on public.jemvoyage_rental_damage_reports
  for all to authenticated
  using (public.jemvoyage_has_permission('rentals.manage'))
  with check (public.jemvoyage_has_permission('rentals.manage'));

create policy jemvoyage_damage_media_read on public.jemvoyage_rental_damage_media
  for select to authenticated
  using (exists (select 1 from public.jemvoyage_rental_damage_reports r
                  where r.id = damage_report_id and public.jemvoyage_can_view_rental(r.rental_id)));
create policy jemvoyage_damage_media_write on public.jemvoyage_rental_damage_media
  for all to authenticated
  using (public.jemvoyage_has_permission('rentals.manage'))
  with check (public.jemvoyage_has_permission('rentals.manage'));

create policy jemvoyage_rental_charges_read on public.jemvoyage_rental_charges
  for select to authenticated using (public.jemvoyage_can_view_rental(rental_id));
create policy jemvoyage_rental_charges_write on public.jemvoyage_rental_charges
  for all to authenticated
  using (public.jemvoyage_has_permission('rentals.manage'))
  with check (public.jemvoyage_has_permission('rentals.manage'));;
