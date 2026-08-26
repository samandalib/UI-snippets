import type { Snippet, SnippetItem, TemplateId } from "./types";

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

function items(list: Array<Omit<SnippetItem, "id">>): SnippetItem[] {
  return list.map((item) => ({ ...item, id: uid() }));
}

const BASE_STYLE: Snippet["style"] = {
  preset: "studio",
  scheme: "dark",
  background: "transparent",
  accent: "#6ee7b7",
  radius: 14,
  columns: 3,
  font: "sans",
  maxWidth: 960,
  showIcons: true,
  padding: 56,
};

export function createSnippet(template: TemplateId, name?: string): Snippet {
  const now = Date.now();
  const base = {
    id: uid(),
    name: name || "Untitled snippet",
    template,
    ctaHref: "https://example.com",
    createdAt: now,
    updatedAt: now,
  };

  if (template === "code-demo") {
    return {
      ...base,
      eyebrow: "Developer experience",
      heading: "One API, every model",
      subheading: "Swap providers without touching your code.",
      ctaLabel: "Read the docs",
      code: `import { generateText } from 'ai';

const { text } = await generateText({
  model: 'openai/gpt-5.6-luna',
  prompt: 'Explain the concept of quantum entanglement.',
});

console.log(text);`,
      menuItems: [
        "GPT 5.6 Luna",
        "Claude Opus 5",
        "Gemini 3.7 Flash",
        "Grok 4.6",
        "Mistral Medium Latest",
        "Muse Glimmer 30B",
      ],
      toggleLabel: "Use With AI Gateway",
      items: items([
        { title: "Text", body: "", icon: "sparkles" },
        { title: "Image", body: "", icon: "layers" },
        { title: "Speech", body: "", icon: "zap" },
        { title: "Transcription", body: "", icon: "wand" },
        { title: "Video", body: "", icon: "globe" },
      ]),
      style: { ...BASE_STYLE, accent: "#3b82f6", radius: 12, maxWidth: 1040, showIcons: false },
    };
  }

  if (template === "stat-row") {
    return {
      ...base,
      eyebrow: "By the numbers",
      heading: "Teams ship faster with us",
      subheading: "Measured across 2,400 production workspaces in the last quarter.",
      ctaLabel: "Read the report",
      items: items([
        { title: "3.4x", body: "Faster time to first release", icon: "gauge" },
        { title: "99.99%", body: "Uptime across all regions", icon: "shield" },
        { title: "-42%", body: "Drop in support tickets", icon: "zap" },
      ]),
      style: { ...BASE_STYLE, columns: 3, showIcons: false, accent: "#a5b4fc" },
    };
  }

  if (template === "feature-split") {
    return {
      ...base,
      eyebrow: "Platform",
      heading: "Everything your workflow already expects",
      subheading:
        "Built-in primitives so your team can focus on the product instead of the plumbing.",
      ctaLabel: "Explore the platform",
      items: items([
        { title: "Instant environments", body: "Spin up an isolated stack per branch.", icon: "zap" },
        { title: "Granular permissions", body: "Role and resource scoped access control.", icon: "lock" },
        { title: "Global edge delivery", body: "Served from 260 locations worldwide.", icon: "globe" },
      ]),
      style: { ...BASE_STYLE, columns: 2, accent: "#fbbf24" },
    };
  }

  return {
    ...base,
    eyebrow: "Why teams choose us",
    heading: "A feature set that stays out of your way",
    subheading:
      "Three things we obsess over so your customers never have to think about them.",
    ctaLabel: "Start building",
    items: items([
      { title: "Blazing fast", body: "Sub-50ms responses at the edge, everywhere.", icon: "zap" },
      { title: "Secure by default", body: "Encrypted at rest and in transit, always.", icon: "shield" },
      { title: "Composable", body: "Drop into any stack with a single snippet.", icon: "layers" },
    ]),
    style: BASE_STYLE,
  };
}

export function newItem(): SnippetItem {
  return { id: uid(), title: "New feature", body: "Describe the benefit in one line.", icon: "sparkles" };
}

export const ACCENT_PRESETS = [
  "#6ee7b7",
  "#a5b4fc",
  "#fbbf24",
  "#f472b6",
  "#38bdf8",
  "#fb7185",
];
