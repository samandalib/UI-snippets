import { useEffect, useState } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { SnippetPreview } from '@/components/SnippetPreview'
import { SnippetControls } from '@/components/SnippetControls'
import { getSnippet, saveSnippet, renderSnippetFragment, renderSnippetDocument, downloadFile, slugify } from '@/lib/snippets'
import type { Snippet } from '@/lib/snippets'

export default function SnippetEditor() {
  const { id } = useParams({ from: '/snippets/$id' })
  const navigate = useNavigate()
  const [snippet, setSnippet] = useState<Snippet | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const loaded = getSnippet(id)
    if (loaded) {
      setSnippet(loaded)
    } else {
      navigate({ to: '/' })
    }
  }, [id, navigate])

  const handleSnippetChange = (updated: Snippet) => {
    setSnippet(updated)
    const timer = setTimeout(() => {
      saveSnippet(updated)
    }, 500)
    return () => clearTimeout(timer)
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    } catch {
      console.error('Failed to copy')
    }
  }

  if (!snippet) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  const fragment = renderSnippetFragment(snippet)
  const fullPage = renderSnippetDocument(snippet)

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate({ to: '/' })}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              ← Back
            </button>
            <input
              type="text"
              value={snippet.name}
              onChange={e =>
                handleSnippetChange({
                  ...snippet,
                  name: e.target.value,
                })
              }
              className="text-xl font-bold bg-transparent border-0 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobile(!isMobile)}
              className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded"
            >
              {isMobile ? '📱 Mobile' : '🖥️ Desktop'}
            </button>

            <button
              onClick={() => copyToClipboard(fragment, 'embed')}
              className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {copied === 'embed' ? '✓ Copied' : 'Copy Embed'}
            </button>

            <button
              onClick={() => copyToClipboard(fullPage, 'full')}
              className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {copied === 'full' ? '✓ Copied' : 'Copy Page'}
            </button>

            <button
              onClick={() =>
                downloadFile(`${slugify(snippet.name)}.html`, 'text/html', fullPage)
              }
              className="px-4 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600"
            >
              ⬇️ Download
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Controls Sidebar */}
        <div className="w-96 bg-white overflow-y-auto border-r shadow-sm">
          <SnippetControls snippet={snippet} onChange={handleSnippetChange} />
        </div>

        {/* Preview */}
        <div className="flex-1 p-6 overflow-y-auto">
          <SnippetPreview
            snippet={snippet}
            pageWidth={isMobile ? 390 : 1280}
            pageHeight={isMobile ? 780 : 760}
            className="mx-auto"
          />
        </div>
      </div>
    </div>
  )
}
