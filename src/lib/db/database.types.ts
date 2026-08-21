// GENERATED FILE — do not edit by hand.
//
// Rebuilt with:
//   node scripts/filter-database-types.mjs <supabase-generated-types.txt>
//
// Contains ONLY the 82 jemvoyage_ tables and 14 jemvoyage_ functions from the
// shared `edos_websites` project. The other applications living in that
// database (margaret_*, kida_*, mejasan_*, emiwama_*) are deliberately absent,
// so querying them fails to typecheck — including via the service-role client.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      
            jemvoyage_activities: {
              Row: {
                base_price: number | null
                category: string | null
                created_at: string
                created_by: string | null
                currency: string
                deleted_at: string | null
                description: string | null
                difficulty: string | null
                display_order: number
                duration_minutes: number | null
                id: string
                is_active: boolean
                media_id: string | null
                name: string
                slug: string
                summary: string | null
                updated_at: string
                updated_by: string | null
              }
              Insert: {
                base_price?: number | null
                category?: string | null
                created_at?: string
                created_by?: string | null
                currency?: string
                deleted_at?: string | null
                description?: string | null
                difficulty?: string | null
                display_order?: number
                duration_minutes?: number | null
                id?: string
                is_active?: boolean
                media_id?: string | null
                name: string
                slug: string
                summary?: string | null
                updated_at?: string
                updated_by?: string | null
              }
              Update: {
                base_price?: number | null
                category?: string | null
                created_at?: string
                created_by?: string | null
                currency?: string
                deleted_at?: string | null
                description?: string | null
                difficulty?: string | null
                display_order?: number
                duration_minutes?: number | null
                id?: string
                is_active?: boolean
                media_id?: string | null
                name?: string
                slug?: string
                summary?: string | null
                updated_at?: string
                updated_by?: string | null
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_activities_media_id_fkey"
                  columns: ["media_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_media"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_agent_commissions: {
              Row: {
                base_amount: number
                booking_id: string | null
                commission_amount: number
                commission_rate: number
                created_at: string
                currency: string
                earned_on: string | null
                id: string
                notes: string | null
                paid_at: string | null
                payment_reference: string | null
                status: string
                travel_agent_id: string
                updated_at: string
              }
              Insert: {
                base_amount?: number
                booking_id?: string | null
                commission_amount?: number
                commission_rate?: number
                created_at?: string
                currency?: string
                earned_on?: string | null
                id?: string
                notes?: string | null
                paid_at?: string | null
                payment_reference?: string | null
                status?: string
                travel_agent_id: string
                updated_at?: string
              }
              Update: {
                base_amount?: number
                booking_id?: string | null
                commission_amount?: number
                commission_rate?: number
                created_at?: string
                currency?: string
                earned_on?: string | null
                id?: string
                notes?: string | null
                paid_at?: string | null
                payment_reference?: string | null
                status?: string
                travel_agent_id?: string
                updated_at?: string
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_agent_commissions_booking_id_fkey"
                  columns: ["booking_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_bookings"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_agent_commissions_travel_agent_id_fkey"
                  columns: ["travel_agent_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_travel_agents"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_attractions: {
              Row: {
                category: string | null
                created_at: string
                created_by: string | null
                deleted_at: string | null
                description: string | null
                destination_id: string | null
                display_order: number
                id: string
                is_active: boolean
                latitude: number | null
                longitude: number | null
                media_id: string | null
                name: string
                slug: string
                summary: string | null
                updated_at: string
                updated_by: string | null
              }
              Insert: {
                category?: string | null
                created_at?: string
                created_by?: string | null
                deleted_at?: string | null
                description?: string | null
                destination_id?: string | null
                display_order?: number
                id?: string
                is_active?: boolean
                latitude?: number | null
                longitude?: number | null
                media_id?: string | null
                name: string
                slug: string
                summary?: string | null
                updated_at?: string
                updated_by?: string | null
              }
              Update: {
                category?: string | null
                created_at?: string
                created_by?: string | null
                deleted_at?: string | null
                description?: string | null
                destination_id?: string | null
                display_order?: number
                id?: string
                is_active?: boolean
                latitude?: number | null
                longitude?: number | null
                media_id?: string | null
                name?: string
                slug?: string
                summary?: string | null
                updated_at?: string
                updated_by?: string | null
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_attractions_destination_id_fkey"
                  columns: ["destination_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_destinations"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_attractions_media_id_fkey"
                  columns: ["media_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_media"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_audit_logs: {
              Row: {
                action: string
                changed_fields: string[] | null
                entity_id: string | null
                entity_type: string
                id: number
                ip_address: unknown
                new_values: Json | null
                occurred_at: string
                old_values: Json | null
                summary: string | null
                user_agent: string | null
                user_email: string | null
                user_id: string | null
                user_role: string | null
              }
              Insert: {
                action: string
                changed_fields?: string[] | null
                entity_id?: string | null
                entity_type: string
                id?: number
                ip_address?: unknown
                new_values?: Json | null
                occurred_at?: string
                old_values?: Json | null
                summary?: string | null
                user_agent?: string | null
                user_email?: string | null
                user_id?: string | null
                user_role?: string | null
              }
              Update: {
                action?: string
                changed_fields?: string[] | null
                entity_id?: string | null
                entity_type?: string
                id?: number
                ip_address?: unknown
                new_values?: Json | null
                occurred_at?: string
                old_values?: Json | null
                summary?: string | null
                user_agent?: string | null
                user_email?: string | null
                user_id?: string | null
                user_role?: string | null
              }
              Relationships: []
            }
      
            jemvoyage_blog_categories: {
              Row: {
                created_at: string
                description: string | null
                display_order: number
                id: string
                name: string
                slug: string
                updated_at: string
              }
              Insert: {
                created_at?: string
                description?: string | null
                display_order?: number
                id?: string
                name: string
                slug: string
                updated_at?: string
              }
              Update: {
                created_at?: string
                description?: string | null
                display_order?: number
                id?: string
                name?: string
                slug?: string
                updated_at?: string
              }
              Relationships: []
            }
      
            jemvoyage_blog_posts: {
              Row: {
                author_id: string | null
                body: string | null
                category_id: string | null
                created_at: string
                created_by: string | null
                deleted_at: string | null
                excerpt: string | null
                featured_media_id: string | null
                id: string
                is_featured: boolean
                published_at: string | null
                reading_minutes: number | null
                slug: string
                social_media_id: string | null
                status: string
                title: string
                updated_at: string
                updated_by: string | null
              }
              Insert: {
                author_id?: string | null
                body?: string | null
                category_id?: string | null
                created_at?: string
                created_by?: string | null
                deleted_at?: string | null
                excerpt?: string | null
                featured_media_id?: string | null
                id?: string
                is_featured?: boolean
                published_at?: string | null
                reading_minutes?: number | null
                slug: string
                social_media_id?: string | null
                status?: string
                title: string
                updated_at?: string
                updated_by?: string | null
              }
              Update: {
                author_id?: string | null
                body?: string | null
                category_id?: string | null
                created_at?: string
                created_by?: string | null
                deleted_at?: string | null
                excerpt?: string | null
                featured_media_id?: string | null
                id?: string
                is_featured?: boolean
                published_at?: string | null
                reading_minutes?: number | null
                slug?: string
                social_media_id?: string | null
                status?: string
                title?: string
                updated_at?: string
                updated_by?: string | null
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_blog_posts_author_id_fkey"
                  columns: ["author_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_users"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_blog_posts_category_id_fkey"
                  columns: ["category_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_blog_categories"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_blog_posts_featured_media_id_fkey"
                  columns: ["featured_media_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_media"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_blog_posts_social_media_id_fkey"
                  columns: ["social_media_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_media"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_booking_items: {
              Row: {
                booking_id: string
                confirmation_ref: string | null
                created_at: string
                description: string
                detail: string | null
                display_order: number
                driver_id: string | null
                guide_id: string | null
                id: string
                item_type: string
                line_total: number | null
                notes: string | null
                quantity: number
                reference_id: string | null
                service_date: string | null
                status: string
                supplier_id: string | null
                unit_cost: number
                unit_price: number
                updated_at: string
                vehicle_id: string | null
              }
              Insert: {
                booking_id: string
                confirmation_ref?: string | null
                created_at?: string
                description: string
                detail?: string | null
                display_order?: number
                driver_id?: string | null
                guide_id?: string | null
                id?: string
                item_type: string
                line_total?: number | null
                notes?: string | null
                quantity?: number
                reference_id?: string | null
                service_date?: string | null
                status?: string
                supplier_id?: string | null
                unit_cost?: number
                unit_price?: number
                updated_at?: string
                vehicle_id?: string | null
              }
              Update: {
                booking_id?: string
                confirmation_ref?: string | null
                created_at?: string
                description?: string
                detail?: string | null
                display_order?: number
                driver_id?: string | null
                guide_id?: string | null
                id?: string
                item_type?: string
                line_total?: number | null
                notes?: string | null
                quantity?: number
                reference_id?: string | null
                service_date?: string | null
                status?: string
                supplier_id?: string | null
                unit_cost?: number
                unit_price?: number
                updated_at?: string
                vehicle_id?: string | null
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_booking_items_booking_id_fkey"
                  columns: ["booking_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_bookings"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_booking_items_driver_id_fkey"
                  columns: ["driver_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_drivers"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_booking_items_guide_id_fkey"
                  columns: ["guide_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_guides"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_booking_items_supplier_id_fkey"
                  columns: ["supplier_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_suppliers"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_booking_items_vehicle_id_fkey"
                  columns: ["vehicle_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_vehicles"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_bookings: {
              Row: {
                adults: number
                amount_paid: number
                availability_id: string | null
                balance_due: number | null
                cancellation_reason: string | null
                cancelled_at: string | null
                children: number
                completed_at: string | null
                confirmed_at: string | null
                corporate_account_id: string | null
                created_at: string
                created_by: string | null
                currency: string
                customer_id: string
                deleted_at: string | null
                discount_amount: number
                end_date: string
                id: string
                internal_notes: string | null
                lead_guide_id: string | null
                owner_id: string | null
                payment_status: string
                quote_id: string | null
                reference: string
                service_type: string
                special_requests: string | null
                start_date: string
                status: string
                subtotal: number
                supplier_cost: number
                tax_amount: number
                title: string
                total: number
                tour_id: string | null
                travel_agent_id: string | null
                updated_at: string
                updated_by: string | null
              }
              Insert: {
                adults?: number
                amount_paid?: number
                availability_id?: string | null
                balance_due?: number | null
                cancellation_reason?: string | null
                cancelled_at?: string | null
                children?: number
                completed_at?: string | null
                confirmed_at?: string | null
                corporate_account_id?: string | null
                created_at?: string
                created_by?: string | null
                currency?: string
                customer_id: string
                deleted_at?: string | null
                discount_amount?: number
                end_date: string
                id?: string
                internal_notes?: string | null
                lead_guide_id?: string | null
                owner_id?: string | null
                payment_status?: string
                quote_id?: string | null
                reference?: string
                service_type?: string
                special_requests?: string | null
                start_date: string
                status?: string
                subtotal?: number
                supplier_cost?: number
                tax_amount?: number
                title: string
                total?: number
                tour_id?: string | null
                travel_agent_id?: string | null
                updated_at?: string
                updated_by?: string | null
              }
              Update: {
                adults?: number
                amount_paid?: number
                availability_id?: string | null
                balance_due?: number | null
                cancellation_reason?: string | null
                cancelled_at?: string | null
                children?: number
                completed_at?: string | null
                confirmed_at?: string | null
                corporate_account_id?: string | null
                created_at?: string
                created_by?: string | null
                currency?: string
                customer_id?: string
                deleted_at?: string | null
                discount_amount?: number
                end_date?: string
                id?: string
                internal_notes?: string | null
                lead_guide_id?: string | null
                owner_id?: string | null
                payment_status?: string
                quote_id?: string | null
                reference?: string
                service_type?: string
                special_requests?: string | null
                start_date?: string
                status?: string
                subtotal?: number
                supplier_cost?: number
                tax_amount?: number
                title?: string
                total?: number
                tour_id?: string | null
                travel_agent_id?: string | null
                updated_at?: string
                updated_by?: string | null
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_bookings_agent_fk"
                  columns: ["travel_agent_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_travel_agents"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_bookings_availability_id_fkey"
                  columns: ["availability_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_tour_availability"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_bookings_corporate_fk"
                  columns: ["corporate_account_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_corporate_accounts"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_bookings_customer_id_fkey"
                  columns: ["customer_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_customers"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_bookings_lead_guide_id_fkey"
                  columns: ["lead_guide_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_guides"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_bookings_owner_id_fkey"
                  columns: ["owner_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_users"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_bookings_quote_id_fkey"
                  columns: ["quote_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_quotes"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_bookings_tour_id_fkey"
                  columns: ["tour_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_tours"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_cms_pages: {
              Row: {
                body: Json
                created_at: string
                created_by: string | null
                deleted_at: string | null
                display_order: number
                hero_media_id: string | null
                id: string
                published_at: string | null
                slug: string
                status: string
                subtitle: string | null
                title: string
                updated_at: string
                updated_by: string | null
              }
              Insert: {
                body?: Json
                created_at?: string
                created_by?: string | null
                deleted_at?: string | null
                display_order?: number
                hero_media_id?: string | null
                id?: string
                published_at?: string | null
                slug: string
                status?: string
                subtitle?: string | null
                title: string
                updated_at?: string
                updated_by?: string | null
              }
              Update: {
                body?: Json
                created_at?: string
                created_by?: string | null
                deleted_at?: string | null
                display_order?: number
                hero_media_id?: string | null
                id?: string
                published_at?: string | null
                slug?: string
                status?: string
                subtitle?: string | null
                title?: string
                updated_at?: string
                updated_by?: string | null
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_cms_pages_hero_media_id_fkey"
                  columns: ["hero_media_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_media"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_communications: {
              Row: {
                body: string | null
                channel: string
                created_at: string
                created_by: string | null
                customer_id: string | null
                delivered_at: string | null
                direction: string
                error_message: string | null
                from_address: string | null
                id: string
                lead_id: string | null
                provider_ref: string | null
                read_at: string | null
                sent_at: string | null
                status: string
                subject: string | null
                to_address: string | null
              }
              Insert: {
                body?: string | null
                channel: string
                created_at?: string
                created_by?: string | null
                customer_id?: string | null
                delivered_at?: string | null
                direction: string
                error_message?: string | null
                from_address?: string | null
                id?: string
                lead_id?: string | null
                provider_ref?: string | null
                read_at?: string | null
                sent_at?: string | null
                status?: string
                subject?: string | null
                to_address?: string | null
              }
              Update: {
                body?: string | null
                channel?: string
                created_at?: string
                created_by?: string | null
                customer_id?: string | null
                delivered_at?: string | null
                direction?: string
                error_message?: string | null
                from_address?: string | null
                id?: string
                lead_id?: string | null
                provider_ref?: string | null
                read_at?: string | null
                sent_at?: string | null
                status?: string
                subject?: string | null
                to_address?: string | null
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_communications_customer_id_fkey"
                  columns: ["customer_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_customers"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_communications_lead_id_fkey"
                  columns: ["lead_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_leads"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_corporate_accounts: {
              Row: {
                account_manager_id: string | null
                billing_address: string | null
                billing_contact: string | null
                billing_email: string | null
                company_name: string
                created_at: string
                created_by: string | null
                credit_limit: number
                credit_terms_days: number
                current_balance: number
                deleted_at: string | null
                discount_rate: number
                id: string
                industry: string | null
                monthly_spend_limit: number | null
                notes: string | null
                phone: string | null
                reference: string
                registration_no: string | null
                requires_approval: boolean
                status: string
                tax_pin: string | null
                trading_name: string | null
                updated_at: string
                updated_by: string | null
              }
              Insert: {
                account_manager_id?: string | null
                billing_address?: string | null
                billing_contact?: string | null
                billing_email?: string | null
                company_name: string
                created_at?: string
                created_by?: string | null
                credit_limit?: number
                credit_terms_days?: number
                current_balance?: number
                deleted_at?: string | null
                discount_rate?: number
                id?: string
                industry?: string | null
                monthly_spend_limit?: number | null
                notes?: string | null
                phone?: string | null
                reference?: string
                registration_no?: string | null
                requires_approval?: boolean
                status?: string
                tax_pin?: string | null
                trading_name?: string | null
                updated_at?: string
                updated_by?: string | null
              }
              Update: {
                account_manager_id?: string | null
                billing_address?: string | null
                billing_contact?: string | null
                billing_email?: string | null
                company_name?: string
                created_at?: string
                created_by?: string | null
                credit_limit?: number
                credit_terms_days?: number
                current_balance?: number
                deleted_at?: string | null
                discount_rate?: number
                id?: string
                industry?: string | null
                monthly_spend_limit?: number | null
                notes?: string | null
                phone?: string | null
                reference?: string
                registration_no?: string | null
                requires_approval?: boolean
                status?: string
                tax_pin?: string | null
                trading_name?: string | null
                updated_at?: string
                updated_by?: string | null
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_corporate_accounts_account_manager_id_fkey"
                  columns: ["account_manager_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_users"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_corporate_users: {
              Row: {
                can_approve: boolean
                corporate_account_id: string
                cost_centre: string | null
                created_at: string
                customer_id: string | null
                email: string
                full_name: string
                id: string
                is_active: boolean
                job_title: string | null
                phone: string | null
                spend_limit: number | null
                updated_at: string
                user_id: string | null
              }
              Insert: {
                can_approve?: boolean
                corporate_account_id: string
                cost_centre?: string | null
                created_at?: string
                customer_id?: string | null
                email: string
                full_name: string
                id?: string
                is_active?: boolean
                job_title?: string | null
                phone?: string | null
                spend_limit?: number | null
                updated_at?: string
                user_id?: string | null
              }
              Update: {
                can_approve?: boolean
                corporate_account_id?: string
                cost_centre?: string | null
                created_at?: string
                customer_id?: string | null
                email?: string
                full_name?: string
                id?: string
                is_active?: boolean
                job_title?: string | null
                phone?: string | null
                spend_limit?: number | null
                updated_at?: string
                user_id?: string | null
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_corporate_users_corporate_account_id_fkey"
                  columns: ["corporate_account_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_corporate_accounts"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_corporate_users_customer_id_fkey"
                  columns: ["customer_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_customers"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_corporate_users_user_id_fkey"
                  columns: ["user_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_users"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_customer_preferences: {
              Row: {
                accessibility_needs: string | null
                accommodation_level: string | null
                budget_band: string | null
                created_at: string
                customer_id: string
                dietary_requirements: string | null
                interests: string[]
                notes: string | null
                preferred_currency: string
                preferred_language: string
                preferred_vehicle_category_id: string | null
                seat_preference: string | null
                travel_styles: string[]
                typical_group_size: number | null
                updated_at: string
              }
              Insert: {
                accessibility_needs?: string | null
                accommodation_level?: string | null
                budget_band?: string | null
                created_at?: string
                customer_id: string
                dietary_requirements?: string | null
                interests?: string[]
                notes?: string | null
                preferred_currency?: string
                preferred_language?: string
                preferred_vehicle_category_id?: string | null
                seat_preference?: string | null
                travel_styles?: string[]
                typical_group_size?: number | null
                updated_at?: string
              }
              Update: {
                accessibility_needs?: string | null
                accommodation_level?: string | null
                budget_band?: string | null
                created_at?: string
                customer_id?: string
                dietary_requirements?: string | null
                interests?: string[]
                notes?: string | null
                preferred_currency?: string
                preferred_language?: string
                preferred_vehicle_category_id?: string | null
                seat_preference?: string | null
                travel_styles?: string[]
                typical_group_size?: number | null
                updated_at?: string
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_customer_preference_preferred_vehicle_category_i_fkey"
                  columns: ["preferred_vehicle_category_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_vehicle_categories"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_customer_preferences_customer_id_fkey"
                  columns: ["customer_id"]
                  isOneToOne: true
                  referencedRelation: "jemvoyage_customers"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_customers: {
              Row: {
                address: string | null
                alt_phone: string | null
                city: string | null
                company_name: string | null
                country: string | null
                created_at: string
                created_by: string | null
                customer_type: string
                date_of_birth: string | null
                deleted_at: string | null
                email: string | null
                full_name: string
                id: string
                id_number: string | null
                is_active: boolean
                last_booking_at: string | null
                lifetime_value: number
                marketing_opt_in: boolean
                nationality: string | null
                notes: string | null
                owner_id: string | null
                passport_number: string | null
                phone: string | null
                reference: string
                segment: string | null
                tax_pin: string | null
                total_bookings: number
                updated_at: string
                updated_by: string | null
                user_id: string | null
              }
              Insert: {
                address?: string | null
                alt_phone?: string | null
                city?: string | null
                company_name?: string | null
                country?: string | null
                created_at?: string
                created_by?: string | null
                customer_type?: string
                date_of_birth?: string | null
                deleted_at?: string | null
                email?: string | null
                full_name: string
                id?: string
                id_number?: string | null
                is_active?: boolean
                last_booking_at?: string | null
                lifetime_value?: number
                marketing_opt_in?: boolean
                nationality?: string | null
                notes?: string | null
                owner_id?: string | null
                passport_number?: string | null
                phone?: string | null
                reference?: string
                segment?: string | null
                tax_pin?: string | null
                total_bookings?: number
                updated_at?: string
                updated_by?: string | null
                user_id?: string | null
              }
              Update: {
                address?: string | null
                alt_phone?: string | null
                city?: string | null
                company_name?: string | null
                country?: string | null
                created_at?: string
                created_by?: string | null
                customer_type?: string
                date_of_birth?: string | null
                deleted_at?: string | null
                email?: string | null
                full_name?: string
                id?: string
                id_number?: string | null
                is_active?: boolean
                last_booking_at?: string | null
                lifetime_value?: number
                marketing_opt_in?: boolean
                nationality?: string | null
                notes?: string | null
                owner_id?: string | null
                passport_number?: string | null
                phone?: string | null
                reference?: string
                segment?: string | null
                tax_pin?: string | null
                total_bookings?: number
                updated_at?: string
                updated_by?: string | null
                user_id?: string | null
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_customers_owner_id_fkey"
                  columns: ["owner_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_users"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_customers_user_id_fkey"
                  columns: ["user_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_users"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_destination_media: {
              Row: {
                created_at: string
                destination_id: string
                display_order: number
                media_id: string
              }
              Insert: {
                created_at?: string
                destination_id: string
                display_order?: number
                media_id: string
              }
              Update: {
                created_at?: string
                destination_id?: string
                display_order?: number
                media_id?: string
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_destination_media_destination_id_fkey"
                  columns: ["destination_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_destinations"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_destination_media_media_id_fkey"
                  columns: ["media_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_media"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_destinations: {
              Row: {
                best_months: number[]
                country: string
                created_at: string
                created_by: string | null
                deleted_at: string | null
                description: string | null
                display_order: number
                hero_media_id: string | null
                id: string
                is_featured: boolean
                latitude: number | null
                longitude: number | null
                map_media_id: string | null
                name: string
                region: string | null
                slug: string
                status: string
                summary: string | null
                thumbnail_media_id: string | null
                travel_time_note: string | null
                updated_at: string
                updated_by: string | null
              }
              Insert: {
                best_months?: number[]
                country?: string
                created_at?: string
                created_by?: string | null
                deleted_at?: string | null
                description?: string | null
                display_order?: number
                hero_media_id?: string | null
                id?: string
                is_featured?: boolean
                latitude?: number | null
                longitude?: number | null
                map_media_id?: string | null
                name: string
                region?: string | null
                slug: string
                status?: string
                summary?: string | null
                thumbnail_media_id?: string | null
                travel_time_note?: string | null
                updated_at?: string
                updated_by?: string | null
              }
              Update: {
                best_months?: number[]
                country?: string
                created_at?: string
                created_by?: string | null
                deleted_at?: string | null
                description?: string | null
                display_order?: number
                hero_media_id?: string | null
                id?: string
                is_featured?: boolean
                latitude?: number | null
                longitude?: number | null
                map_media_id?: string | null
                name?: string
                region?: string | null
                slug?: string
                status?: string
                summary?: string | null
                thumbnail_media_id?: string | null
                travel_time_note?: string | null
                updated_at?: string
                updated_by?: string | null
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_destinations_hero_media_id_fkey"
                  columns: ["hero_media_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_media"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_destinations_map_media_id_fkey"
                  columns: ["map_media_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_media"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_destinations_thumbnail_media_id_fkey"
                  columns: ["thumbnail_media_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_media"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_driver_assignments: {
              Row: {
                assignment_type: string
                created_at: string
                created_by: string | null
                driver_id: string
                dropoff_location: string | null
                id: string
                instructions: string | null
                period: unknown
                pickup_location: string | null
                reference_id: string | null
                status: string
                updated_at: string
                vehicle_id: string | null
              }
              Insert: {
                assignment_type: string
                created_at?: string
                created_by?: string | null
                driver_id: string
                dropoff_location?: string | null
                id?: string
                instructions?: string | null
                period: unknown
                pickup_location?: string | null
                reference_id?: string | null
                status?: string
                updated_at?: string
                vehicle_id?: string | null
              }
              Update: {
                assignment_type?: string
                created_at?: string
                created_by?: string | null
                driver_id?: string
                dropoff_location?: string | null
                id?: string
                instructions?: string | null
                period?: unknown
                pickup_location?: string | null
                reference_id?: string | null
                status?: string
                updated_at?: string
                vehicle_id?: string | null
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_driver_assignments_driver_id_fkey"
                  columns: ["driver_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_drivers"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_driver_assignments_vehicle_id_fkey"
                  columns: ["vehicle_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_vehicles"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_drivers: {
              Row: {
                alt_phone: string | null
                created_at: string
                created_by: string | null
                deleted_at: string | null
                email: string | null
                employee_ref: string | null
                full_name: string
                home_base: string | null
                id: string
                is_available: boolean
                languages: string[]
                licence_class: string | null
                licence_expires_on: string | null
                licence_number: string
                national_id: string | null
                notes: string | null
                phone: string
                photo_media_id: string | null
                psv_badge_number: string | null
                psv_expires_on: string | null
                rating_average: number | null
                rating_count: number
                status: string
                updated_at: string
                updated_by: string | null
                user_id: string | null
                years_experience: number | null
              }
              Insert: {
                alt_phone?: string | null
                created_at?: string
                created_by?: string | null
                deleted_at?: string | null
                email?: string | null
                employee_ref?: string | null
                full_name: string
                home_base?: string | null
                id?: string
                is_available?: boolean
                languages?: string[]
                licence_class?: string | null
                licence_expires_on?: string | null
                licence_number: string
                national_id?: string | null
                notes?: string | null
                phone: string
                photo_media_id?: string | null
                psv_badge_number?: string | null
                psv_expires_on?: string | null
                rating_average?: number | null
                rating_count?: number
                status?: string
                updated_at?: string
                updated_by?: string | null
                user_id?: string | null
                years_experience?: number | null
              }
              Update: {
                alt_phone?: string | null
                created_at?: string
                created_by?: string | null
                deleted_at?: string | null
                email?: string | null
                employee_ref?: string | null
                full_name?: string
                home_base?: string | null
                id?: string
                is_available?: boolean
                languages?: string[]
                licence_class?: string | null
                licence_expires_on?: string | null
                licence_number?: string
                national_id?: string | null
                notes?: string | null
                phone?: string
                photo_media_id?: string | null
                psv_badge_number?: string | null
                psv_expires_on?: string | null
                rating_average?: number | null
                rating_count?: number
                status?: string
                updated_at?: string
                updated_by?: string | null
                user_id?: string | null
                years_experience?: number | null
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_drivers_photo_media_id_fkey"
                  columns: ["photo_media_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_media"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_drivers_user_id_fkey"
                  columns: ["user_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_users"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_expenses: {
              Row: {
                amount: number
                approved_at: string | null
                approved_by: string | null
                booking_id: string | null
                category: string
                created_at: string
                created_by: string | null
                currency: string
                description: string
                driver_id: string | null
                expense_date: string
                id: string
                notes: string | null
                payment_method: string | null
                receipt_media_id: string | null
                reference: string
                rental_id: string | null
                status: string
                supplier_id: string | null
                updated_at: string
                vehicle_id: string | null
              }
              Insert: {
                amount: number
                approved_at?: string | null
                approved_by?: string | null
                booking_id?: string | null
                category: string
                created_at?: string
                created_by?: string | null
                currency?: string
                description: string
                driver_id?: string | null
                expense_date?: string
                id?: string
                notes?: string | null
                payment_method?: string | null
                receipt_media_id?: string | null
                reference?: string
                rental_id?: string | null
                status?: string
                supplier_id?: string | null
                updated_at?: string
                vehicle_id?: string | null
              }
              Update: {
                amount?: number
                approved_at?: string | null
                approved_by?: string | null
                booking_id?: string | null
                category?: string
                created_at?: string
                created_by?: string | null
                currency?: string
                description?: string
                driver_id?: string | null
                expense_date?: string
                id?: string
                notes?: string | null
                payment_method?: string | null
                receipt_media_id?: string | null
                reference?: string
                rental_id?: string | null
                status?: string
                supplier_id?: string | null
                updated_at?: string
                vehicle_id?: string | null
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_expenses_approved_by_fkey"
                  columns: ["approved_by"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_users"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_expenses_booking_id_fkey"
                  columns: ["booking_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_bookings"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_expenses_driver_id_fkey"
                  columns: ["driver_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_drivers"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_expenses_receipt_media_id_fkey"
                  columns: ["receipt_media_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_media"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_expenses_rental_id_fkey"
                  columns: ["rental_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_rentals"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_expenses_supplier_id_fkey"
                  columns: ["supplier_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_suppliers"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_expenses_vehicle_id_fkey"
                  columns: ["vehicle_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_vehicles"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_faqs: {
              Row: {
                answer: string
                category: string
                created_at: string
                display_order: number
                id: string
                is_active: boolean
                question: string
                updated_at: string
                updated_by: string | null
              }
              Insert: {
                answer: string
                category?: string
                created_at?: string
                display_order?: number
                id?: string
                is_active?: boolean
                question: string
                updated_at?: string
                updated_by?: string | null
              }
              Update: {
                answer?: string
                category?: string
                created_at?: string
                display_order?: number
                id?: string
                is_active?: boolean
                question?: string
                updated_at?: string
                updated_by?: string | null
              }
              Relationships: []
            }
      
            jemvoyage_fuel_records: {
              Row: {
                cost: number
                created_at: string
                created_by: string | null
                currency: string
                driver_id: string | null
                filled_at: string
                id: string
                litres: number
                mileage_km: number | null
                receipt_ref: string | null
                station: string | null
                vehicle_id: string
              }
              Insert: {
                cost: number
                created_at?: string
                created_by?: string | null
                currency?: string
                driver_id?: string | null
                filled_at?: string
                id?: string
                litres: number
                mileage_km?: number | null
                receipt_ref?: string | null
                station?: string | null
                vehicle_id: string
              }
              Update: {
                cost?: number
                created_at?: string
                created_by?: string | null
                currency?: string
                driver_id?: string | null
                filled_at?: string
                id?: string
                litres?: number
                mileage_km?: number | null
                receipt_ref?: string | null
                station?: string | null
                vehicle_id?: string
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_fuel_records_vehicle_id_fkey"
                  columns: ["vehicle_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_vehicles"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_guides: {
              Row: {
                bio: string | null
                certification: string | null
                certification_expires_on: string | null
                created_at: string
                created_by: string | null
                deleted_at: string | null
                email: string | null
                full_name: string
                id: string
                is_available: boolean
                languages: string[]
                phone: string | null
                photo_media_id: string | null
                rating_average: number | null
                rating_count: number
                specialisations: string[]
                status: string
                updated_at: string
                updated_by: string | null
                user_id: string | null
                years_experience: number | null
              }
              Insert: {
                bio?: string | null
                certification?: string | null
                certification_expires_on?: string | null
                created_at?: string
                created_by?: string | null
                deleted_at?: string | null
                email?: string | null
                full_name: string
                id?: string
                is_available?: boolean
                languages?: string[]
                phone?: string | null
                photo_media_id?: string | null
                rating_average?: number | null
                rating_count?: number
                specialisations?: string[]
                status?: string
                updated_at?: string
                updated_by?: string | null
                user_id?: string | null
                years_experience?: number | null
              }
              Update: {
                bio?: string | null
                certification?: string | null
                certification_expires_on?: string | null
                created_at?: string
                created_by?: string | null
                deleted_at?: string | null
                email?: string | null
                full_name?: string
                id?: string
                is_available?: boolean
                languages?: string[]
                phone?: string | null
                photo_media_id?: string | null
                rating_average?: number | null
                rating_count?: number
                specialisations?: string[]
                status?: string
                updated_at?: string
                updated_by?: string | null
                user_id?: string | null
                years_experience?: number | null
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_guides_photo_media_id_fkey"
                  columns: ["photo_media_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_media"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_guides_user_id_fkey"
                  columns: ["user_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_users"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_hero_slides: {
              Row: {
                created_at: string
                created_by: string | null
                cta_label: string | null
                cta_url: string | null
                desktop_media_id: string | null
                display_order: number
                ends_at: string | null
                eyebrow: string | null
                headline: string
                id: string
                is_active: boolean
                mobile_media_id: string | null
                overlay_opacity: number
                overlay_style: string
                placement: string
                secondary_cta_label: string | null
                secondary_cta_url: string | null
                starts_at: string | null
                subheadline: string | null
                updated_at: string
                updated_by: string | null
                video_url: string | null
              }
              Insert: {
                created_at?: string
                created_by?: string | null
                cta_label?: string | null
                cta_url?: string | null
                desktop_media_id?: string | null
                display_order?: number
                ends_at?: string | null
                eyebrow?: string | null
                headline: string
                id?: string
                is_active?: boolean
                mobile_media_id?: string | null
                overlay_opacity?: number
                overlay_style?: string
                placement?: string
                secondary_cta_label?: string | null
                secondary_cta_url?: string | null
                starts_at?: string | null
                subheadline?: string | null
                updated_at?: string
                updated_by?: string | null
                video_url?: string | null
              }
              Update: {
                created_at?: string
                created_by?: string | null
                cta_label?: string | null
                cta_url?: string | null
                desktop_media_id?: string | null
                display_order?: number
                ends_at?: string | null
                eyebrow?: string | null
                headline?: string
                id?: string
                is_active?: boolean
                mobile_media_id?: string | null
                overlay_opacity?: number
                overlay_style?: string
                placement?: string
                secondary_cta_label?: string | null
                secondary_cta_url?: string | null
                starts_at?: string | null
                subheadline?: string | null
                updated_at?: string
                updated_by?: string | null
                video_url?: string | null
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_hero_slides_desktop_media_id_fkey"
                  columns: ["desktop_media_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_media"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_hero_slides_mobile_media_id_fkey"
                  columns: ["mobile_media_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_media"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_homepage_sections: {
              Row: {
                body: string | null
                created_at: string
                cta_label: string | null
                cta_url: string | null
                display_order: number
                eyebrow: string | null
                heading: string
                id: string
                is_active: boolean
                item_limit: number
                layout: string
                media_id: string | null
                section_key: string
                subheading: string | null
                updated_at: string
                updated_by: string | null
              }
              Insert: {
                body?: string | null
                created_at?: string
                cta_label?: string | null
                cta_url?: string | null
                display_order?: number
                eyebrow?: string | null
                heading: string
                id?: string
                is_active?: boolean
                item_limit?: number
                layout?: string
                media_id?: string | null
                section_key: string
                subheading?: string | null
                updated_at?: string
                updated_by?: string | null
              }
              Update: {
                body?: string | null
                created_at?: string
                cta_label?: string | null
                cta_url?: string | null
                display_order?: number
                eyebrow?: string | null
                heading?: string
                id?: string
                is_active?: boolean
                item_limit?: number
                layout?: string
                media_id?: string | null
                section_key?: string
                subheading?: string | null
                updated_at?: string
                updated_by?: string | null
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_homepage_sections_media_id_fkey"
                  columns: ["media_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_media"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_insurance: {
              Row: {
                cover_type: string | null
                created_at: string
                currency: string
                document_media_id: string | null
                excess_amount: number | null
                expires_on: string
                id: string
                notes: string | null
                policy_number: string
                premium: number | null
                provider: string
                starts_on: string
                updated_at: string
                vehicle_id: string
              }
              Insert: {
                cover_type?: string | null
                created_at?: string
                currency?: string
                document_media_id?: string | null
                excess_amount?: number | null
                expires_on: string
                id?: string
                notes?: string | null
                policy_number: string
                premium?: number | null
                provider: string
                starts_on: string
                updated_at?: string
                vehicle_id: string
              }
              Update: {
                cover_type?: string | null
                created_at?: string
                currency?: string
                document_media_id?: string | null
                excess_amount?: number | null
                expires_on?: string
                id?: string
                notes?: string | null
                policy_number?: string
                premium?: number | null
                provider?: string
                starts_on?: string
                updated_at?: string
                vehicle_id?: string
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_insurance_document_media_id_fkey"
                  columns: ["document_media_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_media"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_insurance_vehicle_id_fkey"
                  columns: ["vehicle_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_vehicles"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_invoice_items: {
              Row: {
                created_at: string
                description: string
                display_order: number
                id: string
                invoice_id: string
                is_taxable: boolean
                line_total: number | null
                quantity: number
                unit_price: number
              }
              Insert: {
                created_at?: string
                description: string
                display_order?: number
                id?: string
                invoice_id: string
                is_taxable?: boolean
                line_total?: number | null
                quantity?: number
                unit_price?: number
              }
              Update: {
                created_at?: string
                description?: string
                display_order?: number
                id?: string
                invoice_id?: string
                is_taxable?: boolean
                line_total?: number | null
                quantity?: number
                unit_price?: number
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_invoice_items_invoice_id_fkey"
                  columns: ["invoice_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_invoices"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_invoices: {
              Row: {
                amount_paid: number
                balance_due: number | null
                booking_id: string | null
                corporate_account_id: string | null
                created_at: string
                created_by: string | null
                currency: string
                customer_id: string | null
                deleted_at: string | null
                discount_amount: number
                due_date: string | null
                id: string
                invoice_number: string
                invoice_type: string
                issue_date: string
                notes: string | null
                paid_at: string | null
                pdf_media_id: string | null
                rental_id: string | null
                sent_at: string | null
                status: string
                subtotal: number
                tax_amount: number
                tax_rate: number
                terms: string | null
                total: number
                travel_agent_id: string | null
                updated_at: string
                updated_by: string | null
              }
              Insert: {
                amount_paid?: number
                balance_due?: number | null
                booking_id?: string | null
                corporate_account_id?: string | null
                created_at?: string
                created_by?: string | null
                currency?: string
                customer_id?: string | null
                deleted_at?: string | null
                discount_amount?: number
                due_date?: string | null
                id?: string
                invoice_number?: string
                invoice_type?: string
                issue_date?: string
                notes?: string | null
                paid_at?: string | null
                pdf_media_id?: string | null
                rental_id?: string | null
                sent_at?: string | null
                status?: string
                subtotal?: number
                tax_amount?: number
                tax_rate?: number
                terms?: string | null
                total?: number
                travel_agent_id?: string | null
                updated_at?: string
                updated_by?: string | null
              }
              Update: {
                amount_paid?: number
                balance_due?: number | null
                booking_id?: string | null
                corporate_account_id?: string | null
                created_at?: string
                created_by?: string | null
                currency?: string
                customer_id?: string | null
                deleted_at?: string | null
                discount_amount?: number
                due_date?: string | null
                id?: string
                invoice_number?: string
                invoice_type?: string
                issue_date?: string
                notes?: string | null
                paid_at?: string | null
                pdf_media_id?: string | null
                rental_id?: string | null
                sent_at?: string | null
                status?: string
                subtotal?: number
                tax_amount?: number
                tax_rate?: number
                terms?: string | null
                total?: number
                travel_agent_id?: string | null
                updated_at?: string
                updated_by?: string | null
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_invoices_booking_id_fkey"
                  columns: ["booking_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_bookings"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_invoices_corporate_account_id_fkey"
                  columns: ["corporate_account_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_corporate_accounts"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_invoices_customer_id_fkey"
                  columns: ["customer_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_customers"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_invoices_pdf_media_id_fkey"
                  columns: ["pdf_media_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_media"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_invoices_rental_id_fkey"
                  columns: ["rental_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_rentals"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_invoices_travel_agent_id_fkey"
                  columns: ["travel_agent_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_travel_agents"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_lead_sources: {
              Row: {
                created_at: string
                display_order: number
                id: string
                is_active: boolean
                name: string
                slug: string
              }
              Insert: {
                created_at?: string
                display_order?: number
                id?: string
                is_active?: boolean
                name: string
                slug: string
              }
              Update: {
                created_at?: string
                display_order?: number
                id?: string
                is_active?: boolean
                name?: string
                slug?: string
              }
              Relationships: []
            }
      
            jemvoyage_leads: {
              Row: {
                adults: number
                budget_max: number | null
                budget_min: number | null
                children: number
                converted_at: string | null
                country: string | null
                created_at: string
                created_by: string | null
                currency: string
                customer_id: string | null
                deleted_at: string | null
                destination_id: string | null
                email: string | null
                full_name: string
                id: string
                lost_reason: string | null
                message: string | null
                next_action_at: string | null
                owner_id: string | null
                phone: string | null
                priority: string
                reference: string
                service_interest: string | null
                source_id: string | null
                stage: string
                tour_id: string | null
                travel_end_date: string | null
                travel_start_date: string | null
                updated_at: string
                updated_by: string | null
                vehicle_id: string | null
              }
              Insert: {
                adults?: number
                budget_max?: number | null
                budget_min?: number | null
                children?: number
                converted_at?: string | null
                country?: string | null
                created_at?: string
                created_by?: string | null
                currency?: string
                customer_id?: string | null
                deleted_at?: string | null
                destination_id?: string | null
                email?: string | null
                full_name: string
                id?: string
                lost_reason?: string | null
                message?: string | null
                next_action_at?: string | null
                owner_id?: string | null
                phone?: string | null
                priority?: string
                reference?: string
                service_interest?: string | null
                source_id?: string | null
                stage?: string
                tour_id?: string | null
                travel_end_date?: string | null
                travel_start_date?: string | null
                updated_at?: string
                updated_by?: string | null
                vehicle_id?: string | null
              }
              Update: {
                adults?: number
                budget_max?: number | null
                budget_min?: number | null
                children?: number
                converted_at?: string | null
                country?: string | null
                created_at?: string
                created_by?: string | null
                currency?: string
                customer_id?: string | null
                deleted_at?: string | null
                destination_id?: string | null
                email?: string | null
                full_name?: string
                id?: string
                lost_reason?: string | null
                message?: string | null
                next_action_at?: string | null
                owner_id?: string | null
                phone?: string | null
                priority?: string
                reference?: string
                service_interest?: string | null
                source_id?: string | null
                stage?: string
                tour_id?: string | null
                travel_end_date?: string | null
                travel_start_date?: string | null
                updated_at?: string
                updated_by?: string | null
                vehicle_id?: string | null
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_leads_customer_id_fkey"
                  columns: ["customer_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_customers"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_leads_destination_id_fkey"
                  columns: ["destination_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_destinations"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_leads_owner_id_fkey"
                  columns: ["owner_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_users"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_leads_source_id_fkey"
                  columns: ["source_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_lead_sources"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_leads_tour_id_fkey"
                  columns: ["tour_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_tours"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_leads_vehicle_id_fkey"
                  columns: ["vehicle_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_vehicles"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_maintenance: {
              Row: {
                completed_date: string | null
                cost: number | null
                created_at: string
                created_by: string | null
                currency: string
                description: string | null
                id: string
                invoice_ref: string | null
                maintenance_type: string
                mileage_km: number | null
                next_due_date: string | null
                next_due_km: number | null
                provider: string | null
                scheduled_date: string | null
                status: string
                title: string
                updated_at: string
                updated_by: string | null
                vehicle_id: string
              }
              Insert: {
                completed_date?: string | null
                cost?: number | null
                created_at?: string
                created_by?: string | null
                currency?: string
                description?: string | null
                id?: string
                invoice_ref?: string | null
                maintenance_type?: string
                mileage_km?: number | null
                next_due_date?: string | null
                next_due_km?: number | null
                provider?: string | null
                scheduled_date?: string | null
                status?: string
                title: string
                updated_at?: string
                updated_by?: string | null
                vehicle_id: string
              }
              Update: {
                completed_date?: string | null
                cost?: number | null
                created_at?: string
                created_by?: string | null
                currency?: string
                description?: string | null
                id?: string
                invoice_ref?: string | null
                maintenance_type?: string
                mileage_km?: number | null
                next_due_date?: string | null
                next_due_km?: number | null
                provider?: string | null
                scheduled_date?: string | null
                status?: string
                title?: string
                updated_at?: string
                updated_by?: string | null
                vehicle_id?: string
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_maintenance_vehicle_id_fkey"
                  columns: ["vehicle_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_vehicles"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_media: {
              Row: {
                alt_text: string | null
                blur_data_url: string | null
                caption: string | null
                category: string
                created_at: string
                credit: string | null
                deleted_at: string | null
                description: string | null
                external_url: string | null
                file_name: string | null
                file_path: string | null
                file_size: number | null
                focal_x: number
                focal_y: number
                height: number | null
                id: string
                is_active: boolean
                is_placeholder: boolean
                license: string | null
                mime_type: string | null
                source_url: string | null
                storage_bucket: string
                tags: string[]
                title: string | null
                updated_at: string
                uploaded_by: string | null
                width: number | null
              }
              Insert: {
                alt_text?: string | null
                blur_data_url?: string | null
                caption?: string | null
                category?: string
                created_at?: string
                credit?: string | null
                deleted_at?: string | null
                description?: string | null
                external_url?: string | null
                file_name?: string | null
                file_path?: string | null
                file_size?: number | null
                focal_x?: number
                focal_y?: number
                height?: number | null
                id?: string
                is_active?: boolean
                is_placeholder?: boolean
                license?: string | null
                mime_type?: string | null
                source_url?: string | null
                storage_bucket?: string
                tags?: string[]
                title?: string | null
                updated_at?: string
                uploaded_by?: string | null
                width?: number | null
              }
              Update: {
                alt_text?: string | null
                blur_data_url?: string | null
                caption?: string | null
                category?: string
                created_at?: string
                credit?: string | null
                deleted_at?: string | null
                description?: string | null
                external_url?: string | null
                file_name?: string | null
                file_path?: string | null
                file_size?: number | null
                focal_x?: number
                focal_y?: number
                height?: number | null
                id?: string
                is_active?: boolean
                is_placeholder?: boolean
                license?: string | null
                mime_type?: string | null
                source_url?: string | null
                storage_bucket?: string
                tags?: string[]
                title?: string | null
                updated_at?: string
                uploaded_by?: string | null
                width?: number | null
              }
              Relationships: []
            }
      
            jemvoyage_menu_items: {
              Row: {
                created_at: string
                description: string | null
                display_order: number
                icon: string | null
                id: string
                is_active: boolean
                label: string
                menu_id: string
                opens_new_tab: boolean
                parent_id: string | null
                updated_at: string
                url: string
              }
              Insert: {
                created_at?: string
                description?: string | null
                display_order?: number
                icon?: string | null
                id?: string
                is_active?: boolean
                label: string
                menu_id: string
                opens_new_tab?: boolean
                parent_id?: string | null
                updated_at?: string
                url: string
              }
              Update: {
                created_at?: string
                description?: string | null
                display_order?: number
                icon?: string | null
                id?: string
                is_active?: boolean
                label?: string
                menu_id?: string
                opens_new_tab?: boolean
                parent_id?: string | null
                updated_at?: string
                url?: string
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_menu_items_menu_id_fkey"
                  columns: ["menu_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_menus"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_menu_items_parent_id_fkey"
                  columns: ["parent_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_menu_items"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_menus: {
              Row: {
                created_at: string
                id: string
                key: string
                label: string
                updated_at: string
              }
              Insert: {
                created_at?: string
                id?: string
                key: string
                label: string
                updated_at?: string
              }
              Update: {
                created_at?: string
                id?: string
                key?: string
                label?: string
                updated_at?: string
              }
              Relationships: []
            }
      
            jemvoyage_newsletter_subscribers: {
              Row: {
                confirmed_at: string | null
                created_at: string
                email: string
                full_name: string | null
                id: string
                is_confirmed: boolean
                segments: string[]
                source: string
                unsubscribed_at: string | null
                updated_at: string
              }
              Insert: {
                confirmed_at?: string | null
                created_at?: string
                email: string
                full_name?: string | null
                id?: string
                is_confirmed?: boolean
                segments?: string[]
                source?: string
                unsubscribed_at?: string | null
                updated_at?: string
              }
              Update: {
                confirmed_at?: string | null
                created_at?: string
                email?: string
                full_name?: string | null
                id?: string
                is_confirmed?: boolean
                segments?: string[]
                source?: string
                unsubscribed_at?: string | null
                updated_at?: string
              }
              Relationships: []
            }
      
            jemvoyage_notification_templates: {
              Row: {
                body: string
                channel: string
                created_at: string
                id: string
                is_active: boolean
                key: string
                name: string
                subject: string | null
                updated_at: string
                updated_by: string | null
                variables: string[]
              }
              Insert: {
                body: string
                channel: string
                created_at?: string
                id?: string
                is_active?: boolean
                key: string
                name: string
                subject?: string | null
                updated_at?: string
                updated_by?: string | null
                variables?: string[]
              }
              Update: {
                body?: string
                channel?: string
                created_at?: string
                id?: string
                is_active?: boolean
                key?: string
                name?: string
                subject?: string | null
                updated_at?: string
                updated_by?: string | null
                variables?: string[]
              }
              Relationships: []
            }
      
            jemvoyage_notifications: {
              Row: {
                action_url: string | null
                body: string | null
                channel: string
                created_at: string
                customer_id: string | null
                entity_id: string | null
                entity_type: string | null
                error_message: string | null
                id: string
                priority: string
                read_at: string | null
                scheduled_for: string | null
                sent_at: string | null
                status: string
                template_id: string | null
                title: string
                updated_at: string
                user_id: string | null
              }
              Insert: {
                action_url?: string | null
                body?: string | null
                channel?: string
                created_at?: string
                customer_id?: string | null
                entity_id?: string | null
                entity_type?: string | null
                error_message?: string | null
                id?: string
                priority?: string
                read_at?: string | null
                scheduled_for?: string | null
                sent_at?: string | null
                status?: string
                template_id?: string | null
                title: string
                updated_at?: string
                user_id?: string | null
              }
              Update: {
                action_url?: string | null
                body?: string | null
                channel?: string
                created_at?: string
                customer_id?: string | null
                entity_id?: string | null
                entity_type?: string | null
                error_message?: string | null
                id?: string
                priority?: string
                read_at?: string | null
                scheduled_for?: string | null
                sent_at?: string | null
                status?: string
                template_id?: string | null
                title?: string
                updated_at?: string
                user_id?: string | null
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_notifications_customer_id_fkey"
                  columns: ["customer_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_customers"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_notifications_template_id_fkey"
                  columns: ["template_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_notification_templates"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_notifications_user_id_fkey"
                  columns: ["user_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_users"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_offers: {
              Row: {
                applies_to: string
                body: string | null
                created_at: string
                created_by: string | null
                discount_type: string | null
                discount_value: number | null
                display_order: number
                ends_at: string | null
                id: string
                is_active: boolean
                media_id: string | null
                promo_code: string | null
                slug: string
                starts_at: string | null
                summary: string | null
                terms: string | null
                title: string
                updated_at: string
                updated_by: string | null
              }
              Insert: {
                applies_to?: string
                body?: string | null
                created_at?: string
                created_by?: string | null
                discount_type?: string | null
                discount_value?: number | null
                display_order?: number
                ends_at?: string | null
                id?: string
                is_active?: boolean
                media_id?: string | null
                promo_code?: string | null
                slug: string
                starts_at?: string | null
                summary?: string | null
                terms?: string | null
                title: string
                updated_at?: string
                updated_by?: string | null
              }
              Update: {
                applies_to?: string
                body?: string | null
                created_at?: string
                created_by?: string | null
                discount_type?: string | null
                discount_value?: number | null
                display_order?: number
                ends_at?: string | null
                id?: string
                is_active?: boolean
                media_id?: string | null
                promo_code?: string | null
                slug?: string
                starts_at?: string | null
                summary?: string | null
                terms?: string | null
                title?: string
                updated_at?: string
                updated_by?: string | null
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_offers_media_id_fkey"
                  columns: ["media_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_media"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_payment_events: {
              Row: {
                error_message: string | null
                event_type: string
                external_id: string | null
                id: string
                payload: Json
                payment_id: string | null
                processed: boolean
                processed_at: string | null
                provider: string
                received_at: string
                signature_ok: boolean | null
              }
              Insert: {
                error_message?: string | null
                event_type: string
                external_id?: string | null
                id?: string
                payload: Json
                payment_id?: string | null
                processed?: boolean
                processed_at?: string | null
                provider: string
                received_at?: string
                signature_ok?: boolean | null
              }
              Update: {
                error_message?: string | null
                event_type?: string
                external_id?: string | null
                id?: string
                payload?: Json
                payment_id?: string | null
                processed?: boolean
                processed_at?: string | null
                provider?: string
                received_at?: string
                signature_ok?: boolean | null
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_payment_events_payment_id_fkey"
                  columns: ["payment_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_payments"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_payments: {
              Row: {
                amount: number
                bank_reference: string | null
                booking_id: string | null
                checkout_request_id: string | null
                created_at: string
                created_by: string | null
                currency: string
                customer_id: string | null
                failure_reason: string | null
                id: string
                invoice_id: string | null
                merchant_request_id: string | null
                method: string
                mpesa_receipt: string | null
                notes: string | null
                paid_at: string | null
                payer_name: string | null
                payer_phone: string | null
                payment_type: string
                provider: string | null
                provider_reference: string | null
                reference: string
                rental_id: string | null
                status: string
                updated_at: string
                verified_at: string | null
                verified_by: string | null
              }
              Insert: {
                amount: number
                bank_reference?: string | null
                booking_id?: string | null
                checkout_request_id?: string | null
                created_at?: string
                created_by?: string | null
                currency?: string
                customer_id?: string | null
                failure_reason?: string | null
                id?: string
                invoice_id?: string | null
                merchant_request_id?: string | null
                method: string
                mpesa_receipt?: string | null
                notes?: string | null
                paid_at?: string | null
                payer_name?: string | null
                payer_phone?: string | null
                payment_type?: string
                provider?: string | null
                provider_reference?: string | null
                reference?: string
                rental_id?: string | null
                status?: string
                updated_at?: string
                verified_at?: string | null
                verified_by?: string | null
              }
              Update: {
                amount?: number
                bank_reference?: string | null
                booking_id?: string | null
                checkout_request_id?: string | null
                created_at?: string
                created_by?: string | null
                currency?: string
                customer_id?: string | null
                failure_reason?: string | null
                id?: string
                invoice_id?: string | null
                merchant_request_id?: string | null
                method?: string
                mpesa_receipt?: string | null
                notes?: string | null
                paid_at?: string | null
                payer_name?: string | null
                payer_phone?: string | null
                payment_type?: string
                provider?: string | null
                provider_reference?: string | null
                reference?: string
                rental_id?: string | null
                status?: string
                updated_at?: string
                verified_at?: string | null
                verified_by?: string | null
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_payments_booking_id_fkey"
                  columns: ["booking_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_bookings"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_payments_customer_id_fkey"
                  columns: ["customer_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_customers"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_payments_invoice_id_fkey"
                  columns: ["invoice_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_invoices"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_payments_rental_id_fkey"
                  columns: ["rental_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_rentals"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_payments_verified_by_fkey"
                  columns: ["verified_by"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_users"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_permissions: {
              Row: {
                action: string
                created_at: string
                description: string | null
                id: string
                key: string
                label: string
                resource: string
              }
              Insert: {
                action: string
                created_at?: string
                description?: string | null
                id?: string
                key: string
                label: string
                resource: string
              }
              Update: {
                action?: string
                created_at?: string
                description?: string | null
                id?: string
                key?: string
                label?: string
                resource?: string
              }
              Relationships: []
            }
      
            jemvoyage_quote_items: {
              Row: {
                created_at: string
                description: string
                detail: string | null
                display_order: number
                id: string
                is_optional: boolean
                item_type: string
                line_cost: number | null
                line_total: number | null
                quantity: number
                quote_id: string
                reference_id: string | null
                service_date: string | null
                supplier_id: string | null
                unit: string | null
                unit_cost: number
                unit_price: number
                updated_at: string
              }
              Insert: {
                created_at?: string
                description: string
                detail?: string | null
                display_order?: number
                id?: string
                is_optional?: boolean
                item_type: string
                line_cost?: number | null
                line_total?: number | null
                quantity?: number
                quote_id: string
                reference_id?: string | null
                service_date?: string | null
                supplier_id?: string | null
                unit?: string | null
                unit_cost?: number
                unit_price?: number
                updated_at?: string
              }
              Update: {
                created_at?: string
                description?: string
                detail?: string | null
                display_order?: number
                id?: string
                is_optional?: boolean
                item_type?: string
                line_cost?: number | null
                line_total?: number | null
                quantity?: number
                quote_id?: string
                reference_id?: string | null
                service_date?: string | null
                supplier_id?: string | null
                unit?: string | null
                unit_cost?: number
                unit_price?: number
                updated_at?: string
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_quote_items_quote_id_fkey"
                  columns: ["quote_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_quotes"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_quote_items_supplier_id_fkey"
                  columns: ["supplier_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_suppliers"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_quote_versions: {
              Row: {
                change_note: string | null
                created_at: string
                created_by: string | null
                currency: string | null
                id: string
                quote_id: string
                snapshot: Json
                total: number | null
                version: number
              }
              Insert: {
                change_note?: string | null
                created_at?: string
                created_by?: string | null
                currency?: string | null
                id?: string
                quote_id: string
                snapshot: Json
                total?: number | null
                version: number
              }
              Update: {
                change_note?: string | null
                created_at?: string
                created_by?: string | null
                currency?: string | null
                id?: string
                quote_id?: string
                snapshot?: Json
                total?: number | null
                version?: number
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_quote_versions_quote_id_fkey"
                  columns: ["quote_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_quotes"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_quotes: {
              Row: {
                adults: number
                approved_at: string | null
                approved_by: string | null
                cancellation_terms: string | null
                children: number
                created_at: string
                created_by: string | null
                currency: string
                customer_id: string | null
                customer_notes: string | null
                deleted_at: string | null
                discount_amount: number
                exclusions: string[]
                id: string
                inclusions: string[]
                internal_notes: string | null
                lead_id: string | null
                markup_amount: number
                owner_id: string | null
                payment_terms: string | null
                pdf_media_id: string | null
                reference: string
                responded_at: string | null
                sent_at: string | null
                service_type: string
                status: string
                subtotal: number
                summary: string | null
                supplier_cost: number
                tax_amount: number
                title: string
                total: number
                tour_id: string | null
                travel_end_date: string | null
                travel_start_date: string | null
                updated_at: string
                updated_by: string | null
                valid_until: string | null
                version: number
              }
              Insert: {
                adults?: number
                approved_at?: string | null
                approved_by?: string | null
                cancellation_terms?: string | null
                children?: number
                created_at?: string
                created_by?: string | null
                currency?: string
                customer_id?: string | null
                customer_notes?: string | null
                deleted_at?: string | null
                discount_amount?: number
                exclusions?: string[]
                id?: string
                inclusions?: string[]
                internal_notes?: string | null
                lead_id?: string | null
                markup_amount?: number
                owner_id?: string | null
                payment_terms?: string | null
                pdf_media_id?: string | null
                reference?: string
                responded_at?: string | null
                sent_at?: string | null
                service_type?: string
                status?: string
                subtotal?: number
                summary?: string | null
                supplier_cost?: number
                tax_amount?: number
                title: string
                total?: number
                tour_id?: string | null
                travel_end_date?: string | null
                travel_start_date?: string | null
                updated_at?: string
                updated_by?: string | null
                valid_until?: string | null
                version?: number
              }
              Update: {
                adults?: number
                approved_at?: string | null
                approved_by?: string | null
                cancellation_terms?: string | null
                children?: number
                created_at?: string
                created_by?: string | null
                currency?: string
                customer_id?: string | null
                customer_notes?: string | null
                deleted_at?: string | null
                discount_amount?: number
                exclusions?: string[]
                id?: string
                inclusions?: string[]
                internal_notes?: string | null
                lead_id?: string | null
                markup_amount?: number
                owner_id?: string | null
                payment_terms?: string | null
                pdf_media_id?: string | null
                reference?: string
                responded_at?: string | null
                sent_at?: string | null
                service_type?: string
                status?: string
                subtotal?: number
                summary?: string | null
                supplier_cost?: number
                tax_amount?: number
                title?: string
                total?: number
                tour_id?: string | null
                travel_end_date?: string | null
                travel_start_date?: string | null
                updated_at?: string
                updated_by?: string | null
                valid_until?: string | null
                version?: number
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_quotes_approved_by_fkey"
                  columns: ["approved_by"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_users"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_quotes_customer_id_fkey"
                  columns: ["customer_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_customers"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_quotes_lead_id_fkey"
                  columns: ["lead_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_leads"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_quotes_owner_id_fkey"
                  columns: ["owner_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_users"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_quotes_pdf_media_id_fkey"
                  columns: ["pdf_media_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_media"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_quotes_tour_id_fkey"
                  columns: ["tour_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_tours"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_refunds: {
              Row: {
                amount: number
                approved_at: string | null
                approved_by: string | null
                booking_id: string | null
                created_at: string
                currency: string
                customer_id: string | null
                id: string
                invoice_id: string | null
                method: string | null
                notes: string | null
                payment_id: string | null
                processed_at: string | null
                provider_reference: string | null
                reason: string
                reference: string
                refund_type: string
                rental_id: string | null
                requested_by: string | null
                status: string
                updated_at: string
              }
              Insert: {
                amount: number
                approved_at?: string | null
                approved_by?: string | null
                booking_id?: string | null
                created_at?: string
                currency?: string
                customer_id?: string | null
                id?: string
                invoice_id?: string | null
                method?: string | null
                notes?: string | null
                payment_id?: string | null
                processed_at?: string | null
                provider_reference?: string | null
                reason: string
                reference?: string
                refund_type?: string
                rental_id?: string | null
                requested_by?: string | null
                status?: string
                updated_at?: string
              }
              Update: {
                amount?: number
                approved_at?: string | null
                approved_by?: string | null
                booking_id?: string | null
                created_at?: string
                currency?: string
                customer_id?: string | null
                id?: string
                invoice_id?: string | null
                method?: string | null
                notes?: string | null
                payment_id?: string | null
                processed_at?: string | null
                provider_reference?: string | null
                reason?: string
                reference?: string
                refund_type?: string
                rental_id?: string | null
                requested_by?: string | null
                status?: string
                updated_at?: string
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_refunds_approved_by_fkey"
                  columns: ["approved_by"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_users"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_refunds_booking_id_fkey"
                  columns: ["booking_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_bookings"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_refunds_customer_id_fkey"
                  columns: ["customer_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_customers"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_refunds_invoice_id_fkey"
                  columns: ["invoice_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_invoices"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_refunds_payment_id_fkey"
                  columns: ["payment_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_payments"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_refunds_rental_id_fkey"
                  columns: ["rental_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_rentals"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_refunds_requested_by_fkey"
                  columns: ["requested_by"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_users"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_rental_agreements: {
              Row: {
                agreement_number: string
                created_at: string
                created_by: string | null
                document_media_id: string | null
                id: string
                rental_id: string
                signature_ip: unknown
                signed_at: string | null
                signed_by_name: string | null
                snapshot: Json | null
                status: string
                terms: string | null
                updated_at: string
                version: number
              }
              Insert: {
                agreement_number?: string
                created_at?: string
                created_by?: string | null
                document_media_id?: string | null
                id?: string
                rental_id: string
                signature_ip?: unknown
                signed_at?: string | null
                signed_by_name?: string | null
                snapshot?: Json | null
                status?: string
                terms?: string | null
                updated_at?: string
                version?: number
              }
              Update: {
                agreement_number?: string
                created_at?: string
                created_by?: string | null
                document_media_id?: string | null
                id?: string
                rental_id?: string
                signature_ip?: unknown
                signed_at?: string | null
                signed_by_name?: string | null
                snapshot?: Json | null
                status?: string
                terms?: string | null
                updated_at?: string
                version?: number
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_rental_agreements_document_media_id_fkey"
                  columns: ["document_media_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_media"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_rental_agreements_rental_id_fkey"
                  columns: ["rental_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_rentals"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_rental_charges: {
              Row: {
                amount: number | null
                charge_type: string
                charged_at: string | null
                created_at: string
                created_by: string | null
                currency: string
                description: string
                id: string
                is_taxable: boolean
                notes: string | null
                quantity: number
                rental_id: string
                status: string
                unit_amount: number
                updated_at: string
              }
              Insert: {
                amount?: number | null
                charge_type: string
                charged_at?: string | null
                created_at?: string
                created_by?: string | null
                currency?: string
                description: string
                id?: string
                is_taxable?: boolean
                notes?: string | null
                quantity?: number
                rental_id: string
                status?: string
                unit_amount?: number
                updated_at?: string
              }
              Update: {
                amount?: number | null
                charge_type?: string
                charged_at?: string | null
                created_at?: string
                created_by?: string | null
                currency?: string
                description?: string
                id?: string
                is_taxable?: boolean
                notes?: string | null
                quantity?: number
                rental_id?: string
                status?: string
                unit_amount?: number
                updated_at?: string
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_rental_charges_rental_id_fkey"
                  columns: ["rental_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_rentals"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_rental_damage_media: {
              Row: {
                caption: string | null
                damage_report_id: string
                display_order: number
                media_id: string
              }
              Insert: {
                caption?: string | null
                damage_report_id: string
                display_order?: number
                media_id: string
              }
              Update: {
                caption?: string | null
                damage_report_id?: string
                display_order?: number
                media_id?: string
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_rental_damage_media_damage_report_id_fkey"
                  columns: ["damage_report_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_rental_damage_reports"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_rental_damage_media_media_id_fkey"
                  columns: ["media_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_media"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_rental_damage_reports: {
              Row: {
                actual_cost: number | null
                area: string
                charged_to_customer: boolean
                created_at: string
                created_by: string | null
                currency: string
                description: string
                estimated_cost: number | null
                id: string
                insurance_claim_ref: string | null
                is_pre_existing: boolean
                post_inspection_id: string | null
                pre_inspection_id: string | null
                rental_id: string
                reported_at: string
                resolution_notes: string | null
                severity: string
                status: string
                updated_at: string
              }
              Insert: {
                actual_cost?: number | null
                area: string
                charged_to_customer?: boolean
                created_at?: string
                created_by?: string | null
                currency?: string
                description: string
                estimated_cost?: number | null
                id?: string
                insurance_claim_ref?: string | null
                is_pre_existing?: boolean
                post_inspection_id?: string | null
                pre_inspection_id?: string | null
                rental_id: string
                reported_at?: string
                resolution_notes?: string | null
                severity?: string
                status?: string
                updated_at?: string
              }
              Update: {
                actual_cost?: number | null
                area?: string
                charged_to_customer?: boolean
                created_at?: string
                created_by?: string | null
                currency?: string
                description?: string
                estimated_cost?: number | null
                id?: string
                insurance_claim_ref?: string | null
                is_pre_existing?: boolean
                post_inspection_id?: string | null
                pre_inspection_id?: string | null
                rental_id?: string
                reported_at?: string
                resolution_notes?: string | null
                severity?: string
                status?: string
                updated_at?: string
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_rental_damage_reports_post_inspection_id_fkey"
                  columns: ["post_inspection_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_rental_inspections"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_rental_damage_reports_pre_inspection_id_fkey"
                  columns: ["pre_inspection_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_rental_inspections"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_rental_damage_reports_rental_id_fkey"
                  columns: ["rental_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_rentals"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_rental_deposits: {
              Row: {
                amount_received: number
                amount_required: number
                created_at: string
                created_by: string | null
                currency: string
                damage_deduction: number
                fuel_deduction: number
                id: string
                late_return_deduction: number
                method: string | null
                notes: string | null
                other_deduction: number
                other_deduction_note: string | null
                received_at: string | null
                refund_amount: number | null
                refund_reference: string | null
                refund_status: string
                refunded_at: string | null
                rental_id: string
                total_deductions: number | null
                updated_at: string
                updated_by: string | null
              }
              Insert: {
                amount_received?: number
                amount_required?: number
                created_at?: string
                created_by?: string | null
                currency?: string
                damage_deduction?: number
                fuel_deduction?: number
                id?: string
                late_return_deduction?: number
                method?: string | null
                notes?: string | null
                other_deduction?: number
                other_deduction_note?: string | null
                received_at?: string | null
                refund_amount?: number | null
                refund_reference?: string | null
                refund_status?: string
                refunded_at?: string | null
                rental_id: string
                total_deductions?: number | null
                updated_at?: string
                updated_by?: string | null
              }
              Update: {
                amount_received?: number
                amount_required?: number
                created_at?: string
                created_by?: string | null
                currency?: string
                damage_deduction?: number
                fuel_deduction?: number
                id?: string
                late_return_deduction?: number
                method?: string | null
                notes?: string | null
                other_deduction?: number
                other_deduction_note?: string | null
                received_at?: string | null
                refund_amount?: number | null
                refund_reference?: string | null
                refund_status?: string
                refunded_at?: string | null
                rental_id?: string
                total_deductions?: number | null
                updated_at?: string
                updated_by?: string | null
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_rental_deposits_rental_id_fkey"
                  columns: ["rental_id"]
                  isOneToOne: true
                  referencedRelation: "jemvoyage_rentals"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_rental_extensions: {
              Row: {
                additional_amount: number
                additional_days: number
                approved_at: string | null
                approved_by: string | null
                created_at: string
                created_by: string | null
                currency: string
                daily_rate: number
                decline_reason: string | null
                id: string
                new_ends_at: string
                notes: string | null
                paid_at: string | null
                previous_ends_at: string
                rental_id: string
                requested_at: string
                status: string
                updated_at: string
              }
              Insert: {
                additional_amount?: number
                additional_days: number
                approved_at?: string | null
                approved_by?: string | null
                created_at?: string
                created_by?: string | null
                currency?: string
                daily_rate?: number
                decline_reason?: string | null
                id?: string
                new_ends_at: string
                notes?: string | null
                paid_at?: string | null
                previous_ends_at: string
                rental_id: string
                requested_at?: string
                status?: string
                updated_at?: string
              }
              Update: {
                additional_amount?: number
                additional_days?: number
                approved_at?: string | null
                approved_by?: string | null
                created_at?: string
                created_by?: string | null
                currency?: string
                daily_rate?: number
                decline_reason?: string | null
                id?: string
                new_ends_at?: string
                notes?: string | null
                paid_at?: string | null
                previous_ends_at?: string
                rental_id?: string
                requested_at?: string
                status?: string
                updated_at?: string
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_rental_extensions_approved_by_fkey"
                  columns: ["approved_by"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_users"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_rental_extensions_rental_id_fkey"
                  columns: ["rental_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_rentals"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_rental_inspection_media: {
              Row: {
                angle: string | null
                caption: string | null
                created_at: string
                display_order: number
                inspection_id: string
                media_id: string
              }
              Insert: {
                angle?: string | null
                caption?: string | null
                created_at?: string
                display_order?: number
                inspection_id: string
                media_id: string
              }
              Update: {
                angle?: string | null
                caption?: string | null
                created_at?: string
                display_order?: number
                inspection_id?: string
                media_id?: string
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_rental_inspection_media_inspection_id_fkey"
                  columns: ["inspection_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_rental_inspections"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_rental_inspection_media_media_id_fkey"
                  columns: ["media_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_media"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_rental_inspections: {
              Row: {
                created_at: string
                created_by: string | null
                customer_signature_name: string | null
                customer_signed_at: string | null
                documents_present: boolean | null
                existing_damage: string | null
                exterior_notes: string | null
                first_aid_present: boolean | null
                fuel_level: string | null
                id: string
                inspected_at: string
                inspection_type: string
                inspector_id: string | null
                interior_notes: string | null
                jack_present: boolean | null
                mileage_km: number | null
                rental_id: string
                spare_tyre_present: boolean | null
                tools_present: boolean | null
                triangle_present: boolean | null
                tyres_condition: string | null
                updated_at: string
              }
              Insert: {
                created_at?: string
                created_by?: string | null
                customer_signature_name?: string | null
                customer_signed_at?: string | null
                documents_present?: boolean | null
                existing_damage?: string | null
                exterior_notes?: string | null
                first_aid_present?: boolean | null
                fuel_level?: string | null
                id?: string
                inspected_at?: string
                inspection_type: string
                inspector_id?: string | null
                interior_notes?: string | null
                jack_present?: boolean | null
                mileage_km?: number | null
                rental_id: string
                spare_tyre_present?: boolean | null
                tools_present?: boolean | null
                triangle_present?: boolean | null
                tyres_condition?: string | null
                updated_at?: string
              }
              Update: {
                created_at?: string
                created_by?: string | null
                customer_signature_name?: string | null
                customer_signed_at?: string | null
                documents_present?: boolean | null
                existing_damage?: string | null
                exterior_notes?: string | null
                first_aid_present?: boolean | null
                fuel_level?: string | null
                id?: string
                inspected_at?: string
                inspection_type?: string
                inspector_id?: string | null
                interior_notes?: string | null
                jack_present?: boolean | null
                mileage_km?: number | null
                rental_id?: string
                spare_tyre_present?: boolean | null
                tools_present?: boolean | null
                triangle_present?: boolean | null
                tyres_condition?: string | null
                updated_at?: string
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_rental_inspections_inspector_id_fkey"
                  columns: ["inspector_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_users"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_rental_inspections_rental_id_fkey"
                  columns: ["rental_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_rentals"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_rentals: {
              Row: {
                amount_paid: number
                availability_id: string | null
                balance_due: number | null
                booking_id: string | null
                created_at: string
                created_by: string | null
                currency: string
                customer_id: string
                daily_rate: number
                deleted_at: string | null
                discount_amount: number
                drive_type: string
                driver_id: string | null
                dropoff_location: string
                end_fuel_level: string | null
                end_mileage_km: number | null
                ends_at: string
                excess_mileage_rate: number | null
                extras_total: number
                id: string
                mileage_allowance_km: number | null
                notes: string | null
                pickup_location: string
                rate_id: string | null
                reference: string
                rental_days: number
                returned_at: string | null
                start_fuel_level: string | null
                start_mileage_km: number | null
                starts_at: string
                status: string
                subtotal: number
                tax_amount: number
                total: number
                updated_at: string
                updated_by: string | null
                vehicle_id: string
              }
              Insert: {
                amount_paid?: number
                availability_id?: string | null
                balance_due?: number | null
                booking_id?: string | null
                created_at?: string
                created_by?: string | null
                currency?: string
                customer_id: string
                daily_rate?: number
                deleted_at?: string | null
                discount_amount?: number
                drive_type?: string
                driver_id?: string | null
                dropoff_location: string
                end_fuel_level?: string | null
                end_mileage_km?: number | null
                ends_at: string
                excess_mileage_rate?: number | null
                extras_total?: number
                id?: string
                mileage_allowance_km?: number | null
                notes?: string | null
                pickup_location: string
                rate_id?: string | null
                reference?: string
                rental_days?: number
                returned_at?: string | null
                start_fuel_level?: string | null
                start_mileage_km?: number | null
                starts_at: string
                status?: string
                subtotal?: number
                tax_amount?: number
                total?: number
                updated_at?: string
                updated_by?: string | null
                vehicle_id: string
              }
              Update: {
                amount_paid?: number
                availability_id?: string | null
                balance_due?: number | null
                booking_id?: string | null
                created_at?: string
                created_by?: string | null
                currency?: string
                customer_id?: string
                daily_rate?: number
                deleted_at?: string | null
                discount_amount?: number
                drive_type?: string
                driver_id?: string | null
                dropoff_location?: string
                end_fuel_level?: string | null
                end_mileage_km?: number | null
                ends_at?: string
                excess_mileage_rate?: number | null
                extras_total?: number
                id?: string
                mileage_allowance_km?: number | null
                notes?: string | null
                pickup_location?: string
                rate_id?: string | null
                reference?: string
                rental_days?: number
                returned_at?: string | null
                start_fuel_level?: string | null
                start_mileage_km?: number | null
                starts_at?: string
                status?: string
                subtotal?: number
                tax_amount?: number
                total?: number
                updated_at?: string
                updated_by?: string | null
                vehicle_id?: string
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_rentals_availability_id_fkey"
                  columns: ["availability_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_vehicle_availability"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_rentals_booking_id_fkey"
                  columns: ["booking_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_bookings"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_rentals_customer_id_fkey"
                  columns: ["customer_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_customers"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_rentals_driver_id_fkey"
                  columns: ["driver_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_drivers"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_rentals_rate_id_fkey"
                  columns: ["rate_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_vehicle_rates"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_rentals_vehicle_id_fkey"
                  columns: ["vehicle_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_vehicles"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_reviews: {
              Row: {
                author_country: string | null
                author_name: string
                body: string
                booking_id: string | null
                created_at: string
                customer_id: string | null
                deleted_at: string | null
                destination_id: string | null
                driver_id: string | null
                guide_id: string | null
                id: string
                is_featured: boolean
                moderated_at: string | null
                moderated_by: string | null
                moderation_notes: string | null
                rating_accommodation: number | null
                rating_communication: number | null
                rating_driver: number | null
                rating_guide: number | null
                rating_overall: number
                rating_tour: number | null
                rating_vehicle: number | null
                rental_id: string | null
                response_at: string | null
                response_body: string | null
                status: string
                title: string | null
                tour_id: string | null
                travelled_on: string | null
                updated_at: string
                vehicle_id: string | null
              }
              Insert: {
                author_country?: string | null
                author_name: string
                body: string
                booking_id?: string | null
                created_at?: string
                customer_id?: string | null
                deleted_at?: string | null
                destination_id?: string | null
                driver_id?: string | null
                guide_id?: string | null
                id?: string
                is_featured?: boolean
                moderated_at?: string | null
                moderated_by?: string | null
                moderation_notes?: string | null
                rating_accommodation?: number | null
                rating_communication?: number | null
                rating_driver?: number | null
                rating_guide?: number | null
                rating_overall: number
                rating_tour?: number | null
                rating_vehicle?: number | null
                rental_id?: string | null
                response_at?: string | null
                response_body?: string | null
                status?: string
                title?: string | null
                tour_id?: string | null
                travelled_on?: string | null
                updated_at?: string
                vehicle_id?: string | null
              }
              Update: {
                author_country?: string | null
                author_name?: string
                body?: string
                booking_id?: string | null
                created_at?: string
                customer_id?: string | null
                deleted_at?: string | null
                destination_id?: string | null
                driver_id?: string | null
                guide_id?: string | null
                id?: string
                is_featured?: boolean
                moderated_at?: string | null
                moderated_by?: string | null
                moderation_notes?: string | null
                rating_accommodation?: number | null
                rating_communication?: number | null
                rating_driver?: number | null
                rating_guide?: number | null
                rating_overall?: number
                rating_tour?: number | null
                rating_vehicle?: number | null
                rental_id?: string | null
                response_at?: string | null
                response_body?: string | null
                status?: string
                title?: string | null
                tour_id?: string | null
                travelled_on?: string | null
                updated_at?: string
                vehicle_id?: string | null
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_reviews_booking_id_fkey"
                  columns: ["booking_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_bookings"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_reviews_customer_id_fkey"
                  columns: ["customer_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_customers"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_reviews_destination_id_fkey"
                  columns: ["destination_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_destinations"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_reviews_driver_id_fkey"
                  columns: ["driver_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_drivers"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_reviews_guide_id_fkey"
                  columns: ["guide_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_guides"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_reviews_moderated_by_fkey"
                  columns: ["moderated_by"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_users"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_reviews_rental_id_fkey"
                  columns: ["rental_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_rentals"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_reviews_tour_id_fkey"
                  columns: ["tour_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_tours"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_reviews_vehicle_id_fkey"
                  columns: ["vehicle_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_vehicles"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_role_permissions: {
              Row: {
                created_at: string
                permission_id: string
                role_id: string
              }
              Insert: {
                created_at?: string
                permission_id: string
                role_id: string
              }
              Update: {
                created_at?: string
                permission_id?: string
                role_id?: string
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_role_permissions_permission_id_fkey"
                  columns: ["permission_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_permissions"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_role_permissions_role_id_fkey"
                  columns: ["role_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_roles"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_roles: {
              Row: {
                created_at: string
                description: string | null
                display_order: number
                id: string
                is_staff: boolean
                is_system: boolean
                label: string
                name: string
                updated_at: string
              }
              Insert: {
                created_at?: string
                description?: string | null
                display_order?: number
                id?: string
                is_staff?: boolean
                is_system?: boolean
                label: string
                name: string
                updated_at?: string
              }
              Update: {
                created_at?: string
                description?: string | null
                display_order?: number
                id?: string
                is_staff?: boolean
                is_system?: boolean
                label?: string
                name?: string
                updated_at?: string
              }
              Relationships: []
            }
      
            jemvoyage_sales_activities: {
              Row: {
                activity_type: string
                completed_at: string | null
                created_at: string
                created_by: string | null
                customer_id: string | null
                due_at: string | null
                id: string
                lead_id: string | null
                notes: string | null
                outcome: string | null
                owner_id: string | null
                subject: string
                updated_at: string
              }
              Insert: {
                activity_type: string
                completed_at?: string | null
                created_at?: string
                created_by?: string | null
                customer_id?: string | null
                due_at?: string | null
                id?: string
                lead_id?: string | null
                notes?: string | null
                outcome?: string | null
                owner_id?: string | null
                subject: string
                updated_at?: string
              }
              Update: {
                activity_type?: string
                completed_at?: string | null
                created_at?: string
                created_by?: string | null
                customer_id?: string | null
                due_at?: string | null
                id?: string
                lead_id?: string | null
                notes?: string | null
                outcome?: string | null
                owner_id?: string | null
                subject?: string
                updated_at?: string
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_sales_activities_customer_id_fkey"
                  columns: ["customer_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_customers"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_sales_activities_lead_id_fkey"
                  columns: ["lead_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_leads"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_sales_activities_owner_id_fkey"
                  columns: ["owner_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_users"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_seo_metadata: {
              Row: {
                canonical_url: string | null
                created_at: string
                created_by: string | null
                entity_id: string | null
                entity_type: string
                id: string
                keywords: string[]
                meta_description: string | null
                og_description: string | null
                og_media_id: string | null
                og_title: string | null
                path: string | null
                robots: string
                schema_json: Json | null
                schema_type: string | null
                seo_title: string | null
                updated_at: string
                updated_by: string | null
              }
              Insert: {
                canonical_url?: string | null
                created_at?: string
                created_by?: string | null
                entity_id?: string | null
                entity_type: string
                id?: string
                keywords?: string[]
                meta_description?: string | null
                og_description?: string | null
                og_media_id?: string | null
                og_title?: string | null
                path?: string | null
                robots?: string
                schema_json?: Json | null
                schema_type?: string | null
                seo_title?: string | null
                updated_at?: string
                updated_by?: string | null
              }
              Update: {
                canonical_url?: string | null
                created_at?: string
                created_by?: string | null
                entity_id?: string | null
                entity_type?: string
                id?: string
                keywords?: string[]
                meta_description?: string | null
                og_description?: string | null
                og_media_id?: string | null
                og_title?: string | null
                path?: string | null
                robots?: string
                schema_json?: Json | null
                schema_type?: string | null
                seo_title?: string | null
                updated_at?: string
                updated_by?: string | null
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_seo_metadata_og_media_id_fkey"
                  columns: ["og_media_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_media"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_settings: {
              Row: {
                description: string | null
                group_name: string
                is_public: boolean
                key: string
                label: string | null
                updated_at: string
                updated_by: string | null
                value: Json
              }
              Insert: {
                description?: string | null
                group_name?: string
                is_public?: boolean
                key: string
                label?: string | null
                updated_at?: string
                updated_by?: string | null
                value?: Json
              }
              Update: {
                description?: string | null
                group_name?: string
                is_public?: boolean
                key?: string
                label?: string | null
                updated_at?: string
                updated_by?: string | null
                value?: Json
              }
              Relationships: []
            }
      
            jemvoyage_supplier_contracts: {
              Row: {
                cancellation_terms: string | null
                commission_rate: number | null
                created_at: string
                created_by: string | null
                document_media_id: string | null
                ends_on: string | null
                id: string
                notes: string | null
                payment_terms: string | null
                reference: string | null
                starts_on: string
                status: string
                supplier_id: string
                title: string
                updated_at: string
              }
              Insert: {
                cancellation_terms?: string | null
                commission_rate?: number | null
                created_at?: string
                created_by?: string | null
                document_media_id?: string | null
                ends_on?: string | null
                id?: string
                notes?: string | null
                payment_terms?: string | null
                reference?: string | null
                starts_on: string
                status?: string
                supplier_id: string
                title: string
                updated_at?: string
              }
              Update: {
                cancellation_terms?: string | null
                commission_rate?: number | null
                created_at?: string
                created_by?: string | null
                document_media_id?: string | null
                ends_on?: string | null
                id?: string
                notes?: string | null
                payment_terms?: string | null
                reference?: string | null
                starts_on?: string
                status?: string
                supplier_id?: string
                title?: string
                updated_at?: string
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_supplier_contracts_document_media_id_fkey"
                  columns: ["document_media_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_media"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_supplier_contracts_supplier_id_fkey"
                  columns: ["supplier_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_suppliers"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_supplier_rates: {
              Row: {
                created_at: string
                currency: string
                id: string
                is_active: boolean
                meal_plan: string | null
                min_nights: number | null
                name: string
                net_rate: number
                notes: string | null
                occupancy: string | null
                published_rate: number | null
                rate_type: string
                season: string | null
                supplier_id: string
                updated_at: string
                valid_from: string | null
                valid_to: string | null
              }
              Insert: {
                created_at?: string
                currency?: string
                id?: string
                is_active?: boolean
                meal_plan?: string | null
                min_nights?: number | null
                name: string
                net_rate: number
                notes?: string | null
                occupancy?: string | null
                published_rate?: number | null
                rate_type?: string
                season?: string | null
                supplier_id: string
                updated_at?: string
                valid_from?: string | null
                valid_to?: string | null
              }
              Update: {
                created_at?: string
                currency?: string
                id?: string
                is_active?: boolean
                meal_plan?: string | null
                min_nights?: number | null
                name?: string
                net_rate?: number
                notes?: string | null
                occupancy?: string | null
                published_rate?: number | null
                rate_type?: string
                season?: string | null
                supplier_id?: string
                updated_at?: string
                valid_from?: string | null
                valid_to?: string | null
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_supplier_rates_supplier_id_fkey"
                  columns: ["supplier_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_suppliers"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_suppliers: {
              Row: {
                address: string | null
                city: string | null
                commission_rate: number | null
                contact_name: string | null
                country: string
                created_at: string
                created_by: string | null
                currency: string
                deleted_at: string | null
                destination_id: string | null
                email: string | null
                id: string
                is_active: boolean
                is_preferred: boolean
                media_id: string | null
                name: string
                notes: string | null
                payment_terms: string | null
                phone: string | null
                rating: number | null
                slug: string
                supplier_type: string
                tax_pin: string | null
                updated_at: string
                updated_by: string | null
                website: string | null
              }
              Insert: {
                address?: string | null
                city?: string | null
                commission_rate?: number | null
                contact_name?: string | null
                country?: string
                created_at?: string
                created_by?: string | null
                currency?: string
                deleted_at?: string | null
                destination_id?: string | null
                email?: string | null
                id?: string
                is_active?: boolean
                is_preferred?: boolean
                media_id?: string | null
                name: string
                notes?: string | null
                payment_terms?: string | null
                phone?: string | null
                rating?: number | null
                slug: string
                supplier_type: string
                tax_pin?: string | null
                updated_at?: string
                updated_by?: string | null
                website?: string | null
              }
              Update: {
                address?: string | null
                city?: string | null
                commission_rate?: number | null
                contact_name?: string | null
                country?: string
                created_at?: string
                created_by?: string | null
                currency?: string
                deleted_at?: string | null
                destination_id?: string | null
                email?: string | null
                id?: string
                is_active?: boolean
                is_preferred?: boolean
                media_id?: string | null
                name?: string
                notes?: string | null
                payment_terms?: string | null
                phone?: string | null
                rating?: number | null
                slug?: string
                supplier_type?: string
                tax_pin?: string | null
                updated_at?: string
                updated_by?: string | null
                website?: string | null
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_suppliers_destination_id_fkey"
                  columns: ["destination_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_destinations"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_suppliers_media_id_fkey"
                  columns: ["media_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_media"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_tour_activities: {
              Row: {
                activity_id: string
                tour_id: string
              }
              Insert: {
                activity_id: string
                tour_id: string
              }
              Update: {
                activity_id?: string
                tour_id?: string
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_tour_activities_activity_id_fkey"
                  columns: ["activity_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_activities"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_tour_activities_tour_id_fkey"
                  columns: ["tour_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_tours"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_tour_availability: {
              Row: {
                capacity: number
                created_at: string
                currency: string | null
                end_date: string
                id: string
                notes: string | null
                price_override: number | null
                seats_booked: number
                start_date: string
                status: string
                tour_id: string
                updated_at: string
              }
              Insert: {
                capacity?: number
                created_at?: string
                currency?: string | null
                end_date: string
                id?: string
                notes?: string | null
                price_override?: number | null
                seats_booked?: number
                start_date: string
                status?: string
                tour_id: string
                updated_at?: string
              }
              Update: {
                capacity?: number
                created_at?: string
                currency?: string | null
                end_date?: string
                id?: string
                notes?: string | null
                price_override?: number | null
                seats_booked?: number
                start_date?: string
                status?: string
                tour_id?: string
                updated_at?: string
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_tour_availability_tour_id_fkey"
                  columns: ["tour_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_tours"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_tour_categories: {
              Row: {
                created_at: string
                description: string | null
                display_order: number
                id: string
                is_active: boolean
                media_id: string | null
                name: string
                slug: string
                updated_at: string
              }
              Insert: {
                created_at?: string
                description?: string | null
                display_order?: number
                id?: string
                is_active?: boolean
                media_id?: string | null
                name: string
                slug: string
                updated_at?: string
              }
              Update: {
                created_at?: string
                description?: string | null
                display_order?: number
                id?: string
                is_active?: boolean
                media_id?: string | null
                name?: string
                slug?: string
                updated_at?: string
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_tour_categories_media_id_fkey"
                  columns: ["media_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_media"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_tour_destinations: {
              Row: {
                destination_id: string
                display_order: number
                tour_id: string
              }
              Insert: {
                destination_id: string
                display_order?: number
                tour_id: string
              }
              Update: {
                destination_id?: string
                display_order?: number
                tour_id?: string
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_tour_destinations_destination_id_fkey"
                  columns: ["destination_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_destinations"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_tour_destinations_tour_id_fkey"
                  columns: ["tour_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_tours"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_tour_itineraries: {
              Row: {
                accommodation: string | null
                created_at: string
                day_number: number
                description: string | null
                destination_id: string | null
                distance_km: number | null
                driving_time_minutes: number | null
                id: string
                meals: string | null
                media_id: string | null
                overnight_location: string | null
                title: string
                tour_id: string
                updated_at: string
              }
              Insert: {
                accommodation?: string | null
                created_at?: string
                day_number: number
                description?: string | null
                destination_id?: string | null
                distance_km?: number | null
                driving_time_minutes?: number | null
                id?: string
                meals?: string | null
                media_id?: string | null
                overnight_location?: string | null
                title: string
                tour_id: string
                updated_at?: string
              }
              Update: {
                accommodation?: string | null
                created_at?: string
                day_number?: number
                description?: string | null
                destination_id?: string | null
                distance_km?: number | null
                driving_time_minutes?: number | null
                id?: string
                meals?: string | null
                media_id?: string | null
                overnight_location?: string | null
                title?: string
                tour_id?: string
                updated_at?: string
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_tour_itineraries_destination_id_fkey"
                  columns: ["destination_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_destinations"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_tour_itineraries_media_id_fkey"
                  columns: ["media_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_media"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_tour_itineraries_tour_id_fkey"
                  columns: ["tour_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_tours"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_tour_media: {
              Row: {
                created_at: string
                display_order: number
                media_id: string
                tour_id: string
              }
              Insert: {
                created_at?: string
                display_order?: number
                media_id: string
                tour_id: string
              }
              Update: {
                created_at?: string
                display_order?: number
                media_id?: string
                tour_id?: string
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_tour_media_media_id_fkey"
                  columns: ["media_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_media"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_tour_media_tour_id_fkey"
                  columns: ["tour_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_tours"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_tours: {
              Row: {
                accommodation_summary: string | null
                best_months: number[]
                category_id: string | null
                created_at: string
                created_by: string | null
                currency: string
                deleted_at: string | null
                description: string | null
                difficulty: string | null
                display_order: number
                duration_days: number
                duration_nights: number
                exclusions: string[]
                id: string
                inclusions: string[]
                is_featured: boolean
                is_private: boolean
                map_media_id: string | null
                max_travellers: number | null
                meals_summary: string | null
                min_travellers: number
                price_basis: string
                price_from: number | null
                primary_destination_id: string | null
                primary_media_id: string | null
                published_at: string | null
                slug: string
                social_media_id: string | null
                status: string
                subtitle: string | null
                summary: string | null
                thumbnail_media_id: string | null
                title: string
                transport_summary: string | null
                updated_at: string
                updated_by: string | null
                video_url: string | null
              }
              Insert: {
                accommodation_summary?: string | null
                best_months?: number[]
                category_id?: string | null
                created_at?: string
                created_by?: string | null
                currency?: string
                deleted_at?: string | null
                description?: string | null
                difficulty?: string | null
                display_order?: number
                duration_days?: number
                duration_nights?: number
                exclusions?: string[]
                id?: string
                inclusions?: string[]
                is_featured?: boolean
                is_private?: boolean
                map_media_id?: string | null
                max_travellers?: number | null
                meals_summary?: string | null
                min_travellers?: number
                price_basis?: string
                price_from?: number | null
                primary_destination_id?: string | null
                primary_media_id?: string | null
                published_at?: string | null
                slug: string
                social_media_id?: string | null
                status?: string
                subtitle?: string | null
                summary?: string | null
                thumbnail_media_id?: string | null
                title: string
                transport_summary?: string | null
                updated_at?: string
                updated_by?: string | null
                video_url?: string | null
              }
              Update: {
                accommodation_summary?: string | null
                best_months?: number[]
                category_id?: string | null
                created_at?: string
                created_by?: string | null
                currency?: string
                deleted_at?: string | null
                description?: string | null
                difficulty?: string | null
                display_order?: number
                duration_days?: number
                duration_nights?: number
                exclusions?: string[]
                id?: string
                inclusions?: string[]
                is_featured?: boolean
                is_private?: boolean
                map_media_id?: string | null
                max_travellers?: number | null
                meals_summary?: string | null
                min_travellers?: number
                price_basis?: string
                price_from?: number | null
                primary_destination_id?: string | null
                primary_media_id?: string | null
                published_at?: string | null
                slug?: string
                social_media_id?: string | null
                status?: string
                subtitle?: string | null
                summary?: string | null
                thumbnail_media_id?: string | null
                title?: string
                transport_summary?: string | null
                updated_at?: string
                updated_by?: string | null
                video_url?: string | null
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_tours_category_id_fkey"
                  columns: ["category_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_tour_categories"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_tours_map_media_id_fkey"
                  columns: ["map_media_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_media"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_tours_primary_destination_id_fkey"
                  columns: ["primary_destination_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_destinations"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_tours_primary_media_id_fkey"
                  columns: ["primary_media_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_media"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_tours_social_media_id_fkey"
                  columns: ["social_media_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_media"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_tours_thumbnail_media_id_fkey"
                  columns: ["thumbnail_media_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_media"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_transfers: {
              Row: {
                airport_code: string | null
                arrived_at: string | null
                booking_id: string | null
                cancelled_at: string | null
                completed_at: string | null
                created_at: string
                created_by: string | null
                currency: string
                customer_id: string | null
                driver_assigned_at: string | null
                driver_id: string | null
                dropoff_location: string
                en_route_at: string | null
                flight_number: string | null
                flight_scheduled_at: string | null
                id: string
                instructions: string | null
                luggage_count: number | null
                meet_and_greet: boolean
                name_board_text: string | null
                passengers: number
                picked_up_at: string | null
                pickup_location: string
                price: number | null
                reference: string
                scheduled_at: string
                status: string
                terminal: string | null
                transfer_type: string
                updated_at: string
                updated_by: string | null
                vehicle_id: string | null
              }
              Insert: {
                airport_code?: string | null
                arrived_at?: string | null
                booking_id?: string | null
                cancelled_at?: string | null
                completed_at?: string | null
                created_at?: string
                created_by?: string | null
                currency?: string
                customer_id?: string | null
                driver_assigned_at?: string | null
                driver_id?: string | null
                dropoff_location: string
                en_route_at?: string | null
                flight_number?: string | null
                flight_scheduled_at?: string | null
                id?: string
                instructions?: string | null
                luggage_count?: number | null
                meet_and_greet?: boolean
                name_board_text?: string | null
                passengers?: number
                picked_up_at?: string | null
                pickup_location: string
                price?: number | null
                reference?: string
                scheduled_at: string
                status?: string
                terminal?: string | null
                transfer_type?: string
                updated_at?: string
                updated_by?: string | null
                vehicle_id?: string | null
              }
              Update: {
                airport_code?: string | null
                arrived_at?: string | null
                booking_id?: string | null
                cancelled_at?: string | null
                completed_at?: string | null
                created_at?: string
                created_by?: string | null
                currency?: string
                customer_id?: string | null
                driver_assigned_at?: string | null
                driver_id?: string | null
                dropoff_location?: string
                en_route_at?: string | null
                flight_number?: string | null
                flight_scheduled_at?: string | null
                id?: string
                instructions?: string | null
                luggage_count?: number | null
                meet_and_greet?: boolean
                name_board_text?: string | null
                passengers?: number
                picked_up_at?: string | null
                pickup_location?: string
                price?: number | null
                reference?: string
                scheduled_at?: string
                status?: string
                terminal?: string | null
                transfer_type?: string
                updated_at?: string
                updated_by?: string | null
                vehicle_id?: string | null
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_transfers_booking_id_fkey"
                  columns: ["booking_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_bookings"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_transfers_customer_id_fkey"
                  columns: ["customer_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_customers"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_transfers_driver_id_fkey"
                  columns: ["driver_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_drivers"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_transfers_vehicle_id_fkey"
                  columns: ["vehicle_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_vehicles"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_travel_agents: {
              Row: {
                address: string | null
                agency_name: string
                approved_at: string | null
                approved_by: string | null
                city: string | null
                commission_rate: number
                contact_name: string | null
                country: string | null
                created_at: string
                created_by: string | null
                credit_limit: number
                credit_terms_days: number
                current_balance: number
                deleted_at: string | null
                email: string
                iata_number: string | null
                id: string
                net_rates_enabled: boolean
                notes: string | null
                phone: string | null
                reference: string
                status: string
                tax_pin: string | null
                updated_at: string
                updated_by: string | null
                user_id: string | null
              }
              Insert: {
                address?: string | null
                agency_name: string
                approved_at?: string | null
                approved_by?: string | null
                city?: string | null
                commission_rate?: number
                contact_name?: string | null
                country?: string | null
                created_at?: string
                created_by?: string | null
                credit_limit?: number
                credit_terms_days?: number
                current_balance?: number
                deleted_at?: string | null
                email: string
                iata_number?: string | null
                id?: string
                net_rates_enabled?: boolean
                notes?: string | null
                phone?: string | null
                reference?: string
                status?: string
                tax_pin?: string | null
                updated_at?: string
                updated_by?: string | null
                user_id?: string | null
              }
              Update: {
                address?: string | null
                agency_name?: string
                approved_at?: string | null
                approved_by?: string | null
                city?: string | null
                commission_rate?: number
                contact_name?: string | null
                country?: string | null
                created_at?: string
                created_by?: string | null
                credit_limit?: number
                credit_terms_days?: number
                current_balance?: number
                deleted_at?: string | null
                email?: string
                iata_number?: string | null
                id?: string
                net_rates_enabled?: boolean
                notes?: string | null
                phone?: string | null
                reference?: string
                status?: string
                tax_pin?: string | null
                updated_at?: string
                updated_by?: string | null
                user_id?: string | null
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_travel_agents_approved_by_fkey"
                  columns: ["approved_by"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_users"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_travel_agents_user_id_fkey"
                  columns: ["user_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_users"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_travellers: {
              Row: {
                booking_id: string
                created_at: string
                date_of_birth: string | null
                dietary_requirements: string | null
                email: string | null
                emergency_contact_name: string | null
                emergency_contact_phone: string | null
                full_name: string
                id: string
                is_lead: boolean
                medical_notes: string | null
                nationality: string | null
                passport_expires_on: string | null
                passport_number: string | null
                phone: string | null
                traveller_type: string
                updated_at: string
              }
              Insert: {
                booking_id: string
                created_at?: string
                date_of_birth?: string | null
                dietary_requirements?: string | null
                email?: string | null
                emergency_contact_name?: string | null
                emergency_contact_phone?: string | null
                full_name: string
                id?: string
                is_lead?: boolean
                medical_notes?: string | null
                nationality?: string | null
                passport_expires_on?: string | null
                passport_number?: string | null
                phone?: string | null
                traveller_type?: string
                updated_at?: string
              }
              Update: {
                booking_id?: string
                created_at?: string
                date_of_birth?: string | null
                dietary_requirements?: string | null
                email?: string | null
                emergency_contact_name?: string | null
                emergency_contact_phone?: string | null
                full_name?: string
                id?: string
                is_lead?: boolean
                medical_notes?: string | null
                nationality?: string | null
                passport_expires_on?: string | null
                passport_number?: string | null
                phone?: string | null
                traveller_type?: string
                updated_at?: string
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_travellers_booking_id_fkey"
                  columns: ["booking_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_bookings"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_user_roles: {
              Row: {
                assigned_at: string
                assigned_by: string | null
                role_id: string
                user_id: string
              }
              Insert: {
                assigned_at?: string
                assigned_by?: string | null
                role_id: string
                user_id: string
              }
              Update: {
                assigned_at?: string
                assigned_by?: string | null
                role_id?: string
                user_id?: string
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_user_roles_role_id_fkey"
                  columns: ["role_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_roles"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_user_roles_user_id_fkey"
                  columns: ["user_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_users"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_users: {
              Row: {
                avatar_media_id: string | null
                bio: string | null
                created_at: string
                created_by: string | null
                deleted_at: string | null
                email: string | null
                full_name: string
                id: string
                is_active: boolean
                job_title: string | null
                last_seen_at: string | null
                locale: string
                phone: string | null
                timezone: string
                updated_at: string
                updated_by: string | null
              }
              Insert: {
                avatar_media_id?: string | null
                bio?: string | null
                created_at?: string
                created_by?: string | null
                deleted_at?: string | null
                email?: string | null
                full_name: string
                id: string
                is_active?: boolean
                job_title?: string | null
                last_seen_at?: string | null
                locale?: string
                phone?: string | null
                timezone?: string
                updated_at?: string
                updated_by?: string | null
              }
              Update: {
                avatar_media_id?: string | null
                bio?: string | null
                created_at?: string
                created_by?: string | null
                deleted_at?: string | null
                email?: string | null
                full_name?: string
                id?: string
                is_active?: boolean
                job_title?: string | null
                last_seen_at?: string | null
                locale?: string
                phone?: string | null
                timezone?: string
                updated_at?: string
                updated_by?: string | null
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_users_avatar_media_fk"
                  columns: ["avatar_media_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_media"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_vehicle_availability: {
              Row: {
                created_at: string
                created_by: string | null
                hold_type: string
                id: string
                notes: string | null
                period: unknown
                reference_id: string | null
                status: string
                updated_at: string
                vehicle_id: string
              }
              Insert: {
                created_at?: string
                created_by?: string | null
                hold_type: string
                id?: string
                notes?: string | null
                period: unknown
                reference_id?: string | null
                status?: string
                updated_at?: string
                vehicle_id: string
              }
              Update: {
                created_at?: string
                created_by?: string | null
                hold_type?: string
                id?: string
                notes?: string | null
                period?: unknown
                reference_id?: string | null
                status?: string
                updated_at?: string
                vehicle_id?: string
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_vehicle_availability_vehicle_id_fkey"
                  columns: ["vehicle_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_vehicles"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_vehicle_categories: {
              Row: {
                created_at: string
                description: string | null
                display_order: number
                id: string
                is_active: boolean
                is_four_wheel: boolean
                media_id: string | null
                name: string
                slug: string
                typical_seats: number | null
                updated_at: string
              }
              Insert: {
                created_at?: string
                description?: string | null
                display_order?: number
                id?: string
                is_active?: boolean
                is_four_wheel?: boolean
                media_id?: string | null
                name: string
                slug: string
                typical_seats?: number | null
                updated_at?: string
              }
              Update: {
                created_at?: string
                description?: string | null
                display_order?: number
                id?: string
                is_active?: boolean
                is_four_wheel?: boolean
                media_id?: string | null
                name?: string
                slug?: string
                typical_seats?: number | null
                updated_at?: string
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_vehicle_categories_media_id_fkey"
                  columns: ["media_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_media"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_vehicle_documents: {
              Row: {
                created_at: string
                document_type: string
                expires_on: string | null
                id: string
                issued_on: string | null
                media_id: string | null
                notes: string | null
                reference: string | null
                updated_at: string
                vehicle_id: string
              }
              Insert: {
                created_at?: string
                document_type: string
                expires_on?: string | null
                id?: string
                issued_on?: string | null
                media_id?: string | null
                notes?: string | null
                reference?: string | null
                updated_at?: string
                vehicle_id: string
              }
              Update: {
                created_at?: string
                document_type?: string
                expires_on?: string | null
                id?: string
                issued_on?: string | null
                media_id?: string | null
                notes?: string | null
                reference?: string | null
                updated_at?: string
                vehicle_id?: string
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_vehicle_documents_media_id_fkey"
                  columns: ["media_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_media"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_vehicle_documents_vehicle_id_fkey"
                  columns: ["vehicle_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_vehicles"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_vehicle_feature_map: {
              Row: {
                feature_id: string
                vehicle_id: string
              }
              Insert: {
                feature_id: string
                vehicle_id: string
              }
              Update: {
                feature_id?: string
                vehicle_id?: string
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_vehicle_feature_map_feature_id_fkey"
                  columns: ["feature_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_vehicle_features"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_vehicle_feature_map_vehicle_id_fkey"
                  columns: ["vehicle_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_vehicles"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_vehicle_features: {
              Row: {
                created_at: string
                display_order: number
                icon: string | null
                id: string
                name: string
                slug: string
              }
              Insert: {
                created_at?: string
                display_order?: number
                icon?: string | null
                id?: string
                name: string
                slug: string
              }
              Update: {
                created_at?: string
                display_order?: number
                icon?: string | null
                id?: string
                name?: string
                slug?: string
              }
              Relationships: []
            }
      
            jemvoyage_vehicle_images: {
              Row: {
                angle: string | null
                created_at: string
                display_order: number
                id: string
                media_id: string
                vehicle_id: string
              }
              Insert: {
                angle?: string | null
                created_at?: string
                display_order?: number
                id?: string
                media_id: string
                vehicle_id: string
              }
              Update: {
                angle?: string | null
                created_at?: string
                display_order?: number
                id?: string
                media_id?: string
                vehicle_id?: string
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_vehicle_images_media_id_fkey"
                  columns: ["media_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_media"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_vehicle_images_vehicle_id_fkey"
                  columns: ["vehicle_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_vehicles"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_vehicle_rates: {
              Row: {
                category_id: string | null
                created_at: string
                created_by: string | null
                currency: string
                daily_mileage_km: number | null
                daily_rate: number | null
                drive_type: string
                driver_daily_fee: number | null
                excess_mileage_rate: number | null
                id: string
                is_active: boolean
                monthly_rate: number | null
                security_deposit: number | null
                updated_at: string
                updated_by: string | null
                valid_from: string | null
                valid_to: string | null
                vehicle_id: string | null
                weekly_rate: number | null
              }
              Insert: {
                category_id?: string | null
                created_at?: string
                created_by?: string | null
                currency?: string
                daily_mileage_km?: number | null
                daily_rate?: number | null
                drive_type?: string
                driver_daily_fee?: number | null
                excess_mileage_rate?: number | null
                id?: string
                is_active?: boolean
                monthly_rate?: number | null
                security_deposit?: number | null
                updated_at?: string
                updated_by?: string | null
                valid_from?: string | null
                valid_to?: string | null
                vehicle_id?: string | null
                weekly_rate?: number | null
              }
              Update: {
                category_id?: string | null
                created_at?: string
                created_by?: string | null
                currency?: string
                daily_mileage_km?: number | null
                daily_rate?: number | null
                drive_type?: string
                driver_daily_fee?: number | null
                excess_mileage_rate?: number | null
                id?: string
                is_active?: boolean
                monthly_rate?: number | null
                security_deposit?: number | null
                updated_at?: string
                updated_by?: string | null
                valid_from?: string | null
                valid_to?: string | null
                vehicle_id?: string | null
                weekly_rate?: number | null
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_vehicle_rates_category_id_fkey"
                  columns: ["category_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_vehicle_categories"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_vehicle_rates_vehicle_id_fkey"
                  columns: ["vehicle_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_vehicles"
                  referencedColumns: ["id"]
                },
              ]
            }
      
            jemvoyage_vehicles: {
              Row: {
                category_id: string | null
                colour: string | null
                created_at: string
                created_by: string | null
                current_mileage_km: number
                deleted_at: string | null
                description: string | null
                display_order: number
                fuel_type: string
                has_gps: boolean
                home_location: string | null
                id: string
                is_four_wheel: boolean
                is_published: boolean
                luggage_capacity: number | null
                make: string
                model: string
                primary_media_id: string | null
                purchase_date: string | null
                purchase_value: number | null
                registration: string
                rental_terms: string | null
                seats: number
                slug: string
                status: string
                supports_chauffeur: boolean
                supports_self_drive: boolean
                transmission: string
                updated_at: string
                updated_by: string | null
                vin: string | null
                year: number | null
              }
              Insert: {
                category_id?: string | null
                colour?: string | null
                created_at?: string
                created_by?: string | null
                current_mileage_km?: number
                deleted_at?: string | null
                description?: string | null
                display_order?: number
                fuel_type?: string
                has_gps?: boolean
                home_location?: string | null
                id?: string
                is_four_wheel?: boolean
                is_published?: boolean
                luggage_capacity?: number | null
                make: string
                model: string
                primary_media_id?: string | null
                purchase_date?: string | null
                purchase_value?: number | null
                registration: string
                rental_terms?: string | null
                seats?: number
                slug: string
                status?: string
                supports_chauffeur?: boolean
                supports_self_drive?: boolean
                transmission?: string
                updated_at?: string
                updated_by?: string | null
                vin?: string | null
                year?: number | null
              }
              Update: {
                category_id?: string | null
                colour?: string | null
                created_at?: string
                created_by?: string | null
                current_mileage_km?: number
                deleted_at?: string | null
                description?: string | null
                display_order?: number
                fuel_type?: string
                has_gps?: boolean
                home_location?: string | null
                id?: string
                is_four_wheel?: boolean
                is_published?: boolean
                luggage_capacity?: number | null
                make?: string
                model?: string
                primary_media_id?: string | null
                purchase_date?: string | null
                purchase_value?: number | null
                registration?: string
                rental_terms?: string | null
                seats?: number
                slug?: string
                status?: string
                supports_chauffeur?: boolean
                supports_self_drive?: boolean
                transmission?: string
                updated_at?: string
                updated_by?: string | null
                vin?: string | null
                year?: number | null
              }
              Relationships: [
                {
                  foreignKeyName: "jemvoyage_vehicles_category_id_fkey"
                  columns: ["category_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_vehicle_categories"
                  referencedColumns: ["id"]
                },
                {
                  foreignKeyName: "jemvoyage_vehicles_primary_media_id_fkey"
                  columns: ["primary_media_id"]
                  isOneToOne: false
                  referencedRelation: "jemvoyage_media"
                  referencedColumns: ["id"]
                },
              ]
            }
    }
    Views: Record<never, never>
    Functions: {
      
            jemvoyage_attach_touch: { Args: { p_table: unknown }; Returns: undefined }
      
            jemvoyage_can_view_rental: {
              Args: { p_rental_id: string }
              Returns: boolean
            }
      
            jemvoyage_has_permission: { Args: { p_key: string }; Returns: boolean }
      
            jemvoyage_has_role: { Args: { p_role: string }; Returns: boolean }
      
            jemvoyage_is_staff: { Args: never; Returns: boolean }
      
            jemvoyage_is_super_admin: { Args: never; Returns: boolean }
      
            jemvoyage_my_agent_id: { Args: never; Returns: string }
      
            jemvoyage_my_corporate_accounts: { Args: never; Returns: string[] }
      
            jemvoyage_my_permissions: { Args: never; Returns: string[] }
      
            jemvoyage_next_reference: { Args: { p_kind: string }; Returns: string }
      
            jemvoyage_owns_customer: {
              Args: { p_customer_id: string }
              Returns: boolean
            }
      
            jemvoyage_resolve_media: {
              Args: { p_category?: string; p_media_id: string }
              Returns: {
                alt_text: string | null
                blur_data_url: string | null
                caption: string | null
                category: string
                created_at: string
                credit: string | null
                deleted_at: string | null
                description: string | null
                external_url: string | null
                file_name: string | null
                file_path: string | null
                file_size: number | null
                focal_x: number
                focal_y: number
                height: number | null
                id: string
                is_active: boolean
                is_placeholder: boolean
                license: string | null
                mime_type: string | null
                source_url: string | null
                storage_bucket: string
                tags: string[]
                title: string | null
                updated_at: string
                uploaded_by: string | null
                width: number | null
              }
              SetofOptions: {
                from: "*"
                to: "jemvoyage_media"
                isOneToOne: true
                isSetofReturn: false
              }
            }
      
            jemvoyage_slugify: { Args: { p_input: string }; Returns: string }
      
            jemvoyage_vehicle_is_available: {
              Args: { p_from: string; p_to: string; p_vehicle_id: string }
              Returns: boolean
            }
    }
    Enums: Record<never, never>
    CompositeTypes: Record<never, never>
  }
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"]
export type InsertDto<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"]
export type UpdateDto<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"]
