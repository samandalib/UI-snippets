# Snippet Studio — full reproduction spec

An agent handed this document (plus `docs/styles/*.md`) should be able to rebuild the
app from an empty TanStack Start project with identical behavior. Everything below
describes current, shipped behavior — not aspirations.

---

## 1. What the app is

Snippet Studio is a **client-side generator of embeddable product-feature showcase
blocks** for marketing sites. The user:

1. Picks one of four layout templates on the home page.
2. Edits copy, list items, icons, visibility of individual parts, and styling in a
   left sidebar, with a live preview to the right.
3. Applies a named **visual style preset** (Studio / Vercel / JetBrains / Liquid
   Glass) that rewrites the whole aesthetic in one click.
4. Exports the result as **self-contained HTML** — copy a fragment, copy a full page,
   or download an `.html` file.

Non-goals (deliberately absent): accounts, a server, a saved-snippet library UI,
hosted embed URLs, external CSS/JS/font requests in the export.

### Hard product invariants

- **Export fidelity.** What the preview shows must be byte-for-byte the same
  document the user downloads. The preview renders the *export document* in an
  iframe — never a separate React re-implementation of the layout.
- **Zero dependencies in output.** No `<script>`, no webfont links, no network
  requests. Icons are inlined SVG path data. Fonts are system/local stacks only.
- **Fixed proportions.** The snippet never reflows, rewraps, or rearranges at
  smaller widths. It renders at a constant design width and scales down
  proportionally, so overlays (e.g. the floating picker) keep their exact relative
  position and size at every container size.
- **Transparent by default.** The snippet root has no background unless the user
  sets one, so it can sit on any host page. Background is a user-editable style
  variable (transparent / swatches / custom color / gradient string).

---

## 2. Stack and file map

TanStack Start v1 (React 19, Vite 7), Tailwind v4 via `src/styles.css`, shadcn/ui
primitives, `sonner` for toasts, `lucide-react` for **app-chrome** icons only
(export icons are hand-inlined SVG).

```
src/
  routes/
    __root.tsx        shell + <Toaster />
    index.tsx         "/" template picker
    snippets.$id.tsx  "/snippets/$id" editor
  components/
    SnippetPreview.tsx    scaled iframe preview
    SnippetControls.tsx   ContentEditor + StyleEditor
  lib/snippets/
    types.ts      data model + label maps
    templates.ts  factory defaults per template, accent swatches
    presets.ts    named visual style presets
    icons.ts      inlined 24x24 stroke icon path data
    render.ts     the whole rendering engine (theme + CSS + HTML)
    store.ts      localStorage persistence
docs/
  APP_SPEC.md              this file
  styles/vercel.md         Vercel style spec + "Vercelize" checklist
  styles/jetbrains.md      JetBrains IDE style spec
  styles/liquid-glass.md   Apple Liquid Glass style spec
```

---

## 3. Data model (`src/lib/snippets/types.ts`)

```ts
type TemplateId = "feature-grid" | "feature-split" | "stat-row" | "code-demo";
type IconKey = "zap"|"shield"|"sparkles"|"gauge"|"layers"|"lock"|"globe"|"wand";
type StylePresetId = "studio" | "vercel" | "jetbrains" | "liquidglass";

type SnippetItem = { id: string; title: string; body: string; icon: IconKey };

type SnippetStyle = {
  preset?: StylePresetId;   // undefined => "studio" (back-compat)
  scheme: "dark" | "light";
  background?: string;      // any CSS background value; "transparent" default
  accent: string;           // hex
  radius: number;           // px, presets may clamp/override
  columns: number;          // grid / stat columns
  font: "sans" | "serif" | "mono";
  maxWidth: number;         // px content width
  showIcons: boolean;
  padding: number;          // px vertical padding
};

type HidableKey =
  "eyebrow"|"heading"|"subheading"|"cta"|"items"|"code"|"menu"|"toggle";

type Snippet = {
  id: string; name: string; template: TemplateId;
  eyebrow: string; heading: string; subheading: string;
  ctaLabel: string; ctaHref: string;
  items: SnippetItem[];
  code?: string;            // code-demo: source shown in the panel
  menuItems?: string[];     // code-demo: rows in the floating picker
  toggleLabel?: string;     // code-demo: label beside the switch
  hidden?: Partial<Record<HidableKey, boolean>>;  // undefined/false = visible
  style: SnippetStyle;
  createdAt: number; updatedAt: number;
};
```

