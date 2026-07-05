import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import type { UserPreference } from "@happyhour/types";
import { fonts, fontSizes } from "@happyhour/ui";
import { SkyBackground } from "../../src/components/SkyBackground";
import { GlassSurface } from "../../src/components/GlassSurface";
import { CTAButton } from "../../src/components/CTAButton";
import { PreferenceChip } from "../../src/components/PreferenceChip";
import { useThemeSky } from "../../src/theme/useThemeSky";
import { useAuth } from "../../src/lib/auth-context";

const PREFERENCE_OPTIONS: { value: UserPreference; label: string }[] = [
  { value: "bars", label: "Bars" },
  { value: "cafes", label: "Cafés" },
  { value: "events", label: "Événements" },
  { value: "experiences", label: "Expériences" },
];

export default function SignUpScreen() {
  const router = useRouter();
  const { textColor } = useThemeSky();
  const { signUpWithEmail, isConfigured } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [preferences, setPreferences] = useState<UserPreference[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function togglePreference(value: UserPreference) {
    setPreferences((prev) => (prev.includes(value) ? prev.filter((p) => p !== value) : [...prev, value]));
  }

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    const result = await signUpWithEmail(email, password, preferences);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.replace("/(tabs)");
  }

  return (
    <SkyBackground>
      <View style={styles.content}>
        <Text style={[styles.title, { color: textColor }]}>Créer un compte</Text>
        <Text style={[styles.subtitle, { color: textColor }]}>Choisissez ce qui vous intéresse à Doha.</Text>

        <View style={styles.chipRow}>
          {PREFERENCE_OPTIONS.map((option) => (
            <PreferenceChip
              key={option.value}
              label={option.label}
              selected={preferences.includes(option.value)}
              onPress={() => togglePreference(option.value)}
            />
          ))}
        </View>

        <GlassSurface shape="pill" style={styles.inputWrapper}>
          <TextInput
            placeholder="vous@exemple.com"
            placeholderTextColor="rgba(120,90,60,0.6)"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            style={[styles.input, { color: textColor }]}
          />
        </GlassSurface>
        <GlassSurface shape="pill" style={styles.inputWrapper}>
          <TextInput
            placeholder="Mot de passe"
            placeholderTextColor="rgba(120,90,60,0.6)"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={[styles.input, { color: textColor }]}
          />
        </GlassSurface>

        {error && <Text style={styles.error}>{error}</Text>}

        <CTAButton label="Créer mon compte" onPress={handleSubmit} loading={loading} disabled={!isConfigured} />

        <Text
          style={[styles.link, { color: textColor }]}
          onPress={() => router.replace("/auth/sign-in")}
          accessibilityRole="link"
        >
          Déjà un compte ? Connectez-vous
        </Text>
      </View>
    </SkyBackground>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 70, gap: 14 },
  title: { fontFamily: fonts.heading, fontSize: 26, fontWeight: "800" },
  subtitle: { fontFamily: fonts.body, fontSize: fontSizes.body, opacity: 0.85, marginBottom: 4 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 },
  inputWrapper: { width: "100%" },
  input: { fontFamily: fonts.body, fontSize: fontSizes.body, minHeight: 48, paddingHorizontal: 18 },
  error: { fontFamily: fonts.body, fontSize: fontSizes.meta, color: "#C24D4D" },
  link: { fontFamily: fonts.body, fontSize: fontSizes.body, textAlign: "center", marginTop: 12, opacity: 0.9 },
});
