/**
 * The Jemvoyage database surface.
 *
 * Row/Insert/Update shapes come from `database.types.ts`, which is generated
 * from the live schema and filtered to the jemvoyage_ namespace — so they never
 * drift from the migrations, and the other four applications sharing
 * `edos_websites` remain unreachable to the type checker.
 *
 * This file adds the things a generator cannot infer: the string unions behind
 * CHECK constraints, and readable aliases for the row types.
 *
 * Regenerate with:
 *   node scripts/filter-database-types.mjs <supabase-generated-types.txt>
 */

import type { Database, Tables } from "@/lib/db/database.types";

export type { Database, Json } from "@/lib/db/database.types";
export type { Tables, InsertDto, UpdateDto } from "@/lib/db/database.types";

// ── unions behind CHECK constraints ──────────────────────────────────────────
// Postgres CHECK constraints are invisible to the type generator, so these are
// declared by hand. They exist to constrain *inputs* (function arguments,
// form values); row reads stay as `string`, matching what the database returns.

export type MediaCategory =
  | "general" | "hero" | "tours" | "safaris" | "destinations" | "vehicles"
  | "fleet" | "lodging" | "activities" | "blog" | "offers" | "corporate"
  | "team" | "testimonials" | "documents" | "inspections";

export type PublishStatus = "draft" | "published" | "archived";

export type OverlayStyle =
  | "none" | "gradient-bottom" | "gradient-left" | "scrim" | "vignette";

export type OfferAudience =
  | "all" | "tours" | "safaris" | "rentals" | "transfers" | "corporate";

export type Difficulty = "easy" | "moderate" | "challenging" | "strenuous";

export type PriceBasis = "per_person" | "per_group" | "per_vehicle";

export type DriveType = "self_drive" | "chauffeur";

export type VehicleStatus =
  | "available" | "reserved" | "rented" | "on_safari" | "on_transfer"
  | "maintenance" | "accident" | "inactive";

export type ServiceType =
  | "tour" | "safari" | "car_hire" | "chauffeur" | "transfer" | "corporate"
  | "custom";

export type LeadStage =
  | "new" | "contacted" | "qualified" | "planning" | "quote_sent"
  | "negotiation" | "deposit_requested" | "confirmed" | "travelling"
  | "completed" | "repeat" | "lost";

export type QuoteStatus =
  | "draft" | "pending_approval" | "approved" | "sent" | "accepted"
  | "rejected" | "expired" | "converted" | "cancelled";

export type BookingStatus =
  | "pending" | "confirmed" | "in_progress" | "completed" | "cancelled"
  | "no_show";

export type PaymentStatusLabel =
  | "unpaid" | "deposit_paid" | "partially_paid" | "paid" | "refunded"
  | "partially_refunded";

export type RentalStatus =
  | "reserved" | "confirmed" | "active" | "overdue" | "returned" | "completed"
  | "cancelled";

export type TransferStatus =
  | "scheduled" | "driver_assigned" | "en_route" | "arrived"
  | "passenger_picked" | "completed" | "cancelled" | "no_show";

export type PaymentMethod =
  | "mpesa" | "card" | "bank_transfer" | "cash" | "cheque" | "credit_account";

export type PaymentState =
  | "pending" | "processing" | "succeeded" | "failed" | "cancelled"
  | "refunded" | "partially_refunded";

export type InvoiceStatus =
  | "draft" | "issued" | "sent" | "partially_paid" | "paid" | "overdue"
  | "cancelled" | "void";

export type ReviewStatus = "pending" | "approved" | "rejected" | "hidden";

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

// ── row aliases ──────────────────────────────────────────────────────────────

// identity & access
export type JemvoyageUser = Tables<"jemvoyage_users">;
export type JemvoyageRole = Tables<"jemvoyage_roles">;
export type JemvoyagePermission = Tables<"jemvoyage_permissions">;

// media & CMS
export type JemvoyageMedia = Tables<"jemvoyage_media">;
export type JemvoyageSetting = Tables<"jemvoyage_settings">;
export type JemvoyageSeoMetadata = Tables<"jemvoyage_seo_metadata">;
export type JemvoyageCmsPage = Tables<"jemvoyage_cms_pages">;
export type JemvoyageHeroSlide = Tables<"jemvoyage_hero_slides">;
export type JemvoyageHomepageSection = Tables<"jemvoyage_homepage_sections">;
export type JemvoyageMenu = Tables<"jemvoyage_menus">;
export type JemvoyageMenuItem = Tables<"jemvoyage_menu_items">;
export type JemvoyageBlogCategory = Tables<"jemvoyage_blog_categories">;
export type JemvoyageBlogPost = Tables<"jemvoyage_blog_posts">;
export type JemvoyageFaq = Tables<"jemvoyage_faqs">;
export type JemvoyageOffer = Tables<"jemvoyage_offers">;
export type JemvoyageNewsletterSubscriber =
  Tables<"jemvoyage_newsletter_subscribers">;

