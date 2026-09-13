import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    letterSpacing: { tight: "0", normal: "0", wide: "0", wider: "0", widest: "0" },
    extend: {
      colors: {
        slate: colors.neutral,
        cyan: colors.neutral,
        teal: colors.neutral,
        blue: colors.neutral,
        emerald: colors.neutral,
        red: colors.neutral,
        graphite: {
          950: "#0a0a0a",
          900: "#141414",
          850: "#1c1c1c",
          800: "#262626"
        },
        signal: {
          cyan: "#a8c7ff",
          green: "#d4d4d4",
          sky: "#bfd5ff"
        }
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"]
      },
      boxShadow: {
        panel: "0 20px 60px rgba(0, 0, 0, 0.24)",
        glow: "0 0 0 1px rgba(255,255,255,0.08)",
        "glow-lg": "0 0 0 1px rgba(255,255,255,0.2)"
      }
    }
  },
  plugins: []
};

export default config;
