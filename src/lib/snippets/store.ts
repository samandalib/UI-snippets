import { createSnippet } from "./templates";
import type { Snippet } from "./types";

const KEY = "feature-snippets.v1";

function isBrowser() {
  return typeof window !== "undefined";
}

function read(): Snippet[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Snippet[]) : [];
  } catch {
    return [];
  }
}

function write(list: Snippet[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new Event("snippets:changed"));
}

export function listSnippets(): Snippet[] {
  return read().sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getSnippet(id: string): Snippet | undefined {
  return read().find((s) => s.id === id);
}

export function saveSnippet(snippet: Snippet) {
  const list = read();
  const next = { ...snippet, updatedAt: Date.now() };
  const index = list.findIndex((s) => s.id === snippet.id);
  if (index === -1) list.push(next);
  else list[index] = next;
  write(list);
}

export function deleteSnippet(id: string) {
  write(read().filter((s) => s.id !== id));
}

export function duplicateSnippet(id: string): Snippet | undefined {
  const source = read().find((s) => s.id === id);
  if (!source) return undefined;
  const copy = {
    ...createSnippet(source.template),
    ...source,
    id: Math.random().toString(36).slice(2, 10),
    name: `${source.name} copy`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  const list = read();
  list.push(copy);
  write(list);
  return copy;
}

/** Creates the Premier Round 7 ranking snippet once, or returns the existing copy. */
export function ensurePremierRound7Snippet(): Snippet {
  const list = read();
  const existing = list.find(
    (s) => s.template === "contest-ranking" && s.name === "Premier Round 7 Ranking",
  );
  if (existing) return existing;
  const snippet = createSnippet("contest-ranking", "Premier Round 7 Ranking");
  write([snippet, ...list]);
  return snippet;
}

export function ensureProblemsHubSnippet(): Snippet {
  const list = read();
  const existing = list.find(
    (s) => s.template === "problems-hub" && s.name === "Problems hub",
  );
  if (existing) return existing;
  const snippet = createSnippet("problems-hub", "Problems hub");
  write([snippet, ...list]);
  return snippet;
}

export function ensurePlaygroundSnippet(): Snippet {
  const list = read();
  const existing = list.find(
    (s) => s.template === "code-playground" && s.name === "Code playground",
  );
  if (existing) return existing;
  const snippet = createSnippet("code-playground", "Code playground");
  write([snippet, ...list]);
  return snippet;
}

export function subscribe(fn: () => void): () => void {
  if (!isBrowser()) return () => {};
  window.addEventListener("snippets:changed", fn);
  window.addEventListener("storage", fn);
  return () => {
    window.removeEventListener("snippets:changed", fn);
    window.removeEventListener("storage", fn);
  };
}
