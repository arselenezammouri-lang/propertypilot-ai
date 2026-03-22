/** `/dashboard/lead-score` — copy for category badges, chrome (no emoji). */

export type LeadScorePageUi = {
  backToDashboard: string;
  marketItaly: string;
  marketUsa: string;
  cacheBadge: string;
  headerPriorityBadge: string;
  categoryHot: string;
  categoryWarm: string;
  categoryCold: string;
  categoryDefault: string;
  planFree: string;
  planStarter: string;
  planPro: string;
  planAgency: string;
};

export const leadScorePageUiIt: LeadScorePageUi = {
  backToDashboard: 'Torna alla dashboard',
  marketItaly: 'Italia',
  marketUsa: 'USA',
  cacheBadge: 'Risultato dalla cache (24h)',
  headerPriorityBadge: 'Priorità',
  categoryHot: 'Lead caldo',
  categoryWarm: 'Lead tiepido',
  categoryCold: 'Lead freddo',
  categoryDefault: 'Lead',
  planFree: 'Free',
  planStarter: 'Starter',
  planPro: 'Pro',
  planAgency: 'Agency',
};

export const leadScorePageUiEn: LeadScorePageUi = {
  backToDashboard: 'Back to dashboard',
  marketItaly: 'Italy',
  marketUsa: 'USA',
  cacheBadge: 'Result from cache (24h)',
  headerPriorityBadge: 'Priority',
  categoryHot: 'Hot lead',
  categoryWarm: 'Warm lead',
  categoryCold: 'Cold lead',
  categoryDefault: 'Lead',
  planFree: 'Free',
  planStarter: 'Starter',
  planPro: 'Pro',
  planAgency: 'Agency',
};
