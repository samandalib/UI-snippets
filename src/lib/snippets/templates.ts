import { BINARY_EXP_LANGUAGES } from "./binary-exp";
import type { ContestProblem, LeaderboardEntry, Snippet, SnippetItem, TemplateId } from "./types";

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

function leaderboardEntry(
  rank: number,
  handle: string,
  color: string,
  flag: string,
  score: number,
  cells: LeaderboardEntry["cells"],
  delta: number,
): LeaderboardEntry {
  return { id: uid(), rank, handle, color, flag, score, cells, delta };
}

const CONTEST_PROBLEMS: ContestProblem[] = [
  { letter: "A", points: 500 },
  { letter: "B", points: 1000 },
  { letter: "C", points: 1500 },
  { letter: "D", points: 2000 },
  { letter: "E", points: 2500 },
  { letter: "F", points: 3000 },
  { letter: "G", points: 3500 },
];

const PREMIER_ROUND_7_ENTRIES: LeaderboardEntry[] = [
  leaderboardEntry(1, "jiangly", "#22d3ee", "🇨🇳", 8495, [
    { kind: "solved", points: 495, time: "3m" },
    { kind: "solved", points: 988, time: "7m" },
    { kind: "solved", points: 1455, time: "25m" },
    { kind: "solved", points: 1995, time: "49m" },
    { kind: "solved", points: 2495, time: "74m" },
    { kind: "solved", points: 2988, time: "99m" },
    { kind: "solved", points: 3479, time: "124m" },
  ], 422),
  leaderboardEntry(2, "ksun48", "#f87171", "🇺🇸", 7923, [
    { kind: "solved", points: 495, time: "4m" },
    { kind: "solved", points: 988, time: "11m" },
    { kind: "solved", points: 1455, time: "28m" },
    { kind: "solved", points: 1995, time: "52m" },
    { kind: "solved", points: 2495, time: "81m" },
    { kind: "solved", points: 2988, time: "105m" },
    { kind: "empty" },
  ], 388),
  leaderboardEntry(3, "Benq", "#fb923c", "🇹🇼", 7401, [
    { kind: "solved", points: 495, time: "5m" },
    { kind: "solved", points: 988, time: "14m", penalty: 2 },
    { kind: "solved", points: 1455, time: "31m" },
    { kind: "solved", points: 1995, time: "58m" },
    { kind: "solved", points: 2495, time: "88m" },
    { kind: "empty" },
    { kind: "empty" },
  ], 351),
  leaderboardEntry(4, "ecnerwala", "#f87171", "🇺🇸", 6892, [
    { kind: "solved", points: 495, time: "6m" },
    { kind: "solved", points: 988, time: "16m" },
    { kind: "solved", points: 1455, time: "35m" },
    { kind: "solved", points: 1995, time: "63m" },
    { kind: "solved", points: 2495, time: "95m" },
    { kind: "empty" },
    { kind: "empty" },
  ], 312),
  leaderboardEntry(5, "Um_nik", "#ef4444", "🇷🇺", 6388, [
    { kind: "solved", points: 495, time: "8m" },
    { kind: "solved", points: 988, time: "19m" },
    { kind: "solved", points: 1455, time: "40m" },
    { kind: "solved", points: 1995, time: "70m" },
    { kind: "empty" },
    { kind: "empty" },
    { kind: "empty" },
  ], 278),
  leaderboardEntry(6, "maroon_kuri", "#f87171", "🇯🇵", 5888, [
    { kind: "solved", points: 495, time: "9m" },
    { kind: "solved", points: 988, time: "22m" },
    { kind: "solved", points: 1455, time: "44m" },
    { kind: "solved", points: 1995, time: "78m" },
    { kind: "empty" },
    { kind: "empty" },
    { kind: "empty" },
  ], 241),
  leaderboardEntry(7, "neal", "#fb923c", "🇺🇸", 5388, [
    { kind: "solved", points: 495, time: "10m" },
    { kind: "solved", points: 988, time: "25m" },
    { kind: "solved", points: 1455, time: "48m" },
    { kind: "empty" },
    { kind: "empty" },
    { kind: "empty" },
    { kind: "empty" },
  ], 205),
  leaderboardEntry(8, "yosupo", "#ef4444", "🇯🇵", 4888, [
    { kind: "solved", points: 495, time: "12m" },
    { kind: "solved", points: 988, time: "29m" },
    { kind: "solved", points: 1455, time: "55m" },
    { kind: "empty" },
    { kind: "empty" },
    { kind: "empty" },
    { kind: "failed", attempts: 3 },
  ], 168),
  leaderboardEntry(9, "Petr", "#f87171", "🇷🇺", 4388, [
    { kind: "solved", points: 495, time: "15m" },
    { kind: "solved", points: 988, time: "33m" },
    { kind: "empty" },
    { kind: "empty" },
    { kind: "empty" },
    { kind: "empty" },
    { kind: "empty" },
  ], -7),
];

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

  if (template === "contest-ranking") {
    return {
      ...base,
      name: name || "Premier Round 7 Ranking",
      eyebrow: "",
      heading: "",
      subheading: "",
      ctaLabel: "",
      breadcrumbs: ["Contests", "Premier Round 7", "Ranking"],
      items: items([
        { title: "Global", body: "", icon: "globe" },
        { title: "My Country", body: "", icon: "shield" },
        { title: "Following", body: "", icon: "sparkles" },
        { title: "Virtual", body: "", icon: "layers" },
      ]),
      contestProblems: CONTEST_PROBLEMS,
      leaderboardEntries: PREMIER_ROUND_7_ENTRIES,
      hidden: { eyebrow: true, heading: true, subheading: true, cta: true },
      style: {
        ...BASE_STYLE,
        preset: "vercel",
        scheme: "dark",
        background: "#0a0a0a",
        accent: "#ffffff",
        radius: 12,
        maxWidth: 1100,
        showIcons: false,
        padding: 0,
      },
    };
  }

  if (template === "problems-hub") {
    return {
      ...base,
      name: name || "Problems hub",
      eyebrow: "",
      heading: "",
      subheading: "",
      ctaLabel: "",
      items: items([
        { title: "Rounds", body: "", icon: "zap" },
        { title: "Classics", body: "", icon: "layers" },
        { title: "FAANG", body: "", icon: "globe" },
        { title: "Quant", body: "", icon: "gauge" },
        { title: "Status", body: "", icon: "sparkles" },
      ]),
      hidden: { eyebrow: true, heading: true, subheading: true, cta: true },
      style: {
        ...BASE_STYLE,
        preset: "vercel",
        scheme: "dark",
        background: "#000000",
        accent: "#0072f5",
        radius: 12,
        maxWidth: 1200,
        showIcons: false,
        padding: 0,
      },
    };
  }

  if (template === "code-playground") {
    return {
      ...base,
      name: name || "Code playground",
      eyebrow: "",
      heading: "",
      subheading: "",
      ctaLabel: "Run",
      code: BINARY_EXP_LANGUAGES.find((l) => l.id === "python")?.code ?? "",
      menuItems: BINARY_EXP_LANGUAGES.map((l) => l.label),
      toggleLabel: "stdin/stdout",
      items: [],
      hidden: { eyebrow: true, heading: true, subheading: true, cta: true },
      style: {
        ...BASE_STYLE,
        preset: "vercel",
        scheme: "dark",
        background: "#000000",
        accent: "#0072f5",
        radius: 12,
        maxWidth: 1200,
        showIcons: false,
        padding: 0,
        font: "mono",
      },
    };
  }

  if (template === "roadmaps") {
    return {
      ...base,
      name: name || "Roadmaps",
      eyebrow: "",
      heading: "Roadmaps",
      subheading: "",
      ctaLabel: "Join",
      toggleLabel: "6,506",
      items: items([
        { title: "All", body: "", icon: "layers" },
        { title: "Competitive Programming", body: "", icon: "gauge" },
        { title: "Interview Prep", body: "", icon: "sparkles" },
      ]),
      hidden: { eyebrow: true, heading: true, subheading: true },
      style: {
        ...BASE_STYLE,
        preset: "vercel",
        scheme: "dark",
        background: "#000000",
        accent: "#0072f5",
        radius: 12,
        maxWidth: 1200,
        showIcons: false,
        padding: 0,
      },
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
