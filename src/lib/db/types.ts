/**
 * Typed surface of the Jemvoyage schema inside the shared `edos_websites`
 * project.
 *
 * Hand-authored rather than generated on purpose. `supabase gen types` would
 * emit all ~134 tables in this database, including margaret_*, kida_*,
 * mejasan_* and emiwama_*, which would let application code — and the
 * service-role client in particular — reach another app's data with full
 * type-checker blessing. Declaring only jemvoyage_* tables turns that class of
 * mistake into a compile error.
 *
 * Keep in step with supabase/migrations/*.sql.
 */

/** Row shape plus the columns that are mandatory on insert. */
type Table<Row, RequiredOnInsert extends keyof Row = never> = {
  Row: Row;
  Insert: Partial<Row> & Pick<Row, RequiredOnInsert>;
  Update: Partial<Row>;
  Relationships: [];
};

type Timestamps = {
  created_at: string;
  updated_at: string;
};

type Authored = {
  created_by: string | null;
  updated_by: string | null;
};

// ── domain unions ────────────────────────────────────────────────────────────

export type MediaCategory =
  | "general" | "hero" | "tours" | "safaris" | "destinations" | "vehicles"
  | "fleet" | "lodging" | "activities" | "blog" | "offers" | "corporate"
  | "team" | "testimonials" | "documents" | "inspections";

export type PublishStatus = "draft" | "published" | "archived";

export type OverlayStyle =
  | "none" | "gradient-bottom" | "gradient-left" | "scrim" | "vignette";

export type OfferAudience =
  | "all" | "tours" | "safaris" | "rentals" | "transfers" | "corporate";

export type JemvoyageRoleName =
  | "super_admin" | "ceo" | "general_manager" | "sales_manager" | "sales_agent"
  | "operations_manager" | "dispatcher" | "fleet_manager" | "driver" | "guide"
  | "finance" | "marketing" | "content_editor" | "supplier" | "travel_agent"
  | "corporate_user" | "customer";

export type JemvoyageStorageBucket =
  | "jemvoyage-media"
  | "jemvoyage-tour-media"
  | "jemvoyage-vehicle-images"
  | "jemvoyage-rental-inspections"
  | "jemvoyage-documents"
  | "jemvoyage-customer-documents";

// ── row shapes ───────────────────────────────────────────────────────────────

export type JemvoyageUser = Timestamps & Authored & {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  avatar_media_id: string | null;
  job_title: string | null;
  bio: string | null;
  locale: string;
  timezone: string;
  is_active: boolean;
  last_seen_at: string | null;
  deleted_at: string | null;
};

export type JemvoyageRole = Timestamps & {
  id: string;
  name: JemvoyageRoleName;
  label: string;
  description: string | null;
  is_staff: boolean;
  is_system: boolean;
  display_order: number;
};

export type JemvoyagePermission = {
  id: string;
  key: string;
  resource: string;
  action: string;
  label: string;
  description: string | null;
  created_at: string;
};

export type JemvoyageMedia = Timestamps & {
  id: string;
  storage_bucket: JemvoyageStorageBucket;
  /** Null for development placeholders, which carry `external_url` instead. */
  file_path: string | null;
  file_name: string | null;
  /** Licensed external URL for placeholders. Ignored once `file_path` is set. */
  external_url: string | null;
  title: string | null;
  alt_text: string | null;
  caption: string | null;
  description: string | null;
  category: MediaCategory;
  tags: string[];
  width: number | null;
  height: number | null;
  file_size: number | null;
  mime_type: string | null;
  focal_x: number;
  focal_y: number;
  blur_data_url: string | null;
  credit: string | null;
  source_url: string | null;
  license: string | null;
  is_placeholder: boolean;
  is_active: boolean;
  uploaded_by: string | null;
  deleted_at: string | null;
};

export type JemvoyageSetting = {
  key: string;
  value: unknown;
  label: string | null;
  description: string | null;
  group_name: string;
  is_public: boolean;
  updated_at: string;
  updated_by: string | null;
};

export type JemvoyageSeoMetadata = Timestamps & Authored & {
  id: string;
  entity_type: string;
  entity_id: string | null;
  path: string | null;
  seo_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  og_media_id: string | null;
  og_title: string | null;
  og_description: string | null;
  robots: string;
  schema_type: string | null;
  schema_json: unknown;
  keywords: string[];
};

export type JemvoyageCmsPage = Timestamps & Authored & {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  body: unknown;
  hero_media_id: string | null;
  status: PublishStatus;
  published_at: string | null;
  display_order: number;
  deleted_at: string | null;
};

