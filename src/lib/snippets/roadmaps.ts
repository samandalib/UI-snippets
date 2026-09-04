import { GREEDY_SKETCH_SRC } from "./greedy-sketch";
import { REPOVIVE_LOGO_SRC } from "./repovive-logo";
import type { Snippet } from "./types";

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

type TagId = "interview" | "olympiad" | "dsa";
type CatId = "all" | "cp" | "interview";

type Roadmap = {
  id: string;
  title: string;
  learners: number;
  tags: TagId[];
  cats: CatId[];
  formula: string;
  sketch: string;
};

const TAG_LABEL: Record<TagId, string> = {
  interview: "Interview",
  olympiad: "Olympiad",
  dsa: "DSA",
};

const NAV: { id: CatId; label: string; count: number; kicker: string; blurb: string }[] = [
  {
    id: "all",
    label: "All",
    count: 13,
    kicker: "Every track",
    blurb: "Browse every roadmap — algorithms, olympiad, and interview prep.",
  },
  {
    id: "cp",
    label: "Competitive Programming",
    count: 12,
    kicker: "Olympiad track",
    blurb: "Core CP topics for contests and olympiads.",
  },
  {
    id: "interview",
    label: "Interview Prep",
    count: 12,
    kicker: "Interview track",
    blurb: "Patterns and language skills that show up in screens.",
  },
];

const MONO = "ui-monospace,SFMono-Regular,'SF Mono',Menlo,Consolas,monospace";
const T = "var(--fs-text)";
const M = "var(--fs-muted)";
const S = "var(--fs-subtle)";
const W = "#fff";
/** Highlight stroke — matches Olympiad tag green. */
const G = "#4ade80";

