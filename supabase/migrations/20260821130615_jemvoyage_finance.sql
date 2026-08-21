-- JEMVOYAGE LTD — Finance: corporate, agents, invoices, payments, refunds, expenses

create table if not exists public.jemvoyage_corporate_accounts (
  id                uuid primary key default gen_random_uuid(),
  reference         text not null unique default public.jemvoyage_next_reference('CO'),
  company_name      text not null,
  trading_name      text,
  registration_no   text,
  tax_pin           text,
  industry          text,
  billing_email     citext,
  billing_address   text,
  billing_contact   text,
  phone             text,
  credit_limit      numeric(14,2) not null default 0,
  credit_terms_days integer not null default 30,
  current_balance   numeric(14,2) not null default 0,
  discount_rate     numeric(5,2) not null default 0,
  requires_approval boolean not null default true,
  monthly_spend_limit numeric(14,2),
  account_manager_id uuid references public.jemvoyage_users(id) on delete set null,
  status            text not null default 'active',
  notes             text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  created_by        uuid references auth.users(id) on delete set null,
  updated_by        uuid references auth.users(id) on delete set null,
  deleted_at        timestamptz,
  constraint jemvoyage_corp_status_ck check (status in ('pending','active','suspended','closed')),
  constraint jemvoyage_corp_discount_ck check (discount_rate between 0 and 100)
);
select public.jemvoyage_attach_touch('public.jemvoyage_corporate_accounts');

create table if not exists public.jemvoyage_corporate_users (
  id                   uuid primary key default gen_random_uuid(),
  corporate_account_id uuid not null references public.jemvoyage_corporate_accounts(id) on delete cascade,
  user_id              uuid references public.jemvoyage_users(id) on delete set null,
  customer_id          uuid references public.jemvoyage_customers(id) on delete set null,
  full_name            text not null,
  email                citext not null,
  phone                text,
  job_title            text,
  cost_centre          text,
  can_approve          boolean not null default false,
  spend_limit          numeric(14,2),
  is_active            boolean not null default true,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  unique (corporate_account_id, email)
);
create index if not exists jemvoyage_corp_users_acct_idx on public.jemvoyage_corporate_users (corporate_account_id);
create index if not exists jemvoyage_corp_users_user_idx on public.jemvoyage_corporate_users (user_id);
select public.jemvoyage_attach_touch('public.jemvoyage_corporate_users');

create table if not exists public.jemvoyage_travel_agents (
  id               uuid primary key default gen_random_uuid(),
  reference        text not null unique default public.jemvoyage_next_reference('TA'),
  user_id          uuid references public.jemvoyage_users(id) on delete set null,
  agency_name      text not null,
  contact_name     text,
  email            citext not null,
  phone            text,
  country          text,
  city             text,
  address          text,
  tax_pin          text,
  iata_number      text,
  commission_rate  numeric(5,2) not null default 10,
  credit_limit     numeric(14,2) not null default 0,
  credit_terms_days integer not null default 30,
  current_balance  numeric(14,2) not null default 0,
  net_rates_enabled boolean not null default true,
  status           text not null default 'pending',
  approved_by      uuid references public.jemvoyage_users(id) on delete set null,
  approved_at      timestamptz,
  notes            text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  created_by       uuid references auth.users(id) on delete set null,
  updated_by       uuid references auth.users(id) on delete set null,
  deleted_at       timestamptz,
  constraint jemvoyage_agents_status_ck check (status in ('pending','active','suspended','rejected','closed')),
  constraint jemvoyage_agents_commission_ck check (commission_rate between 0 and 100)
);
create index if not exists jemvoyage_agents_user_idx on public.jemvoyage_travel_agents (user_id) where deleted_at is null;
select public.jemvoyage_attach_touch('public.jemvoyage_travel_agents');

-- Deferred FKs from the bookings table.
alter table public.jemvoyage_bookings drop constraint if exists jemvoyage_bookings_corporate_fk;
alter table public.jemvoyage_bookings add constraint jemvoyage_bookings_corporate_fk
  foreign key (corporate_account_id) references public.jemvoyage_corporate_accounts(id) on delete set null;
alter table public.jemvoyage_bookings drop constraint if exists jemvoyage_bookings_agent_fk;
alter table public.jemvoyage_bookings add constraint jemvoyage_bookings_agent_fk
  foreign key (travel_agent_id) references public.jemvoyage_travel_agents(id) on delete set null;
