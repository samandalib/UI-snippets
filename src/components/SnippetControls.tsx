import { useState } from 'react'
import { STYLE_PRESETS, ACCENT_PRESETS, ICON_KEYS, HIDABLE_LABELS } from '@/lib/snippets'
import type { Snippet, HidableKey } from '@/lib/snippets'

interface SnippetControlsProps {
  snippet: Snippet
  onChange: (snippet: Snippet) => void
}

export function SnippetControls({ snippet, onChange }: SnippetControlsProps) {
  const [tab, setTab] = useState<'content' | 'style'>('content')

  const updateSnippet = (updates: Partial<Snippet>) => {
    onChange({ ...snippet, ...updates })
  }

  const toggleHidden = (key: HidableKey) => {
    const hidden = new Set(snippet.hidden || [])
    if (hidden.has(key)) {
      hidden.delete(key)
    } else {
      hidden.add(key)
    }
    updateSnippet({ hidden })
  }

  const templateHidableKeys: Record<string, HidableKey[]> = {
    'feature-grid': ['eyebrow', 'heading', 'subheading', 'cta', 'items'],
    'feature-split': ['eyebrow', 'heading', 'subheading', 'cta', 'items'],
    'stat-row': ['eyebrow', 'heading', 'subheading', 'cta', 'items'],
    'code-demo': ['eyebrow', 'heading', 'subheading', 'cta', 'code', 'menu', 'toggle'],
  }

  const hidableKeys = templateHidableKeys[snippet.template] || []

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Tabs */}
      <div className="border-b flex">
        <button
          onClick={() => setTab('content')}
          className={`flex-1 py-2 px-4 text-sm font-medium ${
            tab === 'content'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Content
        </button>
        <button
          onClick={() => setTab('style')}
          className={`flex-1 py-2 px-4 text-sm font-medium ${
            tab === 'style'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Style
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {tab === 'content' && (
          <>
            {/* Visible Parts */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Visible Parts</label>
              <div className="flex flex-wrap gap-2">
                {hidableKeys.map(key => (
                  <button
                    key={key}
                    onClick={() => toggleHidden(key)}
                    className={`px-3 py-1 text-sm rounded ${
                      !(snippet.hidden?.has(key))
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {HIDABLE_LABELS[key]}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Fields */}
            <InputField
              label="Name"
              value={snippet.name}
              onChange={v => updateSnippet({ name: v })}
            />
            <InputField
              label="Eyebrow"
              value={snippet.eyebrow}
              onChange={v => updateSnippet({ eyebrow: v })}
            />
            <InputField
              label="Heading"
              value={snippet.heading}
              onChange={v => updateSnippet({ heading: v })}
            />
            <InputField
              label="Subheading"
              value={snippet.subheading}
              onChange={v => updateSnippet({ subheading: v })}
              multiline
            />
            <InputField
              label="CTA Label"
              value={snippet.ctaLabel}
              onChange={v => updateSnippet({ ctaLabel: v })}
            />
            <InputField
              label="CTA Href"
              value={snippet.ctaHref}
              onChange={v => updateSnippet({ ctaHref: v })}
            />

            {/* Code (code-demo only) */}
            {snippet.template === 'code-demo' && (
              <InputField
                label="Code"
                value={snippet.code || ''}
                onChange={v => updateSnippet({ code: v })}
                multiline
                placeholder="const result = await generateText({ ... })"
              />
            )}

            {/* Menu Items (code-demo only) */}
            {snippet.template === 'code-demo' && (
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Menu Items</label>
                <textarea
                  value={(snippet.menuItems || []).join('\n')}
                  onChange={e =>
                    updateSnippet({
                      menuItems: e.target.value.split('\n').filter(s => s.trim()),
                    })
                  }
                  placeholder="One item per line"
                  className="w-full px-2 py-1 text-sm border rounded"
                  rows={3}
                />
              </div>
            )}

            {/* Toggle Label (code-demo only) */}
            {snippet.template === 'code-demo' && (
              <InputField
                label="Toggle Label"
                value={snippet.toggleLabel || ''}
                onChange={v => updateSnippet({ toggleLabel: v })}
                placeholder="e.g., Streaming"
              />
            )}

            {/* Items */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Items</label>
              <div className="space-y-3">
                {snippet.items.map((item, idx) => (
                  <div key={item.id} className="p-3 border rounded bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Item {idx + 1}</span>
                      <button
                        onClick={() => {
                          const items = snippet.items.filter(i => i.id !== item.id)
                          updateSnippet({ items })
                        }}
                        className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Title"
                      value={item.title}
                      onChange={e => {
                        const items = snippet.items.map(i =>
                          i.id === item.id ? { ...i, title: e.target.value } : i
                        )
                        updateSnippet({ items })
                      }}
                      className="w-full px-2 py-1 text-sm border rounded mb-2"
                    />
                    <textarea
                      placeholder="Body"
                      value={item.body}
                      onChange={e => {
                        const items = snippet.items.map(i =>
                          i.id === item.id ? { ...i, body: e.target.value } : i
                        )
                        updateSnippet({ items })
                      }}
                      className="w-full px-2 py-1 text-sm border rounded mb-2"
                      rows={2}
                    />
                    <select
                      value={item.icon}
                      onChange={e => {
                        const items = snippet.items.map(i =>
                          i.id === item.id ? { ...i, icon: e.target.value as any } : i
                        )
                        updateSnippet({ items })
                      }}
                      className="w-full px-2 py-1 text-sm border rounded"
                    >
                      {ICON_KEYS.map(k => (
                        <option key={k} value={k}>
                          {k}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newItem = {
                      id: Math.random().toString(36).slice(2, 9),
                      title: 'New item',
                      body: 'Add a description',
                      icon: 'sparkles' as const,
                    }
                    updateSnippet({ items: [...snippet.items, newItem] })
                  }}
                  className="w-full px-3 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                >
                  + Add Item
                </button>
              </div>
            </div>
          </>
        )}

        {tab === 'style' && (
          <>
            {/* Presets */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Style Presets</label>
              <div className="space-y-2">
                {STYLE_PRESETS.map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => updateSnippet({ style: preset.style })}
                    className={`w-full p-3 rounded border-2 text-left transition ${
                      snippet.style.preset === preset.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {preset.swatch.map((color, i) => (
                        <div
                          key={i}
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                      <span className="text-sm font-medium">{preset.label}</span>
                      {snippet.style.preset === preset.id && <span className="ml-auto text-sm">✓</span>}
                    </div>
                    <p className="text-xs text-gray-600">{preset.blurb}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Style Options */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Scheme</label>
              <select
                value={snippet.style.scheme}
                onChange={e =>
                  updateSnippet({
                    style: { ...snippet.style, scheme: e.target.value as 'dark' | 'light' },
                  })
                }
                className="w-full px-2 py-1 text-sm border rounded"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Font</label>
              <select
                value={snippet.style.font}
                onChange={e =>
                  updateSnippet({
                    style: { ...snippet.style, font: e.target.value as 'sans' | 'serif' | 'mono' },
                  })
                }
                className="w-full px-2 py-1 text-sm border rounded"
              >
                <option value="sans">Sans Serif</option>
                <option value="serif">Serif</option>
                <option value="mono">Monospace</option>
              </select>
            </div>

            <InputField
              label="Background"
              value={snippet.style.background || ''}
              onChange={v =>
                updateSnippet({
                  style: { ...snippet.style, background: v || undefined },
                })
              }
              placeholder="e.g., transparent, #000, url(...)"
            />

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Accent Color</label>
              <div className="flex gap-2 mb-2">
                {ACCENT_PRESETS.map(color => (
                  <button
                    key={color}
                    onClick={() =>
                      updateSnippet({
                        style: { ...snippet.style, accent: color },
                      })
                    }
                    className="w-8 h-8 rounded border-2"
                    style={{
                      backgroundColor: color,
                      borderColor: snippet.style.accent === color ? '#000' : '#ccc',
                    }}
                  />
                ))}
              </div>
              <input
                type="color"
                value={snippet.style.accent}
                onChange={e =>
                  updateSnippet({
                    style: { ...snippet.style, accent: e.target.value },
                  })
                }
                className="w-full h-10 cursor-pointer"
              />
            </div>

            <RangeField
              label="Columns"
              value={snippet.style.columns}
              onChange={v =>
                updateSnippet({
                  style: { ...snippet.style, columns: v },
                })
              }
              min={1}
              max={4}
            />

            <RangeField
              label="Border Radius"
              value={snippet.style.radius}
              onChange={v =>
                updateSnippet({
                  style: { ...snippet.style, radius: v },
                })
              }
              min={0}
              max={24}
            />

            <RangeField
              label="Max Width"
              value={snippet.style.maxWidth}
              onChange={v =>
                updateSnippet({
                  style: { ...snippet.style, maxWidth: v },
                })
              }
              min={600}
              max={1600}
              step={100}
            />

            <RangeField
              label="Padding"
              value={snippet.style.padding}
              onChange={v =>
                updateSnippet({
                  style: { ...snippet.style, padding: v },
                })
              }
              min={0}
              max={96}
            />

            <div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={snippet.style.showIcons}
                  onChange={e =>
                    updateSnippet({
                      style: { ...snippet.style, showIcons: e.target.checked },
                    })
                  }
                />
                Show Icons
              </label>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function InputField({
  label,
  value,
  onChange,
  multiline,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  multiline?: boolean
  placeholder?: string
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-700 mb-1">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-2 py-1 text-sm border rounded"
          rows={2}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-2 py-1 text-sm border rounded"
        />
      )}
    </div>
  )
}

function RangeField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step?: number
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-700 mb-1">
        {label}: {value}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  )
}
