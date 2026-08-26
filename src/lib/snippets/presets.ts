import type { SnippetStyle, StylePresetId } from "./types";

export type StylePreset = {
  id: StylePresetId;
  label: string;
  blurb: string;
  /** Swatch shown on the preset button: [surface, border, accent]. */
  swatch: [string, string, string];
  style: SnippetStyle;
};

/** The original Snippet Studio look. */
export const STUDIO_PRESET: StylePreset = {
  id: "studio",
  label: "Studio",
  blurb: "Soft navy surfaces, pill buttons, accent-tinted icons.",
  swatch: ["#14171f", "#2a2f3a", "#6ee7b7"],
  style: {
    preset: "studio",
    scheme: "dark",
    background: "transparent",
    accent: "#6ee7b7",
    radius: 14,
    columns: 3,
    font: "sans",
    maxWidth: 960,
    showIcons: true,
    padding: 56,
  },
};

/**
 * Vercel-inspired system — see docs/styles/vercel.md.
 * Pure black canvas, 1px hairlines, inverted primary button, one blue accent.
 */
export const VERCEL_PRESET: StylePreset = {
  id: "vercel",
  label: "Vercel",
  blurb: "Pure black canvas, 1px hairlines, Geist type, single blue accent.",
  swatch: ["#0a0a0a", "#262626", "#0072f5"],
  style: {
    preset: "vercel",
    scheme: "dark",
    background: "#000000",
    accent: "#0072f5",
    radius: 12,
    columns: 3,
    font: "sans",
    maxWidth: 1100,
    showIcons: true,
    padding: 64,
  },
};

/**
 * JetBrains IDE-inspired system — see docs/styles/jetbrains.md.
 * Graphite chrome (#1E1F22 / #2B2D30), 4-6px radii, JetBrains Mono code, one blue accent.
 */
export const JETBRAINS_PRESET: StylePreset = {
  id: "jetbrains",
  label: "JetBrains",
  blurb: "Graphite IDE chrome, small 4-6px radii, JetBrains Mono, blue selection.",
  swatch: ["#1E1F22", "#393B40", "#3574F0"],
  style: {
    preset: "jetbrains",
    scheme: "dark",
    background: "#1E1F22",
    accent: "#3574F0",
    radius: 6,
    columns: 3,
    font: "sans",
    maxWidth: 1040,
    showIcons: true,
    padding: 56,
  },
};

/**
 * Apple Liquid Glass (WWDC 2025) — see docs/styles/liquid-glass.md.
 * Translucent blurred glass layers, specular hairlines, generous 22-28px radii,
 * fully rounded controls, SF-style type over a colorful backdrop.
 */
export const LIQUID_GLASS_PRESET: StylePreset = {
  id: "liquidglass",
  label: "Liquid Glass",
  blurb: "Translucent blurred glass, specular edges, capsule controls, SF type.",
  swatch: ["#5b7cfa", "rgba(255,255,255,0.5)", "#0a84ff"],
  style: {
    preset: "liquidglass",
    scheme: "dark",
    background:
      "radial-gradient(120% 120% at 12% 8%, #4f7bff 0%, #7a4dff 38%, #12142b 78%)",
    accent: "#0a84ff",
    radius: 26,
    columns: 3,
    font: "sans",
    maxWidth: 1040,
    showIcons: true,
    padding: 64,
  },
};

export const STYLE_PRESETS: StylePreset[] = [
  STUDIO_PRESET,
  VERCEL_PRESET,
  JETBRAINS_PRESET,
  LIQUID_GLASS_PRESET,
];
