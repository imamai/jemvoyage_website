-- JEMVOYAGE LTD — Quotations, bookings, travellers, transfers

-- --------------------------------------------------------------- quotes -----
create table if not exists public.jemvoyage_quotes (
  id                 uuid primary key default gen_random_uuid(),
  reference          text not null unique default public.jemvoyage_next_reference('QT'),
  customer_id        uuid references public.jemvoyage_customers(id) on delete set null,
  lead_id            uuid references public.jemvoyage_leads(id) on delete set null,
  title              text not null,
  summary            text,
  service_type       text not null default 'tour',
  tour_id            uuid references public.jemvoyage_tours(id) on delete set null,
  travel_start_date  date,
  travel_end_date    date,
  adults             integer not null default 1,
  children           integer not null default 0,
  currency           text not null default 'KES',
  subtotal           numeric(14,2) not null default 0,
  supplier_cost      numeric(14,2) not null default 0,
  markup_amount      numeric(14,2) not null default 0,
  discount_amount    numeric(14,2) not null default 0,
  tax_amount         numeric(14,2) not null default 0,
  total              numeric(14,2) not null default 0,
  version            integer not null default 1,
  status             text not null default 'draft',
  valid_until        date,
  payment_terms      text,
  cancellation_terms text,
  inclusions         text[] not null default '{}',
  exclusions         text[] not null default '{}',
  internal_notes     text,
  customer_notes     text,
  owner_id           uuid references public.jemvoyage_users(id) on delete set null,
  approved_by        uuid references public.jemvoyage_users(id) on delete set null,
  approved_at        timestamptz,
  sent_at            timestamptz,
  responded_at       timestamptz,
  pdf_media_id       uuid references public.jemvoyage_media(id) on delete set null,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  created_by         uuid references auth.users(id) on delete set null,
  updated_by         uuid references auth.users(id) on delete set null,
  deleted_at         timestamptz,
  constraint jemvoyage_quotes_status_ck check (status in
    ('draft','pending_approval','approved','sent','accepted','rejected','expired','converted','cancelled')),
  constraint jemvoyage_quotes_service_ck check (service_type in
    ('tour','safari','car_hire','chauffeur','transfer','corporate','custom')),
  constraint jemvoyage_quotes_dates_ck check (travel_end_date is null or travel_start_date is null
    or travel_end_date >= travel_start_date),
  constraint jemvoyage_quotes_money_ck check (
    subtotal >= 0 and supplier_cost >= 0 and markup_amount >= 0
    and discount_amount >= 0 and tax_amount >= 0 and total >= 0)
);
create index if not exists jemvoyage_quotes_customer_idx on public.jemvoyage_quotes (customer_id) where deleted_at is null;
create index if not exists jemvoyage_quotes_status_idx   on public.jemvoyage_quotes (status, created_at desc) where deleted_at is null;
create index if not exists jemvoyage_quotes_owner_idx    on public.jemvoyage_quotes (owner_id) where deleted_at is null;
select public.jemvoyage_attach_touch('public.jemvoyage_quotes');

create table if not exists public.jemvoyage_quote_items (
  id              uuid primary key default gen_random_uuid(),
  quote_id        uuid not null references public.jemvoyage_quotes(id) on delete cascade,
  item_type       text not null,
  description     text not null,
  detail          text,
  reference_id    uuid,
  supplier_id     uuid references public.jemvoyage_suppliers(id) on delete set null,
  service_date    date,
  quantity        numeric(10,2) not null default 1,
  unit            text,
  unit_cost       numeric(12,2) not null default 0,
  unit_price      numeric(12,2) not null default 0,
  line_cost       numeric(14,2) generated always as (quantity * unit_cost) stored,
  line_total      numeric(14,2) generated always as (quantity * unit_price) stored,
  is_optional     boolean not null default false,
  display_order   integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint jemvoyage_quote_items_type_ck check (item_type in
    ('tour','accommodation','vehicle','driver','guide','activity','transfer',
     'park_fee','meal','flight','insurance','other')),
  constraint jemvoyage_quote_items_qty_ck check (quantity > 0)
);
create index if not exists jemvoyage_quote_items_idx on public.jemvoyage_quote_items (quote_id, display_order);
select public.jemvoyage_attach_touch('public.jemvoyage_quote_items');

