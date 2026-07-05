import React, { useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import { toggleFavorite } from "@happyhour/api";
import { colors } from "@happyhour/ui";
import { GlassSurface } from "./GlassSurface";
import { useAuth } from "../lib/auth-context";
import { getSupabase } from "../lib/supabase";

/**
 * Favorite heart button — gated behind auth. Unauthenticated taps redirect
 * to sign-in instead of silently failing (RLS would reject the write anyway).
 */
export function FavoriteHeart({ venueId, initialFavorited = false }: { venueId: string; initialFavorited?: boolean }) {
  const router = useRouter();
  const { session } = useAuth();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [busy, setBusy] = useState(false);

  async function handlePress() {
    if (!session?.user) {
      router.push("/auth/sign-in");
      return;
    }
    const client = getSupabase();
    if (!client || busy) return;
    setBusy(true);
    try {
      const result = await toggleFavorite(client, session.user.id, venueId);
      setFavorited(result.favorited);
    } catch {
      // Network/RLS error — keep previous state, fail quietly for now.
    } finally {
      setBusy(false);
    }
  }

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={favorited ? "Retirer des favoris" : "Ajouter aux favoris"}
      style={styles.pressable}
    >
      <GlassSurface shape="pill" style={styles.circle}>
        <Feather
          name="heart"
          size={20}
          color={favorited ? colors.burgundy : colors.textLight}
          style={favorited ? { opacity: 1 } : { opacity: 0.8 }}
        />
      </GlassSurface>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: { width: 44, height: 44 },
  circle: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
});
