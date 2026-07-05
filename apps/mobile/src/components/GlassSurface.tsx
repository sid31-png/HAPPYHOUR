import React, { type ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { BlurView } from "expo-blur";
import { radii } from "@happyhour/ui";
import { useThemeSky } from "../theme/useThemeSky";

interface GlassSurfaceProps {
  children?: ReactNode;
  shape?: "card" | "pill" | "none";
  radius?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * The liquid-glass surface used everywhere in the design system: cards,
 * search bars, the bottom dock, badges. Layers expo-blur's BlurView with a
 * semi-transparent tint + hairline border matching packages/ui glass tokens.
 */
export function GlassSurface({ children, shape = "card", radius, style }: GlassSurfaceProps) {
  const { isDark, glass } = useThemeSky();
  const borderRadius = radius ?? (shape === "pill" ? radii.pill : shape === "card" ? radii.card : 0);

  return (
    <View style={[{ borderRadius, overflow: "hidden" }, style]}>
      <BlurView
        intensity={glass.blur}
        tint={isDark ? "dark" : "light"}
        style={StyleSheet.absoluteFill}
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: glass.background,
            borderRadius,
            borderWidth: glass.borderWidth,
            borderColor: glass.border,
          },
        ]}
      />
      <View style={{ borderRadius }}>{children}</View>
    </View>
  );
}
