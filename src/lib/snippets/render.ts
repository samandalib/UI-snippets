import type { Snippet, SnippetStyle, TemplateId } from './types'
import { getIconSvg } from './icons'

interface Theme {
  bg: string
  surface: string
  raised: string
  overlay: string
  border: string
  text: string
  muted: string
  subtle: string
  ctaBg: string
  ctaText: string
  fontFamily: string
  monoFamily: string
  tracking: string
}

function esc(str: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }
  return str.replace(/[&<>"']/g, c => map[c])
}

function theme(style: SnippetStyle): Theme {
  const isDark = style.scheme === 'dark'

  // Per-preset branches
  if (style.preset === 'vercel') {
    return isDark
      ? {
          bg: '#000000',
          surface: '#0a0a0a',
          raised: '#111111',
          overlay: '#1c1c1c',
          border: '#262626',
          text: '#ededed',
          muted: '#a1a1a1',
          subtle: '#6b6b70',
          ctaBg: '#0072f5',
          ctaText: '#ffffff',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          monoFamily: '"SF Mono", ui-monospace, "SFMono-Regular", Menlo, monospace',
          tracking: '-0.01em',
        }
      : {
          bg: '#ffffff',
          surface: '#fafafa',
          raised: '#f4f4f5',
          overlay: '#ffffff',
          border: '#e5e5e5',
          text: '#0a0a0a',
          muted: '#666666',
          subtle: '#8f8f96',
          ctaBg: '#0072f5',
          ctaText: '#ffffff',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          monoFamily: '"SF Mono", ui-monospace, "SFMono-Regular", Menlo, monospace',
          tracking: '-0.01em',
        }
  }

  if (style.preset === 'jetbrains') {
    return {
      bg: '#1E1F22',
      surface: '#2B2D30',
      raised: '#393B40',
      overlay: '#2B2D30',
      border: '#393B40',
      text: '#EBECF0',
      muted: '#A3A6A9',
      subtle: '#6F737A',
      ctaBg: '#3574F0',
      ctaText: '#ffffff',
      fontFamily: '"JetBrains Sans", -apple-system, sans-serif',
      monoFamily: '"JetBrains Mono", "Courier New", monospace',
      tracking: '0',
    }
  }

  if (style.preset === 'liquidglass') {
    return {
      bg: 'transparent',
      surface: 'rgba(255,255,255,0.10)',
      raised: 'rgba(255,255,255,0.18)',
      overlay: 'rgba(28,28,32,0.42)',
      border: 'rgba(255,255,255,0.28)',
      text: '#ffffff',
      muted: 'rgba(255,255,255,0.72)',
      subtle: 'rgba(255,255,255,0.50)',
      ctaBg: '#0a84ff',
      ctaText: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
      monoFamily: '"SF Mono", monospace',
      tracking: '-0.025em',
    }
  }

  // Studio (default)
  return isDark
    ? {
        bg: '#0a0a0a',
        surface: '#1a1a2e',
        raised: '#16213e',
        overlay: '#0f3460',
        border: '#16213e',
        text: '#eaeaea',
        muted: '#888888',
        subtle: '#666666',
        ctaBg: style.accent,
        ctaText: '#ffffff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        monoFamily: '"Courier New", monospace',
        tracking: '0',
      }
    : {
        bg: '#ffffff',
        surface: '#f5f5f5',
        raised: '#eeeeee',
        overlay: '#f0f0f0',
        border: '#e0e0e0',
        text: '#1a1a1a',
        muted: '#666666',
        subtle: '#999999',
        ctaBg: style.accent,
        ctaText: '#ffffff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        monoFamily: '"Courier New", monospace',
        tracking: '0',
      }
}

interface SyntaxToken {
  type: 'keyword' | 'string' | 'number' | 'function' | 'comment' | 'text'
  value: string
}

function highlightLine(line: string): SyntaxToken[] {
  const tokens: SyntaxToken[] = []
  let remaining = line
  let pos = 0

  const keywords = new Set(['const', 'let', 'var', 'function', 'return', 'import', 'export', 'from', 'async', 'await', 'if', 'else', 'for', 'while'])

  while (pos < line.length) {
    const char = remaining[0]

    // String (single or double quote)
    if (char === '"' || char === "'") {
      const quote = char
      const match = remaining.match(new RegExp(`^${quote}[^${quote}]*${quote}`))
      if (match) {
        tokens.push({ type: 'string', value: match[0] })
        remaining = remaining.slice(match[0].length)
        pos += match[0].length
        continue
      }
    }

    // Comment
    if (remaining.startsWith('//')) {
      const match = remaining.match(/^\/\/.*/)
      if (match) {
        tokens.push({ type: 'comment', value: match[0] })
        remaining = remaining.slice(match[0].length)
        pos += match[0].length
        continue
      }
    }

    // Number
    if (/^\d+/.test(remaining)) {
      const match = remaining.match(/^\d+/)!
      tokens.push({ type: 'number', value: match[0] })
      remaining = remaining.slice(match[0].length)
      pos += match[0].length
      continue
    }

    // Identifier/keyword
    if (/^[a-zA-Z_]/.test(remaining)) {
      const match = remaining.match(/^[a-zA-Z_]\w*/)!
      const word = match[0]
      const isKeyword = keywords.has(word)
      tokens.push({
        type: isKeyword ? 'keyword' : 'text',
        value: word,
      })
      remaining = remaining.slice(word.length)
      pos += word.length
      continue
    }

    // Whitespace and other
    tokens.push({ type: 'text', value: char })
    remaining = remaining.slice(1)
    pos += 1
  }

  return tokens
}

function highlightCode(code: string): string {
  return code
    .split('\n')
    .map((line, idx) => {
      const tokens = highlightLine(line)
      const html = tokens
        .map(t =>
          t.type === 'text'
            ? esc(t.value)
            : `<span class="fs-t-${t.type}">${esc(t.value)}</span>`
        )
        .join('')
      return `<div class="fs-line"><span class="fs-ln">${idx + 1}</span>${html}</div>`
    })
    .join('')
}

function styleSheet(snippet: Snippet): string {
  const t = theme(snippet.style)
  const radius = snippet.style.radius
  const denseMode = snippet.style.preset === 'vercel' || snippet.style.preset === 'jetbrains'

  return `
    :root {
      --fs-bg: ${snippet.style.background || t.bg};
      --fs-surface: ${t.surface};
      --fs-raised: ${t.raised};
      --fs-overlay: ${t.overlay};
      --fs-border: ${t.border};
      --fs-text: ${t.text};
      --fs-muted: ${t.muted};
      --fs-subtle: ${t.subtle};
      --fs-accent: ${snippet.style.accent};
      --fs-cta-bg: ${t.ctaBg};
      --fs-cta-text: ${t.ctaText};
      --fs-font: ${t.fontFamily};
      --fs-mono: ${t.monoFamily};
      --fs-tracking: ${t.tracking};
    }

    .fs-root {
      font-family: var(--fs-font);
      color: var(--fs-text);
      background: var(--fs-bg);
      margin: 0;
      padding: 0;
    }

    .fs-frame {
      max-width: ${snippet.style.maxWidth}px;
      margin: 0 auto;
      padding: ${snippet.style.padding}px;
    }

    .fs-eyebrow {
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--fs-subtle);
      margin: 0 0 8px 0;
    }

    .fs-heading {
      font-size: 32px;
      font-weight: 700;
      line-height: 1.2;
      margin: 0 0 12px 0;
    }

    .fs-sub {
      font-size: 16px;
      color: var(--fs-muted);
      line-height: 1.5;
      margin: 0 0 24px 0;
    }

    .fs-grid {
      display: grid;
      grid-template-columns: repeat(${snippet.style.columns}, 1fr);
      gap: 16px;
      margin: 24px 0;
    }

    .fs-card {
      background: var(--fs-surface);
      border: 1px solid var(--fs-border);
      border-radius: ${radius}px;
      padding: 20px;
    }

    .fs-icon {
      width: 32px;
      height: 32px;
      color: var(--fs-accent);
      margin-bottom: 12px;
    }

    .fs-item-title {
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 8px 0;
    }

    .fs-item-body {
      font-size: 14px;
      color: var(--fs-muted);
      line-height: 1.5;
      margin: 0;
    }

    .fs-cta {
      background: var(--fs-cta-bg);
      color: var(--fs-cta-text);
      border: none;
      border-radius: 6px;
      padding: 10px 20px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      display: inline-block;
      text-decoration: none;
      margin-top: 16px;
    }

    .fs-panel {
      background: var(--fs-surface);
      border: 1px solid var(--fs-border);
      border-radius: ${radius}px;
      padding: 16px;
      margin: 24px 0;
    }

    .fs-code {
      background: var(--fs-surface);
      border: 1px solid var(--fs-border);
      border-radius: ${radius}px;
      overflow-x: auto;
      margin: 16px 0;
    }

    .fs-line {
      display: flex;
      font-family: var(--fs-mono);
      font-size: 13px;
      line-height: 1.6;
      padding: 0 12px;
    }

    .fs-ln {
      color: var(--fs-subtle);
      margin-right: 12px;
      min-width: 40px;
      text-align: right;
    }

    .fs-t-keyword { color: #ff9f0a; }
    .fs-t-string { color: #7ce38b; }
    .fs-t-number { color: #ffd68a; }
    .fs-t-function { color: #64d2ff; }
    .fs-t-comment { color: rgba(255, 255, 255, 0.5); }
  `
}

export function renderSnippetFragment(snippet: Snippet): string {
  const css = styleSheet(snippet)
  const t = theme(snippet.style)

  let body = ''

  if (snippet.template === 'feature-grid') {
    body = `
      <div class="fs-eyebrow">${esc(snippet.eyebrow)}</div>
      <h1 class="fs-heading">${esc(snippet.heading)}</h1>
      <p class="fs-sub">${esc(snippet.subheading)}</p>
      <div class="fs-grid">
        ${snippet.items
          .map(
            item =>
              `
          <div class="fs-card">
            ${snippet.style.showIcons ? `<div class="fs-icon">${getIconSvg(item.icon)}</div>` : ''}
            <h3 class="fs-item-title">${esc(item.title)}</h3>
            <p class="fs-item-body">${esc(item.body)}</p>
          </div>
        `
          )
          .join('')}
      </div>
      <a href="${esc(snippet.ctaHref)}" class="fs-cta">${esc(snippet.ctaLabel)}</a>
    `
  } else if (snippet.template === 'feature-split') {
    body = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start;">
        <div>
          <div class="fs-eyebrow">${esc(snippet.eyebrow)}</div>
          <h1 class="fs-heading">${esc(snippet.heading)}</h1>
          <p class="fs-sub">${esc(snippet.subheading)}</p>
          <a href="${esc(snippet.ctaHref)}" class="fs-cta">${esc(snippet.ctaLabel)}</a>
        </div>
        <div>
          ${snippet.items
            .map(
              item =>
                `
            <div style="display: flex; gap: 12px; margin-bottom: 16px;">
              ${snippet.style.showIcons ? `<div class="fs-icon" style="flex-shrink: 0;">${getIconSvg(item.icon)}</div>` : ''}
              <div>
                <h3 class="fs-item-title">${esc(item.title)}</h3>
              </div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    `
  } else if (snippet.template === 'stat-row') {
    body = `
      <div class="fs-eyebrow">${esc(snippet.eyebrow)}</div>
      <h1 class="fs-heading">${esc(snippet.heading)}</h1>
      <p class="fs-sub">${esc(snippet.subheading)}</p>
      <div style="display: grid; grid-template-columns: repeat(${snippet.style.columns}, 1fr); gap: 24px; margin-top: 32px;">
        ${snippet.items
          .map(
            item => `
          <div style="text-align: center;">
            <div style="font-size: 32px; font-weight: 700; color: var(--fs-accent); margin-bottom: 8px;">${esc(item.title)}</div>
            <div class="fs-item-body">${esc(item.body)}</div>
          </div>
        `
          )
          .join('')}
      </div>
    `
  } else {
    body = `
      <div class="fs-eyebrow">${esc(snippet.eyebrow)}</div>
      <h1 class="fs-heading">${esc(snippet.heading)}</h1>
      <p class="fs-sub">${esc(snippet.subheading)}</p>
      <div class="fs-code">
        ${highlightCode(snippet.items.map(i => i.title).join('\n'))}
      </div>
      <a href="${esc(snippet.ctaHref)}" class="fs-cta">${esc(snippet.ctaLabel)}</a>
    `
  }

  return `<style>${css}</style><section class="fs-root"><div class="fs-frame">${body}</div></section>`
}

export function renderSnippetDocument(snippet: Snippet, transparentPage: boolean = false): string {
  const fragment = renderSnippetFragment(snippet)
  const bgStyle = transparentPage ? 'background: transparent;' : 'background: #0a0a0a;'

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(snippet.name)}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { ${bgStyle} height: 100%; }
    .fs-root { min-height: 100vh; display: flex; align-items: center; justify-content: center; }
  </style>
</head>
<body>
  ${fragment}
</body>
</html>`
}

export function downloadFile(name: string, mime: string, content: string): void {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}
