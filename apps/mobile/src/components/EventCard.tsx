import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import type { HappyEvent, Venue } from "@happyhour/types";
import { fonts, fontSizes, radii } from "@happyhour/ui";
import { formatQAR } from "@happyhour/ui";
import { GlassSurface } from "./GlassSurface";
import { useThemeSky } from "../theme/useThemeSky";
import { formatEventDay, formatEventTime } from "../lib/formatTime";

/** Card for the "Ce soir" section — an upcoming event at a venue. */
export function EventCard({ item, onPress }: { item: HappyEvent & { venue: Venue }; onPress?: () => void }) {
  const { textColor } = useThemeSky();
  const photo = item.photos[0] ?? item.venue.photos[0];

  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={item.title} style={styles.pressable}>
      <GlassSurface shape="card" style={styles.card}>
        <View style={styles.row}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.thumb} />
          ) : (
            <View style={[styles.thumb, styles.thumbPlaceholder]} />
          )}
          <View style={styles.body}>
            <Text style={[styles.eyebrow, { color: textColor }]}>
              {formatEventDay(item.starts_at)} · {formatEventTime(item.starts_at)}
            </Text>
            <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={[styles.meta, { color: textColor }]} numberOfLines={1}>
              {item.venue.name}
              {item.price_from != null ? ` · dès ${formatQAR(item.price_from)}` : ""}
            </Text>
          </View>
        </View>
      </GlassSurface>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: { minHeight: 44 },
  card: { width: "100%" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    gap: 12,
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: radii.card - 10,
  },
  thumbPlaceholder: {
    backgroundColor: "rgba(224,123,31,0.35)",
  },
  body: {
    flex: 1,
    gap: 2,
  },
  eyebrow: {
    fontFamily: fonts.body,
    fontSize: fontSizes.meta,
    opacity: 0.7,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.cardTitle,
    fontWeight: "700",
  },
  meta: {
    fontFamily: fonts.body,
    fontSize: fontSizes.body,
    opacity: 0.85,
  },
});
