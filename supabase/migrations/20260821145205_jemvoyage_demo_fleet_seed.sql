-- JEMVOYAGE LTD — Demo fleet: categories, features, vehicles, rate cards
-- Registrations are obviously placeholder (KXX pattern). Rates are indicative
-- development values; Jemvoyage sets real pricing in the CMS.

insert into public.jemvoyage_vehicle_categories
  (slug, name, description, typical_seats, is_four_wheel, media_id, display_order)
values
  ('economy','Economy','Compact and economical, ideal for town and tarmac.',5,false,
   (select id from public.jemvoyage_media where tags @> array['hatchback'] limit 1),10),
  ('sedan','Sedan','Comfortable saloon for city and highway journeys.',5,false,
   (select id from public.jemvoyage_media where tags @> array['economy','sedan'] limit 1),20),
  ('suv','SUV','Raised ride height with comfort for mixed roads.',5,true,
   (select id from public.jemvoyage_media where tags @> array['4x4'] limit 1),30),
  ('4x4','4x4 Safari','Fully equipped four-wheel drive for parks and unsealed roads.',7,true,
   (select id from public.jemvoyage_media where tags @> array['4x4'] limit 1),40),
  ('executive','Executive','Chauffeur-standard vehicles for business travel.',4,false,
   (select id from public.jemvoyage_media where tags @> array['executive','sedan'] limit 1),50),
  ('van','Van & Minibus','Group transport with luggage capacity.',12,false,
   (select id from public.jemvoyage_media where tags @> array['driver'] limit 1),60),
  ('luxury','Luxury','Premium vehicles for special occasions.',4,false,
   (select id from public.jemvoyage_media where tags @> array['executive','luxury'] limit 1),70)
on conflict (slug) do update set
  name = excluded.name, description = excluded.description,
  media_id = excluded.media_id, display_order = excluded.display_order;

insert into public.jemvoyage_vehicle_features (slug, name, display_order) values
  ('air-conditioning','Air conditioning',10),
  ('pop-up-roof','Pop-up safari roof',20),
  ('4wd','Four-wheel drive',30),
  ('bluetooth','Bluetooth audio',40),
  ('usb-charging','USB charging',50),
  ('fridge','Cool box / fridge',60),
  ('roof-rack','Roof rack',70),
  ('child-seat','Child seat available',80),
  ('gps','GPS navigation',90),
  ('long-range-tank','Long-range fuel tank',100)
on conflict (slug) do nothing;

insert into public.jemvoyage_vehicles
  (slug, registration, category_id, make, model, year, colour, transmission, fuel_type,
   seats, luggage_capacity, is_four_wheel, has_gps, current_mileage_km, status,
   home_location, supports_self_drive, supports_chauffeur, primary_media_id,
   description, is_published, display_order)
values
  ('land-cruiser-prado-1','KXX 001A',(select id from public.jemvoyage_vehicle_categories where slug='4x4'),
   'Toyota','Land Cruiser Prado',2021,'Silver','automatic','diesel',7,4,true,true,64000,'available','Nairobi',true,true,
   (select id from public.jemvoyage_media where tags @> array['4x4'] limit 1),
   'A comfortable, capable 4x4 that handles park tracks and long tarmac transfers equally well. Automatic, diesel, and the most requested vehicle in the fleet.',true,10),

  ('land-cruiser-v8-1','KXX 002B',(select id from public.jemvoyage_vehicle_categories where slug='4x4'),
   'Toyota','Land Cruiser V8',2020,'White','automatic','diesel',7,5,true,true,88000,'available','Nairobi',false,true,
   (select id from public.jemvoyage_media where tags @> array['4x4'] limit 1),
   'The full-size Land Cruiser, chauffeur-driven only. Space and ride quality for longer safari circuits.',true,20),

  ('land-cruiser-78-safari-1','KXX 003C',(select id from public.jemvoyage_vehicle_categories where slug='4x4'),
   'Toyota','Land Cruiser 78 Safari',2019,'Beige','manual','diesel',7,4,true,true,142000,'available','Nairobi',false,true,
   (select id from public.jemvoyage_media where tags @> array['4x4'] limit 1),
   'Purpose-built safari conversion with a pop-up roof, charging points and a cool box. Built for game viewing rather than comfort on tarmac.',true,30),

  ('toyota-rav4-1','KXX 004D',(select id from public.jemvoyage_vehicle_categories where slug='suv'),
   'Toyota','RAV4',2022,'Grey','automatic','petrol',5,3,true,true,38000,'available','Nairobi',true,true,
   (select id from public.jemvoyage_media where tags @> array['4x4'] limit 1),
   'A compact SUV for travellers who want raised ride height without the size or fuel cost of a full 4x4.',true,40),

  ('mercedes-e-class-1','KXX 005E',(select id from public.jemvoyage_vehicle_categories where slug='executive'),
   'Mercedes-Benz','E-Class',2022,'Black','automatic','petrol',4,3,false,true,29000,'available','Nairobi',false,true,
   (select id from public.jemvoyage_media where tags @> array['executive','sedan'] limit 1),
   'Executive saloon for airport transfers and corporate movements. Chauffeur-driven only.',true,50),

  ('bmw-5-series-1','KXX 006F',(select id from public.jemvoyage_vehicle_categories where slug='luxury'),
   'BMW','5 Series',2021,'Blue','automatic','petrol',4,3,false,true,41000,'available','Nairobi',false,true,
   (select id from public.jemvoyage_media where tags @> array['executive','luxury'] limit 1),
   'Premium saloon for occasions where the vehicle is part of the impression.',true,60),

  ('toyota-axio-1','KXX 007G',(select id from public.jemvoyage_vehicle_categories where slug='sedan'),
   'Toyota','Axio',2019,'Silver','automatic','petrol',5,2,false,false,96000,'available','Nairobi',true,true,
   (select id from public.jemvoyage_media where tags @> array['economy','sedan'] limit 1),
   'An economical automatic saloon. The practical choice for city driving and tarmac routes.',true,70),

  ('vw-polo-1','KXX 008H',(select id from public.jemvoyage_vehicle_categories where slug='economy'),
   'Volkswagen','Polo',2020,'Blue','manual','petrol',5,2,false,false,74000,'available','Nairobi',true,false,
   (select id from public.jemvoyage_media where tags @> array['hatchback'] limit 1),
   'Compact, easy to park and cheap to run. Self-drive only.',true,80),

  ('toyota-hiace-1','KXX 009J',(select id from public.jemvoyage_vehicle_categories where slug='van'),
   'Toyota','Hiace',2020,'White','manual','diesel',12,8,false,true,118000,'available','Nairobi',false,true,
   (select id from public.jemvoyage_media where tags @> array['driver'] limit 1),
   'Twelve-seat van for group transfers and larger parties, with luggage space behind the last row.',true,90),

  ('nissan-urvan-1','KXX 010K',(select id from public.jemvoyage_vehicle_categories where slug='van'),
   'Nissan','Urvan',2019,'White','manual','diesel',14,9,false,false,131000,'available','Mombasa',false,true,
   (select id from public.jemvoyage_media where tags @> array['driver'] limit 1),
   'Coast-based minibus for airport transfers and group movements around Mombasa and Diani.',true,100)
