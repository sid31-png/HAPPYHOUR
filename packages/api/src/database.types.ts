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
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
