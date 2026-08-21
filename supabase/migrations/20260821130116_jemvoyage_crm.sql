-- JEMVOYAGE LTD — CRM: customers, preferences, leads, pipeline, communications

create table if not exists public.jemvoyage_customers (
  id               uuid primary key default gen_random_uuid(),
  reference        text not null unique default public.jemvoyage_next_reference('CU'),
  user_id          uuid references public.jemvoyage_users(id) on delete set null,
  customer_type    text not null default 'individual',
  full_name        text not null,
  email            citext,
  phone            text,
  alt_phone        text,
  nationality      text,
  country          text,
  city             text,
  address          text,
  date_of_birth    date,
  id_number        text,
  passport_number  text,
  company_name     text,
  tax_pin          text,
  segment          text,
  lifetime_value   numeric(14,2) not null default 0,
  total_bookings   integer not null default 0,
  last_booking_at  timestamptz,
  marketing_opt_in boolean not null default false,
  notes            text,
  owner_id         uuid references public.jemvoyage_users(id) on delete set null,
  is_active        boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  created_by       uuid references auth.users(id) on delete set null,
  updated_by       uuid references auth.users(id) on delete set null,
  deleted_at       timestamptz,
  constraint jemvoyage_customers_type_ck check (customer_type in ('individual','corporate','agent')),
  constraint jemvoyage_customers_segment_ck check (segment is null or segment in
    ('first_time','repeat','luxury','family','corporate','car_rental','safari','international','domestic'))
);
create index if not exists jemvoyage_customers_user_idx    on public.jemvoyage_customers (user_id) where deleted_at is null;
create index if not exists jemvoyage_customers_email_idx   on public.jemvoyage_customers (email) where deleted_at is null;
create index if not exists jemvoyage_customers_phone_idx   on public.jemvoyage_customers (phone) where deleted_at is null;
create index if not exists jemvoyage_customers_owner_idx   on public.jemvoyage_customers (owner_id) where deleted_at is null;
create index if not exists jemvoyage_customers_trgm_idx    on public.jemvoyage_customers using gin (full_name gin_trgm_ops);
select public.jemvoyage_attach_touch('public.jemvoyage_customers');

create table if not exists public.jemvoyage_customer_preferences (
  customer_id          uuid primary key references public.jemvoyage_customers(id) on delete cascade,
  preferred_currency   text not null default 'KES',
  preferred_language   text not null default 'en',
  travel_styles        text[] not null default '{}',
  interests            text[] not null default '{}',
  accommodation_level  text,
  dietary_requirements text,
  accessibility_needs  text,
  seat_preference      text,
  preferred_vehicle_category_id uuid references public.jemvoyage_vehicle_categories(id) on delete set null,
  typical_group_size   integer,
  budget_band          text,
  notes                text,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  constraint jemvoyage_cust_pref_level_ck check (accommodation_level is null or accommodation_level in
    ('budget','mid_range','premium','luxury','ultra_luxury'))
);
select public.jemvoyage_attach_touch('public.jemvoyage_customer_preferences');

create table if not exists public.jemvoyage_lead_sources (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  name          text not null,
  is_active     boolean not null default true,
  display_order integer not null default 0,
  created_at    timestamptz not null default now()
);

