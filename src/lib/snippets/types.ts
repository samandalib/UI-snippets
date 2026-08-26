export type TemplateId = 'feature-grid' | 'feature-split' | 'stat-row' | 'code-demo'
export type IconKey = 'zap' | 'shield' | 'sparkles' | 'game'
export type StylePresetId = 'studio' | 'vercel' | 'jetbrains' | 'liquidglass'
export type HidableKey = 'eyebrow' | 'heading' | 'subheading' | 'cta' | 'items' | 'code' | 'menu' | 'toggle'

export interface SnippetItem {
  id: string
  title: string
  body: string
  icon: IconKey
}

export interface SnippetStyle {
  preset: StylePresetId
  scheme: 'dark' | 'light'
  background?: string
  accent: string
  radius: number
  columns: number
  font: 'sans' | 'serif' | 'mono'
  maxWidth: number
  showIcons: boolean
  padding: number
}

export interface Snippet {
  id: string
  name: string
  template: TemplateId
  eyebrow: string
  heading: string
  subheading: string
  ctaLabel: string
  ctaHref: string
  items: SnippetItem[]
  style: SnippetStyle
  hidden?: Set<HidableKey>
  code?: string
  menuItems?: string[]
  toggleLabel?: string
  createdAt: number
  updatedAt: number
}

export type StylePreset = {
  id: StylePresetId
  label: string
  blurb: string
  swatch: [string, string, string]
  style: SnippetStyle
}

export const TEMPLATE_LABELS: Record<TemplateId, string> = {
  'feature-grid': 'Feature Grid',
  'feature-split': 'Feature Split',
  'stat-row': 'Stat Row',
  'code-demo': 'Code Demo',
}

export const TEMPLATE_BLURBS: Record<TemplateId, string> = {
  'feature-grid': 'Centered header, then N-column grid of icon cards.',
  'feature-split': 'Two columns: header + CTA on the left, stacked icon rows on the right.',
  'stat-row': 'Header, then oversized metric values with captions in one band.',
  'code-demo': 'Header, then a tabbed code panel with a floating picker overlay.',
}

export const HIDABLE_LABELS: Record<HidableKey, string> = {
  eyebrow: 'Eyebrow',
  heading: 'Heading',
  subheading: 'Subheading',
  cta: 'CTA',
  items: 'Items',
  code: 'Code',
  menu: 'Menu',
  toggle: 'Toggle',
}

export const ICON_KEYS: IconKey[] = ['zap', 'shield', 'sparkles', 'game']
