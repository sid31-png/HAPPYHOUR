import React, { type ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useThemeSky } from "../theme/useThemeSky";

/**
 * Golden-hour sky gradient background with a radial warm sun halo,
 * switching light/dark with the system color scheme. Used behind every
 * full screen — never a plain white/black/cold-gray background.
 */
export function SkyBackground({ children }: { children?: ReactNode }) {
  const { sky, isDark, haloTop } = useThemeSky();
  const colorsTuple = sky as unknown as [string, string, ...string[]];

  return (
    <View style={styles.fill}>
      <LinearGradient colors={colorsTuple} style={StyleSheet.absoluteFill} />
      {/* Radial sun halo approximation: stacked soft circles, since RN has no true radial-gradient primitive. */}
      <View
        pointerEvents="none"
        style={[
          styles.halo,
          {
            top: `${haloTop * 100}%`,
            backgroundColor: isDark ? "rgba(255,214,150,0.22)" : "rgba(255,247,230,0.55)",
          },
        ]}
      />
      <View
        pointerEvents="none"
        style={[
          styles.haloInner,
          {
            top: `${haloTop * 100}%`,
            backgroundColor: isDark ? "rgba(255,190,110,0.28)" : "rgba(255,222,170,0.65)",
          },
        ]}
      />
      {children}
    </View>
  );
}

const HALO_SIZE = 420;
const HALO_INNER_SIZE = 210;

const styles = StyleSheet.create({
  fill: { flex: 1 },
  halo: {
    position: "absolute",
    left: "50%",
    marginLeft: -HALO_SIZE / 2,
    marginTop: -HALO_SIZE / 2,
    width: HALO_SIZE,
    height: HALO_SIZE,
    borderRadius: HALO_SIZE / 2,
  },
  haloInner: {
    position: "absolute",
    left: "50%",
    marginLeft: -HALO_INNER_SIZE / 2,
    marginTop: -HALO_INNER_SIZE / 2,
    width: HALO_INNER_SIZE,
    height: HALO_INNER_SIZE,
    borderRadius: HALO_INNER_SIZE / 2,
  },
});
