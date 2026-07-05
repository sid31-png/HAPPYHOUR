import { computeMinutesRemaining } from "@happyhour/ui";
import type { HappyEvent, HappyHour, LiveHappyHour, Venue, VenueWithDistance } from "@happyhour/types";
import type { HappyHourClient } from "./client";

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function getVenues(client: HappyHourClient): Promise<Venue[]> {
  const { data, error } = await client.from("venues").select("*").order("name");
  if (error) throw error;
  return data as Venue[];
}

export async function getVenueBySlug(
  client: HappyHourClient,
  slug: string
): Promise<{ venue: Venue; happyHours: HappyHour[] } | null> {
  const { data: venue, error } = await client.from("venues").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  if (!venue) return null;

  const { data: happyHours, error: hhError } = await client
    .from("happy_hours")
    .select("*")
    .eq("venue_id", venue.id)
    .eq("is_active", true);
  if (hhError) throw hhError;

  return { venue: venue as Venue, happyHours: (happyHours ?? []) as HappyHour[] };
}

export async function getVenuesNearby(
  client: HappyHourClient,
  lat: number,
  lng: number,
  radiusKm = 8
): Promise<VenueWithDistance[]> {
  const venues = await getVenues(client);
  const { data: happyHours, error } = await client.from("happy_hours").select("*").eq("is_active", true);
  if (error) throw error;

  return venues
    .map((venue) => {
      const venueHappyHours = ((happyHours ?? []) as HappyHour[]).filter((hh) => hh.venue_id === venue.id);
      const liveHappyHour =
        venueHappyHours.find(
          (hh) => computeMinutesRemaining(hh.days_of_week, hh.start_time, hh.end_time) !== null
        ) ?? null;
      return {
        ...venue,
        distance_km: Math.round(haversineKm(lat, lng, venue.lat, venue.lng) * 10) / 10,
        live_happy_hour: liveHappyHour,
      };
    })
    .filter((v) => v.distance_km <= radiusKm)
    .sort((a, b) => a.distance_km - b.distance_km);
}

export async function getLiveHappyHours(client: HappyHourClient): Promise<LiveHappyHour[]> {
  const { data, error } = await client
    .from("happy_hours")
    .select("*, venue:venues(*)")
    .eq("is_active", true);
  if (error) throw error;

  const rows = (data ?? []) as unknown as (HappyHour & { venue: Venue })[];

  return rows
    .map((row) => {
      const minutesRemaining = computeMinutesRemaining(row.days_of_week, row.start_time, row.end_time);
      if (minutesRemaining === null) return null;
      const { venue, ...happyHour } = row;
      return { ...happyHour, venue, minutes_remaining: minutesRemaining } satisfies LiveHappyHour;
    })
    .filter((hh): hh is LiveHappyHour => hh !== null)
    .sort((a, b) => a.minutes_remaining - b.minutes_remaining);
}

export async function getUpcomingEvents(client: HappyHourClient, limit = 10): Promise<(HappyEvent & { venue: Venue })[]> {
  const { data, error } = await client
    .from("events")
    .select("*, venue:venues(*)")
    .gte("ends_at", new Date().toISOString())
    .order("starts_at", { ascending: true })
    .limit(limit);
  if (error) throw error;
  return data as unknown as (HappyEvent & { venue: Venue })[];
}

export async function toggleFavorite(
  client: HappyHourClient,
  userId: string,
  venueId: string
): Promise<{ favorited: boolean }> {
  const { data: existing, error: fetchError } = await client
    .from("favorites")
    .select("venue_id")
    .eq("user_id", userId)
    .eq("venue_id", venueId)
    .maybeSingle();
  if (fetchError) throw fetchError;

  if (existing) {
    const { error } = await client.from("favorites").delete().eq("user_id", userId).eq("venue_id", venueId);
    if (error) throw error;
    return { favorited: false };
  }

  const { error } = await client.from("favorites").insert({ user_id: userId, venue_id: venueId });
  if (error) throw error;
  return { favorited: true };
}

export async function getFavoriteVenueIds(client: HappyHourClient, userId: string): Promise<string[]> {
  const { data, error } = await client.from("favorites").select("venue_id").eq("user_id", userId);
  if (error) throw error;
  return (data ?? []).map((row) => row.venue_id);
}

export async function joinWaitlist(client: HappyHourClient, email: string): Promise<void> {
  const { error } = await client.from("waitlist").insert({ email });
  if (error) throw error;
}

export async function submitPartnerLead(
  client: HappyHourClient,
  lead: { name: string; venueName: string; email: string; phone?: string }
): Promise<void> {
  const { error } = await client.from("partner_leads").insert({
    name: lead.name,
    venue_name: lead.venueName,
    email: lead.email,
    phone: lead.phone ?? null,
  });
  if (error) throw error;
}
