-- JEMVOYAGE LTD — 0008 · CMS seed: placeholder media, hero, homepage, nav, settings
-- Idempotent. Every placeholder was visually inspected before selection; none is
-- referenced from code, all are replaceable from the admin CMS.

create unique index if not exists jemvoyage_media_external_uq
  on public.jemvoyage_media (external_url)
  where external_url is not null and deleted_at is null;

-- ---------------------------------------------------------------- media -----
insert into public.jemvoyage_media
  (external_url, title, alt_text, category, tags, is_placeholder, credit, license, source_url, focal_y)
values
  ('https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=2400&q=80',
   'Safari vehicle at sunset', 'A safari vehicle crossing open grassland beneath a burning sunset sky',
   'hero', array['safari','sunset','game-drive'], true, 'Unsplash', 'Unsplash License', 'https://unsplash.com/photos/1516426122078', 0.55),
  ('https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=2400&q=80',
   'Lone acacia at dusk', 'A solitary acacia tree silhouetted against a golden savannah sunset',
   'hero', array['savannah','acacia','sunset'], true, 'Unsplash', 'Unsplash License', 'https://unsplash.com/photos/1516026672322', 0.5),
  ('https://images.unsplash.com/photo-1547970810-dc1eac37d174?auto=format&fit=crop&w=1800&q=80',
   'Rhinos crossing a track', 'A rhino and calf crossing a dirt track in front of open bushland',
   'safaris', array['rhino','wildlife','big-five'], true, 'Unsplash', 'Unsplash License', 'https://unsplash.com/photos/1547970810', 0.5),
  ('https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1800&q=80',
   'Elephant in forest', 'A bull elephant emerging from dense green forest',
   'safaris', array['elephant','wildlife','forest'], true, 'Unsplash', 'Unsplash License', 'https://unsplash.com/photos/1549366021', 0.5),
  ('https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&w=1800&q=80',
   'Giraffe among acacia', 'A giraffe browsing beside acacia trees in warm evening light',
   'destinations', array['giraffe','samburu','tsavo'], true, 'Unsplash', 'Unsplash License', 'https://unsplash.com/photos/1523805009345', 0.5),
  ('https://images.unsplash.com/photo-1535941339077-2dd1c7963098?auto=format&fit=crop&w=1800&q=80',
   'Elephant on open plains', 'A large elephant walking across golden open plains',
   'destinations', array['elephant','amboseli','plains'], true, 'Unsplash', 'Unsplash License', 'https://unsplash.com/photos/1535941339077', 0.5),
  ('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=80',
   'Turquoise shoreline at sunrise', 'Gentle surf on white sand beneath a pastel sunrise sky',
   'destinations', array['beach','coast','diani'], true, 'Unsplash', 'Unsplash License', 'https://unsplash.com/photos/1507525428034', 0.5),
  ('https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1800&q=80',
   'Palms and thatched shade', 'Palm trees and a thatched parasol on a quiet white sand beach',
   'destinations', array['beach','watamu','coast'], true, 'Unsplash', 'Unsplash License', 'https://unsplash.com/photos/1519046904884', 0.5),
  ('https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1800&q=80',
   'Four-wheel drive on a desert track', 'A white four-wheel drive parked on a gravel track in open country',
   'vehicles', array['4x4','suv','self-drive'], true, 'Unsplash', 'Unsplash License', 'https://unsplash.com/photos/1533473359331', 0.5),
  ('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1800&q=80',
   'Executive sedan in motion', 'A dark executive sedan travelling along an open highway',
   'vehicles', array['executive','chauffeur','sedan'], true, 'Unsplash', 'Unsplash License', 'https://unsplash.com/photos/1503376780353', 0.5),
  ('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1800&q=80',
   'At the wheel at dusk', 'A driver at the steering wheel with city lights blurred beyond the windscreen',
   'vehicles', array['chauffeur','driver','transfer'], true, 'Unsplash', 'Unsplash License', 'https://unsplash.com/photos/1449965408869', 0.5),
  ('https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1800&q=80',
   'Compact hatchback', 'A compact blue hatchback parked on a quiet street',
   'vehicles', array['economy','compact','hatchback'], true, 'Unsplash', 'Unsplash License', 'https://unsplash.com/photos/1541899481282', 0.5),
  ('https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1800&q=80',
   'Compact car detail', 'The front three-quarter view of a compact red car',
   'vehicles', array['economy','sedan'], true, 'Unsplash', 'Unsplash License', 'https://unsplash.com/photos/1550355291', 0.5),
  ('https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1800&q=80',
   'Executive coupe', 'A blue executive coupe photographed from the side',
   'vehicles', array['executive','luxury'], true, 'Unsplash', 'Unsplash License', 'https://unsplash.com/photos/1502877338535', 0.5),
  ('https://images.unsplash.com/photo-1556388158-158ea5ccacbd?auto=format&fit=crop&w=1800&q=80',
   'Arrival on final approach', 'An aircraft on final approach above runway lights at dusk',
   'general', array['airport','transfer','arrival'], true, 'Unsplash', 'Unsplash License', 'https://unsplash.com/photos/1556388158', 0.5),
  ('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1800&q=80',
   'Above the clouds', 'An aircraft wing above a bank of sunlit cloud',
   'tours', array['fly-in','air','safari'], true, 'Unsplash', 'Unsplash License', 'https://unsplash.com/photos/1436491865332', 0.5),
  ('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1800&q=80',
   'Planning session', 'Two colleagues reviewing documents and a laptop across a desk',
   'corporate', array['corporate','business','planning'], true, 'Unsplash', 'Unsplash License', 'https://unsplash.com/photos/1454165804606', 0.5),
  ('https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1800&q=80',
   'Group at the shoreline', 'A large group standing together watching the sunset from the beach',
   'tours', array['family','group','sunset'], true, 'Unsplash', 'Unsplash License', 'https://unsplash.com/photos/1511895426328', 0.5),
  ('https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1800&q=80',
   'Villa and pool', 'A contemporary white villa with a private pool under clear skies',
   'lodging', array['luxury','honeymoon','villa'], true, 'Unsplash', 'Unsplash License', 'https://unsplash.com/photos/1613977257363', 0.5),
  ('https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1800&q=80',
   'Camera body', 'A digital SLR camera on a plain background',
   'activities', array['photography','safari'], true, 'Unsplash', 'Unsplash License', 'https://unsplash.com/photos/1502920917128', 0.5),
  ('https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1800&q=80',
   'Highland viewpoint', 'A lone figure on a rocky outcrop above sunlit mountain valleys',
   'activities', array['adventure','hiking','highlands'], true, 'Unsplash', 'Unsplash License', 'https://unsplash.com/photos/1469474968028', 0.5)