export type JemvoyageHeroSlide = Timestamps & Authored & {
  id: string;
  placement: string;
  eyebrow: string | null;
  headline: string;
  subheadline: string | null;
  desktop_media_id: string | null;
  mobile_media_id: string | null;
  video_url: string | null;
  overlay_style: OverlayStyle;
  overlay_opacity: number;
  cta_label: string | null;
  cta_url: string | null;
  secondary_cta_label: string | null;
  secondary_cta_url: string | null;
  is_active: boolean;
  display_order: number;
  starts_at: string | null;
  ends_at: string | null;
};

export type JemvoyageHomepageSection = Timestamps & {
  id: string;
  section_key: string;
  eyebrow: string | null;
  heading: string;
  subheading: string | null;
  body: string | null;
  media_id: string | null;
  cta_label: string | null;
  cta_url: string | null;
  layout: string;
  item_limit: number;
  is_active: boolean;
  display_order: number;
  updated_by: string | null;
};

export type JemvoyageMenu = Timestamps & {
  id: string;
  key: string;
  label: string;
};

export type JemvoyageMenuItem = Timestamps & {
  id: string;
  menu_id: string;
  parent_id: string | null;
  label: string;
  url: string;
  description: string | null;
  icon: string | null;
  is_active: boolean;
  opens_new_tab: boolean;
  display_order: number;
};

export type JemvoyageBlogCategory = Timestamps & {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  display_order: number;
};

export type JemvoyageBlogPost = Timestamps & Authored & {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  category_id: string | null;
  featured_media_id: string | null;
  social_media_id: string | null;
  author_id: string | null;
  reading_minutes: number | null;
  status: PublishStatus;
  is_featured: boolean;
  published_at: string | null;
  deleted_at: string | null;
};

export type JemvoyageFaq = Timestamps & {
  id: string;
  question: string;
  answer: string;
  category: string;
  is_active: boolean;
  display_order: number;
  updated_by: string | null;
};

export type JemvoyageOffer = Timestamps & Authored & {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  body: string | null;
  media_id: string | null;
  discount_type: "percent" | "fixed" | null;
  discount_value: number | null;
  promo_code: string | null;
  applies_to: OfferAudience;
  starts_at: string | null;
  ends_at: string | null;
  terms: string | null;
  is_active: boolean;
  display_order: number;
};

export type JemvoyageNewsletterSubscriber = Timestamps & {
  id: string;
  email: string;
  full_name: string | null;
  source: string;
  segments: string[];
  is_confirmed: boolean;
  confirmed_at: string | null;
  unsubscribed_at: string | null;
};

// ── catalogue ────────────────────────────────────────────────────────────────

export type Difficulty = "easy" | "moderate" | "challenging" | "strenuous";
export type PriceBasis = "per_person" | "per_group" | "per_vehicle";

export type JemvoyageDestination = Timestamps & Authored & {
  id: string;
  slug: string;
  name: string;
  region: string | null;
  country: string;
  summary: string | null;
  description: string | null;
  hero_media_id: string | null;
  thumbnail_media_id: string | null;
  map_media_id: string | null;
  latitude: number | null;
  longitude: number | null;
  best_months: number[];
  travel_time_note: string | null;
  is_featured: boolean;
  status: PublishStatus;
  display_order: number;
  deleted_at: string | null;
};

export type JemvoyageTourCategory = Timestamps & {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  media_id: string | null;
  is_active: boolean;
  display_order: number;
};

export type JemvoyageTour = Timestamps & Authored & {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  category_id: string | null;
  primary_destination_id: string | null;
  summary: string | null;
  description: string | null;
  duration_days: number;
  duration_nights: number;
  price_from: number | null;
  currency: string;
  price_basis: PriceBasis;
  min_travellers: number;
  max_travellers: number | null;
  accommodation_summary: string | null;
  transport_summary: string | null;
  meals_summary: string | null;
  inclusions: string[];
  exclusions: string[];
  difficulty: Difficulty | null;
  best_months: number[];
  primary_media_id: string | null;
  thumbnail_media_id: string | null;
  map_media_id: string | null;
  social_media_id: string | null;
  video_url: string | null;
  is_featured: boolean;
  is_private: boolean;
  status: PublishStatus;
  published_at: string | null;
  display_order: number;
  deleted_at: string | null;
};

export type JemvoyageTourItinerary = Timestamps & {
  id: string;
  tour_id: string;
  day_number: number;
  title: string;
  description: string | null;
  media_id: string | null;
  destination_id: string | null;
  overnight_location: string | null;
  accommodation: string | null;
  meals: string | null;
  driving_time_minutes: number | null;
  distance_km: number | null;
};

