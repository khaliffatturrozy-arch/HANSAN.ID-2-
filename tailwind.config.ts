import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/modules/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        hansan: {
          orange: "#FF7A00",
          blue: "#0029FF",
          ivory: "#FFF5D5",
          surface: "var(--hansan-surface)",
          "surface-soft": "var(--hansan-surface-soft)",
          "surface-raised": "var(--hansan-surface-raised)",
          ink: "var(--hansan-ink)",
          "ink-muted": "var(--hansan-ink-muted)",
          line: "var(--hansan-line)",
          success: "var(--hansan-success)",
          warning: "var(--hansan-warning)",
          danger: "var(--hansan-danger)",
          info: "var(--hansan-info)",
        },
      },
      fontFamily: {
        sans: [
          '"Glacial Indifference"',
          '"Segoe UI"',
          "system-ui",
          "sans-serif",
        ],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        neu: "var(--radius-neu)",
        sm: "var(--radius-sm)",
        xs: "var(--radius-xs)",
      },
      boxShadow: {
        // Modern Neumorphism + Minimalism + Premium SaaS (§10).
        // Raised: cards / primary controls / nav surfaces.
        // Inset: inputs / search / qty / selected controls.
        // Flat: dense tables / info sections / content-heavy areas.
        "neu-raised": "var(--neu-raised)",
        "neu-raised-sm": "var(--neu-raised-sm)",
        "neu-inset": "var(--neu-inset)",
        "neu-flat": "var(--neu-flat)",
      },
      transitionDuration: {
        fast: "150ms",
        base: "220ms",
      },
      zIndex: {
        header: "var(--z-header)",
        sidebar: "var(--z-sidebar)",
        drawer: "var(--z-drawer)",
        dialog: "var(--z-dialog)",
        toast: "var(--z-toast)",
        tooltip: "var(--z-tooltip)",
      },
      maxWidth: {
        shell: "var(--shell-content-max)",
      },
    },
  },
  plugins: [],
};
export default config;

