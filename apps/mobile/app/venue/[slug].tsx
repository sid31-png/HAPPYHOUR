import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import MapView, { Marker } from "react-native-maps";
import { getFavoriteVenueIds, getOffersWithContext, getVenueBySlug } from "@happyhour/api";
import type { HappyHour, OfferWithContext, Venue } from "@happyhour/types";
import { colors, fonts, fontSizes, radii } from "@happyhour/ui";
import { GlassSurface } from "../../src/components/GlassSurface";
import { CountdownBadge } from "../../src/components/CountdownBadge";
import { CTAButton } from "../../src/components/CTAButton";
import { FavoriteHeart } from "../../src/components/FavoriteHeart";
import { EmptyState } from "../../src/components/EmptyState";
import { LoadingState } from "../../src/components/LoadingState";
import { VerifiedBadge } from "../../src/components/VerifiedBadge";
import { OfferVoteButtons } from "../../src/components/OfferVoteButtons";
import { OfferActivationSheet } from "../../src/components/OfferActivationSheet";
import { useThemeSky } from "../../src/theme/useThemeSky";
import { useLiveMinutesRemaining } from "../../src/hooks/useLiveMinutesRemaining";
import { useAuth } from "../../src/lib/auth-context";
import { getSupabase } from "../../src/lib/supabase";
import { formatDaysOfWeek } from "../../src/lib/formatTime";

const CATEGORY_LABELS: Record<string, string> = {
  bar: "Bar",
  cafe: "Café",
  rooftop: "Rooftop",
  restaurant: "Restaurant",
};

function LiveHappyHourBadge({ hh }: { hh: HappyHour }) {
  const minutes = useLiveMinutesRemaining(hh.days_of_week, hh.start_time, hh.end_time);
  if (minutes === null) return null;
  return <CountdownBadge minutes={minutes} />;
}

