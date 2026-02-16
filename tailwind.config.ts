import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#edf4f8",
          100: "#d8e8f0",
          200: "#b0d0df",
          300: "#89b4c8",
          400: "#6a96ad",
          500: "#4e7a92",
          600: "#3d6478",
          700: "#2d4f5f",
          800: "#1e3a48",
          900: "#142832",
          950: "#0a1a22",
        },
        sky: {
          300: "#89c4e1",
          400: "#6ab0d4",
          500: "#4682a9",
          600: "#356d8f",
        },
        accent: {
          400: "#f07942",
          500: "#e86830",
          600: "#d05525",
        },
        /* Semantic theme tokens */
        surface: {
          primary: "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
          tertiary: "var(--bg-tertiary)",
          input: "var(--bg-input)",
        },
        content: {
          primary: "var(--text-primary)",
          base: "var(--text-base)",
          strong: "var(--text-strong)",
          body: "var(--text-body)",
          muted: "var(--text-muted)",
          subtle: "var(--text-subtle)",
          faint: "var(--text-faint)",
          ghost: "var(--text-ghost)",
          placeholder: "var(--text-placeholder)",
        },
        hero: {
          DEFAULT: "var(--hero-text)",
          secondary: "var(--hero-text-secondary)",
          muted: "var(--hero-text-muted)",
        },
        edge: {
          DEFAULT: "var(--border-default)",
          subtle: "var(--border-subtle)",
          faint: "var(--border-faint)",
          input: "var(--border-input)",
          secondary: "var(--border-secondary)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      letterSpacing: {
        premium: "0.2em",
      },
      boxShadow: {
        "glow-accent": "0 0 40px rgba(232, 104, 48, 0.25)",
        "glow-accent-lg": "0 0 80px rgba(232, 104, 48, 0.3)",
        "glow-sky": "0 0 40px rgba(137, 196, 225, 0.2)",
        "glow-sky-lg": "0 0 80px rgba(137, 196, 225, 0.25)",
      },
      keyframes: {
        "scroll-hint": {
          "0%, 100%": { transform: "translateY(0)", opacity: "0.4" },
          "50%": { transform: "translateY(10px)", opacity: "0.8" },
        },
        "fade-in-up": {
          "0%": { transform: "translateY(30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "scroll-hint": "scroll-hint 2.5s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.8s ease-out forwards",
        "glow-pulse": "glow-pulse 4s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
