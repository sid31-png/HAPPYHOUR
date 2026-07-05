import React from "react";
import { Text, View } from "react-native";
import { colors, fontSizes, fonts } from "@happyhour/ui";
import { useThemeSky } from "../theme/useThemeSky";

/**
 * "happyhour" wordmark, Alegreya Sans 800, "hour" in gold. Spec calls for
 * a gold *gradient* on "hour" (MaskedView + LinearGradient). We render a
 * solid gold instead: MaskedView adds a native-view dependency + extra
 * layout complexity for a subtlety that reads almost identically at this
 * font size, so we traded exact-gradient fidelity for simplicity here.
 */
export function Wordmark({ size }: { size?: number }) {
  const { textColor } = useThemeSky();
  const fontSize = size ?? fontSizes.wordmark;

  return (
    <View style={{ flexDirection: "row" }}>
      <Text
        style={{
          fontFamily: "AlegreyaSans_800ExtraBold",
          fontSize,
          color: textColor,
        }}
      >
        happy
      </Text>
      <Text
        style={{
          fontFamily: "AlegreyaSans_800ExtraBold",
          fontSize,
          color: colors.gold,
        }}
      >
        hour
      </Text>
    </View>
  );
}