Also export `TEMPLATE_LABELS`, `TEMPLATE_BLURBS`, `HIDABLE_LABELS`, `ICON_KEYS`
(label maps drive the UI, so adding a template/icon requires no UI edits).

---

## 4. Templates (`templates.ts`)

`createSnippet(template, name?)` returns a fully populated snippet — every template
ships realistic default copy so the preview is never empty. `BASE_STYLE` is the
Studio look: dark, transparent background, accent `#6ee7b7`, radius 14, 3 columns,
sans, maxWidth 960, icons on, padding 56.

| Template | Layout |
| --- | --- |
| `feature-grid` | Centered header, then N-column grid of icon cards. |
| `feature-split` | Two columns: header + CTA on the left, stacked icon rows on the right. |
| `stat-row` | Header, then oversized metric values with captions in one band. |
| `code-demo` | Header, then a tabbed code panel with a **floating picker overlay** anchored to the panel and a toggle row; CTA below. |

`code-demo` defaults: an `ai` SDK `generateText` snippet, six model rows, tabs
(Text / Image / Speech / Transcription / Video), toggle label. Also export
`ACCENT_PRESETS` (swatch hexes) and `newItem()` for the "add item" button.

---

## 5. Rendering engine (`render.ts`) — the core of the app

Public API:

```ts
renderSnippetFragment(snippet): string   // <style> + <section class="fs-root">
renderSnippetDocument(snippet, { transparentPage?: boolean }): string
downloadFile(name, mime, content): void
slugify(value): string
```

Every class is `fs-`-prefixed to avoid colliding with host-page CSS. All markup is
escaped through a local `esc()`.

### 5.1 `theme(style): Theme`

A single function returning the full token set — this is what makes presets look
genuinely different, not just recolored. Tokens: `bg, surface, raised, overlay,
border, text, muted, subtle, ctaBg, ctaText, ctaRadius, eyebrowColor, statColor,
fontFamily, monoFamily, tracking, overlayShadow, syntax{key,str,fn,num,com,comStyle}`.

Branches: `vercel`, `jetbrains`, `liquidglass`, then the default Studio branch —
each with a dark and light variant. Font stacks are per-preset constants
(`VERCEL_SANS/MONO`, `JB_SANS/MONO`, `LG_SANS/MONO`); Studio uses `FONT_STACKS`
driven by `style.font`.

### 5.2 `styleSheet(snippet)`

Emits one CSS string. Key mechanics:

- Tokens land as custom properties on `.fs-root` (`--fs-accent`, `--fs-surface`, …).
- `.fs-root` sets `background: style.background ?? transparent`,
  `container-type: inline-size`, `overflow: hidden`.
- **Proportional scaling**: `designWidth = maxWidth + 48`;
  `.fs-frame { --fs-s: min(1, 100cqw / designWidth) }` and
  `.fs-zoom { zoom: var(--fs-s); width: designWidth }`.
  There are **no responsive breakpoints** — no `@media`, no `@container` layout
  switches. This is the invariant that keeps proportions constant.
- `dense = vercel || jetbrains` selects tighter metrics (smaller type, hairline
  dividers, zero-gap stat rows).
- `radius` resolution: Vercel 12, JetBrains 6, Liquid Glass `max(20, style.radius)`,
  otherwise the user's value.
- Base rules cover all templates: `.fs-eyebrow .fs-heading .fs-sub .fs-grid
  .fs-card .fs-icon .fs-item-title .fs-item-body .fs-cta .fs-split .fs-list .fs-row
  .fs-stats .fs-stat-value .fs-stat-label .fs-demo .fs-panel .fs-tabs .fs-tab
  .fs-code .fs-line .fs-ln .fs-t-* .fs-menu .fs-menu-search .fs-menu-list
  .fs-menu-row .fs-dot .fs-check .fs-toggle-wrap .fs-switch`.
