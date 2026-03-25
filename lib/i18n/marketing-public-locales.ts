/**
 * Public marketing: About, Blog index, Features, blog post placeholder, /pricing plan cards.
 * IT/EN: marketing-pages-ui.ts, blog-post-page-ui.ts, pricing-page-plans-ui.ts.
 */

import type { MarketingAboutUi, MarketingBlogUi, MarketingFeaturesUi } from '@/lib/i18n/marketing-pages-ui';
import type { BlogPostPageUi } from '@/lib/i18n/blog-post-page-ui';
import type { PricingPagePlansUi } from '@/lib/i18n/pricing-page-plans-ui';

export const marketingAboutUiEs: MarketingAboutUi = {
  title: 'Quiénes somos',
  subtitle: 'Nuestra misión: potenciar agencias con inteligencia artificial',
  missionTitle: 'Nuestra misión',
  missionBody:
    'PropertyPilot AI nació para dar a cada agencia inmobiliaria herramientas de IA antes reservadas a los grandes actores. Queremos que agentes y equipos compitan con anuncios persuasivos, CRM inteligente y automatizaciones que ahorran horas de trabajo.',
  whatTitle: 'Qué hacemos',
  whatBody:
    'Generación de anuncios con IA, auditoría de fichas, traducciones multilingües, CRM integrado, prospección, cumplimiento GDPR y mucho más. Todo en una plataforma pensada para el mercado inmobiliario local e internacional.',
  marketsTitle: 'Mercados',
  marketsBody:
    'Estamos activos en Italia, EE. UU., España y otros mercados. Soportamos más de 7 idiomas y varias divisas para agentes que operan a nivel local e internacional.',
  securityTitle: 'Privacidad y seguridad',
  securityBody:
    'Tus datos están protegidos. Cumplimiento GDPR, cifrado y una infraestructura de nivel empresarial.',
  privacyLink: 'Política de privacidad',
  contact: 'Contáctanos',
  home: 'Volver al inicio',
};

export const marketingBlogUiEs: MarketingBlogUi = {
  metaTitle: 'Blog inmobiliario',
  subtitle: 'Guías, consejos y recursos para agentes inmobiliarios',
  comingSoon: 'Pronto habrá más artículos. ¡Permanece atento!',
  backHome: 'Volver al inicio',
  posts: [
    {
      slug: 'come-scrivere-annunci-che-convertono',
      title: 'Cómo escribir anuncios que convierten',
      excerpt: '5 reglas de oro para anuncios que generan contactos.',
      date: '2024-12',
    },
    {
      slug: 'ai-per-agenzie-immobiliari',
      title: 'IA para agencias inmobiliarias: guía práctica',
      excerpt: 'Cómo integrar la inteligencia artificial en tu día a día.',
      date: '2024-11',
    },
    {
      slug: 'crm-immobiliare-automatizzato',
      title: 'CRM inmobiliario automatizado',
      excerpt: 'Reduce el trabajo manual y no pierdas ningún lead.',
      date: '2024-10',
    },
  ],
};

export const marketingFeaturesUiEs: MarketingFeaturesUi = {
  titleWord: 'Funciones',
  subtitle: 'Todas las capacidades de IA para hacer crecer tu agencia',
  viewPricing: 'Ver precios',
  backHome: 'Volver al inicio',
  features: [
    {
      title: 'Generación de anuncios con IA',
      desc: 'Crea anuncios persuasivos en segundos, con textos optimizados que convierten.',
    },
    {
      title: 'Perfect Copy y Emotional Listing',
      desc: 'Descripciones que generan emoción y venden, con tono profesional y llamadas a la acción efectivas.',
    },
    {
      title: 'Traducciones multilingües',
      desc: 'Traduce anuncios a más de 7 idiomas manteniendo tono y persuasión para mercados internacionales.',
    },
    {
      title: 'Auditoría de anuncios',
      desc: 'Análisis IA de tu anuncio: puntuación de calidad, sugerencias y buenas prácticas.',
    },
    {
      title: 'Aria Assistant',
      desc: 'Asistente de voz IA que guía a agentes y equipos con consejos en tiempo real.',
    },
    {
      title: 'CRM y gestión de leads',
      desc: 'Gestión integrada, pipeline Kanban, automatizaciones y scoring para no perder ningún contacto.',
    },
    {
      title: 'Prospección y scraper',
      desc: 'Encuentra propietarios a contactar con scraping inteligente y outreach automatizado.',
    },
    {
      title: 'Compliance Center',
      desc: 'Documentos legales, GDPR y DPA para mantener tu agencia conforme y protegida.',
    },
    {
      title: 'Lead scoring',
      desc: 'Prioriza los mejores leads con puntuación IA y enfócate en quienes más convierten.',
    },
    {
      title: 'Seguimientos automáticos',
      desc: 'Emails de seguimiento personalizados y secuencias automáticas para maximizar conversiones.',
    },
    {
      title: 'Agency Assistant',
      desc: 'Estrategias IA para agencias: planificación, buenas prácticas y optimización de procesos.',
    },
    {
      title: 'Map prospecting',
      desc: 'Visualiza y analiza inmuebles en el mapa para detectar oportunidades en tu zona.',
    },
  ],
};

