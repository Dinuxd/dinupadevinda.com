import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        graphite: {
          950: "#020817",
          900: "#071324",
          850: "#0c2038",
          800: "#123054"
        },
        signal: {
          cyan: "#4dd8ff",
          green: "#2dd4bf",
          amber: "#7dd3fc"
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        panel: "0 26px 80px rgba(0, 11, 32, 0.34)",
        glow: "0 0 32px rgba(77,216,255,0.14)",
        "glow-lg": "0 18px 70px rgba(45,212,191,0.16)"
      }
    }
  },
  plugins: []
};

export default config;