/** Thumbnails: white outline strokes; emphasis is green stroke, no gray fills. */
const SKETCHES: Record<string, string> = {
  dp: `<svg viewBox="0 0 340 168" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <g font-family="${MONO}" stroke-linecap="round" stroke-linejoin="round">
    <rect x="18" y="34" width="36" height="36" rx="6" fill="none" stroke="${W}" stroke-width="1.25"/>
    <rect x="54" y="34" width="36" height="36" rx="6" fill="none" stroke="${G}" stroke-width="1.75"/>
    <rect x="90" y="34" width="36" height="36" rx="6" fill="none" stroke="${W}" stroke-width="1.25"/>
    <rect x="126" y="34" width="36" height="36" rx="6" fill="none" stroke="${W}" stroke-width="1.25"/>
    <rect x="162" y="34" width="36" height="36" rx="6" fill="none" stroke="${G}" stroke-width="1.75"/>
    <rect x="198" y="34" width="36" height="36" rx="6" fill="none" stroke="${W}" stroke-width="1.25"/>
    <rect x="234" y="34" width="36" height="36" rx="6" fill="none" stroke="${G}" stroke-width="1.75"/>
    <rect x="270" y="34" width="36" height="36" rx="6" fill="none" stroke="${W}" stroke-width="1.25"/>
    <g font-size="13" font-weight="600" text-anchor="middle" fill="${T}">
      <text x="36" y="57">0</text>
      <text x="72" y="57">1</text>
      <text x="108" y="57">2</text>
      <text x="144" y="57">3</text>
      <text x="180" y="57">4</text>
      <text x="216" y="57">5</text>
      <text x="252" y="57">6</text>
      <text x="288" y="57">7</text>
    </g>
    <path d="M180 76c8 14 20 24 36 26" fill="none" stroke="${G}" stroke-width="1.5"/>
    <path d="M208 96l8 6 1-10" fill="${G}"/>
    <text x="18" y="140" fill="${M}" font-size="12">dp[i][c] = min(dp[i-1][p]) + cost</text>
  </g>
</svg>`,

  graph: `<svg viewBox="0 0 340 168" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <g font-family="${MONO}" stroke-linecap="round">
    <g stroke="${W}" stroke-width="1" fill="none" opacity=".55">
      <path d="M82 28 L238 40"/><path d="M82 28 L238 68" opacity=".45"/>
      <path d="M82 52 L238 40" opacity=".45"/><path d="M82 52 L238 68"/>
      <path d="M82 76 L238 68"/><path d="M82 76 L238 96"/>
      <path d="M82 100 L238 96"/><path d="M82 100 L238 124" opacity=".45"/>
      <path d="M82 124 L238 96" opacity=".45"/><path d="M82 124 L238 124"/>
    </g>
    <circle cx="70" cy="28" r="11" fill="none" stroke="${G}" stroke-width="1.75"/>
    <circle cx="70" cy="52" r="11" fill="none" stroke="${W}" stroke-width="1.25"/>
    <circle cx="70" cy="76" r="11" fill="none" stroke="${G}" stroke-width="1.75"/>
    <circle cx="70" cy="100" r="11" fill="none" stroke="${W}" stroke-width="1.25"/>
    <circle cx="70" cy="124" r="11" fill="none" stroke="${G}" stroke-width="1.75"/>
    <circle cx="250" cy="40" r="11" fill="none" stroke="${W}" stroke-width="1.25"/>
    <circle cx="250" cy="68" r="11" fill="none" stroke="${W}" stroke-width="1.25"/>
    <circle cx="250" cy="96" r="11" fill="none" stroke="${W}" stroke-width="1.25"/>
    <circle cx="250" cy="124" r="11" fill="none" stroke="${W}" stroke-width="1.25"/>
    <g font-size="10" font-weight="600" text-anchor="middle" fill="${T}">
      <text x="70" y="32">A</text>
      <text x="70" y="80">B</text>
      <text x="70" y="128">C</text>
      <text x="250" y="44">1</text>
      <text x="250" y="72">2</text>
      <text x="250" y="100">3</text>
      <text x="250" y="128">4</text>
    </g>
    <text x="70" y="158" fill="${M}" font-size="12">color[v] = 1 − color[u]</text>
  </g>
</svg>`,

  math: `<svg viewBox="0 0 340 168" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <g font-family="${MONO}" stroke-linecap="round" stroke-linejoin="round">
    <rect x="36" y="30" width="170" height="34" rx="6" fill="none" stroke="${W}" stroke-width="1.25"/>
    <rect x="206" y="30" width="90" height="34" rx="6" fill="none" stroke="${W}" stroke-width="1.25"/>
    <text x="121" y="52" fill="${T}" font-size="15" font-weight="600" text-anchor="middle">a</text>
    <text x="251" y="52" fill="${T}" font-size="15" font-weight="600" text-anchor="middle">b</text>
    <path d="M251 68v12" fill="none" stroke="${G}" stroke-width="1.5"/>
    <path d="M246 76l5 7 5-7" fill="${G}"/>
    <rect x="36" y="90" width="90" height="34" rx="6" fill="none" stroke="${W}" stroke-width="1.25"/>
    <rect x="126" y="90" width="80" height="34" rx="6" fill="none" stroke="${G}" stroke-width="1.75"/>
    <text x="81" y="112" fill="${T}" font-size="15" font-weight="600" text-anchor="middle">b</text>
    <text x="166" y="112" fill="${T}" font-size="15" font-weight="600" text-anchor="middle">r</text>
    <path d="M220 107h70" fill="none" stroke="${W}" stroke-width="1" stroke-dasharray="3 4" opacity=".55"/>
    <text x="36" y="152" fill="${M}" font-size="12">gcd(a, b) = gcd(b, a % b)</text>
  </g>
</svg>`,

  pattern: `<svg viewBox="0 0 340 168" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <g font-family="${MONO}" stroke-linecap="round" stroke-linejoin="round">
    <text x="16" y="26" fill="${S}" font-size="10">pref</text>
    <g font-size="11" font-weight="500" fill="${S}" text-anchor="middle">
      <text x="40" y="26">0</text><text x="76" y="26">3</text><text x="112" y="26">7</text><text x="148" y="26">10</text>
      <text x="184" y="26">15</text><text x="220" y="26">18</text><text x="256" y="26">22</text><text x="292" y="26">25</text>
    </g>
    <line x1="22" y1="32" x2="310" y2="32" stroke="${W}" stroke-width="1" opacity=".55"/>
    <rect x="28" y="46" width="36" height="36" rx="6" fill="none" stroke="${W}" stroke-width="1.25"/>
    <rect x="64" y="46" width="36" height="36" rx="6" fill="none" stroke="${W}" stroke-width="1.25"/>
    <rect x="100" y="46" width="36" height="36" rx="6" fill="none" stroke="${G}" stroke-width="1.75"/>
    <rect x="136" y="46" width="36" height="36" rx="6" fill="none" stroke="${G}" stroke-width="1.75"/>
    <rect x="172" y="46" width="36" height="36" rx="6" fill="none" stroke="${G}" stroke-width="1.75"/>
    <rect x="208" y="46" width="36" height="36" rx="6" fill="none" stroke="${W}" stroke-width="1.25"/>
    <rect x="244" y="46" width="36" height="36" rx="6" fill="none" stroke="${W}" stroke-width="1.25"/>
    <g font-size="13" font-weight="600" text-anchor="middle" fill="${T}">
      <text x="46" y="70">3</text>
      <text x="82" y="70">4</text>
      <text x="118" y="70">3</text>
      <text x="154" y="70">5</text>
      <text x="190" y="70">2</text>
      <text x="226" y="70">4</text>
      <text x="262" y="70">3</text>
    </g>
    <path d="M100 90v10h108v-10" fill="none" stroke="${G}" stroke-width="1.5"/>
    <text x="108" y="116" fill="${G}" font-size="11" font-weight="500">l</text>
    <text x="190" y="116" fill="${G}" font-size="11" font-weight="500">r</text>
    <text x="28" y="148" fill="${M}" font-size="12">sum(l, r) = pref[r+1] − pref[l]</text>
  </g>
</svg>`,

  cpp: `<svg viewBox="0 0 340 168" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <g font-family="${MONO}" stroke-linecap="round" stroke-linejoin="round">
    <rect x="24" y="48" width="48" height="40" rx="6" fill="none" stroke="${W}" stroke-width="1.25"/>
    <rect x="72" y="48" width="48" height="40" rx="6" fill="none" stroke="${W}" stroke-width="1.25"/>
    <rect x="120" y="48" width="48" height="40" rx="6" fill="none" stroke="${W}" stroke-width="1.25"/>
    <rect x="168" y="48" width="48" height="40" rx="6" fill="none" stroke="${W}" stroke-width="1.25"/>
    <rect x="216" y="48" width="48" height="40" rx="6" fill="none" stroke="${W}" stroke-width="1.25" stroke-dasharray="4 3" opacity=".7"/>
    <g font-size="14" font-weight="600" text-anchor="middle" fill="${T}">
      <text x="48" y="74">a₁</text>
      <text x="96" y="74">a₂</text>
      <text x="144" y="74">a₃</text>
      <text x="192" y="74">a₄</text>
    </g>
    <rect x="272" y="48" width="48" height="40" rx="6" fill="none" stroke="${G}" stroke-width="1.75"/>
    <text x="296" y="74" fill="${T}" font-size="16" font-weight="600" text-anchor="middle">x</text>
    <path d="M236 36c20-16 50-16 74 10" fill="none" stroke="${G}" stroke-width="1.5"/>
    <path d="M302 40l8 7-11 0" fill="${G}"/>
    <text x="24" y="140" fill="${M}" font-size="12">v.push_back(x)</text>
  </g>
</svg>`,

  greedy: `<img src="${GREEDY_SKETCH_SRC}" width="840" height="460" alt="" aria-hidden="true">`,
};

