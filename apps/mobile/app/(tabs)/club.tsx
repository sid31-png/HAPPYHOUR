import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SkyBackground } from "../../src/components/SkyBackground";
import { EmptyState } from "../../src/components/EmptyState";
import { SectionHeader } from "../../src/components/SectionHeader";

export default function ClubScreen() {
  const insets = useSafeAreaInsets();
  return (
    <SkyBackground>
      <View style={[styles.content, { paddingTop: insets.top + 24 }]}>
        <SectionHeader title="Le Club" subtitle="Un drink offert chaque semaine, des réductions, un accès prioritaire" />
        <EmptyState
          icon="award"
          title="Bientôt disponible"
          message="L'abonnement Club arrive en Phase 3, une fois 30 à 50 partenaires à bord."
        />
      </View>
    </SkyBackground>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, paddingHorizontal: 20, gap: 16, paddingBottom: 140 },
});
