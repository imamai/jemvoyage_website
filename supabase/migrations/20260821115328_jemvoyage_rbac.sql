-- JEMVOYAGE LTD — 0002 · Identity, roles & permissions

create table if not exists public.jemvoyage_users (
  id              uuid primary key references auth.users(id) on delete cascade,
  full_name       text        not null,
  email           citext,
  phone           text,
  avatar_media_id uuid,
  job_title       text,
  bio             text,
  locale          text        not null default 'en',
  timezone        text        not null default 'Africa/Nairobi',
  is_active       boolean     not null default true,
  last_seen_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  created_by      uuid references auth.users(id) on delete set null,
  updated_by      uuid references auth.users(id) on delete set null,
  deleted_at      timestamptz
);

create index if not exists jemvoyage_users_email_idx     on public.jemvoyage_users (email) where deleted_at is null;
create index if not exists jemvoyage_users_active_idx    on public.jemvoyage_users (is_active) where deleted_at is null;
create index if not exists jemvoyage_users_name_trgm_idx on public.jemvoyage_users using gin (full_name gin_trgm_ops);

select public.jemvoyage_attach_touch('public.jemvoyage_users');

create table if not exists public.jemvoyage_roles (
  id            uuid primary key default gen_random_uuid(),
  name          text        not null unique,
  label         text        not null,
  description   text,
  is_staff      boolean     not null default true,
  is_system     boolean     not null default false,
  display_order integer     not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table if not exists public.jemvoyage_permissions (
  id          uuid primary key default gen_random_uuid(),
  key         text not null unique,
  resource    text not null,
  action      text not null,
  label       text not null,
  description text,
  created_at  timestamptz not null default now()
);

create index if not exists jemvoyage_permissions_resource_idx on public.jemvoyage_permissions (resource);

create table if not exists public.jemvoyage_role_permissions (
  role_id       uuid not null references public.jemvoyage_roles(id)       on delete cascade,
  permission_id uuid not null references public.jemvoyage_permissions(id) on delete cascade,
  created_at    timestamptz not null default now(),
  primary key (role_id, permission_id)
);

create table if not exists public.jemvoyage_user_roles (
  user_id     uuid not null references public.jemvoyage_users(id) on delete cascade,
  role_id     uuid not null references public.jemvoyage_roles(id) on delete cascade,
  assigned_at timestamptz not null default now(),
  assigned_by uuid references auth.users(id) on delete set null,
  primary key (user_id, role_id)
);

create index if not exists jemvoyage_user_roles_role_idx on public.jemvoyage_user_roles (role_id);

select public.jemvoyage_attach_touch('public.jemvoyage_roles');

create or replace function public.jemvoyage_has_role(p_role text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1
    from public.jemvoyage_user_roles ur
    join public.jemvoyage_roles r on r.id = ur.role_id
    join public.jemvoyage_users u on u.id = ur.user_id
    where ur.user_id = auth.uid() and r.name = p_role and u.is_active and u.deleted_at is null
  );
$$;

create or replace function public.jemvoyage_is_super_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select public.jemvoyage_has_role('super_admin');
$$;

create or replace function public.jemvoyage_is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1
    from public.jemvoyage_user_roles ur
    join public.jemvoyage_roles r on r.id = ur.role_id
    join public.jemvoyage_users u on u.id = ur.user_id
    where ur.user_id = auth.uid() and r.is_staff and u.is_active and u.deleted_at is null
  );
$$;

create or replace function public.jemvoyage_has_permission(p_key text)
returns boolean language sql stable security definer set search_path = public as $$
  select public.jemvoyage_is_super_admin() or exists (
    select 1
    from public.jemvoyage_user_roles ur
    join public.jemvoyage_role_permissions rp on rp.role_id = ur.role_id
    join public.jemvoyage_permissions p on p.id = rp.permission_id
    join public.jemvoyage_users u on u.id = ur.user_id
    where ur.user_id = auth.uid() and p.key = p_key and u.is_active and u.deleted_at is null
  );
$$;

create or replace function public.jemvoyage_my_permissions()
returns setof text language sql stable security definer set search_path = public as $$
  select distinct p.key
  from public.jemvoyage_user_roles ur
  join public.jemvoyage_role_permissions rp on rp.role_id = ur.role_id
  join public.jemvoyage_permissions p on p.id = rp.permission_id
  where ur.user_id = auth.uid();
$$;

