import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import { colors, fonts, fontSizes } from "@happyhour/ui";
import { GlassSurface } from "./GlassSurface";
import { useThemeSky } from "../theme/useThemeSky";

const DOCK_MARGIN = 22;

interface DockRoute {
  href: "/" | "/carte" | "/resas" | "/club";
  label: string;
  icon: keyof typeof Feather.glyphMap;
}

const ROUTES: DockRoute[] = [
  { href: "/", label: "Explorer", icon: "compass" },
  { href: "/carte", label: "Carte", icon: "map" },
  { href: "/resas", label: "Résas", icon: "calendar" },
  { href: "/club", label: "Club", icon: "award" },
];

/**
 * Floating glass-pill bottom dock, detached from the bottom edge (~22px
 * margin). Renders as the custom `tabBar` for the (tabs) group's Tabs
 * navigator, but drives navigation itself via expo-router's router/pathname
 * rather than the react-navigation tab props — simpler and avoids pulling
 * in @react-navigation/bottom-tabs types directly.
 */
export function GlassPillDock() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { textColor } = useThemeSky();

  return (
    <View style={[styles.container, { bottom: DOCK_MARGIN + insets.bottom }]} pointerEvents="box-none">
      <GlassSurface shape="pill" style={styles.dock}>
        <View style={styles.row}>
          {ROUTES.map((route) => {
            const active = pathname === route.href;
            return (
              <Pressable
                key={route.href}
                onPress={() => router.push(route.href)}
                accessibilityRole="button"
                accessibilityLabel={route.label}
                accessibilityState={{ selected: active }}
                style={styles.tab}
                hitSlop={8}
              >
                <View style={[styles.iconWrapper, active && styles.iconWrapperActive]}>
                  <Feather
                    name={route.icon}
                    size={22}
                    color={active ? colors.gold : textColor}
                  />
                </View>
                <Text
                  style={[
                    styles.tabLabel,
                    { color: active ? colors.gold : textColor, opacity: active ? 1 : 0.7 },
                  ]}
                >
                  {route.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </GlassSurface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  dock: {
    shadowColor: colors.goldDeep,
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  row: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  tab: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 64,
    minHeight: 44,
    paddingHorizontal: 8,
    gap: 2,
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapperActive: {
    shadowColor: colors.gold,
    shadowOpacity: 0.8,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  tabLabel: {
    fontFamily: fonts.body,
    fontSize: fontSizes.nav,
    fontWeight: "600",
  },
});
