import React, { useRef, useState } from "react";
import { Dimensions, FlatList, Pressable, StyleSheet, Text, View, type ViewToken } from "react-native";
import { useRouter } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import { colors, fonts, fontSizes } from "@happyhour/ui";
import { SkyBackground } from "../src/components/SkyBackground";
import { CTAButton } from "../src/components/CTAButton";
import { useThemeSky } from "../src/theme/useThemeSky";
import { markOnboardingSeen } from "../src/lib/onboarding-storage";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    icon: "compass" as const,
    title: "Découvrez",
    body: "Les happy hours en cours, en direct, avec un compte à rebours en temps réel autour de vous.",
  },
  {
    icon: "calendar" as const,
    title: "Réservez",
    body: "Tables, billets et expériences réservés en un tap, directement depuis l'app.",
  },
  {
    icon: "award" as const,
    title: "Le Club",
    body: "Un drink offert chaque semaine, des réductions et un accès prioritaire chez nos partenaires.",
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { textColor } = useThemeSky();
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems[0]?.index != null) setIndex(viewableItems[0].index);
  }).current;

  async function finish() {
    await markOnboardingSeen();
    router.replace("/(tabs)");
  }

  function next() {
    if (index < SLIDES.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1 });
    } else {
      finish();
    }
  }

  return (
    <SkyBackground>
      <View style={styles.skip}>
        <Pressable onPress={finish} accessibilityRole="button" hitSlop={8} style={styles.skipPressable}>
          <Text style={[styles.skipText, { color: textColor }]}>Passer</Text>
        </Pressable>
      </View>

      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(item) => item.title}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View style={styles.iconCircle}>
              <Feather name={item.icon} size={40} color={colors.gold} />
            </View>
            <Text style={[styles.title, { color: textColor }]}>{item.title}</Text>
            <Text style={[styles.body, { color: textColor }]}>{item.body}</Text>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((slide, i) => (
            <View
              key={slide.title}
              style={[styles.dot, { backgroundColor: i === index ? colors.gold : "rgba(120,120,128,0.3)" }]}
            />
          ))}
        </View>
        <CTAButton label={index === SLIDES.length - 1 ? "Commencer" : "Suivant"} onPress={next} />
      </View>
    </SkyBackground>
  );
}

const styles = StyleSheet.create({
  skip: { position: "absolute", top: 56, right: 20, zIndex: 1 },
  skipPressable: { minWidth: 44, minHeight: 44, alignItems: "flex-end", justifyContent: "center" },
  skipText: { fontFamily: fonts.body, fontSize: fontSizes.body, opacity: 0.8 },
  slide: { alignItems: "center", justifyContent: "center", paddingHorizontal: 32, gap: 16 },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "rgba(120,120,128,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontFamily: fonts.heading, fontSize: 26, fontWeight: "800", textAlign: "center" },
  body: { fontFamily: fonts.body, fontSize: fontSizes.body, textAlign: "center", opacity: 0.9, lineHeight: 20 },
  footer: { paddingHorizontal: 32, paddingBottom: 48, gap: 20 },
  dots: { flexDirection: "row", justifyContent: "center", gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4 },
});
