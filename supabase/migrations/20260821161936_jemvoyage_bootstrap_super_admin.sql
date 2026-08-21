-- JEMVOYAGE LTD — Bootstrap the first Super Admin
--
-- Chicken-and-egg: every admin screen requires a jemvoyage_users row plus a
-- role, but assigning roles itself requires users.manage. This seeds the first
-- administrator so the CMS is reachable; every subsequent role is assigned
-- through the UI and recorded by the audit trigger.
--
-- Resolved by EMAIL against an auth account that already exists — no generated
-- id is hardcoded, and no new auth user is created. Re-running is harmless.

do $$
declare
  v_bootstrap_email citext := 'imamai.w@gmail.com';
  v_user_id uuid;
  v_role_id uuid;
begin
  select id into v_user_id from auth.users where email = v_bootstrap_email;

  if v_user_id is null then
    raise notice 'No auth user for %; nothing to bootstrap.', v_bootstrap_email;
    return;
  end if;

  insert into public.jemvoyage_users (id, full_name, email, is_active)
  values (
    v_user_id,
    coalesce(
      (select nullif(trim(raw_user_meta_data ->> 'full_name'), '')
         from auth.users where id = v_user_id),
      split_part(v_bootstrap_email::text, '@', 1)
    ),
    v_bootstrap_email,
    true
  )
  on conflict (id) do update
    set is_active = true,
        deleted_at = null,
        email = excluded.email;

  select id into v_role_id from public.jemvoyage_roles where name = 'super_admin';

  insert into public.jemvoyage_user_roles (user_id, role_id)
  values (v_user_id, v_role_id)
  on conflict do nothing;

  raise notice 'Super Admin bootstrapped for %', v_bootstrap_email;
end $$;;