export default function VenueDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { textColor, isDark } = useThemeSky();
  const { session } = useAuth();

  const [data, setData] = useState<{ venue: Venue; happyHours: HappyHour[] } | null | undefined>(undefined);
  const [isFavorited, setIsFavorited] = useState(false);
  const [offers, setOffers] = useState<OfferWithContext[]>([]);
  const [activeOffer, setActiveOffer] = useState<OfferWithContext | null>(null);

  useEffect(() => {
    if (!slug) return;
    const client = getSupabase();
    if (!client) {
      setData(null);
      return;
    }
    getVenueBySlug(client, slug).then((result) => {
      setData(result);
      if (result) {
        getOffersWithContext(client).then((all) => {
          setOffers(all.filter((offer) => offer.venue_id === result.venue.id));
        });
      }
    }).catch(() => setData(null));

    if (session?.user) {
      getFavoriteVenueIds(client, session.user.id).then((ids) => {
        setData((current) => {
          if (current) setIsFavorited(ids.includes(current.venue.id));
          return current;
        });
      });
    }
  }, [slug, session?.user]);

  if (data === undefined) {
    return (
      <View style={[styles.center, { paddingTop: insets.top + 24 }]}>
        <LoadingState height={200} />
      </View>
    );
  }

  if (data === null) {
    return (
      <View style={[styles.content, { paddingTop: insets.top + 24 }]}>
        <EmptyState icon="alert-circle" title="Lieu introuvable" message="Vérifiez la connexion Supabase ou revenez à l'accueil." />
      </View>
    );
  }

  const { venue, happyHours } = data;
  const photo = venue.photos[0];

  return (
    <ScrollView style={styles.fill} contentContainerStyle={{ paddingBottom: 60 }}>
      <View style={styles.header}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.photo} />
        ) : (
          <View style={[styles.photo, styles.photoPlaceholder]} />
        )}
        <LinearGradient
          colors={["transparent", isDark ? "rgba(26,16,48,0.85)" : "rgba(58,33,16,0.55)"]}
          style={styles.scrim}
        />
        <View style={[styles.headerRow, { top: insets.top + 12 }]}>
          <GlassSurface shape="pill" style={styles.iconButtonWrapper}>
            <Feather
              name="chevron-left"
              size={22}
              color={colors.textLight}
              onPress={() => router.back()}
              suppressHighlighting
              style={styles.iconButton}
            />
          </GlassSurface>
          <FavoriteHeart venueId={venue.id} initialFavorited={isFavorited} />
        </View>
        <View style={styles.badgeRow}>
          {happyHours.map((hh) => (
            <LiveHappyHourBadge key={hh.id} hh={hh} />
          ))}
        </View>
      </View>

      <View style={styles.body}>
        <Text style={[styles.title, { color: textColor }]}>{venue.name}</Text>
        <View style={styles.infoRow}>
          <Text style={[styles.infoText, { color: textColor }]}>
            {CATEGORY_LABELS[venue.category] ?? venue.category} · {"$".repeat(venue.price_level)}
            {venue.rating ? ` · ★ ${venue.rating}` : ""}
          </Text>
        </View>
        {venue.address && (
          <View style={styles.infoRow}>
            <Feather name="map-pin" size={14} color={textColor} style={{ opacity: 0.7 }} />
            <Text style={[styles.infoText, { color: textColor, opacity: 0.85 }]}>{venue.address}</Text>
          </View>
        )}

        {venue.description && <Text style={[styles.description, { color: textColor }]}>{venue.description}</Text>}

        {offers.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Offre exclusive</Text>
            {offers.map((offer) => (
              <GlassSurface key={offer.id} shape="card" style={styles.offerCard}>
                <View style={styles.offerContent}>
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text style={[styles.scheduleTitle, { color: textColor }]}>{offer.discount_label}</Text>
                    {offer.is_verified_this_week && <VerifiedBadge />}
                    <OfferVoteButtons offerId={offer.id} />
                  </View>
                  <CTAButton label="Utiliser l'offre" onPress={() => setActiveOffer(offer)} />
                </View>
              </GlassSurface>
            ))}
          </View>
        )}

        {happyHours.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Happy hours de la semaine</Text>
            {happyHours.map((hh) => (
              <GlassSurface key={hh.id} shape="card" style={styles.scheduleCard}>
                <View style={styles.scheduleContent}>
                  <Text style={[styles.scheduleTitle, { color: textColor }]}>{hh.title}</Text>
                  <Text style={[styles.scheduleMeta, { color: textColor }]}>
                    {formatDaysOfWeek(hh.days_of_week)} · {hh.start_time.slice(0, 5)} – {hh.end_time.slice(0, 5)}
                  </Text>
                </View>
              </GlassSurface>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Localisation</Text>
          <GlassSurface shape="card" style={styles.mapCard}>
            <MapView
              style={styles.miniMap}
              scrollEnabled={false}
              zoomEnabled={false}
              initialRegion={{
                latitude: venue.lat,
                longitude: venue.lng,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker coordinate={{ latitude: venue.lat, longitude: venue.lng }} />
            </MapView>
          </GlassSurface>
        </View>

        <CTAButton label="Réserver — bientôt disponible" disabled style={{ marginTop: 8 }} />
      </View>

      <OfferActivationSheet offer={activeOffer} onClose={() => setActiveOffer(null)} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  center: { flex: 1, paddingHorizontal: 20 },
  content: { flex: 1, paddingHorizontal: 20 },
  header: { height: 300, justifyContent: "flex-end" },
  photo: { ...StyleSheet.absoluteFill },
  photoPlaceholder: { backgroundColor: "rgba(224,123,31,0.35)" },
  scrim: { ...StyleSheet.absoluteFill },
  headerRow: {
    position: "absolute",
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconButtonWrapper: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  iconButton: { width: 44, height: 44, textAlign: "center", textAlignVertical: "center" },
  badgeRow: { padding: 16, gap: 8, alignItems: "flex-start" },
  body: { padding: 20, gap: 14 },
  title: { fontFamily: fonts.heading, fontSize: 24, fontWeight: "800" },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  infoText: { fontFamily: fonts.body, fontSize: fontSizes.body },
  description: { fontFamily: fonts.body, fontSize: fontSizes.body, lineHeight: 20, opacity: 0.9 },
  section: { gap: 10, marginTop: 8 },
  sectionTitle: { fontFamily: fonts.heading, fontSize: fontSizes.h2, fontWeight: "700" },
  offerCard: { width: "100%" },
  offerContent: { padding: 16, flexDirection: "row", alignItems: "center", gap: 12 },
  scheduleCard: { width: "100%" },
  scheduleContent: { padding: 14, gap: 2 },
  scheduleTitle: { fontFamily: fonts.heading, fontSize: fontSizes.cardTitle, fontWeight: "700" },
  scheduleMeta: { fontFamily: fonts.body, fontSize: fontSizes.meta, opacity: 0.8 },
  mapCard: { width: "100%", height: 160, borderRadius: radii.card, overflow: "hidden" },
  miniMap: { width: "100%", height: "100%" },
});
