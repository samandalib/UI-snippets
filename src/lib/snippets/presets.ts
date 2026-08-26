import type { StylePreset } from './types'

export const STUDIO_PRESET: StylePreset = {
  id: 'studio',
  label: 'Studio',
  blurb: 'Soft navy surfaces, pill buttons, accent-tinted icon wells. Transparent bg, accent #6ee7b7, radius 14, 3 columns.',
  swatch: ['#1a1a2e', '#16213e', '#6ee7b7'],
  style: {
    preset: 'studio',
    scheme: 'dark',
    background: 'transparent',
    accent: '#6ee7b7',
    radius: 14,
    columns: 3,
    font: 'sans',
    maxWidth: 960,
    showIcons: true,
    padding: 56,
  },
}

export const VERCEL_PRESET: StylePreset = {
  id: 'vercel',
  label: 'Vercel',
  blurb: 'Pure black #000, 1px #262626 hairlines, Geist type, inverted primary button, single blue #0072f5. Radius 12, 1 column.',
  swatch: ['#000000', '#262626', '#0072f5'],
  style: {
    preset: 'vercel',
    scheme: 'dark',
    background: 'transparent',
    accent: '#0072f5',
    radius: 12,
    columns: 1,
    font: 'sans',
    maxWidth: 960,
    showIcons: true,
    padding: 64,
  },
}

export const JETBRAINS_PRESET: StylePreset = {
  id: 'jetbrains',
  label: 'JetBrains',
  blurb: 'Graphite IDE chrome #1E1F22 + #2B2D30, radius 6, JetBrains Mono, blue #3574F0 selection rows. Width 1600.',
  swatch: ['#1E1F22', '#2B2D30', '#3574F0'],
  style: {
    preset: 'jetbrains',
    scheme: 'dark',
    background: 'transparent',
    accent: '#3574F0',
    radius: 6,
    columns: 3,
    font: 'mono',
    maxWidth: 1600,
    showIcons: true,
    padding: 48,
  },
}

export const LIQUID_GLASS_PRESET: StylePreset = {
  id: 'liquidglass',
  label: 'Liquid Glass',
  blurb: 'Translucent blurred glass layer over colorful gradient backdrop, specular hairlines, capsule controls, SF type, accent #0a84ff. Radius 26.',
  swatch: ['#ffffff', '#ffffff', '#0a84ff'],
  style: {
    preset: 'liquidglass',
    scheme: 'light',
    background: 'radial-gradient(120% 120% at 12% 8%, #4f7bff 0%, #7d4dff 38%, #121428 78%)',
    accent: '#0a84ff',
    radius: 26,
    columns: 3,
    font: 'sans',
    maxWidth: 1040,
    showIcons: true,
    padding: 56,
  },
}

export const STYLE_PRESETS = [STUDIO_PRESET, VERCEL_PRESET, JETBRAINS_PRESET, LIQUID_GLASS_PRESET]
