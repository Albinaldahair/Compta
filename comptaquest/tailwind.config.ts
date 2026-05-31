import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        pixel: ["var(--font-pixel)", "monospace"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        ink: "#0b0d12",
        paper: "#fbf7ee",
        gold: "#f5c518",
        rose: "#ff5d8f",
        teal: "#06d6a0",
        violet: "#7c3aed",
      },
      boxShadow: {
        chunky: "6px 6px 0 0 #0b0d12",
        chunkySm: "3px 3px 0 0 #0b0d12",
      },
      keyframes: {
        wiggle: {
          "0%,100%": { transform: "rotate(-2deg)" },
          "50%": { transform: "rotate(2deg)" },
        },
        bounceY: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        sparkle: {
          "0%": { opacity: "0", transform: "scale(0.5)" },
          "50%": { opacity: "1", transform: "scale(1.2)" },
          "100%": { opacity: "0", transform: "scale(0.5)" },
        },
      },
      animation: {
        wiggle: "wiggle 0.6s ease-in-out infinite",
        bounceY: "bounceY 1.2s ease-in-out infinite",
        sparkle: "sparkle 1.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
