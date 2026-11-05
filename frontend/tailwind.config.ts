import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // EterPay / Miligram-inspired palette
        cream: "#fbf9f5",
        "cream-alt": "#f4f0e8",
        forest: {
          DEFAULT: "#0f4d40",
          dark: "#0a352c",
          light: "#166b59",
          mist: "rgba(15, 77, 64, 0.08)",
        },
        ink: {
          DEFAULT: "#111111",
          muted: "#555555",
          faint: "#888888",
        },
        charcoal: {
          DEFAULT: "#181818",
          card: "#1e1e1e",
        },
        // Keep legacy tokens for backward compat
        onyx: { DEFAULT: "#171721" },
        graphite: { DEFAULT: "#1e1e2a" },
        cobalt: { DEFAULT: "#5266eb" },
        success: "#16a34a",
        warning: "#d97706",
        danger: "#dc2626",
      },
      fontFamily: {
        serif: ["'ivypresto-headline'", "'Playfair Display'", "Didot", "'Bodoni MT'", "Georgia", "serif"],
        sans: ["'neue-haas-unica'", "'Plus Jakarta Sans'", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        pill: "9999px",
      },
      animation: {
        "float": "float 5s ease-in-out infinite",
        "spin-slow": "spin-slow 20s linear infinite",
        "marquee": "marquee 32s linear infinite",
        "fade-in-up": "fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      boxShadow: {
        card: "0 1px 3px rgba(17,17,17,0.08), 0 1px 2px rgba(17,17,17,0.04)",
        "card-hover": "0 8px 24px rgba(17,17,17,0.1), 0 2px 8px rgba(17,17,17,0.05)",
        dropdown: "0 20px 60px rgba(17,17,17,0.12), 0 4px 16px rgba(17,17,17,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
