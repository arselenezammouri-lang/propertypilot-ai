/** /docs hub — ES, FR, DE, PT, AR (structure mirrors IT/EN in docs-hub-ui.ts) */

import type { DocsHubUi } from '@/lib/i18n/docs-hub-ui';

export const docsHubUiEs: DocsHubUi = {
  pageTitle: 'Centro de documentación',
  pageSubtitle: 'Guías completas para dominar PropertyPilot AI',
  searchPlaceholder: 'Buscar en las guías…',
  articleSingular: 'artículo',
  articlePlural: 'artículos',
  quickStartTitle: 'Inicio rápido',
  quickStartDesc: '¿Nuevo en PropertyPilot? Empieza aquí.',
  quickStartBtn: 'Empezar aquí',
  bestPracticesTitle: 'Buenas prácticas',
  bestPracticesDesc: 'Estrategias avanzadas para maximizar resultados.',
  bestPracticesBtn: 'Ver estrategias',
  goalsTitle: 'Objetivos',
  goalsDesc: 'Cómo conseguir mandatos con IA en 7 días.',
  goalsBtn: 'Conseguir mandatos',
  backToDocs: 'Volver a la documentación',
  sections: [
    {
      id: 'getting-started',
      title: 'Primeros pasos',
      articles: [
        {
          id: 'welcome',
          title: 'Bienvenido a PropertyPilot AI',
          description: 'Guía introductoria a la plataforma',
          slug: 'getting-started/welcome',
        },
        {
          id: 'first-listing',
          title: 'Crea tu primer anuncio',
          description: 'Genera un anuncio con IA en 2 minutos',
          slug: 'getting-started/first-listing',
        },
        {
          id: 'workspace-setup',
          title: 'Configura tu espacio de trabajo',
          description: 'Personaliza tu panel',
          slug: 'getting-started/workspace-setup',
        },
        {
          id: 'perfect-copy-guide',
          title: 'Perfect Copy — guía rápida',
          description: 'Campos del formulario, variantes y guardado en biblioteca',
          slug: 'getting-started/perfect-copy',
        },
      ],
    },
    {
      id: 'crm',
      title: 'CRM y leads',
      articles: [
        {
          id: 'pipeline-guide',
          title: 'Pipeline de leads (Kanban)',
          description: 'Arrastra leads entre columnas y actualiza el estado',
          slug: 'crm/pipeline',
        },
      ],
    },
    {
      id: 'account',
      title: 'Cuenta',
      articles: [
        {
          id: 'billing-guide',
          title: 'Plan y facturación',
          description: 'Mejoras, portal Stripe y estado de la suscripción',
          slug: 'account/billing-guide',
        },
      ],
    },
    {
      id: 'prospecting',
      title: 'Motor de prospección',
      articles: [
        {
          id: 'scraper-guide',
          title: 'Guía del Scraper global',
          description: 'Cómo encontrar inmuebles en Idealista, Zillow, Immobiliare.it',
          slug: 'prospecting/scraper-guide',
        },
        {
          id: 'arbitrage',
          title: 'Guía de arbitraje',
          description: 'Identifica oportunidades de mercado y calcula el Market Gap',
          slug: 'prospecting/arbitrage',
        },
        {
          id: 'filters',
          title: 'Filtros de búsqueda avanzados',
          description: 'Configura filtros automáticos para encontrar los mejores deals',
          slug: 'prospecting/filters',
        },
      ],
    },
    {
      id: 'ai-voice',
      title: 'Llamadas de voz con IA',
      articles: [
        {
          id: 'voice-setup',
          title: 'Configuración de llamadas IA',
          description: 'Configura Bland AI y empieza a llamar',
          slug: 'ai-voice/voice-setup',
        },
        {
          id: 'call-scripts',
          title: 'Guiones de llamada personalizados',
          description: 'Crea guiones eficaces para conseguir mandatos',
          slug: 'ai-voice/call-scripts',
        },
        {
          id: 'obstacle-handling',
          title: 'Gestión de objeciones',
          description: 'Cómo la IA gestiona las objeciones de los propietarios',
          slug: 'ai-voice/obstacle-handling',
        },
      ],
    },
    {
      id: '3d-staging',
      title: 'Home staging 3D',
      articles: [
        {
          id: 'staging-guide',
          title: 'Guía de staging 3D',
          description: 'Genera visualizaciones post-reforma para convencer a clientes',
          slug: '3d-staging/staging-guide',
        },
        {
          id: 'whatsapp-integration',
          title: 'Envío por WhatsApp',
          description: 'Comparte proyectos 3D con propietarios y clientes',
          slug: '3d-staging/whatsapp-integration',
        },
      ],
    },
    {
      id: 'aura-vr',
      title: 'Aura VR',
      articles: [
        {
          id: 'vr-guide',
          title: 'Guía Aura VR',
          description: 'Tour inmersivo 360° desde fotos para WhatsApp y presentaciones',
          slug: 'aura-vr/vr-guide',
        },
      ],
    },
    {
      id: 'price-sniper',
      title: 'Price Drop Sniper',
      articles: [
        {
          id: 'sniper-guide',
          title: 'Cómo funciona Sniper',
          description: 'Detecta bajadas de precio en tiempo real',
          slug: 'price-sniper/sniper-guide',
        },
        {
          id: 'sniper-strategy',
          title: 'Estrategia Sniper',
          description: 'Contacta propietarios tras una bajada de precio',
          slug: 'price-sniper/sniper-strategy',
        },
      ],
    },
    {
      id: 'commercial',
      title: 'Inteligencia comercial',
      articles: [
        {
          id: 'commercial-guide',
          title: 'Análisis de inmuebles comerciales',
          description: 'Identifica negocios recomendados y brechas de mercado',
          slug: 'commercial/commercial-guide',
        },
        {
          id: 'business-features',
          title: 'Funciones clave para comercial',
          description: 'Detecta chimenea, escaparate, categoría C3',
          slug: 'commercial/business-features',
        },
      ],
    },
    {
      id: 'territory',
      title: 'Territory Commander',
      articles: [
        {
          id: 'territory-guide',
          title: 'Análisis del territorio',
          description: 'Demanda, ADN del barrio, velocidad de venta',
          slug: 'territory/territory-guide',
        },
        {
          id: 'map-usage',
          title: 'Uso del mapa táctico',
          description: 'Navega operaciones en el mapa interactivo',
          slug: 'territory/map-usage',
        },
      ],
    },
    {
      id: 'smart-briefing',
      title: 'Briefing inteligente IA',
      articles: [
        {
          id: 'briefing-guide',
          title: 'Guía del Smart Briefing',
          description: 'Ventajas, inconvenientes, público objetivo automático',
          slug: 'smart-briefing/briefing-guide',
        },
        {
          id: 'client-ready',
          title: 'Texto listo para el cliente',
          description: 'Genera resúmenes listos para WhatsApp',
          slug: 'smart-briefing/client-ready',
        },
      ],
    },
    {
      id: 'xray',
      title: 'Visión rayos X IA',
      articles: [
        {
          id: 'xray-guide',
          title: 'Análisis técnico de imágenes',
          description: 'Detecta defectos y virtudes con IA',
          slug: 'xray/xray-guide',
        },
        {
          id: 'renovation-quote',
          title: 'Presupuesto de reforma',
          description: 'Calcula costes de rehabilitación',
          slug: 'xray/renovation-quote',
        },
      ],
    },
    {
      id: 'competitor',
      title: 'Radar de competencia',
      articles: [
        {
          id: 'radar-guide',
          title: 'Detección de mandatos en vencimiento',
          description: 'Encuentra inmuebles estancados más de 120 días',
          slug: 'competitor/radar-guide',
        },
      ],
    },
  ],
};

