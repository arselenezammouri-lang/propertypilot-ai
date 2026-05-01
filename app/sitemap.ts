import { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/env';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  const now = new Date();

  return [
    // Core pages
    { url: baseUrl, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/pricing`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${baseUrl}/features`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/demo`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/contatti`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/platform`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/compliance`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },

    // Auth
    { url: `${baseUrl}/auth/login`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/auth/signup`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },

    // Country landing pages (SEO)
    { url: `${baseUrl}/it/software-immobiliare-ai`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${baseUrl}/fr/logiciel-immobilier-ia`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${baseUrl}/es/software-inmobiliario-ia`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${baseUrl}/de/immobilien-software-ki`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${baseUrl}/en/ai-real-estate-software`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },

    // Free tools (viral)
    { url: `${baseUrl}/tools/ai-property-description`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },

    // Blog
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/blog/ai-real-estate-listings-2025`, lastModified: new Date('2025-03-28'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/blog/crm-automation-real-estate`, lastModified: new Date('2025-03-15'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/blog/social-media-real-estate-ai`, lastModified: new Date('2025-03-01'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/blog/property-photography-tips-ai`, lastModified: new Date('2025-02-15'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/blog/lead-management-real-estate-2025`, lastModified: new Date('2025-02-01'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/blog/voice-ai-real-estate-2026`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/blog/ai-virtual-staging-guide`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/blog/real-estate-seo-ai-optimization`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/blog/european-proptech-market-2026`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/blog/ai-lead-scoring-real-estate`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },

    // Blog — Italian market SEO articles (v27)
    { url: `${baseUrl}/blog/idealista-vs-immobiliare-it-2026`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/blog/pubblicare-annunci-11-portali-europei`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/blog/ai-vs-agenti-tradizionali-chi-vince`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/blog/gdpr-agenzie-immobiliari-italia-2026`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/blog/confronto-software-immobiliari-europa-2026`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },

    // Blog — French market SEO articles (v28)
    { url: `${baseUrl}/blog/idealista-vs-seloger-2026`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/blog/publier-annonces-11-portails-europeens`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/blog/ia-vs-agents-traditionnels-immobilier`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/blog/rgpd-agences-immobilieres-france-2026`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/blog/comparatif-logiciels-immobiliers-europe-2026`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },

    // Blog — Spanish market SEO articles (v28)
    { url: `${baseUrl}/blog/idealista-vs-fotocasa-2026`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/blog/publicar-en-11-portales-europeos`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/blog/ia-vs-agentes-tradicionales-inmobiliaria`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/blog/gdpr-agencias-inmobiliarias-espana-2026`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/blog/comparativa-software-inmobiliario-europa-2026`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },

    // Legal
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/refund`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },

    // Docs
    { url: `${baseUrl}/docs`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
  ];
}
