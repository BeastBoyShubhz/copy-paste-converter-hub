import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        paper: {
          DEFAULT: "var(--paper)",
          deep: "var(--paper-deep)",
          card: "var(--paper-card)",
        },
        ink: {
          DEFAULT: "var(--ink)",
          soft: "var(--ink-soft)",
          muted: "var(--ink-muted)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          deep: "var(--accent-deep)",
          tint: "var(--accent-tint)",
        },
        rule: {
          DEFAULT: "var(--rule)",
          soft: "var(--rule-soft)",
        },
      },
      letterSpacing: {
        "caps": "0.18em",
        "tight-display": "-0.02em",
      },
    },
  },
  plugins: [],
};
export default config;