- Then **per-preset override blocks** appended conditionally (`isJb ? … : ""`,
  `isLg ? … : ""`). Each block restates only what the style demands, e.g. JetBrains
  2px top-border active tab and full-bleed blue selection row; Liquid Glass glass
  fills + `backdrop-filter: blur() saturate()` + inset specular highlights +
  capsule controls.
- `.fs-menu` is `position:absolute; left:2%; bottom:-96px; width:min(270px,62%)`
  inside `.fs-demo` — because of the zoom system this stays pixel-proportional.

Vendor prefixes: write only the standard `backdrop-filter`. Never hand-write
`-webkit-backdrop-filter`; the production CSS minifier dedupes the pair and drops
the standard property, which silently kills the effect in Chrome.

### 5.3 Syntax highlighting

A **single-pass** tokenizer (`highlightLine`) walks the line once and emits
`<span class="fs-t-*">`, so inserted markup is never re-scanned (the classic bug
when chaining regex replaces). Order: line comment → string → number → identifier
(keyword list → else call-detection via a following `(` → else plain). Unknown
characters are escaped verbatim. `highlightCode` wraps each line in
`.fs-line` with a `.fs-ln` gutter number.

### 5.4 Body renderers

`body(snippet)` dispatches per template into `codeDemo()` / stat-row / split /
grid builders. Every optional part is gated by `visible(snippet, key)` (reads
`snippet.hidden`) **and** by non-empty content. `icon()` returns "" when
`style.showIcons` is false. The CTA renders an inline arrow SVG.

`renderSnippetFragment` = `<style>…</style>` + `.fs-root > .fs-frame > .fs-zoom >
body`. `renderSnippetDocument` wraps the same thing in a full document, sets
`html,body{margin:0;background:<page>}` and `.fs-root{min-height:100vh}`;
`transparentPage: true` forces the page background transparent (used by the
preview so the checkerboard shows through).

---

## 6. Style presets (`presets.ts`)

```ts
type StylePreset = {
  id: StylePresetId; label: string; blurb: string;
  swatch: [string, string, string];   // [surface, border, accent] dots in the UI
  style: SnippetStyle;                // applied wholesale on click
};
export const STYLE_PRESETS = [STUDIO_PRESET, VERCEL_PRESET, JETBRAINS_PRESET, LIQUID_GLASS_PRESET];
```

| Preset | Identity |
| --- | --- |
| Studio | Soft navy surfaces, pill buttons, accent-tinted icon wells. Transparent bg, accent `#6ee7b7`, radius 14, maxWidth 960. |
| Vercel | Pure black `#000`, 1px `#262626` hairlines, Geist type, inverted primary button, single blue `#0072f5`. Radius 12, maxWidth 1100, padding 64. |
| JetBrains | Graphite IDE chrome `#1E1F22` / `#2B2D30`, radius 6, JetBrains Mono, blue `#3574F0` selection rows. maxWidth 1040. |
| Liquid Glass | Translucent blurred glass over a colorful gradient backdrop, specular hairlines, capsule controls, SF type, accent `#0a84ff`. Radius 26, maxWidth 1040. |

**Adding a preset is a four-step recipe** (follow it exactly):
1. Add the id to `StylePresetId`.
2. Add a `theme()` branch (dark + light) and any font-stack constants.
3. Add a conditional CSS override block in `styleSheet`, and include the id in the
   radius resolution (and in `dense` if it wants the tight metrics).
4. Register the preset object in `STYLE_PRESETS`, and write
   `docs/styles/<name>.md` with tokens plus a "-ify any screenshot" checklist.

---

## 7. Persistence (`store.ts`)

`localStorage` key `feature-snippets.v1` holding a `Snippet[]`. Functions:
`listSnippets` (newest-updated first), `getSnippet`, `saveSnippet` (upsert, stamps
`updatedAt`), `deleteSnippet`, `duplicateSnippet`, `subscribe` (listens to a custom
`snippets:changed` event plus cross-tab `storage`). Every read guards
`typeof window !== "undefined"` so SSR/prerender never touches storage. There is
intentionally **no library UI** — storage exists so the editor route survives a
reload.

