export type VenueCategory = "bar" | "cafe" | "rooftop" | "restaurant";

export type EventCategory = "live_music" | "party" | "experience" | "other";

export type BookingType = "table" | "ticket";

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export type UserPreference = "bars" | "cafes" | "events" | "experiences";

export type OfferStatus = "active" | "to_verify" | "paused";

export type OfferVote = "up" | "down";

export type GroupPlanStatus = "open" | "decided" | "cancelled";

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  preferences: UserPreference[];
  club_member: boolean;
  created_at: string;
}

export interface Venue {
  id: string;
  name: string;
  slug: string;
  category: VenueCategory;
  description: string | null;
  address: string | null;
  lat: number;
  lng: number;
  photos: string[];
  price_level: number;
  rating: number | null;
  is_partner: boolean;
  created_at: string;
}

export interface HappyHour {
  id: string;
  venue_id: string;
  title: string;
  description: string | null;
  days_of_week: number[];
  start_time: string;
  end_time: string;
  is_active: boolean;
}

export interface HappyEvent {
  id: string;
  venue_id: string;
  title: string;
  description: string | null;
  category: EventCategory;
  starts_at: string;
  ends_at: string;
  price_from: number | null;
  capacity: number | null;
  photos: string[];
}

export interface Favorite {
  user_id: string;
  venue_id: string;
  created_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  venue_id: string;
  event_id: string | null;
  booking_type: BookingType;
  party_size: number;
  scheduled_at: string;
  status: BookingStatus;
  amount: number | null;
  commission: number | null;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string | null;
  status: string;
  current_period_end: string | null;
}

export interface WaitlistEntry {
  id: string;
  email: string;
  created_at: string;
}

export interface PartnerLead {
  id: string;
  name: string;
  venue_name: string;
  email: string;
  phone: string | null;
  created_at: string;
}

/** Venue joined with its happy_hours, plus computed live state. */
export interface VenueWithHappyHours extends Venue {
  happy_hours: HappyHour[];
}

export interface LiveHappyHour extends HappyHour {
  venue: Venue;
  /** Minutes remaining until end_time, computed client/server side. */
  minutes_remaining: number;
}

export interface VenueWithDistance extends Venue {
  distance_km: number;
  live_happy_hour: HappyHour | null;
}

/** Offre exclusive déblocable in-app (mécanique 1, CLAUDE.md section 4). */
export interface Offer {
  id: string;
  venue_id: string;
  happy_hour_id: string | null;
  title: string;
  description: string | null;
  discount_label: string;
  is_exclusive: boolean;
  estimated_saving: number;
  status: OfferStatus;
  last_verified_at: string | null;
  created_at: string;
}

/** Activation d'une offre : code + QR valables 15 minutes. */
export interface OfferRedemption {
  id: string;
  offer_id: string;
  user_id: string;
  code: string;
  qr_payload: string;
  activated_at: string;
  expires_at: string;
  redeemed_at: string | null;
  saving_amount: number;
}

export interface OfferReport {
  id: string;
  offer_id: string;
  user_id: string;
  vote: OfferVote;
  photo_url: string | null;
  comment: string | null;
  created_at: string;
}

export interface GroupPlan {
  id: string;
  creator_id: string;
  share_slug: string;
  party_size: number;
  budget_level: number;
  area: string | null;
  suggested_venue_ids: string[];
  status: GroupPlanStatus;
  created_at: string;
}

export interface PlanVote {
  id: string;
  plan_id: string;
  venue_id: string;
  voter_name: string;
  created_at: string;
}

export interface CheckIn {
  user_id: string;
  venue_id: string;
  redemption_id: string | null;
  district: string | null;
  created_at: string;
}

/** Offre jointe à sa happy hour + son lieu, avec l'état "dernière chance" calculé. */
export interface OfferWithContext extends Offer {
  venue: Venue;
  happy_hour: HappyHour | null;
  minutes_remaining: number | null;
  is_last_chance: boolean;
  is_verified_this_week: boolean;
}

export interface SavingsSummary {
  month_total: number;
  all_time_total: number;
}
