import React, { useEffect, useState } from "react";
import { useFonts as useAlegreyaSans } from "@expo-google-fonts/alegreya-sans";
import {
  AlegreyaSans_400Regular,
  AlegreyaSans_500Medium,
  AlegreyaSans_700Bold,
  AlegreyaSans_800ExtraBold,
} from "@expo-google-fonts/alegreya-sans";
import {
  useFonts as useHankenGrotesk,
  HankenGrotesk_400Regular,
  HankenGrotesk_500Medium,
  HankenGrotesk_600SemiBold,
  HankenGrotesk_700Bold,
} from "@expo-google-fonts/hanken-grotesk";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../src/lib/auth-context";
import { hasSeenOnboarding } from "../src/lib/onboarding-storage";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [alegreyaLoaded] = useAlegreyaSans({
    "Alegreya Sans": AlegreyaSans_400Regular,
    AlegreyaSans_500Medium,
    AlegreyaSans_700Bold,
    AlegreyaSans_800ExtraBold,
  });
  const [hankenLoaded] = useHankenGrotesk({
    "Hanken Grotesk": HankenGrotesk_400Regular,
    HankenGrotesk_500Medium,
    HankenGrotesk_600SemiBold,
    HankenGrotesk_700Bold,
  });

  const fontsLoaded = alegreyaLoaded && hankenLoaded;
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (!fontsLoaded) return;
    SplashScreen.hideAsync().catch(() => {});
  }, [fontsLoaded]);

  useEffect(() => {
    hasSeenOnboarding().then((seen) => {
      if (!seen) router.replace("/onboarding");
      setOnboardingChecked(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!fontsLoaded || !onboardingChecked) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <StatusBar style="auto" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="auth/sign-in" options={{ presentation: "modal" }} />
            <Stack.Screen name="auth/sign-up" options={{ presentation: "modal" }} />
            <Stack.Screen name="profile" options={{ presentation: "modal" }} />
            <Stack.Screen name="venue/[slug]" />
          </Stack>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
