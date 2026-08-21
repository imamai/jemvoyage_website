-- JEMVOYAGE LTD — 0001 · Extensions & shared helpers
-- Scope: Jemvoyage only. Creates nothing outside the `jemvoyage_` namespace.
-- The unprefixed helpers already in this database and owned by other apps --
-- handle_new_user(), is_admin(), trigger_set_updated_at(), update_updated_at()
-- are NEVER created, replaced or dropped here.

create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";
create extension if not exists "citext";
create extension if not exists "pg_trgm";

create or replace function public.jemvoyage_set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

comment on function public.jemvoyage_set_updated_at() is
  'Jemvoyage: stamps updated_at on UPDATE. Attached via jemvoyage_attach_touch().';

create or replace function public.jemvoyage_attach_touch(p_table regclass)
returns void
language plpgsql
set search_path = public
as $$
declare
  v_name text := 'trg_touch_' || replace(p_table::text, 'public.', '');
begin
  execute format('drop trigger if exists %I on %s', v_name, p_table);
  execute format(
    'create trigger %I before update on %s for each row execute function public.jemvoyage_set_updated_at()',
    v_name, p_table
  );
end;
$$;

create sequence if not exists public.jemvoyage_reference_seq;

create or replace function public.jemvoyage_next_reference(p_kind text)
returns text
language sql
volatile
set search_path = public
as $$
  select 'JV-' || upper(p_kind) || '-' || to_char(now(), 'YYYY') || '-'
         || lpad(nextval('public.jemvoyage_reference_seq')::text, 6, '0');
$$;

comment on function public.jemvoyage_next_reference(text) is
  'Jemvoyage: human-facing references, e.g. jemvoyage_next_reference(''QT'') -> JV-QT-2026-000042.';

create or replace function public.jemvoyage_slugify(p_input text)
returns text
language sql
immutable
set search_path = public
as $$
  select trim(both '-' from
    regexp_replace(lower(coalesce(p_input, '')), '[^a-z0-9]+', '-', 'g')
  );
$$;;
