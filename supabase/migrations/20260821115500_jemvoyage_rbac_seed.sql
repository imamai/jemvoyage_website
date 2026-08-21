-- =============================================================================
-- JEMVOYAGE LTD — 0003 · Role & permission seed
-- =============================================================================
-- Idempotent: safe to re-run. Permission keys follow `resource.action`.
-- Every resource gets `.view` and `.manage`; sensitive operations get their own
-- discrete key so they can be granted without granting full management.
-- =============================================================================

-- --- Roles -------------------------------------------------------------------
insert into public.jemvoyage_roles (name, label, description, is_staff, is_system, display_order) values
  ('super_admin',        'Super Admin',        'Unrestricted access to every module and setting.',        true,  true,  10),
  ('ceo',                'CEO',                'Full visibility across the business; approves at board level.', true, true, 20),
  ('general_manager',    'General Manager',    'Day-to-day oversight of sales, operations and finance.',  true,  true,  30),
  ('sales_manager',      'Sales Manager',      'Owns the CRM pipeline, pricing, discounts and quotations.', true, true,  40),
  ('sales_agent',        'Sales Agent',        'Works leads, builds itineraries and issues quotations.',   true,  true,  50),
  ('operations_manager', 'Operations Manager', 'Runs trips, transfers, drivers, guides and suppliers.',    true,  true,  60),
  ('dispatcher',         'Dispatcher',         'Assigns drivers and vehicles; tracks transfers in flight.', true, true,  70),
  ('fleet_manager',      'Fleet Manager',      'Owns vehicles, availability, maintenance and inspections.', true, true,  80),
  ('driver',             'Driver',             'Sees only their own assignments and trip sheets.',         true,  true,  90),
  ('guide',              'Guide',              'Sees only their own assigned tours and travellers.',       true,  true, 100),
  ('finance',            'Finance',            'Invoices, payments, refunds, expenses and reconciliation.', true, true, 110),
  ('marketing',          'Marketing',          'Campaigns, offers, newsletter and analytics.',             true,  true, 120),
  ('content_editor',     'Content Editor',     'CMS pages, blog, media library and SEO metadata.',         true,  true, 130),
  ('supplier',           'Supplier',           'External partner: own contracts, rates and bookings only.', false, true, 140),
  ('travel_agent',       'Travel Agent',       'B2B partner: net rates, own customers and commissions.',   false, true, 150),
  ('corporate_user',     'Corporate User',     'Books within their corporate account and its limits.',     false, true, 160),
  ('customer',           'Customer',           'Retail traveller: own trips, rentals, quotes and payments.', false, true, 170)
on conflict (name) do update
  set label = excluded.label,
      description = excluded.description,
      is_staff = excluded.is_staff,
      display_order = excluded.display_order;


-- --- Permissions -------------------------------------------------------------
-- Base: <resource>.view + <resource>.manage for every resource.
insert into public.jemvoyage_permissions (key, resource, action, label)
select r || '.' || a,
       r,
       a,
       initcap(replace(r, '_', ' ')) || ' — ' || initcap(a)
from unnest(array[
  'users','customers','leads','quotes','bookings','rentals','tours','destinations',
  'activities','vehicles','fleet','drivers','guides','transfers','suppliers',
  'invoices','payments','refunds','expenses','corporate','agents','reviews',
  'cms','media','blog','seo','offers','notifications','reports','maintenance','settings'
]) as r
cross join unnest(array['view','manage']) as a
on conflict (key) do nothing;

-- Discrete high-consequence permissions.
insert into public.jemvoyage_permissions (key, resource, action, label) values
  ('quotes.approve',     'quotes',    'approve', 'Quotes — Approve before sending'),
  ('bookings.approve',   'bookings',  'approve', 'Bookings — Confirm booking'),
  ('bookings.cancel',    'bookings',  'cancel',  'Bookings — Cancel booking'),
  ('payments.refund',    'payments',  'refund',  'Payments — Issue refund'),
  ('payments.reconcile', 'payments',  'reconcile','Payments — Reconcile transactions'),
  ('pricing.manage',     'pricing',   'manage',  'Pricing — Edit rates and markup'),
  ('discounts.manage',   'discounts', 'manage',  'Discounts — Apply and override discounts'),
  ('cms.publish',        'cms',       'publish', 'CMS — Publish pages live'),
  ('blog.publish',       'blog',      'publish', 'Blog — Publish articles live'),
  ('reviews.moderate',   'reviews',   'moderate','Reviews — Approve or reject reviews'),
  ('reports.export',     'reports',   'export',  'Reports — Export CSV / PDF'),
  ('audit.view',         'audit',     'view',    'Audit — Read the audit log')
on conflict (key) do nothing;


