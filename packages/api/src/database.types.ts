/** Hand-written mirror of the Postgres schema in supabase/migrations. */
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          preferences: string[];
          club_member: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & { id: string };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
      venues: {
        Row: {
          id: string;
          name: string;
          slug: string;
          category: string;
          description: string | null;
          address: string | null;
          lat: number;
          lng: number;
          photos: string[];
          price_level: number;
          rating: number | null;
          is_partner: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["venues"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["venues"]["Row"]>;
        Relationships: [];
      };
      happy_hours: {
        Row: {
          id: string;
          venue_id: string;
          title: string;
          description: string | null;
          days_of_week: number[];
          start_time: string;
          end_time: string;
          is_active: boolean;
        };
        Insert: Partial<Database["public"]["Tables"]["happy_hours"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["happy_hours"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "happy_hours_venue_id_fkey";
            columns: ["venue_id"];
            isOneToOne: false;
            referencedRelation: "venues";
            referencedColumns: ["id"];
          },
        ];
      };
      events: {
        Row: {
          id: string;
          venue_id: string;
          title: string;
          description: string | null;
          category: string;
          starts_at: string;
          ends_at: string;
          price_from: number | null;
          capacity: number | null;
          photos: string[];
        };
        Insert: Partial<Database["public"]["Tables"]["events"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["events"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "events_venue_id_fkey";
            columns: ["venue_id"];
            isOneToOne: false;
            referencedRelation: "venues";
            referencedColumns: ["id"];
          },
        ];
      };
      favorites: {
        Row: { user_id: string; venue_id: string; created_at: string };
        Insert: { user_id: string; venue_id: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["favorites"]["Row"]>;
        Relationships: [];
      };
      bookings: {
        Row: {
          id: string;
          user_id: string;
          venue_id: string;
          event_id: string | null;
          booking_type: string;
          party_size: number;
          scheduled_at: string;
          status: string;
          amount: number | null;
          commission: number | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["bookings"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["bookings"]["Row"]>;
        Relationships: [];
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          stripe_subscription_id: string | null;
          status: string;
          current_period_end: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["subscriptions"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["subscriptions"]["Row"]>;
        Relationships: [];
      };
      waitlist: {
        Row: { id: string; email: string; created_at: string };
        Insert: { id?: string; email: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["waitlist"]["Row"]>;
        Relationships: [];
      };
      partner_leads: {
        Row: {
          id: string;
          name: string;
          venue_name: string;
          email: string;
          phone: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["partner_leads"]["Row"]> & {
          name: string;
          venue_name: string;
          email: string;
        };
        Update: Partial<Database["public"]["Tables"]["partner_leads"]["Row"]>;
        Relationships: [];
      };
      offers: {
        Row: {
          id: string;
          venue_id: string;
          happy_hour_id: string | null;
          title: string;
          description: string | null;
          discount_label: string;
          is_exclusive: boolean;
          estimated_saving: number;
          status: string;
          last_verified_at: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["offers"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["offers"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "offers_venue_id_fkey";
            columns: ["venue_id"];
            isOneToOne: false;
            referencedRelation: "venues";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "offers_happy_hour_id_fkey";
            columns: ["happy_hour_id"];
            isOneToOne: false;
            referencedRelation: "happy_hours";
            referencedColumns: ["id"];
          },
        ];
      };
      offer_redemptions: {
        Row: {
          id: string;
          offer_id: string;
          user_id: string;
          code: string;
          qr_payload: string;
          activated_at: string;
          expires_at: string;
          redeemed_at: string | null;
          saving_amount: number;
        };
        Insert: Partial<Database["public"]["Tables"]["offer_redemptions"]["Row"]> & {
          offer_id: string;
          user_id: string;
          code: string;
          qr_payload: string;
          expires_at: string;
        };
        Update: Partial<Database["public"]["Tables"]["offer_redemptions"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "offer_redemptions_offer_id_fkey";
            columns: ["offer_id"];
            isOneToOne: false;
            referencedRelation: "offers";
            referencedColumns: ["id"];
          },
        ];
      };
      offer_reports: {
        Row: {
          id: string;
          offer_id: string;
          user_id: string;
          vote: string;
          photo_url: string | null;
          comment: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["offer_reports"]["Row"]> & {
          offer_id: string;
          user_id: string;
          vote: string;
        };
        Update: Partial<Database["public"]["Tables"]["offer_reports"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "offer_reports_offer_id_fkey";
            columns: ["offer_id"];
            isOneToOne: false;
            referencedRelation: "offers";
            referencedColumns: ["id"];
          },
        ];
      };
      group_plans: {
        Row: {
          id: string;
          creator_id: string;
          share_slug: string;
          party_size: number;
          budget_level: number;
          area: string | null;
          suggested_venue_ids: string[];
          status: string;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["group_plans"]["Row"]> & {
          creator_id: string;
          share_slug: string;
        };
        Update: Partial<Database["public"]["Tables"]["group_plans"]["Row"]>;
        Relationships: [];
      };
      plan_votes: {
        Row: {
          id: string;
          plan_id: string;
          venue_id: string;
          voter_name: string;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["plan_votes"]["Row"]> & {
          plan_id: string;
          venue_id: string;
          voter_name: string;
        };
        Update: Partial<Database["public"]["Tables"]["plan_votes"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "plan_votes_plan_id_fkey";
            columns: ["plan_id"];
            isOneToOne: false;
            referencedRelation: "group_plans";
            referencedColumns: ["id"];
          },
        ];
      };
      check_ins: {
        Row: {
          user_id: string;
          venue_id: string;
          redemption_id: string | null;
          district: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["check_ins"]["Row"]> & {
          user_id: string;
          venue_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["check_ins"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      submit_offer_report: {
        Args: {
          p_offer_id: string;
          p_user_id: string;
          p_vote: string;
          p_photo_url?: string | null;
          p_comment?: string | null;
        };
        Returns: void;
      };
    };
  };
}
