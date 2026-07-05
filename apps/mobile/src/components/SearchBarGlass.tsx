import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { fonts, fontSizes } from "@happyhour/ui";
import { GlassSurface } from "./GlassSurface";
import { useThemeSky } from "../theme/useThemeSky";

/** Glass pill search bar. Non-functional placeholder per spec — visual only for now. */
export function SearchBarGlass({ placeholder = "Rechercher un lieu, une ambiance…" }: { placeholder?: string }) {
  const { textColor } = useThemeSky();
  return (
    <GlassSurface shape="pill" style={styles.wrapper}>
      <View style={styles.row} accessible accessibilityRole="search" accessibilityLabel={placeholder}>
        <Feather name="search" size={18} color={textColor} style={{ opacity: 0.7 }} />
        <Text style={[styles.text, { color: textColor }]}>{placeholder}</Text>
      </View>
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: "100%" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    minHeight: 48,
  },
  text: {
    fontFamily: fonts.body,
    fontSize: fontSizes.body,
    opacity: 0.7,
  },
});
