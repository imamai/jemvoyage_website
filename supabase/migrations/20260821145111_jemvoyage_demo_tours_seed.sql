-- JEMVOYAGE LTD — Demo tours + itineraries
-- Prices are indicative placeholders for development. Jemvoyage sets real
-- pricing in the CMS before launch.

insert into public.jemvoyage_tours
  (slug, title, subtitle, category_id, primary_destination_id, summary, description,
   duration_days, duration_nights, price_from, currency, price_basis,
   min_travellers, max_travellers, accommodation_summary, transport_summary, meals_summary,
   inclusions, exclusions, difficulty, best_months,
   primary_media_id, thumbnail_media_id, is_featured, status, published_at, display_order)
values
  ('3-day-maasai-mara-safari','3-Day Maasai Mara Safari','The classic short Mara itinerary',
   (select id from public.jemvoyage_tour_categories where slug='wildlife'),
   (select id from public.jemvoyage_destinations where slug='maasai-mara'),
   'Three days in the Mara with morning and afternoon game drives, road transfer from Nairobi.',
   'The shortest itinerary that still gives you real time in the reserve. You leave Nairobi after breakfast, arrive in the Mara for a late afternoon drive, then have a full day to work the reserve properly before returning on the third morning. Suited to travellers who are short on time but want more than a rushed overnight.',
   3,2,68000,'KES','per_person',2,6,'Tented camp, en-suite','4x4 safari vehicle with pop-up roof','Full board on safari',
   array['Park entry fees','Full board accommodation','4x4 vehicle and driver-guide','Game drives as scheduled','Drinking water in the vehicle'],
   array['International flights','Visa fees','Travel insurance','Drinks and gratuities','Optional balloon safari'],
   'easy', array[7,8,9,10]::smallint[],
   (select id from public.jemvoyage_media where tags @> array['game-drive'] limit 1),
   (select id from public.jemvoyage_media where tags @> array['game-drive'] limit 1),
   true,'published', now(), 10),

  ('5-day-mara-nakuru-explorer','5-Day Mara & Nakuru Explorer','Two parks, one unhurried loop',
   (select id from public.jemvoyage_tour_categories where slug='wildlife'),
   (select id from public.jemvoyage_destinations where slug='maasai-mara'),
   'The Mara for big cats and Lake Nakuru for rhino, linked by the Rift Valley escarpment.',
   'A five-day loop pairing the Mara''s open grassland with the fenced rhino sanctuary at Lake Nakuru. The drive between them runs along the Rift Valley escarpment, which is worth the time in its own right. Good balance of game viewing and variety without a punishing schedule.',
   5,4,132000,'KES','per_person',2,6,'Tented camp and lodge','4x4 safari vehicle with pop-up roof','Full board on safari',
   array['Park entry fees','Full board accommodation','4x4 vehicle and driver-guide','All game drives','Drinking water in the vehicle'],
   array['International flights','Visa fees','Travel insurance','Drinks and gratuities'],
   'easy', array[6,7,8,9,10]::smallint[],
   (select id from public.jemvoyage_media where tags @> array['rhino'] limit 1),
   (select id from public.jemvoyage_media where tags @> array['rhino'] limit 1),
   true,'published', now(), 20),

  ('4-day-amboseli-tsavo','4-Day Amboseli & Tsavo','Elephants beneath the mountain',
   (select id from public.jemvoyage_tour_categories where slug='wildlife'),
   (select id from public.jemvoyage_destinations where slug='amboseli'),
   'Amboseli for elephant herds and Kilimanjaro views, then Tsavo West on the way back.',
   'Amboseli gives the most reliable close-range elephant viewing in Kenya, with Kilimanjaro behind them on a clear morning. Tsavo West adds greener, more broken country and the Mzima Springs. A natural pairing, and an easy one if you are continuing to the coast.',
   4,3,96000,'KES','per_person',2,6,'Lodge, en-suite','4x4 safari vehicle with pop-up roof','Full board on safari',
   array['Park entry fees','Full board accommodation','4x4 vehicle and driver-guide','All game drives'],
   array['International flights','Visa fees','Travel insurance','Drinks and gratuities'],
   'easy', array[6,7,8,9,10]::smallint[],
   (select id from public.jemvoyage_media where tags @> array['amboseli'] limit 1),
   (select id from public.jemvoyage_media where tags @> array['amboseli'] limit 1),
   true,'published', now(), 30),

  ('7-day-kenya-highlights','7-Day Kenya Highlights','The country in one week',
   (select id from public.jemvoyage_tour_categories where slug='group'),
   (select id from public.jemvoyage_destinations where slug='maasai-mara'),
   'Naivasha, Nakuru and the Mara across seven days, at a pace that still allows rest.',
   'A week is enough to see the Rift Valley lakes and the Mara without spending every day in transit. This itinerary builds in a lighter day at Naivasha in the middle, which most travellers appreciate more than they expect.',
   7,6,186000,'KES','per_person',2,7,'Lodge and tented camp','4x4 safari vehicle with pop-up roof','Full board on safari',
   array['Park entry fees','Full board accommodation','4x4 vehicle and driver-guide','All game drives','Boat trip at Naivasha'],
   array['International flights','Visa fees','Travel insurance','Drinks and gratuities'],
   'easy', array[1,2,6,7,8,9,10]::smallint[],
   (select id from public.jemvoyage_media where tags @> array['acacia'] limit 1),
   (select id from public.jemvoyage_media where tags @> array['acacia'] limit 1),
   true,'published', now(), 40),

  ('6-day-samburu-laikipia','6-Day Samburu & Laikipia','North of the equator',
   (select id from public.jemvoyage_tour_categories where slug='luxury-safari'),
   (select id from public.jemvoyage_destinations where slug='samburu'),
   'Dry northern country, species you will not see further south, and very few vehicles.',
   'Samburu and the Laikipia conservancies sit in hotter, drier country north of the equator. The wildlife is different — Grevy''s zebra, reticulated giraffe, gerenuk — and the conservancies allow walking and night drives that national reserves do not.',
   6,5,265000,'KES','per_person',2,6,'Conservancy camp, en-suite','4x4 safari vehicle; light aircraft option','Full board on safari',
   array['Conservancy fees','Full board accommodation','4x4 vehicle and driver-guide','Game drives, night drives and walks'],
   array['International flights','Domestic flights unless specified','Visa fees','Travel insurance','Drinks and gratuities'],
   'easy', array[6,7,8,9,10,1,2]::smallint[],
   (select id from public.jemvoyage_media where tags @> array['samburu'] limit 1),
   (select id from public.jemvoyage_media where tags @> array['samburu'] limit 1),
   false,'published', now(), 50),

  ('8-day-beach-and-safari','8-Day Beach & Safari','Plains first, ocean second',
   (select id from public.jemvoyage_tour_categories where slug='beach-safari'),
   (select id from public.jemvoyage_destinations where slug='diani'),
   'Four days on safari followed by four on the south coast at Diani.',
   'The combination most first-time visitors ask for, and it works: the safari while you have energy for early starts, then the coast to recover. Tsavo sits conveniently between Nairobi and Diani, so the transition costs you very little time.',
   8,7,224000,'KES','per_person',2,8,'Lodge on safari, beach resort at the coast','4x4 safari vehicle and road transfer','Full board on safari, bed and breakfast at the coast',
   array['Park entry fees','Accommodation as specified','4x4 vehicle and driver-guide','All game drives','Coast transfers'],
   array['International flights','Visa fees','Travel insurance','Lunches and dinners at the coast','Drinks and gratuities'],
   'easy', array[1,2,6,7,8,9,10]::smallint[],
   (select id from public.jemvoyage_media where tags @> array['diani'] limit 1),
   (select id from public.jemvoyage_media where tags @> array['diani'] limit 1),
   true,'published', now(), 60),

  ('3-day-diani-escape','3-Day Diani Beach Escape','A short coast break',
   (select id from public.jemvoyage_tour_categories where slug='group'),
   (select id from public.jemvoyage_destinations where slug='diani'),
   'Three days on the south coast with transfers, for a long weekend.',
   'A straightforward coast break: flights or road transfer to Diani, three nights on the beach, and as much or as little arranged around it as you want. Popular with residents as a long weekend.',
   3,2,42000,'KES','per_person',1,10,'Beach resort','Airport transfers included','Bed and breakfast',
   array['Accommodation','Airport transfers','Bed and breakfast'],
   array['Flights','Lunches and dinners','Water sports','Drinks and gratuities'],
   'easy', array[1,2,3,7,8,9,10,12]::smallint[],
   (select id from public.jemvoyage_media where tags @> array['watamu'] limit 1),
   (select id from public.jemvoyage_media where tags @> array['watamu'] limit 1),
   false,'published', now(), 70),

  ('2-day-nairobi-city-park','2-Day Nairobi City & National Park','A capital with rhino on its edge',
   (select id from public.jemvoyage_tour_categories where slug='cultural'),
   (select id from public.jemvoyage_destinations where slug='nairobi'),
   'The national park in the morning, the city in the afternoon.',
   'Designed for travellers with a day or two either side of a flight. A morning in Nairobi National Park — rhino, lion and giraffe with the skyline behind them — then museums, markets and food in the city.',
   2,1,28000,'KES','per_person',1,6,'City hotel','Saloon car or 4x4 with driver','Bed and breakfast',
   array['Park entry fees','Accommodation','Vehicle and driver-guide','Bed and breakfast'],
   array['Flights','Lunches and dinners','Drinks and gratuities'],
   'easy', array[1,2,3,4,5,6,7,8,9,10,11,12]::smallint[],
   (select id from public.jemvoyage_media where tags @> array['forest'] limit 1),
   (select id from public.jemvoyage_media where tags @> array['forest'] limit 1),
   false,'published', now(), 80),

  ('5-day-family-safari','5-Day Family Safari','Paced for travelling with children',
   (select id from public.jemvoyage_tour_categories where slug='family-safari'),
   (select id from public.jemvoyage_destinations where slug='naivasha'),
   'Shorter driving days, family rooms and camps that welcome children.',
   'Built around what actually works with children: shorter drives, a pool in the middle of the day, guides who are used to answering questions, and camps with family rooms. Naivasha first because it is close, then the Mara.',
   5,4,148000,'KES','per_person',3,8,'Family rooms at lodge and camp','4x4 safari vehicle with pop-up roof','Full board on safari',
   array['Park entry fees','Full board accommodation','4x4 vehicle and driver-guide','All game drives','Boat trip at Naivasha'],
   array['International flights','Visa fees','Travel insurance','Drinks and gratuities'],
   'easy', array[4,7,8,12]::smallint[],
   (select id from public.jemvoyage_media where tags @> array['family'] limit 1),
   (select id from public.jemvoyage_media where tags @> array['family'] limit 1),
   false,'published', now(), 90),

  ('6-day-honeymoon-safari-coast','6-Day Honeymoon Safari & Coast','Quiet camps and time to yourselves',
   (select id from public.jemvoyage_tour_categories where slug='honeymoon'),
   (select id from public.jemvoyage_destinations where slug='watamu'),
   'A small camp in the Mara, then a private villa on the north coast.',
   'Smaller properties, private dining where the camp allows it, and no shared vehicles. Three nights in a Mara conservancy followed by three on the north coast, with the flight between them rather than a long drive.',
   6,5,398000,'KES','per_person',2,2,'Small camp and private villa','Light aircraft between camp and coast','Full board on safari, bed and breakfast at the coast',
   array['Conservancy fees','Accommodation as specified','Private vehicle and driver-guide','Domestic flight to the coast','Private dining where available'],
   array['International flights','Visa fees','Travel insurance','Drinks and gratuities'],
   'easy', array[1,2,6,7,8,9,10]::smallint[],
   (select id from public.jemvoyage_media where tags @> array['honeymoon'] limit 1),
   (select id from public.jemvoyage_media where tags @> array['honeymoon'] limit 1),
   true,'published', now(), 100),

  ('4-day-photographic-safari','4-Day Photographic Safari','Built around the light',
   (select id from public.jemvoyage_tour_categories where slug='photography'),
   (select id from public.jemvoyage_destinations where slug='maasai-mara'),
   'Early starts, late finishes, a low hide and a vehicle you do not share.',
   'A photographic itinerary means a private vehicle, a guide who understands positioning and light, and a schedule that ignores standard meal times. Bean bags provided; a low hide is available at the camp for ground-level work.',
   4,3,178000,'KES','per_person',1,4,'Tented camp, en-suite','Private 4x4 with bean bags and charging','Full board on safari',
   array['Park entry fees','Full board accommodation','Private 4x4 and driver-guide','Bean bags and in-vehicle charging','Hide access'],
   array['International flights','Camera equipment','Visa fees','Travel insurance','Drinks and gratuities'],
   'easy', array[7,8,9,10,1,2]::smallint[],
   (select id from public.jemvoyage_media where tags @> array['photography'] limit 1),
   (select id from public.jemvoyage_media where tags @> array['photography'] limit 1),
   false,'published', now(), 110),

  ('3-day-fly-in-mara','3-Day Fly-In Mara Safari','More time on the ground',
   (select id from public.jemvoyage_tour_categories where slug='fly-in'),
   (select id from public.jemvoyage_destinations where slug='maasai-mara'),
   'Light aircraft from Wilson, which turns a six-hour drive into a 45-minute flight.',
   'Flying rather than driving buys you most of two days. From Wilson Airport it is around 45 minutes to the Mara airstrips, so you can be on a game drive the same morning you land in Nairobi.',
   3,2,152000,'KES','per_person',2,6,'Tented camp, en-suite','Return light aircraft; 4x4 in the reserve','Full board on safari',
   array['Return flights from Wilson','Park entry fees','Full board accommodation','Shared 4x4 game drives'],
   array['International flights','Visa fees','Travel insurance','Drinks and gratuities'],
   'easy', array[7,8,9,10]::smallint[],
   (select id from public.jemvoyage_media where tags @> array['fly-in'] limit 1),
   (select id from public.jemvoyage_media where tags @> array['fly-in'] limit 1),
   false,'published', now(), 120)
