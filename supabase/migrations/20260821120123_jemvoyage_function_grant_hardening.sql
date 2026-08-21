-- JEMVOYAGE LTD — 0006 · Lock down function EXECUTE grants
-- The database linter flagged every jemvoyage_ SECURITY DEFINER helper as
-- reachable over PostgREST at /rest/v1/rpc/<fn>. Trigger and internal helpers
-- have no business being callable at all; the RBAC predicates must stay
-- callable by `authenticated` because RLS policies evaluate them as the
-- querying role, but `anon` never needs them (no anon-facing policy calls one).

-- Internal / trigger-only: callable by nobody over the API.
revoke all on function public.jemvoyage_handle_new_user()          from public, anon, authenticated;
revoke all on function public.jemvoyage_set_updated_at()           from public, anon, authenticated;
revoke all on function public.jemvoyage_attach_touch(regclass)     from public, anon, authenticated;
revoke all on function public.jemvoyage_next_reference(text)       from public, anon, authenticated;

-- RBAC predicates: required by `authenticated` for RLS evaluation, denied to anon.
revoke all on function public.jemvoyage_has_role(text)             from public, anon;
revoke all on function public.jemvoyage_has_permission(text)       from public, anon;
revoke all on function public.jemvoyage_is_staff()                 from public, anon;
revoke all on function public.jemvoyage_is_super_admin()           from public, anon;
revoke all on function public.jemvoyage_my_permissions()           from public, anon;

grant execute on function public.jemvoyage_has_role(text)          to authenticated;
grant execute on function public.jemvoyage_has_permission(text)    to authenticated;
grant execute on function public.jemvoyage_is_staff()              to authenticated;
grant execute on function public.jemvoyage_is_super_admin()        to authenticated;
grant execute on function public.jemvoyage_my_permissions()        to authenticated;

-- Read-only utilities: harmless, but no reason to publish them.
revoke all on function public.jemvoyage_slugify(text)              from public, anon;
revoke all on function public.jemvoyage_resolve_media(uuid, text)  from public, anon;
grant execute on function public.jemvoyage_slugify(text)             to authenticated;
grant execute on function public.jemvoyage_resolve_media(uuid, text) to anon, authenticated;;
