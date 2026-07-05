/**
 * Golden Hour design system tokens — single source of truth shared by
 * the Tailwind preset (web) and the React Native theme (mobile).
 */

export const colors = {
  gold: "#F5A623",
  goldDeep: "#E07B1F",
  sunset: "#E8642E",
  amberLight: "#FFC864",
  burgundy: "#8E2157",
  textLight: "#3A2110",
  textDark: "#FFF6E8",
  liveGreen: "#6EF09A",
} as const;

/** Vertical sky gradients behind every screen. */
export const skies = {
  light: ["#FDEBD2", "#FBD9A8", "#F6B26B", "#EE8C4E", "#E2703F"],
  dark: ["#1A1030", "#33184A", "#7A2E4A", "#C25A2E", "#E8842F"],
} as const;

export const ctaGradient = {
  colors: ["#FFAE3D", "#E8642E"],
  angle: 135,
  shadowColor: "rgba(232,100,46,0.5)",
} as const;

/** Liquid-glass surface treatment for cards, search bars, docks. */
export const glass = {
  light: {
    background: "rgba(255,251,244,0.42)",
    border: "rgba(255,255,255,0.65)",
    borderWidth: 1,
    blur: 26,
    saturate: 170,
    insetHighlight: "rgba(255,255,255,0.85)",
  },
  dark: {
    background: "rgba(255,240,220,0.08)",
    border: "rgba(255,220,180,0.18)",
    borderWidth: 1,
    blur: 26,
    saturate: 170,
    insetHighlight: "rgba(255,230,190,0.16)",
  },
} as const;

export const radii = {
  card: 24,
  pill: 100,
} as const;

export const fonts = {
  heading: "Alegreya Sans",
  body: "Hanken Grotesk",
} as const;

export const fontSizes = {
  wordmark: 27,
  h2: 19,
  cardTitle: 15,
  body: 14,
  meta: 11.5,
  nav: 10,
} as const;

export const motion = {
  easing: "cubic-bezier(0.22,1,0.36,1)",
} as const;

export const liveGreenPulse = {
  color: colors.liveGreen,
  durationMs: 1600,
} as const;

export type ColorScheme = "light" | "dark";
