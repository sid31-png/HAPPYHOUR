import React from "react";
import { Tabs } from "expo-router";
import { GlassPillDock } from "../../src/components/GlassPillDock";

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={() => <GlassPillDock />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ title: "Explorer" }} />
      <Tabs.Screen name="carte" options={{ title: "Carte" }} />
      <Tabs.Screen name="resas" options={{ title: "Résas" }} />
      <Tabs.Screen name="club" options={{ title: "Club" }} />
    </Tabs>
  );
}