create table if not exists public.jemvoyage_leads (
  id                uuid primary key default gen_random_uuid(),
  reference         text not null unique default public.jemvoyage_next_reference('LD'),
  customer_id       uuid references public.jemvoyage_customers(id) on delete set null,
  source_id         uuid references public.jemvoyage_lead_sources(id) on delete set null,
  full_name         text not null,
  email             citext,
  phone             text,
  country           text,
  service_interest  text,
  tour_id           uuid references public.jemvoyage_tours(id) on delete set null,
  destination_id    uuid references public.jemvoyage_destinations(id) on delete set null,
  vehicle_id        uuid references public.jemvoyage_vehicles(id) on delete set null,
  travel_start_date date,
  travel_end_date   date,
  adults            integer not null default 1,
  children          integer not null default 0,
  budget_min        numeric(12,2),
  budget_max        numeric(12,2),
  currency          text not null default 'KES',
  message           text,
  stage             text not null default 'new',
  priority          text not null default 'normal',
  owner_id          uuid references public.jemvoyage_users(id) on delete set null,
  lost_reason       text,
  next_action_at    timestamptz,
  converted_at      timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  created_by        uuid references auth.users(id) on delete set null,
  updated_by        uuid references auth.users(id) on delete set null,
  deleted_at        timestamptz,
  constraint jemvoyage_leads_stage_ck check (stage in
    ('new','contacted','qualified','planning','quote_sent','negotiation',
     'deposit_requested','confirmed','travelling','completed','repeat','lost')),
  constraint jemvoyage_leads_priority_ck check (priority in ('low','normal','high','urgent')),
  constraint jemvoyage_leads_service_ck check (service_interest is null or service_interest in
    ('tour','safari','car_hire','chauffeur','transfer','corporate','custom')),
  constraint jemvoyage_leads_dates_ck check (travel_end_date is null or travel_start_date is null
    or travel_end_date >= travel_start_date),
  constraint jemvoyage_leads_pax_ck check (adults >= 0 and children >= 0)
);
create index if not exists jemvoyage_leads_stage_idx  on public.jemvoyage_leads (stage, created_at desc) where deleted_at is null;
create index if not exists jemvoyage_leads_owner_idx  on public.jemvoyage_leads (owner_id) where deleted_at is null;
create index if not exists jemvoyage_leads_cust_idx   on public.jemvoyage_leads (customer_id) where deleted_at is null;
create index if not exists jemvoyage_leads_next_idx   on public.jemvoyage_leads (next_action_at) where deleted_at is null;
select public.jemvoyage_attach_touch('public.jemvoyage_leads');

