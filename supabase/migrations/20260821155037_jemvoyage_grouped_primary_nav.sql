-- JEMVOYAGE LTD — Group the primary navigation into parents with children
--
-- Eight flat top-level links crowded the header. jemvoyage_menu_items already
-- supports self-referencing parent_id, so the grouping lives in the CMS: an
-- administrator can re-nest, rename or reorder any of this without a deploy.

delete from public.jemvoyage_menu_items
 where menu_id = (select id from public.jemvoyage_menus where key = 'primary');

-- Parents. `url` still points somewhere real, so the group label remains a
-- usable link for keyboard and touch users rather than a dead toggle.
insert into public.jemvoyage_menu_items (menu_id, label, url, display_order)
select m.id, v.label, v.url, v.ord
from public.jemvoyage_menus m
join (values
  ('Travel',   '/tours',            10),
  ('Car hire', '/car-hire',         20),
  ('Business', '/corporate-travel', 30),
  ('About',    '/about',            40)
) as v(label, url, ord) on true
where m.key = 'primary';

-- Children, attached by parent label.
insert into public.jemvoyage_menu_items
  (menu_id, parent_id, label, url, description, display_order)
select p.menu_id, p.id, v.label, v.url, v.description, v.ord
from public.jemvoyage_menu_items p
join public.jemvoyage_menus m on m.id = p.menu_id and m.key = 'primary'
join (values
  ('Travel','All tours','/tours','Every itinerary we publish',10),
  ('Travel','Safaris','/safaris','Game drives, conservancies and fly-in camps',20),
  ('Travel','Destinations','/destinations','Where to go, and when',30),
  ('Travel','Travel guide','/travel-guide','Entry, health, money and driving',40),
  ('Travel','Offers','/offers','Current value and shoulder-season rates',50),

  ('Car hire','All vehicles','/car-hire','The full published fleet',10),
  ('Car hire','4x4 & safari','/car-hire/4x4','Equipped for parks and unsealed roads',20),
  ('Car hire','Executive','/car-hire/executive','Chauffeur-standard saloons',30),
  ('Car hire','Chauffeur services','/chauffeur-services','Driven by our own team',40),
  ('Car hire','Airport transfers','/airport-transfers','JKIA, Wilson and Moi International',50),

  ('Business','Corporate travel','/corporate-travel','Accounts, approvals and monthly billing',10),
  ('Business','Travel agents','/travel-agents','Net rates and ground handling',20),

  ('About','About Jemvoyage','/about','Who we are and how we work',10),
  ('About','Travel journal','/blog','Guides and seasonal advice',20),
  ('About','Reviews','/reviews','Verified, moderated feedback',30),
  ('About','FAQ','/faq','The questions we are asked most',40),
  ('About','Contact','/contact','Talk to a travel planner',50)
) as v(parent, label, url, description, ord) on v.parent = p.label
where p.parent_id is null;;