create index if not exists jemvoyage_bookings_corp_idx  on public.jemvoyage_bookings (corporate_account_id);
create index if not exists jemvoyage_bookings_agent_idx on public.jemvoyage_bookings (travel_agent_id);

create table if not exists public.jemvoyage_agent_commissions (
  id              uuid primary key default gen_random_uuid(),
  travel_agent_id uuid not null references public.jemvoyage_travel_agents(id) on delete cascade,
  booking_id      uuid references public.jemvoyage_bookings(id) on delete set null,
  base_amount     numeric(14,2) not null default 0,
  commission_rate numeric(5,2) not null default 0,
  commission_amount numeric(14,2) not null default 0,
  currency        text not null default 'KES',
  status          text not null default 'pending',
  earned_on       date,
  paid_at         timestamptz,
  payment_reference text,
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint jemvoyage_agent_comm_status_ck check (status in ('pending','approved','paid','cancelled'))
);
create index if not exists jemvoyage_agent_comm_idx on public.jemvoyage_agent_commissions (travel_agent_id, status);
select public.jemvoyage_attach_touch('public.jemvoyage_agent_commissions');

-- ------------------------------------------------------------- invoices -----
create table if not exists public.jemvoyage_invoices (
  id                uuid primary key default gen_random_uuid(),
  invoice_number    text not null unique default public.jemvoyage_next_reference('INV'),
  customer_id       uuid references public.jemvoyage_customers(id) on delete set null,
  corporate_account_id uuid references public.jemvoyage_corporate_accounts(id) on delete set null,
  travel_agent_id   uuid references public.jemvoyage_travel_agents(id) on delete set null,
  booking_id        uuid references public.jemvoyage_bookings(id) on delete set null,
  rental_id         uuid references public.jemvoyage_rentals(id) on delete set null,
  invoice_type      text not null default 'sales',
  issue_date        date not null default current_date,
  due_date          date,
  currency          text not null default 'KES',
  subtotal          numeric(14,2) not null default 0,
  discount_amount   numeric(14,2) not null default 0,
  tax_rate          numeric(5,2) not null default 0,
  tax_amount        numeric(14,2) not null default 0,
  total             numeric(14,2) not null default 0,
  amount_paid       numeric(14,2) not null default 0,
  balance_due       numeric(14,2) generated always as (total - amount_paid) stored,
  status            text not null default 'draft',
  notes             text,
  terms             text,
  pdf_media_id      uuid references public.jemvoyage_media(id) on delete set null,
  sent_at           timestamptz,
  paid_at           timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  created_by        uuid references auth.users(id) on delete set null,
  updated_by        uuid references auth.users(id) on delete set null,
  deleted_at        timestamptz,
  constraint jemvoyage_invoices_type_ck check (invoice_type in ('sales','proforma','deposit','balance','credit_note')),
  constraint jemvoyage_invoices_status_ck check (status in
    ('draft','issued','sent','partially_paid','paid','overdue','cancelled','void')),
  constraint jemvoyage_invoices_money_ck check (total >= 0 and amount_paid >= 0)
);
create index if not exists jemvoyage_invoices_customer_idx on public.jemvoyage_invoices (customer_id) where deleted_at is null;
create index if not exists jemvoyage_invoices_status_idx   on public.jemvoyage_invoices (status, due_date) where deleted_at is null;
create index if not exists jemvoyage_invoices_booking_idx  on public.jemvoyage_invoices (booking_id);
select public.jemvoyage_attach_touch('public.jemvoyage_invoices');

create table if not exists public.jemvoyage_invoice_items (
  id            uuid primary key default gen_random_uuid(),
  invoice_id    uuid not null references public.jemvoyage_invoices(id) on delete cascade,
  description   text not null,
  quantity      numeric(10,2) not null default 1,
  unit_price    numeric(12,2) not null default 0,
  line_total    numeric(14,2) generated always as (quantity * unit_price) stored,
  is_taxable    boolean not null default true,
  display_order integer not null default 0,
  created_at    timestamptz not null default now()
);
create index if not exists jemvoyage_invoice_items_idx on public.jemvoyage_invoice_items (invoice_id, display_order);

