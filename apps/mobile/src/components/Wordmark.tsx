import React from "react";
import { Platform, Text, View } from "react-native";
import { colors, fontSizes } from "@happyhour/ui";
import { useThemeSky } from "../theme/useThemeSky";

/** "happyhour" wordmark in the system font (SF Pro on iOS), "hour" in gold. */
export function Wordmark({ size }: { size?: number }) {
  const { textColor } = useThemeSky();
  const fontSize = size ?? fontSizes.wordmark;
  const fontWeight = Platform.OS === "ios" ? "800" : "bold";

  return (
    <View style={{ flexDirection: "row" }}>
      <Text style={{ fontSize, fontWeight, color: textColor }}>happy</Text>
      <Text style={{ fontSize, fontWeight, color: colors.gold }}>hour</Text>
    </View>
  );
}
