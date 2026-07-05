import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { colors, fonts, fontSizes } from "@happyhour/ui";
import { GlassSurface } from "./GlassSurface";
import { useThemeSky } from "../theme/useThemeSky";

interface PreferenceChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function PreferenceChip({ label, selected, onPress }: PreferenceChipProps) {
  const { textColor } = useThemeSky();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      style={styles.pressable}
    >
      <GlassSurface
        shape="pill"
        style={[styles.chip, selected && { borderColor: colors.gold, borderWidth: 2 }]}
      >
        <Text style={[styles.label, { color: selected ? colors.goldDeep : textColor }]}>{label}</Text>
      </GlassSurface>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: { minHeight: 44 },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    minHeight: 44,
    justifyContent: "center",
  },
  label: {
    fontFamily: fonts.body,
    fontSize: fontSizes.body,
    fontWeight: "600",
  },
});
