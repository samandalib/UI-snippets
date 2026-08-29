import { COMPANY_LOGOS } from "./company-logos";
import { REPOVIVE_LOGO_SRC } from "./repovive-logo";
import type { Snippet, SnippetStyle } from "./types";

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

type Diff = "easy" | "medium" | "hard";

type CatalogRow = {
  id: string;
  title: string;
  difficulty?: Diff;
  tags: string[];
  company?: { mark: string; name: string };
  premium?: boolean;
  solved?: [number, number];
};

type Submission = {
  when: string;
  who: string;
  initials: string;
  problem: string;
  lang: string;
  verdict: "accepted" | "wrong";
  time: string;
  memory: string;
};

const ROUNDS: CatalogRow[] = [
  { id: "20J", title: "Three at the Top", difficulty: "hard", tags: [], solved: [7, 12] },
  { id: "20K", title: "Tree on a Polygon", difficulty: "hard", tags: [], solved: [24, 30] },
  { id: "20L", title: "Costly Substrings", difficulty: "hard", tags: [], solved: [18, 41] },
  { id: "20M", title: "Hidden Permutation", difficulty: "medium", tags: [], solved: [33, 48] },
  { id: "20N", title: "No Self-Purchase", difficulty: "medium", tags: [], solved: [56, 70] },
  { id: "20O", title: "Timeless Overtakes", difficulty: "medium", tags: [], solved: [61, 74] },
  { id: "20P", title: "Pair Deletion", difficulty: "easy", tags: [], solved: [124, 127] },
  { id: "19B", title: "Lattice Paths", difficulty: "easy", tags: [], solved: [98, 101] },
];

const CLASSICS: CatalogRow[] = [
  { id: "CLS1", title: "Hello, World!", tags: ["Implementation"], solved: [51, 52] },
  { id: "CLS2", title: "Recursion (Fibonacci)", tags: ["Math"], solved: [44, 48] },
  { id: "CLS3", title: "Dynamic Programming (Fibonacci)", tags: ["DP"], solved: [23, 25] },
  { id: "CLS4", title: "0/1 Knapsack", tags: ["DP"], solved: [19, 22] },
  { id: "CLS5", title: "Unbounded Knapsack", tags: ["DP"], solved: [14, 14] },
  { id: "CLS6", title: "Edit Distance", tags: ["DP", "Strings"], solved: [12, 12] },
  { id: "CLS7", title: "Binary Search on Answer", tags: ["Binary Search"], solved: [31, 36] },
  { id: "CLS8", title: "Euclidean Algorithm", tags: ["Math", "Number Theory"], solved: [80, 92] },
];

const FAANG: CatalogRow[] = [
  { id: "FNG1", title: "Irrigation Walk Steps", difficulty: "medium", tags: ["Implementation", "Greedy"], company: { mark: "G", name: "Google" } },
  { id: "FNG2", title: "Repeated Digit Count", difficulty: "easy", tags: ["Math"], company: { mark: "M", name: "Meta" } },
  { id: "FNG3", title: "Warehouse Merge Windows", difficulty: "medium", tags: ["Two Pointers", "Greedy"], company: { mark: "A", name: "Amazon" } },
  { id: "FNG4", title: "Catalog Cycle Detect", difficulty: "medium", tags: ["DFS", "Graphs"], company: { mark: "Ms", name: "Microsoft" } },
  { id: "FNG5", title: "Photo Stream Gaps", difficulty: "easy", tags: ["Two Pointers"], company: { mark: "", name: "Apple" } },
  { id: "FNG6", title: "Distributed Lock Queue", difficulty: "hard", tags: ["Data Structures"], company: { mark: "Ms", name: "Microsoft" }, premium: true },
  { id: "FNG7", title: "Ads Bid Ladder", difficulty: "hard", tags: ["Greedy", "Math"], company: { mark: "G", name: "Google" }, premium: true },
  { id: "FNG8", title: "Friend Circle Cut", difficulty: "medium", tags: ["DFS", "Graphs"], company: { mark: "M", name: "Meta" } },
];