export const docsHubUiFr: DocsHubUi = {
  pageTitle: 'Centre de documentation',
  pageSubtitle: 'Guides complètes pour maîtriser PropertyPilot AI',
  searchPlaceholder: 'Rechercher dans les guides…',
  articleSingular: 'article',
  articlePlural: 'articles',
  quickStartTitle: 'Démarrage rapide',
  quickStartDesc: 'Nouveau sur PropertyPilot ? Commencez ici.',
  quickStartBtn: 'Commencer ici',
  bestPracticesTitle: 'Bonnes pratiques',
  bestPracticesDesc: 'Stratégies avancées pour maximiser les résultats.',
  bestPracticesBtn: 'Découvrir les stratégies',
  goalsTitle: 'Objectifs',
  goalsDesc: 'Comment obtenir des mandats avec l’IA en 7 jours.',
  goalsBtn: 'Obtenir des mandats',
  backToDocs: 'Retour à la documentation',
  sections: [
    {
      id: 'getting-started',
      title: 'Pour commencer',
      articles: [
        {
          id: 'welcome',
          title: 'Bienvenue sur PropertyPilot AI',
          description: 'Guide d’introduction à la plateforme',
          slug: 'getting-started/welcome',
        },
        {
          id: 'first-listing',
          title: 'Créez votre première annonce',
          description: 'Générez une annonce IA en 2 minutes',
          slug: 'getting-started/first-listing',
        },
        {
          id: 'workspace-setup',
          title: 'Configurez votre espace de travail',
          description: 'Personnalisez votre tableau de bord',
          slug: 'getting-started/workspace-setup',
        },
        {
          id: 'perfect-copy-guide',
          title: 'Perfect Copy — guide rapide',
          description: 'Champs du formulaire, variantes et enregistrement en bibliothèque',
          slug: 'getting-started/perfect-copy',
        },
      ],
    },
    {
      id: 'crm',
      title: 'CRM et leads',
      articles: [
        {
          id: 'pipeline-guide',
          title: 'Pipeline leads (Kanban)',
          description: 'Faites glisser les leads entre les colonnes pour mettre à jour le statut',
          slug: 'crm/pipeline',
        },
      ],
    },
    {
      id: 'account',
      title: 'Compte',
      articles: [
        {
          id: 'billing-guide',
          title: 'Forfait et facturation',
          description: 'Mises à niveau, portail Stripe et statut d’abonnement',
          slug: 'account/billing-guide',
        },
      ],
    },
    {
      id: 'prospecting',
      title: 'Moteur de prospection',
      articles: [
        {
          id: 'scraper-guide',
          title: 'Guide du scraper global',
          description: 'Trouver des biens sur Idealista, Zillow, Immobiliare.it',
          slug: 'prospecting/scraper-guide',
        },
        {
          id: 'arbitrage',
          title: 'Guide arbitrage',
          description: 'Identifier les opportunités de marché et calculer le Market Gap',
          slug: 'prospecting/arbitrage',
        },
        {
          id: 'filters',
          title: 'Filtres de recherche avancés',
          description: 'Configurer des filtres automatiques pour les meilleures affaires',
          slug: 'prospecting/filters',
        },
      ],
    },
    {
      id: 'ai-voice',
      title: 'Appels vocaux IA',
      articles: [
        {
          id: 'voice-setup',
          title: 'Configuration des appels IA',
          description: 'Configurer Bland AI et lancer les appels',
          slug: 'ai-voice/voice-setup',
        },
        {
          id: 'call-scripts',
          title: 'Scripts d’appel personnalisés',
          description: 'Créer des scripts efficaces pour obtenir des mandats',
          slug: 'ai-voice/call-scripts',
        },
        {
          id: 'obstacle-handling',
          title: 'Gestion des objections',
          description: 'Comment l’IA gère les objections des propriétaires',
          slug: 'ai-voice/obstacle-handling',
        },
      ],
    },
    {
      id: '3d-staging',
      title: 'Home staging 3D',
      articles: [
        {
          id: 'staging-guide',
          title: 'Guide du staging 3D',
          description: 'Générer des visualisations post-rénovation pour convaincre les clients',
          slug: '3d-staging/staging-guide',
        },
        {
          id: 'whatsapp-integration',
          title: 'Envoi via WhatsApp',
          description: 'Partager des projets 3D avec propriétaires et clients',
          slug: '3d-staging/whatsapp-integration',
        },
      ],
    },
    {
      id: 'aura-vr',
      title: 'Aura VR',
      articles: [
        {
          id: 'vr-guide',
          title: 'Guide Aura VR',
          description: 'Visite immersive 360° à partir de photos pour WhatsApp et présentations',
          slug: 'aura-vr/vr-guide',
        },
      ],
    },
    {
      id: 'price-sniper',
      title: 'Price Drop Sniper',
      articles: [
        {
          id: 'sniper-guide',
          title: 'Fonctionnement du Sniper',
          description: 'Détecter les baisses de prix en temps réel',
          slug: 'price-sniper/sniper-guide',
        },
        {
          id: 'sniper-strategy',
          title: 'Stratégie Sniper',
          description: 'Contacter les propriétaires après une baisse de prix',
          slug: 'price-sniper/sniper-strategy',
        },
      ],
    },
    {
      id: 'commercial',
      title: 'Intelligence commerciale',
      articles: [
        {
          id: 'commercial-guide',
          title: 'Analyse immobilière commerciale',
          description: 'Identifier les activités recommandées et les écarts de marché',
          slug: 'commercial/commercial-guide',
        },
        {
          id: 'business-features',
          title: 'Fonctions clés pour le commercial',
          description: 'Détecter cheminée, vitrine, catégorie C3',
          slug: 'commercial/business-features',
        },
      ],
    },
    {
      id: 'territory',
      title: 'Territory Commander',
      articles: [
        {
          id: 'territory-guide',
          title: 'Analyse du territoire',
          description: 'Demande, ADN du quartier, vélocité des ventes',
          slug: 'territory/territory-guide',
        },
        {
          id: 'map-usage',
          title: 'Utilisation de la carte tactique',
          description: 'Naviguer les deals sur la carte interactive',
          slug: 'territory/map-usage',
        },
      ],
    },
    {
      id: 'smart-briefing',
      title: 'Briefing intelligent IA',
      articles: [
        {
          id: 'briefing-guide',
          title: 'Guide du Smart Briefing',
          description: 'Avantages, inconvénients, cible automatique',
          slug: 'smart-briefing/briefing-guide',
        },
        {
          id: 'client-ready',
          title: 'Texte prêt pour le client',
          description: 'Générer des résumés prêts pour WhatsApp',
          slug: 'smart-briefing/client-ready',
        },
      ],
    },
    {
      id: 'xray',
      title: 'Vision radiographique IA',
      articles: [
        {
          id: 'xray-guide',
          title: 'Analyse technique des images',
          description: 'Détecter défauts et atouts avec l’IA',
          slug: 'xray/xray-guide',
        },
        {
          id: 'renovation-quote',
          title: 'Budget de rénovation',
          description: 'Estimer les coûts de rénovation',
          slug: 'xray/renovation-quote',
        },
      ],
    },
    {
      id: 'competitor',
      title: 'Radar concurrentiel',
      articles: [
        {
          id: 'radar-guide',
          title: 'Détection de mandats expirants',
          description: 'Trouver des biens stagnants depuis 120+ jours',
          slug: 'competitor/radar-guide',
        },
      ],
    },
  ],
};