const ROADMAPS: Roadmap[] = [
  {
    id: "dp",
    title: "Dynamic Programming",
    learners: 2745,
    tags: ["interview", "olympiad", "dsa"],
    cats: ["all", "cp", "interview"],
    formula: "dp[i][c] = min(dp[i-1][p]) + cost",
    sketch: SKETCHES.dp!,
  },
  {
    id: "graph",
    title: "Graph Theory",
    learners: 1073,
    tags: ["interview", "olympiad", "dsa"],
    cats: ["all", "cp", "interview"],
    formula: "color[v] = 1 - color[u]",
    sketch: SKETCHES.graph!,
  },
  {
    id: "math",
    title: "Math Fundamentals",
    learners: 874,
    tags: ["olympiad"],
    cats: ["all", "cp"],
    formula: "gcd(a, b) = gcd(b, a % b)",
    sketch: SKETCHES.math!,
  },
  {
    id: "pattern",
    title: "Pattern 22: LeetCode Interview Patterns",
    learners: 584,
    tags: ["interview", "dsa"],
    cats: ["all", "interview"],
    formula: "sum(l, r) = pref[r+1] - pref[l]",
    sketch: SKETCHES.pattern!,
  },
  {
    id: "cpp",
    title: "C++",
    learners: 319,
    tags: ["interview", "olympiad"],
    cats: ["all", "cp", "interview"],
    formula: "v.push_back(x)",
    sketch: SKETCHES.cpp!,
  },
  {
    id: "greedy",
    title: "Greedy Algorithms",
    learners: 306,
    tags: ["dsa", "interview", "olympiad"],
    cats: ["all", "cp", "interview"],
    formula: "pick min end",
    sketch: SKETCHES.greedy!,
  },
];

