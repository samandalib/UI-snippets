import { playgroundStyles, renderPlayground } from "./code-playground";
import { iconSvg } from "./icons";
import { problemsHubStyles, renderProblemsHub } from "./problems-hub";
import { REPOVIVE_LOGO_SRC } from "./repovive-logo";
import { roadmapsStyles, renderRoadmaps } from "./roadmaps";
import type { LeaderboardEntry, ProblemCell, Snippet } from "./types";

function esc(value: string): string {
 return value
   .replace(/&/g, "&amp;")
   .replace(/</g, "&lt;")
   .replace(/>/g, "&gt;")
   .replace(/"/g, "&quot;");
}

const FONT_STACKS: Record<Snippet["style"]["font"], string> = {
 sans: "ui-sans-serif, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
 serif: "'Iowan Old Style', 'Palatino Linotype', Palatino, Georgia, serif",
 mono: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace",
};

/** Vercel keeps its own grotesque stack regardless of the font control. */
const VERCEL_SANS =
 "'Geist','Geist Sans',Inter,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const VERCEL_MONO = "'Geist Mono',ui-monospace,SFMono-Regular,'SF Mono',Menlo,Consolas,monospace";

/** JetBrains IDE chrome: Inter-like UI type, JetBrains Mono for code. */
const JB_SANS = "'JetBrains Sans',Inter,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const JB_MONO = "'JetBrains Mono',ui-monospace,SFMono-Regular,'SF Mono',Menlo,Consolas,monospace";

/** Apple Liquid Glass: SF system type, SF Mono for code. */
const LG_SANS =
 "-apple-system,BlinkMacSystemFont,'SF Pro Text','SF Pro Display','Helvetica Neue',Inter,sans-serif";
const LG_MONO = "'SF Mono',ui-monospace,SFMono-Regular,Menlo,Consolas,monospace";

type Theme = {
 bg: string;
 surface: string;
 raised: string;
 overlay: string;
 border: string;
 text: string;
 muted: string;
 subtle: string;
 ctaBg: string;
 ctaText: string;
 ctaRadius: string;
 eyebrowColor: string;
 statColor: string;
 fontFamily: string;
 monoFamily: string;
 tracking: string;
 overlayShadow: string;
 syntax: { key: string; str: string; fn: string; num: string; com: string; comStyle: string };
};

/** Design tokens per preset — this is what makes a preset actually look different. */
function theme(s: Snippet["style"]): Theme {
 const dark = s.scheme === "dark";

 if ((s.preset ?? "studio") === "vercel") {
   return dark
     ? {
         bg: "#000000",
         surface: "#0a0a0a",
         raised: "#111111",
         overlay: "#1c1c1c",
         border: "#262626",
         text: "#ededed",
         muted: "#a1a1aa",
         subtle: "#6b6b70",
         ctaBg: "#ededed",
         ctaText: "#000000",
         ctaRadius: "8px",
         eyebrowColor: "#a1a1aa",
         statColor: "#ededed",
         fontFamily: VERCEL_SANS,
         monoFamily: VERCEL_MONO,
         tracking: "-0.011em",
         overlayShadow: "0 8px 30px rgba(0,0,0,.6)",
         syntax: {
           key: "#ff4f8b",
           str: "#4ade80",
           fn: "#8b7bff",
           num: "#f5a623",
           com: "#6b6b70",
           comStyle: "normal",
         },
       }
     : {
         bg: "#ffffff",
         surface: "#fafafa",
         raised: "#f4f4f5",
         overlay: "#ffffff",
         border: "#e5e5e5",
         text: "#0a0a0a",
         muted: "#666666",
         subtle: "#8f8f96",
         ctaBg: "#0a0a0a",
         ctaText: "#ffffff",
         ctaRadius: "8px",
         eyebrowColor: "#666666",
         statColor: "#0a0a0a",
         fontFamily: VERCEL_SANS,
         monoFamily: VERCEL_MONO,
         tracking: "-0.011em",
         overlayShadow: "0 8px 30px rgba(0,0,0,.12)",
         syntax: {
           key: "#d6336c",
           str: "#0f8a5f",
           fn: "#6b4dff",
           num: "#b8730b",
           com: "#8f8f96",
           comStyle: "normal",
         },
       };
 }

 if ((s.preset ?? "studio") === "jetbrains") {
   return dark
     ? {
         bg: "#1E1F22",
         surface: "#2B2D30",
         raised: "#393B40",
         overlay: "#2B2D30",
         border: "#393B40",
         text: "#EBECF0",
         muted: "#A3A6A9",
         subtle: "#6F737A",
         ctaBg: "#3574F0",
         ctaText: "#FFFFFF",
         ctaRadius: "4px",
         eyebrowColor: "#A3A6A9",
         statColor: "#EBECF0",
         fontFamily: JB_SANS,
         monoFamily: JB_MONO,
         tracking: "0",
         overlayShadow: "0 10px 28px rgba(0,0,0,.55)",
         syntax: {
           key: "#CF8E6D",
           str: "#6AAB73",
           fn: "#56A8F5",
           num: "#2AACB8",
           com: "#7A7E85",
           comStyle: "italic",
         },
       }
     : {
         bg: "#FFFFFF",
         surface: "#F7F8FA",
         raised: "#EBECF0",
         overlay: "#FFFFFF",
         border: "#D3D5DB",
         text: "#1E1F22",
         muted: "#6F737A",
         subtle: "#8C8F96",
         ctaBg: "#3574F0",
         ctaText: "#FFFFFF",
         ctaRadius: "4px",
         eyebrowColor: "#6F737A",
         statColor: "#1E1F22",
         fontFamily: JB_SANS,
         monoFamily: JB_MONO,
         tracking: "0",
         overlayShadow: "0 10px 28px rgba(0,0,0,.14)",
         syntax: {
           key: "#0033B3",
           str: "#067D17",
           fn: "#00627A",
           num: "#1750EB",
           com: "#8C8F96",
           comStyle: "italic",
         },
       };
 }

 if ((s.preset ?? "studio") === "liquidglass") {
   return dark
     ? {
         bg: "rgba(10,12,24,0.28)",
         surface: "rgba(255,255,255,0.10)",
         raised: "rgba(255,255,255,0.18)",
         overlay: "rgba(28,28,32,0.42)",
         border: "rgba(255,255,255,0.28)",
         text: "#ffffff",
         muted: "rgba(255,255,255,0.72)",
         subtle: "rgba(255,255,255,0.5)",
         ctaBg: "rgba(255,255,255,0.22)",
         ctaText: "#ffffff",
         ctaRadius: "999px",
         eyebrowColor: "rgba(255,255,255,0.7)",
         statColor: "#ffffff",
         fontFamily: LG_SANS,
         monoFamily: LG_MONO,
         tracking: "-0.01em",
         overlayShadow: "0 24px 60px -18px rgba(0,0,0,.5)",
         syntax: {
           key: "#ff9f0a",
           str: "#7ce38b",
           fn: "#64d2ff",
           num: "#ffd60a",
           com: "rgba(255,255,255,0.5)",
           comStyle: "normal",
         },
       }
     : {
         bg: "rgba(255,255,255,0.34)",
         surface: "rgba(255,255,255,0.5)",
         raised: "rgba(255,255,255,0.72)",
         overlay: "rgba(255,255,255,0.6)",
         border: "rgba(255,255,255,0.7)",
         text: "#10121a",
         muted: "rgba(16,18,26,0.66)",
         subtle: "rgba(16,18,26,0.45)",
         ctaBg: "rgba(255,255,255,0.62)",
         ctaText: "#10121a",
         ctaRadius: "999px",
         eyebrowColor: "rgba(16,18,26,0.62)",
         statColor: "#10121a",
         fontFamily: LG_SANS,
         monoFamily: LG_MONO,
         tracking: "-0.01em",
         overlayShadow: "0 24px 60px -18px rgba(0,0,0,.25)",
         syntax: {
           key: "#b25000",
           str: "#1c7c3c",
           fn: "#0071a4",
           num: "#8a6d00",
           com: "rgba(16,18,26,0.45)",
           comStyle: "normal",
         },
       };
 }

 return dark
   ? {
       bg: "#0b0d12",
       surface: "#14171f",
       raised: "#1a1e27",
       overlay: "#0b0d12",
       border: "rgba(255,255,255,0.09)",
       text: "#f4f5f7",
       muted: "rgba(244,245,247,0.58)",
       subtle: "rgba(244,245,247,0.4)",
       ctaBg: s.accent,
       ctaText: "#0b0d12",
       ctaRadius: "999px",
       eyebrowColor: s.accent,
       statColor: s.accent,
       fontFamily: FONT_STACKS[s.font],
       monoFamily: FONT_STACKS.mono,
       tracking: "0",
       overlayShadow: "0 24px 60px -20px rgba(0,0,0,.6)",
       syntax: {
         key: "#f472b6",
         str: "#4ade80",
         fn: "#a78bfa",
         num: "#fbbf24",
         com: "rgba(244,245,247,0.58)",
         comStyle: "italic",
       },
     }
   : {
       bg: "#ffffff",
       surface: "#f6f7f9",
       raised: "#eef0f4",
       overlay: "#ffffff",
       border: "rgba(11,13,18,0.09)",
       text: "#0d1017",
       muted: "rgba(13,16,23,0.6)",
       subtle: "rgba(13,16,23,0.42)",
       ctaBg: s.accent,
       ctaText: "#ffffff",
       ctaRadius: "999px",
       eyebrowColor: s.accent,
       statColor: s.accent,
       fontFamily: FONT_STACKS[s.font],
       monoFamily: FONT_STACKS.mono,
       tracking: "0",
       overlayShadow: "0 24px 60px -20px rgba(0,0,0,.25)",
       syntax: {
         key: "#be185d",
         str: "#15803d",
         fn: "#6d28d9",
         num: "#b45309",
         com: "rgba(13,16,23,0.6)",
         comStyle: "italic",
       },
     };
}

function visible(snippet: Snippet, key: keyof NonNullable<Snippet["hidden"]>): boolean {
 return snippet.hidden?.[key] !== true;
}


function styleSheet(snippet: Snippet): string {
 const s = snippet.style;
 const c = theme(s);
 const preset = s.preset ?? "studio";
 const isVercel = preset === "vercel";
 const isJb = preset === "jetbrains";
 const isLg = preset === "liquidglass";
 /** Both product presets share the denser, hairline-driven layout metrics. */
 const dense = isVercel || isJb;
 const radius = isVercel ? 12 : isJb ? 6 : isLg ? Math.max(20, s.radius) : s.radius;
 /** Fixed design width: content max width plus the horizontal gutters. */
 const designWidth = s.maxWidth + 48;
 return `
.fs-root{--fs-accent:${s.accent};--fs-bg:${c.bg};--fs-surface:${c.surface};--fs-raised:${c.raised};--fs-overlay:${c.overlay};--fs-border:${c.border};--fs-text:${c.text};--fs-muted:${c.muted};--fs-subtle:${c.subtle};--fs-radius:${radius}px;
 background:${s.background ?? "transparent"};color:var(--fs-text);font-family:${c.fontFamily};letter-spacing:${c.tracking};
 padding:0;box-sizing:border-box;line-height:1.5;-webkit-font-smoothing:antialiased;
 container-type:inline-size;container-name:fs;display:block;width:100%;overflow:hidden}
.fs-root *{box-sizing:border-box}
.fs-frame{--fs-s:min(1, 100cqw / ${designWidth}px);width:100%}
.fs-zoom{zoom:var(--fs-s);width:${designWidth}px;margin:0 auto;padding:${s.padding}px 24px}
.fs-wrap{max-width:${s.maxWidth}px;margin:0 auto}
.fs-eyebrow{margin:0;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:${c.eyebrowColor};font-weight:${dense ? 500 : 600}}
.fs-heading{margin:14px 0 0;font-size:${dense ? 34 : 40}px;line-height:1.2;font-weight:600;letter-spacing:-.02em}

.fs-sub{margin:12px 0 0;font-size:${dense ? 15 : 16}px;color:var(--fs-muted);max-width:52ch}
.fs-center{text-align:center}
.fs-center .fs-sub{margin-left:auto;margin-right:auto}
.fs-grid{display:grid;gap:${dense ? 16 : 18}px;margin-top:${dense ? 40 : 44}px;grid-template-columns:repeat(${s.columns},minmax(0,1fr))}
.fs-card{background:var(--fs-surface);border:1px solid var(--fs-border);border-radius:var(--fs-radius);padding:${dense ? 20 : 24}px;text-align:left}
.fs-icon{display:inline-flex;align-items:center;justify-content:center;width:${dense ? 32 : 38}px;height:${dense ? 32 : 38}px;border-radius:${dense ? "8px" : "calc(var(--fs-radius) * .6)"};color:${dense ? "var(--fs-text)" : "var(--fs-accent)"};background:${dense ? "var(--fs-raised)" : "color-mix(in srgb, var(--fs-accent) 14%, transparent)"};border:1px solid ${dense ? "var(--fs-border)" : "color-mix(in srgb, var(--fs-accent) 26%, transparent)"};margin-bottom:16px}
.fs-item-title{margin:0;font-size:${dense ? 14 : 16}px;font-weight:${dense ? 500 : 600}}
.fs-item-body{margin:8px 0 0;font-size:${dense ? 13.5 : 14}px;color:var(--fs-muted);line-height:1.55}
.fs-cta{display:inline-flex;align-items:center;gap:8px;margin-top:28px;padding:${dense ? "9px 16px" : "11px 20px"};border-radius:${c.ctaRadius};background:${c.ctaBg};color:${c.ctaText};font-size:${dense ? 13.5 : 14}px;font-weight:500;text-decoration:none;transition:opacity .15s ease}
.fs-cta:hover{opacity:.85}
.fs-split{display:grid;gap:44px;grid-template-columns:1fr 1fr;align-items:start}
.fs-list{display:flex;flex-direction:column;gap:${dense ? 12 : 14}px}
.fs-row{display:flex;gap:16px;align-items:flex-start;background:var(--fs-surface);border:1px solid var(--fs-border);border-radius:var(--fs-radius);padding:${dense ? "16px 18px" : "18px 20px"};transition:${dense ? "border-color .15s ease" : "transform .2s ease,border-color .2s ease"}}
.fs-row:hover{${dense ? "border-color:var(--fs-subtle)" : "transform:translateY(-2px);border-color:color-mix(in srgb, var(--fs-accent) 45%, var(--fs-border))"}}
.fs-row .fs-icon{margin:0;flex:0 0 auto}
.fs-stats{display:grid;gap:${dense ? 0 : 20}px;margin-top:40px;grid-template-columns:repeat(${s.columns},minmax(0,1fr));border-top:1px solid var(--fs-border);padding-top:${dense ? 0 : 34}px}
.fs-stats>*{${dense ? "padding:20px 24px;border-right:1px solid var(--fs-border)" : ""}}
.fs-stats>*:last-child{${dense ? "border-right:0" : ""}}
.fs-stat-value{margin:0;font-size:${dense ? 34 : 46}px;font-weight:${dense ? 500 : 600};letter-spacing:-.03em;color:${c.statColor}}
.fs-stat-label{margin:${dense ? "6px" : "8px"} 0 0;font-size:${dense ? 12 : 13}px;color:var(--fs-muted)}
.fs-demo{margin-top:40px;position:relative}
.fs-panel{border:1px solid var(--fs-border);border-radius:var(--fs-radius);background:var(--fs-surface);overflow:hidden}
.fs-tabs{display:flex;overflow-x:auto;border-bottom:1px solid var(--fs-border)}
.fs-tab{flex:1 0 auto;padding:${dense ? "11px 18px" : "14px 22px"};font-size:${dense ? 13.5 : 14}px;color:var(--fs-muted);white-space:nowrap;border-right:1px solid var(--fs-border);background:${dense ? "transparent" : "color-mix(in srgb, var(--fs-text) 4%, transparent)"}}
.fs-tab:last-child{border-right:0}
.fs-tab.is-active{color:var(--fs-text);font-weight:500;background:${dense ? "var(--fs-raised)" : "transparent"};box-shadow:${dense ? "none" : "inset 0 -2px 0 var(--fs-accent)"}}
.fs-code{margin:0;padding:${dense ? "20px 22px" : "22px 24px"};overflow-x:auto;font-family:${c.monoFamily};font-size:${dense ? 13.5 : 13.5}px;line-height:${dense ? 1.7 : 2};background:${dense ? c.bg : "transparent"}}
.fs-line{display:flex;gap:20px;white-space:pre}
.fs-ln{color:var(--fs-subtle);user-select:none;min-width:1.4em;text-align:right}
.fs-t-key{color:${c.syntax.key}}
.fs-t-str{color:${c.syntax.str}}
.fs-t-fn{color:${c.syntax.fn}}
.fs-t-num{color:${c.syntax.num}}
.fs-t-com{color:${c.syntax.com};font-style:${c.syntax.comStyle}}
.fs-menu{position:absolute;left:2%;bottom:-96px;width:min(270px,62%);border:1px solid var(--fs-border);border-radius:${dense ? "12px" : "var(--fs-radius)"};background:var(--fs-overlay);box-shadow:${c.overlayShadow};overflow:hidden}
.fs-menu-search{display:flex;align-items:center;gap:10px;padding:${dense ? "12px 14px" : "14px 16px"};border-bottom:1px solid var(--fs-border);color:${dense ? "var(--fs-subtle)" : "var(--fs-muted)"};font-size:${dense ? 13.5 : 14}px}
.fs-menu-list{display:flex;flex-direction:column;padding:6px 0}
.fs-menu-row{display:flex;align-items:center;gap:12px;padding:${dense ? "8px 14px" : "9px 16px"};font-size:${dense ? 13.5 : 14}px;color:var(--fs-text)}
.fs-menu-row span.fs-dot{width:16px;height:16px;border-radius:${dense ? "50%" : "5px"};background:${dense ? "var(--fs-raised)" : "color-mix(in srgb, var(--fs-accent) 24%, transparent)"};border:1px solid ${dense ? "var(--fs-border)" : "color-mix(in srgb, var(--fs-accent) 45%, transparent)"};flex:0 0 auto}
.fs-menu-row.is-active{color:var(--fs-text)}
.fs-menu-row.is-active .fs-check{margin-left:auto;color:${dense ? "var(--fs-text)" : "var(--fs-accent)"}}
.fs-toggle-wrap{display:flex;align-items:center;justify-content:flex-end;gap:12px;margin-top:22px;font-size:${dense ? 13.5 : 15}px;color:var(--fs-muted)}
.fs-switch{width:${dense ? 34 : 44}px;height:${dense ? 20 : 24}px;border-radius:999px;background:var(--fs-accent);position:relative;flex:0 0 auto}
.fs-switch::after{content:"";position:absolute;top:${dense ? 2 : 3}px;right:${dense ? 2 : 3}px;width:${dense ? 16 : 18}px;height:${dense ? 16 : 18}px;border-radius:50%;background:#fff}
.fs-toggle-wrap strong{color:var(--fs-text);font-weight:500}
${
 isJb
   ? `
.fs-heading{font-weight:600;letter-spacing:-.01em;font-size:32px}
.fs-eyebrow{letter-spacing:.14em;color:var(--fs-muted)}
.fs-card,.fs-row,.fs-panel,.fs-menu{border-radius:6px;background:var(--fs-surface)}
.fs-icon{border-radius:4px;background:var(--fs-raised);border-color:var(--fs-border);color:var(--fs-text)}
.fs-tabs{background:var(--fs-surface)}
.fs-tab{border-right:0;padding:9px 16px}
.fs-tab.is-active{background:var(--fs-raised);color:var(--fs-text);box-shadow:inset 0 2px 0 ${s.accent}}
.fs-code{background:${c.bg};line-height:1.6}
.fs-menu{border-radius:8px}
.fs-menu-row{padding:7px 14px;border-radius:0}
.fs-menu-row.is-active{background:${s.accent};color:#fff}
.fs-menu-row.is-active .fs-dot{background:rgba(255,255,255,.28);border-color:rgba(255,255,255,.45)}
.fs-menu-row.is-active .fs-check{color:#fff}
.fs-cta{border-radius:4px;font-weight:500}
.fs-switch{background:${s.accent}}
.fs-stats>*{border-right:1px solid var(--fs-border)}
`
   : ""
}
${
 isLg
   ? `
.fs-heading{font-weight:640;letter-spacing:-.025em;font-size:42px}
.fs-eyebrow{letter-spacing:.14em;font-weight:590;color:var(--fs-muted)}
.fs-sub{font-size:17px;color:var(--fs-muted)}
.fs-card,.fs-row,.fs-panel,.fs-menu{
 background:var(--fs-surface);
 border:1px solid var(--fs-border);
 border-radius:var(--fs-radius);
 backdrop-filter:blur(28px) saturate(180%);
 box-shadow:inset 0 1px 0 rgba(255,255,255,.45),inset 0 -1px 0 rgba(255,255,255,.14),0 18px 40px -22px rgba(0,0,0,.55)}
.fs-card,.fs-row{padding:24px 26px}
.fs-icon{width:44px;height:44px;border-radius:999px;color:var(--fs-text);
 background:var(--fs-raised);border:1px solid var(--fs-border);
 backdrop-filter:blur(18px) saturate(180%);
 box-shadow:inset 0 1px 0 rgba(255,255,255,.5)}
.fs-cta{border-radius:999px;padding:12px 22px;font-weight:590;
 background:var(--fs-surface);border:1px solid var(--fs-border);color:var(--fs-text);
 backdrop-filter:blur(24px) saturate(180%);
 box-shadow:inset 0 1px 0 rgba(255,255,255,.5),0 10px 24px -14px rgba(0,0,0,.6);
 transition:transform .28s cubic-bezier(.32,.72,0,1),background .28s ease}
.fs-cta:hover{opacity:1;transform:scale(1.03);background:var(--fs-raised)}
.fs-tabs{border-bottom:1px solid var(--fs-border);padding:8px;gap:6px;background:transparent}
.fs-tab{border-right:0;padding:9px 18px;border-radius:999px;flex:0 0 auto;font-weight:510}
.fs-tab.is-active{background:var(--fs-raised);color:var(--fs-text);box-shadow:inset 0 1px 0 rgba(255,255,255,.45)}
.fs-code{background:var(--fs-bg);line-height:1.75}
.fs-menu{border-radius:22px;background:var(--fs-overlay);backdrop-filter:blur(34px) saturate(180%)}
.fs-menu-search{border-bottom:1px solid var(--fs-border)}
.fs-menu-list{padding:8px}
.fs-menu-row{padding:9px 12px;border-radius:999px}
.fs-menu-row.is-active{background:var(--fs-raised);box-shadow:inset 0 1px 0 rgba(255,255,255,.4)}
.fs-menu-row .fs-dot{border-radius:999px;background:var(--fs-raised);border-color:var(--fs-border)}
.fs-switch{background:${s.accent};box-shadow:inset 0 1px 2px rgba(0,0,0,.35)}
.fs-stats{gap:16px;border-top:0;padding-top:0}
.fs-stats>*{padding:24px 26px;border-right:0;background:var(--fs-surface);
 border:1px solid var(--fs-border);border-radius:var(--fs-radius);
 backdrop-filter:blur(28px) saturate(180%);
 box-shadow:inset 0 1px 0 rgba(255,255,255,.45)}
.fs-stat-value{font-weight:640;letter-spacing:-.03em}
`
   : ""
}
${
  snippet.template === "contest-ranking"
    ? `
.fs-root{min-height:100vh}
.fs-frame,.fs-zoom{width:100%;max-width:none;padding:0;margin:0}
${leaderboardStyles(snippet, c, radius)}`
    : snippet.template === "problems-hub"
      ? `
.fs-root{min-height:100vh}
.fs-frame,.fs-zoom{width:100%;max-width:none;padding:0;margin:0}
${problemsHubStyles(snippet, radius)}`
      : snippet.template === "code-playground"
        ? `
.fs-root{min-height:100vh}
.fs-frame,.fs-zoom{width:100%;max-width:none;padding:0;margin:0}
${playgroundStyles(snippet, radius, c.monoFamily, c.syntax)}`
        : snippet.template === "roadmaps"
          ? `
.fs-root{min-height:100vh}
.fs-frame,.fs-zoom{width:100%;max-width:none;padding:0;margin:0}
${roadmapsStyles(snippet, radius)}`
          : ""
}
`.trim();
}

function leaderboardSemantics(s: Snippet["style"]): { success: string; danger: string } {
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

function leaderboardStyles(
  snippet: Snippet,
  c: Theme,
  radius: number,
): string {
  const s = snippet.style;
  const preset = s.preset ?? "studio";
  const sem = leaderboardSemantics(s);
  const isVercel = preset === "vercel";
  const isJb = preset === "jetbrains";
  const isLg = preset === "liquidglass";
  const controlRadius = isJb ? "4px" : isLg ? "999px" : isVercel ? "8px" : `${Math.max(6, Math.round(radius * 0.55))}px`;
  const panelRadius = isJb ? "6px" : isLg ? `${Math.max(22, radius)}px` : isVercel ? "12px" : `${radius}px`;

  const base = `
.fs-lb{
 --fs-lb-success:${sem.success};--fs-lb-danger:${sem.danger};
 --fs-lb-panel-r:${panelRadius};--fs-lb-control-r:${controlRadius};
 display:flex;min-height:100vh;background:var(--fs-bg);color:var(--fs-text);
 font-family:${c.fontFamily};letter-spacing:${c.tracking};font-size:13px}
.fs-lb-side{width:52px;flex:0 0 52px;display:flex;flex-direction:column;align-items:center;padding:16px 0;gap:20px;
 border-right:1px solid var(--fs-border);background:var(--fs-surface)}
.fs-lb-logo{width:28px;height:28px;display:flex;align-items:center;justify-content:center;flex:0 0 auto;background:transparent;border:0;padding:0}
.fs-lb-logo img{width:100%;height:100%;object-fit:contain;display:block}
.fs-lb-nav{display:flex;flex-direction:column;align-items:center;gap:8px;margin-top:8px}
.fs-lb-nav-btn{width:36px;height:36px;border-radius:var(--fs-lb-control-r);display:flex;align-items:center;justify-content:center;
 color:var(--fs-subtle);border:0;background:transparent}
.fs-lb-nav-btn.is-active{background:var(--fs-raised);color:var(--fs-text)}
.fs-lb-main{flex:1;min-width:0;padding:20px 24px 32px;background:var(--fs-bg)}
.fs-lb-crumb{display:flex;align-items:center;gap:8px;color:var(--fs-muted);font-size:13px;margin-bottom:20px}
.fs-lb-crumb span{color:var(--fs-subtle)}
.fs-lb-crumb strong{color:var(--fs-text);font-weight:500}
.fs-lb-card{background:var(--fs-surface);border:1px solid var(--fs-border);border-radius:var(--fs-lb-panel-r);overflow:hidden}
.fs-lb-tabs{display:flex;border-bottom:1px solid var(--fs-border);padding:0 8px;background:var(--fs-surface)}
.fs-lb-tab{padding:14px 16px;font-size:13px;color:var(--fs-muted);border-bottom:2px solid transparent;margin-bottom:-1px;cursor:default}
.fs-lb-tab.is-active{color:var(--fs-text);font-weight:500}
.fs-lb-table-wrap{overflow-x:auto;background:var(--fs-bg)}
.fs-lb-table{width:100%;border-collapse:collapse;table-layout:fixed;border-spacing:0}
.fs-lb-table thead th,.fs-lb-table tbody td{padding:0 12px;text-align:center;vertical-align:middle}
.fs-lb-table thead th{font-size:10px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:var(--fs-muted);
 padding-top:14px;padding-bottom:14px;background:var(--fs-surface);border-bottom:1px solid var(--fs-border)}
.fs-lb-table tbody tr{border-bottom:1px solid var(--fs-border)}
.fs-lb-table tbody td{border:0;height:44px}
.fs-lb-table th.fs-lb-th-participant,.fs-lb-table td.fs-lb-participant{text-align:left}
.fs-lb-table th.fs-lb-th-score,.fs-lb-table td.fs-lb-score{text-align:left}
.fs-lb-th-prob{font-size:11px;line-height:1.3}
.fs-lb-th-prob small{display:block;font-size:10px;color:var(--fs-subtle);font-weight:400;margin-top:2px}
.fs-lb-rank{color:var(--fs-subtle);font-variant-numeric:tabular-nums}
.fs-lb-participant{text-align:left}
.fs-lb-participant-inner{display:inline-flex;align-items:center;gap:8px;max-width:100%;vertical-align:middle}
.fs-lb-handle{font-weight:500;white-space:nowrap;line-height:1.2;color:var(--fs-text)}
.fs-lb-flag{font-size:14px;line-height:1;flex:0 0 auto}
.fs-lb-score{font-size:15px;font-weight:600;font-variant-numeric:tabular-nums;color:var(--fs-text);line-height:1.2}
.fs-lb-cell{display:flex;flex-direction:column;align-items:center;justify-content:center;height:44px;line-height:1.2;box-sizing:border-box;font-variant-numeric:tabular-nums}
.fs-lb-cell.is-left{align-items:flex-start}
.fs-lb-solved{color:var(--fs-lb-success);font-weight:500;font-size:13px;line-height:1.2;min-height:16px}
.fs-lb-time{color:var(--fs-subtle);font-size:11px;line-height:1.2;min-height:14px}
.fs-lb-penalty{color:var(--fs-lb-danger);font-size:11px;margin-right:4px}
.fs-lb-failed{color:var(--fs-lb-danger);font-weight:500;line-height:1.2}
.fs-lb-empty{color:var(--fs-subtle);line-height:1.2}
.fs-lb-delta{font-variant-numeric:tabular-nums;font-weight:500;line-height:1.2}
.fs-lb-delta.pos{color:var(--fs-lb-success)}
.fs-lb-delta.neg{color:var(--fs-lb-danger)}`;

  if (isVercel) {
    return `${base}
.fs-lb-tab.is-active{border-bottom-color:var(--fs-text)}
.fs-lb-nav-btn.is-active{background:var(--fs-raised)}`.trim();
  }

  if (isJb) {
    return `${base}
.fs-lb-tabs{padding:0}
.fs-lb-tab{border-bottom:0;border-top:2px solid transparent;padding:9px 16px}
.fs-lb-tab.is-active{background:var(--fs-raised);border-top-color:var(--fs-accent);color:var(--fs-text)}
.fs-lb-nav-btn.is-active{background:var(--fs-accent);color:#fff}
.fs-lb-table th{letter-spacing:.14em}`.trim();
  }

  if (isLg) {
    return `${base}
.fs-lb-card,.fs-lb-side{
 background:var(--fs-surface);backdrop-filter:blur(28px) saturate(180%);
 box-shadow:inset 0 1px 0 rgba(255,255,255,.45),inset 0 -1px 0 rgba(255,255,255,.14),0 18px 40px -22px rgba(0,0,0,.55)}
.fs-lb-tabs{border-bottom:1px solid var(--fs-border);padding:8px;gap:6px;background:transparent}
.fs-lb-tab{border-bottom:0;padding:9px 18px;border-radius:999px;flex:0 0 auto}
.fs-lb-tab.is-active{background:var(--fs-raised);box-shadow:inset 0 1px 0 rgba(255,255,255,.45)}
.fs-lb-nav-btn.is-active{background:var(--fs-raised);box-shadow:inset 0 1px 0 rgba(255,255,255,.45)}
.fs-lb-table-wrap{background:transparent}
.fs-lb-table th{background:transparent}`.trim();
  }

  return `${base}
.fs-lb-tab.is-active{border-bottom-color:var(--fs-accent)}
.fs-lb-nav-btn.is-active{background:color-mix(in srgb,var(--fs-accent) 14%,transparent);color:var(--fs-accent)}`.trim();
}

function renderProblemCell(cell: ProblemCell): string {
  if (cell.kind === "empty") {
    return `<div class="fs-lb-cell"><div class="fs-lb-solved fs-lb-empty">—</div><div class="fs-lb-time">&nbsp;</div></div>`;
  }
  if (cell.kind === "failed") {
    return `<div class="fs-lb-cell"><div class="fs-lb-solved fs-lb-failed">-${cell.attempts}</div><div class="fs-lb-time">&nbsp;</div></div>`;
  }
  const penalty = cell.penalty
    ? `<span class="fs-lb-penalty">+${cell.penalty}</span>`
    : "";
  return `<div class="fs-lb-cell">
    <div class="fs-lb-solved">${penalty}${cell.points}</div>
    <div class="fs-lb-time">${esc(cell.time)}</div>
  </div>`;
}

function renderLeaderboardRow(entry: LeaderboardEntry): string {
  const deltaCls = entry.delta >= 0 ? "pos" : "neg";
  const deltaText = entry.delta >= 0 ? `+${entry.delta}` : `${entry.delta}`;
  return `<tr>
    <td class="fs-lb-rank"><div class="fs-lb-cell">${entry.rank}</div></td>
    <td class="fs-lb-participant">
      <div class="fs-lb-cell is-left">
        <span class="fs-lb-participant-inner">
          <span class="fs-lb-flag">${entry.flag}</span>
          <span class="fs-lb-handle">${esc(entry.handle)}</span>
        </span>
      </div>
    </td>
    <td class="fs-lb-score"><div class="fs-lb-cell is-left"><span class="fs-lb-score">${entry.score}</span></div></td>
    ${entry.cells.map((cell) => `<td>${renderProblemCell(cell)}</td>`).join("")}
    <td><div class="fs-lb-cell"><span class="fs-lb-delta ${deltaCls}">${deltaText}</span></div></td>
  </tr>`;
}

function contestRanking(snippet: Snippet): string {
  const problems = snippet.contestProblems ?? [];
  const entries = snippet.leaderboardEntries ?? [];
  const crumbs = snippet.breadcrumbs ?? ["Contests", "Premier Round 7", "Ranking"];
  const tabs = visible(snippet, "items") ? snippet.items : [];
  const breadcrumbHtml = crumbs
    .map((part, i) =>
      i === crumbs.length - 1
        ? `<strong>${esc(part)}</strong>`
        : `${esc(part)}<span>›</span>`,
    )
    .join("");

  const ICON_CMD =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/></svg>';
  const ICON_TROPHY =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>';
  const ICON_CLOCK =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>';
  const ICON_CHAT =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';

  return `<div class="fs-lb">
    <aside class="fs-lb-side">
      <div class="fs-lb-logo"><img src="${REPOVIVE_LOGO_SRC}" width="28" height="28" alt="Repovive"></div>
      <nav class="fs-lb-nav">
        <button type="button" class="fs-lb-nav-btn">${ICON_CMD}</button>
        <button type="button" class="fs-lb-nav-btn is-active">${ICON_TROPHY}</button>
        <button type="button" class="fs-lb-nav-btn">${ICON_CLOCK}</button>
        <button type="button" class="fs-lb-nav-btn">${ICON_CHAT}</button>
      </nav>
    </aside>
    <div class="fs-lb-main">
      <nav class="fs-lb-crumb">${breadcrumbHtml}</nav>
      <div class="fs-lb-card">
        ${
          tabs.length
            ? `<div class="fs-lb-tabs">
          ${tabs
            .map(
              (tab, i) =>
                `<div class="fs-lb-tab${i === 0 ? " is-active" : ""}">${esc(tab.title)}</div>`,
            )
            .join("")}
        </div>`
            : ""
        }
        <div class="fs-lb-table-wrap">
          <table class="fs-lb-table">
            <thead>
              <tr>
                <th style="width:36px">#</th>
                <th class="fs-lb-th-participant" style="width:160px">Participant</th>
                <th class="fs-lb-th-score" style="width:72px">Score</th>
                ${problems
                  .map(
                    (p) =>
                      `<th class="fs-lb-th-prob" style="width:64px">${esc(p.letter)}<small>${p.points}</small></th>`,
                  )
                  .join("")}
                <th style="width:64px">Δ Delta</th>
              </tr>
            </thead>
            <tbody>
              ${entries.map(renderLeaderboardRow).join("")}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>`;
}


function header(snippet: Snippet, center: boolean): string {
 const cls = center ? "fs-head fs-center" : "fs-head";
 return `<div class="${cls}">
     ${snippet.eyebrow && visible(snippet, "eyebrow") ? `<p class="fs-eyebrow">${esc(snippet.eyebrow)}</p>` : ""}
     ${snippet.heading && visible(snippet, "heading") ? `<h2 class="fs-heading">${esc(snippet.heading)}</h2>` : ""}
     ${snippet.subheading && visible(snippet, "subheading") ? `<p class="fs-sub">${esc(snippet.subheading)}</p>` : ""}
   </div>`;
}

function cta(snippet: Snippet): string {
 if (!snippet.ctaLabel || !visible(snippet, "cta")) return "";
 const href = snippet.ctaHref || "#";
 return `<a class="fs-cta" href="${esc(href)}">${esc(snippet.ctaLabel)}<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg></a>`;
}


function icon(snippet: Snippet, key: SnippetIconArg): string {
 if (!snippet.style.showIcons) return "";
 return `<span class="fs-icon">${iconSvg(key)}</span>`;
}

type SnippetIconArg = Snippet["items"][number]["icon"];

const CODE_KEYWORDS = [
 "import","from","export","const","let","var","await","async","function","return","new","class","if","else","for","while","of","in","try","catch","typeof",
];

function tag(cls: string, text: string): string {
 return `<span class="${cls}">${esc(text)}</span>`;
}

/** Single-pass tokenizer so inserted markup is never re-scanned. */
function highlightLine(line: string): string {
 let out = "";
 let i = 0;
 while (i < line.length) {
   const rest = line.slice(i);
   const comment = rest.match(/^\/\/.*/);
   if (comment) {
     out += tag("fs-t-com", comment[0]);
     break;
   }
   const str = rest.match(/^(['"`])(?:\\.|(?!\1)[^\\])*\1?/);
   if (str) {
     out += tag("fs-t-str", str[0]);
     i += str[0].length;
     continue;
   }
   const num = rest.match(/^\d+(?:\.\d+)?/);
   if (num) {
     out += tag("fs-t-num", num[0]);
     i += num[0].length;
     continue;
   }
   const word = rest.match(/^[A-Za-z_$][\w$]*/);
   if (word) {
     const w = word[0];
     const isCall = /^\s*\(/.test(rest.slice(w.length));
     out += CODE_KEYWORDS.includes(w)
       ? tag("fs-t-key", w)
       : isCall
         ? tag("fs-t-fn", w)
         : esc(w);
     i += w.length;
     continue;
   }
   out += esc(line[i]!);
   i += 1;
 }
 return out;
}

function highlightCode(code: string): string {
 return code
   .split("\n")
   .map(
     (line, i) =>
       `<div class="fs-line"><span class="fs-ln">${i + 1}</span><span>${highlightLine(line) || " "}</span></div>`,
   )
   .join("");
}

const CHECK_SVG =
 '<svg class="fs-check" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m4 12 5 5L20 6"/></svg>';
const SEARCH_SVG =
 '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/></svg>';

function codeDemo(snippet: Snippet): string {
 const menu = visible(snippet, "menu") ? (snippet.menuItems ?? []) : [];
 const showTabs = visible(snippet, "items") && snippet.items.length > 0;
 const showCode = visible(snippet, "code");
 return `<div class="fs-wrap">
     ${header(snippet, false)}
     <div class="fs-demo">
       ${
         showTabs || showCode
           ? `<div class="fs-panel">
         ${
           showTabs
             ? `<div class="fs-tabs">
           ${snippet.items
             .map(
               (item, i) =>
                 `<div class="fs-tab${i === 0 ? " is-active" : ""}">${esc(item.title)}</div>`,
             )
             .join("")}
         </div>`
             : ""
         }
         ${showCode ? `<div class="fs-code">${highlightCode(snippet.code ?? "")}</div>` : ""}
       </div>`
           : ""
       }
       ${
         menu.length
           ? `<div class="fs-menu">
         <div class="fs-menu-search">${SEARCH_SVG}<span>Search models…</span></div>
         <div class="fs-menu-list">
           ${menu
             .map(
               (label, i) =>
                 `<div class="fs-menu-row${i === 0 ? " is-active" : ""}"><span class="fs-dot"></span>${esc(label)}${i === 0 ? CHECK_SVG : ""}</div>`,
             )
             .join("")}
         </div>
       </div>`
           : ""
       }
     </div>
     ${
       snippet.toggleLabel && visible(snippet, "toggle")
         ? `<div class="fs-toggle-wrap"><span class="fs-switch"></span><strong>${esc(snippet.toggleLabel)}</strong></div>`
         : ""
     }
     ${cta(snippet)}
   </div>`;
}


function body(snippet: Snippet): string {
 if (snippet.template === "code-playground") return renderPlayground(snippet);
 if (snippet.template === "roadmaps") return renderRoadmaps(snippet);
 if (snippet.template === "problems-hub") return renderProblemsHub(snippet);
 if (snippet.template === "contest-ranking") return contestRanking(snippet);
 if (snippet.template === "code-demo") return codeDemo(snippet);
 const showItems = visible(snippet, "items");

 if (snippet.template === "stat-row") {
   return `<div class="fs-wrap">
     ${header(snippet, false)}
     ${
       showItems
         ? `<div class="fs-stats">
       ${snippet.items
         .map(
           (item) => `<div>
         <p class="fs-stat-value">${esc(item.title)}</p>
         <p class="fs-stat-label">${esc(item.body)}</p>
       </div>`,
         )
         .join("\n        ")}
     </div>`
         : ""
     }
     ${cta(snippet)}
   </div>`;
 }

 if (snippet.template === "feature-split") {
   return `<div class="fs-wrap">
     <div class="fs-split">
       <div>
         ${header(snippet, false)}
         ${cta(snippet)}
       </div>
       ${
         showItems
           ? `<div class="fs-list">
         ${snippet.items
           .map(
             (item) => `<div class="fs-row">
           ${icon(snippet, item.icon)}
           <div>
             <p class="fs-item-title">${esc(item.title)}</p>
             <p class="fs-item-body">${esc(item.body)}</p>
           </div>
         </div>`,
           )
           .join("\n          ")}
       </div>`
           : ""
       }
     </div>
   </div>`;
 }

 return `<div class="fs-wrap">
     ${header(snippet, true)}
     ${
       showItems
         ? `<div class="fs-grid">
       ${snippet.items
         .map(
           (item) => `<div class="fs-card">
         ${icon(snippet, item.icon)}
         <p class="fs-item-title">${esc(item.title)}</p>
         <p class="fs-item-body">${esc(item.body)}</p>
       </div>`,
         )
         .join("\n        ")}
     </div>`
         : ""
     }
     <div class="fs-center">${cta(snippet)}</div>
   </div>`;
}


/** The snippet markup on its own, for pasting into an existing page. */
export function renderSnippetFragment(snippet: Snippet): string {
 return `<style>\n${styleSheet(snippet)}\n</style>\n<section class="fs-root">\n  <div class="fs-frame"><div class="fs-zoom">\n  ${body(snippet)}\n  </div></div>\n</section>`;
}

/** A complete, self-contained HTML document. */
export function renderSnippetDocument(
 snippet: Snippet,
 options?: { transparentPage?: boolean },
): string {
 const page = options?.transparentPage ? "transparent" : (snippet.style.background ?? "transparent");
 return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(snippet.name || "Feature showcase")}</title>
<style>
html,body{margin:0;padding:0;background:${page}}
.fs-root{min-height:100vh}
${styleSheet(snippet)}
</style>
</head>
<body>
<section class="fs-root">
 <div class="fs-frame"><div class="fs-zoom">
 ${body(snippet)}
 </div></div>
</section>
</body>
</html>`;
}

export function downloadFile(name: string, mime: string, content: string) {
 const blob = new Blob([content], { type: mime });
 const url = URL.createObjectURL(blob);
 const a = document.createElement("a");
 a.href = url;
 a.download = name;
 a.click();
 URL.revokeObjectURL(url);
}

export function slugify(value: string): string {
 return (
   value
     .toLowerCase()
     .replace(/[^a-z0-9]+/g, "-")
     .replace(/^-|-$/g, "") || "snippet"
 );
}
