/**
 * API paths that trigger extra Edge rate limiting (OpenAI / heavy compute).
 * Keep in sync with high-cost routes; POST-only in middleware.
 */

const PREFIXES = [
  '/api/generate-perfect-copy',
  '/api/communications/generate',
  '/api/aria/chat',
  '/api/agency-chatbot',
  '/api/analyze-link',
  '/api/audit-listing',
  '/api/scrape-listing',
  '/api/refine-listing',
  '/api/translate-listing',
  '/api/lead-score',
  '/api/leads/enrich',
  '/api/automations/execute',
  '/api/prospecting/virtual-staging',
  '/api/prospecting/automate',
] as const;

export function isAiCostlyApiPath(pathname: string): boolean {
  if (
    pathname === '/api/generate' ||
    pathname.startsWith('/api/generate/') ||
    pathname.startsWith('/api/generate-')
  ) {
    return true;
  }
  for (const pre of PREFIXES) {
    if (pathname === pre || pathname.startsWith(`${pre}/`)) {
      return true;
    }
  }
  return false;
}
