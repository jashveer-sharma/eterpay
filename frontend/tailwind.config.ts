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
        /* Mercury × Brex Master Surfaces */
        onyx: {
          DEFAULT: "var(--color-onyx)",
          canvas: "var(--color-onyx)",
        },
        graphite: {
          DEFAULT: "var(--color-graphite)",
          card: "var(--color-graphite)",
        },
        obsidian: "var(--color-obsidian)",
        abyss: "var(--color-abyss)",
        carbon: "var(--color-carbon)",

        /* Typography */
        ivory: {
          DEFAULT: "var(--color-ivory)",
          2: "var(--color-ash)",
        },
        ash: "var(--color-ash)",

        /* Chromatic Signatures */
        cobalt: {
          DEFAULT: "var(--color-cobalt)",
          hover: "var(--color-cobalt-hover)",
          soft: "var(--color-cobalt-soft)",
        },
        ember: {
          DEFAULT: "var(--color-ember)",
          soft: "var(--color-ember-soft)",
        },
        hairline: {
          DEFAULT: "var(--color-hairline)",
          hi: "var(--color-hairline-hi)",
        },

        /* Backwards-compatible tokens */
        paper: {
          DEFAULT: "var(--color-paper)",
          2: "var(--color-paper-2)",
          3: "var(--color-paper-3)",
        },
        ink: {
          DEFAULT: "var(--color-ink)",
          2: "var(--color-ink-2)",
        },
        muted: "var(--color-muted)",
        rule: {
          DEFAULT: "var(--color-rule)",
          2: "var(--color-rule-2)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          ink: "var(--color-accent-ink)",
          soft: "var(--color-accent-soft)",
        },
        periwinkle: {
          DEFAULT: "var(--color-periwinkle)",
          soft: "var(--color-periwinkle-soft)",
        },
        cyan: "var(--color-cyan)",
        danger: "var(--color-danger)",
        warning: "var(--color-warning)",
        success: "var(--color-success)",
      },
      borderRadius: {
        pill: "var(--radius-pill)",
        card: "var(--radius-card)",
      },
    },
  },
  plugins: [],
};
export default config;
