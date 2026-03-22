/** Single blog post placeholder page (/blog/[slug]) */

export type BlogPostPageUi = {
  backToBlog: string;
  comingSoonLine: string;
  comingSoonBody: string;
  moreArticles: string;
  /** H1 for known slugs; unknown slugs → title-case from slug in component */
  knownTitles: Record<string, string>;
};

const knownTitlesIt: Record<string, string> = {
  'come-scrivere-annunci-che-convertono': 'Come scrivere annunci che convertono',
  'ai-per-agenzie-immobiliari': 'AI per agenzie immobiliari: guida pratica',
  'crm-immobiliare-automatizzato': 'CRM immobiliare automatizzato',
};

const knownTitlesEn: Record<string, string> = {
  'come-scrivere-annunci-che-convertono': 'How to write listings that convert',
  'ai-per-agenzie-immobiliari': 'AI for real estate agencies: practical guide',
  'crm-immobiliare-automatizzato': 'Automated real estate CRM',
};

export const blogPostPageUiIt: BlogPostPageUi = {
  backToBlog: 'Torna al blog',
  comingSoonLine: 'Articolo in arrivo. Resta sintonizzato!',
  comingSoonBody:
    'Questo articolo è in fase di preparazione. Torneremo presto con contenuti di valore per agenti immobiliari.',
  moreArticles: 'Altri articoli',
  knownTitles: knownTitlesIt,
};

export const blogPostPageUiEn: BlogPostPageUi = {
  backToBlog: 'Back to blog',
  comingSoonLine: 'Article coming soon. Stay tuned!',
  comingSoonBody:
    'This article is being prepared. We will be back soon with valuable content for real estate agents.',
  moreArticles: 'More articles',
  knownTitles: knownTitlesEn,
};
