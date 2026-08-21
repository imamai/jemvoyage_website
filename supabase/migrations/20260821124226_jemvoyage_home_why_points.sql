-- =============================================================================
-- JEMVOYAGE LTD — 0009 · "Why Jemvoyage" propositions
-- =============================================================================
-- Stored as a public setting so Marketing can reword them in the CMS without a
-- deploy. Deliberately factual: no awards, certifications, partnerships or
-- customer testimonials are claimed anywhere in seeded content (§70).
-- =============================================================================

insert into public.jemvoyage_settings (key, value, label, description, group_name, is_public)
values (
  'home.why_points',
  '[
    {"title":"Planned by people who live here","description":"Your itinerary is built by Nairobi-based planners who travel these routes themselves, not assembled from a catalogue."},
    {"title":"Our own fleet and drivers","description":"Vehicles and chauffeurs are ours, so we control condition, timing and standards rather than subcontracting them out."},
    {"title":"One team, enquiry to return","description":"The same people handle your quote, your booking and your journey, so nothing is lost in a handover."},
    {"title":"Clear, itemised pricing","description":"Every quotation lists what is included and what is not, in your currency, before you commit."}
  ]'::jsonb,
  'Homepage — Why Jemvoyage points',
  'Array of {title, description}. Rendered in order by the homepage.',
  'homepage',
  true
)
on conflict (key) do update set
  value = excluded.value,
  label = excluded.label,
  description = excluded.description,
  group_name = excluded.group_name,
  is_public = excluded.is_public;