create table if not exists public.jemvoyage_sales_activities (
  id            uuid primary key default gen_random_uuid(),
  lead_id       uuid references public.jemvoyage_leads(id) on delete cascade,
  customer_id   uuid references public.jemvoyage_customers(id) on delete cascade,
  activity_type text not null,
  subject       text not null,
  notes         text,
  outcome       text,
  due_at        timestamptz,
  completed_at  timestamptz,
  owner_id      uuid references public.jemvoyage_users(id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  created_by    uuid references auth.users(id) on delete set null,
  constraint jemvoyage_sales_act_type_ck check (activity_type in
    ('call','email','whatsapp','sms','meeting','site_visit','note','task','follow_up')),
  constraint jemvoyage_sales_act_target_ck check (lead_id is not null or customer_id is not null)
);
create index if not exists jemvoyage_sales_act_lead_idx on public.jemvoyage_sales_activities (lead_id, created_at desc);
create index if not exists jemvoyage_sales_act_due_idx  on public.jemvoyage_sales_activities (due_at) where completed_at is null;
select public.jemvoyage_attach_touch('public.jemvoyage_sales_activities');

create table if not exists public.jemvoyage_communications (
  id            uuid primary key default gen_random_uuid(),
  customer_id   uuid references public.jemvoyage_customers(id) on delete cascade,
  lead_id       uuid references public.jemvoyage_leads(id) on delete cascade,
  channel       text not null,
  direction     text not null,
  subject       text,
  body          text,
  to_address    text,
  from_address  text,
  status        text not null default 'sent',
  provider_ref  text,
  error_message text,
  sent_at       timestamptz,
  delivered_at  timestamptz,
  read_at       timestamptz,
  created_at    timestamptz not null default now(),
  created_by    uuid references auth.users(id) on delete set null,
  constraint jemvoyage_comms_channel_ck check (channel in ('email','whatsapp','sms','phone','in_app')),
  constraint jemvoyage_comms_direction_ck check (direction in ('inbound','outbound')),
  constraint jemvoyage_comms_status_ck check (status in ('queued','sent','delivered','read','failed','bounced'))
);
create index if not exists jemvoyage_comms_customer_idx on public.jemvoyage_communications (customer_id, created_at desc);
create index if not exists jemvoyage_comms_lead_idx     on public.jemvoyage_communications (lead_id, created_at desc);

-- ------------------------------------------------------------------ RLS -----
alter table public.jemvoyage_customers            enable row level security;
alter table public.jemvoyage_customer_preferences enable row level security;
alter table public.jemvoyage_lead_sources         enable row level security;
alter table public.jemvoyage_leads                enable row level security;
alter table public.jemvoyage_sales_activities     enable row level security;
alter table public.jemvoyage_communications       enable row level security;

-- A customer sees their own record; staff need customers.view. Nothing here is
-- ever readable by anon.
create policy jemvoyage_customers_self_read on public.jemvoyage_customers
  for select to authenticated
  using (user_id = auth.uid() or public.jemvoyage_has_permission('customers.view'));
create policy jemvoyage_customers_self_update on public.jemvoyage_customers
  for update to authenticated
  using (user_id = auth.uid() or public.jemvoyage_has_permission('customers.manage'))
  with check (user_id = auth.uid() or public.jemvoyage_has_permission('customers.manage'));
create policy jemvoyage_customers_staff_write on public.jemvoyage_customers
  for insert to authenticated
  with check (public.jemvoyage_has_permission('customers.manage'));
create policy jemvoyage_customers_delete on public.jemvoyage_customers
  for delete to authenticated using (public.jemvoyage_is_super_admin());

create policy jemvoyage_cust_pref_self on public.jemvoyage_customer_preferences
  for all to authenticated
  using (exists (select 1 from public.jemvoyage_customers c
                  where c.id = customer_id
                    and (c.user_id = auth.uid() or public.jemvoyage_has_permission('customers.view'))))
  with check (exists (select 1 from public.jemvoyage_customers c
                  where c.id = customer_id
                    and (c.user_id = auth.uid() or public.jemvoyage_has_permission('customers.manage'))));

create policy jemvoyage_lead_sources_read on public.jemvoyage_lead_sources
  for select to authenticated using (public.jemvoyage_has_permission('leads.view'));
create policy jemvoyage_lead_sources_write on public.jemvoyage_lead_sources
  for all to authenticated
  using (public.jemvoyage_has_permission('leads.manage'))
  with check (public.jemvoyage_has_permission('leads.manage'));

-- The public enquiry form must be able to create a lead while signed out, but
-- anon can never read one back.
create policy jemvoyage_leads_public_insert on public.jemvoyage_leads
  for insert to anon, authenticated with check (true);
create policy jemvoyage_leads_staff_read on public.jemvoyage_leads
  for select to authenticated
  using (public.jemvoyage_has_permission('leads.view')
         or exists (select 1 from public.jemvoyage_customers c
                     where c.id = customer_id and c.user_id = auth.uid()));
create policy jemvoyage_leads_staff_write on public.jemvoyage_leads
  for update to authenticated
  using (public.jemvoyage_has_permission('leads.manage'))
  with check (public.jemvoyage_has_permission('leads.manage'));
create policy jemvoyage_leads_delete on public.jemvoyage_leads
  for delete to authenticated using (public.jemvoyage_has_permission('leads.manage'));

create policy jemvoyage_sales_act_read on public.jemvoyage_sales_activities
  for select to authenticated using (public.jemvoyage_has_permission('leads.view'));
create policy jemvoyage_sales_act_write on public.jemvoyage_sales_activities
  for all to authenticated
  using (public.jemvoyage_has_permission('leads.manage'))
  with check (public.jemvoyage_has_permission('leads.manage'));

-- A customer may read their own correspondence history.
create policy jemvoyage_comms_read on public.jemvoyage_communications
  for select to authenticated
  using (public.jemvoyage_has_permission('customers.view')
         or exists (select 1 from public.jemvoyage_customers c
                     where c.id = customer_id and c.user_id = auth.uid()));
create policy jemvoyage_comms_write on public.jemvoyage_communications
  for all to authenticated
  using (public.jemvoyage_has_permission('customers.manage'))
  with check (public.jemvoyage_has_permission('customers.manage'));

insert into public.jemvoyage_lead_sources (slug, name, display_order) values
  ('website','Website',10),('whatsapp','WhatsApp',20),('email','Email',30),
  ('phone','Phone',40),('social','Social media',50),('referral','Referral',60),
  ('travel_agent','Travel agent',70),('corporate','Corporate',80),('walk_in','Walk-in',90)
on conflict (slug) do nothing;;
