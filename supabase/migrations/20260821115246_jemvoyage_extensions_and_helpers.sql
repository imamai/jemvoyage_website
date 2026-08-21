-- =============================================================================
-- JEMVOYAGE LTD — 0001 · Extensions & shared helpers
-- =============================================================================
-- Project : edos_websites (sedsjjmjnikppfaecaya)
-- Scope   : Jemvoyage only. Creates nothing outside the `jemvoyage_` namespace.
--
-- IMPORTANT — shared-project rules observed by every Jemvoyage migration:
--   * Every relation, function, trigger and bucket is prefixed `jemvoyage_`.
--   * The unprefixed helpers already living in this database and owned by other
--     applications -- handle_new_user(), is_admin(), trigger_set_updated_at(),
--     update_updated_at() -- are NEVER created, replaced or dropped here.
--   * No table, policy, function or bucket belonging to margaret_*, kida_*,
--     mejasan_* or emiwama_* is read, altered or dropped.
-- =============================================================================

create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";
create extension if not exists "citext";
create extension if not exists "pg_trgm";


-- -----------------------------------------------------------------------------
-- updated_at maintenance
-- -----------------------------------------------------------------------------
-- Deliberately named with the jemvoyage_ prefix. `update_updated_at()` and
-- `trigger_set_updated_at()` already exist in public and belong to other apps;
-- redefining either would hijack their triggers.
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


-- Convenience installer so every table gets an identical touch trigger.
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


-- -----------------------------------------------------------------------------
-- Reference generator  (JV-QT-2026-000123 style)
-- -----------------------------------------------------------------------------
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


-- -----------------------------------------------------------------------------
-- Slug helper — used by tours, destinations, blog posts, CMS pages
-- -----------------------------------------------------------------------------
create or replace function public.jemvoyage_slugify(p_input text)
returns text
language sql
immutable
set search_path = public
as $$
  select trim(both '-' from
    regexp_replace(lower(coalesce(p_input, '')), '[^a-z0-9]+', '-', 'g')
  );
$$;
