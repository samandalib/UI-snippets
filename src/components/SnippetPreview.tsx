import { useEffect, useMemo, useRef, useState } from "react";
import { renderSnippetDocument } from "@/lib/snippets/render";
import type { Snippet } from "@/lib/snippets/types";

/**
 * Renders the exported document at a real page width and scales it down to fit,
 * so the preview matches what the downloaded HTML looks like in a browser.
 */
export function SnippetPreview({
  snippet,
  className,
  title = "Snippet preview",
  pageWidth = 1280,
  pageHeight = 760,
}: {
  snippet: Snippet;
  className?: string;
  title?: string;
  pageWidth?: number;
  pageHeight?: number;
}) {
  const doc = useMemo(() => renderSnippetDocument(snippet, { transparentPage: true }), [snippet]);
  const hostRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const measure = () => setScale(Math.min(1, host.clientWidth / pageWidth));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(host);
    return () => observer.disconnect();
  }, [pageWidth]);

  return (
    <div
      ref={hostRef}
      className={`min-w-0 ${className ?? "w-full"}`}
      style={{
        height: pageHeight * scale,
        overflow: "hidden",
        backgroundColor: "hsl(var(--muted, 0 0% 50%) / 0.25)",
        backgroundImage:
          "linear-gradient(45deg, rgba(127,127,127,.18) 25%, transparent 25%, transparent 75%, rgba(127,127,127,.18) 75%), linear-gradient(45deg, rgba(127,127,127,.18) 25%, transparent 25%, transparent 75%, rgba(127,127,127,.18) 75%)",
        backgroundSize: "16px 16px",
        backgroundPosition: "0 0, 8px 8px",
      }}
    >
      <iframe
        title={title}
        srcDoc={doc}
        sandbox="allow-same-origin"
        style={{
          width: pageWidth,
          height: pageHeight,
          border: "0",
          background: "transparent",
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      />
    </div>
  );
}
