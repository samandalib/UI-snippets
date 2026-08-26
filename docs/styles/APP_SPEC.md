# Snippet Studio - full reproduction spec

An agent handed this document (plus `docs/styles/*.md`) should be able to rebuild the app from an empty TanStack Start project with identical behavior. Everything below describes current, shipped behavior – not aspirations.

## 1. What the app is

Snippet Studio is a **client-side generator of embeddable product-feature showcase blocks** for marketing sites. The user:

1. Picks one of four layout templates on the home page.
2. Edits copy, list items, icons, visibility of individual parts, and styling in a left sidebar, with a live preview to the right.
3. Applies a named **visual style preset** (Studio / Vercel / JetBrains / Liquid Glass) that rewrites the whole aesthetic in one click.
4. Exports the result as **self-contained HTML** – copy a fragment, copy a full page, or download an `.html` file.

Non-goals (deliberately absent): accounts, a server, a saved-snippet library UI, hosted embed URLs, external CSS/JS/font requests in the export.

### Hard product invariants

- **Export fidelity.** What the preview shows must be byte-for-byte the same document the user downloads. The preview renders the *export* iframe – never a separate React tree.
- **Zero dependencies in output.** No `<script>`, no webfont links, no network requests. Icons are inlined SVG path data. Fonts are system/local stacks only.
- **Fixed proportions.** The snippet never reflows, rewraps, or rearranges at smaller widths. It renders at a constant design width and scales down proportionally, so overlays (e.g. the floating picker) keep their exact relative position and size at every container size.
- **Transparent by default.** The snippet root has no background unless the user sets one via a style variable (transparent / switches / custom color / gradient string).

## 2. Stack and file map

TanStack Start v1 (React 19, Vite 7), Tailwind v4 via `src/styles.css`, shadow/ui primitives, lucide-react for **app-chrome** icons only (export icons are hand-inlined SVG).

```
src/
  routes/
    __root.tsx              shell + <ToastProvider />
    index.tsx              "/" template picker
    snippets/$id.tsx        "/snippets/$id" snippet editor
  components/
    SnippetPreview.tsx      scaled iframe preview
    SnippetControls.tsx     ContentEditor + StyleEditor
  lib/snippets/
    types.ts               data model + label maps
    templates.ts           factory defaults per template, accent swatches
    presets.ts            named visual style presets
    icons.ts              inlined 24x24 stroke icon path data
    render.ts              the whole rendering engine (theme + CSS + HTML)
    store.ts              localStorage persistence
  docs/
    APP_SPEC.md            this file
    styles/vercel.md       Vercel style spec + "Vercelizing" checklist
    styles/jetbrains.md    JetBrains IDE style spec
    styles/liquid-glass.md Apple Liquid Glass style spec
```

## 3. Data model (`src/lib/snippets/types.ts`)

```ts
type TemplateId = "feature-grid" | "feature-split" | "stat-row" | "code-demo";
type IconKey = "zap" | "shield" | "sparkles" | "game" | "..." (lucide key shorthand);
type StylePresetId = "studio" | "vercel" | "jetbrains" | "liquidglass";
type SnippetItem = { id: string; title: string; body: string; icon: IconKey };

type SnippetStyle = {
  preset: StylePresetId;
  scheme: "dark" | "light";
  background?: string;           // any CSS background value; "transparent" default
  accent: string;                 // hex
  radius: number;
  columns: number;                // grid / stat columns
  font: "sans" | "serif" | "mono";
  maxWidth: number;               // px content width
  showIcons: boolean;
  padding: number;                // px vertical padding
};

type HidableKey = "eyebrow" | "heading" | "subheading" | "cta" | "items" | "code" | "menu" | "toggle";
type Snippet = {
  id: string; name: string; template: TemplateId;
  eyebrow: string; heading: string; subheading: string;
  ctaLabel: string; ctaHref: string;
  items: SnippetItem[];
  style: SnippetStyle;
  createdAt: number; updatedAt: number;
};
```

Also export `TEMPLATE_LABELS`, `TEMPLATE_BLURBS`, `HIDABLE_LABELS`, `ICON_KEYS` (label maps drive the UI, so adding a template/icon requires no UI edits).

## 4. Templates (`templates.ts`)

`createSnippet(template, name?)` returns a fully populated snippet – every template has realistic default copy so the preview is never empty. `BASE_STYLE` is the Studio look: dark, transparent background, accent `#6ee7b7`, radius 14, 3 columns.

| Template | Layout |
| --- | --- |
| `feature-grid` | Centered header, then N-column grid of icon cards. |
| `feature-split` | Two columns: header + CTA on the left, stacked icon rows on the right. |
| `stat-row` | Header, then oversized metric values with captions in one band. |
| `code-demo` | Header, then a tabbed code panel with a **floating picker overlay** anchored to the panel and a toggle for CTA below. |

`code-demo` defaults: an 'ai' SDK `generateText` snippet, six model rows, tabs (Text / Image / Speech / Transcription / Video), toggle label. Also export `ACCENT_PRESETS` (swatch hexes) and `newItem()` for the "add item" button.

## 5. Rendering engine (`render.ts`) - the core of the app

Public API:

```ts
renderSnippetFragment(snippet): string  // <style> + <section class="fs-root">
renderSnippetDocument(snippet, ( transparentPage?: boolean )): string  // <style> + <section class="fs-root">
downloadFile(name, mime, content): void
slugify(value): string
```

Every class is `fs-`-prefixed to avoid colliding with host-page CSS. All markup is escaped through a local `esc()`.

### 5.1 `theme(style): Theme`

A single function returning the full token set – this is what makes presets look genuinely different, not just recolored. Tokens: `bg`, `surface`, `raised`, `overlay`, `border`, `text`, `muted`, `subtle`, `ctaBg`, `ctaText`, `ctaRadius`, `eyebrowColor`, `statusColor`, `fontFamily`, `monoFamily`, `tracking`, `overlayColor`, `ctaRadius`, `eyebrowColor`.

**Branches:** `'vercel'`, `'jetbrains'`, `'liquidglass'`, then the default Studio branch – each with a dark and light variant. Font stacks are per-preset constants (`'VERCEL_SANS/MONO'`, `'JB_SANS/MONO'`, `'LG_SANS/MONO'`); Studio uses `FONT_STACKS`.

### 5.2 `styleSheet(snippet)`

Emits one CSS string. Key mechanics:

- Tokens land as custom properties on `.fs-root` (`--fs-accent`, `--fs-surface`, …).
- `.*fs-frame (…-z-s: min( 100vw / designWidth ) and designWidth) }` and `.*fs-zoom ( zoom: var(--fs-s) Width: designWidth )`.
- There are 2+ responsive breakpoints** – no `@media`, no 'econtainer' layout layout.
