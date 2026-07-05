import React, { type ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { useThemeSky } from "../theme/useThemeSky";

/** Flat screen background — pure white in light mode, pure black in dark mode. */
export function SkyBackground({ children }: { children?: ReactNode }) {
  const { background } = useThemeSky();

  return <View style={[styles.fill, { backgroundColor: background }]}>{children}</View>;
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