export const blogPostPageUiEs: BlogPostPageUi = {
  backToBlog: 'Volver al blog',
  comingSoonLine: 'Artículo en preparación. ¡Pronto disponible!',
  comingSoonBody:
    'Este artículo está en preparación. Volveremos pronto con contenido de valor para agentes inmobiliarios.',
  moreArticles: 'Más artículos',
  knownTitles: {
    'come-scrivere-annunci-che-convertono': 'Cómo escribir anuncios que convierten',
    'ai-per-agenzie-immobiliari': 'IA para agencias inmobiliarias: guía práctica',
    'crm-immobiliare-automatizzato': 'CRM inmobiliario automatizado',
  },
};

export const pricingPagePlansUiEs: PricingPagePlansUi = {
  starter: {
    tagline: 'Herramientas IA para agentes individuales',
    period: '/ mes',
    includes: [
      'Herramientas IA básicas para anuncios',
      'Pensado para agentes en solitario',
      'Acceso a funciones esenciales de generación',
    ],
    cta: 'Empezar con Starter',
  },
  pro: {
    tagline: 'CRM, automatizaciones y herramientas IA',
    period: '/ mes',
    includes: ['Todo lo de Starter', 'CRM y automatizaciones', 'Herramientas IA avanzadas para agencias'],
    cta: 'Pasarse a Pro',
  },
  agency: {
    tagline: 'Para equipos de hasta 10 agentes',
    period: '/ mes',
    includes: [
      'Todo lo de Pro',
      'Pensado para equipos de hasta 10 agentes',
      'Gestión multiusuario / multiagencia',
    ],
    cta: 'Pasarse a Agency',
  },
  boost: {
    tagline: 'Paquete de configuración done-for-you',
    period: 'pago único',
    includes: [
      'Configuración completa done-for-you',
      'Implementación y onboarding guiados',
      'Soporte premium para el lanzamiento',
    ],
    cta: 'Comprar Agency Boost',
  },
  popularBadge: 'Recomendado',
  eliteOfferBadge: 'Oferta elite',
  vatExcluded: 'IVA no incluido',
  footerCopyright: '© {year} PropertyPilot AI. Todos los derechos reservados.',
  footerPrivacy: 'Política de privacidad',
  footerTerms: 'Términos del servicio',
  footerRefund: 'Política de reembolsos',
};

export const marketingAboutUiFr: MarketingAboutUi = {
  title: 'À propos',
  subtitle: 'Notre mission : renforcer les agences grâce à l’intelligence artificielle',
  missionTitle: 'Notre mission',
  missionBody:
    'PropertyPilot AI a été créé pour donner à chaque agence immobilière des outils d’IA autrefois réservés aux grands acteurs. Nous voulons que les agents et les équipes puissent rivaliser avec des annonces convaincantes, un CRM intelligent et des automatisations qui font gagner des heures.',
  whatTitle: 'Ce que nous faisons',
  whatBody:
    'Génération d’annonces IA, audit d’annonces, traductions multilingues, CRM intégré, prospection, conformité RGPD et bien plus. Le tout sur une plateforme conçue pour les marchés immobiliers locaux et internationaux.',
  marketsTitle: 'Marchés',
  marketsBody:
    'Nous sommes actifs en Italie, aux États-Unis, en Espagne et ailleurs. Nous prenons en charge 7+ langues et plusieurs devises pour les agents locaux et internationaux.',
  securityTitle: 'Confidentialité et sécurité',
  securityBody:
    'Vos données sont protégées. Conformité RGPD, chiffrement et infrastructure de niveau entreprise.',
  privacyLink: 'Politique de confidentialité',
  contact: 'Nous contacter',
  home: 'Retour à l’accueil',
};

