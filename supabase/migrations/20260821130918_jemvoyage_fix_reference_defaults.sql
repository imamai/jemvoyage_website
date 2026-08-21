-- JEMVOYAGE LTD — Fix: human reference generation must not require caller EXECUTE
--
-- Column DEFAULTs are evaluated as the INSERTING role. Because the grant
-- hardening migration revoked EXECUTE on jemvoyage_next_reference() from anon
-- and authenticated, every insert into a table whose reference column defaulted
-- to that function failed with 42501 — including the anonymous public enquiry
-- form, and every staff-created quote, booking, rental, invoice and payment.
--
-- Re-granting EXECUTE would fix it but would also let anyone burn the shared
-- sequence at will. Instead the reference is assigned by a SECURITY DEFINER
-- BEFORE INSERT trigger, which runs as the function owner, so the caller never
-- needs EXECUTE and the generator stays unreachable over the API.

create or replace function public.jemvoyage_set_reference()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_prefix text := tg_argv[0];
  v_column text := tg_argv[1];
  v_row    jsonb := to_jsonb(new);
begin
  if v_row ->> v_column is null or v_row ->> v_column = '' then
    v_row := jsonb_set(v_row, array[v_column],
                       to_jsonb(public.jemvoyage_next_reference(v_prefix)));
    new := jsonb_populate_record(new, v_row);
  end if;
  return new;
end;
$$;

revoke all on function public.jemvoyage_set_reference() from public, anon, authenticated;

do $$
declare
  r record;
begin
  for r in
    select * from (values
      ('jemvoyage_customers',         'reference',        'CU'),
      ('jemvoyage_leads',             'reference',        'LD'),
      ('jemvoyage_quotes',            'reference',        'QT'),
      ('jemvoyage_bookings',          'reference',        'BK'),
      ('jemvoyage_transfers',         'reference',        'TR'),
      ('jemvoyage_rentals',           'reference',        'RN'),
      ('jemvoyage_rental_agreements', 'agreement_number', 'AG'),
      ('jemvoyage_invoices',          'invoice_number',   'INV'),
      ('jemvoyage_payments',          'reference',        'PM'),
      ('jemvoyage_refunds',           'reference',        'RF'),
      ('jemvoyage_expenses',          'reference',        'EX'),
      ('jemvoyage_corporate_accounts','reference',        'CO'),
      ('jemvoyage_travel_agents',     'reference',        'TA')
    ) as t(tbl, col, prefix)
  loop
    execute format('alter table public.%I alter column %I drop default', r.tbl, r.col);
    execute format('drop trigger if exists trg_reference_%1$s on public.%1$I', r.tbl);
    execute format(
      'create trigger trg_reference_%1$s before insert on public.%1$I
         for each row execute function public.jemvoyage_set_reference(%2$L, %3$L)',
      r.tbl, r.prefix, r.col);
  end loop;
end $$;;