create or replace function public.jemvoyage_handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_role_id uuid;
begin
  if coalesce(new.raw_user_meta_data ->> 'app', '') <> 'jemvoyage' then
    return new;
  end if;

  begin
    insert into public.jemvoyage_users (id, full_name, email, phone)
    values (
      new.id,
      coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), new.email, 'Jemvoyage Guest'),
      new.email,
      new.raw_user_meta_data ->> 'phone'
    )
    on conflict (id) do nothing;

    select id into v_role_id from public.jemvoyage_roles where name = 'customer';
    if v_role_id is not null then
      insert into public.jemvoyage_user_roles (user_id, role_id)
      values (new.id, v_role_id)
      on conflict do nothing;
    end if;
  exception when others then
    null;
  end;

  return new;
end;
$$;

drop trigger if exists jemvoyage_on_auth_user_created on auth.users;
create trigger jemvoyage_on_auth_user_created
  after insert on auth.users
  for each row execute function public.jemvoyage_handle_new_user();

alter table public.jemvoyage_users            enable row level security;
alter table public.jemvoyage_roles            enable row level security;
alter table public.jemvoyage_permissions      enable row level security;
alter table public.jemvoyage_role_permissions enable row level security;
alter table public.jemvoyage_user_roles       enable row level security;

drop policy if exists jemvoyage_users_select_self  on public.jemvoyage_users;
drop policy if exists jemvoyage_users_update_self  on public.jemvoyage_users;
drop policy if exists jemvoyage_users_insert_admin on public.jemvoyage_users;
drop policy if exists jemvoyage_users_delete_admin on public.jemvoyage_users;

create policy jemvoyage_users_select_self on public.jemvoyage_users
  for select to authenticated
  using (id = auth.uid() or public.jemvoyage_has_permission('users.view'));

create policy jemvoyage_users_update_self on public.jemvoyage_users
  for update to authenticated
  using (id = auth.uid() or public.jemvoyage_has_permission('users.manage'))
  with check (id = auth.uid() or public.jemvoyage_has_permission('users.manage'));

create policy jemvoyage_users_insert_admin on public.jemvoyage_users
  for insert to authenticated
  with check (public.jemvoyage_has_permission('users.manage'));

create policy jemvoyage_users_delete_admin on public.jemvoyage_users
  for delete to authenticated
  using (public.jemvoyage_is_super_admin());

drop policy if exists jemvoyage_roles_select_staff on public.jemvoyage_roles;
drop policy if exists jemvoyage_roles_write_admin  on public.jemvoyage_roles;

create policy jemvoyage_roles_select_staff on public.jemvoyage_roles
  for select to authenticated using (public.jemvoyage_is_staff());
create policy jemvoyage_roles_write_admin on public.jemvoyage_roles
  for all to authenticated
  using (public.jemvoyage_has_permission('users.manage'))
  with check (public.jemvoyage_has_permission('users.manage'));

drop policy if exists jemvoyage_permissions_select_staff on public.jemvoyage_permissions;
drop policy if exists jemvoyage_permissions_write_admin  on public.jemvoyage_permissions;

create policy jemvoyage_permissions_select_staff on public.jemvoyage_permissions
  for select to authenticated using (public.jemvoyage_is_staff());
create policy jemvoyage_permissions_write_admin on public.jemvoyage_permissions
  for all to authenticated
  using (public.jemvoyage_is_super_admin())
  with check (public.jemvoyage_is_super_admin());

drop policy if exists jemvoyage_role_permissions_select_staff on public.jemvoyage_role_permissions;
drop policy if exists jemvoyage_role_permissions_write_admin  on public.jemvoyage_role_permissions;

create policy jemvoyage_role_permissions_select_staff on public.jemvoyage_role_permissions
  for select to authenticated using (public.jemvoyage_is_staff());
create policy jemvoyage_role_permissions_write_admin on public.jemvoyage_role_permissions
  for all to authenticated
  using (public.jemvoyage_has_permission('users.manage'))
  with check (public.jemvoyage_has_permission('users.manage'));

drop policy if exists jemvoyage_user_roles_select_self on public.jemvoyage_user_roles;
drop policy if exists jemvoyage_user_roles_write_admin on public.jemvoyage_user_roles;

create policy jemvoyage_user_roles_select_self on public.jemvoyage_user_roles
  for select to authenticated
  using (user_id = auth.uid() or public.jemvoyage_has_permission('users.view'));
create policy jemvoyage_user_roles_write_admin on public.jemvoyage_user_roles
  for all to authenticated
  using (public.jemvoyage_has_permission('users.manage'))
  with check (public.jemvoyage_has_permission('users.manage'));;