export const docsHubUiDe: DocsHubUi = {
  pageTitle: 'Dokumentationszentrum',
  pageSubtitle: 'Vollständige Anleitungen für PropertyPilot AI',
  searchPlaceholder: 'In Anleitungen suchen…',
  articleSingular: 'Artikel',
  articlePlural: 'Artikel',
  quickStartTitle: 'Schnellstart',
  quickStartDesc: 'Neu bei PropertyPilot? Starten Sie hier.',
  quickStartBtn: 'Hier starten',
  bestPracticesTitle: 'Best Practices',
  bestPracticesDesc: 'Fortgeschrittene Strategien für bessere Ergebnisse.',
  bestPracticesBtn: 'Strategien entdecken',
  goalsTitle: 'Ziele',
  goalsDesc: 'So gewinnen Sie in 7 Tagen Mandate mit KI.',
  goalsBtn: 'Mandate gewinnen',
  backToDocs: 'Zurück zur Dokumentation',
  sections: [
    {
      id: 'getting-started',
      title: 'Erste Schritte',
      articles: [
        {
          id: 'welcome',
          title: 'Willkommen bei PropertyPilot AI',
          description: 'Einführung in die Plattform',
          slug: 'getting-started/welcome',
        },
        {
          id: 'first-listing',
          title: 'Erstes Inserat erstellen',
          description: 'KI-Inserat in 2 Minuten generieren',
          slug: 'getting-started/first-listing',
        },
        {
          id: 'workspace-setup',
          title: 'Workspace einrichten',
          description: 'Dashboard anpassen',
          slug: 'getting-started/workspace-setup',
        },
        {
          id: 'perfect-copy-guide',
          title: 'Perfect Copy — Kurzanleitung',
          description: 'Formularfelder, Varianten und Speichern in der Bibliothek',
          slug: 'getting-started/perfect-copy',
        },
      ],
    },
    {
      id: 'crm',
      title: 'CRM & Leads',
      articles: [
        {
          id: 'pipeline-guide',
          title: 'Lead-Pipeline (Kanban)',
          description: 'Leads per Drag & Drop zwischen Spalten verschieben',
          slug: 'crm/pipeline',
        },
      ],
    },
    {
      id: 'account',
      title: 'Konto',
      articles: [
        {
          id: 'billing-guide',
          title: 'Plan & Abrechnung',
          description: 'Upgrades, Stripe-Portal und Abo-Status',
          slug: 'account/billing-guide',
        },
      ],
    },
    {
      id: 'prospecting',
      title: 'Prospecting Engine',
      articles: [
        {
          id: 'scraper-guide',
          title: 'Global Scraper Guide',
          description: 'Immobilien auf Idealista, Zillow, Immobiliare.it finden',
          slug: 'prospecting/scraper-guide',
        },
        {
          id: 'arbitrage',
          title: 'Arbitrage-Leitfaden',
          description: 'Marktchancen erkennen und Market Gap berechnen',
          slug: 'prospecting/arbitrage',
        },
        {
          id: 'filters',
          title: 'Erweiterte Suchfilter',
          description: 'Automatische Filter für die besten Deals',
          slug: 'prospecting/filters',
        },
      ],
    },
    {
      id: 'ai-voice',
      title: 'KI-Sprachanrufe',
      articles: [
        {
          id: 'voice-setup',
          title: 'KI-Anruf einrichten',
          description: 'Bland AI konfigurieren und anrufen',
          slug: 'ai-voice/voice-setup',
        },
        {
          id: 'call-scripts',
          title: 'Individuelle Gesprächsskripte',
          description: 'Effektive Skripte für Mandate',
          slug: 'ai-voice/call-scripts',
        },
        {
          id: 'obstacle-handling',
          title: 'Einwandbehandlung',
          description: 'Wie die KI Eigentümereinwände behandelt',
          slug: 'ai-voice/obstacle-handling',
        },
      ],
    },
    {
      id: '3d-staging',
      title: '3D Virtual Staging',
      articles: [
        {
          id: 'staging-guide',
          title: '3D-Staging-Anleitung',
          description: 'Visualisierungen nach Renovierung für Überzeugung',
          slug: '3d-staging/staging-guide',
        },
        {
          id: 'whatsapp-integration',
          title: 'Per WhatsApp senden',
          description: '3D-Projekte mit Eigentümern und Kunden teilen',
          slug: '3d-staging/whatsapp-integration',
        },
      ],
    },
    {
      id: 'aura-vr',
      title: 'Aura VR',
      articles: [
        {
          id: 'vr-guide',
          title: 'Aura VR — Anleitung',
          description: 'Immersive 360°-Tour aus Fotos für WhatsApp und Präsentationen',
          slug: 'aura-vr/vr-guide',
        },
      ],
    },
    {
      id: 'price-sniper',
      title: 'Price Drop Sniper',
      articles: [
        {
          id: 'sniper-guide',
          title: 'So funktioniert der Sniper',
          description: 'Preissenkungen in Echtzeit erkennen',
          slug: 'price-sniper/sniper-guide',
        },
        {
          id: 'sniper-strategy',
          title: 'Sniper-Strategie',
          description: 'Eigentümer nach Preissenkung ansprechen',
          slug: 'price-sniper/sniper-strategy',
        },
      ],
    },
    {
      id: 'commercial',
      title: 'Commercial Intelligence',
      articles: [
        {
          id: 'commercial-guide',
          title: 'Gewerbeimmobilien-Analyse',
          description: 'Empfohlene Nutzungen und Marktlücken erkennen',
          slug: 'commercial/commercial-guide',
        },
        {
          id: 'business-features',
          title: 'Wichtige Business-Features',
          description: 'Schornstein, Schaufenster, Kategorie C3 erkennen',
          slug: 'commercial/business-features',
        },
      ],
    },
    {
      id: 'territory',
      title: 'Territory Commander',
      articles: [
        {
          id: 'territory-guide',
          title: 'Gebietsanalyse',
          description: 'Nachfrage, Viertel-DNA, Verkaufsgeschwindigkeit',
          slug: 'territory/territory-guide',
        },
        {
          id: 'map-usage',
          title: 'Taktische Karte',
          description: 'Deals auf der interaktiven Karte navigieren',
          slug: 'territory/map-usage',
        },
      ],
    },
    {
      id: 'smart-briefing',
      title: 'KI Smart Briefing',
      articles: [
        {
          id: 'briefing-guide',
          title: 'Smart-Briefing-Anleitung',
          description: 'Vor- und Nachteile, automatische Zielgruppe',
          slug: 'smart-briefing/briefing-guide',
        },
        {
          id: 'client-ready',
          title: 'Kundentext fertig',
          description: 'WhatsApp-taugliche Zusammenfassungen generieren',
          slug: 'smart-briefing/client-ready',
        },
      ],
    },
    {
      id: 'xray',
      title: 'KI-Röntgenblick',
      articles: [
        {
          id: 'xray-guide',
          title: 'Technische Bildanalyse',
          description: 'Mängel und Highlights mit KI erkennen',
          slug: 'xray/xray-guide',
        },
        {
          id: 'renovation-quote',
          title: 'Renovierungsbudget',
          description: 'Sanierungskosten schätzen',
          slug: 'xray/renovation-quote',
        },
      ],
    },
    {
      id: 'competitor',
      title: 'Competitor Radar',
      articles: [
        {
          id: 'radar-guide',
          title: 'Auslaufende Mandate erkennen',
          description: 'Objekte finden, die 120+ Tage stagnieren',
          slug: 'competitor/radar-guide',
        },
      ],
    },
  ],
};

