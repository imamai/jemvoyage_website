-- JEMVOYAGE LTD — Demo catalogue: destinations, tours, activities, fleet
-- Idempotent. Content is illustrative and clearly generic: no awards,
-- certifications, partnerships or customer testimonials are invented (§70).
-- Reviews are deliberately NOT seeded — fabricating them is forbidden (§62),
-- so the reviews band stays dormant until real, moderated reviews exist.

-- --------------------------------------------------------- tour categories --
insert into public.jemvoyage_tour_categories (slug, name, description, display_order) values
  ('luxury-safari',  'Luxury Safari',   'Private conservancies, small camps and unhurried game viewing.', 10),
  ('family-safari',  'Family Safari',   'Paced and equipped for travelling with children.',               20),
  ('honeymoon',      'Honeymoon',       'Quiet camps, private dining and time to yourselves.',            30),
  ('wildlife',       'Wildlife',        'Classic game viewing across Kenya''s best-known parks.',         40),
  ('beach-safari',   'Beach & Safari',  'Plains first, Indian Ocean second.',                             50),
  ('photography',    'Photography',     'Built around light, hides and patient positioning.',             60),
  ('adventure',      'Adventure',       'Walking, hiking and the higher country.',                        70),
  ('fly-in',         'Fly-in Safari',   'Light aircraft between camps; more time on the ground.',         80),
  ('cultural',       'Cultural',        'Communities, craft and the country beyond the parks.',           90),
  ('group',          'Group & Private', 'Departures shaped around your own party.',                      100)
on conflict (slug) do update set name = excluded.name, description = excluded.description;

-- ------------------------------------------------------------ destinations --
insert into public.jemvoyage_destinations
  (slug, name, region, summary, description, hero_media_id, thumbnail_media_id,
   best_months, is_featured, status, display_order)
values
  ('maasai-mara','Maasai Mara','Narok','Open grassland, big cats and the river crossings of the Great Migration.',
   'The Maasai Mara is Kenya''s best-known reserve: rolling grassland broken by acacia and riverine forest, holding resident lion, cheetah and elephant year round. Between July and October the migration herds cross from the Serengeti, and the Mara River crossings draw travellers from around the world. Private conservancies on the reserve''s edge offer quieter game viewing, night drives and walking, which are not permitted inside the reserve itself.',
   (select id from public.jemvoyage_media where tags @> array['game-drive'] limit 1),
   (select id from public.jemvoyage_media where tags @> array['acacia'] limit 1),
   array[7,8,9,10]::smallint[], true, 'published', 10),

  ('amboseli','Amboseli','Kajiado','Large elephant herds beneath Kilimanjaro.',
   'Amboseli is a compact park of open pans and swamp fed by meltwater from Kilimanjaro, whose summit rises across the border in Tanzania. It is the most reliable place in Kenya to watch large, relaxed elephant herds at close range, and the short grass makes for uninterrupted views. Mornings are usually clearest for the mountain.',
   (select id from public.jemvoyage_media where tags @> array['amboseli'] limit 1),
   (select id from public.jemvoyage_media where tags @> array['amboseli'] limit 1),
   array[6,7,8,9,10]::smallint[], true, 'published', 20),

  ('tsavo','Tsavo','Coast Hinterland','Vast red-earth wilderness between Nairobi and the coast.',
   'Tsavo East and Tsavo West together form one of the largest protected areas in the world. Tsavo is defined by scale and by its red dust, which coats the elephants a distinctive ochre. Tsavo West is greener and more broken, with the Mzima Springs and volcanic hills; Tsavo East is flatter and more open. It sits conveniently between Nairobi and Diani.',
   (select id from public.jemvoyage_media where tags @> array['samburu'] limit 1),
   (select id from public.jemvoyage_media where tags @> array['samburu'] limit 1),
   array[6,7,8,9,1,2]::smallint[], true, 'published', 30),

  ('nairobi','Nairobi','Nairobi','A capital with a national park on its doorstep.',
   'Nairobi is where most journeys begin. The national park on the city''s southern edge holds rhino, lion and giraffe within sight of the skyline, and can be covered in a morning before a flight. The city itself is worth a day for its museums, markets and food.',
   (select id from public.jemvoyage_media where tags @> array['rhino'] limit 1),
   (select id from public.jemvoyage_media where tags @> array['rhino'] limit 1),
   array[1,2,6,7,8,9,10,12]::smallint[], false, 'published', 40),

  ('diani','Diani Beach','South Coast','White sand and reef-protected water south of Mombasa.',
   'Diani is a long stretch of white sand backed by coastal forest, with a reef a short distance offshore that keeps the water calm and clear. It works equally well as a few days'' rest after a safari or as a destination in its own right, with diving, kitesurfing and dhow trips all easily arranged.',
   (select id from public.jemvoyage_media where tags @> array['diani'] limit 1),
   (select id from public.jemvoyage_media where tags @> array['diani'] limit 1),
   array[1,2,3,7,8,9,10]::smallint[], true, 'published', 50),

  ('watamu','Watamu','North Coast','A marine national park, quiet bays and turtle nesting beaches.',
   'Watamu sits within a marine national park, which keeps the reef in good condition and the bays quiet. It is smaller and more low-key than Diani, with excellent snorkelling, the Mida Creek mangroves nearby and the Gede ruins a short drive inland.',
   (select id from public.jemvoyage_media where tags @> array['watamu'] limit 1),
   (select id from public.jemvoyage_media where tags @> array['watamu'] limit 1),
   array[1,2,3,10,11,12]::smallint[], false, 'published', 60),

  ('lamu','Lamu','Lamu Archipelago','A Swahili island town with no cars and a long history.',
   'Lamu Old Town is a UNESCO World Heritage Site and one of the oldest continuously inhabited settlements on the Swahili coast. There are no cars: transport is on foot, by donkey or by dhow. It suits travellers who want architecture, quiet and a slower pace rather than resort amenities.',
   (select id from public.jemvoyage_media where tags @> array['watamu'] limit 1),
   (select id from public.jemvoyage_media where tags @> array['watamu'] limit 1),
   array[1,2,6,7,8,9]::smallint[], false, 'published', 70),

  ('naivasha','Lake Naivasha','Rift Valley','A freshwater Rift Valley lake within easy reach of Nairobi.',
   'Naivasha is a freshwater lake ringed by fever trees and papyrus, with hippo in the shallows and a large resident bird population. Crescent Island can be walked, Hell''s Gate cycled, and the whole area is close enough to Nairobi for a short break or a first stop heading towards the Mara.',
   (select id from public.jemvoyage_media where tags @> array['hiking'] limit 1),
   (select id from public.jemvoyage_media where tags @> array['hiking'] limit 1),
   array[1,2,6,7,8,9,10]::smallint[], false, 'published', 80),

  ('lake-nakuru','Lake Nakuru','Rift Valley','A soda lake and rhino sanctuary in the Rift.',
   'Lake Nakuru National Park is fenced and functions as a rhino sanctuary, holding both black and white rhino, along with Rothschild''s giraffe and large numbers of waterbirds. Flamingo numbers vary considerably with water levels. Its compact size makes it a natural stop between Nairobi and the Mara.',
   (select id from public.jemvoyage_media where tags @> array['rhino'] limit 1),
   (select id from public.jemvoyage_media where tags @> array['rhino'] limit 1),
   array[6,7,8,9,10]::smallint[], false, 'published', 90),

  ('samburu','Samburu','Northern Kenya','Dry northern country and species found nowhere further south.',
   'Samburu lies north of the equator in hotter, drier country along the Ewaso Ng''iro river. It holds species you will not see in the southern parks — Grevy''s zebra, reticulated giraffe, gerenuk and Beisa oryx — and sees far fewer vehicles than the Mara.',
   (select id from public.jemvoyage_media where tags @> array['samburu'] limit 1),
   (select id from public.jemvoyage_media where tags @> array['samburu'] limit 1),
   array[6,7,8,9,10,1,2]::smallint[], true, 'published', 100)
