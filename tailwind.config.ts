import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["'Space Grotesk'", "Inter", "system-ui", "sans-serif"],
        caveat: ["Caveat", "cursive"],
        "caveat-brush": ["'Caveat Brush'", "cursive"],
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        wobble: {
          "0%, 100%": { transform: "rotate(-2deg)" },
          "50%": { transform: "rotate(2deg)" },
        },
        pulseScale: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.08)" },
        },
        bounceDot: {
          "0%, 80%, 100%": { transform: "translateY(0)" },
          "40%": { transform: "translateY(-8px)" },
        },
        waveBar: {
          "0%, 100%": { transform: "scaleY(0.4)" },
          "50%": { transform: "scaleY(1)" },
        },
        micPulse: {
          "0%": { boxShadow: "0 0 0 0 rgba(239,68,68,0.5)" },
          "70%": { boxShadow: "0 0 0 18px rgba(239,68,68,0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(239,68,68,0)" },
        },
      },
      animation: {
        float: "float 3.5s ease-in-out infinite",
        wobble: "wobble 0.6s ease-in-out infinite",
        pulseScale: "pulseScale 1.2s ease-in-out infinite",
        micPulse: "micPulse 1.4s ease-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
