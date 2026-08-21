-- JEMVOYAGE LTD — Move Super Admin onto a dedicated operations account
--
-- The bootstrap grant sat on a personal address. Super Admin can read every
-- Jemvoyage customer, booking and payment record, so it belongs on a role
-- account that can be rotated or revoked without touching someone's personal
-- login. Resolved by email; creates no auth users.
--
-- Note: admin@jemvoyage.com already carries the `customer` role, assigned
-- automatically by jemvoyage_handle_new_user() at signup. That is replaced
-- here rather than added to.

do $$
declare
  v_admin_email    citext := 'admin@jemvoyage.com';
  v_previous_email citext := 'imamai.w@gmail.com';
  v_admin_id uuid;
  v_prev_id  uuid;
  v_role_id  uuid;
begin
  select id into v_role_id from public.jemvoyage_roles where name = 'super_admin';
  select id into v_admin_id from auth.users where email = v_admin_email;

  if v_admin_id is null then
    raise exception 'No auth user for %. Create it before running this.', v_admin_email;
  end if;

  insert into public.jemvoyage_users (id, full_name, email, job_title, is_active)
  values (v_admin_id, 'Jemvoyage Administrator', v_admin_email, 'System Administrator', true)
  on conflict (id) do update
    set full_name  = excluded.full_name,
        email      = excluded.email,
        job_title  = excluded.job_title,
        is_active  = true,
        deleted_at = null;

  delete from public.jemvoyage_user_roles where user_id = v_admin_id;

  insert into public.jemvoyage_user_roles (user_id, role_id)
  values (v_admin_id, v_role_id);

  -- Withdraw the bootstrap grant from the personal account. Its jemvoyage_users
  -- row is kept (so audit references stay intact) but deactivated, which both
  -- jemvoyage_is_staff() and jemvoyage_has_permission() check.
  select id into v_prev_id from auth.users where email = v_previous_email;

  if v_prev_id is not null then
    delete from public.jemvoyage_user_roles where user_id = v_prev_id;
    update public.jemvoyage_users set is_active = false where id = v_prev_id;
  end if;
end $$;;