-- ------------------------------------------------------------- payments -----
-- §31: a payment row is only ever written server-side after the provider has
-- been independently verified. The frontend never confirms a payment.
create table if not exists public.jemvoyage_payments (
  id                 uuid primary key default gen_random_uuid(),
  reference          text not null unique default public.jemvoyage_next_reference('PM'),
  invoice_id         uuid references public.jemvoyage_invoices(id) on delete set null,
  booking_id         uuid references public.jemvoyage_bookings(id) on delete set null,
  rental_id          uuid references public.jemvoyage_rentals(id) on delete set null,
  customer_id        uuid references public.jemvoyage_customers(id) on delete set null,
  payment_type       text not null default 'full',
  method             text not null,
  amount             numeric(14,2) not null,
  currency           text not null default 'KES',
  status             text not null default 'pending',
  provider           text,
  provider_reference text,
  merchant_request_id text,
  checkout_request_id text,
  mpesa_receipt      text,
  payer_phone        text,
  payer_name         text,
  bank_reference     text,
  verified_at        timestamptz,
  verified_by        uuid references public.jemvoyage_users(id) on delete set null,
  failure_reason     text,
  paid_at            timestamptz,
  notes              text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  created_by         uuid references auth.users(id) on delete set null,
  constraint jemvoyage_payments_type_ck check (payment_type in ('deposit','partial','full','balance','extension','damage','other')),
  constraint jemvoyage_payments_method_ck check (method in ('mpesa','card','bank_transfer','cash','cheque','credit_account')),
  constraint jemvoyage_payments_status_ck check (status in
    ('pending','processing','succeeded','failed','cancelled','refunded','partially_refunded')),
  constraint jemvoyage_payments_amount_ck check (amount > 0)
);
create index if not exists jemvoyage_payments_invoice_idx  on public.jemvoyage_payments (invoice_id);
create index if not exists jemvoyage_payments_booking_idx  on public.jemvoyage_payments (booking_id);
create index if not exists jemvoyage_payments_status_idx   on public.jemvoyage_payments (status, created_at desc);
create unique index if not exists jemvoyage_payments_mpesa_uq on public.jemvoyage_payments (mpesa_receipt) where mpesa_receipt is not null;
create unique index if not exists jemvoyage_payments_checkout_uq on public.jemvoyage_payments (checkout_request_id) where checkout_request_id is not null;
select public.jemvoyage_attach_touch('public.jemvoyage_payments');

-- Raw provider callbacks, stored verbatim for reconciliation and dispute
-- evidence. Never readable by anon or by customers.
create table if not exists public.jemvoyage_payment_events (
  id            uuid primary key default gen_random_uuid(),
  payment_id    uuid references public.jemvoyage_payments(id) on delete set null,
  provider      text not null,
  event_type    text not null,
  external_id   text,
  signature_ok  boolean,
  payload       jsonb not null,
  processed     boolean not null default false,
  processed_at  timestamptz,
  error_message text,
  received_at   timestamptz not null default now()
);
create index if not exists jemvoyage_payment_events_payment_idx on public.jemvoyage_payment_events (payment_id);
create index if not exists jemvoyage_payment_events_ext_idx     on public.jemvoyage_payment_events (external_id);
create index if not exists jemvoyage_payment_events_unproc_idx  on public.jemvoyage_payment_events (received_at) where not processed;

create table if not exists public.jemvoyage_refunds (
  id               uuid primary key default gen_random_uuid(),
  reference        text not null unique default public.jemvoyage_next_reference('RF'),
  payment_id       uuid references public.jemvoyage_payments(id) on delete set null,
  invoice_id       uuid references public.jemvoyage_invoices(id) on delete set null,
  booking_id       uuid references public.jemvoyage_bookings(id) on delete set null,
  rental_id        uuid references public.jemvoyage_rentals(id) on delete set null,
  customer_id      uuid references public.jemvoyage_customers(id) on delete set null,
  amount           numeric(14,2) not null,
  currency         text not null default 'KES',
  reason           text not null,
  refund_type      text not null default 'full',
  method           text,
  status           text not null default 'requested',
  requested_by     uuid references public.jemvoyage_users(id) on delete set null,
  approved_by      uuid references public.jemvoyage_users(id) on delete set null,
  approved_at      timestamptz,
  processed_at     timestamptz,
  provider_reference text,
  notes            text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  constraint jemvoyage_refunds_type_ck check (refund_type in ('full','partial')),
  constraint jemvoyage_refunds_status_ck check (status in
    ('requested','approved','processing','completed','rejected','failed')),
  constraint jemvoyage_refunds_amount_ck check (amount > 0)
);
create index if not exists jemvoyage_refunds_status_idx on public.jemvoyage_refunds (status, created_at desc);
select public.jemvoyage_attach_touch('public.jemvoyage_refunds');

