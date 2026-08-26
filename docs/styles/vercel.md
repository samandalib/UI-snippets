# Vercel Style — Snippet Creation Rules

The canonical reference style for snippets. Given any screenshot of a UI, "Vercelizing" it means
re-rendering the same structure with the rules below. Structure and content come from the source
screenshot; every visual decision comes from this document.

## 1. Core principles

1. **Near-black canvas, not gray.** Surfaces are stacked in tiny steps, never in big jumps.
2. **1px hairlines do the work.** Separation comes from borders, not shadows or heavy fills.
3. **Typography is the only ornament.** Geist-like grotesque, tight tracking, few weights.
4. **One accent, used sparingly.** Blue for the single active/primary element per view.
5. **Rounded but restrained.** 6–12px radii on controls, 12–16px on panels, full pills on chips.
6. **No gradients, no glow, no glassmorphism, no drop shadows** except a soft ambient lift on
   floating overlays (menus, popovers, tooltips).
7. **Generous internal padding, compact line height.** Dense information, calm spacing.

## 2. Color tokens

| Token | Dark (default) | Light |
| --- | --- | --- |
| `bg` page | `#000000` | `#ffffff` |
| `surface-1` panel | `#0a0a0a` | `#fafafa` |
| `surface-2` raised / active tab | `#111111` | `#f4f4f5` |
| `surface-3` overlay / menu | `#1c1c1c` | `#ffffff` |
| `border` | `#262626` | `#e5e5e5` |
| `border-strong` (hover/focus ring track) | `#3f3f46` | `#d4d4d4` |
| `fg` primary text | `#ededed` | `#0a0a0a` |
| `fg-muted` secondary text/labels | `#a1a1aa` | `#666666` |
| `fg-subtle` placeholders, line numbers | `#6b6b70` | `#8f8f96` |
| `accent` | `#0072f5` (hover `#3291ff`) | same |
| `accent-fg` | `#ffffff` | `#ffffff` |
| success | `#00c07f` | `#0f8a5f` |
| warning | `#f5a623` | `#b8730b` |
| danger | `#ff4d4f` | `#d93036` |

Status pills use a 12–18% tint of the status color as the fill with the full color as the text.

## 3. Typography

- **UI font:** Geist / Inter / `-apple-system` fallback stack, grotesque, no serif.
- **Mono font:** Geist Mono / `ui-monospace`, `SFMono-Regular`, `Menlo`, monospace.
- **Weights:** 400 body, 500 for active/emphasis, 600 for headings. Never 700+, never italic.
- **Sizes:** 12px labels/captions, 13–14px UI text and tabs, 14px mono code, 15–16px section
  titles, 24–32px hero metrics (weight 500–600, `letter-spacing: -0.02em`).
- **Tracking:** `-0.01em` at 14px+, `-0.02em` at 24px+, `0` for mono. Uppercase micro-labels use
  `letter-spacing: 0.16em`, 10–11px, `fg-muted`.
- **Line height:** 1.5 for prose, 1.25 for headings, 1.6 for code.

## 4. Lines, radii, elevation

- Every border is exactly **1px solid `border`**. No 2px borders except a focus ring
  (`0 0 0 1px accent` plus a 2px `accent` outline offset).
- Radii: inputs/buttons/tabs `8px`; panels/cards `12px`; large frames `16px`; chips/pills `999px`;
  window traffic-light dots `50%`.
- Dividers span the full panel width and sit flush against padding edges, not inset.
- Floating overlays: `surface-3` fill, 1px `border`, `box-shadow: 0 8px 30px rgba(0,0,0,0.6)`.
- Never use inner shadows, bevels, or colored borders (except focused/active accent).

## 5. Spacing and layout

- 4px base scale: 4, 8, 12, 16, 20, 24, 32, 48, 64.
- Panel padding 16–24px; code panels 20–24px; nested rows 12–16px vertical.
- Content max width 960–1200px, centered.
- Grids: equal columns with 1px separators or 12–16px gaps — pick one, never both.
- Tab strips: items separated by 1px vertical rules when they fill a frame edge-to-edge
  (screenshot 1), or as free-floating text tabs with the active one filled `surface-2` + border
  (screenshots 2–4).

## 6. Component recipes

- **Tabs:** 13–14px, `fg-muted` inactive, `fg` + `surface-2` + 1px border active, 8px radius,
  10px/14px padding. Active-tab variant with a blue 1px border is allowed for the primary strip.
- **Buttons:** primary = `fg` background with `bg` text (inverted), or `accent` fill for the one
  key action; secondary = transparent with 1px `border`, `fg` text; ghost = text only, `fg-muted`
  to `fg` on hover. Height 32–36px, 12–16px horizontal padding.
- **Toggle:** 34x20px track, `border-strong` off / `accent` on, white 16px knob, 150ms ease.
- **Inputs:** `surface-1` fill, 1px `border`, 8px radius, 13–14px text, `fg-subtle` placeholder,
  leading icon at 16px `fg-muted`.
- **Code block:** `surface-1` (or pure `#000` inside a `surface-1` frame), mono 14px/1.6,
  right-aligned `fg-subtle` line numbers in a gutter with no separator line, optional copy button
  top-right as a 28px ghost icon button.
- **Syntax colors:** keywords `#ff4f8b` (pink), functions/methods `#8b7bff` (violet), strings
  `#4ade80` (green), numbers `#f5a623`, comments `#6b6b70`, punctuation/plain `#ededed`.
- **Window chrome:** 3 dots at 10px (`#ff5f57`, `#febc2e`, `#28c840`) left, centered mono/UI
  filename in `fg-muted`, right-side segmented control, 1px bottom border.
- **Metric cards:** small label row (12px `fg-muted` + 14px icon), value 24–32px weight 500,
  cells split by 1px vertical borders, active cell marked by a 2px `fg` underline.
- **Charts:** 1.5px lines, no fills, no points; gridlines 1px `border`; axis labels 11–12px
  `fg-subtle`; series in accent blue, green, violet, red, amber, teal in that order.
- **Icons:** Lucide (or equivalent), 1.5px stroke, 14–16px, `currentColor`. Never emoji.
- **Chips/logo pills:** pill radius, 1px `border`, transparent fill, 13px `fg`, 16px leading mark.

## 7. Motion

Only 120–200ms `ease-out` transitions on `background-color`, `border-color`, `color`, `opacity`,
and `transform` for the toggle knob. No entrance animations, parallax, or looping effects.

## 8. Vercelizing checklist

Given a new screenshot:

1. Identify the frame: page background, one outer panel, and its nested regions.
2. Map every region to `surface-1/2/3` and separate them with 1px `border` hairlines.
3. Replace all typography with the scale in §3; strip bold weights above 600.
4. Reduce color to `fg`/`fg-muted`/`fg-subtle` plus one accent on the single primary element.
   Status colors only where the source communicated state.
5. Apply radii from §4 and delete every shadow except overlay ambient lift.
6. Normalize spacing to the 4px scale; keep density high, padding generous.
7. Swap icons to 1.5px stroke line icons; keep code monospaced with the §6 syntax palette.
8. Verify: does it still read correctly at 12px? Is there exactly one accent focal point?
   Would it look at home on vercel.com in the dark?
