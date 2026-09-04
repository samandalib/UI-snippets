import { useEffect, useState } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check, Code2, Copy, Download, Monitor, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { ContentEditor, StyleEditor } from "@/components/SnippetControls";
import { SnippetPreview } from "@/components/SnippetPreview";
import { downloadFile, renderSnippetDocument, renderSnippetFragment, slugify } from "@/lib/snippets/render";
import { getSnippet, saveSnippet } from "@/lib/snippets/store";
import type { Snippet } from "@/lib/snippets/types";

export const Route = createFileRoute("/snippets/$id")({
  head: () => ({
    meta: [
      { title: "Edit snippet — Snippet Studio" },
      {
        name: "description",
        content:
          "Edit a product feature showcase snippet: copy, layout and colors, with a live preview and self-contained HTML export.",
      },
      { property: "og:title", content: "Edit snippet — Snippet Studio" },
      {
        property: "og:description",
        content: "Tune copy, layout and colors, then export self-contained embeddable HTML.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Editor,
});

type Tab = "content" | "style";

function Editor() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [missing, setMissing] = useState(false);
  const [tab, setTab] = useState<Tab>("content");
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [copied, setCopied] = useState<"fragment" | "document" | null>(null);

  useEffect(() => {
    const found = getSnippet(id);
    if (found) setSnippet(found);
    else setMissing(true);
  }, [id]);

  useEffect(() => {
    if (!snippet) return;
    const timer = window.setTimeout(() => saveSnippet(snippet), 400);
    return () => window.clearTimeout(timer);
  }, [snippet]);

  if (missing) {
    return (
      <main className="grid min-h-screen place-items-center bg-background px-6 text-center">
        <div>
          <h1 className="text-2xl font-light text-foreground">Snippet not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            It may have been deleted from this browser.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm text-foreground transition-colors hover:border-foreground/50"
          >
            <ArrowLeft className="size-4" /> Back to library
          </Link>
        </div>
      </main>
    );
  }

  if (!snippet) {
    return <main className="min-h-screen bg-background" />;
  }

  const copy = async (kind: "fragment" | "document") => {
    const text =
      kind === "fragment" ? renderSnippetFragment(snippet) : renderSnippetDocument(snippet);
    await navigator.clipboard.writeText(text);
    setCopied(kind);
    toast.success(kind === "fragment" ? "Embed HTML copied" : "Full page HTML copied");
    window.setTimeout(() => setCopied(null), 1600);
  };

  return (
    <main className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
          <div className="flex min-w-0 items-center gap-4">
            <button
              type="button"
              aria-label="Back to library"
              onClick={() => navigate({ to: "/" })}
              className="rounded-md border border-border p-2 text-muted-foreground transition-colors hover:border-foreground/50 hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
            </button>
            <input
              value={snippet.name}
              aria-label="Snippet name"
              onChange={(e) => setSnippet({ ...snippet, name: e.target.value })}
              className="min-w-0 flex-1 bg-transparent text-lg font-light text-foreground outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="mr-1 flex items-center rounded-md border border-border p-0.5">
              {(
                [
                  ["desktop", Monitor],
                  ["mobile", Smartphone],
                ] as const
              ).map(([key, Icon]) => (
                <button
                  key={key}
                  type="button"
                  aria-label={`${key} preview`}
                  onClick={() => setDevice(key)}
                  className={`rounded p-1.5 transition-colors ${
                    device === key
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="size-4" />
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => copy("fragment")}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-3.5 py-2 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              {copied === "fragment" ? <Check className="size-3.5" /> : <Code2 className="size-3.5" />}
              Copy embed HTML
            </button>
            <button
              type="button"
              onClick={() => copy("document")}
              className="inline-flex items-center gap-2 rounded-md border border-border px-3.5 py-2 text-xs text-foreground transition-colors hover:border-foreground/50"
            >
              {copied === "document" ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              Copy full page
            </button>
            <button
              type="button"
              onClick={() =>
                downloadFile(
                  `${slugify(snippet.name)}.html`,
                  "text/html",
                  renderSnippetDocument(snippet),
                )
              }
              className="inline-flex items-center gap-2 rounded-md border border-border px-3.5 py-2 text-xs text-foreground transition-colors hover:border-foreground/50"
            >
              <Download className="size-3.5" /> Download
            </button>
          </div>
        </header>

        <div className="mt-8 grid gap-8 lg:grid-cols-[340px_1fr]">
          <aside className="rounded-xl border border-border bg-card/40 p-5">
            <div className="mb-5 flex items-center rounded-md border border-border p-0.5">
              {(["content", "style"] as Tab[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTab(key)}
                  className={`flex-1 rounded px-3 py-1.5 text-xs capitalize transition-colors ${
                    tab === key
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>

            {tab === "content" ? (
              <ContentEditor snippet={snippet} onChange={setSnippet} />
            ) : (
              <StyleEditor snippet={snippet} onChange={setSnippet} />
            )}
          </aside>

          <section className="min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground">
                Live preview
              </p>
              <p className="text-xs text-muted-foreground">Saved automatically</p>
            </div>
            <div className="mt-4 rounded-xl border border-border bg-card/20 p-4">
              <SnippetPreview
                snippet={snippet}
                title={`${snippet.name} live preview`}
                pageWidth={device === "mobile" ? 390 : 1280}
                pageHeight={
                  device === "mobile"
                    ? 780
                    : snippet.template === "problems-hub" ||
                        snippet.template === "code-playground" ||
                        snippet.template === "roadmaps"
                      ? 860
                      : 760
                }
                className={`mx-auto overflow-hidden rounded-lg border border-border ${
                  device === "mobile" ? "w-[390px]" : "w-full"
                }`}
              />
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              The embed HTML is self-contained — paste it anywhere in your page body, or drop the
              downloaded file into an iframe. No scripts, fonts or network requests.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