const QUANT: CatalogRow[] = [
  { id: "QUANT1", title: "Monty Switch", difficulty: "easy", tags: ["Probability"], company: { mark: "JS", name: "Jane Street" } },
  { id: "QUANT2", title: "First Head", difficulty: "easy", tags: ["Expectation"], company: { mark: "H", name: "HRT" } },
  { id: "QUANT3", title: "Biased Coin Run", difficulty: "medium", tags: ["Probability", "Expectation"], company: { mark: "Σ", name: "Two Sigma" } },
  { id: "QUANT4", title: "Roulette Survival", difficulty: "hard", tags: ["DP", "Probability"], company: { mark: "JS", name: "Jane Street" }, premium: true },
  { id: "QUANT5", title: "Order Book Drift", difficulty: "medium", tags: ["Expectation"], company: { mark: "H", name: "HRT" } },
  { id: "QUANT6", title: "Kelly Fraction", difficulty: "hard", tags: ["Math", "Probability"], company: { mark: "Σ", name: "Two Sigma" } },
  { id: "QUANT7", title: "Random Walk Barrier", difficulty: "medium", tags: ["DP", "Math"], company: { mark: "JS", name: "Jane Street" } },
  { id: "QUANT8", title: "Coupon Collector+", difficulty: "easy", tags: ["Expectation"], company: { mark: "H", name: "HRT" } },
];

const SUBMISSIONS: Submission[] = [
  { when: "9m ago", who: "Pablo Achá", initials: "PA", problem: "20N · No Self-Purchase", lang: "C++ 23", verdict: "wrong", time: "7 ms", memory: "1.3 MB" },
  { when: "14m ago", who: "Prasad", initials: "P", problem: "20P · Pair Deletion", lang: "C++ 23", verdict: "accepted", time: "12 ms", memory: "1.9 MB" },
  { when: "28m ago", who: "Benjamin Lorenz", initials: "BL", problem: "20K · Tree on a Polygon", lang: "C++ 23", verdict: "wrong", time: "20 ms", memory: "3.1 MB" },
  { when: "1h ago", who: "Rashad Alam", initials: "RA", problem: "20Q · Timeless Overtakes", lang: "Python 3", verdict: "accepted", time: "168 ms", memory: "13.4 MB" },
  { when: "1h ago", who: "Mina Park", initials: "MP", problem: "20J · Three at the Top", lang: "C++ 23", verdict: "accepted", time: "31 ms", memory: "4.2 MB" },
  { when: "2h ago", who: "Omar Farid", initials: "OF", problem: "20N · No Self-Purchase", lang: "Rust", verdict: "wrong", time: "9 ms", memory: "2.0 MB" },
  { when: "3h ago", who: "Elena Voss", initials: "EV", problem: "20P · Pair Deletion", lang: "C++ 23", verdict: "accepted", time: "8 ms", memory: "1.6 MB" },
  { when: "3h ago", who: "Chris Nguyen", initials: "CN", problem: "19B · Lattice Paths", lang: "Java 21", verdict: "accepted", time: "54 ms", memory: "8.8 MB" },
];

const CLASSIC_FILTERS = ["Implementation", "DP", "Math", "Strings", "Binary Search", "Number Theory"];
const FAANG_FILTERS = ["Google", "Meta", "Amazon", "Apple", "Microsoft"];

const BOOK =
  '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>';
const LOCK =
  '<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';

function diffPill(d?: Diff): string {
  if (!d) return `<span class="fs-pb-muted">—</span>`;
  const label = d[0]!.toUpperCase() + d.slice(1);
  return `<span class="fs-pb-pill is-diff is-${d}">${label}</span>`;
}

function tags(list: string[], extra = 0): string {
  if (!list.length) return `<span class="fs-pb-muted">—</span>`;
  const chips = list.map((t) => `<span class="fs-pb-tag">${esc(t)}</span>`).join("");
  const more = extra > 0 ? `<span class="fs-pb-tag is-more">+${extra}</span>` : "";
  return `<div class="fs-pb-tags">${chips}${more}</div>`;
}

function solved([a, b]: [number, number]): string {
  const pct = Math.round((a / b) * 100);
  return `<div class="fs-pb-solved"><span>${a} / ${b}</span><span class="fs-pb-bar" aria-hidden="true"><i style="width:${pct}%"></i></span></div>`;
}

