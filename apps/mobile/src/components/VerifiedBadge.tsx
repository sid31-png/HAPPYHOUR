import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { colors, fonts, fontSizes } from "@happyhour/ui";
import { GlassSurface } from "./GlassSurface";

/** "Vérifié cette semaine" badge (mécanique 6) — confirmé par le partenaire ou la communauté. */
export function VerifiedBadge() {
  return (
    <GlassSurface shape="pill" style={styles.wrapper}>
      <View style={styles.content}>
        <Feather name="check" size={11} color={colors.liveGreen} />
        <Text style={styles.label}>Vérifié cette semaine</Text>
      </View>
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignSelf: "flex-start" },
  content: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 9, paddingVertical: 5 },
  label: { fontFamily: fonts.body, fontSize: fontSizes.nav, fontWeight: "700", color: colors.liveGreen },
});