-- --- Role → permission mapping ----------------------------------------------
-- super_admin is intentionally NOT mapped: jemvoyage_has_permission() short
-- circuits on jemvoyage_is_super_admin(), so it holds every permission implicitly.

do $$
declare
  v_map jsonb := jsonb_build_object(
    'ceo',                to_jsonb(array['*.view','reports.export','audit.view']),
    'general_manager',    to_jsonb(array['*.view','*.manage','reports.export','audit.view',
                                         'quotes.approve','bookings.approve','bookings.cancel',
                                         'pricing.manage','discounts.manage']),
    'sales_manager',      to_jsonb(array['customers.view','customers.manage','leads.view','leads.manage',
                                         'quotes.view','quotes.manage','quotes.approve',
                                         'bookings.view','bookings.manage','bookings.approve','bookings.cancel',
                                         'tours.view','destinations.view','vehicles.view','rentals.view',
                                         'pricing.manage','discounts.manage','reports.view','reports.export',
                                         'corporate.view','agents.view','reviews.view']),
    'sales_agent',        to_jsonb(array['customers.view','customers.manage','leads.view','leads.manage',
                                         'quotes.view','quotes.manage','bookings.view','bookings.manage',
                                         'tours.view','destinations.view','activities.view','vehicles.view',
                                         'rentals.view','suppliers.view','reports.view']),
    'operations_manager', to_jsonb(array['bookings.view','bookings.manage','rentals.view','rentals.manage',
                                         'transfers.view','transfers.manage','drivers.view','drivers.manage',
                                         'guides.view','guides.manage','vehicles.view','fleet.view',
                                         'suppliers.view','suppliers.manage','tours.view','customers.view',
                                         'expenses.view','reports.view','reports.export']),
    'dispatcher',         to_jsonb(array['transfers.view','transfers.manage','drivers.view','vehicles.view',
                                         'fleet.view','bookings.view','rentals.view','customers.view']),
    'fleet_manager',      to_jsonb(array['vehicles.view','vehicles.manage','fleet.view','fleet.manage',
                                         'maintenance.view','maintenance.manage','rentals.view','rentals.manage',
                                         'drivers.view','drivers.manage','transfers.view','media.view','media.manage',
                                         'expenses.view','reports.view','reports.export']),
    'driver',             to_jsonb(array['transfers.view','bookings.view']),
    'guide',              to_jsonb(array['bookings.view','tours.view']),
    'finance',            to_jsonb(array['invoices.view','invoices.manage','payments.view','payments.manage',
                                         'payments.refund','payments.reconcile','refunds.view','refunds.manage',
                                         'expenses.view','expenses.manage','bookings.view','rentals.view',
                                         'customers.view','corporate.view','corporate.manage','agents.view',
                                         'suppliers.view','reports.view','reports.export','audit.view']),
    'marketing',          to_jsonb(array['offers.view','offers.manage','blog.view','blog.manage','blog.publish',
                                         'cms.view','media.view','media.manage','seo.view','seo.manage',
                                         'notifications.view','notifications.manage','reviews.view',
                                         'customers.view','reports.view']),
    'content_editor',     to_jsonb(array['cms.view','cms.manage','cms.publish','blog.view','blog.manage','blog.publish',
                                         'media.view','media.manage','seo.view','seo.manage',
                                         'tours.view','tours.manage','destinations.view','destinations.manage',
                                         'activities.view','activities.manage','offers.view','offers.manage',
                                         'reviews.view','reviews.moderate']),
    'travel_agent',       to_jsonb(array['tours.view','destinations.view','vehicles.view']),
    'corporate_user',     to_jsonb(array['tours.view','destinations.view','vehicles.view']),
    'supplier',           to_jsonb(array['suppliers.view']),
    'customer',           to_jsonb(array[]::text[])
  );
  v_role  text;
  v_keys  jsonb;
  v_key   text;
  v_rid   uuid;
begin
  for v_role, v_keys in select * from jsonb_each(v_map) loop
    select id into v_rid from public.jemvoyage_roles where name = v_role;
    if v_rid is null then continue; end if;

    delete from public.jemvoyage_role_permissions where role_id = v_rid;

    for v_key in select jsonb_array_elements_text(v_keys) loop
      if v_key = '*.view' then
        insert into public.jemvoyage_role_permissions (role_id, permission_id)
        select v_rid, p.id from public.jemvoyage_permissions p where p.action = 'view'
        on conflict do nothing;
      elsif v_key = '*.manage' then
        insert into public.jemvoyage_role_permissions (role_id, permission_id)
        select v_rid, p.id from public.jemvoyage_permissions p where p.action = 'manage'
        on conflict do nothing;
      else
        insert into public.jemvoyage_role_permissions (role_id, permission_id)
        select v_rid, p.id from public.jemvoyage_permissions p where p.key = v_key
        on conflict do nothing;
      end if;
    end loop;
  end loop;
end;
$$;