function company(c?: CatalogRow["company"]): string {
  if (!c) return "";
  const src = COMPANY_LOGOS[c.name];
  if (src) {
    return `<span class="fs-pb-co" title="${esc(c.name)}"><img src="${src}" width="16" height="16" alt="${esc(c.name)}"></span>`;
  }
  return `<span class="fs-pb-co is-text" title="${esc(c.name)}">${esc(c.mark)}</span>`;
}

function titleCell(row: CatalogRow): string {
  const pro = row.premium
    ? `<span class="fs-pb-pro">${LOCK} Pro</span>`
    : "";
  return `<div class="fs-pb-title">${esc(row.title)}${pro}</div>`;
}

function catalogRow(row: CatalogRow, kind: "rounds" | "classics" | "faang" | "quant"): string {
  const attr = [
    row.difficulty ? `data-diff="${row.difficulty}"` : "",
    row.tags.length ? `data-tags="${esc(row.tags.join(" "))}"` : "",
    row.company ? `data-co="${esc(row.company.name)}"` : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (kind === "rounds") {
    return `<tr ${attr}>
      <td class="fs-pb-id">${esc(row.id)}</td>
      <td>${titleCell(row)}</td>
      <td>${diffPill(row.difficulty)}</td>
      <td>${row.solved ? solved(row.solved) : ""}</td>
      <td class="fs-pb-learn"><span>${BOOK}</span></td>
    </tr>`;
  }
  if (kind === "classics") {
    return `<tr ${attr}>
      <td class="fs-pb-id">${esc(row.id)}</td>
      <td>${titleCell(row)}</td>
      <td>${tags(row.tags)}</td>
      <td>${row.solved ? solved(row.solved) : ""}</td>
      <td class="fs-pb-learn"><span>${BOOK}</span></td>
    </tr>`;
  }
  return `<tr ${attr}>
    <td class="fs-pb-id">${esc(row.id)}</td>
    <td>${titleCell(row)}</td>
    <td>${diffPill(row.difficulty)}</td>
    <td>${tags(row.tags.slice(0, 2), Math.max(0, row.tags.length - 2))}</td>
    <td>${company(row.company)}</td>
    <td class="fs-pb-learn"><span>${BOOK}</span></td>
  </tr>`;
}

function statusRow(row: Submission, i: number): string {
  return `<tr data-verdict="${row.verdict}">
    <td class="fs-pb-muted">${i + 1}</td>
    <td class="fs-pb-muted">${esc(row.when)}</td>
    <td><div class="fs-pb-who"><span class="fs-pb-av">${esc(row.initials)}</span><span class="fs-pb-handle">${esc(row.who)}</span></div></td>
    <td>${esc(row.problem)}</td>
    <td class="fs-pb-muted">${esc(row.lang)}</td>
    <td><span class="fs-pb-pill is-verdict is-${row.verdict === "accepted" ? "easy" : "hard"}">${row.verdict === "accepted" ? "Accepted" : "Wrong Answer"}</span></td>
    <td class="fs-pb-num">${esc(row.time)}</td>
    <td class="fs-pb-num">${esc(row.memory)}</td>
  </tr>`;
}

const TAB_META = [
  { key: "rounds", kicker: "Live contest set", blurb: "Current round problems, grouped by difficulty." },
  { key: "classics", kicker: "Fundamentals", blurb: "A short curriculum of core techniques." },
  { key: "faang", kicker: "Interview track", blurb: "Company-tagged questions from recent screens." },
  { key: "quant", kicker: "Probability desk", blurb: "Expectation, DP, and trading-interview classics." },
  { key: "status", kicker: "Judge stream", blurb: "Latest submissions across the current round." },
] as const;

function statusColors(s: SnippetStyle): { success: string; danger: string } {
  const preset = s.preset ?? "studio";
  const dark = s.scheme === "dark";
  if (preset === "vercel") {
    return dark ? { success: "#00c07f", danger: "#ff4d4f" } : { success: "#0f8a5f", danger: "#d93036" };
  }
  if (preset === "jetbrains") {
    return dark ? { success: "#5FB865", danger: "#DB5C5C" } : { success: "#208A3C", danger: "#C4342F" };
  }
  if (preset === "liquidglass") {
    return dark ? { success: "#7ce38b", danger: "#ff6961" } : { success: "#1c7c3c", danger: "#c4342f" };
  }
  return dark ? { success: "#4ade80", danger: "#ef4444" } : { success: "#15803d", danger: "#dc2626" };
}

export function problemsHubStyles(snippet: Snippet, radius: number): string {
  const preset = snippet.style.preset ?? "studio";
  const isVercel = preset === "vercel";
  const isJb = preset === "jetbrains";
  const isLg = preset === "liquidglass";
  const controlR = isJb ? "4px" : isLg ? "999px" : isVercel ? "8px" : `${Math.max(6, Math.round(radius * 0.55))}px`;
  const panelR = isJb ? "6px" : isLg ? `${Math.max(22, radius)}px` : isVercel ? "12px" : `${radius}px`;

  const sem = statusColors(snippet.style);
  const base = `
.fs-pb-sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}
.fs-pb-shell{position:relative}
.fs-pb{--fs-lb-success:${sem.success};--fs-lb-danger:${sem.danger};display:flex;min-height:100vh;background:var(--fs-bg);color:var(--fs-text);font-size:13px}
.fs-pb-side{width:220px;flex:0 0 220px;display:flex;flex-direction:column;padding:20px 14px;border-right:1px solid var(--fs-border);background:var(--fs-surface)}
.fs-pb-brand{display:flex;align-items:center;gap:10px;padding:0 8px 18px}
.fs-pb-brand img{width:26px;height:26px;object-fit:contain}
.fs-pb-brand strong{font-size:15px;font-weight:600;letter-spacing:-.02em}
.fs-pb-nav{display:flex;flex-direction:column;gap:4px}
.fs-pb-nav label{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:9px 10px;border-radius:${controlR};color:var(--fs-muted);cursor:pointer;border:1px solid transparent}
.fs-pb-nav label:hover{color:var(--fs-text);background:var(--fs-raised)}
.fs-pb-nav label span:first-child{font-weight:500}
.fs-pb-count{font-size:11px;color:var(--fs-subtle);font-variant-numeric:tabular-nums}
.fs-pb-main{flex:1;min-width:0;padding:22px 28px 28px;display:flex;flex-direction:column;gap:16px}
.fs-pb-head{display:flex;align-items:flex-end;justify-content:space-between;gap:16px}
.fs-pb-kicker{margin:0;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--fs-muted)}
.fs-pb-h{margin:6px 0 0;font-size:22px;font-weight:600;letter-spacing:-.03em}
.fs-pb-sub{margin:6px 0 0;color:var(--fs-muted);font-size:13px}
.fs-pb-filters{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
.fs-pb-filters label{padding:6px 11px;border:1px solid var(--fs-border);border-radius:${controlR};color:var(--fs-muted);cursor:pointer;font-size:12px;background:var(--fs-surface)}
.fs-pb-filters label:hover{color:var(--fs-text);border-color:var(--fs-subtle)}
.fs-pb-filters .fs-pb-co-chip{display:inline-flex;align-items:center;gap:6px}
.fs-pb-filters .fs-pb-co-chip img{width:14px;height:14px;object-fit:contain;display:block;filter:brightness(0) invert(1)}
.fs-pb-card{background:var(--fs-surface);border:1px solid var(--fs-border);border-radius:${panelR};overflow:auto;flex:1}
.fs-pb-table{width:100%;border-collapse:collapse}
.fs-pb-table th{font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--fs-muted);font-weight:500;text-align:left;padding:12px 14px;border-bottom:1px solid var(--fs-border);background:var(--fs-surface)}
.fs-pb-table td{padding:0 14px;height:48px;border-bottom:1px solid var(--fs-border);vertical-align:middle}
.fs-pb-table tbody tr:last-child td{border-bottom:0}
.fs-pb-id{font-variant-numeric:tabular-nums;color:var(--fs-muted);font-weight:500;width:72px}
.fs-pb-title{font-weight:500;color:var(--fs-text);display:inline-flex;align-items:center;gap:8px}
.fs-pb-muted{color:var(--fs-subtle)}
.fs-pb-num{font-variant-numeric:tabular-nums;color:var(--fs-muted)}
.fs-pb-tags{display:flex;flex-wrap:wrap;gap:4px}
.fs-pb-tag{display:inline-flex;align-items:center;padding:3px 8px;border:1px solid var(--fs-border);border-radius:${isLg ? "999px" : "6px"};font-size:11px;color:var(--fs-text);background:var(--fs-raised)}
.fs-pb-tag.is-more{color:var(--fs-muted)}
.fs-pb-pill{display:inline-flex;align-items:center;justify-content:center;padding:3px 8px;border-radius:${isLg ? "999px" : "6px"};font-size:11px;font-weight:500}
.fs-pb-pill.is-diff{width:72px;box-sizing:border-box}
.fs-pb-pill.is-verdict{width:108px;box-sizing:border-box}
.fs-pb-pill.is-easy,.fs-pb-pill.is-accepted{color:var(--fs-lb-success);background:color-mix(in srgb,var(--fs-lb-success) 14%,transparent)}
.fs-pb-pill.is-medium{color:#f5a623;background:color-mix(in srgb,#f5a623 16%,transparent)}
.fs-pb-pill.is-hard{color:var(--fs-lb-danger);background:color-mix(in srgb,var(--fs-lb-danger) 14%,transparent)}
.fs-pb-pro{display:inline-flex;align-items:center;gap:4px;padding:2px 7px;border-radius:${isLg ? "999px" : "6px"};font-size:10px;font-weight:500;color:#f5a623;border:1px solid color-mix(in srgb,#f5a623 45%,transparent)}
.fs-pb-solved{display:flex;flex-direction:column;gap:5px;font-variant-numeric:tabular-nums;color:var(--fs-text);font-size:12px;min-width:72px}
.fs-pb-bar{display:block;height:3px;border-radius:99px;background:var(--fs-border);overflow:hidden}
.fs-pb-bar i{display:block;height:100%;background:var(--fs-text);border-radius:99px}
.fs-pb-co{display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;padding:0;border:0;background:transparent}
.fs-pb-co img{width:16px;height:16px;object-fit:contain;display:block;filter:brightness(0) invert(1)}
.fs-pb-co.is-text{min-width:28px;height:22px;padding:0 6px;border-radius:6px;border:1px solid var(--fs-border);background:var(--fs-raised);font-size:10px;font-weight:600}
.fs-pb-learn{color:#fff;width:40px}
.fs-pb-learn span{display:inline-flex;opacity:1}
.fs-pb-who{display:inline-flex;align-items:center;gap:8px}
.fs-pb-av{width:22px;height:22px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;background:var(--fs-raised);border:1px solid var(--fs-border);font-size:9px;font-weight:600;color:var(--fs-muted)}
.fs-pb-handle{color:var(--fs-text);font-weight:500}
.fs-pb-panel{display:none;flex-direction:column;gap:16px;flex:1;min-height:0}
#fs-pb-tab-rounds:checked ~ .fs-pb .fs-pb-nav label[for="fs-pb-tab-rounds"],
#fs-pb-tab-classics:checked ~ .fs-pb .fs-pb-nav label[for="fs-pb-tab-classics"],
#fs-pb-tab-faang:checked ~ .fs-pb .fs-pb-nav label[for="fs-pb-tab-faang"],
#fs-pb-tab-quant:checked ~ .fs-pb .fs-pb-nav label[for="fs-pb-tab-quant"],
#fs-pb-tab-status:checked ~ .fs-pb .fs-pb-nav label[for="fs-pb-tab-status"]{
 color:var(--fs-text);background:var(--fs-raised);border-color:var(--fs-border)}
#fs-pb-tab-rounds:checked ~ .fs-pb #fs-pb-panel-rounds,
#fs-pb-tab-classics:checked ~ .fs-pb #fs-pb-panel-classics,
#fs-pb-tab-faang:checked ~ .fs-pb #fs-pb-panel-faang,
#fs-pb-tab-quant:checked ~ .fs-pb #fs-pb-panel-quant,
#fs-pb-tab-status:checked ~ .fs-pb #fs-pb-panel-status{display:flex}
#fs-pb-diff-easy:checked ~ .fs-pb #fs-pb-panel-rounds tbody tr:not([data-diff="easy"]),
#fs-pb-diff-medium:checked ~ .fs-pb #fs-pb-panel-rounds tbody tr:not([data-diff="medium"]),
#fs-pb-diff-hard:checked ~ .fs-pb #fs-pb-panel-rounds tbody tr:not([data-diff="hard"]){display:none}
#fs-pb-diff-easy:checked ~ .fs-pb label[for="fs-pb-diff-easy"],
#fs-pb-diff-medium:checked ~ .fs-pb label[for="fs-pb-diff-medium"],
#fs-pb-diff-hard:checked ~ .fs-pb label[for="fs-pb-diff-hard"],
#fs-pb-diff-all:checked ~ .fs-pb label[for="fs-pb-diff-all"],
#fs-pb-ver-all:checked ~ .fs-pb label[for="fs-pb-ver-all"],
#fs-pb-ver-ok:checked ~ .fs-pb label[for="fs-pb-ver-ok"],
#fs-pb-ver-wa:checked ~ .fs-pb label[for="fs-pb-ver-wa"]{
 color:var(--fs-text);border-color:var(--fs-text)}
#fs-pb-ver-ok:checked ~ .fs-pb #fs-pb-panel-status tbody tr:not([data-verdict="accepted"]),
#fs-pb-ver-wa:checked ~ .fs-pb #fs-pb-panel-status tbody tr:not([data-verdict="wrong"]){display:none}
`;

  const anyClassic = CLASSIC_FILTERS.map((_, i) => `#fs-pb-cls-${i}:checked`).join(",");
  const classicRules = [
    `.fs-pb-shell:has(${anyClassic}) #fs-pb-panel-classics tbody tr{display:none}`,
    ...CLASSIC_FILTERS.map((tag, i) => {
      const id = `fs-pb-cls-${i}`;
      const token = tag.split(" ")[0]!;
      return `#${id}:checked ~ .fs-pb label[for="${id}"]{color:var(--fs-text);border-color:var(--fs-text)}
.fs-pb-shell:has(#${id}:checked) #fs-pb-panel-classics tbody tr[data-tags~="${token}"]{display:table-row}`;
    }),
  ].join("\n");

  const anyFaang = FAANG_FILTERS.map((_, i) => `#fs-pb-co-${i}:checked`).join(",");
  const faangRules = [
    `.fs-pb-shell:has(${anyFaang}) #fs-pb-panel-faang tbody tr{display:none}`,
    ...FAANG_FILTERS.map((name, i) => {
      const id = `fs-pb-co-${i}`;
      return `#${id}:checked ~ .fs-pb label[for="${id}"]{color:var(--fs-text);border-color:var(--fs-text)}
.fs-pb-shell:has(#${id}:checked) #fs-pb-panel-faang tbody tr[data-co="${name}"]{display:table-row}`;
    }),
  ].join("\n");

  const extra =
    isJb
      ? `.fs-pb-nav label{border-radius:4px}
#fs-pb-tab-rounds:checked ~ .fs-pb .fs-pb-nav label[for="fs-pb-tab-rounds"],
#fs-pb-tab-classics:checked ~ .fs-pb .fs-pb-nav label[for="fs-pb-tab-classics"],
#fs-pb-tab-faang:checked ~ .fs-pb .fs-pb-nav label[for="fs-pb-tab-faang"],
#fs-pb-tab-quant:checked ~ .fs-pb .fs-pb-nav label[for="fs-pb-tab-quant"],
#fs-pb-tab-status:checked ~ .fs-pb .fs-pb-nav label[for="fs-pb-tab-status"]{background:var(--fs-accent);color:#fff;border-color:transparent}
#fs-pb-tab-rounds:checked ~ .fs-pb .fs-pb-nav label[for="fs-pb-tab-rounds"] .fs-pb-count,
#fs-pb-tab-classics:checked ~ .fs-pb .fs-pb-nav label[for="fs-pb-tab-classics"] .fs-pb-count,
#fs-pb-tab-faang:checked ~ .fs-pb .fs-pb-nav label[for="fs-pb-tab-faang"] .fs-pb-count,
#fs-pb-tab-quant:checked ~ .fs-pb .fs-pb-nav label[for="fs-pb-tab-quant"] .fs-pb-count,
#fs-pb-tab-status:checked ~ .fs-pb .fs-pb-nav label[for="fs-pb-tab-status"] .fs-pb-count{color:rgba(255,255,255,.8)}`
      : isLg
        ? `.fs-pb-side,.fs-pb-card{backdrop-filter:blur(28px) saturate(180%);box-shadow:inset 0 1px 0 rgba(255,255,255,.45),0 18px 40px -22px rgba(0,0,0,.55)}
.fs-pb-nav{gap:6px}`
        : "";

  return `${base}\n${classicRules}\n${faangRules}\n${extra}`.trim();
}

export function renderProblemsHub(snippet: Snippet): string {
  const tabs = snippet.items.length
    ? snippet.items.map((item, i) => ({
        key: TAB_META[i]?.key ?? `tab-${i}`,
        title: item.title,
        count: [ROUNDS, CLASSICS, FAANG, QUANT, SUBMISSIONS][i]?.length ?? 0,
        meta: TAB_META[i],
      }))
    : TAB_META.map((meta, i) => ({
        key: meta.key,
        title: ["Rounds", "Classics", "FAANG", "Quant", "Status"][i]!,
        count: [ROUNDS, CLASSICS, FAANG, QUANT, SUBMISSIONS][i]!.length,
        meta,
      }));

  const radios = [
    `<input class="fs-pb-sr" type="radio" name="fs-pb-tab" id="fs-pb-tab-rounds" checked>`,
    `<input class="fs-pb-sr" type="radio" name="fs-pb-tab" id="fs-pb-tab-classics">`,
    `<input class="fs-pb-sr" type="radio" name="fs-pb-tab" id="fs-pb-tab-faang">`,
    `<input class="fs-pb-sr" type="radio" name="fs-pb-tab" id="fs-pb-tab-quant">`,
    `<input class="fs-pb-sr" type="radio" name="fs-pb-tab" id="fs-pb-tab-status">`,
    `<input class="fs-pb-sr" type="radio" name="fs-pb-diff" id="fs-pb-diff-all" checked>`,
    `<input class="fs-pb-sr" type="radio" name="fs-pb-diff" id="fs-pb-diff-easy">`,
    `<input class="fs-pb-sr" type="radio" name="fs-pb-diff" id="fs-pb-diff-medium">`,
    `<input class="fs-pb-sr" type="radio" name="fs-pb-diff" id="fs-pb-diff-hard">`,
    `<input class="fs-pb-sr" type="radio" name="fs-pb-ver" id="fs-pb-ver-all" checked>`,
    `<input class="fs-pb-sr" type="radio" name="fs-pb-ver" id="fs-pb-ver-ok">`,
    `<input class="fs-pb-sr" type="radio" name="fs-pb-ver" id="fs-pb-ver-wa">`,
    ...CLASSIC_FILTERS.map((tag, i) => `<input class="fs-pb-sr" type="checkbox" id="fs-pb-cls-${i}" data-tag="${esc(tag)}">`),
    ...FAANG_FILTERS.map((name, i) => `<input class="fs-pb-sr" type="checkbox" id="fs-pb-co-${i}">`),
  ].join("");

  const nav = tabs
    .map(
      (tab) =>
        `<label for="fs-pb-tab-${tab.key}"><span>${esc(tab.title)}</span><span class="fs-pb-count">${tab.count}</span></label>`,
    )
    .join("");

  const classicChips = CLASSIC_FILTERS.map(
    (tag, i) => `<label for="fs-pb-cls-${i}">${esc(tag)}</label>`,
  ).join("");
  const faangChips = FAANG_FILTERS.map((name, i) => {
    const src = COMPANY_LOGOS[name];
    const icon = src
      ? `<img src="${src}" width="14" height="14" alt="">`
      : "";
    return `<label for="fs-pb-co-${i}" class="fs-pb-co-chip">${icon}${esc(name)}</label>`;
  }).join("");

  return `<div class="fs-pb-shell">${radios}
  <div class="fs-pb">
    <aside class="fs-pb-side">
      <div class="fs-pb-brand">
        <img src="${REPOVIVE_LOGO_SRC}" width="26" height="26" alt="">
        <strong>Problems</strong>
      </div>
      <nav class="fs-pb-nav">${nav}</nav>
    </aside>
    <div class="fs-pb-main">
      <section class="fs-pb-panel" id="fs-pb-panel-rounds">
        <div class="fs-pb-head">
          <div>
            <p class="fs-pb-kicker">${esc(tabs[0]?.title ?? "Rounds")}</p>
            <h2 class="fs-pb-h">${esc(TAB_META[0].kicker)}</h2>
            <p class="fs-pb-sub">${esc(TAB_META[0].blurb)}</p>
          </div>
          <div class="fs-pb-filters">
            <label for="fs-pb-diff-all">All</label>
            <label for="fs-pb-diff-easy">Easy</label>
            <label for="fs-pb-diff-medium">Medium</label>
            <label for="fs-pb-diff-hard">Hard</label>
          </div>
        </div>
        <div class="fs-pb-card"><table class="fs-pb-table">
          <thead><tr><th>ID</th><th>Title</th><th>Difficulty</th><th>Solved</th><th></th></tr></thead>
          <tbody>${ROUNDS.map((row) => catalogRow(row, "rounds")).join("")}</tbody>
        </table></div>
      </section>
      <section class="fs-pb-panel" id="fs-pb-panel-classics">
        <div class="fs-pb-head">
          <div>
            <p class="fs-pb-kicker">${esc(tabs[1]?.title ?? "Classics")}</p>
            <h2 class="fs-pb-h">${esc(TAB_META[1].kicker)}</h2>
            <p class="fs-pb-sub">${esc(TAB_META[1].blurb)}</p>
          </div>
          <div class="fs-pb-filters">${classicChips}</div>
        </div>
        <div class="fs-pb-card"><table class="fs-pb-table">
          <thead><tr><th>ID</th><th>Title</th><th>Topics</th><th>Solved</th><th></th></tr></thead>
          <tbody>${CLASSICS.map((row) => catalogRow(row, "classics")).join("")}</tbody>
        </table></div>
      </section>
      <section class="fs-pb-panel" id="fs-pb-panel-faang">
        <div class="fs-pb-head">
          <div>
            <p class="fs-pb-kicker">${esc(tabs[2]?.title ?? "FAANG")}</p>
            <h2 class="fs-pb-h">${esc(TAB_META[2].kicker)}</h2>
            <p class="fs-pb-sub">${esc(TAB_META[2].blurb)}</p>
          </div>
          <div class="fs-pb-filters">${faangChips}</div>
        </div>
        <div class="fs-pb-card"><table class="fs-pb-table">
          <thead><tr><th>ID</th><th>Title</th><th>Difficulty</th><th>Topics</th><th>Company</th><th></th></tr></thead>
          <tbody>${FAANG.map((row) => catalogRow(row, "faang")).join("")}</tbody>
        </table></div>
      </section>
      <section class="fs-pb-panel" id="fs-pb-panel-quant">
        <div class="fs-pb-head">
          <div>
            <p class="fs-pb-kicker">${esc(tabs[3]?.title ?? "Quant")}</p>
            <h2 class="fs-pb-h">${esc(TAB_META[3].kicker)}</h2>
            <p class="fs-pb-sub">${esc(TAB_META[3].blurb)}</p>
          </div>
        </div>
        <div class="fs-pb-card"><table class="fs-pb-table">
          <thead><tr><th>ID</th><th>Title</th><th>Difficulty</th><th>Topics</th><th>Desk</th><th></th></tr></thead>
          <tbody>${QUANT.map((row) => catalogRow(row, "quant")).join("")}</tbody>
        </table></div>
      </section>
      <section class="fs-pb-panel" id="fs-pb-panel-status">
        <div class="fs-pb-head">
          <div>
            <p class="fs-pb-kicker">${esc(tabs[4]?.title ?? "Status")}</p>
            <h2 class="fs-pb-h">${esc(TAB_META[4].kicker)}</h2>
            <p class="fs-pb-sub">${esc(TAB_META[4].blurb)}</p>
          </div>
          <div class="fs-pb-filters">
            <label for="fs-pb-ver-all">All</label>
            <label for="fs-pb-ver-ok">Accepted</label>
            <label for="fs-pb-ver-wa">Wrong answer</label>
          </div>
        </div>
        <div class="fs-pb-card"><table class="fs-pb-table">
          <thead><tr><th>#</th><th>When</th><th>Who</th><th>Problem</th><th>Lang</th><th>Verdict</th><th>Time</th><th>Memory</th></tr></thead>
          <tbody>${SUBMISSIONS.map(statusRow).join("")}</tbody>
        </table></div>
      </section>
    </div>
  </div>
</div>`;
}