export const docsHubUiPt: DocsHubUi = {
  pageTitle: 'Centro de documentação',
  pageSubtitle: 'Guias completos para dominar o PropertyPilot AI',
  searchPlaceholder: 'Pesquisar nas guias…',
  articleSingular: 'artigo',
  articlePlural: 'artigos',
  quickStartTitle: 'Início rápido',
  quickStartDesc: 'Novo no PropertyPilot? Comece aqui.',
  quickStartBtn: 'Começar aqui',
  bestPracticesTitle: 'Boas práticas',
  bestPracticesDesc: 'Estratégias avançadas para maximizar resultados.',
  bestPracticesBtn: 'Ver estratégias',
  goalsTitle: 'Objetivos',
  goalsDesc: 'Como conseguir mandatos com IA em 7 dias.',
  goalsBtn: 'Conseguir mandatos',
  backToDocs: 'Voltar à documentação',
  sections: [
    {
      id: 'getting-started',
      title: 'Primeiros passos',
      articles: [
        {
          id: 'welcome',
          title: 'Bem-vindo ao PropertyPilot AI',
          description: 'Guia introdutório à plataforma',
          slug: 'getting-started/welcome',
        },
        {
          id: 'first-listing',
          title: 'Crie o seu primeiro anúncio',
          description: 'Gere um anúncio com IA em 2 minutos',
          slug: 'getting-started/first-listing',
        },
        {
          id: 'workspace-setup',
          title: 'Configure o seu espaço de trabalho',
          description: 'Personalize o painel',
          slug: 'getting-started/workspace-setup',
        },
        {
          id: 'perfect-copy-guide',
          title: 'Perfect Copy — guia rápida',
          description: 'Campos do formulário, variantes e gravação na biblioteca',
          slug: 'getting-started/perfect-copy',
        },
      ],
    },
    {
      id: 'crm',
      title: 'CRM e leads',
      articles: [
        {
          id: 'pipeline-guide',
          title: 'Pipeline de leads (Kanban)',
          description: 'Arraste leads entre colunas e atualize o estado',
          slug: 'crm/pipeline',
        },
      ],
    },
    {
      id: 'account',
      title: 'Conta',
      articles: [
        {
          id: 'billing-guide',
          title: 'Plano e faturação',
          description: 'Upgrades, portal Stripe e estado da subscrição',
          slug: 'account/billing-guide',
        },
      ],
    },
    {
      id: 'prospecting',
      title: 'Motor de prospeção',
      articles: [
        {
          id: 'scraper-guide',
          title: 'Guia do Scraper global',
          description: 'Encontrar imóveis no Idealista, Zillow, Immobiliare.it',
          slug: 'prospecting/scraper-guide',
        },
        {
          id: 'arbitrage',
          title: 'Guia de arbitragem',
          description: 'Identificar oportunidades de mercado e calcular o Market Gap',
          slug: 'prospecting/arbitrage',
        },
        {
          id: 'filters',
          title: 'Filtros de pesquisa avançados',
          description: 'Configure filtros automáticos para os melhores negócios',
          slug: 'prospecting/filters',
        },
      ],
    },
    {
      id: 'ai-voice',
      title: 'Chamadas de voz com IA',
      articles: [
        {
          id: 'voice-setup',
          title: 'Configuração de chamadas IA',
          description: 'Configure o Bland AI e comece a ligar',
          slug: 'ai-voice/voice-setup',
        },
        {
          id: 'call-scripts',
          title: 'Guiões de chamada personalizados',
          description: 'Crie guiões eficazes para obter mandatos',
          slug: 'ai-voice/call-scripts',
        },
        {
          id: 'obstacle-handling',
          title: 'Gestão de objeções',
          description: 'Como a IA trata as objeções dos proprietários',
          slug: 'ai-voice/obstacle-handling',
        },
      ],
    },
    {
      id: '3d-staging',
      title: 'Home staging 3D',
      articles: [
        {
          id: 'staging-guide',
          title: 'Guia de staging 3D',
          description: 'Gere visualizações pós-renovação para convencer clientes',
          slug: '3d-staging/staging-guide',
        },
        {
          id: 'whatsapp-integration',
          title: 'Envio via WhatsApp',
          description: 'Partilhe projetos 3D com proprietários e clientes',
          slug: '3d-staging/whatsapp-integration',
        },
      ],
    },
    {
      id: 'aura-vr',
      title: 'Aura VR',
      articles: [
        {
          id: 'vr-guide',
          title: 'Guia Aura VR',
          description: 'Tour imersivo 360° a partir de fotos para WhatsApp e apresentações',
          slug: 'aura-vr/vr-guide',
        },
      ],
    },
    {
      id: 'price-sniper',
      title: 'Price Drop Sniper',
      articles: [
        {
          id: 'sniper-guide',
          title: 'Como funciona o Sniper',
          description: 'Deteta quedas de preço em tempo real',
          slug: 'price-sniper/sniper-guide',
        },
        {
          id: 'sniper-strategy',
          title: 'Estratégia Sniper',
          description: 'Contacte proprietários após uma queda de preço',
          slug: 'price-sniper/sniper-strategy',
        },
      ],
    },
    {
      id: 'commercial',
      title: 'Inteligência comercial',
      articles: [
        {
          id: 'commercial-guide',
          title: 'Análise de imóveis comerciais',
          description: 'Identifique negócios recomendados e lacunas de mercado',
          slug: 'commercial/commercial-guide',
        },
        {
          id: 'business-features',
          title: 'Funcionalidades-chave para comercial',
          description: 'Detete chaminé, montra, categoria C3',
          slug: 'commercial/business-features',
        },
      ],
    },
    {
      id: 'territory',
      title: 'Territory Commander',
      articles: [
        {
          id: 'territory-guide',
          title: 'Análise do território',
          description: 'Procura, ADN do bairro, velocidade de venda',
          slug: 'territory/territory-guide',
        },
        {
          id: 'map-usage',
          title: 'Uso do mapa tático',
          description: 'Navegue negócios no mapa interativo',
          slug: 'territory/map-usage',
        },
      ],
    },
    {
      id: 'smart-briefing',
      title: 'Briefing inteligente IA',
      articles: [
        {
          id: 'briefing-guide',
          title: 'Guia do Smart Briefing',
          description: 'Prós, contras, público-alvo automático',
          slug: 'smart-briefing/briefing-guide',
        },
        {
          id: 'client-ready',
          title: 'Texto pronto para o cliente',
          description: 'Gere resumos prontos para WhatsApp',
          slug: 'smart-briefing/client-ready',
        },
      ],
    },
    {
      id: 'xray',
      title: 'Visão raio-X IA',
      articles: [
        {
          id: 'xray-guide',
          title: 'Análise técnica de imagens',
          description: 'Detete defeitos e pontos fortes com IA',
          slug: 'xray/xray-guide',
        },
        {
          id: 'renovation-quote',
          title: 'Orçamento de requalificação',
          description: 'Calcule custos de renovação',
          slug: 'xray/renovation-quote',
        },
      ],
    },
    {
      id: 'competitor',
      title: 'Radar de concorrentes',
      articles: [
        {
          id: 'radar-guide',
          title: 'Deteção de mandatos a expirar',
          description: 'Encontre imóveis parados há 120+ dias',
          slug: 'competitor/radar-guide',
        },
      ],
    },
  ],
};

