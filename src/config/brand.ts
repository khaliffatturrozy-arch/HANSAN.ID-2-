/**
 * HANSAN Brand Tokens — SINGLE SOURCE OF TRUTH for brand values.
 * §11: Do not scatter hardcoded brand values throughout components.
 * Import from here or from `src/styles/tokens.css` / Tailwind theme.
 *
 * Typography: Glacial Indifference (loaded via next/font or @font-face;
 * falls back to system stack until the licensed font files are added).
 */

export const brand = {
  color: {
    orange: "#FF7A00",
    blue: "#0029FF",
    ivory: "#FFF5D5",
  },
  font: {
    family: '"Glacial Indifference", "Segoe UI", system-ui, sans-serif',
  },
} as const;

export type Brand = typeof brand;