export const marketingBlogUiFr: MarketingBlogUi = {
  metaTitle: 'Blog immobilier',
  subtitle: 'Guides, conseils et ressources pour agents immobiliers',
  comingSoon: 'D’autres articles arrivent bientôt. Restez informé !',
  backHome: 'Retour à l’accueil',
  posts: [
    {
      slug: 'come-scrivere-annunci-che-convertono',
      title: 'Rédiger des annonces qui convertissent',
      excerpt: '5 règles d’or pour des annonces qui génèrent des contacts.',
      date: '2024-12',
    },
    {
      slug: 'ai-per-agenzie-immobiliari',
      title: 'IA pour agences immobilières : guide pratique',
      excerpt: 'Comment intégrer l’intelligence artificielle dans votre quotidien.',
      date: '2024-11',
    },
    {
      slug: 'crm-immobiliare-automatizzato',
      title: 'CRM immobilier automatisé',
      excerpt: 'Réduisez le travail manuel et ne perdez plus aucun lead.',
      date: '2024-10',
    },
  ],
};

export const marketingFeaturesUiFr: MarketingFeaturesUi = {
  titleWord: 'Fonctionnalités',
  subtitle: 'Toutes les capacités IA pour développer votre agence',
  viewPricing: 'Voir les tarifs',
  backHome: 'Retour à l’accueil',
  features: [
    {
      title: 'Génération d’annonces IA',
      desc: 'Créez des annonces persuasives en quelques secondes, avec des textes optimisés.',
    },
    {
      title: 'Perfect Copy et Emotional Listing',
      desc: 'Des descriptions émotionnelles qui vendent, avec un ton professionnel et des appels à l’action efficaces.',
    },
    {
      title: 'Traductions multilingues',
      desc: 'Traduisez vos annonces en 7+ langues en préservant le ton pour les marchés internationaux.',
    },
    {
      title: 'Audit d’annonces',
      desc: 'Analyse IA : score qualité, suggestions d’amélioration et bonnes pratiques.',
    },
    {
      title: 'Aria Assistant',
      desc: 'Assistant vocal IA pour guider agents et équipes en temps réel.',
    },
    {
      title: 'CRM et gestion des leads',
      desc: 'Pipeline Kanban intégré, automatisations et scoring pour ne rien perdre.',
    },
    {
      title: 'Prospection et scraper',
      desc: 'Trouvez des propriétaires à contacter grâce au scraping et à l’outreach automatisé.',
    },
    {
      title: 'Compliance Center',
      desc: 'Documents légaux, RGPD et DPA pour rester conforme et protégé.',
    },
    {
      title: 'Lead scoring',
      desc: 'Priorisez les meilleurs leads avec un score IA.',
    },
    {
      title: 'Relances automatisées',
      desc: 'E-mails de suivi personnalisés et séquences pour maximiser les conversions.',
    },
    {
      title: 'Agency Assistant',
      desc: 'Stratégies IA pour agences : planification et optimisation des processus.',
    },
    {
      title: 'Map prospecting',
      desc: 'Visualisez et analysez les biens sur une carte pour repérer les opportunités.',
    },
  ],
};

export const blogPostPageUiFr: BlogPostPageUi = {
  backToBlog: 'Retour au blog',
  comingSoonLine: 'Article en préparation. Bientôt disponible !',
  comingSoonBody:
    'Cet article est en cours de préparation. Nous reviendrons bientôt avec du contenu utile pour les agents.',
  moreArticles: 'Plus d’articles',
  knownTitles: {
    'come-scrivere-annunci-che-convertono': 'Rédiger des annonces qui convertissent',
    'ai-per-agenzie-immobiliari': 'IA pour agences immobilières : guide pratique',
    'crm-immobiliare-automatizzato': 'CRM immobilier automatisé',
  },
};

