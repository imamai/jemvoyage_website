-- JEMVOYAGE LTD — Reviews, notifications, audit logging

-- --------------------------------------------------------------- reviews ----
-- §62: reviews are moderated. Only approved reviews are publicly readable, and
-- a review can only be written against a booking or rental that exists.
create table if not exists public.jemvoyage_reviews (
  id                uuid primary key default gen_random_uuid(),
  customer_id       uuid references public.jemvoyage_customers(id) on delete set null,
  booking_id        uuid references public.jemvoyage_bookings(id) on delete set null,
  rental_id         uuid references public.jemvoyage_rentals(id) on delete set null,
  tour_id           uuid references public.jemvoyage_tours(id) on delete set null,
  vehicle_id        uuid references public.jemvoyage_vehicles(id) on delete set null,
  driver_id         uuid references public.jemvoyage_drivers(id) on delete set null,
  guide_id          uuid references public.jemvoyage_guides(id) on delete set null,
  destination_id    uuid references public.jemvoyage_destinations(id) on delete set null,
  author_name       text not null,
  author_country    text,
  title             text,
  body              text not null,
  rating_overall    smallint not null,
  rating_vehicle    smallint,
  rating_driver     smallint,
  rating_guide      smallint,
  rating_accommodation smallint,
  rating_tour       smallint,
  rating_communication smallint,
  travelled_on      date,
  status            text not null default 'pending',
  moderated_by      uuid references public.jemvoyage_users(id) on delete set null,
  moderated_at      timestamptz,
  moderation_notes  text,
  response_body     text,
  response_at       timestamptz,
  is_featured       boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  deleted_at        timestamptz,
  constraint jemvoyage_reviews_status_ck check (status in ('pending','approved','rejected','hidden')),
  constraint jemvoyage_reviews_overall_ck check (rating_overall between 1 and 5),
  constraint jemvoyage_reviews_sub_ck check (
    (rating_vehicle is null or rating_vehicle between 1 and 5) and
    (rating_driver is null or rating_driver between 1 and 5) and
    (rating_guide is null or rating_guide between 1 and 5) and
    (rating_accommodation is null or rating_accommodation between 1 and 5) and
    (rating_tour is null or rating_tour between 1 and 5) and
    (rating_communication is null or rating_communication between 1 and 5)),
  -- A review must attach to something real: no free-floating testimonials.
  constraint jemvoyage_reviews_subject_ck check (
    booking_id is not null or rental_id is not null or tour_id is not null or vehicle_id is not null)
);
create index if not exists jemvoyage_reviews_status_idx  on public.jemvoyage_reviews (status, created_at desc) where deleted_at is null;
create index if not exists jemvoyage_reviews_tour_idx    on public.jemvoyage_reviews (tour_id) where status = 'approved' and deleted_at is null;
create index if not exists jemvoyage_reviews_vehicle_idx on public.jemvoyage_reviews (vehicle_id) where status = 'approved' and deleted_at is null;
create index if not exists jemvoyage_reviews_featured_idx on public.jemvoyage_reviews (is_featured) where status = 'approved' and deleted_at is null;
select public.jemvoyage_attach_touch('public.jemvoyage_reviews');

-- --------------------------------------------------------- notifications ----
create table if not exists public.jemvoyage_notification_templates (
  id            uuid primary key default gen_random_uuid(),
  key           text not null unique,
  name          text not null,
  channel       text not null,
  subject       text,
  body          text not null,
  variables     text[] not null default '{}',
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  updated_by    uuid references auth.users(id) on delete set null,
  constraint jemvoyage_notif_tpl_channel_ck check (channel in ('email','whatsapp','sms','in_app'))
);
select public.jemvoyage_attach_touch('public.jemvoyage_notification_templates');

