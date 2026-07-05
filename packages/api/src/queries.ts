import { computeMinutesRemaining } from "@happyhour/ui";
import type {
  HappyEvent,
  HappyHour,
  LiveHappyHour,
  Offer,
  OfferRedemption,
  OfferVote,
  OfferWithContext,
  SavingsSummary,
  Venue,
  VenueWithDistance,
} from "@happyhour/types";
import type { HappyHourClient } from "./client";

const LAST_CHANCE_MINUTES = 60;
const VERIFIED_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;
const REDEMPTION_VALIDITY_MS = 15 * 60 * 1000;
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generateOfferCode(): string {
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return code;
}

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

/** Offres actives, jointes à leur happy hour et leur lieu, avec l'état "dernière chance" et "vérifié cette semaine" calculés. */
export async function getOffersWithContext(client: HappyHourClient): Promise<OfferWithContext[]> {
  const { data, error } = await client
    .from("offers")
    .select("*, happy_hour:happy_hours(*), venue:venues(*)")
    .neq("status", "paused");
  if (error) throw error;

  const rows = (data ?? []) as unknown as (Offer & { happy_hour: HappyHour | null; venue: Venue })[];
  const now = Date.now();

  return rows.map((row) => {
    const { happy_hour, venue, ...offer } = row;
    const minutesRemaining = happy_hour
      ? computeMinutesRemaining(happy_hour.days_of_week, happy_hour.start_time, happy_hour.end_time)
      : null;
    const isVerifiedThisWeek = offer.last_verified_at !== null && now - new Date(offer.last_verified_at).getTime() <= VERIFIED_WINDOW_MS;

    return {
      ...offer,
      venue,
      happy_hour,
      minutes_remaining: minutesRemaining,
      is_last_chance: minutesRemaining !== null && minutesRemaining <= LAST_CHANCE_MINUTES,
      is_verified_this_week: isVerifiedThisWeek,
    } satisfies OfferWithContext;
  });
}

/** Offres qui se terminent dans moins de 60 minutes, triées par fin la plus proche (mécanique 3). */
export async function getLastChanceOffers(client: HappyHourClient): Promise<OfferWithContext[]> {
  const offers = await getOffersWithContext(client);
  return offers
    .filter((offer) => offer.is_last_chance)
    .sort((a, b) => (a.minutes_remaining ?? 0) - (b.minutes_remaining ?? 0));
}

/** Déblocage d'offre : génère un code + QR valables 15 minutes et enregistre l'activation (mécanique 1). */
export async function activateOffer(
  client: HappyHourClient,
  userId: string,
  offer: Offer
): Promise<OfferRedemption> {
  const code = generateOfferCode();
  const activatedAt = new Date();
  const expiresAt = new Date(activatedAt.getTime() + REDEMPTION_VALIDITY_MS);
  const qrPayload = `HAPPYHOUR:${offer.id}:${code}`;

  const { data, error } = await client
    .from("offer_redemptions")
    .insert({
      offer_id: offer.id,
      user_id: userId,
      code,
      qr_payload: qrPayload,
      activated_at: activatedAt.toISOString(),
      expires_at: expiresAt.toISOString(),
      saving_amount: offer.estimated_saving,
    })
    .select()
    .single();
  if (error) throw error;
  return data as OfferRedemption;
}

/** Compteur d'économies : total du mois en cours + cumul depuis les offres activées (mécanique 2). */
export async function getSavingsSummary(client: HappyHourClient, userId: string): Promise<SavingsSummary> {
  const { data, error } = await client
    .from("offer_redemptions")
    .select("saving_amount, activated_at")
    .eq("user_id", userId);
  if (error) throw error;

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  let monthTotal = 0;
  let allTimeTotal = 0;
  for (const row of data ?? []) {
    allTimeTotal += row.saving_amount;
    if (new Date(row.activated_at) >= startOfMonth) {
      monthTotal += row.saving_amount;
    }
  }

  return { month_total: monthTotal, all_time_total: allTimeTotal };
}

/** Vérification communautaire 👍/👎 (mécaniques 5 et 6) — bascule le statut de l'offre via une fonction RPC atomique. */
export async function submitOfferReport(
  client: HappyHourClient,
  userId: string,
  offerId: string,
  vote: OfferVote,
  options?: { photoUrl?: string; comment?: string }
): Promise<void> {
  const { error } = await client.rpc("submit_offer_report", {
    p_offer_id: offerId,
    p_user_id: userId,
    p_vote: vote,
    p_photo_url: options?.photoUrl ?? null,
    p_comment: options?.comment ?? null,
  });
  if (error) throw error;
}

/** Vrai si l'utilisateur a déjà voté sur cette offre (désactive le bouton correspondant côté UI). */
export async function hasUserReportedOffer(client: HappyHourClient, userId: string, offerId: string): Promise<boolean> {
  const { data, error } = await client
    .from("offer_reports")
    .select("id")
    .eq("user_id", userId)
    .eq("offer_id", offerId)
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data !== null;
}
