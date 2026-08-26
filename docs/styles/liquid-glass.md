# Liquid Glass style (Apple, WWDC 2025)

How to "Liquid-Glassify" any screenshot or snippet. Source material: Apple's
[Liquid Glass overview](https://developer.apple.com/documentation/technologyoverviews/liquid-glass),
"Meet Liquid Glass" (WWDC25 219) and "Get to know the new design system" (WWDC25 356).

## Core idea

Liquid Glass is a **material**, not a color scheme. Controls and containers are
lenses floating above content: they refract and blur what is behind them, pick up
a specular highlight along their edge, and stay fully rounded so they read as
physical objects. Content stays opaque and legible; chrome becomes glass.

Rules of thumb:
1. Never more than one glass layer on top of another glass layer. Glass sits on
   content, not on glass.
2. The backdrop must have color and variation — glass over flat gray is invisible.
3. Text and icons on glass are solid (white in dark, near-black in light), never
   translucent.
4. Concentric geometry: nested corners share a center, so inner radius =
   outer radius − padding.

## Backdrop

Glass requires something to refract. Default canvas is a large, soft, colorful
gradient:

```
radial-gradient(120% 120% at 12% 8%, #4f7bff 0%, #7a4dff 38%, #12142b 78%)
```

Alternatives: a photo, a mesh gradient, or the host page's own artwork. Avoid
pure #000 or pure #fff canvases.

## Material tokens

| Token | Dark over color | Light over color |
| --- | --- | --- |
| Glass fill | `rgba(255,255,255,0.10)` | `rgba(255,255,255,0.50)` |
| Glass fill (raised / selected) | `rgba(255,255,255,0.18)` | `rgba(255,255,255,0.72)` |
| Popover / menu fill | `rgba(28,28,32,0.42)` | `rgba(255,255,255,0.60)` |
| Edge hairline | `rgba(255,255,255,0.28)` | `rgba(255,255,255,0.70)` |
| Text | `#ffffff` | `#10121a` |
| Secondary text | 72% text | 66% text |
| Tertiary text | 50% text | 45% text |
| Accent (system blue) | `#0a84ff` | `#007aff` |

Blur recipe — one standard declaration only, never hand-write `-webkit-`:

```css
backdrop-filter: blur(28px) saturate(180%);
```

Blur radius by element size: chips/icons 18px, cards/panels 28px, popovers and
sheets 34px.

Specular edge (what sells the material):

```css
box-shadow:
  inset 0 1px 0 rgba(255,255,255,.45),   /* top light catch */
  inset 0 -1px 0 rgba(255,255,255,.14),  /* bottom bounce */
  0 18px 40px -22px rgba(0,0,0,.55);     /* lift off the canvas */
```

## Typography

- Family: `-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display',
  'Helvetica Neue', Inter, sans-serif`. Mono: `'SF Mono', ui-monospace, Menlo`.
- Tracking: `-0.01em` body, `-0.025em` on large display text.
- Weights: 400 body, 510–590 labels/controls, 640 display headings. SF does not
  need bold to feel confident.
- Scale: eyebrow 11px / .14em uppercase, body 17px, item title 16px,
  section heading 42px, stat value 34–46px.

## Shape

- Radii: capsule (`999px`) for every control — buttons, tabs, chips, menu rows,
  toggles, icon wells. Containers 22–28px.
- Borders: exactly 1px, always a light hairline (never a dark stroke).
- Padding: 24–26px in cards, 12px × 22px in buttons, 8px gutter inside tab bars
  and menu lists so the capsule selection has room to breathe.
- Icons: 44px circular glass well with the glyph in solid text color.

## Components

**Button** — capsule glass, hairline edge, top inset highlight, solid label.
Primary can raise the fill to the "raised" token rather than turning solid color.

**Segmented tabs** — glass container with 8px inner padding; the active tab is a
capsule of the raised fill with an inset top highlight. No underlines.

**Popover / picker** — heavier blur (34px), 22px radius, darker fill in dark
mode, list rows as capsules; the selected row uses the raised fill, not a solid
accent bar.

**Code panel** — glass container, transparent code area (let the backdrop show
through), 1.75 line-height, SF Mono. Syntax palette:
keyword `#ff9f0a`, string `#7ce38b`, function `#64d2ff`, number `#ffd60a`,
comment 50% white, upright (no italics).

**Toggle** — capsule track in accent, white knob, inset shadow on the track.

## Motion

Glass responds like a soft physical body: `cubic-bezier(.32,.72,0,1)` over
250–350ms; hover lifts with `transform: scale(1.03)` and a brighter fill.
Never animate blur radius, and never fade the material's opacity in and out.

## Liquid-Glassifying checklist

Given any screenshot:
1. Replace the page background with a colorful gradient or the source artwork.
2. Convert every panel, card, toolbar, popover into a glass layer (fill + 1px
   light hairline + blur + inset highlight). Flatten nested glass.
3. Round all interactive elements to capsules; containers to 22–28px.
4. Swap fonts to SF, tighten tracking, drop heavy bold to 590–640.
5. Make text and icons fully opaque; use secondary/tertiary text tokens for
   hierarchy instead of color.
6. Replace solid accent selection blocks with raised-glass selection capsules;
   keep accent for toggles, links, and focus.
7. Remove drop shadows that read as "material design" and use the specular +
   lift shadow pair instead.
