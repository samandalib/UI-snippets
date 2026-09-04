import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { FileText, LayoutList, Map, Play, Plus, SquareStack, Trophy } from "lucide-react";
import {
  ensurePlaygroundSnippet,
  ensurePremierRound7Snippet,
  ensureProblemsHubSnippet,
  ensureRoadmapsSnippet,
  saveSnippet,
} from "@/lib/snippets/store";
import { createSnippet } from "@/lib/snippets/templates";
import { TEMPLATE_BLURBS, TEMPLATE_LABELS } from "@/lib/snippets/types";
import type { TemplateId } from "@/lib/snippets/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Snippet Studio — Embeddable Feature Showcases" },
      {
        name: "description",
        content:
          "Create, edit and store embeddable product feature showcase snippets, then copy self-contained HTML into any website.",
      },
      { property: "og:title", content: "Snippet Studio — Embeddable Feature Showcases" },
      {
        property: "og:description",
        content: "Build product feature showcase blocks and copy them as self-contained HTML.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Library,
});

function Library() {
  const navigate = useNavigate();

  useEffect(() => {
    ensurePremierRound7Snippet();
    ensureProblemsHubSnippet();
    ensurePlaygroundSnippet();
    ensureRoadmapsSnippet();
  }, []);

  const openPremierRound7 = () => {
    const snippet = ensurePremierRound7Snippet();
    navigate({ to: "/snippets/$id", params: { id: snippet.id } });
  };

  const openProblemsHub = () => {
    const snippet = ensureProblemsHubSnippet();
    navigate({ to: "/snippets/$id", params: { id: snippet.id } });
  };

  const openPlayground = () => {
    const snippet = ensurePlaygroundSnippet();
    navigate({ to: "/snippets/$id", params: { id: snippet.id } });
  };

  const openRoadmaps = () => {
    const snippet = ensureRoadmapsSnippet();
    navigate({ to: "/snippets/$id", params: { id: snippet.id } });
  };

  const start = (template: TemplateId) => {
    const snippet = createSnippet(template, `${TEMPLATE_LABELS[template]} snippet`);
    saveSnippet(snippet);
    navigate({ to: "/snippets/$id", params: { id: snippet.id } });
  };

  return (
    <main className="min-h-screen bg-background px-6 py-14">
      <div className="mx-auto max-w-6xl">
        <header className="max-w-2xl">
          <p className="text-[0.65rem] uppercase tracking-[0.4em] text-muted-foreground">
            Snippet Studio
          </p>
          <h1 className="mt-4 text-3xl font-light tracking-tight text-foreground sm:text-4xl">
            Embeddable product feature showcases
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Start from a template, edit the copy and styling, then copy a self-contained HTML block
            into your marketing site.
          </p>
          <a
            href="/snippet-studio-source.pdf"
            download="snippet-studio-source.pdf"
            className="mt-6 inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-xs text-foreground transition-colors hover:border-foreground/50"
          >
            <FileText className="size-4" /> Download codebase (.pdf)
          </a>
        </header>


        <section className="mt-14">
          <h2 className="text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground">
            Featured
          </h2>
          <div className="mt-5 grid max-w-xl gap-3">
          <button
            type="button"
            onClick={openPremierRound7}
            className="group flex w-full rounded-xl border border-foreground/30 bg-card/60 p-5 text-left transition-colors hover:border-foreground/50"
          >
            <div className="flex items-start justify-between w-full">
              <div>
                <div className="flex items-center gap-2">
                  <Trophy className="size-4 text-foreground" />
                  <h3 className="text-sm text-foreground">Premier Round 7 Ranking</h3>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  Competitive programming leaderboard with sidebar, tabs, and problem score grid.
                </p>
              </div>
              <Plus className="size-4 text-muted-foreground transition-colors group-hover:text-foreground" />
            </div>
          </button>
          <button
            type="button"
            onClick={openProblemsHub}
            className="group flex w-full rounded-xl border border-foreground/30 bg-card/60 p-5 text-left transition-colors hover:border-foreground/50"
          >
            <div className="flex items-start justify-between w-full">
              <div>
                <div className="flex items-center gap-2">
                  <LayoutList className="size-4 text-foreground" />
                  <h3 className="text-sm text-foreground">Problems hub</h3>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  Five-tab problem browser with filters, companies, and a live status feed.
                </p>
              </div>
              <Plus className="size-4 text-muted-foreground transition-colors group-hover:text-foreground" />
            </div>
          </button>
          <button
            type="button"
            onClick={openPlayground}
            className="group flex w-full rounded-xl border border-foreground/30 bg-card/60 p-5 text-left transition-colors hover:border-foreground/50"
          >
            <div className="flex items-start justify-between w-full">
              <div>
                <div className="flex items-center gap-2">
                  <Play className="size-4 text-foreground" />
                  <h3 className="text-sm text-foreground">Code playground</h3>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  Editor with language picker, stdin/stdout panes, and a Run action.
                </p>
              </div>
              <Plus className="size-4 text-muted-foreground transition-colors group-hover:text-foreground" />
            </div>
          </button>
          <button
            type="button"
            onClick={openRoadmaps}
            className="group flex w-full rounded-xl border border-foreground/30 bg-card/60 p-5 text-left transition-colors hover:border-foreground/50"
          >
            <div className="flex items-start justify-between w-full">
              <div>
                <div className="flex items-center gap-2">
                  <Map className="size-4 text-foreground" />
                  <h3 className="text-sm text-foreground">Roadmaps</h3>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  Learning roadmap grid with category filters, sketches, and learner counts.
                </p>
              </div>
              <Plus className="size-4 text-muted-foreground transition-colors group-hover:text-foreground" />
            </div>
          </button>
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground">
            Start a new snippet
          </h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            {(Object.keys(TEMPLATE_LABELS) as TemplateId[]).map((template) => (
              <button
                key={template}
                type="button"
                onClick={() => start(template)}
                className="group rounded-xl border border-border bg-card/40 p-5 text-left transition-colors hover:border-foreground/40"
              >
                <div className="flex items-start justify-between">
                  <SquareStack className="size-4 text-muted-foreground transition-colors group-hover:text-foreground" />
                  <Plus className="size-4 text-muted-foreground transition-colors group-hover:text-foreground" />
                </div>
                <h3 className="mt-6 text-sm text-foreground">{TEMPLATE_LABELS[template]}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  {TEMPLATE_BLURBS[template]}
                </p>
              </button>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
