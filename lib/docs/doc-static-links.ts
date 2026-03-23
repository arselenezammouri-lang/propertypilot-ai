/**
 * Single source for hardcoded /docs/* targets (Aria chat, command palette guides).
 * Article slugs must exist in `docArticles` — see `docs-hub-doc-articles-parity.test.ts`.
 */

/** Command palette "Guide" links (opens in new tab). `g-hub` is the docs index, not an article. */
export const COMMAND_PALETTE_GUIDE_PATHS: Record<
  | 'g-hub'
  | 'g-welcome'
  | 'g-first-listing'
  | 'g-workspace-doc'
  | 'g-perfect-copy'
  | 'g-pipeline'
  | 'g-billing'
  | 'g-arbitrage',
  string
> = {
  'g-hub': '/docs',
  'g-welcome': '/docs/getting-started/welcome',
  'g-first-listing': '/docs/getting-started/first-listing',
  'g-workspace-doc': '/docs/getting-started/workspace-setup',
  'g-perfect-copy': '/docs/getting-started/perfect-copy',
  'g-pipeline': '/docs/crm/pipeline',
  'g-billing': '/docs/account/billing-guide',
  'g-arbitrage': '/docs/prospecting/arbitrage',
};

/**
 * Aria chat: first keyword match wins → suggested doc link.
 * Values `/docs` = hub only (no article slug).
 */
export const ARIA_CHAT_DOC_LINK_BY_KEYWORD: Record<string, string> = {
  sniper: '/docs/price-sniper/sniper-guide',
  arbitraggio: '/docs/prospecting/arbitrage',
  arbitrage: '/docs/prospecting/arbitrage',
  '3d staging': '/docs/3d-staging/staging-guide',
  'virtual staging': '/docs/3d-staging/staging-guide',
  'ai voice': '/docs/ai-voice/call-scripts',
  chiamate: '/docs/ai-voice/call-scripts',
  commercial: '/docs/commercial/commercial-guide',
  territory: '/docs/territory/territory-guide',
  'smart briefing': '/docs/smart-briefing/briefing-guide',
  'x-ray': '/docs/xray/xray-guide',
  xray: '/docs/xray/xray-guide',
  'aura vr': '/docs/aura-vr/vr-guide',
  'aura-vr': '/docs/aura-vr/vr-guide',
  competitor: '/docs/competitor/radar-guide',
  radar: '/docs/competitor/radar-guide',
  aiuto: '/docs',
  help: '/docs',
  supporto: '/docs',
  documenti: '/docs',
  documentazione: '/docs',
};

/** `/docs/foo/bar` → `foo/bar`; `/docs` → null */
export function docArticleSlugFromPath(path: string): string | null {
  if (path === '/docs') return null;
  if (!path.startsWith('/docs/')) return null;
  return path.slice('/docs/'.length);
}