export type JemvoyageActivity = Timestamps & Authored & {
  id: string;
  slug: string;
  name: string;
  summary: string | null;
  description: string | null;
  category: string | null;
  media_id: string | null;
  duration_minutes: number | null;
  difficulty: Difficulty | null;
  base_price: number | null;
  currency: string;
  is_active: boolean;
  display_order: number;
  deleted_at: string | null;
};

// ── fleet ────────────────────────────────────────────────────────────────────

export type VehicleStatus =
  | "available" | "reserved" | "rented" | "on_safari" | "on_transfer"
  | "maintenance" | "accident" | "inactive";

export type DriveType = "self_drive" | "chauffeur";

export type JemvoyageVehicleCategory = Timestamps & {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  media_id: string | null;
  typical_seats: number | null;
  is_four_wheel: boolean;
  is_active: boolean;
  display_order: number;
};

export type JemvoyageVehicle = Timestamps & Authored & {
  id: string;
  slug: string;
  registration: string;
  vin: string | null;
  category_id: string | null;
  make: string;
  model: string;
  year: number | null;
  colour: string | null;
  transmission: "manual" | "automatic";
  fuel_type: "petrol" | "diesel" | "hybrid" | "electric";
  seats: number;
  luggage_capacity: number | null;
  is_four_wheel: boolean;
  has_gps: boolean;
  current_mileage_km: number;
  purchase_date: string | null;
  purchase_value: number | null;
  status: VehicleStatus;
  home_location: string | null;
  supports_self_drive: boolean;
  supports_chauffeur: boolean;
  primary_media_id: string | null;
  description: string | null;
  rental_terms: string | null;
  is_published: boolean;
  display_order: number;
  deleted_at: string | null;
};

export type JemvoyageVehicleRate = Timestamps & Authored & {
  id: string;
  vehicle_id: string | null;
  category_id: string | null;
  drive_type: DriveType;
  currency: string;
  daily_rate: number | null;
  weekly_rate: number | null;
  monthly_rate: number | null;
  daily_mileage_km: number | null;
  excess_mileage_rate: number | null;
  security_deposit: number | null;
  driver_daily_fee: number | null;
  valid_from: string | null;
  valid_to: string | null;
  is_active: boolean;
};

export type JemvoyageVehicleFeature = {
  id: string;
  slug: string;
  name: string;
  icon: string | null;
  display_order: number;
  created_at: string;
};

// ── engagement ───────────────────────────────────────────────────────────────

export type JemvoyageReview = Timestamps & {
  id: string;
  customer_id: string | null;
  booking_id: string | null;
  rental_id: string | null;
  tour_id: string | null;
  vehicle_id: string | null;
  driver_id: string | null;
  guide_id: string | null;
  destination_id: string | null;
  author_name: string;
  author_country: string | null;
  title: string | null;
  body: string;
  rating_overall: number;
  rating_vehicle: number | null;
  rating_driver: number | null;
  rating_guide: number | null;
  rating_accommodation: number | null;
  rating_tour: number | null;
  rating_communication: number | null;
  travelled_on: string | null;
  status: "pending" | "approved" | "rejected" | "hidden";
  moderated_by: string | null;
  moderated_at: string | null;
  moderation_notes: string | null;
  response_body: string | null;
  response_at: string | null;
  is_featured: boolean;
  deleted_at: string | null;
};

export type JemvoyageLead = Timestamps & Authored & {
  id: string;
  reference: string;
  customer_id: string | null;
  source_id: string | null;
  full_name: string;
  email: string | null;
  phone: string | null;
  country: string | null;
  service_interest: string | null;
  tour_id: string | null;
  destination_id: string | null;
  vehicle_id: string | null;
  travel_start_date: string | null;
  travel_end_date: string | null;
  adults: number;
  children: number;
  budget_min: number | null;
  budget_max: number | null;
  currency: string;
  message: string | null;
  stage: string;
  priority: string;
  owner_id: string | null;
  lost_reason: string | null;
  next_action_at: string | null;
  converted_at: string | null;
  deleted_at: string | null;
};

// ── database ─────────────────────────────────────────────────────────────────