-- Full snapshot of each revision, so a superseded quote can always be produced
-- exactly as the customer saw it (§26).
create table if not exists public.jemvoyage_quote_versions (
  id           uuid primary key default gen_random_uuid(),
  quote_id     uuid not null references public.jemvoyage_quotes(id) on delete cascade,
  version      integer not null,
  snapshot     jsonb not null,
  total        numeric(14,2),
  currency     text,
  change_note  text,
  created_at   timestamptz not null default now(),
  created_by   uuid references auth.users(id) on delete set null,
  unique (quote_id, version)
);
create index if not exists jemvoyage_quote_versions_idx on public.jemvoyage_quote_versions (quote_id, version desc);

-- ------------------------------------------------------------- bookings -----
create table if not exists public.jemvoyage_bookings (
  id                 uuid primary key default gen_random_uuid(),
  reference          text not null unique default public.jemvoyage_next_reference('BK'),
  quote_id           uuid references public.jemvoyage_quotes(id) on delete set null,
  customer_id        uuid not null references public.jemvoyage_customers(id) on delete restrict,
  corporate_account_id uuid,
  travel_agent_id    uuid,
  service_type       text not null default 'tour',
  tour_id            uuid references public.jemvoyage_tours(id) on delete set null,
  availability_id    uuid references public.jemvoyage_tour_availability(id) on delete set null,
  title              text not null,
  start_date         date not null,
  end_date           date not null,
  adults             integer not null default 1,
  children           integer not null default 0,
  currency           text not null default 'KES',
  subtotal           numeric(14,2) not null default 0,
  discount_amount    numeric(14,2) not null default 0,
  tax_amount         numeric(14,2) not null default 0,
  total              numeric(14,2) not null default 0,
  amount_paid        numeric(14,2) not null default 0,
  balance_due        numeric(14,2) generated always as (total - amount_paid) stored,
  supplier_cost      numeric(14,2) not null default 0,
  status             text not null default 'pending',
  payment_status     text not null default 'unpaid',
  lead_guide_id      uuid references public.jemvoyage_guides(id) on delete set null,
  special_requests   text,
  internal_notes     text,
  owner_id           uuid references public.jemvoyage_users(id) on delete set null,
  confirmed_at       timestamptz,
  cancelled_at       timestamptz,
  cancellation_reason text,
  completed_at       timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  created_by         uuid references auth.users(id) on delete set null,
  updated_by         uuid references auth.users(id) on delete set null,
  deleted_at         timestamptz,
  constraint jemvoyage_bookings_status_ck check (status in
    ('pending','confirmed','in_progress','completed','cancelled','no_show')),
  constraint jemvoyage_bookings_payment_ck check (payment_status in
    ('unpaid','deposit_paid','partially_paid','paid','refunded','partially_refunded')),
  constraint jemvoyage_bookings_service_ck check (service_type in
    ('tour','safari','car_hire','chauffeur','transfer','corporate','custom')),
  constraint jemvoyage_bookings_dates_ck check (end_date >= start_date),
  constraint jemvoyage_bookings_money_ck check (total >= 0 and amount_paid >= 0)
);
create index if not exists jemvoyage_bookings_customer_idx on public.jemvoyage_bookings (customer_id) where deleted_at is null;
create index if not exists jemvoyage_bookings_status_idx   on public.jemvoyage_bookings (status, start_date) where deleted_at is null;
create index if not exists jemvoyage_bookings_dates_idx    on public.jemvoyage_bookings (start_date, end_date) where deleted_at is null;
create index if not exists jemvoyage_bookings_payment_idx  on public.jemvoyage_bookings (payment_status) where deleted_at is null;
select public.jemvoyage_attach_touch('public.jemvoyage_bookings');

create table if not exists public.jemvoyage_booking_items (
  id            uuid primary key default gen_random_uuid(),
  booking_id    uuid not null references public.jemvoyage_bookings(id) on delete cascade,
  item_type     text not null,
  description   text not null,
  detail        text,
  reference_id  uuid,
  supplier_id   uuid references public.jemvoyage_suppliers(id) on delete set null,
  vehicle_id    uuid references public.jemvoyage_vehicles(id) on delete set null,
  driver_id     uuid references public.jemvoyage_drivers(id) on delete set null,
  guide_id      uuid references public.jemvoyage_guides(id) on delete set null,
  service_date  date,
  quantity      numeric(10,2) not null default 1,
  unit_cost     numeric(12,2) not null default 0,
  unit_price    numeric(12,2) not null default 0,
  line_total    numeric(14,2) generated always as (quantity * unit_price) stored,
  status        text not null default 'pending',
  confirmation_ref text,
  notes         text,
  display_order integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint jemvoyage_booking_items_type_ck check (item_type in
    ('tour','accommodation','vehicle','driver','guide','activity','transfer',
     'park_fee','meal','flight','insurance','other')),
  constraint jemvoyage_booking_items_status_ck check (status in
    ('pending','requested','confirmed','cancelled'))
);
create index if not exists jemvoyage_booking_items_idx  on public.jemvoyage_booking_items (booking_id, display_order);
create index if not exists jemvoyage_booking_items_veh  on public.jemvoyage_booking_items (vehicle_id);