on conflict (external_url) where external_url is not null and deleted_at is null
do update set
  title = excluded.title,
  alt_text = excluded.alt_text,
  category = excluded.category,
  tags = excluded.tags,
  credit = excluded.credit,
  license = excluded.license;


-- ----------------------------------------------------------- hero slides -----
delete from public.jemvoyage_hero_slides where placement = 'home';

insert into public.jemvoyage_hero_slides
  (placement, eyebrow, headline, subheadline, desktop_media_id, mobile_media_id,
   overlay_style, overlay_opacity, cta_label, cta_url, secondary_cta_label, secondary_cta_url, display_order)
select
  'home',
  'Kenya & East Africa',
  'Your journey. Our expertise.',
  'Discover Kenya through unforgettable safaris, premium tours, seamless transfers and exceptional vehicle hire.',
  (select id from public.jemvoyage_media where tags @> array['game-drive'] limit 1),
  (select id from public.jemvoyage_media where tags @> array['acacia'] limit 1),
  'gradient-bottom', 0.5,
  'Explore tours', '/tours',
  'Hire a car', '/car-hire',
  1;


-- ----------------------------------------------------- homepage sections -----
insert into public.jemvoyage_homepage_sections
  (section_key, eyebrow, heading, subheading, cta_label, cta_url, layout, item_limit, display_order)
