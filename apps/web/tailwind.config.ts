import type { Config } from "tailwindcss";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const goldenHourPreset = require("@happyhour/ui/tailwind-preset");

const config: Config = {
  darkMode: "media",
  presets: [goldenHourPreset],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