create table if not exists public.jemvoyage_expenses (
  id             uuid primary key default gen_random_uuid(),
  reference      text not null unique default public.jemvoyage_next_reference('EX'),
  category       text not null,
  description    text not null,
  amount         numeric(14,2) not null,
  currency       text not null default 'KES',
  expense_date   date not null default current_date,
  booking_id     uuid references public.jemvoyage_bookings(id) on delete set null,
  rental_id      uuid references public.jemvoyage_rentals(id) on delete set null,
  vehicle_id     uuid references public.jemvoyage_vehicles(id) on delete set null,
  supplier_id    uuid references public.jemvoyage_suppliers(id) on delete set null,
  driver_id      uuid references public.jemvoyage_drivers(id) on delete set null,
  payment_method text,
  receipt_media_id uuid references public.jemvoyage_media(id) on delete set null,
  status         text not null default 'recorded',
  approved_by    uuid references public.jemvoyage_users(id) on delete set null,
  approved_at    timestamptz,
  notes          text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  created_by     uuid references auth.users(id) on delete set null,
  constraint jemvoyage_expenses_category_ck check (category in
    ('fuel','maintenance','park_fees','accommodation','meals','supplier','salary',
     'commission','insurance','licence','marketing','office','other')),
  constraint jemvoyage_expenses_status_ck check (status in ('recorded','approved','reimbursed','rejected')),
  constraint jemvoyage_expenses_amount_ck check (amount > 0)
);
create index if not exists jemvoyage_expenses_date_idx    on public.jemvoyage_expenses (expense_date desc);
create index if not exists jemvoyage_expenses_vehicle_idx on public.jemvoyage_expenses (vehicle_id);
create index if not exists jemvoyage_expenses_booking_idx on public.jemvoyage_expenses (booking_id);
select public.jemvoyage_attach_touch('public.jemvoyage_expenses');

-- ------------------------------------------------------------------ RLS -----
alter table public.jemvoyage_corporate_accounts enable row level security;
alter table public.jemvoyage_corporate_users    enable row level security;
alter table public.jemvoyage_travel_agents      enable row level security;
alter table public.jemvoyage_agent_commissions  enable row level security;
alter table public.jemvoyage_invoices           enable row level security;
alter table public.jemvoyage_invoice_items      enable row level security;
alter table public.jemvoyage_payments           enable row level security;
alter table public.jemvoyage_payment_events     enable row level security;
alter table public.jemvoyage_refunds            enable row level security;
alter table public.jemvoyage_expenses           enable row level security;

-- §54: a corporate user sees only their own company's records.
create or replace function public.jemvoyage_my_corporate_accounts()
returns setof uuid language sql stable security definer set search_path = public as $$
  select cu.corporate_account_id
    from public.jemvoyage_corporate_users cu
   where cu.user_id = auth.uid() and cu.is_active;
$$;
revoke all on function public.jemvoyage_my_corporate_accounts() from public, anon;
grant execute on function public.jemvoyage_my_corporate_accounts() to authenticated;

create or replace function public.jemvoyage_my_agent_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.jemvoyage_travel_agents
   where user_id = auth.uid() and status = 'active' and deleted_at is null
   limit 1;
$$;
revoke all on function public.jemvoyage_my_agent_id() from public, anon;
grant execute on function public.jemvoyage_my_agent_id() to authenticated;

create policy jemvoyage_corp_read on public.jemvoyage_corporate_accounts
  for select to authenticated
  using (public.jemvoyage_has_permission('corporate.view')
         or id in (select public.jemvoyage_my_corporate_accounts()));
create policy jemvoyage_corp_write on public.jemvoyage_corporate_accounts
  for all to authenticated
  using (public.jemvoyage_has_permission('corporate.manage'))
  with check (public.jemvoyage_has_permission('corporate.manage'));