// catalogue
export type JemvoyageDestination = Tables<"jemvoyage_destinations">;
export type JemvoyageAttraction = Tables<"jemvoyage_attractions">;
export type JemvoyageActivity = Tables<"jemvoyage_activities">;
export type JemvoyageTourCategory = Tables<"jemvoyage_tour_categories">;
export type JemvoyageTour = Tables<"jemvoyage_tours">;
export type JemvoyageTourItinerary = Tables<"jemvoyage_tour_itineraries">;
export type JemvoyageTourAvailability = Tables<"jemvoyage_tour_availability">;

// fleet
export type JemvoyageVehicleCategory = Tables<"jemvoyage_vehicle_categories">;
export type JemvoyageVehicle = Tables<"jemvoyage_vehicles">;
export type JemvoyageVehicleImage = Tables<"jemvoyage_vehicle_images">;
export type JemvoyageVehicleFeature = Tables<"jemvoyage_vehicle_features">;
export type JemvoyageVehicleRate = Tables<"jemvoyage_vehicle_rates">;
export type JemvoyageVehicleAvailability =
  Tables<"jemvoyage_vehicle_availability">;
export type JemvoyageMaintenance = Tables<"jemvoyage_maintenance">;
export type JemvoyageFuelRecord = Tables<"jemvoyage_fuel_records">;
export type JemvoyageInsurance = Tables<"jemvoyage_insurance">;
export type JemvoyageVehicleDocument = Tables<"jemvoyage_vehicle_documents">;

// CRM
export type JemvoyageCustomer = Tables<"jemvoyage_customers">;
export type JemvoyageCustomerPreferences =
  Tables<"jemvoyage_customer_preferences">;
export type JemvoyageLeadSource = Tables<"jemvoyage_lead_sources">;
export type JemvoyageLead = Tables<"jemvoyage_leads">;
export type JemvoyageSalesActivity = Tables<"jemvoyage_sales_activities">;
export type JemvoyageCommunication = Tables<"jemvoyage_communications">;

// people & suppliers
export type JemvoyageDriver = Tables<"jemvoyage_drivers">;
export type JemvoyageGuide = Tables<"jemvoyage_guides">;
export type JemvoyageDriverAssignment = Tables<"jemvoyage_driver_assignments">;
export type JemvoyageSupplier = Tables<"jemvoyage_suppliers">;
export type JemvoyageSupplierRate = Tables<"jemvoyage_supplier_rates">;
export type JemvoyageSupplierContract = Tables<"jemvoyage_supplier_contracts">;

// commerce
export type JemvoyageQuote = Tables<"jemvoyage_quotes">;
export type JemvoyageQuoteItem = Tables<"jemvoyage_quote_items">;
export type JemvoyageQuoteVersion = Tables<"jemvoyage_quote_versions">;
export type JemvoyageBooking = Tables<"jemvoyage_bookings">;
export type JemvoyageBookingItem = Tables<"jemvoyage_booking_items">;
export type JemvoyageTraveller = Tables<"jemvoyage_travellers">;
export type JemvoyageTransfer = Tables<"jemvoyage_transfers">;

// rentals
export type JemvoyageRental = Tables<"jemvoyage_rentals">;
export type JemvoyageRentalAgreement = Tables<"jemvoyage_rental_agreements">;
export type JemvoyageRentalDeposit = Tables<"jemvoyage_rental_deposits">;
export type JemvoyageRentalExtension = Tables<"jemvoyage_rental_extensions">;
export type JemvoyageRentalInspection = Tables<"jemvoyage_rental_inspections">;
export type JemvoyageRentalDamageReport =
  Tables<"jemvoyage_rental_damage_reports">;
export type JemvoyageRentalCharge = Tables<"jemvoyage_rental_charges">;

// finance
export type JemvoyageCorporateAccount = Tables<"jemvoyage_corporate_accounts">;
export type JemvoyageCorporateUser = Tables<"jemvoyage_corporate_users">;
export type JemvoyageTravelAgent = Tables<"jemvoyage_travel_agents">;
export type JemvoyageAgentCommission = Tables<"jemvoyage_agent_commissions">;
export type JemvoyageInvoice = Tables<"jemvoyage_invoices">;
export type JemvoyageInvoiceItem = Tables<"jemvoyage_invoice_items">;
export type JemvoyagePayment = Tables<"jemvoyage_payments">;
export type JemvoyagePaymentEvent = Tables<"jemvoyage_payment_events">;
export type JemvoyageRefund = Tables<"jemvoyage_refunds">;
export type JemvoyageExpense = Tables<"jemvoyage_expenses">;

// engagement
export type JemvoyageReview = Tables<"jemvoyage_reviews">;
export type JemvoyageNotification = Tables<"jemvoyage_notifications">;
export type JemvoyageNotificationTemplate =
  Tables<"jemvoyage_notification_templates">;
export type JemvoyageAuditLog = Tables<"jemvoyage_audit_logs">;

/** Convenience: the tables an admin surface can list generically. */
export type JemvoyageTableName = keyof Database["public"]["Tables"];