export const pricingPagePlansUiFr: PricingPagePlansUi = {
  starter: {
    tagline: 'Outils IA pour agents indépendants',
    period: '/ mois',
    includes: [
      'Outils IA essentiels pour les annonces',
      'Conçu pour les agents solo',
      'Accès aux fonctions clés de génération',
    ],
    cta: 'Commencer avec Starter',
  },
  pro: {
    tagline: 'CRM, automatisations et outils IA',
    period: '/ mois',
    includes: ['Tout dans Starter', 'CRM et automatisations', 'Outils IA avancés pour agences'],
    cta: 'Passer à Pro',
  },
  agency: {
    tagline: 'Pour des équipes jusqu’à 10 agents',
    period: '/ mois',
    includes: [
      'Tout dans Pro',
      'Conçu pour des équipes jusqu’à 10 agents',
      'Gestion multi-utilisateurs / multi-agences',
    ],
    cta: 'Passer à Agency',
  },
  boost: {
    tagline: 'Forfait de mise en place clé en main',
    period: 'paiement unique',
    includes: [
      'Configuration complète clé en main',
      'Mise en œuvre et onboarding guidés',
      'Support premium au lancement',
    ],
    cta: 'Acheter Agency Boost',
  },
  popularBadge: 'Recommandé',
  eliteOfferBadge: 'Offre elite',
  vatExcluded: 'TVA non comprise',
  footerCopyright: '© {year} PropertyPilot AI. Tous droits réservés.',
  footerPrivacy: 'Politique de confidentialité',
  footerTerms: 'Conditions d’utilisation',
  footerRefund: 'Politique de remboursement',
};

export const marketingAboutUiDe: MarketingAboutUi = {
  title: 'Über uns',
  subtitle: 'Unsere Mission: Immobilienagenturen mit Künstlicher Intelligenz stärken',
  missionTitle: 'Unsere Mission',
  missionBody:
    'PropertyPilot AI wurde geschaffen, damit jede Immobilienagentur KI-Tools nutzen kann, die früher nur Großanbietern vorbehalten waren. Agenten und Teams sollen mit überzeugenden Exposés, intelligentem CRM und Automatisierungen Zeit sparen und wettbewerbsfähig bleiben.',
  whatTitle: 'Was wir tun',
  whatBody:
    'KI-Exposé-Erstellung, Listing-Audits, mehrsprachige Übersetzungen, integriertes CRM, Prospecting, DSGVO-Konformität und mehr – alles auf einer Plattform für lokale und internationale Märkte.',
  marketsTitle: 'Märkte',
  marketsBody:
    'Wir sind in Italien, den USA, Spanien und weiteren Märkten aktiv. 7+ Sprachen und mehrere Währungen für lokal und international tätige Agenten.',
  securityTitle: 'Datenschutz und Sicherheit',
  securityBody:
    'Ihre Daten sind geschützt: DSGVO, Verschlüsselung und Enterprise-Infrastruktur.',
  privacyLink: 'Datenschutzerklärung',
  contact: 'Kontakt',
  home: 'Zur Startseite',
};

export const marketingBlogUiDe: MarketingBlogUi = {
  metaTitle: 'Immobilien-Blog',
  subtitle: 'Leitfäden, Tipps und Ressourcen für Immobilienmakler',
  comingSoon: 'Weitere Artikel folgen bald. Bleiben Sie dran!',
  backHome: 'Zur Startseite',
  posts: [
    {
      slug: 'come-scrivere-annunci-che-convertono',
      title: 'So schreiben Sie Inserate, die konvertieren',
      excerpt: '5 goldene Regeln für Inserate, die Anfragen bringen.',
      date: '2024-12',
    },
    {
      slug: 'ai-per-agenzie-immobiliari',
      title: 'KI für Immobilienagenturen: Praxisleitfaden',
      excerpt: 'Wie Sie KI in den Alltag integrieren.',
      date: '2024-11',
    },
    {
      slug: 'crm-immobiliare-automatizzato',
      title: 'Automatisiertes Immobilien-CRM',
      excerpt: 'Weniger manuelle Arbeit, kein Lead geht verloren.',
      date: '2024-10',
    },
  ],
};

