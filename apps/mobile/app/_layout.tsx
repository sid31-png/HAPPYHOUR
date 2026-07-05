import React, { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../src/lib/auth-context";
import { hasSeenOnboarding } from "../src/lib/onboarding-storage";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    hasSeenOnboarding()
      .then((seen) => {
        if (!seen) router.replace("/onboarding");
      })
      .finally(() => {
        setOnboardingChecked(true);
        SplashScreen.hideAsync().catch(() => {});
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!onboardingChecked) return null;

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
