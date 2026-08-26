import { useNavigate } from '@tanstack/react-router'
import { createSnippet, saveSnippet, TEMPLATE_LABELS, TEMPLATE_BLURBS } from '@/lib/snippets'
import type { TemplateId } from '@/lib/snippets'

export default function Home() {
  const navigate = useNavigate()
  const templates: TemplateId[] = ['feature-grid', 'feature-split', 'stat-row', 'code-demo']

  const handleCreateSnippet = async (template: TemplateId) => {
    const snippet = createSnippet(template)
    saveSnippet(snippet)
    navigate({ to: `/snippets/$${snippet.id}` })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Snippet Studio</h1>
          <p className="text-lg text-gray-600">
            Create embeddable product feature showcase blocks for your marketing sites
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {templates.map(template => (
            <button
              key={template}
              onClick={() => handleCreateSnippet(template)}
              className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition border border-gray-200 text-left"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {TEMPLATE_LABELS[template]}
              </h2>
              <p className="text-gray-600 mb-4">{TEMPLATE_BLURBS[template]}</p>
              <span className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                Create
              </span>
            </button>
          ))}
        </div>

        <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-bold text-gray-900 mb-2">Features</h3>
          <ul className="space-y-1 text-sm text-gray-700">
            <li>✓ Four professional layout templates</li>
            <li>✓ Four built-in design system presets</li>
            <li>✓ Real-time preview with live editing</li>
            <li>✓ Export as HTML, copy embed code, or download</li>
            <li>✓ Auto-save to browser storage</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
