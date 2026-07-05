import { useColorScheme } from "react-native";
import { colors, glass, skies, type ColorScheme } from "@happyhour/ui";

export interface ThemeSky {
  scheme: ColorScheme;
  isDark: boolean;
  sky: readonly string[];
  glass: (typeof glass)[ColorScheme];
  textColor: string;
  haloTop: number;
}

/** Central place every screen pulls Golden Hour tokens from, resolved for the active color scheme. */
export function useThemeSky(): ThemeSky {
  const scheme: ColorScheme = useColorScheme() === "dark" ? "dark" : "light";
  const isDark = scheme === "dark";
  return {
    scheme,
    isDark,
    sky: skies[scheme],
    glass: glass[scheme],
    textColor: isDark ? colors.textDark : colors.textLight,
    haloTop: isDark ? 0.42 : 0.26,
  };
}
