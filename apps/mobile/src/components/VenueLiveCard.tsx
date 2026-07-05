import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import type { LiveHappyHour } from "@happyhour/types";
import { fonts, fontSizes, radii } from "@happyhour/ui";
import { GlassSurface } from "./GlassSurface";
import { CountdownBadge } from "./CountdownBadge";
import { useThemeSky } from "../theme/useThemeSky";
import { useLiveMinutesRemaining } from "../hooks/useLiveMinutesRemaining";

const CATEGORY_LABELS: Record<string, string> = {
  bar: "Bar",
  cafe: "Café",
  rooftop: "Rooftop",
  restaurant: "Restaurant",
};

/** Horizontal card for the "En cours près de vous" section — a venue currently in a live happy hour. */
export function VenueLiveCard({ item, onPress }: { item: LiveHappyHour; onPress?: () => void }) {
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
});
