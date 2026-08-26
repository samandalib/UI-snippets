import type { IconKey } from "./types";

/**
 * Stroke-based 24x24 icon path data, inlined into exports so the generated
 * HTML stays dependency-free.
 */
export const ICON_PATHS: Record<IconKey, string> = {
  zap: "M13 2 3 14h7l-1 8 10-12h-7l1-8Z",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z",
  sparkles:
    "M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Z M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z",
  gauge: "M12 14l4-4 M4 20a8 8 0 1 1 16 0",
  layers: "M12 3 3 8l9 5 9-5-9-5Z M3 13l9 5 9-5 M3 17.5l9 5 9-5",
  lock: "M5 11h14v10H5V11Z M8 11V7a4 4 0 0 1 8 0v4",
  globe: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z M3 12h18 M12 3c2.5 3 2.5 15 0 18 M12 3c-2.5 3-2.5 15 0 18",
  wand: "M4 20 18 6 M14 4l1.5 1.5 M20 10l-1.5-1.5 M17 3v3 M21 7h-3",
};

export function iconSvg(key: IconKey, size = 20): string {
  const d = ICON_PATHS[key] ?? ICON_PATHS.sparkles;
  const parts = d
    .split(" M")
    .map((seg, i) => (i === 0 ? seg : `M${seg}`))
    .map((seg) => `<path d="${seg.trim()}"/>`)
    .join("");
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${parts}</svg>`;
}