export const marketingFeaturesUiDe: MarketingFeaturesUi = {
  titleWord: 'Funktionen',
  subtitle: 'Alle KI-Funktionen, um Ihre Agentur zu skalieren',
  viewPricing: 'Preise ansehen',
  backHome: 'Zur Startseite',
  features: [
    {
      title: 'KI-Inserate',
      desc: 'Überzeugende Exposés in Sekunden mit optimiertem Text.',
    },
    {
      title: 'Perfect Copy & Emotional Listing',
      desc: 'Beschreibungen mit Emotion und professionellem Ton, die verkaufen.',
    },
    {
      title: 'Mehrsprachige Übersetzungen',
      desc: 'Inserate in 7+ Sprachen bei erhaltenem Ton für internationale Märkte.',
    },
    {
      title: 'Listing-Audit',
      desc: 'KI-Analyse mit Qualitätsscore und Verbesserungsvorschlägen.',
    },
    {
      title: 'Aria Assistant',
      desc: 'Sprach-KI-Assistent für Echtzeit-Unterstützung von Agenten und Teams.',
    },
    {
      title: 'CRM & Lead-Management',
      desc: 'Kanban-Pipeline, Automatisierungen und Scoring – kein Kontakt verloren.',
    },
    {
      title: 'Prospecting & Scraper',
      desc: 'Eigentümer finden mit intelligentem Scraping und automatisiertem Outreach.',
    },
    {
      title: 'Compliance Center',
      desc: 'Rechtstexte, DSGVO und AV-Verträge für compliantes Arbeiten.',
    },
    {
      title: 'Lead Scoring',
      desc: 'Die besten Leads per KI-Score priorisieren.',
    },
    {
      title: 'Automatisierte Follow-ups',
      desc: 'Personalisierte E-Mails und Sequenzen für mehr Conversions.',
    },
    {
      title: 'Agency Assistant',
      desc: 'KI-Strategien für Agenturen: Planung und Prozessoptimierung.',
    },
    {
      title: 'Map Prospecting',
      desc: 'Objekte auf der Karte analysieren und Chancen im Gebiet erkennen.',
    },
  ],
};

export const blogPostPageUiDe: BlogPostPageUi = {
  backToBlog: 'Zurück zum Blog',
  comingSoonLine: 'Artikel in Vorbereitung. Bald verfügbar!',
  comingSoonBody:
    'Dieser Artikel wird vorbereitet. Bald mit wertvollem Content für Immobilienprofis.',
  moreArticles: 'Weitere Artikel',
  knownTitles: {
    'come-scrivere-annunci-che-convertono': 'So schreiben Sie Inserate, die konvertieren',
    'ai-per-agenzie-immobiliari': 'KI für Immobilienagenturen: Praxisleitfaden',
    'crm-immobiliare-automatizzato': 'Automatisiertes Immobilien-CRM',
  },
};

export const pricingPagePlansUiDe: PricingPagePlansUi = {
  starter: {
    tagline: 'KI-Tools für Einzelagenten',
    period: '/ Monat',
    includes: [
      'Kern-KI-Tools für Inserate',
      'Für Solo-Agenten',
      'Zugriff auf wesentliche Generierungsfunktionen',
    ],
    cta: 'Mit Starter starten',
  },
  pro: {
    tagline: 'CRM, Automatisierungen & KI-Tools',
    period: '/ Monat',
    includes: ['Alles aus Starter', 'CRM und Automatisierungen', 'Erweiterte KI-Tools für Agenturen'],
    cta: 'Upgrade auf Pro',
  },
  agency: {
    tagline: 'Für Teams bis zu 10 Agenten',
    period: '/ Monat',
    includes: [
      'Alles aus Pro',
      'Für Teams bis zu 10 Agenten',
      'Multi-User- / Multi-Agentur-Verwaltung',
    ],
    cta: 'Upgrade auf Agency',
  },
  boost: {
    tagline: 'Done-for-you-Setup-Paket',
    period: 'einmalig',
    includes: [
      'Komplettes Done-for-you-Setup',
      'Geführte Implementierung und Onboarding',
      'Premium-Launch-Support',
    ],
    cta: 'Agency Boost kaufen',
  },
  popularBadge: 'Empfohlen',
  eliteOfferBadge: 'Elite-Angebot',
  vatExcluded: 'zzgl. MwSt.',
  footerCopyright: '© {year} PropertyPilot AI. Alle Rechte vorbehalten.',
  footerPrivacy: 'Datenschutzerklärung',
  footerTerms: 'Nutzungsbedingungen',
  footerRefund: 'Rückerstattungsrichtlinie',
};

export const marketingAboutUiPt: MarketingAboutUi = {
  title: 'Quem somos',
  subtitle: 'A nossa missão: capacitar agências com inteligência artificial',
  missionTitle: 'A nossa missão',
  missionBody:
    'O PropertyPilot AI foi criado para dar a cada agência imobiliária ferramentas de IA antes reservadas aos grandes players. Queremos que agentes e equipas possam competir com anúncios persuasivos, CRM inteligente e automatizações que poupam horas de trabalho.',
  whatTitle: 'O que fazemos',
  whatBody:
    'Geração de anúncios com IA, auditoria de fichas, traduções multilingues, CRM integrado, prospeção, conformidade GDPR e muito mais — numa plataforma para mercados locais e internacionais.',
  marketsTitle: 'Mercados',
  marketsBody:
    'Estamos ativos em Itália, EUA, Espanha e outros mercados. Suportamos 7+ idiomas e várias moedas para agentes locais e internacionais.',
  securityTitle: 'Privacidade e segurança',
  securityBody:
    'Os seus dados estão protegidos: GDPR, encriptação e infraestrutura enterprise.',
  privacyLink: 'Política de privacidade',
  contact: 'Contacte-nos',
  home: 'Voltar ao início',
};

