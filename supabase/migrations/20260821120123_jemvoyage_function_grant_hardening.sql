-- =============================================================================
-- JEMVOYAGE LTD — 0006 · Lock down function EXECUTE grants
-- =============================================================================
-- The Supabase database linter flagged every jemvoyage_ SECURITY DEFINER helper
-- as reachable over PostgREST at /rest/v1/rpc/<fn>. Trigger and internal helpers
-- have no business being callable at all. The RBAC predicates MUST stay callable
-- by `authenticated`, because RLS policies evaluate them as the querying role --
-- revoking that would break every Jemvoyage policy. `anon` never needs them:
-- no anon-facing Jemvoyage policy calls one.
--
-- Touches only jemvoyage_ functions. The unprefixed helpers owned by other apps
-- (handle_new_user, is_admin, update_updated_at, trigger_set_updated_at) and the
-- kida_/margaret_/mejasan_ helpers are deliberately left exactly as they are.
-- =============================================================================

-- Internal / trigger-only: callable by nobody over the API.
revoke all on function public.jemvoyage_handle_new_user()      from public, anon, authenticated;
revoke all on function public.jemvoyage_set_updated_at()       from public, anon, authenticated;
revoke all on function public.jemvoyage_attach_touch(regclass) from public, anon, authenticated;
revoke all on function public.jemvoyage_next_reference(text)   from public, anon, authenticated;

-- RBAC predicates: required by `authenticated` for RLS evaluation, denied to anon.
revoke all on function public.jemvoyage_has_role(text)       from public, anon;
revoke all on function public.jemvoyage_has_permission(text) from public, anon;
revoke all on function public.jemvoyage_is_staff()           from public, anon;
revoke all on function public.jemvoyage_is_super_admin()     from public, anon;
revoke all on function public.jemvoyage_my_permissions()     from public, anon;

grant execute on function public.jemvoyage_has_role(text)       to authenticated;
grant execute on function public.jemvoyage_has_permission(text) to authenticated;
grant execute on function public.jemvoyage_is_staff()           to authenticated;
grant execute on function public.jemvoyage_is_super_admin()     to authenticated;
grant execute on function public.jemvoyage_my_permissions()     to authenticated;

-- Read-only utilities. jemvoyage_resolve_media stays anon-callable because the
-- public website needs placeholder fallback while signed out.
revoke all on function public.jemvoyage_slugify(text)             from public, anon;
revoke all on function public.jemvoyage_resolve_media(uuid, text) from public, anon;
grant execute on function public.jemvoyage_slugify(text)             to authenticated;
grant execute on function public.jemvoyage_resolve_media(uuid, text) to anon, authenticated;
