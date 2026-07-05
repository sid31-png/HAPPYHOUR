import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import type { OfferWithContext } from "@happyhour/types";
import { colors, fonts, fontSizes, formatMinutesRemaining } from "@happyhour/ui";
import { GlassSurface } from "./GlassSurface";
import { VerifiedBadge } from "./VerifiedBadge";
import { useThemeSky } from "../theme/useThemeSky";

/** Carte "Dernière chance" (mécanique 3) — offres qui se terminent dans moins de 60 minutes. */
export function LastChanceCard({ offer, onPress }: { offer: OfferWithContext; onPress?: () => void }) {
  const { textColor } = useThemeSky();

  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={offer.venue.name} style={styles.pressable}>
      <GlassSurface shape="card" style={styles.card}>
        <View style={styles.body}>
          <View style={styles.timeRow}>
            <Feather name="alert-circle" size={13} color={colors.sunset} />
            <Text style={styles.timeText}>{formatMinutesRemaining(offer.minutes_remaining ?? 0)}</Text>
          </View>
          <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
            {offer.venue.name}
          </Text>
          <Text style={[styles.meta, { color: textColor }]} numberOfLines={1}>
            {offer.discount_label}
          </Text>
          {offer.is_verified_this_week && (
            <View style={{ marginTop: 6 }}>
              <VerifiedBadge />
            </View>
          )}
        </View>
      </GlassSurface>
    </Pressable>
  );
}

const CARD_WIDTH = 176;

const styles = StyleSheet.create({
  pressable: { minWidth: 44, minHeight: 44 },
  card: { width: CARD_WIDTH },
  body: { padding: 14, gap: 3 },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    alignSelf: "flex-start",
    backgroundColor: "rgba(232,100,46,0.14)",
    borderRadius: 100,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 4,
  },
  timeText: { fontFamily: fonts.body, fontSize: fontSizes.nav, fontWeight: "700", color: colors.sunset },
  title: { fontFamily: fonts.heading, fontSize: fontSizes.cardTitle, fontWeight: "700" },
  meta: { fontFamily: fonts.body, fontSize: fontSizes.meta, opacity: 0.75 },
});
