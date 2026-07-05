import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import { colors, fonts, fontSizes } from "@happyhour/ui";
import { SkyBackground } from "../src/components/SkyBackground";
import { GlassSurface } from "../src/components/GlassSurface";
import { CTAButton } from "../src/components/CTAButton";
import { SavingsCard } from "../src/components/SavingsCard";
import { useThemeSky } from "../src/theme/useThemeSky";
import { useAuth } from "../src/lib/auth-context";

const PREFERENCE_LABELS: Record<string, string> = {
  bars: "Bars",
  cafes: "Cafés",
  events: "Événements",
  experiences: "Expériences",
};

export default function ProfileScreen() {
  const router = useRouter();
  const { textColor } = useThemeSky();
  const { session, profile, signOut } = useAuth();

  async function handleSignOut() {
    await signOut();
    router.replace("/(tabs)");
  }

  if (!session) {
    router.replace("/auth/sign-in");
    return null;
  }

  return (
    <SkyBackground>
      <View style={styles.content}>
        <View style={styles.avatarCircle}>
          <Feather name="user" size={32} color={colors.gold} />
        </View>
        <Text style={[styles.name, { color: textColor }]}>{profile?.display_name ?? session.user.email}</Text>
        <Text style={[styles.email, { color: textColor }]}>{session.user.email}</Text>

        {profile?.preferences && profile.preferences.length > 0 && (
          <GlassSurface shape="card" style={styles.prefsCard}>
            <View style={styles.prefsContent}>
              <Text style={[styles.prefsTitle, { color: textColor }]}>Préférences</Text>
              <Text style={[styles.prefsList, { color: textColor }]}>
                {profile.preferences.map((p) => PREFERENCE_LABELS[p] ?? p).join(" · ")}
              </Text>
            </View>
          </GlassSurface>
        )}

        <View style={{ width: "100%", marginTop: 16 }}>
          <SavingsCard />
        </View>

        <CTAButton label="Se déconnecter" onPress={handleSignOut} style={{ marginTop: 24 }} />
      </View>
    </SkyBackground>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, alignItems: "center", paddingHorizontal: 24, paddingTop: 80, gap: 8 },
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "rgba(120,120,128,0.16)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  name: { fontFamily: fonts.heading, fontSize: 22, fontWeight: "800" },
  email: { fontFamily: fonts.body, fontSize: fontSizes.body, opacity: 0.8 },
  prefsCard: { width: "100%", marginTop: 24 },
  prefsContent: { padding: 16, gap: 4 },
  prefsTitle: { fontFamily: fonts.heading, fontSize: fontSizes.cardTitle, fontWeight: "700" },
  prefsList: { fontFamily: fonts.body, fontSize: fontSizes.body, opacity: 0.85 },
});