export function roadmapsStyles(snippet: Snippet, radius: number): string {
  const preset = snippet.style.preset ?? "studio";
  const isVercel = preset === "vercel";
  const isJb = preset === "jetbrains";
  const isLg = preset === "liquidglass";
  const controlR = isJb ? "4px" : isLg ? "999px" : isVercel ? "8px" : `${Math.max(6, Math.round(radius * 0.55))}px`;

  const navActive = NAV.map(
    (nav) =>
      `#fs-rm-cat-${nav.id}:checked ~ .fs-rm .fs-rm-tabs label[for="fs-rm-cat-${nav.id}"]{color:var(--fs-text);background:var(--fs-raised);border-color:var(--fs-border)}
#fs-rm-cat-${nav.id}:checked ~ .fs-rm #fs-rm-panel-${nav.id}{display:flex}`,
  ).join("\n");

  const jbNav = isJb
    ? NAV.map(
        (nav) =>
          `#fs-rm-cat-${nav.id}:checked ~ .fs-rm .fs-rm-tabs label[for="fs-rm-cat-${nav.id}"]{background:var(--fs-accent);color:#fff;border-color:transparent}
#fs-rm-cat-${nav.id}:checked ~ .fs-rm .fs-rm-tabs label[for="fs-rm-cat-${nav.id}"] .fs-rm-count{color:rgba(255,255,255,.8)}`,
      ).join("\n")
    : "";

  const extra = isLg
    ? `.fs-rm-tabs label{border-radius:999px}
.fs-rm-rail-btn.is-active{border-radius:14px}`
    : isJb
      ? `.fs-rm-tabs label{border-radius:4px}
.fs-rm-rail-btn.is-active{border-radius:4px}`
      : "";

  const railBtnR = isJb ? "4px" : isLg ? "14px" : isVercel ? "8px" : `${Math.max(8, Math.round(radius * 0.7))}px`;

  return `
.fs-rm-sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}
.fs-rm-shell{position:relative}
.fs-rm{min-height:100vh;background:var(--fs-bg);color:var(--fs-text);font-size:13px;display:flex;align-items:stretch}
.fs-rm-rail{width:56px;flex:0 0 56px;display:flex;flex-direction:column;align-items:center;gap:6px;padding:16px 0 20px;border-right:1px solid var(--fs-border);background:var(--fs-surface)}
.fs-rm-rail-logo{display:flex;align-items:center;justify-content:center;width:36px;height:36px;margin-bottom:10px}
.fs-rm-rail-logo img{width:28px;height:28px;object-fit:contain}
.fs-rm-rail-nav{display:flex;flex-direction:column;align-items:center;gap:6px;width:100%}
.fs-rm-rail-btn{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border:0;border-radius:${railBtnR};background:transparent;color:var(--fs-muted);cursor:default}
.fs-rm-rail-btn svg{display:block}
.fs-rm-rail-btn.is-active{background:var(--fs-raised);color:var(--fs-text)}
.fs-rm-main{flex:1;min-width:0;padding:28px 32px 36px;display:flex;flex-direction:column;gap:20px}
.fs-rm-top{display:flex;align-items:center;justify-content:space-between;gap:16px 24px;flex-wrap:wrap}
.fs-rm-brand{display:flex;align-items:center;gap:12px;min-width:0;flex:1}
.fs-rm-title{margin:0;font-size:28px;font-weight:600;letter-spacing:-.03em;line-height:1.15;flex:0 0 auto}
.fs-rm-search{display:flex;align-items:center;gap:8px;min-width:0;flex:1;max-width:280px;padding:0;border:0;background:transparent;color:var(--fs-muted)}
.fs-rm-search svg{flex:0 0 auto;opacity:.75}
.fs-rm-search input{flex:1;min-width:0;border:0;outline:0;background:transparent;color:var(--fs-text);font:inherit;font-size:14px;padding:0}
.fs-rm-search input::placeholder{color:var(--fs-subtle)}
.fs-rm-actions{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-left:auto}
.fs-rm-tabs{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.fs-rm-tabs label{display:inline-flex;align-items:center;gap:8px;padding:8px 12px;border-radius:${controlR};color:var(--fs-muted);cursor:pointer;border:1px solid var(--fs-border);background:var(--fs-surface);user-select:none;font-weight:500}
.fs-rm-tabs label:hover{color:var(--fs-text);border-color:var(--fs-subtle)}
.fs-rm-count{font-size:11px;color:var(--fs-subtle);font-variant-numeric:tabular-nums}
.fs-rm-panel{display:none;flex-direction:column;gap:16px;flex:1;min-height:0}
.fs-rm-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;align-content:start}
.fs-rm-card{display:flex;flex-direction:column;aspect-ratio:1/1;border:1px solid var(--fs-border);border-radius:0;overflow:hidden;background:transparent;min-height:0;transition:border-color .15s ease}
.fs-rm-card:hover{border-color:color-mix(in srgb, var(--fs-border) 35%, var(--fs-text))}
.fs-rm-art{background:transparent;padding:10px 12px 6px;flex:1;min-height:0;display:flex;flex-direction:column;overflow:hidden;border-bottom:1px solid var(--fs-border)}
.fs-rm-art svg,.fs-rm-art img{width:100%;height:100%;display:block;color:var(--fs-text);object-fit:contain}
.fs-rm-body{padding:14px 16px 16px;display:flex;flex-direction:column;gap:10px;flex:0 0 auto;background:transparent}
.fs-rm-name{margin:0;font-size:20px;font-weight:600;letter-spacing:-.02em;line-height:1.25;color:var(--fs-text)}
.fs-rm-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:auto}
.fs-rm-tag{display:inline-flex;align-items:center;padding:3px 8px;border-radius:0;font-family:ui-monospace,SFMono-Regular,'SF Mono',Menlo,Consolas,monospace;font-size:10px;font-weight:500;line-height:1.3;letter-spacing:.04em;text-transform:uppercase;background:#fff;color:#000;border:0}
.fs-rm-tag.is-interview,.fs-rm-tag.is-olympiad,.fs-rm-tag.is-dsa{background:#fff;color:#000}
${navActive}
${jbNav}
${extra}
@media (max-width:980px){
  .fs-rm-main{padding:22px 20px 28px}
  .fs-rm-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@media (max-width:640px){
  .fs-rm-title{font-size:24px}
  .fs-rm-grid{grid-template-columns:1fr}
}
`.trim();
}