on conflict (slug) do update set
  name = excluded.name, region = excluded.region, summary = excluded.summary,
  description = excluded.description, hero_media_id = excluded.hero_media_id,
  thumbnail_media_id = excluded.thumbnail_media_id, best_months = excluded.best_months,
  is_featured = excluded.is_featured, status = excluded.status,
  display_order = excluded.display_order;

-- --------------------------------------------------------------- activities --
insert into public.jemvoyage_activities (slug, name, summary, category, media_id, duration_minutes, difficulty, display_order) values
  ('game-drive','Game drive','Morning and afternoon drives with a guide in an open-sided vehicle.','wildlife',
   (select id from public.jemvoyage_media where tags @> array['game-drive'] limit 1), 210, 'easy', 10),
  ('balloon-safari','Balloon safari','A dawn flight over the plains, followed by breakfast on the ground.','wildlife',
   (select id from public.jemvoyage_media where tags @> array['acacia'] limit 1), 240, 'easy', 20),
  ('guided-walk','Guided bush walk','Walking with an armed guide, on foot and at close range.','adventure',
   (select id from public.jemvoyage_media where tags @> array['hiking'] limit 1), 180, 'moderate', 30),
  ('photographic-hide','Photographic hide','Time in a low hide positioned for morning and evening light.','photography',
   (select id from public.jemvoyage_media where tags @> array['photography'] limit 1), 180, 'easy', 40),
  ('snorkelling','Reef snorkelling','Guided snorkelling on the reef, by boat from the beach.','coast',
   (select id from public.jemvoyage_media where tags @> array['watamu'] limit 1), 150, 'easy', 50),
  ('dhow-sunset','Sunset dhow sail','A traditional dhow under sail as the light goes.','coast',
   (select id from public.jemvoyage_media where tags @> array['diani'] limit 1), 120, 'easy', 60),
  ('cultural-visit','Community visit','Time with a local community, arranged directly and paid fairly.','cultural',
   (select id from public.jemvoyage_media where tags @> array['family'] limit 1), 120, 'easy', 70),
  ('scenic-flight','Light aircraft transfer','Flying between camps rather than driving.','transport',
   (select id from public.jemvoyage_media where tags @> array['fly-in'] limit 1), 90, 'easy', 80)
on conflict (slug) do update set name = excluded.name, summary = excluded.summary, media_id = excluded.media_id;;
