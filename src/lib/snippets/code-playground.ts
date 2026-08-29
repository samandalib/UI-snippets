import {
  BINARY_EXP_LANGUAGES,
  BINARY_EXP_STDIN,
  BINARY_EXP_STDOUT,
} from "./binary-exp";
import type { Snippet } from "./types";

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const ICON_EXPAND =
  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>';
const ICON_CODE =
  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>';
const ICON_TERM =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>';
const ICON_KEYS =
  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M7 16h10"/></svg>';
const ICON_MORE =
  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/></svg>';
const ICON_PLAY =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
const ICON_CHEVRON =
  '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>';

const KEYWORDS = new Set([
  "import", "from", "export", "const", "let", "var", "await", "async", "function", "fun", "fn", "func",
  "return", "new", "class", "struct", "enum", "if", "else", "elif", "for", "while", "of", "in", "try",
  "catch", "typeof", "using", "namespace", "public", "private", "static", "void", "int", "long", "bool",
  "char", "double", "float", "string", "def", "and", "or", "not", "package", "use", "mod", "mut",
  "where", "case", "do", "then", "otherwise", "type", "data", "as", "is", "this", "self", "true", "false",
  "null", "None", "True", "False", "nil", "undefined", "break", "continue", "switch", "match", "when",
  "val", "override", "virtual", "template", "typename", "auto", "unsigned", "signed", "sizeof",
  "i32", "i64", "u32", "u64", "usize", "int64", "uint", "Integer", "Long", "UInt64", "bigint",
]);

function tag(cls: string, text: string): string {
  return `<span class="${cls}">${esc(text)}</span>`;
}

