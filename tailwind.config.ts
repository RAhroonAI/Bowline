import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: {
          DEFAULT: "#FAF7F2",
          50: "#FDFBF7",
          100: "#FAF7F2",
          200: "#F4EFE5",
          300: "#EAE2D2",
        },
        ink: {
          DEFAULT: "#1E3A5F",
          50: "#E8EDF3",
          100: "#C5D0DD",
          400: "#3A5577",
          500: "#1E3A5F",
          700: "#162B47",
          900: "#0D1B2E",
        },
        terra: {
          DEFAULT: "#C8694A",
          400: "#D17A5E",
          500: "#C8694A",
          600: "#B05839",
          50: "#FBEEE8",
        },
        sea: {
          DEFAULT: "#5A8BA8",
          300: "#8FB0C4",
          400: "#7099B5",
          500: "#5A8BA8",
          600: "#46748F",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(30, 58, 95, 0.04), 0 4px 12px rgba(30, 58, 95, 0.06)",
        cardHover: "0 1px 2px rgba(30, 58, 95, 0.05), 0 8px 24px rgba(30, 58, 95, 0.10)",
      },
      keyframes: {
        strike: {
          "0%": { backgroundSize: "0% 2px" },
          "100%": { backgroundSize: "100% 2px" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        strike: "strike 280ms ease-out forwards",
        fadeIn: "fadeIn 200ms ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
