import type { Snippet, SnippetItem, TemplateId, SnippetStyle } from './types'

const BASE_STYLE: SnippetStyle = {
  preset: 'studio',
  scheme: 'dark',
  background: 'transparent',
  accent: '#6ee7b7',
  radius: 14,
  columns: 3,
  font: 'sans',
  maxWidth: 960,
  showIcons: true,
  padding: 56,
}

export const ACCENT_PRESETS = ['#6ee7b7', '#3b82f6', '#f97316', '#ec4899', '#8b5cf6']

export function newItem(): SnippetItem {
  return {
    id: Math.random().toString(36).slice(2, 9),
    title: 'New item',
    body: 'Add a description',
    icon: 'sparkles',
  }
}

export function createSnippet(template: TemplateId, name?: string): Snippet {
  const baseId = Math.random().toString(36).slice(2, 9)
  const now = Date.now()

  const templates: Record<TemplateId, Partial<Snippet>> = {
    'feature-grid': {
      eyebrow: 'FEATURES',
      heading: 'Built for developers',
      subheading: 'Everything you need to showcase your product.',
      ctaLabel: 'Get started',
      ctaHref: '#',
      items: [
        {
          id: '1',
          title: 'Fast',
          body: 'Lightning quick performance',
          icon: 'zap',
        },
        {
          id: '2',
          title: 'Secure',
          body: 'Enterprise-grade security',
          icon: 'shield',
        },
        {
          id: '3',
          title: 'Scalable',
          body: 'Grows with your needs',
          icon: 'sparkles',
        },
      ],
    },
    'feature-split': {
      eyebrow: 'WHY US',
      heading: 'The best choice',
      subheading: 'Trusted by thousands of developers worldwide.',
      ctaLabel: 'Learn more',
      ctaHref: '#',
      items: [
        { id: '1', title: 'Built for speed', body: '', icon: 'zap' },
        { id: '2', title: 'Security first', body: '', icon: 'shield' },
        { id: '3', title: 'Always improving', body: '', icon: 'sparkles' },
      ],
    },
    'stat-row': {
      eyebrow: 'BY THE NUMBERS',
      heading: 'Growing fast',
      subheading: 'Join thousands of satisfied users.',
      ctaLabel: 'Start free',
      ctaHref: '#',
      items: [
        { id: '1', title: '10K+', body: 'Active users', icon: 'game' },
        { id: '2', title: '99.9%', body: 'Uptime', icon: 'shield' },
        { id: '3', title: '24/7', body: 'Support', icon: 'sparkles' },
      ],
    },
    'code-demo': {
      eyebrow: 'API',
      heading: 'Simple to use',
      subheading: 'Get started in minutes.',
      ctaLabel: 'View docs',
      ctaHref: '#',
      items: [
        {
          id: '1',
          title: 'import { generateText }',
          body: 'from "ai"',
          icon: 'zap',
        },
        {
          id: '2',
          title: 'const result = await',
          body: 'generateText({ ... })',
          icon: 'shield',
        },
      ],
      code: 'const result = await generateText({\n  model: model("gpt-4"),\n  prompt: "Hello world",\n});',
      menuItems: ['GPT-4', 'Claude 3', 'Gemini'],
      toggleLabel: 'Streaming',
    },
  }

  const snippet = templates[template] || templates['feature-grid']

  return {
    id: baseId,
    name: name || `${template} snippet`,
    template,
    eyebrow: snippet.eyebrow || 'SECTION',
    heading: snippet.heading || 'Main heading',
    subheading: snippet.subheading || 'Add your description here',
    ctaLabel: snippet.ctaLabel || 'Button',
    ctaHref: snippet.ctaHref || '#',
    items: snippet.items || [newItem()],
    style: BASE_STYLE,
    code: snippet.code,
    menuItems: snippet.menuItems,
    toggleLabel: snippet.toggleLabel,
    createdAt: now,
    updatedAt: now,
  }
}
