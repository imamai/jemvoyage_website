-- JEMVOYAGE LTD — Regroup the primary navigation by product line
--
-- Grouped by what actually belongs together rather than by what fitted:
--   Tours & Safaris     — the experiences Jemvoyage sells
--   Car Hire & Transfers— the mobility line (self-drive, chauffeur, transfers)
--   Corporate & Agents  — the B2B relationships
--   About Jemvoyage     — the company, plus the material that helps you decide
--
-- Structure lives in jemvoyage_menu_items.parent_id, so this can be re-nested,
-- renamed or reordered from the CMS without touching code.

delete from public.jemvoyage_menu_items
 where menu_id = (select id from public.jemvoyage_menus where key = 'primary');

-- Parents keep a real `url`, so the group label stays a working link for
-- keyboard and touch users rather than a dead toggle.
insert into public.jemvoyage_menu_items (menu_id, label, url, display_order)
select m.id, v.label, v.url, v.ord
from public.jemvoyage_menus m
join (values
  ('Tours & Safaris',      '/tours',            10),
  ('Car Hire & Transfers', '/car-hire',         20),
  ('Corporate & Agents',   '/corporate-travel', 30),
  ('About Jemvoyage',      '/about',            40)
) as v(label, url, ord) on true
where m.key = 'primary';

insert into public.jemvoyage_menu_items
  (menu_id, parent_id, label, url, description, display_order)
select p.menu_id, p.id, v.label, v.url, v.description, v.ord
from public.jemvoyage_menu_items p
join public.jemvoyage_menus m on m.id = p.menu_id and m.key = 'primary'
join (values
  -- Experiences you book
  ('Tours & Safaris','All tours','/tours','Every itinerary we publish',10),
  ('Tours & Safaris','Safaris','/safaris','Game drives, conservancies and fly-in camps',20),
  ('Tours & Safaris','Destinations','/destinations','Where to go across Kenya, and when',30),
  ('Tours & Safaris','Special offers','/offers','Shoulder-season rates and current value',40),

  -- Getting around
  ('Car Hire & Transfers','Self-drive hire','/car-hire','Drive yourself, from compacts to 4x4',10),
  ('Car Hire & Transfers','4x4 & safari vehicles','/car-hire/4x4','Equipped for parks and unsealed roads',20),
  ('Car Hire & Transfers','Executive & luxury','/car-hire/executive','Saloons for business travel',30),
  ('Car Hire & Transfers','Chauffeur services','/chauffeur-services','Driven by our own team',40),
  ('Car Hire & Transfers','Airport transfers','/airport-transfers','JKIA, Wilson and Moi International',50),

  -- Business relationships
  ('Corporate & Agents','Corporate travel','/corporate-travel','Accounts, approvals and monthly billing',10),
  ('Corporate & Agents','Travel agents','/travel-agents','Net rates and ground handling',20),

  -- The company, and what helps you decide
  ('About Jemvoyage','Who we are','/about','How we work and what to expect',10),
  ('About Jemvoyage','Travel guide','/travel-guide','Entry, health, money and driving',20),
  ('About Jemvoyage','Travel journal','/blog','Guides and seasonal advice',30),
  ('About Jemvoyage','Reviews','/reviews','Verified, moderated feedback',40),
  ('About Jemvoyage','FAQ','/faq','The questions we are asked most',50),
  ('About Jemvoyage','Contact us','/contact','Talk to a travel planner',60)
) as v(parent, label, url, description, ord) on v.parent = p.label
where p.parent_id is null;;