values
  ('featured_tours',     'Curated journeys',   'Featured tours',            'Hand-built itineraries across Kenya''s finest country.',            'View all tours',        '/tours',              'grid', 3, 10),
  ('signature_safaris',  'Into the wild',      'Signature safaris',         'Game drives, private conservancies and the Great Migration.',       'See safaris',           '/safaris',            'grid', 3, 20),
  ('car_hire',           'Drive yourself',     'Car hire across Kenya',     'Self-drive or chauffeur, from compacts to fully equipped 4x4s.',    'Browse the fleet',      '/car-hire',           'split', 4, 30),
  ('airport_transfers',  'Arrive at ease',     'Airport transfers',         'Met on arrival at JKIA, Wilson and Moi International.',             'Book a transfer',       '/airport-transfers',  'split', 1, 40),
  ('why_jemvoyage',      'Why travel with us', 'Why Jemvoyage',             'Local knowledge, owned fleet, and one team from enquiry to return.', null,                   null,                  'features', 4, 50),
  ('destinations',       'Where to go',        'Popular destinations',      'From the Mara plains to the Indian Ocean shoreline.',               'All destinations',      '/destinations',       'grid', 6, 60),
  ('experiences',        'Signature moments',  'Signature experiences',     'The details that turn a trip into something you retell for years.',  'Explore experiences',   '/tours',              'grid', 3, 70),
  ('luxury',             'Elevated travel',    'Luxury experiences',        'Private conservancies, fly-in camps and villas on the coast.',       'Discover luxury',       '/tours',              'split', 2, 80),
  ('reviews',            'In their words',     'What our travellers say',   'Verified reviews from completed Jemvoyage journeys.',               'Read reviews',          '/reviews',            'reviews', 3, 90),
  ('inspiration',        'Travel journal',     'Travel inspiration',        'Guides, seasons and practical advice from our planners.',           'Read the journal',      '/blog',               'grid', 3, 100),
  ('corporate',          'For business',       'Corporate travel',          'Account billing, approved users and executive transport.',          'Corporate solutions',   '/corporate-travel',   'split', 1, 110),
  ('plan_journey',       'Start here',         'Plan your journey',         'Tell us how you like to travel and we will shape the rest.',        'Plan my trip',          '/plan-your-trip',     'cta',  1, 120),
  ('newsletter',         'Stay in touch',      'Travel notes from Kenya',   'Occasional dispatches on seasons, openings and quiet offers.',       null,                    null,                  'newsletter', 1, 130)
on conflict (section_key) do update set
  eyebrow = excluded.eyebrow,
  heading = excluded.heading,
  subheading = excluded.subheading,
  cta_label = excluded.cta_label,
  cta_url = excluded.cta_url,
  layout = excluded.layout,
  item_limit = excluded.item_limit,
  display_order = excluded.display_order;

update public.jemvoyage_homepage_sections s
   set media_id = m.id
  from public.jemvoyage_media m
 where (s.section_key, true) in (
        ('car_hire', m.tags @> array['4x4']),
        ('airport_transfers', m.tags @> array['airport']),
        ('luxury', m.tags @> array['honeymoon']),
        ('corporate', m.tags @> array['corporate']),
        ('plan_journey', m.tags @> array['fly-in'])
      )
   and s.media_id is null;


-- ---------------------------------------------------------------- menus -----
insert into public.jemvoyage_menus (key, label) values
  ('primary', 'Primary navigation'),
  ('footer_explore', 'Footer — Explore'),
  ('footer_services', 'Footer — Services'),
  ('footer_company', 'Footer — Company')
on conflict (key) do update set label = excluded.label;

delete from public.jemvoyage_menu_items
 where menu_id in (select id from public.jemvoyage_menus
                    where key in ('primary','footer_explore','footer_services','footer_company'));

insert into public.jemvoyage_menu_items (menu_id, label, url, display_order)
select m.id, i.label, i.url, i.ord
from public.jemvoyage_menus m
join (values
  ('primary', 'Tours',             '/tours',              10),
  ('primary', 'Safaris',           '/safaris',            20),
  ('primary', 'Destinations',      '/destinations',       30),
  ('primary', 'Car hire',          '/car-hire',           40),
  ('primary', 'Transfers',         '/airport-transfers',  50),
  ('primary', 'Corporate',         '/corporate-travel',   60),
  ('primary', 'About',             '/about',              70),
  ('primary', 'Contact',           '/contact',            80),
  ('footer_explore', 'Tours',        '/tours',            10),
  ('footer_explore', 'Safaris',      '/safaris',          20),
  ('footer_explore', 'Destinations', '/destinations',     30),
  ('footer_explore', 'Offers',       '/offers',           40),
  ('footer_explore', 'Travel journal','/blog',            50),
  ('footer_services', 'Car hire',          '/car-hire',          10),
  ('footer_services', 'Chauffeur service', '/chauffeur-services',20),
  ('footer_services', 'Airport transfers', '/airport-transfers', 30),
  ('footer_services', 'Corporate travel',  '/corporate-travel',  40),
  ('footer_services', 'Travel agents',     '/travel-agents',     50),
  ('footer_company', 'About us',       '/about',   10),
  ('footer_company', 'Contact',        '/contact', 20),
  ('footer_company', 'Reviews',        '/reviews', 30),
  ('footer_company', 'FAQ',            '/faq',     40),
  ('footer_company', 'Plan your trip', '/plan-your-trip', 50)
) as i(menu_key, label, url, ord) on i.menu_key = m.key;