export type Database = {
  public: {
    Tables: {
      jemvoyage_users: Table<JemvoyageUser, "id" | "full_name">;
      jemvoyage_roles: Table<JemvoyageRole, "name" | "label">;
      jemvoyage_permissions: Table<
        JemvoyagePermission,
        "key" | "resource" | "action" | "label"
      >;
      jemvoyage_role_permissions: Table<
        { role_id: string; permission_id: string; created_at: string },
        "role_id" | "permission_id"
      >;
      jemvoyage_user_roles: Table<
        {
          user_id: string;
          role_id: string;
          assigned_at: string;
          assigned_by: string | null;
        },
        "user_id" | "role_id"
      >;
      // No column is unconditionally required: the DB enforces
      // `file_path is not null or external_url is not null`, which the type
      // system cannot express as a required-key set.
      jemvoyage_media: Table<JemvoyageMedia>;
      jemvoyage_settings: Table<JemvoyageSetting, "key">;
      jemvoyage_seo_metadata: Table<JemvoyageSeoMetadata, "entity_type">;
      jemvoyage_cms_pages: Table<JemvoyageCmsPage, "slug" | "title">;
      jemvoyage_hero_slides: Table<JemvoyageHeroSlide, "headline">;
      jemvoyage_homepage_sections: Table<
        JemvoyageHomepageSection,
        "section_key" | "heading"
      >;
      jemvoyage_menus: Table<JemvoyageMenu, "key" | "label">;
      jemvoyage_menu_items: Table<
        JemvoyageMenuItem,
        "menu_id" | "label" | "url"
      >;
      jemvoyage_blog_categories: Table<JemvoyageBlogCategory, "slug" | "name">;
      jemvoyage_blog_posts: Table<JemvoyageBlogPost, "slug" | "title">;
      jemvoyage_faqs: Table<JemvoyageFaq, "question" | "answer">;
      jemvoyage_offers: Table<JemvoyageOffer, "slug" | "title">;
      jemvoyage_newsletter_subscribers: Table<
        JemvoyageNewsletterSubscriber,
        "email"
      >;

      // catalogue
      jemvoyage_destinations: Table<JemvoyageDestination, "slug" | "name">;
      jemvoyage_tour_categories: Table<JemvoyageTourCategory, "slug" | "name">;
      jemvoyage_tours: Table<JemvoyageTour, "slug" | "title">;
      jemvoyage_tour_itineraries: Table<
        JemvoyageTourItinerary,
        "tour_id" | "day_number" | "title"
      >;
      jemvoyage_activities: Table<JemvoyageActivity, "slug" | "name">;
      jemvoyage_tour_media: Table<
        { tour_id: string; media_id: string; display_order: number; created_at: string },
        "tour_id" | "media_id"
      >;
      jemvoyage_tour_destinations: Table<
        { tour_id: string; destination_id: string; display_order: number },
        "tour_id" | "destination_id"
      >;
      jemvoyage_destination_media: Table<
        { destination_id: string; media_id: string; display_order: number; created_at: string },
        "destination_id" | "media_id"
      >;

      // fleet
      jemvoyage_vehicle_categories: Table<JemvoyageVehicleCategory, "slug" | "name">;
      jemvoyage_vehicles: Table<
        JemvoyageVehicle,
        "slug" | "registration" | "make" | "model"
      >;
      jemvoyage_vehicle_rates: Table<JemvoyageVehicleRate>;
      jemvoyage_vehicle_features: Table<JemvoyageVehicleFeature, "slug" | "name">;
      jemvoyage_vehicle_images: Table<
        {
          id: string;
          vehicle_id: string;
          media_id: string;
          angle: string | null;
          display_order: number;
          created_at: string;
        },
        "vehicle_id" | "media_id"
      >;

      // engagement
      jemvoyage_reviews: Table<
        JemvoyageReview,
        "author_name" | "body" | "rating_overall"
      >;
      jemvoyage_leads: Table<JemvoyageLead, "full_name">;
      jemvoyage_lead_sources: Table<
        {
          id: string;
          slug: string;
          name: string;
          is_active: boolean;
          display_order: number;
          created_at: string;
        },
        "slug" | "name"
      >;
    };
    Views: Record<never, never>;
    Functions: {
      jemvoyage_resolve_media: {
        Args: { p_media_id: string | null; p_category?: string };
        Returns: JemvoyageMedia;
      };
      jemvoyage_my_permissions: {
        Args: Record<string, never>;
        Returns: string[];
      };
      jemvoyage_has_permission: {
        Args: { p_key: string };
        Returns: boolean;
      };
      jemvoyage_has_role: {
        Args: { p_role: string };
        Returns: boolean;
      };
      jemvoyage_is_staff: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      jemvoyage_is_super_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type InsertDto<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type UpdateDto<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
