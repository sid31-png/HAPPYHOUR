import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { fonts, fontSizes } from "@happyhour/ui";
import { GlassSurface } from "./GlassSurface";
import { useThemeSky } from "../theme/useThemeSky";

interface EmptyStateProps {
  icon?: keyof typeof Feather.glyphMap;
  title: string;
  message?: string;
}

export function EmptyState({ icon = "moon", title, message }: EmptyStateProps) {
  const { textColor } = useThemeSky();
  return (
    <GlassSurface shape="card" style={styles.wrapper}>
      <View style={styles.content}>
        <Feather name={icon} size={26} color={textColor} style={{ opacity: 0.7 }} />
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
        {message ? <Text style={[styles.message, { color: textColor }]}>{message}</Text> : null}
      </View>
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: "100%" },
  content: {
    alignItems: "center",
    padding: 24,
    gap: 8,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.cardTitle,
    fontWeight: "700",
    textAlign: "center",
  },
  message: {
    fontFamily: fonts.body,
    fontSize: fontSizes.body,
    opacity: 0.8,
    textAlign: "center",
  },
});