---

## 8. Routes

### `/` — `src/routes/index.tsx`
Template picker only. Header ("Snippet Studio" / "Embeddable product feature
showcases") plus a 3-up grid of buttons generated from `TEMPLATE_LABELS` /
`TEMPLATE_BLURBS`. Clicking one calls `createSnippet`, `saveSnippet`, then
navigates to `/snippets/$id`. Route `head()` supplies its own title, description,
`og:*`, `twitter:card`.

### `/snippets/$id` — `src/routes/snippets.$id.tsx`
Sticky header: back link, editable snippet name, desktop/mobile preview toggle,
and three export actions — **Copy embed HTML** (`renderSnippetFragment`), **Copy
full page** (`renderSnippetDocument`), **Download** (`downloadFile` with
`slugify(name).html`). Copy buttons swap their icon to a check and toast via
`sonner`.

Body is a `340px / 1fr` grid: sidebar with a Content|Style tab switch rendering
`ContentEditor` / `StyleEditor`, and the preview pane with a "Saved automatically"
note. Local `snippet` state is the single source of truth; every change writes
through `saveSnippet` (debounced/auto), and a missing id renders a not-found state.

---

## 9. Preview component (`SnippetPreview.tsx`)

Props: `snippet, className, title, pageWidth = 1280, pageHeight = 760`.

Renders `renderSnippetDocument(snippet, { transparentPage: true })` into an
`<iframe srcDoc sandbox="allow-same-origin">` sized to the **real** page width, then
measures the host element with a `ResizeObserver` and applies
`transform: scale(min(1, hostWidth / pageWidth))` with `transform-origin: top left`,
setting host height to `pageHeight * scale`. The host paints a grey checkerboard so
transparent areas of the snippet are visible.

Mobile toggle simply passes `pageWidth = 390, pageHeight = 780`.

This design is why preview == export: the iframe *is* the exported document at a
true browser width.

---

## 10. Controls (`SnippetControls.tsx`)

Shared bits: `Row` (uppercase tracked label), `inputCls`, `TextField` (with
`multiline`), `NumberField` (range slider with a mono value readout),
`BACKGROUND_PRESETS = ["#000000","#0b0d12","#ffffff","#f6f7f9"]`.

**ContentEditor**
- *Visible parts*: chip list of `HidableKey`s (template-aware — `code`, `menu`,
  `toggle` only for `code-demo`) with `Eye` / `EyeOff` icons toggling
  `snippet.hidden`.
- Name, eyebrow, heading, subheading, CTA label, CTA href.
- `code-demo` only: `code` textarea, picker-rows textarea (one per line),
  toggle-label field.
- Items list: per item title, body (or value/caption wording for `stat-row`), icon
  picker over `ICON_KEYS`, reorder handle, delete; plus "Add item" via `newItem()`.

**StyleEditor**
- *Style preset* row first: one button per `STYLE_PRESETS` entry showing three
  swatch dots, label, blurb, and a `Check` when the current style matches. Clicking
  applies the preset's whole `SnippetStyle`.
- A note when a non-Studio preset is active: the preset owns typography, surfaces,
  borders and syntax colors; accent, columns, width and padding still apply.
- Color scheme (Dark / Light), Background (Transparent + swatches + native color
  input), Accent (`ACCENT_PRESETS` + color input), Font select, and sliders for
  columns, corner radius, max width, vertical padding, plus a Show-icons checkbox.

---

## 11. Conventions to preserve

- Icons in app chrome come from `lucide-react`; never emoji or unicode glyphs.
- No hardcoded Tailwind color utilities in app UI — use semantic tokens from
  `src/styles.css`.
- Exported CSS is generated as a string; keep it deterministic and free of
  breakpoints so the fidelity and proportion invariants hold.
- Each route defines its own `head()` metadata.
- When adding a template: extend `TemplateId`, the label/blurb maps, a
  `createSnippet` branch, a `body()` branch, base CSS, and any per-preset override
  the new parts need — in that order.
