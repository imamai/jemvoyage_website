-- JEMVOYAGE LTD — 0005 · Storage buckets & object policies
-- Every policy below is scoped with `bucket_id like 'jemvoyage-%'`, so none of
-- the 18 pre-existing buckets owned by other apps is affected in any way.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('jemvoyage-media',              'jemvoyage-media',              true,   52428800,
     array['image/jpeg','image/png','image/webp','image/avif','image/svg+xml','video/mp4']),
  ('jemvoyage-tour-media',         'jemvoyage-tour-media',         true,  104857600,
     array['image/jpeg','image/png','image/webp','image/avif','video/mp4','video/webm']),
  ('jemvoyage-vehicle-images',     'jemvoyage-vehicle-images',     true,   26214400,
     array['image/jpeg','image/png','image/webp','image/avif']),
  ('jemvoyage-rental-inspections', 'jemvoyage-rental-inspections', false,  26214400,
     array['image/jpeg','image/png','image/webp','image/heic','application/pdf']),
  ('jemvoyage-documents',          'jemvoyage-documents',          false,  52428800,
     array['application/pdf','image/jpeg','image/png','application/msword',
           'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  ('jemvoyage-customer-documents', 'jemvoyage-customer-documents', false,  26214400,
     array['application/pdf','image/jpeg','image/png','image/heic'])
on conflict (id) do nothing;

-- --- Public marketing buckets: world-readable, staff-writable ----------------
drop policy if exists jemvoyage_storage_public_read  on storage.objects;
drop policy if exists jemvoyage_storage_media_write  on storage.objects;

create policy jemvoyage_storage_public_read on storage.objects
  for select to anon, authenticated
  using (bucket_id in ('jemvoyage-media','jemvoyage-tour-media','jemvoyage-vehicle-images'));

create policy jemvoyage_storage_media_write on storage.objects
  for all to authenticated
  using (
    bucket_id in ('jemvoyage-media','jemvoyage-tour-media','jemvoyage-vehicle-images')
    and public.jemvoyage_has_permission('media.manage')
  )
  with check (
    bucket_id in ('jemvoyage-media','jemvoyage-tour-media','jemvoyage-vehicle-images')
    and public.jemvoyage_has_permission('media.manage')
  );

-- --- Private operational buckets: never anon, never public URLs --------------
drop policy if exists jemvoyage_storage_inspections on storage.objects;
create policy jemvoyage_storage_inspections on storage.objects
  for all to authenticated
  using (bucket_id = 'jemvoyage-rental-inspections' and public.jemvoyage_has_permission('rentals.view'))
  with check (bucket_id = 'jemvoyage-rental-inspections' and public.jemvoyage_has_permission('rentals.manage'));

drop policy if exists jemvoyage_storage_documents on storage.objects;
create policy jemvoyage_storage_documents on storage.objects
  for all to authenticated
  using (bucket_id = 'jemvoyage-documents' and public.jemvoyage_is_staff())
  with check (bucket_id = 'jemvoyage-documents' and public.jemvoyage_is_staff());

-- Customer documents: a customer may read and upload only under their own
-- uid-prefixed folder; staff with customers.view may read everything.
drop policy if exists jemvoyage_storage_customer_docs_own   on storage.objects;
drop policy if exists jemvoyage_storage_customer_docs_staff on storage.objects;

create policy jemvoyage_storage_customer_docs_own on storage.objects
  for all to authenticated
  using (
    bucket_id = 'jemvoyage-customer-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'jemvoyage-customer-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy jemvoyage_storage_customer_docs_staff on storage.objects
  for select to authenticated
  using (bucket_id = 'jemvoyage-customer-documents' and public.jemvoyage_has_permission('customers.view'));;
