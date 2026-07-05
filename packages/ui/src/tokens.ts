/**
 * Design system tokens — single source of truth shared by the Tailwind
 * preset (web) and the React Native theme (mobile). Apple-style: flat
 * white (light) / black (dark) backgrounds, neutral frosted-glass
 * surfaces, system typography (SF Pro via the OS on both platforms).
 */

export const colors = {
  gold: "#F5A623",
  goldDeep: "#E07B1F",
  sunset: "#E8642E",
  amberLight: "#FFC864",
  burgundy: "#8E2157",
  textLight: "#1D1D1F",
  textDark: "#F5F5F7",
  liveGreen: "#6EF09A",
} as const;

/** Flat screen background — pure white in light mode, pure black in dark mode. */
export const background = {
  light: "#FFFFFF",
  dark: "#000000",
} as const;

export const ctaGradient = {
  colors: ["#FFAE3D", "#E8642E"],
  angle: 135,
  shadowColor: "rgba(232,100,46,0.5)",
} as const;

/** Neutral frosted-glass surface treatment for cards, search bars, docks. */
export const glass = {
  light: {
    background: "rgba(255,255,255,0.6)",
    border: "rgba(0,0,0,0.08)",
    borderWidth: 1,
    blur: 26,
    saturate: 170,
    insetHighlight: "rgba(255,255,255,0.9)",
  },
  dark: {
    background: "rgba(255,255,255,0.08)",
    border: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    blur: 26,
    saturate: 170,
    insetHighlight: "rgba(255,255,255,0.1)",
  },
} as const;

export const radii = {
  card: 24,
  pill: 100,
} as const;

/** System font stack — renders as true SF Pro on iOS/macOS/Safari, Roboto on Android. */
export const fonts = {
  heading: "System",
  body: "System",
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
