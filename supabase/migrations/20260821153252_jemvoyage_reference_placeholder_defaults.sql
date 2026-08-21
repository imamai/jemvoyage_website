-- JEMVOYAGE LTD — Make trigger-filled reference columns optional on INSERT
--
-- These columns are NOT NULL and are populated by the SECURITY DEFINER
-- BEFORE INSERT trigger jemvoyage_set_reference(). Because they carry no column
-- DEFAULT, the Supabase type generator marks them REQUIRED on insert — so
-- typed clients are forced to invent a value the trigger is about to replace.
--
-- Giving them an empty-string default fixes the type surface without
-- reintroducing the original bug: the default is a constant, so it needs no
-- EXECUTE grant on jemvoyage_next_reference(), and the trigger already treats
-- '' exactly like NULL and overwrites it. Uniqueness is still evaluated against
-- the final trigger-assigned value, never against ''.

do $$
declare
  r record;
begin
  for r in
    select * from (values
      ('jemvoyage_customers',         'reference'),
      ('jemvoyage_leads',             'reference'),
      ('jemvoyage_quotes',            'reference'),
      ('jemvoyage_bookings',          'reference'),
      ('jemvoyage_transfers',         'reference'),
      ('jemvoyage_rentals',           'reference'),
      ('jemvoyage_rental_agreements', 'agreement_number'),
      ('jemvoyage_invoices',          'invoice_number'),
      ('jemvoyage_payments',          'reference'),
      ('jemvoyage_refunds',           'reference'),
      ('jemvoyage_expenses',          'reference'),
      ('jemvoyage_corporate_accounts','reference'),
      ('jemvoyage_travel_agents',     'reference')
    ) as t(tbl, col)
  loop
    execute format('alter table public.%I alter column %I set default %L', r.tbl, r.col, '');
  end loop;
end $$;

-- Guard: an empty reference must never survive to the table. If the trigger is
-- ever dropped, writes fail loudly rather than silently storing blanks.
do $$
declare
  r record;
begin
  for r in
    select * from (values
      ('jemvoyage_customers',         'reference'),
      ('jemvoyage_leads',             'reference'),
      ('jemvoyage_quotes',            'reference'),
      ('jemvoyage_bookings',          'reference'),
      ('jemvoyage_transfers',         'reference'),
      ('jemvoyage_rentals',           'reference'),
      ('jemvoyage_rental_agreements', 'agreement_number'),
      ('jemvoyage_invoices',          'invoice_number'),
      ('jemvoyage_payments',          'reference'),
      ('jemvoyage_refunds',           'reference'),
      ('jemvoyage_expenses',          'reference'),
      ('jemvoyage_corporate_accounts','reference'),
      ('jemvoyage_travel_agents',     'reference')
    ) as t(tbl, col)
  loop
    execute format(
      'alter table public.%1$I drop constraint if exists %2$I',
      r.tbl, r.tbl || '_' || r.col || '_not_blank');
    execute format(
      'alter table public.%1$I add constraint %2$I check (length(%3$I) > 0)',
      r.tbl, r.tbl || '_' || r.col || '_not_blank', r.col);
  end loop;
end $$;;