-- ------------------------------------------------------------- settings -----
insert into public.jemvoyage_settings (key, value, label, group_name, is_public) values
  ('site.name',        '"Jemvoyage"'::jsonb,                          'Site name',       'brand',   true),
  ('site.tagline',     '"Premium journeys across Kenya and East Africa"'::jsonb, 'Tagline', 'brand', true),
  ('site.description', '"Jemvoyage Ltd arranges premium safaris, tours, chauffeur services, airport transfers and vehicle hire across Kenya and East Africa."'::jsonb, 'Meta description', 'seo', true),
  ('contact.email',    '"reservations@jemvoyage.com"'::jsonb,         'Contact email',   'contact', true),
  ('contact.phone',    '"+254 700 000 000"'::jsonb,                   'Contact phone',   'contact', true),
  ('contact.whatsapp', '"+254 700 000 000"'::jsonb,                   'WhatsApp',        'contact', true),
  ('contact.address',  '"Nairobi, Kenya"'::jsonb,                     'Office address',  'contact', true),
  ('contact.hours',    '"Mon–Sat, 08:00–18:00 EAT"'::jsonb,           'Opening hours',   'contact', true),
  ('booking.currency', '"KES"'::jsonb,                                'Default currency','booking', true),
  ('social.instagram', '""'::jsonb,                                   'Instagram URL',   'social',  true),
  ('social.facebook',  '""'::jsonb,                                   'Facebook URL',    'social',  true),
  ('social.linkedin',  '""'::jsonb,                                   'LinkedIn URL',    'social',  true)
on conflict (key) do update set
  label = excluded.label,
  group_name = excluded.group_name,
  is_public = excluded.is_public;


-- ----------------------------------------------------------------- FAQs -----
insert into public.jemvoyage_faqs (question, answer, category, display_order) values
  ('How far in advance should I book a safari?',
   'For the Great Migration season (July to October) and the December holidays we recommend booking six to nine months ahead, as the best camps fill early. Outside those windows, six to eight weeks is usually comfortable.',
   'safaris', 10),
  ('Do I need a 4x4 to travel in Kenya?',
   'For main highways and city driving a saloon car is fine. For national parks, conservancies and unsealed roads a 4x4 is strongly recommended, and several parks require one during the rains.',
   'car-hire', 20),
  ('Can I hire a vehicle without a driver?',
   'Yes. We offer both self-drive and chauffeur-driven hire. Self-drive requires a valid licence held for at least two years, a passport or national ID, and a refundable security deposit.',
   'car-hire', 30),
  ('What is included in a Jemvoyage tour price?',
   'Every quotation itemises exactly what is included and excluded — typically accommodation, transport, park fees, activities and stated meals. Anything not listed as included is shown as an exclusion, so there are no surprises.',
   'booking', 40),
  ('How do I pay?',
   'We accept M-Pesa, card payment and bank transfer. Most bookings are confirmed with a deposit, with the balance due before travel. Your invoice states the exact schedule.',
   'payments', 50),
  ('Do you arrange airport transfers?',
   'Yes. We meet arrivals at Jomo Kenyatta International, Wilson and Moi International airports, monitor your flight for delays, and wait at no extra charge if you are held up.',
   'transfers', 60)
on conflict do nothing;


-- ------------------------------------------------------- blog categories -----
insert into public.jemvoyage_blog_categories (slug, name, description, display_order) values
  ('safari',       'Safari',       'Game viewing, seasons and wildlife.',            10),
  ('destinations', 'Destinations', 'Where to go across Kenya and East Africa.',      20),
  ('travel-tips',  'Travel tips',  'Practical advice for planning your journey.',    30),
  ('car-hire',     'Car hire',     'Driving, routes and vehicle guidance.',          40),
  ('luxury',       'Luxury',       'Elevated stays and private experiences.',        50),
  ('family',       'Family',       'Travelling with children.',                      60)
on conflict (slug) do update set name = excluded.name, description = excluded.description;;
