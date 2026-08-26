import type { IconKey } from './types'

export const ICON_PATHS: Record<IconKey, string> = {
  zap: 'M13 2L3 14H12L11 22L21 10H12L13 2Z',
  shield: 'M12 22C12 22 3 18 3 10V5L12 2L21 5V10C21 18 12 22 12 22Z',
  sparkles: 'M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z',
  game: 'M6 6H18C18.5304 6 19.0391 6.21071 19.4142 6.58579C19.7893 6.96086 20 7.46957 20 8V16C20 16.5304 19.7893 17.0391 19.4142 17.4142C19.0391 17.7893 18.5304 18 18 18H6C5.46957 18 4.96086 17.7893 4.58579 17.4142C4.21071 17.0391 4 16.5304 4 16V8C4 7.46957 4.21071 6.96086 4.58579 6.58579C4.96086 6.21071 5.46957 6 6 6ZM9 13H7V15H9V13ZM15 9H13V11H15V9Z',
}

export function getIconSvg(key: IconKey): string {
  const path = ICON_PATHS[key]
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="${path}"/></svg>`
}