create table if not exists public.jemvoyage_notifications (
  id            uuid primary key default gen_random_uuid(),
  template_id   uuid references public.jemvoyage_notification_templates(id) on delete set null,
  user_id       uuid references public.jemvoyage_users(id) on delete cascade,
  customer_id   uuid references public.jemvoyage_customers(id) on delete cascade,
  channel       text not null default 'in_app',
  title         text not null,
  body          text,
  action_url    text,
  entity_type   text,
  entity_id     uuid,
  priority      text not null default 'normal',
  status        text not null default 'pending',
  scheduled_for timestamptz,
  sent_at       timestamptz,
  read_at       timestamptz,
  error_message text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint jemvoyage_notif_channel_ck check (channel in ('email','whatsapp','sms','in_app')),
  constraint jemvoyage_notif_status_ck check (status in ('pending','queued','sent','delivered','read','failed','cancelled')),
  constraint jemvoyage_notif_priority_ck check (priority in ('low','normal','high','urgent'))
);
create index if not exists jemvoyage_notif_user_idx  on public.jemvoyage_notifications (user_id, created_at desc);
create index if not exists jemvoyage_notif_due_idx   on public.jemvoyage_notifications (scheduled_for) where status = 'pending';
select public.jemvoyage_attach_touch('public.jemvoyage_notifications');

-- ------------------------------------------------------------- audit log ----
create table if not exists public.jemvoyage_audit_logs (
  id          bigserial primary key,
  occurred_at timestamptz not null default now(),
  user_id     uuid references auth.users(id) on delete set null,
  user_email  text,
  user_role   text,
  action      text not null,
  entity_type text not null,
  entity_id   text,
  summary     text,
  old_values  jsonb,
  new_values  jsonb,
  changed_fields text[],
  ip_address  inet,
  user_agent  text
);
create index if not exists jemvoyage_audit_entity_idx on public.jemvoyage_audit_logs (entity_type, entity_id, occurred_at desc);
create index if not exists jemvoyage_audit_user_idx   on public.jemvoyage_audit_logs (user_id, occurred_at desc);
create index if not exists jemvoyage_audit_time_idx   on public.jemvoyage_audit_logs (occurred_at desc);

-- Generic audit trigger. Records only the fields that actually changed, so the
-- log stays readable and small.
create or replace function public.jemvoyage_audit_trigger()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_old   jsonb;
  v_new   jsonb;
  v_diff  text[];
  v_key   text;
  v_id    text;
begin
  if tg_op = 'INSERT' then
    v_new := to_jsonb(new);
    v_id  := coalesce(v_new ->> 'id', '');
  elsif tg_op = 'DELETE' then
    v_old := to_jsonb(old);
    v_id  := coalesce(v_old ->> 'id', '');
  else
    v_old := to_jsonb(old);
    v_new := to_jsonb(new);
    v_id  := coalesce(v_new ->> 'id', '');
    for v_key in select jsonb_object_keys(v_new) loop
      if v_key not in ('updated_at','updated_by')
         and (v_old -> v_key) is distinct from (v_new -> v_key) then
        v_diff := array_append(v_diff, v_key);
      end if;
    end loop;
    -- Nothing of substance changed; do not log noise.
    if v_diff is null or cardinality(v_diff) = 0 then
      return new;
    end if;
  end if;

  insert into public.jemvoyage_audit_logs
    (user_id, action, entity_type, entity_id, old_values, new_values, changed_fields)
  values
    (auth.uid(), lower(tg_op), tg_table_name, v_id, v_old, v_new, v_diff);

  return coalesce(new, old);
exception when others then
  -- Auditing must never block the business operation it is recording.
  return coalesce(new, old);
end;
$$;
revoke all on function public.jemvoyage_audit_trigger() from public, anon, authenticated;

-- Attach to the tables where a change carries money, liability or access.
do $$
declare
  t text;
