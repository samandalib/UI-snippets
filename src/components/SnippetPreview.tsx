import { useEffect, useRef, useState } from 'react'
import { renderSnippetDocument } from '@/lib/snippets'
import type { Snippet } from '@/lib/snippets'

interface SnippetPreviewProps {
  snippet: Snippet
  className?: string
  title?: string
  pageWidth?: number
  pageHeight?: number
}

export function SnippetPreview({
  snippet,
  className = '',
  title,
  pageWidth = 1280,
  pageHeight = 760,
}: SnippetPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  const html = renderSnippetDocument(snippet, { transparentPage: true })

  useEffect(() => {
    if (!containerRef.current) return

    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const hostWidth = entry.contentRect.width
        const newScale = Math.min(1, hostWidth / pageWidth)
        setScale(newScale)
      }
    })

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [pageWidth])

  return (
    <div
      ref={containerRef}
      className={`bg-gray-200 p-4 rounded-lg ${className}`}
      style={{
        height: `${pageHeight * scale}px`,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: `${pageWidth}px`,
          height: `${pageHeight}px`,
          backgroundImage: 'linear-gradient(45deg, #888 25%, transparent 25%, transparent 75%, #888 75%, #888), linear-gradient(45deg, #888 25%, transparent 25%, transparent 75%, #888 75%, #888)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 10px 10px',
          backgroundColor: '#eee',
        }}
      >
        <iframe
          srcDoc={html}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: 'block',
          }}
          title={title}
        />
      </div>
    </div>
  )
}
