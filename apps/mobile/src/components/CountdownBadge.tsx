import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { colors, fonts, fontSizes } from "@happyhour/ui";
import { formatMinutesRemaining } from "@happyhour/ui";
import { GlassSurface } from "./GlassSurface";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useThemeSky } from "../theme/useThemeSky";

/**
 * Signature "live happy hour" badge: a glass pill with a pulsing green dot
 * + the minutes-remaining text. The dot pairs with text so the "live"
 * state is never conveyed by color alone.
 */
export function CountdownBadge({ minutes }: { minutes: number }) {
  const pulse = useRef(new Animated.Value(0)).current;
  const reducedMotion = useReducedMotion();
  const { textColor } = useThemeSky();

  useEffect(() => {
    if (reducedMotion) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 800, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse, reducedMotion]);

  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.6] });
  const opacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.9, 0] });

  return (
    <GlassSurface shape="pill" style={styles.wrapper}>
      <View style={styles.content}>
        <View style={styles.dotWrapper}>
          {!reducedMotion && (
            <Animated.View
              style={[styles.dotPulse, { transform: [{ scale }], opacity }]}
              accessible={false}
            />
          )}
          <View style={styles.dot} />
        </View>
        <Text
          style={[styles.label, { color: textColor }]}
          accessibilityLabel={`En direct, se termine dans ${formatMinutesRemaining(minutes)}`}
        >
          {formatMinutesRemaining(minutes)}
        </Text>
      </View>
    </GlassSurface>
  );
}

const DOT_SIZE = 8;

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: "flex-start",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
  },
  dotWrapper: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: colors.liveGreen,
  },
  dotPulse: {
    position: "absolute",
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: colors.liveGreen,
  },
  label: {
    fontFamily: fonts.body,
    fontSize: fontSizes.meta,
    fontWeight: "700",
    color: colors.textLight,
  },
});
