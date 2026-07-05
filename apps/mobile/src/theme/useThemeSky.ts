import { useColorScheme } from "react-native";
import { background, colors, glass, type ColorScheme } from "@happyhour/ui";

export interface ThemeSky {
  scheme: ColorScheme;
  isDark: boolean;
  background: string;
  glass: (typeof glass)[ColorScheme];
  textColor: string;
}

/** Central place every screen pulls theme tokens from, resolved for the active color scheme. */
export function useThemeSky(): ThemeSky {
  const scheme: ColorScheme = useColorScheme() === "dark" ? "dark" : "light";
  const isDark = scheme === "dark";
  return {
    scheme,
    isDark,
    background: background[scheme],
    glass: glass[scheme],
    textColor: isDark ? colors.textDark : colors.textLight,
  };
}
