# Jemvoyage migrations

Target project: **edos_websites** (`sedsjjmjnikppfaecaya`) — a SHARED Supabase
project that also hosts `margaret_*`, `kida_*`, `mejasan_*` and `emiwama_*`.

## Non-negotiable rules

1. Every relation, function, trigger, sequence and index is prefixed
   `jemvoyage_` (storage buckets use `jemvoyage-`).
2. Never create or `CREATE OR REPLACE` these unprefixed functions — they exist
   already and belong to other applications:
   `handle_new_user()`, `is_admin()`, `trigger_set_updated_at()`,
   `update_updated_at()`.
3. Never alter, drop or reference another app's tables, policies or buckets.
   Storage policies must be scoped by `bucket_id`.
4. `auth.users` already carries four other applications' signup triggers. The
   Jemvoyage trigger is gated on `raw_user_meta_data->>'app' = 'jemvoyage'` and
   swallows its own errors, so it can never roll back another app's signup.
5. Because two of those other triggers write `NOT NULL` profile columns from
   `coalesce(meta.full_name, email)`, Jemvoyage signups MUST always send a
   non-empty `full_name` and an email. Enforced in `src/lib/auth/service.ts`.
6. Filenames are timestamped so they sort after the legacy `0001`–`0021` series
   already applied to this project.

## Filenames must match applied versions

Migrations applied through the Supabase MCP tooling are versioned by the server
at apply time, not by local filename. Each file here has been renamed to the
version actually recorded in `supabase_migrations.schema_migrations`.

**Keep it that way.** If a local filename does not match a recorded version, the
CLI treats it as pending and `supabase db push` will try to re-run it. Several
of these migrations are not safe to re-run — `20260821115645` creates policies
without a preceding `DROP POLICY IF EXISTS`, so a second run errors.

Verify alignment at any time with `npm run db:list`.

## Applied order

| Version | Name | What it does |
|---|---|---|
| 20260821115246 | jemvoyage_extensions_and_helpers | Extensions, touch trigger, slug + reference helpers |
| 20260821115328 | jemvoyage_rbac | Users, roles, permissions, RLS, scoped signup trigger |
| 20260821115500 | jemvoyage_rbac_seed | 17 roles, 74 permissions, role→permission matrix |
| 20260821115645 | jemvoyage_media_and_cms | Media library, CMS pages, hero, homepage bands, menus, blog, FAQs, offers, SEO, settings |
| 20260821115717 | jemvoyage_storage_buckets | 6 buckets + scoped object policies |
| 20260821120123 | jemvoyage_function_grant_hardening | Revoke anon/public EXECUTE on jemvoyage functions |
| 20260821122742 | jemvoyage_media_external_url | `external_url` column for licensed placeholders |
| 20260821123740 | jemvoyage_cms_seed | Placeholder media, hero, 13 homepage bands, navigation, settings, FAQs |
| 20260821124226 | jemvoyage_home_why_points | "Why Jemvoyage" propositions as a CMS setting |
| 20260821125756 | jemvoyage_catalogue | Destinations, attractions, activities, tour categories, tours, itineraries, availability |
| 20260821125930 | jemvoyage_fleet | Vehicles, categories, features, images, rates, availability, maintenance, fuel, insurance, documents |
| 20260821130116 | jemvoyage_crm | Customers, preferences, lead sources, leads, sales activities, communications |
| 20260821130217 | jemvoyage_people_and_suppliers | Drivers, guides, driver assignments, suppliers, rates, contracts |
| 20260821130334 | jemvoyage_commerce | Quotes, quote items, version snapshots, bookings, booking items, travellers, transfers |
| 20260821130446 | jemvoyage_rentals | Rentals, agreements, deposits, extensions, inspections, damage reports, charges |
| 20260821130615 | jemvoyage_finance | Corporate accounts, travel agents, commissions, invoices, payments, payment events, refunds, expenses |
| 20260821130715 | jemvoyage_engagement_and_audit | Reviews, notification templates, notifications, audit log + triggers |
| 20260821130918 | jemvoyage_fix_reference_defaults | Reference generation moved from column DEFAULT to SECURITY DEFINER trigger |

## Design notes worth knowing

**Double booking is prevented by the database, not by application code.**
`jemvoyage_vehicle_availability` and `jemvoyage_driver_assignments` each carry a
GiST `EXCLUDE` constraint on `(id WITH =, period WITH &&)`, filtered to active
holds. Two concurrent transactions cannot both win — one is rejected outright.

**Human references are assigned by trigger, not by DEFAULT.** A column DEFAULT is
evaluated as the *inserting* role, so a locked-down generator function breaks
every insert. `jemvoyage_set_reference()` is a SECURITY DEFINER BEFORE INSERT
trigger, so callers never need EXECUTE on the generator and it stays unreachable
over the API. Do not reintroduce `DEFAULT jemvoyage_next_reference(...)`.

**Anonymous inserts must not use `RETURNING`.** The public enquiry form can
INSERT into `jemvoyage_leads` but has no SELECT policy, by design. In
supabase-js, call `.insert(...)` without a chained `.select()`, or the request
fails with 42501.

**The audit log has no write policy.** `jemvoyage_audit_logs` exposes SELECT
only; rows arrive exclusively via the SECURITY DEFINER audit trigger, so history
cannot be altered or erased through the API.

## Still to build

TypeScript types in `src/lib/db/types.ts` currently cover the 18 RBAC/CMS tables
the site uses today. The remaining 64 tables need types added as each module's
UI is built.
