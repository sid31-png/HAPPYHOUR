import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ctaGradient, fonts, fontSizes, radii } from "@happyhour/ui";

interface CTAButtonProps {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * The one solid CTA gradient button per screen: linear-gradient(135deg,
 * #FFAE3D,#E8642E) with a warm drop shadow. Minimum 44px tap target.
 */
export function CTAButton({ label, onPress, disabled, loading, style }: CTAButtonProps) {
  const isDisabled = disabled || loading;
  const colorsTuple = ctaGradient.colors as unknown as [string, string];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      onPress={isDisabled ? undefined : onPress}
      style={[styles.wrapper, style, isDisabled && styles.disabledWrapper]}
    >
      <LinearGradient
        colors={colorsTuple}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.label}>{label}</Text>
        )}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: radii.pill,
    shadowColor: "#E8642E",
    shadowOpacity: 0.5,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  disabledWrapper: {
    opacity: 0.5,
  },
  gradient: {
    minHeight: 50,
    borderRadius: radii.pill,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  label: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.body,
    fontWeight: "700",
    color: "#FFFDF8",
  },
});