create table if not exists public.jemvoyage_travellers (
  id                  uuid primary key default gen_random_uuid(),
  booking_id          uuid not null references public.jemvoyage_bookings(id) on delete cascade,
  full_name           text not null,
  traveller_type      text not null default 'adult',
  date_of_birth       date,
  nationality         text,
  passport_number     text,
  passport_expires_on date,
  email               citext,
  phone               text,
  dietary_requirements text,
  medical_notes       text,
  emergency_contact_name  text,
  emergency_contact_phone text,
  is_lead             boolean not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  constraint jemvoyage_travellers_type_ck check (traveller_type in ('adult','child','infant'))
);
create index if not exists jemvoyage_travellers_booking_idx on public.jemvoyage_travellers (booking_id);
select public.jemvoyage_attach_touch('public.jemvoyage_travellers');

-- ------------------------------------------------------------ transfers -----
create table if not exists public.jemvoyage_transfers (
  id               uuid primary key default gen_random_uuid(),
  reference        text not null unique default public.jemvoyage_next_reference('TR'),
  booking_id       uuid references public.jemvoyage_bookings(id) on delete set null,
  customer_id      uuid references public.jemvoyage_customers(id) on delete set null,
  transfer_type    text not null default 'airport_arrival',
  scheduled_at     timestamptz not null,
  pickup_location  text not null,
  dropoff_location text not null,
  airport_code     text,
  flight_number    text,
  flight_scheduled_at timestamptz,
  terminal         text,
  passengers       integer not null default 1,
  luggage_count    integer,
  vehicle_id       uuid references public.jemvoyage_vehicles(id) on delete set null,
  driver_id        uuid references public.jemvoyage_drivers(id) on delete set null,
  meet_and_greet   boolean not null default false,
  name_board_text  text,
  instructions     text,
  price            numeric(12,2),
  currency         text not null default 'KES',
  status           text not null default 'scheduled',
  driver_assigned_at timestamptz,
  en_route_at      timestamptz,
  arrived_at       timestamptz,
  picked_up_at     timestamptz,
  completed_at     timestamptz,
  cancelled_at     timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  created_by       uuid references auth.users(id) on delete set null,
  updated_by       uuid references auth.users(id) on delete set null,
  constraint jemvoyage_transfers_type_ck check (transfer_type in
    ('airport_arrival','airport_departure','intercity','point_to_point','hourly','shuttle')),
  constraint jemvoyage_transfers_status_ck check (status in
    ('scheduled','driver_assigned','en_route','arrived','passenger_picked','completed','cancelled','no_show')),
  constraint jemvoyage_transfers_pax_ck check (passengers > 0)
);
create index if not exists jemvoyage_transfers_sched_idx   on public.jemvoyage_transfers (scheduled_at);
create index if not exists jemvoyage_transfers_status_idx  on public.jemvoyage_transfers (status, scheduled_at);
create index if not exists jemvoyage_transfers_driver_idx  on public.jemvoyage_transfers (driver_id);
create index if not exists jemvoyage_transfers_booking_idx on public.jemvoyage_transfers (booking_id);
select public.jemvoyage_attach_touch('public.jemvoyage_transfers');

-- ------------------------------------------------------------------ RLS -----
alter table public.jemvoyage_quotes         enable row level security;
alter table public.jemvoyage_quote_items    enable row level security;
alter table public.jemvoyage_quote_versions enable row level security;
alter table public.jemvoyage_bookings       enable row level security;
alter table public.jemvoyage_booking_items  enable row level security;
alter table public.jemvoyage_travellers     enable row level security;
alter table public.jemvoyage_transfers      enable row level security;

-- Helper: does the signed-in user own this customer record?
create or replace function public.jemvoyage_owns_customer(p_customer_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.jemvoyage_customers c
                  where c.id = p_customer_id and c.user_id = auth.uid());
$$;
revoke all on function public.jemvoyage_owns_customer(uuid) from public, anon;
grant execute on function public.jemvoyage_owns_customer(uuid) to authenticated;