export const marketingBlogUiPt: MarketingBlogUi = {
  metaTitle: 'Blog imobiliário',
  subtitle: 'Guias, dicas e recursos para agentes imobiliários',
  comingSoon: 'Mais artigos em breve. Fique atento!',
  backHome: 'Voltar ao início',
  posts: [
    {
      slug: 'come-scrivere-annunci-che-convertono',
      title: 'Como escrever anúncios que convertem',
      excerpt: '5 regras de ouro para anúncios que geram contactos.',
      date: '2024-12',
    },
    {
      slug: 'ai-per-agenzie-immobiliari',
      title: 'IA para agências imobiliárias: guia prático',
      excerpt: 'Como integrar inteligência artificial no dia a dia.',
      date: '2024-11',
    },
    {
      slug: 'crm-immobiliare-automatizzato',
      title: 'CRM imobiliário automatizado',
      excerpt: 'Menos trabalho manual e nenhum lead perdido.',
      date: '2024-10',
    },
  ],
};

export const marketingFeaturesUiPt: MarketingFeaturesUi = {
  titleWord: 'Funcionalidades',
  subtitle: 'Todas as capacidades de IA para fazer crescer a sua agência',
  viewPricing: 'Ver preços',
  backHome: 'Voltar ao início',
  features: [
    {
      title: 'Geração de anúncios com IA',
      desc: 'Crie anúncios persuasivos em segundos com texto otimizado.',
    },
    {
      title: 'Perfect Copy e Emotional Listing',
      desc: 'Descrições emocionais que vendem, com tom profissional e CTAs eficazes.',
    },
    {
      title: 'Traduções multilingues',
      desc: 'Traduza anúncios para 7+ idiomas mantendo o tom para mercados internacionais.',
    },
    {
      title: 'Auditoria de anúncios',
      desc: 'Análise IA: pontuação de qualidade, sugestões e boas práticas.',
    },
    {
      title: 'Aria Assistant',
      desc: 'Assistente de voz IA com apoio em tempo real a agentes e equipas.',
    },
    {
      title: 'CRM e gestão de leads',
      desc: 'Pipeline Kanban, automatizações e scoring — não perca contactos.',
    },
    {
      title: 'Prospeção e scraper',
      desc: 'Encontre proprietários com scraping inteligente e outreach automático.',
    },
    {
      title: 'Compliance Center',
      desc: 'Documentos legais, GDPR e DPA para manter a agência em conformidade.',
    },
    {
      title: 'Lead scoring',
      desc: 'Priorize os melhores leads com pontuação IA.',
    },
    {
      title: 'Follow-ups automáticos',
      desc: 'E-mails personalizados e sequências para maximizar conversões.',
    },
    {
      title: 'Agency Assistant',
      desc: 'Estratégias IA para agências: planeamento e otimização de processos.',
    },
    {
      title: 'Map prospecting',
      desc: 'Veja e analise imóveis no mapa para identificar oportunidades.',
    },
  ],
};

export const blogPostPageUiPt: BlogPostPageUi = {
  backToBlog: 'Voltar ao blog',
  comingSoonLine: 'Artigo em preparação. Brevemente!',
  comingSoonBody:
    'Este artigo está a ser preparado. Voltaremos em breve com conteúdo útil para agentes.',
  moreArticles: 'Mais artigos',
  knownTitles: {
    'come-scrivere-annunci-che-convertono': 'Como escrever anúncios que convertem',
    'ai-per-agenzie-immobiliari': 'IA para agências imobiliárias: guia prático',
    'crm-immobiliare-automatizzato': 'CRM imobiliário automatizado',
  },
};