function tagChips(tags: TagId[]): string {
  return tags
    .map((t) => `<span class="fs-rm-tag is-${t}">${esc(TAG_LABEL[t])}</span>`)
    .join("");
}

function card(r: Roadmap): string {
  return `<article class="fs-rm-card">
  <div class="fs-rm-art">${r.sketch}</div>
  <div class="fs-rm-body">
    <h3 class="fs-rm-name">${esc(r.title)}</h3>
    <div class="fs-rm-tags">${tagChips(r.tags)}</div>
  </div>
</article>`;
}

function cardsFor(cat: CatId): string {
  const list =
    cat === "all" ? ROADMAPS : ROADMAPS.filter((r) => r.cats.includes(cat));
  return `<div class="fs-rm-grid">${list.map(card).join("")}</div>`;
}

function railBtn(icon: string, active = false): string {
  return `<span class="fs-rm-rail-btn${active ? " is-active" : ""}" aria-hidden="true">${icon}</span>`;
}

const ICO = {
  cmd: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9 9H6.5A2.5 2.5 0 1 1 9 6.5V9z"/><path d="M15 9h2.5A2.5 2.5 0 1 0 15 6.5V9z"/><path d="M9 15H6.5A2.5 2.5 0 1 0 9 17.5V15z"/><path d="M15 15h2.5a2.5 2.5 0 1 1-2.5 2.5V15z"/><path d="M9 9h6v6H9z"/></svg>`,
  trophy: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v6a5 5 0 0 1-10 0V4z"/><path d="M7 6H4.8A2.8 2.8 0 0 0 7.6 11"/><path d="M17 6h2.2A2.8 2.8 0 0 1 16.4 11"/></svg>`,
  clock: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><path d="M12 8v4.5l3 1.5"/></svg>`,
  chat: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 7a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3h-5.2L6 19.2V15H8a3 3 0 0 1-3-3V7z"/></svg>`,
};