-- A customer sees a quote only once it has actually been sent to them; drafts
-- and internal pricing stay invisible.
create policy jemvoyage_quotes_read on public.jemvoyage_quotes
  for select to authenticated
  using (public.jemvoyage_has_permission('quotes.view')
         or (public.jemvoyage_owns_customer(customer_id)
             and status in ('sent','accepted','rejected','expired','converted')));
create policy jemvoyage_quotes_write on public.jemvoyage_quotes
  for all to authenticated
  using (public.jemvoyage_has_permission('quotes.manage'))
  with check (public.jemvoyage_has_permission('quotes.manage'));

create policy jemvoyage_quote_items_read on public.jemvoyage_quote_items
  for select to authenticated
  using (exists (select 1 from public.jemvoyage_quotes q
                  where q.id = quote_id
                    and (public.jemvoyage_has_permission('quotes.view')
                         or (public.jemvoyage_owns_customer(q.customer_id)
                             and q.status in ('sent','accepted','rejected','expired','converted')))));
create policy jemvoyage_quote_items_write on public.jemvoyage_quote_items
  for all to authenticated
  using (public.jemvoyage_has_permission('quotes.manage'))
  with check (public.jemvoyage_has_permission('quotes.manage'));

-- Version snapshots contain supplier cost and markup: staff only.
create policy jemvoyage_quote_versions_read on public.jemvoyage_quote_versions
  for select to authenticated using (public.jemvoyage_has_permission('quotes.view'));
create policy jemvoyage_quote_versions_write on public.jemvoyage_quote_versions
  for all to authenticated
  using (public.jemvoyage_has_permission('quotes.manage'))
  with check (public.jemvoyage_has_permission('quotes.manage'));

create policy jemvoyage_bookings_read on public.jemvoyage_bookings
  for select to authenticated
  using (public.jemvoyage_has_permission('bookings.view')
         or public.jemvoyage_owns_customer(customer_id));
create policy jemvoyage_bookings_write on public.jemvoyage_bookings
  for all to authenticated
  using (public.jemvoyage_has_permission('bookings.manage'))
  with check (public.jemvoyage_has_permission('bookings.manage'));

create policy jemvoyage_booking_items_read on public.jemvoyage_booking_items
  for select to authenticated
  using (exists (select 1 from public.jemvoyage_bookings b
                  where b.id = booking_id
                    and (public.jemvoyage_has_permission('bookings.view')
                         or public.jemvoyage_owns_customer(b.customer_id))));
create policy jemvoyage_booking_items_write on public.jemvoyage_booking_items
  for all to authenticated
  using (public.jemvoyage_has_permission('bookings.manage'))
  with check (public.jemvoyage_has_permission('bookings.manage'));

-- Traveller records hold passport and medical data: the booking owner or staff.
create policy jemvoyage_travellers_read on public.jemvoyage_travellers
  for select to authenticated
  using (exists (select 1 from public.jemvoyage_bookings b
                  where b.id = booking_id
                    and (public.jemvoyage_has_permission('bookings.view')
                         or public.jemvoyage_owns_customer(b.customer_id))));
create policy jemvoyage_travellers_owner_write on public.jemvoyage_travellers
  for all to authenticated
  using (exists (select 1 from public.jemvoyage_bookings b
                  where b.id = booking_id
                    and (public.jemvoyage_has_permission('bookings.manage')
                         or public.jemvoyage_owns_customer(b.customer_id))))
  with check (exists (select 1 from public.jemvoyage_bookings b
                  where b.id = booking_id
                    and (public.jemvoyage_has_permission('bookings.manage')
                         or public.jemvoyage_owns_customer(b.customer_id))));

-- §54: an assigned driver sees the transfer they are driving, and nothing else.
create policy jemvoyage_transfers_read on public.jemvoyage_transfers
  for select to authenticated
  using (public.jemvoyage_has_permission('transfers.view')
         or public.jemvoyage_owns_customer(customer_id)
         or exists (select 1 from public.jemvoyage_drivers d
                     where d.id = driver_id and d.user_id = auth.uid()));
create policy jemvoyage_transfers_driver_update on public.jemvoyage_transfers
  for update to authenticated
  using (exists (select 1 from public.jemvoyage_drivers d
                  where d.id = driver_id and d.user_id = auth.uid()))
  with check (exists (select 1 from public.jemvoyage_drivers d
                  where d.id = driver_id and d.user_id = auth.uid()));
create policy jemvoyage_transfers_write on public.jemvoyage_transfers
  for all to authenticated
  using (public.jemvoyage_has_permission('transfers.manage'))
  with check (public.jemvoyage_has_permission('transfers.manage'));;
