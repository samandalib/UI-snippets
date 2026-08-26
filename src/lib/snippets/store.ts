import type { Snippet } from './types'

const STORAGE_KEY = 'feature-snippets-v1'

type StoreCallback = (snippets: Snippet[]) => void

const listeners = new Set<StoreCallback>()

function getStorage(): Snippet[] {
  if (typeof window === 'undefined') return []

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function setStorage(snippets: Snippet[]) {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snippets))
    // Dispatch custom event for cross-tab sync
    window.dispatchEvent(new CustomEvent('snippets:changed', { detail: snippets }))
    listeners.forEach(cb => cb(snippets))
  } catch {
    console.error('Failed to save to localStorage')
  }
}

export function listSnippets(): Snippet[] {
  const snippets = getStorage()
  return snippets.sort((a, b) => b.updatedAt - a.updatedAt)
}

export function getSnippet(id: string): Snippet | null {
  const snippets = getStorage()
  return snippets.find(s => s.id === id) || null
}

export function saveSnippet(snippet: Snippet): void {
  const snippets = getStorage()
  const index = snippets.findIndex(s => s.id === snippet.id)

  const updated = {
    ...snippet,
    updatedAt: Date.now(),
  }

  if (index >= 0) {
    snippets[index] = updated
  } else {
    snippets.push(updated)
  }

  setStorage(snippets)
}

export function deleteSnippet(id: string): void {
  const snippets = getStorage().filter(s => s.id !== id)
  setStorage(snippets)
}

export function duplicateSnippet(id: string): Snippet | null {
  const original = getSnippet(id)
  if (!original) return null

  const newId = Math.random().toString(36).slice(2, 9)
  const now = Date.now()

  const duplicate: Snippet = {
    ...original,
    id: newId,
    name: `${original.name} (copy)`,
    createdAt: now,
    updatedAt: now,
  }

  saveSnippet(duplicate)
  return duplicate
}

export function subscribe(callback: StoreCallback): () => void {
  listeners.add(callback)

  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      const snippets = getStorage()
      callback(snippets)
    }
  }

  const handleCustomEvent = (e: Event) => {
    if (e instanceof CustomEvent) {
      callback(e.detail)
    }
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('snippets:changed', handleCustomEvent)
  }

  return () => {
    listeners.delete(callback)
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('snippets:changed', handleCustomEvent)
    }
  }
}
