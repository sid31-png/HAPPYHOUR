/** Tailwind preset mirroring the Golden Hour tokens in ./tokens.ts. */

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
        textLight: "#3A2110",
        textDark: "#FFF6E8",
        liveGreen: "#6EF09A",
      },
      backgroundImage: {
        "sky-light":
          "linear-gradient(180deg, #FDEBD2 0%, #FBD9A8 25%, #F6B26B 50%, #EE8C4E 75%, #E2703F 100%)",
        "sky-dark":
          "linear-gradient(180deg, #1A1030 0%, #33184A 25%, #7A2E4A 50%, #C25A2E 75%, #E8842F 100%)",
        "cta-gradient": "linear-gradient(135deg, #FFAE3D, #E8642E)",
      },
      borderRadius: {
        card: "24px",
        pill: "100px",
      },
      fontFamily: {
        heading: ["var(--font-alegreya)", "sans-serif"],
        body: ["var(--font-hanken)", "sans-serif"],
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
        "glass-light": "inset 0 1px 0 rgba(255,255,255,0.85)",
        "glass-dark": "inset 0 1px 0 rgba(255,230,190,0.16)",
      },
    },
  },
  plugins: [],
};