on conflict (slug) do update set
  make = excluded.make, model = excluded.model, description = excluded.description,
  primary_media_id = excluded.primary_media_id, is_published = excluded.is_published,
  status = excluded.status, display_order = excluded.display_order;

-- Per-vehicle self-drive rate cards.
insert into public.jemvoyage_vehicle_rates
  (vehicle_id, drive_type, currency, daily_rate, weekly_rate, monthly_rate,
   daily_mileage_km, excess_mileage_rate, security_deposit, is_active)
select v.id, 'self_drive', 'KES', r.daily, r.weekly, r.monthly, r.km, r.excess, r.deposit, true
from public.jemvoyage_vehicles v
join (values
  ('land-cruiser-prado-1', 14500, 91000, 348000, 250, 45, 60000),
  ('toyota-rav4-1',         9500, 60000, 228000, 250, 35, 40000),
  ('toyota-axio-1',         5500, 34000, 130000, 200, 25, 25000),
  ('vw-polo-1',             4800, 30000, 115000, 200, 25, 20000)
) as r(slug, daily, weekly, monthly, km, excess, deposit) on r.slug = v.slug
where not exists (
  select 1 from public.jemvoyage_vehicle_rates x
   where x.vehicle_id = v.id and x.drive_type = 'self_drive'
);

-- Chauffeur-driven rate cards.
insert into public.jemvoyage_vehicle_rates
  (vehicle_id, drive_type, currency, daily_rate, weekly_rate, daily_mileage_km,
   driver_daily_fee, security_deposit, is_active)
select v.id, 'chauffeur', 'KES', r.daily, r.weekly, r.km, r.driver_fee, 0, true
from public.jemvoyage_vehicles v
join (values
  ('land-cruiser-prado-1',      18500, 118000, 250, 4000),
  ('land-cruiser-v8-1',         24000, 154000, 250, 4000),
  ('land-cruiser-78-safari-1',  21000, 134000, 250, 4000),
  ('toyota-rav4-1',             13500,  86000, 250, 4000),
  ('mercedes-e-class-1',        22000, 140000, 200, 4500),
  ('bmw-5-series-1',            24500, 156000, 200, 4500),
  ('toyota-axio-1',              9500,  60000, 200, 3500),
  ('toyota-hiace-1',            16000, 102000, 250, 4000),
  ('nissan-urvan-1',            17000, 108000, 250, 4000)
) as r(slug, daily, weekly, km, driver_fee) on r.slug = v.slug
where not exists (
  select 1 from public.jemvoyage_vehicle_rates x
   where x.vehicle_id = v.id and x.drive_type = 'chauffeur'
);

-- Feature mapping.
insert into public.jemvoyage_vehicle_feature_map (vehicle_id, feature_id)
select v.id, f.id
from public.jemvoyage_vehicles v
join public.jemvoyage_vehicle_features f on true
where (v.is_four_wheel and f.slug in ('air-conditioning','pop-up-roof','4wd','usb-charging','fridge','roof-rack','long-range-tank','child-seat'))
   or (not v.is_four_wheel and f.slug in ('air-conditioning','bluetooth','usb-charging','child-seat'))
   or (v.has_gps and f.slug = 'gps')
on conflict do nothing;;
