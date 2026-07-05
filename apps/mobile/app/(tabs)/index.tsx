import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import { getLiveHappyHours, getOffersWithContext, getUpcomingEvents } from "@happyhour/api";
import type { HappyEvent, LiveHappyHour, OfferWithContext, Venue } from "@happyhour/types";
import { fonts, fontSizes } from "@happyhour/ui";
import { SkyBackground } from "../../src/components/SkyBackground";
import { Wordmark } from "../../src/components/Wordmark";
import { SearchBarGlass } from "../../src/components/SearchBarGlass";
import { SectionHeader } from "../../src/components/SectionHeader";
import { VenueLiveCard } from "../../src/components/VenueLiveCard";
import { LastChanceCard } from "../../src/components/LastChanceCard";
import { SavingsCard } from "../../src/components/SavingsCard";
import { OfferActivationSheet } from "../../src/components/OfferActivationSheet";
import { EventCard } from "../../src/components/EventCard";
import { EmptyState } from "../../src/components/EmptyState";
import { LoadingState } from "../../src/components/LoadingState";
import { useThemeSky } from "../../src/theme/useThemeSky";
import { useAuth } from "../../src/lib/auth-context";
import { getSupabase } from "../../src/lib/supabase";
import { DOHA_DEFAULT_LOCATION_LABEL } from "../../src/data/dohaDefaultCenter";

export default function ExplorerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { textColor } = useThemeSky();
  const { session } = useAuth();

  const [liveHappyHours, setLiveHappyHours] = useState<LiveHappyHour[] | null>(null);
  const [events, setEvents] = useState<(HappyEvent & { venue: Venue })[] | null>(null);
  const [offers, setOffers] = useState<OfferWithContext[] | null>(null);
  const [activeOffer, setActiveOffer] = useState<OfferWithContext | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    const client = getSupabase();
    if (!client) {
      setError(true);
      setLiveHappyHours([]);
      setEvents([]);
      setOffers([]);
      return;
    }
    try {
      const [live, upcoming, offersWithContext] = await Promise.all([
        getLiveHappyHours(client),
        getUpcomingEvents(client, 8),
        getOffersWithContext(client),
      ]);
      setLiveHappyHours(live);
      setEvents(upcoming);
      setOffers(offersWithContext);
      setError(false);
    } catch {
      setError(true);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  const offerByHappyHourId = useMemo(() => {
    const map = new Map<string, OfferWithContext>();
    for (const offer of offers ?? []) {
      if (offer.happy_hour_id) map.set(offer.happy_hour_id, offer);
    }
    return map;
  }, [offers]);

  const lastChanceOffers = useMemo(
    () => (offers ?? []).filter((o) => o.is_last_chance).sort((a, b) => (a.minutes_remaining ?? 0) - (b.minutes_remaining ?? 0)),
    [offers]
  );

  return (
    <SkyBackground>
      <ScrollView
        style={styles.fill}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: 140 }]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={textColor} />}
      >
        <View style={styles.header}>
          <Wordmark />
          <Pressable
            onPress={() => router.push(session ? "/profile" : "/auth/sign-in")}
            accessibilityRole="button"
            accessibilityLabel="Profil"
            style={styles.locationRow}
            hitSlop={8}
          >
            <Feather name="map-pin" size={14} color={textColor} style={{ opacity: 0.8 }} />
            <Text style={[styles.locationLabel, { color: textColor }]}>{DOHA_DEFAULT_LOCATION_LABEL}</Text>
          </Pressable>
        </View>

        <SearchBarGlass />

        <SavingsCard />

        <View style={styles.section}>
          <SectionHeader title="En cours près de vous" subtitle="Happy hours en direct, mis à jour en temps réel" />
          {error && (
            <EmptyState
              icon="wifi-off"
              title="Supabase n'est pas encore configuré"
              message="Renseignez EXPO_PUBLIC_SUPABASE_URL et EXPO_PUBLIC_SUPABASE_ANON_KEY dans apps/mobile/.env pour charger les données."
            />
          )}
          {!error && liveHappyHours === null && <LoadingState />}
          {!error && liveHappyHours !== null && liveHappyHours.length === 0 && (
            <EmptyState icon="moon" title="Aucun happy hour en direct" message="Revenez un peu plus tard dans la journée." />
          )}
          {!error && liveHappyHours && liveHappyHours.length > 0 && (
            <FlatList
              data={liveHappyHours}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
              renderItem={({ item }) => (
                <VenueLiveCard
                  item={item}
                  offer={offerByHappyHourId.get(item.id) ?? null}
                  onPress={() => router.push(`/venue/${item.venue.slug}`)}
                  onActivateOffer={
                    offerByHappyHourId.has(item.id) ? () => setActiveOffer(offerByHappyHourId.get(item.id)!) : undefined
                  }
                />
              )}
            />
          )}
        </View>

        {lastChanceOffers.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="Dernière chance" subtitle="Ces offres se terminent dans moins d'une heure" />
            <FlatList
              data={lastChanceOffers}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
              renderItem={({ item }) => <LastChanceCard offer={item} onPress={() => setActiveOffer(item)} />}
            />
          </View>
        )}

        <View style={styles.section}>
          <SectionHeader title="Ce soir" subtitle="Événements et expériences à venir" />
          {!error && events === null && <LoadingState height={84} />}
          {!error && events !== null && events.length === 0 && (
            <EmptyState icon="calendar" title="Aucun événement à venir" />
          )}
          {!error && events && events.length > 0 && (
            <View style={{ gap: 10 }}>
              {events.map((item) => (
                <EventCard key={item.id} item={item} onPress={() => router.push(`/venue/${item.venue.slug}`)} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <OfferActivationSheet offer={activeOffer} onClose={() => setActiveOffer(null)} />
    </SkyBackground>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    minHeight: 44,
  },
  locationLabel: {
    fontFamily: fonts.body,
    fontSize: fontSizes.meta,
  },
  section: { gap: 12 },
  horizontalList: { gap: 12, paddingRight: 8 },
});
