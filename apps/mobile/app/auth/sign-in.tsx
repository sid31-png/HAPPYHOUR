import React, { useState } from "react";
import { Platform, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import * as AppleAuthentication from "expo-apple-authentication";
import { fonts, fontSizes } from "@happyhour/ui";
import { SkyBackground } from "../../src/components/SkyBackground";
import { GlassSurface } from "../../src/components/GlassSurface";
import { CTAButton } from "../../src/components/CTAButton";
import { useThemeSky } from "../../src/theme/useThemeSky";
import { useAuth } from "../../src/lib/auth-context";

export default function SignInScreen() {
  const router = useRouter();
  const { textColor } = useThemeSky();
  const { signInWithEmail, isConfigured } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    const result = await signInWithEmail(email, password);
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
        <Text style={[styles.title, { color: textColor }]}>Connexion</Text>
        <Text style={[styles.subtitle, { color: textColor }]}>
          Retrouvez vos favoris et vos réservations Happy Hour.
        </Text>

        {!isConfigured && (
          <Text style={[styles.warning, { color: textColor }]}>
            Supabase n'est pas encore configuré — voir apps/mobile/.env.example.
          </Text>
        )}

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

        <CTAButton label="Se connecter" onPress={handleSubmit} loading={loading} disabled={!isConfigured} />

        {Platform.OS === "ios" && (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={100}
            style={styles.appleButton}
            onPress={() => {
              // Nécessite un identifiant client Apple configuré côté Supabase Auth avant de fonctionner.
            }}
          />
        )}

        <GlassSurface shape="pill" style={styles.googlePlaceholder}>
          <Text style={[styles.googleText, { color: textColor }]}>
            Google — nécessite un client OAuth Supabase configuré
          </Text>
        </GlassSurface>

        <Text
          style={[styles.link, { color: textColor }]}
          onPress={() => router.replace("/auth/sign-up")}
          accessibilityRole="link"
        >
          Pas encore de compte ? Inscrivez-vous
        </Text>
      </View>
    </SkyBackground>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 80, gap: 14 },
  title: { fontFamily: fonts.heading, fontSize: 26, fontWeight: "800" },
  subtitle: { fontFamily: fonts.body, fontSize: fontSizes.body, opacity: 0.85, marginBottom: 10 },
  warning: { fontFamily: fonts.body, fontSize: fontSizes.meta, opacity: 0.8, marginBottom: 4 },
  inputWrapper: { width: "100%" },
  input: { fontFamily: fonts.body, fontSize: fontSizes.body, minHeight: 48, paddingHorizontal: 18 },
  error: { fontFamily: fonts.body, fontSize: fontSizes.meta, color: "#C24D4D" },
  appleButton: { height: 50, marginTop: 6 },
  googlePlaceholder: { width: "100%", minHeight: 50, alignItems: "center", justifyContent: "center" },
  googleText: { fontFamily: fonts.body, fontSize: fontSizes.meta, opacity: 0.75, textAlign: "center", paddingHorizontal: 12 },
  link: { fontFamily: fonts.body, fontSize: fontSizes.body, textAlign: "center", marginTop: 12, opacity: 0.9 },
});
