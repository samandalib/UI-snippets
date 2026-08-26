# Liquid Glass style (Apple, WWDC 2025)

How to "Liquid-Glassify" any screenshot or snippet. Source material: Apple's [Liquid Glass overview](https://developer.apple.com/documentation/technologyoverview/liquid-glass), "Meet Liquid Glass" (WWDC25 219) and "Get to know the new design system" (WWDC25 356).

## Core idea

Liquid Glass is a **material**, not a color scheme. Controls and containers are lenses floating above content: they refract and blur what is behind them, pick up a specular highlight along their edge, and stay fully rounded so they read as physical objects. Content stays opaque and legible; chrome becomes glass.

Rules of thumb:

1. Never more than one glass layer on top of another glass layer. Glass sits on content, not on glass.
2. The backdrop must have color and variation — glass over flat gray is invisible.
3. Text and icons are solid (white in dark, near-black in light), never transparent.
4. Concentric geometry: nested corners share a center, so inner radius = outer radius - padding.

## Backdrop

Glass requires something to refract. Default canvas is a large, soft, colorful gradient:

```
radial-gradient(120% 120% at 12% 8%, #4f7bff 0%, #7d4dff 38%, #121428 78%)
```

Alternatives: a photo, a mesh gradient, or the host page's own artwork. Avoid pure #000 or pure #fff canvases.

## Material tokens

**Glass backdrop blur** (backdrop-filter: blur(…))
- Default: 12-16px `ease-out` (opacity + 4px rise). No springs, no parallax, no scale-in on cards.
- **Popup / picker list:** header row with numbered or muted hint text, grouped rows split by 1px `border`, the selected row a full-bleed `accent` fill with white text and a white check.
- **Buttons:** primary = `accent` fill, white text, 4px radius, 500 weight; secondary = transparent fill with 1px `border` and `fg` text.
- **Toggle:** 34x20 track, accent when on, `surface-2` when off, white 16px knob.
- **Status bar:** 11px `fg-muted` text on `surface-1`, breadcrumb chevrons, right side shows metadata chips (`LF`, `UTF-8`, indent) with no borders.

## 9. JetBrainsizing checklist

1. Recolor the canvas to `#1E1F22` and lift chrome bands to `#2B2D30`.
2. Swap type to JetBrains Sans / JetBrains Mono, tracking 0.
3. Shrink radii to 4/6/8 and remove every pill except badges.
4. Reduce all borders to 1px `#393B40`; delete shadows except popups.
5. Pick exactly one selected row/tab indicator with white text on `#3574F0`.
6. Recolor code with the syntax palette above; italic comments; muted flush line numbers.
7. Tighten padding to IDE density and re-check that only the accent and status glyphs are saturated.