export const pricingPagePlansUiPt: PricingPagePlansUi = {
  starter: {
    tagline: 'Ferramentas IA para agentes a solo',
    period: '/ mês',
    includes: [
      'Ferramentas IA essenciais para anúncios',
      'Pensado para agentes individuais',
      'Acesso às funções principais de geração',
    ],
    cta: 'Começar com Starter',
  },
  pro: {
    tagline: 'CRM, automatizações e ferramentas IA',
    period: '/ mês',
    includes: ['Tudo no Starter', 'CRM e automatizações', 'Ferramentas IA avançadas para agências'],
    cta: 'Mudar para Pro',
  },
  agency: {
    tagline: 'Para equipas até 10 agentes',
    period: '/ mês',
    includes: [
      'Tudo no Pro',
      'Pensado para equipas até 10 agentes',
      'Gestão multiutilizador / multiagência',
    ],
    cta: 'Mudar para Agency',
  },
  boost: {
    tagline: 'Pacote de configuração done-for-you',
    period: 'pagamento único',
    includes: [
      'Configuração completa done-for-you',
      'Implementação e onboarding guiados',
      'Suporte premium ao lançamento',
    ],
    cta: 'Comprar Agency Boost',
  },
  popularBadge: 'Recomendado',
  eliteOfferBadge: 'Oferta elite',
  vatExcluded: 'IVA não incluído',
  footerCopyright: '© {year} PropertyPilot AI. Todos os direitos reservados.',
  footerPrivacy: 'Política de privacidade',
  footerTerms: 'Termos de serviço',
  footerRefund: 'Política de reembolso',
};

export const marketingAboutUiAr: MarketingAboutUi = {
  title: 'من نحن',
  subtitle: 'مهمتنا: تمكين الوكالات بالذكاء الاصطناعي',
  missionTitle: 'مهمتنا',
  missionBody:
    'بُني PropertyPilot AI ليمنح كل وكالة عقارية أدوات ذكاء اصطناعي كانت في السابق حكراً على الكبار. نريد أن يتمكن الوسطاء والفرق من المنافسة بإعلانات مقنعة وCRM ذكي وأتمتة توفر ساعات العمل.',
  whatTitle: 'ماذا نقدم',
  whatBody:
    'إنشاء إعلانات بالذكاء الاصطناعي، تدقيق الإعلانات، ترجمات متعددة اللغات، CRM متكامل، استكشاف فرص، امتثال GDPR والمزيد — في منصة واحدة للأسواق المحلية والعالمية.',
  marketsTitle: 'الأسواق',
  marketsBody:
    'نشطون في إيطاليا والولايات المتحدة وإسبانيا وأسواق أخرى. ندعم أكثر من 7 لغات وعملات متعددة للوسطاء محلياً ودولياً.',
  securityTitle: 'الخصوصية والأمان',
  securityBody:
    'بياناتك محمية: امتثال GDPR، تشفير وبنية تحتية على مستوى المؤسسات.',
  privacyLink: 'سياسة الخصوصية',
  contact: 'اتصل بنا',
  home: 'العودة للرئيسية',
};

export const marketingBlogUiAr: MarketingBlogUi = {
  metaTitle: 'المدونة العقارية',
  subtitle: 'أدلة ونصائح وموارد للوسطاء العقاريين',
  comingSoon: 'المزيد من المقالات قريباً. تابعونا!',
  backHome: 'العودة للرئيسية',
  posts: [
    {
      slug: 'come-scrivere-annunci-che-convertono',
      title: 'كتابة إعلانات تحقق التحويل',
      excerpt: '5 قواعد ذهبية لإعلانات تجلب استفسارات.',
      date: '2024-12',
    },
    {
      slug: 'ai-per-agenzie-immobiliari',
      title: 'الذكاء الاصطناعي للوكالات العقارية: دليل عملي',
      excerpt: 'كيف تدمج الذكاء الاصطناعي في عملك اليومي.',
      date: '2024-11',
    },
    {
      slug: 'crm-immobiliare-automatizzato',
      title: 'CRM عقاري آلي',
      excerpt: 'قلل العمل اليدوي ولا تفقد أي عميل محتمل.',
      date: '2024-10',
    },
  ],
};

