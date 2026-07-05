/** Tailwind preset mirroring the design tokens in ./tokens.ts — Apple-style white/black theme. */

const SYSTEM_FONT_STACK = [
  "-apple-system",
  "BlinkMacSystemFont",
  '"SF Pro Display"',
  '"SF Pro Text"',
  '"Helvetica Neue"',
  "Arial",
  "sans-serif",
];

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        gold: "#F5A623",
        goldDeep: "#E07B1F",
        sunset: "#E8642E",
        amberLight: "#FFC864",
        burgundy: "#8E2157",
        textLight: "#1D1D1F",
        textDark: "#F5F5F7",
        liveGreen: "#6EF09A",
      },
      backgroundImage: {
        "cta-gradient": "linear-gradient(135deg, #FFAE3D, #E8642E)",
      },
      borderRadius: {
        card: "24px",
        pill: "100px",
      },
      fontFamily: {
        heading: SYSTEM_FONT_STACK,
        body: SYSTEM_FONT_STACK,
      },
      fontSize: {
        wordmark: ["27px", { lineHeight: "1.1" }],
        h2: ["19px", { lineHeight: "1.3" }],
        "card-title": ["15px", { lineHeight: "1.3" }],
        meta: ["11.5px", { lineHeight: "1.3" }],
        nav: ["10px", { lineHeight: "1.2" }],
      },
      transitionTimingFunction: {
        golden: "cubic-bezier(0.22,1,0.36,1)",
      },
      boxShadow: {
        cta: "0 8px 24px rgba(232,100,46,0.5)",
        "glass-light": "inset 0 1px 0 rgba(255,255,255,0.9)",
        "glass-dark": "inset 0 1px 0 rgba(255,255,255,0.1)",
      },
    },
  },
  plugins: [],
};
