import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getVenuesNearby } from "@happyhour/api";
import type { VenueWithDistance } from "@happyhour/types";
import { colors, fonts, fontSizes } from "@happyhour/ui";
import { GlassSurface } from "../../src/components/GlassSurface";
import { CTAButton } from "../../src/components/CTAButton";
import { EmptyState } from "../../src/components/EmptyState";
import { useThemeSky } from "../../src/theme/useThemeSky";
import { getSupabase } from "../../src/lib/supabase";
import { WEST_BAY_COORDS } from "../../src/data/dohaDefaultCenter";

export default function CarteScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { textColor } = useThemeSky();

  const [center, setCenter] = useState<{ latitude: number; longitude: number }>(WEST_BAY_COORDS);
  const [venues, setVenues] = useState<VenueWithDistance[]>([]);
  const [selected, setSelected] = useState<VenueWithDistance | null>(null);
  const [error, setError] = useState(false);
  const sheetAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      let coords: { latitude: number; longitude: number } = WEST_BAY_COORDS;
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const position = await Location.getCurrentPositionAsync({});
        coords = { latitude: position.coords.latitude, longitude: position.coords.longitude };
      }
      setCenter(coords);

      const client = getSupabase();
      if (!client) {
        setError(true);
        return;
      }
      try {
        const nearby = await getVenuesNearby(client, coords.latitude, coords.longitude);
        setVenues(nearby);
      } catch {
        setError(true);
      }
    })();
  }, []);

  function selectVenue(venue: VenueWithDistance) {
    setSelected(venue);
    Animated.spring(sheetAnim, { toValue: 1, useNativeDriver: true, bounciness: 4 }).start();
  }

  function closeSheet() {
    Animated.timing(sheetAnim, { toValue: 0, duration: 180, useNativeDriver: true }).start(() => setSelected(null));
  }

  if (error) {
    return (
      <View style={[styles.fallback, { paddingTop: insets.top + 24 }]}>
        <EmptyState
          icon="wifi-off"
          title="Supabase n'est pas encore configuré"
          message="La carte a besoin d'une connexion Supabase pour afficher les lieux autour de vous."
        />
      </View>
    );
  }

  return (
    <View style={styles.fill}>
      <MapView
        style={styles.fill}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: center.latitude,
          longitude: center.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {venues.map((venue) => (
          <Marker
            key={venue.id}
            coordinate={{ latitude: venue.lat, longitude: venue.lng }}
            onPress={() => selectVenue(venue)}
          >
            <View style={[styles.markerPin, venue.live_happy_hour && styles.markerPinLive]}>
              <Text style={styles.markerLabel}>{venue.live_happy_hour ? "•" : ""}</Text>
            </View>
          </Marker>
        ))}
      </MapView>

      {selected && (
        <Pressable style={StyleSheet.absoluteFill} onPress={closeSheet}>
          <Animated.View
            style={[
              styles.sheetWrapper,
              {
                paddingBottom: insets.bottom + 22,
                transform: [
                  {
                    translateY: sheetAnim.interpolate({ inputRange: [0, 1], outputRange: [200, 0] }),
                  },
                ],
                opacity: sheetAnim,
              },
            ]}
          >
            <Pressable onPress={(e) => e.stopPropagation()}>
              <GlassSurface shape="card" style={styles.sheet}>
                <View style={styles.sheetContent}>
                  <Text style={[styles.sheetTitle, { color: textColor }]}>{selected.name}</Text>
                  <Text style={[styles.sheetMeta, { color: textColor }]}>
                    {selected.live_happy_hour ? selected.live_happy_hour.title : "Pas de happy hour en cours"} ·{" "}
                    {selected.distance_km} km
                  </Text>
                  <CTAButton label="Voir" onPress={() => router.push(`/venue/${selected.slug}`)} />
                </View>
              </GlassSurface>
            </Pressable>
          </Animated.View>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  fallback: { flex: 1, paddingHorizontal: 20 },
  markerPin: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.textLight,
    borderWidth: 2,
    borderColor: "#FFF6E8",
  },
  markerPinLive: {
    backgroundColor: colors.gold,
    borderColor: colors.liveGreen,
  },
  markerLabel: { display: "none" },
  sheetWrapper: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 0,
  },
  sheet: { width: "100%" },
  sheetContent: { padding: 18, gap: 10 },
  sheetTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.h2,
    fontWeight: "700",
  },
  sheetMeta: {
    fontFamily: fonts.body,
    fontSize: fontSizes.body,
    opacity: 0.85,
  },
});