export const marketingFeaturesUiAr: MarketingFeaturesUi = {
  titleWord: 'الميزات',
  subtitle: 'كل قدرات الذكاء الاصطناعي لتنمية وكالتك',
  viewPricing: 'عرض الأسعار',
  backHome: 'العودة للرئيسية',
  features: [
    {
      title: 'إنشاء إعلانات بالذكاء الاصطناعي',
      desc: 'أنشئ إعلانات مقنعة في ثوانٍ بنصوص محسّنة للتحويل.',
    },
    {
      title: 'Perfect Copy و Emotional Listing',
      desc: 'أوصاف عاطفية تبيع، بلهجة مهنية ودعوات فعّالة للإجراء.',
    },
    {
      title: 'ترجمات متعددة اللغات',
      desc: 'ترجم الإعلانات إلى أكثر من 7 لغات مع الحفاظ على الأسلوب للأسواق الدولية.',
    },
    {
      title: 'تدقيق الإعلانات',
      desc: 'تحليل ذكاء اصطناعي: درجة الجودة واقتراحات التحسين وأفضل الممارسات.',
    },
    {
      title: 'Aria Assistant',
      desc: 'مساعد صوتي بالذكاء الاصطناعي يوجّه الوسطاء والفرق في الوقت الفعلي.',
    },
    {
      title: 'CRM وإدارة العملاء المحتملين',
      desc: 'مسار Kanban مدمج وأتمتة وتقييم — لا تفقد أي جهة اتصال.',
    },
    {
      title: 'الاستكشاف وجمع البيانات',
      desc: 'اعثر على المالكين عبر جمع ذكي وتواصل آلي.',
    },
    {
      title: 'مركز الامتثال',
      desc: 'مستندات قانونية وGDPR وDPA للحفاظ على امتثال وكالتك.',
    },
    {
      title: 'تقييم العملاء المحتملين',
      desc: 'رتّب الأولويات بدرجات ذكاء اصطناعي.',
    },
    {
      title: 'متابعات تلقائية',
      desc: 'رسائل متابعة مخصّصة وتسلسلات لزيادة التحويل.',
    },
    {
      title: 'Agency Assistant',
      desc: 'استراتيجيات ذكاء اصطناعي للوكالات: التخطيط وتحسين العمليات.',
    },
    {
      title: 'استكشاف الخريطة',
      desc: 'اعرض وحلل العقارات على الخريطة لرصد الفرص في منطقتك.',
    },
  ],
};

export const blogPostPageUiAr: BlogPostPageUi = {
  backToBlog: 'العودة للمدونة',
  comingSoonLine: 'المقال قيد الإعداد. قريباً!',
  comingSoonBody:
    'هذا المقال قيد التحضير. سنعود قريباً بمحتوى مفيد للوسطاء العقاريين.',
  moreArticles: 'المزيد من المقالات',
  knownTitles: {
    'come-scrivere-annunci-che-convertono': 'كتابة إعلانات تحقق التحويل',
    'ai-per-agenzie-immobiliari': 'الذكاء الاصطناعي للوكالات العقارية: دليل عملي',
    'crm-immobiliare-automatizzato': 'CRM عقاري آلي',
  },
};

export const pricingPagePlansUiAr: PricingPagePlansUi = {
  starter: {
    tagline: 'أدوات ذكاء اصطناعي للوسطاء الأفراد',
    period: '/ شهر',
    includes: [
      'أدوات أساسية لإعلانات بالذكاء الاصطناعي',
      'مصمم للوسطاء بمفردهم',
      'وصول لوظائف التوليد الأساسية',
    ],
    cta: 'ابدأ بـ Starter',
  },
  pro: {
    tagline: 'CRM وأتمتة وأدوات ذكاء اصطناعي',
    period: '/ شهر',
    includes: ['كل ميزات Starter', 'CRM وأتمتة', 'أدوات ذكاء اصطناعي متقدمة للوكالات'],
    cta: 'الترقية إلى Pro',
  },
  agency: {
    tagline: 'لفرق تصل إلى 10 وسطاء',
    period: '/ شهر',
    includes: [
      'كل ميزات Pro',
      'مصمم لفرق حتى 10 وسطاء',
      'إدارة متعددة المستخدمين / الوكالات',
    ],
    cta: 'الترقية إلى Agency',
  },
  boost: {
    tagline: 'حزمة إعداد جاهزة بالكامل',
    period: 'دفعة لمرة واحدة',
    includes: [
      'إعداد كامل جاهز',
      'تنفيذ وإدماج موجّهان',
      'دعم مميز للإطلاق',
    ],
    cta: 'شراء Agency Boost',
  },
  popularBadge: 'موصى به',
  eliteOfferBadge: 'عرض نخبة',
  vatExcluded: 'لا يشمل ضريبة القيمة المضافة',
  footerCopyright: '© {year} PropertyPilot AI. جميع الحقوق محفوظة.',
  footerPrivacy: 'سياسة الخصوصية',
  footerTerms: 'شروط الخدمة',
  footerRefund: 'سياسة الاسترداد',
};