function highlightLine(line: string): string {
  const trimmed = line.match(/^(\s*)(.*)$/);
  const indent = trimmed?.[1] ?? "";
  const body = trimmed?.[2] ?? line;
  if (/^#\s*include\b/.test(body)) {
    const m = body.match(/^(#\s*include\b)(\s*)(<[^>]+>)?(.*)$/);
    if (m) {
      return (
        esc(indent) +
        tag("fs-pg-t-key", m[1]) +
        esc(m[2]) +
        (m[3] ? tag("fs-pg-t-str", m[3]) : "") +
        (m[4] ? esc(m[4]) : "")
      );
    }
  }
  if (/^#(?!!)/.test(body) || /^--/.test(body) || body.startsWith("//")) {
    return esc(indent) + tag("fs-pg-t-com", body);
  }

  let out = esc(indent);
  let i = 0;
  while (i < body.length) {
    const rest = body.slice(i);
    const comment = rest.match(/^\/\/.*/) || rest.match(/^#(?!\{).*/) || rest.match(/^--.*/);
    if (comment && (rest.startsWith("//") || rest.startsWith("--") || (rest.startsWith("#") && !rest.startsWith("#include")))) {
      out += tag("fs-pg-t-com", comment[0]);
      break;
    }
    const str = rest.match(/^(['"`])(?:\\.|(?!\1)[^\\])*\1?/);
    if (str) {
      out += tag("fs-pg-t-str", str[0]);
      i += str[0].length;
      continue;
    }
    const header = rest.match(/^<[\w./]+>/);
    if (header) {
      out += tag("fs-pg-t-str", header[0]);
      i += header[0].length;
      continue;
    }
    const num = rest.match(/^\d+(?:\.\d+)?(?:n|L|LL|u64|i64)?/);
    if (num) {
      out += tag("fs-pg-t-num", num[0]);
      i += num[0].length;
      continue;
    }
    const word = rest.match(/^[$A-Za-z_][\w$]*/);
    if (word) {
      const w = word[0];
      const isCall = /^\s*\(/.test(rest.slice(w.length));
      out += KEYWORDS.has(w)
        ? tag("fs-pg-t-key", w)
        : isCall
          ? tag("fs-pg-t-fn", w)
          : esc(w);
      i += w.length;
      continue;
    }
    out += esc(body[i]!);
    i += 1;
  }
  return out;
}

function editorLines(code: string): string {
  const lines = code.length ? code.split("\n") : [""];
  return lines
    .map(
      (line, i) =>
        `<div class="fs-pg-line"><span class="fs-pg-ln">${i + 1}</span><span class="fs-pg-src">${highlightLine(line) || " "}</span></div>`,
    )
    .join("");
}

export type PlaygroundSyntax = {
  key: string;
  str: string;
  fn: string;
  num: string;
  com: string;
  comStyle: string;
};

export function playgroundStyles(
  snippet: Snippet,
  radius: number,
  monoFamily: string,
  syntax: PlaygroundSyntax,
): string {
  const preset = snippet.style.preset ?? "studio";
  const isVercel = preset === "vercel";
  const isJb = preset === "jetbrains";
  const isLg = preset === "liquidglass";
  const controlR = isJb ? "4px" : isLg ? "999px" : isVercel ? "8px" : `${Math.max(6, Math.round(radius * 0.55))}px`;

  const extra = isJb
    ? `.fs-pg-run{background:var(--fs-accent);color:#fff}
.fs-pg-lang-btn{border-radius:4px}`
    : isLg
      ? `.fs-pg-shell{backdrop-filter:blur(28px) saturate(180%)}
.fs-pg-run{border-radius:999px}`
      : isVercel
        ? `.fs-pg-run{background:var(--fs-text);color:var(--fs-bg)}`
        : `.fs-pg-run{background:var(--fs-accent);color:var(--fs-bg)}`;

  const langShow = BINARY_EXP_LANGUAGES.map(
    (_, i) =>
      `#fs-pg-lang-${i}:checked ~ .fs-pg-shell .fs-pg-code-${i}{display:block}
#fs-pg-lang-${i}:checked ~ .fs-pg-shell .fs-pg-lang-cur-${i}{display:inline}
#fs-pg-lang-${i}:checked ~ .fs-pg-shell label[for="fs-pg-lang-${i}"]{color:${isJb ? "#fff" : "var(--fs-text)"};background:${isJb ? "var(--fs-accent)" : "var(--fs-raised)"}}`,
  ).join("\n");

  return `
.fs-pg-sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}
.fs-pg-shell{position:relative;min-height:100vh;background:var(--fs-bg);color:var(--fs-text);display:flex;flex-direction:column}
.fs-pg-bar{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 14px;border-bottom:1px solid var(--fs-border);background:var(--fs-surface)}
.fs-pg-left,.fs-pg-right{display:flex;align-items:center;gap:10px;min-width:0}
.fs-pg-iconbtn{width:32px;height:32px;display:inline-flex;align-items:center;justify-content:center;border-radius:${controlR};color:var(--fs-muted);background:transparent;border:0;cursor:pointer}
.fs-pg-iconbtn:hover{color:var(--fs-text);background:var(--fs-raised)}
.fs-pg-editor-label{display:inline-flex;align-items:center;gap:8px;font-size:13px;font-weight:500}
.fs-pg-toggle{display:inline-flex;align-items:center;gap:8px;font-size:12px;color:var(--fs-muted);cursor:pointer;user-select:none}
.fs-pg-switch{width:34px;height:20px;border-radius:999px;background:var(--fs-raised);border:1px solid var(--fs-border);position:relative;flex:0 0 auto}
.fs-pg-switch::after{content:"";position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;background:var(--fs-muted);transition:transform .15s ease}
#fs-pg-io:checked ~ .fs-pg-shell .fs-pg-switch{background:var(--fs-accent);border-color:transparent}
#fs-pg-io:checked ~ .fs-pg-shell .fs-pg-switch::after{transform:translateX(14px);background:#fff}
#fs-pg-io:not(:checked) ~ .fs-pg-shell .fs-pg-io{display:none}
#fs-pg-io:not(:checked) ~ .fs-pg-shell .fs-pg-editor{flex:1}
.fs-pg-lang{position:relative;outline:none}
.fs-pg-lang-btn{list-style:none;display:inline-flex;align-items:center;gap:8px;padding:6px 10px;border:1px solid var(--fs-border);border-radius:${controlR};background:var(--fs-raised);font-size:12px;cursor:pointer;color:var(--fs-text);min-width:128px}
.fs-pg-lang-cur span{display:none}
.fs-pg-lang-menu{display:none;position:absolute;top:calc(100% + 6px);left:0;min-width:180px;max-height:280px;overflow:auto;z-index:3;background:var(--fs-overlay);border:1px solid var(--fs-border);border-radius:${controlR};padding:4px;box-shadow:0 8px 30px rgba(0,0,0,.45)}
.fs-pg-lang:focus-within .fs-pg-lang-menu{display:block}
.fs-pg-lang-menu label{display:block;padding:7px 10px;border-radius:6px;font-size:12px;color:var(--fs-muted);cursor:pointer}
.fs-pg-lang-menu label:hover{background:var(--fs-raised);color:var(--fs-text)}
.fs-pg-run{display:inline-flex;align-items:center;gap:8px;padding:8px 14px;border:0;border-radius:${controlR};font-size:13px;font-weight:500;cursor:pointer}
.fs-pg-run:hover{opacity:.9}
.fs-pg-body{display:flex;flex:1;min-height:0}
.fs-pg-editor{flex:1.4;min-width:0;display:flex;flex-direction:column;background:var(--fs-bg);border-right:1px solid var(--fs-border)}
.fs-pg-code{display:none;flex:1;margin:0;padding:16px 0;overflow:auto;font-family:${monoFamily};font-size:13.5px;line-height:1.7}
.fs-pg-line{display:flex;gap:18px;padding:0 18px;white-space:pre}
.fs-pg-ln{color:var(--fs-subtle);user-select:none;min-width:1.6em;text-align:right}
.fs-pg-src{color:var(--fs-text)}
.fs-pg-t-key{color:${syntax.key}}
.fs-pg-t-str{color:${syntax.str}}
.fs-pg-t-fn{color:${syntax.fn}}
.fs-pg-t-num{color:${syntax.num}}
.fs-pg-t-com{color:${syntax.com};font-style:${syntax.comStyle}}
.fs-pg-io{flex:0 0 340px;width:340px;display:flex;flex-direction:column;background:var(--fs-surface)}
.fs-pg-pane{flex:1;min-height:0;display:flex;flex-direction:column;border-bottom:1px solid var(--fs-border)}
.fs-pg-pane:last-child{border-bottom:0}
.fs-pg-pane-h{display:flex;align-items:center;gap:8px;padding:10px 14px;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--fs-muted);border-bottom:1px solid var(--fs-border)}
.fs-pg-pane textarea{flex:1;margin:0;padding:14px;border:0;resize:none;background:transparent;color:var(--fs-text);font-family:${monoFamily};font-size:13px;line-height:1.6;outline:none}
.fs-pg-pane textarea::placeholder{color:var(--fs-subtle)}
.fs-pg-empty{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;color:var(--fs-subtle);font-family:${monoFamily};font-size:12px;text-align:center}
.fs-pg-empty svg{opacity:.5}
.fs-pg-result{display:none;flex:1;margin:0;padding:14px;font-family:${monoFamily};font-size:13px;line-height:1.6;color:${syntax.str};white-space:pre-wrap}
#fs-pg-run:checked ~ .fs-pg-shell .fs-pg-empty{display:none}
#fs-pg-run:checked ~ .fs-pg-shell .fs-pg-result{display:block}
#fs-pg-run:checked ~ .fs-pg-shell .fs-pg-run span:last-child{display:none}
#fs-pg-run:checked ~ .fs-pg-shell .fs-pg-run::after{content:"Ran"}
${langShow}
${extra}
`.trim();
}

const DEFAULT_LANG = BINARY_EXP_LANGUAGES.findIndex((l) => l.id === "python");

export function renderPlayground(snippet: Snippet): string {
  const langs = BINARY_EXP_LANGUAGES;
  const defaultIdx = DEFAULT_LANG >= 0 ? DEFAULT_LANG : 0;
  const runLabel = snippet.ctaLabel || "Run";
  const toggle = snippet.toggleLabel || "stdin/stdout";
  const showIo = snippet.hidden?.toggle !== true;
  const showCode = snippet.hidden?.code !== true;

  const langRows = langs
    .map((lang, i) => `<label for="fs-pg-lang-${i}">${esc(lang.label)}</label>`)
    .join("");
  const langRadios = langs
    .map(
      (_, i) =>
        `<input class="fs-pg-sr" type="radio" name="fs-pg-lang" id="fs-pg-lang-${i}"${i === defaultIdx ? " checked" : ""}>`,
    )
    .join("");
  const langCurrent = langs
    .map((lang, i) => `<span class="fs-pg-lang-cur-${i}">${esc(lang.label)}</span>`)
    .join("");
  const codePanels = langs
    .map(
      (lang, i) =>
        `<div class="fs-pg-code fs-pg-code-${i}">${editorLines(lang.code)}</div>`,
    )
    .join("");

  return `${langRadios}
<input class="fs-pg-sr" type="checkbox" id="fs-pg-io"${showIo ? " checked" : ""}>
<input class="fs-pg-sr" type="checkbox" id="fs-pg-run">
<div class="fs-pg-shell">
  <header class="fs-pg-bar">
    <div class="fs-pg-left">
      <span class="fs-pg-iconbtn" title="Expand">${ICON_EXPAND}</span>
      <span class="fs-pg-editor-label">${ICON_CODE} Editor</span>
      ${
        showIo
          ? `<label class="fs-pg-toggle" for="fs-pg-io"><span class="fs-pg-switch"></span>${esc(toggle)}</label>`
          : ""
      }
      <div class="fs-pg-lang" tabindex="0">
        <span class="fs-pg-lang-btn"><span class="fs-pg-lang-cur">${langCurrent}</span> ${ICON_CHEVRON}</span>
        <div class="fs-pg-lang-menu">${langRows}</div>
      </div>
    </div>
    <div class="fs-pg-right">
      <span class="fs-pg-iconbtn" title="Shortcuts">${ICON_KEYS}</span>
      <span class="fs-pg-iconbtn" title="More">${ICON_MORE}</span>
      <label class="fs-pg-run" for="fs-pg-run">${ICON_PLAY}<span>${esc(runLabel)}</span></label>
    </div>
  </header>
  <div class="fs-pg-body">
    ${showCode ? `<section class="fs-pg-editor">${codePanels}</section>` : ""}
    <aside class="fs-pg-io">
      <div class="fs-pg-pane">
        <div class="fs-pg-pane-h">${ICON_TERM} STDIN</div>
        <textarea placeholder="Enter input...">${esc(BINARY_EXP_STDIN)}</textarea>
      </div>
      <div class="fs-pg-pane">
        <div class="fs-pg-pane-h">${ICON_TERM} OUTPUT</div>
        <div class="fs-pg-empty">${ICON_TERM}<span>Run your code to see output</span></div>
        <pre class="fs-pg-result">${esc(BINARY_EXP_STDOUT)}</pre>
      </div>
    </aside>
  </div>
</div>`;
}
