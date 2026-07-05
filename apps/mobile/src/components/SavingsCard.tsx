import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { getSavingsSummary } from "@happyhour/api";
import type { SavingsSummary } from "@happyhour/types";
import { colors, fonts, fontSizes, formatQAR } from "@happyhour/ui";
import { GlassSurface } from "./GlassSurface";
import { useThemeSky } from "../theme/useThemeSky";
import { useAuth } from "../lib/auth-context";
import { getSupabase } from "../lib/supabase";

/** Compteur d'économies (mécanique 2) : total du mois + cumul, calculé depuis les offres activées. */
export function SavingsCard() {
  const { textColor } = useThemeSky();
  const { session } = useAuth();
  const [summary, setSummary] = useState<SavingsSummary | null>(null);

  useEffect(() => {
    if (!session?.user) return;
    const client = getSupabase();
    if (!client) return;
    getSavingsSummary(client, session.user.id)
      .then(setSummary)
      .catch(() => setSummary(null));
  }, [session?.user]);

  if (!session?.user || !summary || summary.month_total <= 0) return null;

  return (
    <GlassSurface shape="card" style={styles.wrapper}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Feather name="trending-up" size={18} color={colors.gold} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: textColor }]}>
            Tu as économisé {formatQAR(summary.month_total)} ce mois-ci
          </Text>
          <Text style={[styles.subtitle, { color: textColor }]}>
            {formatQAR(summary.all_time_total)} économisés au total
          </Text>
        </View>
      </View>
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: "100%" },
  content: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(245,166,35,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontFamily: fonts.heading, fontSize: fontSizes.cardTitle, fontWeight: "700" },
  subtitle: { fontFamily: fonts.body, fontSize: fontSizes.meta, opacity: 0.7, marginTop: 1 },
});