begin
  foreach t in array array[
    'jemvoyage_quotes','jemvoyage_bookings','jemvoyage_rentals','jemvoyage_payments',
    'jemvoyage_refunds','jemvoyage_invoices','jemvoyage_rental_deposits',
    'jemvoyage_rental_damage_reports','jemvoyage_vehicle_rates','jemvoyage_user_roles',
    'jemvoyage_travel_agents','jemvoyage_corporate_accounts','jemvoyage_reviews'
  ] loop
    execute format('drop trigger if exists trg_audit_%1$s on public.%1$I', t);
    execute format(
      'create trigger trg_audit_%1$s after insert or update or delete on public.%1$I
         for each row execute function public.jemvoyage_audit_trigger()', t);
  end loop;
end $$;

-- ------------------------------------------------------------------ RLS -----
alter table public.jemvoyage_reviews                enable row level security;
alter table public.jemvoyage_notification_templates enable row level security;
alter table public.jemvoyage_notifications          enable row level security;
alter table public.jemvoyage_audit_logs             enable row level security;

create policy jemvoyage_reviews_public_read on public.jemvoyage_reviews
  for select to anon, authenticated
  using (status = 'approved' and deleted_at is null);
create policy jemvoyage_reviews_own_read on public.jemvoyage_reviews
  for select to authenticated
  using (public.jemvoyage_has_permission('reviews.view') or public.jemvoyage_owns_customer(customer_id));
create policy jemvoyage_reviews_own_insert on public.jemvoyage_reviews
  for insert to authenticated
  with check (public.jemvoyage_owns_customer(customer_id) or public.jemvoyage_has_permission('reviews.manage'));
create policy jemvoyage_reviews_moderate on public.jemvoyage_reviews
  for all to authenticated
  using (public.jemvoyage_has_permission('reviews.moderate') or public.jemvoyage_has_permission('reviews.manage'))
  with check (public.jemvoyage_has_permission('reviews.moderate') or public.jemvoyage_has_permission('reviews.manage'));

create policy jemvoyage_notif_tpl_read on public.jemvoyage_notification_templates
  for select to authenticated using (public.jemvoyage_has_permission('notifications.view'));
create policy jemvoyage_notif_tpl_write on public.jemvoyage_notification_templates
  for all to authenticated
  using (public.jemvoyage_has_permission('notifications.manage'))
  with check (public.jemvoyage_has_permission('notifications.manage'));

create policy jemvoyage_notif_own_read on public.jemvoyage_notifications
  for select to authenticated
  using (user_id = auth.uid()
         or public.jemvoyage_owns_customer(customer_id)
         or public.jemvoyage_has_permission('notifications.view'));
create policy jemvoyage_notif_own_update on public.jemvoyage_notifications
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
create policy jemvoyage_notif_write on public.jemvoyage_notifications
  for all to authenticated
  using (public.jemvoyage_has_permission('notifications.manage'))
  with check (public.jemvoyage_has_permission('notifications.manage'));

-- Audit log is READ ONLY through the API. No INSERT/UPDATE/DELETE policy exists,
-- so nothing but the SECURITY DEFINER trigger can write it, and nothing can
-- alter or erase history.
create policy jemvoyage_audit_read on public.jemvoyage_audit_logs
  for select to authenticated using (public.jemvoyage_has_permission('audit.view'));

insert into public.jemvoyage_notification_templates (key, name, channel, subject, body, variables) values
  ('enquiry_received','New enquiry received','email','We have your enquiry, {{first_name}}','Thank you for contacting Jemvoyage. One of our travel planners will reply within one working day.',array['first_name']),
  ('quote_created','Quotation ready','email','Your Jemvoyage quotation {{reference}}','Your quotation is ready to view. It is valid until {{valid_until}}.',array['reference','valid_until']),
  ('quote_accepted','Quotation accepted','in_app','Quotation accepted','{{customer_name}} accepted quotation {{reference}}.',array['customer_name','reference']),
  ('payment_received','Payment received','email','Payment received — {{reference}}','We have received {{amount}}. Thank you.',array['reference','amount']),
  ('balance_due','Balance due','email','Balance due for booking {{reference}}','A balance of {{amount}} is due by {{due_date}}.',array['reference','amount','due_date']),
  ('booking_confirmed','Booking confirmed','email','Your booking {{reference}} is confirmed','Your journey is confirmed. Full details are in your account.',array['reference']),
  ('rental_starting','Rental starting','sms','','Your Jemvoyage rental starts {{starts_at}}. Pickup: {{pickup_location}}.',array['starts_at','pickup_location']),
  ('rental_ending','Rental ending','sms','','Your rental ends {{ends_at}}. Please return to {{dropoff_location}}.',array['ends_at','dropoff_location']),
  ('transfer_reminder','Transfer reminder','whatsapp','','Your transfer is scheduled for {{scheduled_at}}. Driver details to follow.',array['scheduled_at']),
  ('trip_reminder','Trip reminder','email','Your trip starts soon','Your Jemvoyage journey begins on {{start_date}}.',array['start_date']),
  ('review_request','Review request','email','How was your journey?','We would value your feedback on your recent trip with us.',array['reference']),
  ('maintenance_alert','Maintenance due','in_app','Maintenance due','{{registration}} is due for {{maintenance_type}} on {{due_date}}.',array['registration','maintenance_type','due_date']),
  ('document_expiry','Document expiring','in_app','Document expiring','{{document_type}} for {{subject}} expires on {{expires_on}}.',array['document_type','subject','expires_on'])
on conflict (key) do nothing;;
