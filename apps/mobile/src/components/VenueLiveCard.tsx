import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import type { LiveHappyHour, OfferWithContext } from "@happyhour/types";
import { colors, fonts, fontSizes, radii } from "@happyhour/ui";
import { GlassSurface } from "./GlassSurface";
import { CountdownBadge } from "./CountdownBadge";
import { VerifiedBadge } from "./VerifiedBadge";
import { OfferVoteButtons } from "./OfferVoteButtons";
import { useThemeSky } from "../theme/useThemeSky";
import { useLiveMinutesRemaining } from "../hooks/useLiveMinutesRemaining";

const CATEGORY_LABELS: Record<string, string> = {
  bar: "Bar",
  cafe: "Café",
  rooftop: "Rooftop",
  restaurant: "Restaurant",
};

interface VenueLiveCardProps {
  item: LiveHappyHour;
  offer?: OfferWithContext | null;
  onPress?: () => void;
  onActivateOffer?: () => void;
}

/** Horizontal card for the "En cours près de vous" section — a venue currently in a live happy hour. */
export function VenueLiveCard({ item, offer, onPress, onActivateOffer }: VenueLiveCardProps) {
  const { textColor } = useThemeSky();
  const minutes = useLiveMinutesRemaining(item.days_of_week, item.start_time, item.end_time);
  const photo = item.venue.photos[0];

  if (minutes === null) return null;

  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={item.venue.name} style={styles.pressable}>
      <GlassSurface shape="card" style={styles.card}>
        <View style={styles.photoWrapper}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.photo} />
          ) : (
            <View style={[styles.photo, styles.photoPlaceholder]} />
          )}
          <View style={styles.badgeOverlay}>
            <CountdownBadge minutes={minutes} />
          </View>
        </View>
        <View style={styles.body}>
          <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
            {item.venue.name}
          </Text>
          <Text style={[styles.meta, { color: textColor }]} numberOfLines={1}>
            {CATEGORY_LABELS[item.venue.category] ?? item.venue.category} · {item.title}
          </Text>

          {offer && (
            <>
              {offer.is_verified_this_week && (
                <View style={{ marginTop: 6 }}>
                  <VerifiedBadge />
                </View>
              )}
              <View style={styles.offerRow}>
                <OfferVoteButtons offerId={offer.id} />
              </View>
              {onActivateOffer && (
                <Pressable
                  onPress={(e) => {
                    e.stopPropagation();
                    onActivateOffer();
                  }}
                  hitSlop={6}
                  accessibilityRole="button"
                  accessibilityLabel="Utiliser l'offre"
                  style={styles.activatePill}
                >
                  <Text style={styles.activateLabel}>Utiliser l'offre</Text>
                </Pressable>
              )}
            </>
          )}
        </View>
      </GlassSurface>
    </Pressable>
  );
}

const CARD_WIDTH = 220;

const styles = StyleSheet.create({
  pressable: { minWidth: 44, minHeight: 44 },
  card: {
    width: CARD_WIDTH,
  },
  photoWrapper: {
    width: "100%",
    height: 130,
    justifyContent: "flex-end",
  },
  photo: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: radii.card,
    borderTopRightRadius: radii.card,
  },
  photoPlaceholder: {
    backgroundColor: "rgba(224,123,31,0.35)",
  },
  badgeOverlay: {
    padding: 8,
  },
  body: {
    padding: 12,
    gap: 2,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.cardTitle,
    fontWeight: "700",
  },
  meta: {
    fontFamily: fonts.body,
    fontSize: fontSizes.meta,
    opacity: 0.8,
  },
  offerRow: { marginTop: 8 },
  activatePill: {
    marginTop: 8,
    alignSelf: "flex-start",
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: "rgba(245,166,35,0.16)",
    minHeight: 32,
    justifyContent: "center",
  },
  activateLabel: {
    fontFamily: fonts.body,
    fontSize: fontSizes.nav,
    fontWeight: "700",
    color: colors.goldDeep,
  },
});