create policy jemvoyage_corp_users_read on public.jemvoyage_corporate_users
  for select to authenticated
  using (public.jemvoyage_has_permission('corporate.view')
         or user_id = auth.uid()
         or corporate_account_id in (select public.jemvoyage_my_corporate_accounts()));
create policy jemvoyage_corp_users_write on public.jemvoyage_corporate_users
  for all to authenticated
  using (public.jemvoyage_has_permission('corporate.manage'))
  with check (public.jemvoyage_has_permission('corporate.manage'));

create policy jemvoyage_agents_read on public.jemvoyage_travel_agents
  for select to authenticated
  using (public.jemvoyage_has_permission('agents.view') or user_id = auth.uid());
create policy jemvoyage_agents_write on public.jemvoyage_travel_agents
  for all to authenticated
  using (public.jemvoyage_has_permission('agents.manage'))
  with check (public.jemvoyage_has_permission('agents.manage'));

create policy jemvoyage_agent_comm_read on public.jemvoyage_agent_commissions
  for select to authenticated
  using (public.jemvoyage_has_permission('agents.view')
         or travel_agent_id = public.jemvoyage_my_agent_id());
create policy jemvoyage_agent_comm_write on public.jemvoyage_agent_commissions
  for all to authenticated
  using (public.jemvoyage_has_permission('agents.manage'))
  with check (public.jemvoyage_has_permission('agents.manage'));

-- Customers see their own issued invoices, never drafts.
create policy jemvoyage_invoices_read on public.jemvoyage_invoices
  for select to authenticated
  using (public.jemvoyage_has_permission('invoices.view')
         or (status <> 'draft' and (
              public.jemvoyage_owns_customer(customer_id)
              or corporate_account_id in (select public.jemvoyage_my_corporate_accounts())
              or travel_agent_id = public.jemvoyage_my_agent_id())));
create policy jemvoyage_invoices_write on public.jemvoyage_invoices
  for all to authenticated
  using (public.jemvoyage_has_permission('invoices.manage'))
  with check (public.jemvoyage_has_permission('invoices.manage'));

create policy jemvoyage_invoice_items_read on public.jemvoyage_invoice_items
  for select to authenticated
  using (exists (select 1 from public.jemvoyage_invoices i
                  where i.id = invoice_id
                    and (public.jemvoyage_has_permission('invoices.view')
                         or (i.status <> 'draft' and public.jemvoyage_owns_customer(i.customer_id)))));
create policy jemvoyage_invoice_items_write on public.jemvoyage_invoice_items
  for all to authenticated
  using (public.jemvoyage_has_permission('invoices.manage'))
  with check (public.jemvoyage_has_permission('invoices.manage'));

-- Payments are readable by the payer and by finance. They are NEVER writable
-- from the client: rows are created and settled by server-side routes holding
-- the service role after provider verification.
create policy jemvoyage_payments_read on public.jemvoyage_payments
  for select to authenticated
  using (public.jemvoyage_has_permission('payments.view')
         or public.jemvoyage_owns_customer(customer_id));
create policy jemvoyage_payments_write on public.jemvoyage_payments
  for all to authenticated
  using (public.jemvoyage_has_permission('payments.manage'))
  with check (public.jemvoyage_has_permission('payments.manage'));

-- Raw callbacks: finance reconciliation only. No customer, no anon, ever.
create policy jemvoyage_payment_events_read on public.jemvoyage_payment_events
  for select to authenticated using (public.jemvoyage_has_permission('payments.reconcile'));

create policy jemvoyage_refunds_read on public.jemvoyage_refunds
  for select to authenticated
  using (public.jemvoyage_has_permission('refunds.view')
         or public.jemvoyage_owns_customer(customer_id));
create policy jemvoyage_refunds_write on public.jemvoyage_refunds
  for all to authenticated
  using (public.jemvoyage_has_permission('payments.refund') or public.jemvoyage_has_permission('refunds.manage'))
  with check (public.jemvoyage_has_permission('payments.refund') or public.jemvoyage_has_permission('refunds.manage'));

create policy jemvoyage_expenses_read on public.jemvoyage_expenses
  for select to authenticated using (public.jemvoyage_has_permission('expenses.view'));
create policy jemvoyage_expenses_write on public.jemvoyage_expenses
  for all to authenticated
  using (public.jemvoyage_has_permission('expenses.manage'))
  with check (public.jemvoyage_has_permission('expenses.manage'));;
