import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { GlassSurface } from "./GlassSurface";
import { colors } from "@happyhour/ui";

/** Simple glass loading placeholder used while a section's data is in flight. */
export function LoadingState({ height = 130 }: { height?: number }) {
  return (
    <GlassSurface shape="card" style={[styles.wrapper, { height }]}>
      <View style={styles.center}>
        <ActivityIndicator color={colors.goldDeep} />
      </View>
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: "100%" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
