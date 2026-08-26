export type TemplateId = "feature-grid" | "feature-split" | "stat-row" | "code-demo";

export type IconKey =
  | "zap"
  | "shield"
  | "sparkles"
  | "gauge"
  | "layers"
  | "lock"
  | "globe"
  | "wand";

export type SnippetItem = {
  id: string;
  title: string;
  body: string;
  icon: IconKey;
};

/** Named visual system: drives palette, type, borders, radii and syntax colors. */
export type StylePresetId = "studio" | "vercel" | "jetbrains" | "liquidglass";

export type SnippetStyle = {
  /** Defaults to "studio" for snippets created before presets existed. */
  preset?: StylePresetId;
  scheme: "dark" | "light";
  /** Snippet canvas background. Undefined or "transparent" = sits on the host page. */
  background?: string;

  accent: string;
  radius: number;
  columns: number;
  font: "sans" | "serif" | "mono";
  maxWidth: number;
  showIcons: boolean;
  padding: number;
};

export type Snippet = {
  id: string;
  name: string;
  template: TemplateId;
  eyebrow: string;
  heading: string;
  subheading: string;
  ctaLabel: string;
  ctaHref: string;
  items: SnippetItem[];
  /** code-demo only: source shown in the highlighted code panel. */
  code?: string;
  /** code-demo only: rows in the floating picker panel. */
  menuItems?: string[];
  /** code-demo only: label beside the toggle switch. */
  toggleLabel?: string;
  /** Parts that can be hidden without deleting their content. Undefined = visible. */
  hidden?: Partial<Record<HidableKey, boolean>>;
  style: SnippetStyle;
  createdAt: number;
  updatedAt: number;
};

export const TEMPLATE_LABELS: Record<TemplateId, string> = {
  "feature-grid": "Feature grid",
  "feature-split": "Split showcase",
  "stat-row": "Stat row",
  "code-demo": "Code demo",
};

export const TEMPLATE_BLURBS: Record<TemplateId, string> = {
  "feature-grid": "Centered header over a responsive grid of icon feature cards.",
  "feature-split": "Headline and call to action beside a stacked feature list.",
  "stat-row": "Oversized metrics with captions in a single horizontal band.",
  "code-demo": "Tabbed code panel with a floating picker list and a toggle.",
};

export const ICON_KEYS: IconKey[] = [
  "zap",
  "shield",
  "sparkles",
  "gauge",
  "layers",
  "lock",
  "globe",
  "wand",
];

export type HidableKey = "eyebrow" | "heading" | "subheading" | "cta" | "items" | "code" | "menu" | "toggle";

export const HIDABLE_LABELS: Record<HidableKey, string> = {
  eyebrow: "Eyebrow",
  heading: "Heading",
  subheading: "Subheading",
  cta: "Button",
  items: "Cards / tabs",
  code: "Code panel",
  menu: "Picker panel",
  toggle: "Toggle",
};
