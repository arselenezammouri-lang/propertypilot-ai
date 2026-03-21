/**
 * Copy for API/network failures shown as toasts — feature-scoped title + next step (Fase A4).
 */

export type FeedbackLocale = 'it' | 'en';

export type ApiFeatureId =
  | 'perfectCopy'
  | 'leadManager'
  | 'listingsLibrary'
  | 'refineListing'
  | 'translateListing'
  | 'titleGenerator'
  | 'emotionalListing'
  | 'socialPosts'
  | 'hashtagGenerator'
  | 'followupEmails'
  | 'videoScripts'
  | 'agentBio'
  | 'pdfSheets'
  | 'leadScoring'
  | 'leadPipeline'
  | 'leadDetail'
  | 'workflowAutomations'
  | 'crmAutomationRules'
  | 'linkAnalysis'
  | 'listingScraper'
  | 'listingAuditor';

export type ApiFailureInput = {
  status?: number;
  error?: string;
  message?: string;
};

const featureLabel: Record<ApiFeatureId, Record<FeedbackLocale, string>> = {
  perfectCopy: { it: 'Perfect Copy', en: 'Perfect Copy' },
  leadManager: { it: 'CRM Lead', en: 'Lead CRM' },
  listingsLibrary: { it: 'Libreria annunci', en: 'Listing library' },
  refineListing: { it: 'Perfect Again', en: 'Perfect Again' },
  translateListing: { it: 'Traduttore annunci', en: 'Listing translator' },
  titleGenerator: { it: 'Titoli A/B', en: 'A/B titles' },
  emotionalListing: { it: 'Annuncio emozionale', en: 'Emotional listing' },
  socialPosts: { it: 'Post social', en: 'Social posts' },
  hashtagGenerator: { it: 'Hashtag', en: 'Hashtags' },
  followupEmails: { it: 'Follow-up email', en: 'Follow-up emails' },
  videoScripts: { it: 'Script video', en: 'Video scripts' },
  agentBio: { it: 'Bio agente', en: 'Agent bio' },
  pdfSheets: { it: 'Schede PDF', en: 'PDF sheets' },
  leadScoring: { it: 'Lead scoring', en: 'Lead scoring' },
  leadPipeline: { it: 'Pipeline lead', en: 'Lead pipeline' },
  leadDetail: { it: 'Scheda lead', en: 'Lead record' },
  workflowAutomations: { it: 'Workflow automazioni', en: 'Automation workflows' },
  crmAutomationRules: { it: 'Regole CRM', en: 'CRM automation rules' },
  linkAnalysis: { it: 'Analisi da link', en: 'Link analysis' },
  listingScraper: { it: 'Import annunci', en: 'Listing import' },
  listingAuditor: { it: 'Audit annuncio', en: 'Listing audit' },
};

function label(feature: ApiFeatureId, locale: FeedbackLocale): string {
  return featureLabel[feature][locale];
}

/**
 * Toast content when `fetchApi` returns success: false or thrown HTTP-like error.
 */
export function apiFailureToast(
  locale: FeedbackLocale,
  feature: ApiFeatureId,
  failure: ApiFailureInput,
  fallbackDescription: string
): { title: string; description: string } {
  const L = label(feature, locale);
  const st = failure.status;
  const serverText = [failure.message, failure.error].find(
    (s) => typeof s === 'string' && s.trim().length > 0
  );

  if (st === 401) {
    return {
      title: locale === 'it' ? `${L} — Accesso richiesto` : `${L} — Sign-in required`,
      description:
        locale === 'it'
          ? 'Sessione scaduta o non valida. Effettua di nuovo l’accesso e riprova.'
          : 'Your session expired or is invalid. Sign in again and try again.',
    };
  }

  if (st === 429) {
    return {
      title: locale === 'it' ? `${L} — Limite richieste` : `${L} — Rate limit`,
      description:
        locale === 'it'
          ? 'Troppe richieste in poco tempo. Attendi un minuto e riprova.'
          : 'Too many requests in a short window. Wait a minute and try again.',
    };
  }

  if (st === 404) {
    return {
      title: locale === 'it' ? `${L} — Non trovato` : `${L} — Not found`,
      description:
        serverText ||
        (locale === 'it'
          ? 'La risorsa non esiste o non è più disponibile. Aggiorna la pagina.'
          : 'The resource is missing or no longer available. Refresh the page.'),
    };
  }

  if (st === 503 || st === 502) {
    return {
      title: locale === 'it' ? `${L} — Servizio in pausa` : `${L} — Service unavailable`,
      description:
        locale === 'it'
          ? 'Il servizio non risponde. Riprova tra qualche minuto.'
          : 'The service is not responding. Please try again in a few minutes.',
    };
  }

  if (st !== undefined && st >= 500) {
    return {
      title: locale === 'it' ? `${L} — Errore server` : `${L} — Server error`,
      description:
        serverText ||
        (locale === 'it'
          ? 'Problema temporaneo lato server. Riprova tra poco.'
          : 'A temporary server issue occurred. Please try again shortly.'),
    };
  }

  const desc =
    serverText ||
    (fallbackDescription +
      (locale === 'it'
        ? ' Se continua, aggiorna la pagina.'
        : ' If it persists, refresh the page.'));

  return {
    title: locale === 'it' ? `${L} — Operazione non riuscita` : `${L} — Could not complete`,
    description: desc.trim(),
  };
}

/**
 * Toast when fetch fails before a response (offline, DNS, CORS in dev, etc.).
 */
export function networkFailureToast(
  locale: FeedbackLocale,
  feature: ApiFeatureId
): { title: string; description: string } {
  const L = label(feature, locale);
  return {
    title: locale === 'it' ? `${L} — Connessione` : `${L} — Connection`,
    description:
      locale === 'it'
        ? 'Controlla la connessione e riprova. Se sei offline, torna online prima di continuare.'
        : 'Check your connection and try again. If you are offline, reconnect first.',
  };
}

/**
 * Validation / missing fields — same feature chrome as API errors.
 */
export function validationToast(
  locale: FeedbackLocale,
  feature: ApiFeatureId,
  description: string
): { title: string; description: string } {
  const L = label(feature, locale);
  return {
    title: locale === 'it' ? `${L} — Controlla il modulo` : `${L} — Check the form`,
    description,
  };
}

/** PRO / AGENCY paywall — same chrome as other feature toasts */
export function premiumFeatureToast(
  locale: FeedbackLocale,
  feature: ApiFeatureId,
  description: string
): { title: string; description: string } {
  const L = label(feature, locale);
  return {
    title: locale === 'it' ? `${L} — Piano richiesto` : `${L} — Plan required`,
    description,
  };
}

export function clipboardFailureToast(
  locale: FeedbackLocale,
  feature: ApiFeatureId,
  description: string
): { title: string; description: string } {
  const L = label(feature, locale);
  return {
    title: locale === 'it' ? `${L} — Copia negli appunti` : `${L} — Clipboard`,
    description,
  };
}
