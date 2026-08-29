import { Check, Eye, EyeOff, GripVertical, Plus, Trash2 } from "lucide-react";
import { STYLE_PRESETS } from "@/lib/snippets/presets";
import { ACCENT_PRESETS, newItem } from "@/lib/snippets/templates";
import { HIDABLE_LABELS, ICON_KEYS, TEMPLATE_LABELS } from "@/lib/snippets/types";
import type { HidableKey, Snippet, SnippetStyle, TemplateId } from "@/lib/snippets/types";


function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

const BACKGROUND_PRESETS = ["#000000", "#0b0d12", "#ffffff", "#f6f7f9"];

const inputCls =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-foreground/50";


export function TextField({
  label,
  value,
  onChange,
  placeholder,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  return (
    <Row label={label}>
      {multiline ? (
        <textarea
          rows={2}
          className={`${inputCls} resize-y`}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className={inputCls}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </Row>
  );
}

export function NumberField({
  label,
  value,
  min,
  max,
  step = 1,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </span>
        <span className="font-mono text-xs text-foreground">
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1 w-full cursor-pointer appearance-none rounded-full bg-border accent-foreground"
      />
    </div>
  );
}

export function ContentEditor({
  snippet,
  onChange,
}: {
  snippet: Snippet;
  onChange: (next: Snippet) => void;
}) {
  const patch = (part: Partial<Snippet>) => onChange({ ...snippet, ...part });
  const isStats = snippet.template === "stat-row";
  const isCode = snippet.template === "code-demo";
  const isPlayground = snippet.template === "code-playground";
  const isRanking = snippet.template === "contest-ranking";
  const isHub = snippet.template === "problems-hub";
  const isChrome = isRanking || isHub || isPlayground;

  const hidableKeys: HidableKey[] = isPlayground
    ? ["code", "toggle"]
    : isChrome
    ? ["items"]
    : isCode
    ? ["eyebrow", "heading", "subheading", "items", "code", "menu", "toggle", "cta"]
    : ["eyebrow", "heading", "subheading", "items", "cta"];
  const toggleHidden = (key: HidableKey) =>
    patch({ hidden: { ...snippet.hidden, [key]: snippet.hidden?.[key] !== true } });

  return (
    <div className="space-y-5">
      <Row label="Visible parts">
        <div className="flex flex-wrap gap-1.5">
          {hidableKeys.map((key) => {
            const shown = snippet.hidden?.[key] !== true;
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleHidden(key)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.7rem] transition-colors ${
                  shown
                    ? "border-foreground/50 text-foreground"
                    : "border-border text-muted-foreground line-through"
                }`}
              >
                {shown ? <Eye className="size-3" /> : <EyeOff className="size-3" />}
                {HIDABLE_LABELS[key]}
              </button>
            );
          })}
        </div>
      </Row>


      <div className="grid gap-4 sm:grid-cols-2">
        {!isChrome && (
          <TextField label="Eyebrow" value={snippet.eyebrow} onChange={(v) => patch({ eyebrow: v })} />
        )}
        <Row label="Template">
          <select
            className={inputCls}
            value={snippet.template}
            onChange={(e) => patch({ template: e.target.value as TemplateId })}
          >
            {Object.entries(TEMPLATE_LABELS).map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
        </Row>
      </div>
      {isRanking ? (
        <TextField
          label="Breadcrumbs ( › separated )"
          value={(snippet.breadcrumbs ?? []).join(" › ")}
          onChange={(v) =>
            patch({
              breadcrumbs: v.split("›").map((part) => part.trim()).filter(Boolean),
            })
          }
        />
      ) : isHub || isPlayground ? null : (
        <>
          <TextField label="Heading" value={snippet.heading} onChange={(v) => patch({ heading: v })} />
          <TextField
            label="Subheading"
            multiline
            value={snippet.subheading}
            onChange={(v) => patch({ subheading: v })}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Button label"
              value={snippet.ctaLabel}
              onChange={(v) => patch({ ctaLabel: v })}
              placeholder="Leave blank to hide"
            />
            <TextField label="Button link" value={snippet.ctaHref} onChange={(v) => patch({ ctaHref: v })} />
          </div>
        </>
      )}

      {isPlayground && (
        <div className="space-y-4 border-t border-border pt-5">
          <TextField
            label="Toggle label"
            value={snippet.toggleLabel ?? ""}
            onChange={(v) => patch({ toggleLabel: v })}
            placeholder="Leave blank to hide"
          />
        </div>
      )}

      {isCode && (
        <div className="space-y-4 border-t border-border pt-5">
          <Row label="Code">
            <textarea
              rows={9}
              className={`${inputCls} resize-y font-mono text-xs`}
              value={snippet.code ?? ""}
              onChange={(e) => patch({ code: e.target.value })}
            />
          </Row>
          <Row label="Picker rows (one per line)">
            <textarea
              rows={5}
              className={`${inputCls} resize-y`}
              value={(snippet.menuItems ?? []).join("\n")}
              onChange={(e) =>
                patch({ menuItems: e.target.value.split("\n").filter((l) => l.trim() !== "") })
              }
            />
          </Row>
          <TextField
            label="Toggle label"
            value={snippet.toggleLabel ?? ""}
            onChange={(v) => patch({ toggleLabel: v })}
            placeholder="Leave blank to hide"
          />
        </div>
      )}

      {!isPlayground && (
      <div className="border-t border-border pt-5">
        <div className="flex items-center justify-between">
          <p className="text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
            {isCode ? "Tabs" : isStats ? "Metrics" : isChrome ? "Tabs" : "Features"}
          </p>
          <button
            type="button"
            onClick={() => patch({ items: [...snippet.items, newItem()] })}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs text-foreground transition-colors hover:border-foreground/50"
          >
            <Plus className="size-3.5" /> Add
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {snippet.items.map((item, i) => (
            <div key={item.id} className="rounded-lg border border-border bg-background/40 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 font-mono text-[0.65rem] tracking-[0.2em] text-muted-foreground">
                  <GripVertical className="size-3.5" />
                  {String(i + 1).padStart(2, "0")}
                </span>
                <button
                  type="button"
                  aria-label="Remove item"
                  onClick={() =>
                    patch({ items: snippet.items.filter((other) => other.id !== item.id) })
                  }
                  className="text-muted-foreground transition-colors hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
              <div className="space-y-3">
                <TextField
                  label={isCode ? "Tab label" : isStats ? "Value" : "Title"}
                  value={item.title}
                  onChange={(v) =>
                    patch({
                      items: snippet.items.map((o) => (o.id === item.id ? { ...o, title: v } : o)),
                    })
                  }
                />
                {!isCode && !isChrome && (
                  <TextField
                    label={isStats ? "Caption" : "Description"}
                    multiline
                    value={item.body}
                    onChange={(v) =>
                      patch({
                        items: snippet.items.map((o) => (o.id === item.id ? { ...o, body: v } : o)),
                      })
                    }
                  />
                )}
                {!isStats && !isCode && !isChrome && (
                  <Row label="Icon">
                    <select
                      className={inputCls}
                      value={item.icon}
                      onChange={(e) =>
                        patch({
                          items: snippet.items.map((o) =>
                            o.id === item.id
                              ? { ...o, icon: e.target.value as typeof item.icon }
                              : o,
                          ),
                        })
                      }
                    >
                      {ICON_KEYS.map((key) => (
                        <option key={key} value={key}>
                          {key}
                        </option>
                      ))}
                    </select>
                  </Row>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      )}
    </div>
  );
}

export function StyleEditor({
  snippet,
  onChange,
}: {
  snippet: Snippet;
  onChange: (next: Snippet) => void;
}) {
  const s = snippet.style;
  const set = <K extends keyof SnippetStyle>(key: K, value: SnippetStyle[K]) =>
    onChange({ ...snippet, style: { ...s, [key]: value } });

  return (
    <div className="space-y-5">
      <Row label="Style preset">
        <div className="space-y-2">
          {STYLE_PRESETS.map((preset) => {
            const active = (s.preset ?? "studio") === preset.id;
            return (

              <button
                key={preset.id}
                type="button"
                onClick={() =>
                  onChange({
                    ...snippet,
                    style: {
                      ...preset.style,
                      ...(snippet.template === "contest-ranking" ||
                      snippet.template === "problems-hub" ||
                      snippet.template === "code-playground"
                        ? { padding: 0 }
                        : {}),
                    },
                  })
                }
                className={`flex w-full items-center gap-3 rounded-md border px-3 py-2.5 text-left transition-colors ${
                  active
                    ? "border-foreground/60 bg-foreground/[0.08]"
                    : "border-border hover:border-foreground/40"
                }`}
              >
                <span className="flex shrink-0 items-center gap-1">
                  {preset.swatch.map((hex) => (
                    <span
                      key={hex}
                      style={{ backgroundColor: hex }}
                      className="size-3.5 rounded-full border border-border"
                    />
                  ))}
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-medium text-foreground">{preset.label}</span>
                  <span className="block text-[0.7rem] leading-snug text-muted-foreground">
                    {preset.blurb}
                  </span>
                </span>
                {active && <Check className="ml-auto size-3.5 shrink-0 text-foreground" />}
              </button>
            );
          })}
        </div>
      </Row>

      {(s.preset ?? "studio") !== "studio" && (
        <p className="-mt-2 text-[0.7rem] leading-snug text-muted-foreground">
          This preset owns the typography, surfaces, borders and syntax colors. Accent, columns,
          width and padding below still apply.
        </p>
      )}



      <Row label="Color scheme">

        <div className="flex gap-2">
          {(["dark", "light"] as const).map((scheme) => (
            <button
              key={scheme}
              type="button"
              onClick={() => set("scheme", scheme)}
              className={`flex-1 rounded-md border px-3 py-2 text-xs capitalize transition-colors ${
                s.scheme === scheme
                  ? "border-foreground/60 bg-foreground/[0.08] text-foreground"
                  : "border-border text-muted-foreground hover:border-foreground/40"
              }`}
            >
              {scheme}
            </button>
          ))}
        </div>
      </Row>

      <Row label="Background">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => set("background", "transparent")}
            className={`rounded-md border px-3 py-2 text-xs transition-colors ${
              (s.background ?? "transparent") === "transparent"
                ? "border-foreground/60 bg-foreground/[0.08] text-foreground"
                : "border-border text-muted-foreground hover:border-foreground/40"
            }`}
          >
            Transparent
          </button>
          {BACKGROUND_PRESETS.map((hex) => (
            <button
              key={hex}
              type="button"
              aria-label={`Background ${hex}`}
              onClick={() => set("background", hex)}
              style={{ backgroundColor: hex }}
              className={`size-7 rounded-full border transition-transform ${
                s.background === hex ? "border-foreground scale-110" : "border-border"
              }`}
            />
          ))}
          <input
            type="color"
            aria-label="Custom background color"
            value={
              (s.background ?? "transparent").startsWith("#") ? s.background! : "#000000"
            }
            onChange={(e) => set("background", e.target.value)}
            className="ml-auto h-8 w-12 cursor-pointer rounded-md border border-border bg-background"
          />
        </div>
      </Row>

      <Row label="Accent">

        <div className="flex items-center gap-2">
          {ACCENT_PRESETS.map((hex) => (
            <button
              key={hex}
              type="button"
              aria-label={`Accent ${hex}`}
              onClick={() => set("accent", hex)}
              style={{ backgroundColor: hex }}
              className={`size-7 rounded-full border transition-transform ${
                s.accent === hex ? "border-foreground scale-110" : "border-transparent"
              }`}
            />
          ))}
          <input
            type="color"
            value={s.accent}
            onChange={(e) => set("accent", e.target.value)}
            className="ml-auto h-8 w-12 cursor-pointer rounded-md border border-border bg-background"
          />
        </div>
      </Row>

      <Row label="Font">
        <select
          className={inputCls}
          value={s.font}
          onChange={(e) => set("font", e.target.value as SnippetStyle["font"])}
        >
          <option value="sans">Sans</option>
          <option value="serif">Serif</option>
          <option value="mono">Mono</option>
        </select>
      </Row>

      <NumberField label="Columns" value={s.columns} min={1} max={4} onChange={(v) => set("columns", v)} />
      <NumberField
        label="Corner radius"
        value={s.radius}
        min={0}
        max={32}
        suffix="px"
        onChange={(v) => set("radius", v)}
      />
      <NumberField
        label="Max width"
        value={s.maxWidth}
        min={560}
        max={1280}
        step={20}
        suffix="px"
        onChange={(v) => set("maxWidth", v)}
      />
      <NumberField
        label="Vertical padding"
        value={s.padding}
        min={16}
        max={120}
        step={4}
        suffix="px"
        onChange={(v) => set("padding", v)}
      />

      <label className="flex items-center justify-between rounded-md border border-border px-3 py-2.5">
        <span className="text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
          Show icons
        </span>
        <input
          type="checkbox"
          checked={s.showIcons}
          onChange={(e) => set("showIcons", e.target.checked)}
          className="size-4 accent-foreground"
        />
      </label>
    </div>
  );
}
