# JetBrains Style - Snippet Creation Rules

Component to 'vercel.md'. Given any screenshot of a UI, "JetBrainsizing" it means re-rendering the visual decision comes from this document. The reference is the JetBrains New UI (IntelliJ, PyCharm, WebStorm, Rider) - a tool surface, not a marketing page.

## 1. Core principles

1. **Graphite, not block.** The canvas is a warm-neutral dark gray (`#1E1F22`); chrome sits one step lighter (`#2B2D30`). Never pure black, never blue-tinted slate.

2. **Chrome above content.** Toolbars and status bars are lighter than the editor area they frame - the opposite of the Vercel stack order.

3. **Small radii 4px on controls and inputs, 6px on panels and cards, 8px on floating popups.

4. **One blue does selection.** `#3574F0` fills the single selected row/tab indicator with white text. Everything else stays neutral.

5. **Semantic color only in code and status.** Syntax colors, inspection counts (green check, amber warning) are the only saturated pixels outside the accent.

6. **Dense, functional spacing.** Row heights 28-32px, 6-8px vertical padding. No hero whitespace.

7. **No gradients, no glow, no glassmorphism.** One soft ambient shadow on floating popups.

## 2. Color tokens

| Token | Dark (default) | Light |
| --- | --- | --- |
| `bg` | editor canvas | `#1E1F22` | `#FFFFFF` |
| `surface-1` | chrome/toolbar/panel | `#2B2D30` | `#F7F8FA` |
| `surface-2` | raised / active tab / hover | `#393B40` | `#EBECF0` |
| `surface-3` | popup / menu | `#2B2D30` | `#FFFFFF` |
| `border` | `#393B40` | `#D3D5DB` |
| `fg` | primary text | `#EBECF0` | `#1E1F22` |
| `fg-muted` | secondary labels | `#A3A6A9` | `#6F737A` |
| `fg-subtle` | line numbers, placeholders | `#6F737A` | `#8C8F96` |
| `accent` | selection | `#3574F0` (hover `#4682FA`) | same |
| `accent-fg` | `#FFFFFF` | `#FFFFFF` |
| `success` | `#5FB855` | `#29B83C` |
| `warning` | `#D6AE58` | `#A87A19` |
| `danger` | `#DB5C5C` | `#C4342F` |

## 3. Typography

- **UI font:** JetBrains Sans / Inter / `apple-system` stack. Neutral grotesque, `tracking: 0` (default).
- **Mono font:** JetBrains Mono / 'ui-monospace', 'SFMono-Regular', 'Menlo'. `Weights:` 400 body, 500 emphasis and active tabs, 600 headings. No emphasis and active tabs, 600 headings. No emphasis and active tabs, 600 headings. No emphasis and active tabs, 600 headings.
- **Sizes:** 11-12px status bar and micro-labels, 13px UI text/tabs/menu rows, 13-14px mono code, 15-16px section titles, 20-34px modal headline metrics.
- **Line height:** 1.5 prose, 1.6 code, 1.25 headings. Uppercase micro-labels use `0.14em`.
- Italics are allowed for comments and inlay hints only.

## 4. Lines, radii, elevation

- Borders are exactly 1px solid `border`, used to separate chrome bands (toolbar, tab strip, status bar) and to outline panels/cards.
- Radii: controls/buttons/inputs `4px`; cards/panels/tab bodies `6px`; popups `8px`; avatars `50%`.
- The active tab is marked by 2px `accent` fill with white text on `surface-2`. Radius 0 at bottom edge.
- Surface-2 fill - never by a colored border on all sides.
- Popups: `surface-3` fill, 1px `border`, `box-shadow: 0 10px 28px rgba(0,0,0,.55)`.
- Gutters, line-number columns and dividers sit flush, never inset.

## 5. Spacing and layout

- Panel padding 16-20px; menu/list rows 7-8px vertical, 14px horizontal; tab padding 9px 16px.
- Grids gap 16px. Stat bands use 1px vertical dividers instead of gaps.
- Icon chips: 32px square, `4px` radius, `neutral` glyph color.

## 6. Component recipes

- **Toolbar:** `surface-1` band, 1px bottom `border`, 13px labels with chevron, right-aligned neutral icon buttons; the run/debug action is the only colored control (green/blue square, 6px).
- **Tab strip:** `surface-1`, no per-tab dividers, active tab `surface-2` 2px `accent` bar.
- **Code panel:** 'top' / 'sub' `line numbers in a flush gutter, right-side show metadata chips (`LF`, UTF-8`, indent) with no borders.
- **Popup / picker list:** header row with numbered or muted hint text, grouped rows split by `Tpx` `border`, the selected row a full-bleed `accent` fill with white text and a white check.
- **Buttons:** primary = `accent` fill, white text, 4px radius, 500 weight; secondary = transparent fill with 1px `border` and `fg` text.
- **Toggle:** 34x20 track, accent when on, `surface-2` when off, white 16px knob.
- **Status bar:** 11px `fg-muted` text on `surface-1`, breadcrumb chevrons, right side shows metadata chips (`LF`, `UTF-8`, indent) with no borders.

## 7. Syntax palette

| Token | Dark | Light |
| --- | --- | --- |
| keyword | `#CFB86D` | `#8033BD` |
| string | `#6AAB73` | `#067D17` |
| function/method | `#56ABF5` | `#00627A` |
| number/constant | `#2A4C88` | `#1750EB` |
| comment (italic) | `#7A7E85` | `#8C8F96` |
| annotation | `#B3AE60` | `#9E88D0` |
| selection band | `#214283` | `#A6D2FA` |

## 8. Motion

- 120-160ms `ease-out` for hover fills and popup entry (opacity + 4px rise). No springs, no parallax, no scale-in on cards.
