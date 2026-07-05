import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import { submitOfferReport } from "@happyhour/api";
import type { OfferVote } from "@happyhour/types";
import { colors, fonts, fontSizes } from "@happyhour/ui";
import { useThemeSky } from "../theme/useThemeSky";
import { useAuth } from "../lib/auth-context";
import { getSupabase } from "../lib/supabase";

/**
 * Vérification communautaire "C'est bien actif ?" (mécanique 5) — micro-action discrète
 * sans quitter l'écran. 3 signalements négatifs en 24h basculent l'offre en `to_verify`
 * côté serveur (fonction RPC submit_offer_report).
 */
export function OfferVoteButtons({ offerId }: { offerId: string }) {
  const router = useRouter();
  const { textColor } = useThemeSky();
  const { session } = useAuth();
  const [voted, setVoted] = useState<OfferVote | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleVote(vote: OfferVote) {
    if (!session?.user) {
      router.push("/auth/sign-in");
      return;
    }
    const client = getSupabase();
    if (!client || busy || voted) return;
    setBusy(true);
    try {
      await submitOfferReport(client, session.user.id, offerId, vote);
      setVoted(vote);
    } catch {
      // Silencieux : la micro-action ne doit pas interrompre le parcours.
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={styles.row}>
      <Text style={[styles.label, { color: textColor }]}>C'est bien actif ?</Text>
      <Pressable
        onPress={() => handleVote("up")}
        disabled={voted !== null}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Oui, l'offre est active"
        style={styles.iconButton}
      >
        <Feather name="thumbs-up" size={15} color={voted === "up" ? colors.liveGreen : textColor} style={{ opacity: voted && voted !== "up" ? 0.35 : 0.8 }} />
      </Pressable>
      <Pressable
        onPress={() => handleVote("down")}
        disabled={voted !== null}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Non, l'offre n'est pas active"
        style={styles.iconButton}
      >
        <Feather name="thumbs-down" size={15} color={voted === "down" ? "#C24D4D" : textColor} style={{ opacity: voted && voted !== "down" ? 0.35 : 0.8 }} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  label: { fontFamily: fonts.body, fontSize: fontSizes.meta, opacity: 0.6 },
  iconButton: { minWidth: 32, minHeight: 32, alignItems: "center", justifyContent: "center" },
});
