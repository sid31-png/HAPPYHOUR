import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { fonts, fontSizes } from "@happyhour/ui";
import { useThemeSky } from "../theme/useThemeSky";

export function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const { textColor } = useThemeSky();
  return (
    <View style={styles.wrapper}>
      <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      {subtitle ? <Text style={[styles.subtitle, { color: textColor }]}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 2 },
  title: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.h2,
    fontWeight: "700",
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: fontSizes.meta,
    opacity: 0.75,
  },
});