export function renderRoadmaps(snippet: Snippet): string {
  const showItems = snippet.hidden?.items !== true;
  const title = snippet.heading || "Roadmaps";

  const tabs = NAV.map((nav, i) => ({
    ...nav,
    label: snippet.items[i]?.title || nav.label,
  }));

  const radios = tabs
    .map(
      (nav, i) =>
        `<input class="fs-rm-sr" type="radio" name="fs-rm-cat" id="fs-rm-cat-${nav.id}"${i === 0 ? " checked" : ""}>`,
    )
    .join("");

  const tabBar = tabs
    .map(
      (tab) =>
        `<label for="fs-rm-cat-${tab.id}">${esc(tab.label)}<span class="fs-rm-count">${tab.count}</span></label>`,
    )
    .join("");

  const panels = tabs
    .map(
      (tab) => `<section class="fs-rm-panel" id="fs-rm-panel-${tab.id}">
      ${showItems ? cardsFor(tab.id) : ""}
    </section>`,
    )
    .join("");

  return `<div class="fs-rm-shell">${radios}
  <div class="fs-rm">
    <aside class="fs-rm-rail">
      <div class="fs-rm-rail-logo"><img src="${REPOVIVE_LOGO_SRC}" width="28" height="28" alt=""></div>
      <nav class="fs-rm-rail-nav">
        ${railBtn(ICO.cmd)}
        ${railBtn(ICO.trophy, true)}
        ${railBtn(ICO.clock)}
        ${railBtn(ICO.chat)}
      </nav>
    </aside>
    <div class="fs-rm-main">
      <header class="fs-rm-top">
        <div class="fs-rm-brand">
          <h1 class="fs-rm-title">${esc(title)}</h1>
          <label class="fs-rm-search">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/></svg>
            <input type="search" placeholder="Search roadmaps…" autocomplete="off" spellcheck="false">
          </label>
        </div>
        <div class="fs-rm-actions">
          <nav class="fs-rm-tabs">${tabBar}</nav>
        </div>
      </header>
      ${panels}
    </div>
  </div>
</div>`;
}