on conflict (slug) do update set
  title = excluded.title, subtitle = excluded.subtitle, summary = excluded.summary,
  description = excluded.description, price_from = excluded.price_from,
  primary_media_id = excluded.primary_media_id, thumbnail_media_id = excluded.thumbnail_media_id,
  inclusions = excluded.inclusions, exclusions = excluded.exclusions,
  is_featured = excluded.is_featured, status = excluded.status;

-- Link every tour to its primary destination.
insert into public.jemvoyage_tour_destinations (tour_id, destination_id, display_order)
select t.id, t.primary_destination_id, 0
from public.jemvoyage_tours t
where t.primary_destination_id is not null
on conflict do nothing;

-- Day-by-day for the flagship itinerary.
insert into public.jemvoyage_tour_itineraries
  (tour_id, day_number, title, description, overnight_location, accommodation, meals, driving_time_minutes)
select t.id, d.day_number, d.title, d.description, d.overnight, d.accommodation, d.meals, d.driving
from public.jemvoyage_tours t
cross join (values
  (1,'Nairobi to the Maasai Mara','Depart Nairobi mid-morning and drive west across the Rift Valley escarpment, stopping at the viewpoint. Arrive at camp for lunch, then out on an afternoon game drive as the light softens.','Maasai Mara','Tented camp','Lunch, dinner',330),
  (2,'Full day in the reserve','A full day in the Mara with an early start. Depending on the season and where the herds are, you may spend the morning near the river and the afternoon on the plains. Breakfast is taken in the bush.','Maasai Mara','Tented camp','Breakfast, lunch, dinner',0),
  (3,'Mara to Nairobi','A final morning drive before breakfast, then the road back to Nairobi, arriving mid-afternoon. Onward transfers to the airport or your hotel are included.','—','—','Breakfast',330)
) as d(day_number,title,description,overnight,accommodation,meals,driving)
where t.slug = '3-day-maasai-mara-safari'
on conflict (tour_id, day_number) do update set
  title = excluded.title, description = excluded.description;;