export const docsHubUiAr: DocsHubUi = {
  pageTitle: 'مركز التوثيق',
  pageSubtitle: 'أدلة كاملة لإتقان PropertyPilot AI',
  searchPlaceholder: 'البحث في الأدلة…',
  articleSingular: 'مقال',
  articlePlural: 'مقالات',
  quickStartTitle: 'بدء سريع',
  quickStartDesc: 'جديد على PropertyPilot؟ ابدأ من هنا.',
  quickStartBtn: 'ابدأ هنا',
  bestPracticesTitle: 'أفضل الممارسات',
  bestPracticesDesc: 'استراتيجيات متقدمة لتعظيم النتائج.',
  bestPracticesBtn: 'استكشاف الاستراتيجيات',
  goalsTitle: 'الأهداف',
  goalsDesc: 'كيف تفوز بتفويضات خلال 7 أيام بالذكاء الاصطناعي.',
  goalsBtn: 'احصل على تفويضات',
  backToDocs: 'العودة إلى التوثيق',
  sections: [
    {
      id: 'getting-started',
      title: 'البدء',
      articles: [
        {
          id: 'welcome',
          title: 'مرحباً بك في PropertyPilot AI',
          description: 'دليل تعريفي بالمنصة',
          slug: 'getting-started/welcome',
        },
        {
          id: 'first-listing',
          title: 'أنشئ إعلانك الأول',
          description: 'ولّد إعلاناً بالذكاء الاصطناعي في دقيقتين',
          slug: 'getting-started/first-listing',
        },
        {
          id: 'workspace-setup',
          title: 'إعداد مساحة العمل',
          description: 'خصص لوحة التحكم',
          slug: 'getting-started/workspace-setup',
        },
        {
          id: 'perfect-copy-guide',
          title: 'Perfect Copy — دليل سريع',
          description: 'حقول النموذج والمتغيرات والحفظ في المكتبة',
          slug: 'getting-started/perfect-copy',
        },
      ],
    },
    {
      id: 'crm',
      title: 'CRM والعملاء المحتملين',
      articles: [
        {
          id: 'pipeline-guide',
          title: 'مسار العملاء (كانبان)',
          description: 'اسحب العملاء بين الأعمدة لتحديث الحالة',
          slug: 'crm/pipeline',
        },
      ],
    },
    {
      id: 'account',
      title: 'الحساب',
      articles: [
        {
          id: 'billing-guide',
          title: 'الخطة والفوترة',
          description: 'الترقيات وبوابة Stripe وحالة الاشتراك',
          slug: 'account/billing-guide',
        },
      ],
    },
    {
      id: 'prospecting',
      title: 'محرك الاستكشاف',
      articles: [
        {
          id: 'scraper-guide',
          title: 'دليل المجمع العالمي',
          description: 'كيفية العثور على عقارات على Idealista وZillow وImmobiliare.it',
          slug: 'prospecting/scraper-guide',
        },
        {
          id: 'arbitrage',
          title: 'دليل المراجحة',
          description: 'حدد فرص السوق واحسب فجوة السوق',
          slug: 'prospecting/arbitrage',
        },
        {
          id: 'filters',
          title: 'مرشحات بحث متقدمة',
          description: 'اضبط مرشحات تلقائية لأفضل الصفقات',
          slug: 'prospecting/filters',
        },
      ],
    },
    {
      id: 'ai-voice',
      title: 'مكالمات صوتية بالذكاء الاصطناعي',
      articles: [
        {
          id: 'voice-setup',
          title: 'إعداد المكالمات بالذكاء الاصطناعي',
          description: 'اضبط Bland AI وابدأ الاتصال',
          slug: 'ai-voice/voice-setup',
        },
        {
          id: 'call-scripts',
          title: 'نصوص مكالمات مخصصة',
          description: 'أنشئ نصوصاً فعالة للحصول على تفويضات',
          slug: 'ai-voice/call-scripts',
        },
        {
          id: 'obstacle-handling',
          title: 'التعامل مع الاعتراضات',
          description: 'كيف يتعامل الذكاء الاصطناعي مع اعتراضات المالكين',
          slug: 'ai-voice/obstacle-handling',
        },
      ],
    },
    {
      id: '3d-staging',
      title: 'التجهيز الافتراضي ثلاثي الأبعاد',
      articles: [
        {
          id: 'staging-guide',
          title: 'دليل التجهيز 3D',
          description: 'ولّد تصورات ما بعد التجديد لإقناع العملاء',
          slug: '3d-staging/staging-guide',
        },
        {
          id: 'whatsapp-integration',
          title: 'الإرسال عبر واتساب',
          description: 'شارك مشاريع ثلاثية الأبعاد مع المالكين والعملاء',
          slug: '3d-staging/whatsapp-integration',
        },
      ],
    },
    {
      id: 'aura-vr',
      title: 'Aura VR',
      articles: [
        {
          id: 'vr-guide',
          title: 'دليل Aura VR',
          description: 'جولة غامرة 360° من الصور لواتساب والعروض',
          slug: 'aura-vr/vr-guide',
        },
      ],
    },
    {
      id: 'price-sniper',
      title: 'Price Drop Sniper',
      articles: [
        {
          id: 'sniper-guide',
          title: 'كيف يعمل Sniper',
          description: 'رصد انخفاضات الأسعار في الوقت الفعلي',
          slug: 'price-sniper/sniper-guide',
        },
        {
          id: 'sniper-strategy',
          title: 'استراتيجية Sniper',
          description: 'تواصل مع المالكين بعد انخفاض السعر',
          slug: 'price-sniper/sniper-strategy',
        },
      ],
    },
    {
      id: 'commercial',
      title: 'ذكاء تجاري',
      articles: [
        {
          id: 'commercial-guide',
          title: 'تحليل العقارات التجارية',
          description: 'حدد الأنشطة الموصى بها وفجوات السوق',
          slug: 'commercial/commercial-guide',
        },
        {
          id: 'business-features',
          title: 'ميزات رئيسية للتجاري',
          description: 'رصد المدخنة وواجهة العرض وفئة C3',
          slug: 'commercial/business-features',
        },
      ],
    },
    {
      id: 'territory',
      title: 'Territory Commander',
      articles: [
        {
          id: 'territory-guide',
          title: 'تحليل الإقليم',
          description: 'الطلب، هوية الحي، سرعة البيع',
          slug: 'territory/territory-guide',
        },
        {
          id: 'map-usage',
          title: 'استخدام الخريطة التكتيكية',
          description: 'تصفح الصفقات على الخريطة التفاعلية',
          slug: 'territory/map-usage',
        },
      ],
    },
    {
      id: 'smart-briefing',
      title: 'إحاطة ذكية بالذكاء الاصطناعي',
      articles: [
        {
          id: 'briefing-guide',
          title: 'دليل الإحاطة الذكية',
          description: 'الإيجابيات والسلبيات والجمهور المستهدف تلقائياً',
          slug: 'smart-briefing/briefing-guide',
        },
        {
          id: 'client-ready',
          title: 'نص جاهز للعميل',
          description: 'ولّد ملخصات جاهزة لواتساب',
          slug: 'smart-briefing/client-ready',
        },
      ],
    },
    {
      id: 'xray',
      title: 'رؤية أشعة سينية بالذكاء الاصطناعي',
      articles: [
        {
          id: 'xray-guide',
          title: 'تحليل تقني للصور',
          description: 'رصد العيوب والمزايا بالذكاء الاصطناعي',
          slug: 'xray/xray-guide',
        },
        {
          id: 'renovation-quote',
          title: 'ميزانية التجديد',
          description: 'احسب تكاليف الترميم',
          slug: 'xray/renovation-quote',
        },
      ],
    },
    {
      id: 'competitor',
      title: 'رادار المنافسين',
      articles: [
        {
          id: 'radar-guide',
          title: 'رصد التفويضات المنتهية',
          description: 'اعثر على عقارات راكدة منذ 120+ يوماً',
          slug: 'competitor/radar-guide',
        },
      ],
    },
  ],
};
