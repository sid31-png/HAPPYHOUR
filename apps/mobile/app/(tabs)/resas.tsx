import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SkyBackground } from "../../src/components/SkyBackground";
import { EmptyState } from "../../src/components/EmptyState";
import { SectionHeader } from "../../src/components/SectionHeader";

export default function ResasScreen() {
  const insets = useSafeAreaInsets();
  return (
    <SkyBackground>
      <View style={[styles.content, { paddingTop: insets.top + 24 }]}>
        <SectionHeader title="Résas" subtitle="Tables et billets, réservés en un tap" />
        <EmptyState
          icon="calendar"
          title="Bientôt disponible"
          message="Les réservations de tables et de billets arrivent en Phase 2 de Happy Hour."
        />
      </View>
    </SkyBackground>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, paddingHorizontal: 20, gap: 16, paddingBottom: 140 },
});
