/**
 * Sidebar / command palette nav + command palette quick links & guides.
 * IT/EN: dashboard-nav-ui.ts. ES/FR/DE/PT/AR: this file.
 */
import type { CommandPaletteExtraStrings, DashboardNavUi } from '@/lib/i18n/dashboard-nav-ui';

const jtbdEs = {
  content: {
    heading: 'Contenidos y anuncios',
    items: {
      listings: { label: 'Generar anuncio', description: 'Crea anuncios con IA en 30 segundos' },
      'perfect-copy': { label: 'Perfect Copy', description: 'Copy persuasivo con Hook + Cuerpo + CTA' },
      titles: { label: 'Generar títulos', description: '10 títulos irresistibles con IA' },
      'emotional-listing': { label: 'Anuncio emocional', description: 'Storytelling que vende' },
      'refine-listing': { label: 'Refinar anuncio', description: 'Mejora y optimiza textos existentes' },
      translate: { label: 'Traducir anuncio', description: 'Traduce a más de 10 idiomas' },
      'social-posts': { label: 'Posts sociales', description: 'Posts para Instagram, Facebook, LinkedIn' },
      hashtags: { label: 'Hashtags', description: 'Sets de hashtags optimizados por plataforma' },
      'followup-emails': { label: 'Emails de seguimiento', description: 'Emails profesionales en cada fase' },
      'video-scripts': { label: 'Guiones de vídeo', description: 'Guiones para Reels y TikTok' },
      'agent-bio': { label: 'Bio del agente', description: 'Bio profesional para tu perfil' },
      pdf: { label: 'Generar PDF', description: 'Folleto profesional en segundos' },
    },
  },
  crm: {
    heading: 'Leads, CRM y prospección',
    items: {
      prospecting: {
        label: 'Motor de prospección',
        description: 'Encuentra inmuebles en Idealista, Zillow, Immobiliare.it',
      },
      leads: { label: 'CRM Leads', description: 'Gestiona todos tus leads' },
      pipeline: { label: 'Pipeline de leads', description: 'Tablero Kanban de tus leads' },
      'workflow-automations': {
        label: 'Automatizaciones',
        description: 'Seguimientos, recordatorios y contenido recurrente',
      },
      'crm-automations': {
        label: 'Reglas CRM (si/entonces)',
        description: 'Disparadores en eventos de lead: estado, score, email…',
      },
      map: { label: 'Mapa táctico', description: 'Ver operaciones en el mapa interactivo' },
      'lead-score': { label: 'Lead Score IA', description: 'Puntuación IA para cada lead' },
      opportunities: { label: 'Oportunidades', description: 'Operaciones con Market Gap identificado' },
    },
  },
  intel: {
    heading: 'Inteligencia e investigación',
    items: {
      analyze: { label: 'Análisis de inmueble', description: 'Rayos X IA en fotos y planos' },
      auditor: { label: 'Auditor IA', description: 'Análisis de calidad de anuncios existentes' },
      autopilot: { label: 'Autopilot', description: 'Prospección automática 24/7' },
      scraper: { label: 'Scraper global', description: 'Busca inmuebles en portales mundiales' },
    },
  },
  brand: {
    heading: 'Marca y crecimiento',
    items: {
      'agency-branding': { label: 'Branding de agencia', description: 'Logo, colores y estilo de tu marca' },
      'agency-assistant': { label: 'Asistente de agencia', description: 'IA dedicada a tu agencia' },
      packages: { label: 'Paquetes de servicios', description: 'Crea paquetes para vender a clientes' },
      referral: { label: 'Programa de referidos', description: 'Gana invitando a colegas' },
    },
  },
  account: {
    heading: 'Cuenta y workspace',
    items: {
      dashboard: { label: 'Panel', description: 'Volver al panel principal' },
      'settings-workspace': { label: 'Ajustes del workspace', description: 'Nombre de agencia, idiomas, preferencias' },
      billing: { label: 'Suscripción y facturación', description: 'Gestiona tu plan' },
      compliance: { label: 'Cumplimiento', description: 'GDPR, CCPA y documentos legales' },
      docs: { label: 'Documentación', description: 'Guías y tutoriales' },
    },
  },
} as const satisfies DashboardNavUi['jtbd'];

export const commandPaletteExtrasEs: CommandPaletteExtraStrings = {
  quick: {
    'ql-listings': {
      label: 'Biblioteca de anuncios',
      description: 'Anuncios guardados y borradores',
      keywords: 'biblioteca guardados anuncios listing',
    },
    'ql-perfect-copy': {
      label: 'Perfect Copy',
      description: '5 variantes de copy de una vez',
      keywords: 'copy anuncio variantes',
    },
    'ql-pipeline': {
      label: 'Pipeline de leads',
      description: 'Kanban de estados de lead',
      keywords: 'kanban crm lead',
    },
    'ql-lead-score': {
      label: 'Lead Score IA',
      description: 'Puntuación inteligente de leads',
      keywords: 'score puntuación lead',
    },
    'ql-billing': {
      label: 'Facturación',
      description: 'Plan, Stripe, facturas',
      keywords: 'suscripción plan stripe factura',
    },
    'ql-workspace': {
      label: 'Workspace',
      description: 'Módulos y preferencias de la agencia',
      keywords: 'ajustes módulos agencia',
    },
    'ql-home': {
      label: 'Centro de mando (inicio)',
      description: 'Panel principal',
      keywords: 'inicio principal resumen',
    },
  },
  guides: {
    'g-hub': {
      label: 'Hub de documentación',
      description: 'Todas las guías y FAQ',
      keywords: 'docs ayuda faq',
    },
    'g-welcome': {
      label: 'Guía: Bienvenida',
      description: 'Introducción a la plataforma',
      keywords: 'inicio intro onboarding',
    },
    'g-first-listing': {
      label: 'Guía: Primer anuncio',
      description: 'Flujo rápido para generar copy',
      keywords: 'primer anuncio generar tutorial',
    },
    'g-workspace-doc': {
      label: 'Guía: Workspace',
      description: 'Módulos y personalización',
      keywords: 'workspace módulos ajustes',
    },
    'g-perfect-copy': {
      label: 'Guía: Perfect Copy',
      description: 'Campos del formulario y variantes',
      keywords: 'perfect copy formulario variantes',
    },
    'g-pipeline': {
      label: 'Guía: Pipeline Kanban',
      description: 'Arrastrar estados y CRM',
      keywords: 'pipeline kanban lead crm',
    },
    'g-billing': {
      label: 'Guía: Plan y facturación',
      description: 'Stripe y suscripción',
      keywords: 'facturación stripe plan suscripción',
    },
    'g-arbitrage': {
      label: 'Guía: Arbitraje / Market Gap',
      description: 'Oportunidades y precios',
      keywords: 'arbitraje market gap operación',
    },
  },
};

export const dashboardNavUiEs: DashboardNavUi = {
  jtbd: jtbdEs,
  commandPalette: {
    placeholder: 'Buscar herramientas, páginas, acciones…',
    noResults: 'No se encontraron resultados.',
    hint: 'Pulsa',
    hintOpen: 'para abrir el Centro de mando',
    signOut: 'Cerrar sesión',
    signOutDesc: 'Cerrar sesión en este dispositivo',
    help: 'Centro de ayuda',
    helpDesc: 'Guías y FAQ',
    quickLinksHeading: 'Enlaces rápidos',
    guidesHeading: 'Guías (nueva pestaña)',
    opensNewTab: 'Se abre en una nueva pestaña',
    quickActionsHeading: 'Acciones rápidas',
  },
  layout: {
    sidebarAriaLabel: 'Navegación del área de trabajo',
    sidebarKicker: 'Área de trabajo',
    sidebarSubtitle: 'Herramientas por función',
    mobileOpenMenuAria: 'Abrir menú del área de trabajo',
    mobileCloseMenuAria: 'Cerrar menú',
    mobileTitle: 'Área de trabajo',
    mobileSubtitle: 'Los mismos grupos que la barra lateral de escritorio',
    mobileNavAriaLabel: 'Navegación móvil',
    menuButtonLabel: 'Menú',
  },
};

const jtbdFr = {
  content: {
    heading: 'Annonces & contenus',
    items: {
      listings: { label: 'Générer une annonce', description: 'Créez des annonces IA en 30 secondes' },
      'perfect-copy': { label: 'Perfect Copy', description: 'Copy persuasif avec Accroche + Corps + CTA' },
      titles: { label: 'Générer des titres', description: '10 titres irrésistibles avec l’IA' },
      'emotional-listing': { label: 'Annonce émotionnelle', description: 'Storytelling qui convertit' },
      'refine-listing': { label: 'Affiner l’annonce', description: 'Améliorez et optimisez vos textes' },
      translate: { label: 'Traduire l’annonce', description: 'Traduisez en plus de 10 langues' },
      'social-posts': { label: 'Posts sociaux', description: 'Posts Instagram, Facebook, LinkedIn' },
      hashtags: { label: 'Hashtags', description: 'Sets optimisés par plateforme' },
      'followup-emails': { label: 'Emails de relance', description: 'Emails pros à chaque étape' },
      'video-scripts': { label: 'Scripts vidéo', description: 'Scripts pour Reels et TikTok' },
      'agent-bio': { label: 'Bio agent', description: 'Bio professionnelle pour votre profil' },
      pdf: { label: 'Générer PDF', description: 'Brochure pro en quelques secondes' },
    },
  },
  crm: {
    heading: 'Leads, CRM & prospection',
    items: {
      prospecting: {
        label: 'Moteur de prospection',
        description: 'Trouvez des biens sur Idealista, Zillow, Immobiliare.it',
      },
      leads: { label: 'CRM Leads', description: 'Gérez tous vos leads' },
      pipeline: { label: 'Pipeline leads', description: 'Tableau Kanban de vos leads' },
      'workflow-automations': {
        label: 'Automatisations',
        description: 'Relances, rappels et contenu récurrent',
      },
      'crm-automations': {
        label: 'Règles CRM (si/alors)',
        description: 'Déclencheurs sur événements lead : statut, score, email…',
      },
      map: { label: 'Carte tactique', description: 'Voir les deals sur la carte interactive' },
      'lead-score': { label: 'Lead Score IA', description: 'Score IA pour chaque lead' },
      opportunities: { label: 'Opportunités', description: 'Deals avec Market Gap identifié' },
    },
  },
  intel: {
    heading: 'Intelligence & recherche',
    items: {
      analyze: { label: 'Analyse immobilière', description: 'Rayons X IA sur photos et plans' },
      auditor: { label: 'Auditeur IA', description: 'Analyse qualité des annonces existantes' },
      autopilot: { label: 'Autopilot', description: 'Prospection automatique 24/7' },
      scraper: { label: 'Scraper global', description: 'Recherche sur portails mondiaux' },
    },
  },
  brand: {
    heading: 'Marque & croissance',
    items: {
      'agency-branding': { label: 'Branding agence', description: 'Logo, couleurs et style' },
      'agency-assistant': { label: 'Assistant agence', description: 'IA dédiée à votre agence' },
      packages: { label: 'Packs services', description: 'Créez des offres pour vos clients' },
      referral: { label: 'Programme parrainage', description: 'Gagnez en invitant des collègues' },
    },
  },
  account: {
    heading: 'Compte & workspace',
    items: {
      dashboard: { label: 'Tableau de bord', description: 'Retour au tableau de bord' },
      'settings-workspace': { label: 'Paramètres workspace', description: 'Nom agence, langues, préférences' },
      billing: { label: 'Abonnement & facturation', description: 'Gérez votre forfait' },
      compliance: { label: 'Conformité', description: 'RGPD, CCPA et documents légaux' },
      docs: { label: 'Documentation', description: 'Guides et tutoriels' },
    },
  },
} as const satisfies DashboardNavUi['jtbd'];

export const commandPaletteExtrasFr: CommandPaletteExtraStrings = {
  quick: {
    'ql-listings': {
      label: 'Bibliothèque d’annonces',
      description: 'Annonces enregistrées et brouillons',
      keywords: 'bibliothèque sauvegardé annonces',
    },
    'ql-perfect-copy': {
      label: 'Perfect Copy',
      description: '5 variantes de copy en une fois',
      keywords: 'copy annonce variantes',
    },
    'ql-pipeline': {
      label: 'Pipeline leads',
      description: 'Kanban des étapes lead',
      keywords: 'kanban crm lead',
    },
    'ql-lead-score': {
      label: 'Lead Score IA',
      description: 'Scoring intelligent des leads',
      keywords: 'score notation lead',
    },
    'ql-billing': {
      label: 'Facturation',
      description: 'Forfait, Stripe, factures',
      keywords: 'abonnement forfait stripe facture',
    },
    'ql-workspace': {
      label: 'Workspace',
      description: 'Modules et préférences agence',
      keywords: 'paramètres modules agence',
    },
    'ql-home': {
      label: 'Centre de commande (accueil)',
      description: 'Tableau de bord principal',
      keywords: 'accueil principal vue',
    },
  },
  guides: {
    'g-hub': {
      label: 'Hub documentation',
      description: 'Toutes les guides et FAQ',
      keywords: 'docs aide faq',
    },
    'g-welcome': {
      label: 'Guide : Bienvenue',
      description: 'Introduction à la plateforme',
      keywords: 'début intro onboarding',
    },
    'g-first-listing': {
      label: 'Guide : Première annonce',
      description: 'Flux rapide pour générer du copy',
      keywords: 'première annonce générer tutoriel',
    },
    'g-workspace-doc': {
      label: 'Guide : Workspace',
      description: 'Modules et personnalisation',
      keywords: 'workspace modules paramètres',
    },
    'g-perfect-copy': {
      label: 'Guide : Perfect Copy',
      description: 'Champs du formulaire et variantes',
      keywords: 'perfect copy formulaire variantes',
    },
    'g-pipeline': {
      label: 'Guide : Pipeline Kanban',
      description: 'Glisser les statuts et CRM',
      keywords: 'pipeline kanban lead crm',
    },
    'g-billing': {
      label: 'Guide : Forfait & facturation',
      description: 'Stripe et abonnement',
      keywords: 'facturation stripe abonnement',
    },
    'g-arbitrage': {
      label: 'Guide : Arbitrage / Market Gap',
      description: 'Opportunités et prix',
      keywords: 'arbitrage market gap deal',
    },
  },
};

export const dashboardNavUiFr: DashboardNavUi = {
  jtbd: jtbdFr,
  commandPalette: {
    placeholder: 'Rechercher outils, pages, actions…',
    noResults: 'Aucun résultat.',
    hint: 'Appuyez sur',
    hintOpen: 'pour ouvrir le Centre de commande',
    signOut: 'Se déconnecter',
    signOutDesc: 'Se déconnecter sur cet appareil',
    help: 'Centre d’aide',
    helpDesc: 'Guides et FAQ',
    quickLinksHeading: 'Liens rapides',
    guidesHeading: 'Guides (nouvel onglet)',
    opensNewTab: 'S’ouvre dans un nouvel onglet',
    quickActionsHeading: 'Actions rapides',
  },
  layout: {
    sidebarAriaLabel: 'Navigation espace de travail',
    sidebarKicker: 'Espace de travail',
    sidebarSubtitle: 'Outils par mission',
    mobileOpenMenuAria: 'Ouvrir le menu espace de travail',
    mobileCloseMenuAria: 'Fermer le menu',
    mobileTitle: 'Espace de travail',
    mobileSubtitle: 'Mêmes groupes que la barre latérale bureau',
    mobileNavAriaLabel: 'Navigation mobile',
    menuButtonLabel: 'Menu',
  },
};

const jtbdDe = {
  content: {
    heading: 'Inserate & Inhalte',
    items: {
      listings: { label: 'Inserat erstellen', description: 'KI-Inserate in 30 Sekunden' },
      'perfect-copy': { label: 'Perfect Copy', description: 'Überzeugender Text mit Hook + Body + CTA' },
      titles: { label: 'Titel generieren', description: '10 unwiderstehliche KI-Titel' },
      'emotional-listing': { label: 'Emotionales Inserat', description: 'Storytelling, das verkauft' },
      'refine-listing': { label: 'Inserat verfeinern', description: 'Bestehende Texte verbessern' },
      translate: { label: 'Inserat übersetzen', description: 'In über 10 Sprachen' },
      'social-posts': { label: 'Social Posts', description: 'Posts für Instagram, Facebook, LinkedIn' },
      hashtags: { label: 'Hashtags', description: 'Optimierte Sets pro Plattform' },
      'followup-emails': { label: 'Follow-up E-Mails', description: 'Professionelle E-Mails pro Phase' },
      'video-scripts': { label: 'Video-Skripte', description: 'Skripte für Reels und TikTok' },
      'agent-bio': { label: 'Makler-Bio', description: 'Professionelle Bio für Ihr Profil' },
      pdf: { label: 'PDF erzeugen', description: 'Profi-Broschüre in Sekunden' },
    },
  },
  crm: {
    heading: 'Leads, CRM & Akquise',
    items: {
      prospecting: {
        label: 'Prospecting Engine',
        description: 'Objekte auf Idealista, Zillow, Immobiliare.it finden',
      },
      leads: { label: 'CRM Leads', description: 'Alle Leads verwalten' },
      pipeline: { label: 'Lead-Pipeline', description: 'Kanban-Board Ihrer Leads' },
      'workflow-automations': {
        label: 'Automatisierungen',
        description: 'Follow-ups, Erinnerungen, wiederkehrende Inhalte',
      },
      'crm-automations': {
        label: 'CRM-Regeln (wenn/dann)',
        description: 'Trigger bei Lead-Ereignissen: Status, Score, E-Mail…',
      },
      map: { label: 'Taktische Karte', description: 'Deals auf der interaktiven Karte' },
      'lead-score': { label: 'Lead Score KI', description: 'KI-Score pro Lead' },
      opportunities: { label: 'Chancen', description: 'Deals mit erkanntem Market Gap' },
    },
  },
  intel: {
    heading: 'Intelligence & Recherche',
    items: {
      analyze: { label: 'Objektanalyse', description: 'KI-Röntgen auf Fotos und Grundrissen' },
      auditor: { label: 'KI-Auditor', description: 'Qualitätsanalyse bestehender Inserate' },
      autopilot: { label: 'Autopilot', description: 'Automatische Akquise 24/7' },
      scraper: { label: 'Global Scraper', description: 'Suche auf weltweiten Portalen' },
    },
  },
  brand: {
    heading: 'Marke & Wachstum',
    items: {
      'agency-branding': { label: 'Agentur-Branding', description: 'Logo, Farben und Stil' },
      'agency-assistant': { label: 'Agentur-Assistent', description: 'KI für Ihre Agentur' },
      packages: { label: 'Service-Pakete', description: 'Pakete für Kunden erstellen' },
      referral: { label: 'Empfehlungsprogramm', description: 'Prämien durch Einladungen' },
    },
  },
  account: {
    heading: 'Konto & Workspace',
    items: {
      dashboard: { label: 'Dashboard', description: 'Zurück zum Haupt-Dashboard' },
      'settings-workspace': { label: 'Workspace-Einstellungen', description: 'Agenturname, Sprachen, Präferenzen' },
      billing: { label: 'Abo & Abrechnung', description: 'Tarif verwalten' },
      compliance: { label: 'Compliance', description: 'DSGVO, CCPA und Rechtsdokumente' },
      docs: { label: 'Dokumentation', description: 'Anleitungen und Tutorials' },
    },
  },
} as const satisfies DashboardNavUi['jtbd'];

export const commandPaletteExtrasDe: CommandPaletteExtraStrings = {
  quick: {
    'ql-listings': {
      label: 'Inseratsbibliothek',
      description: 'Gespeicherte Inserate und Entwürfe',
      keywords: 'bibliothek gespeichert inserat',
    },
    'ql-perfect-copy': {
      label: 'Perfect Copy',
      description: 'Fünf Textvarianten auf einmal',
      keywords: 'copy inserat varianten',
    },
    'ql-pipeline': {
      label: 'Lead-Pipeline',
      description: 'Kanban Lead-Phasen',
      keywords: 'kanban crm lead',
    },
    'ql-lead-score': {
      label: 'Lead Score KI',
      description: 'KI-Lead-Scoring',
      keywords: 'score bewertung lead',
    },
    'ql-billing': {
      label: 'Abrechnung',
      description: 'Tarif, Stripe, Rechnungen',
      keywords: 'abo tarif stripe rechnung',
    },
    'ql-workspace': {
      label: 'Workspace',
      description: 'Module und Agentur-Einstellungen',
      keywords: 'einstellungen module agentur',
    },
    'ql-home': {
      label: 'Kommandozentrale (Start)',
      description: 'Haupt-Dashboard',
      keywords: 'start übersicht home',
    },
  },
  guides: {
    'g-hub': {
      label: 'Dokumentations-Hub',
      description: 'Alle Anleitungen und FAQs',
      keywords: 'docs hilfe faq',
    },
    'g-welcome': {
      label: 'Anleitung: Willkommen',
      description: 'Einführung in die Plattform',
      keywords: 'start intro onboarding',
    },
    'g-first-listing': {
      label: 'Anleitung: Erstes Inserat',
      description: 'Schneller Ablauf für Copy',
      keywords: 'erstes inserat generieren tutorial',
    },
    'g-workspace-doc': {
      label: 'Anleitung: Workspace',
      description: 'Module und Anpassung',
      keywords: 'workspace module einstellungen',
    },
    'g-perfect-copy': {
      label: 'Anleitung: Perfect Copy',
      description: 'Formularfelder und Varianten',
      keywords: 'perfect copy formular varianten',
    },
    'g-pipeline': {
      label: 'Anleitung: Kanban-Pipeline',
      description: 'Status ziehen und CRM',
      keywords: 'pipeline kanban lead crm',
    },
    'g-billing': {
      label: 'Anleitung: Tarif & Abrechnung',
      description: 'Stripe und Abo',
      keywords: 'abrechnung stripe abo',
    },
    'g-arbitrage': {
      label: 'Anleitung: Arbitrage / Market Gap',
      description: 'Chancen und Preise',
      keywords: 'arbitrage market gap deal',
    },
  },
};

export const dashboardNavUiDe: DashboardNavUi = {
  jtbd: jtbdDe,
  commandPalette: {
    placeholder: 'Tools, Seiten, Aktionen suchen…',
    noResults: 'Keine Treffer.',
    hint: 'Drücken Sie',
    hintOpen: 'um die Kommandozentrale zu öffnen',
    signOut: 'Abmelden',
    signOutDesc: 'Auf diesem Gerät abmelden',
    help: 'Hilfe-Center',
    helpDesc: 'Anleitungen und FAQ',
    quickLinksHeading: 'Schnelllinks',
    guidesHeading: 'Anleitungen (neuer Tab)',
    opensNewTab: 'Öffnet in neuem Tab',
    quickActionsHeading: 'Schnellaktionen',
  },
  layout: {
    sidebarAriaLabel: 'Workspace-Navigation',
    sidebarKicker: 'Workspace',
    sidebarSubtitle: 'Tools nach Aufgabe',
    mobileOpenMenuAria: 'Workspace-Menü öffnen',
    mobileCloseMenuAria: 'Menü schließen',
    mobileTitle: 'Workspace',
    mobileSubtitle: 'Gleiche Gruppen wie in der Desktop-Seitenleiste',
    mobileNavAriaLabel: 'Mobile Navigation',
    menuButtonLabel: 'Menü',
  },
};

const jtbdPt = {
  content: {
    heading: 'Anúncios e conteúdos',
    items: {
      listings: { label: 'Gerar anúncio', description: 'Crie anúncios com IA em 30 segundos' },
      'perfect-copy': { label: 'Perfect Copy', description: 'Copy persuasivo com Gancho + Corpo + CTA' },
      titles: { label: 'Gerar títulos', description: '10 títulos irresistíveis com IA' },
      'emotional-listing': { label: 'Anúncio emocional', description: 'Storytelling que vende' },
      'refine-listing': { label: 'Refinar anúncio', description: 'Melhore textos existentes' },
      translate: { label: 'Traduzir anúncio', description: 'Traduza para mais de 10 idiomas' },
      'social-posts': { label: 'Posts sociais', description: 'Instagram, Facebook, LinkedIn' },
      hashtags: { label: 'Hashtags', description: 'Conjuntos otimizados por plataforma' },
      'followup-emails': { label: 'Emails de follow-up', description: 'Emails profissionais em cada fase' },
      'video-scripts': { label: 'Guiões de vídeo', description: 'Para Reels e TikTok' },
      'agent-bio': { label: 'Bio do agente', description: 'Bio profissional para o seu perfil' },
      pdf: { label: 'Gerar PDF', description: 'Brochura profissional em segundos' },
    },
  },
  crm: {
    heading: 'Leads, CRM e prospeção',
    items: {
      prospecting: {
        label: 'Motor de prospeção',
        description: 'Encontre imóveis no Idealista, Zillow, Immobiliare.it',
      },
      leads: { label: 'CRM Leads', description: 'Gerencie todos os seus leads' },
      pipeline: { label: 'Pipeline de leads', description: 'Quadro Kanban dos leads' },
      'workflow-automations': {
        label: 'Automatizações',
        description: 'Follow-ups, lembretes e conteúdo recorrente',
      },
      'crm-automations': {
        label: 'Regras CRM (se/então)',
        description: 'Gatilhos em eventos de lead: estado, score, email…',
      },
      map: { label: 'Mapa tático', description: 'Veja negócios no mapa interativo' },
      'lead-score': { label: 'Lead Score IA', description: 'Pontuação IA por lead' },
      opportunities: { label: 'Oportunidades', description: 'Negócios com Market Gap identificado' },
    },
  },
  intel: {
    heading: 'Inteligência e pesquisa',
    items: {
      analyze: { label: 'Análise de imóvel', description: 'Raio-X IA em fotos e plantas' },
      auditor: { label: 'Auditor IA', description: 'Qualidade de anúncios existentes' },
      autopilot: { label: 'Autopilot', description: 'Prospeção automática 24/7' },
      scraper: { label: 'Scraper global', description: 'Pesquisa em portais mundiais' },
    },
  },
  brand: {
    heading: 'Marca e crescimento',
    items: {
      'agency-branding': { label: 'Branding da agência', description: 'Logo, cores e estilo' },
      'agency-assistant': { label: 'Assistente da agência', description: 'IA dedicada à sua agência' },
      packages: { label: 'Pacotes de serviços', description: 'Crie pacotes para clientes' },
      referral: { label: 'Programa de referência', description: 'Ganhe ao convidar colegas' },
    },
  },
  account: {
    heading: 'Conta e workspace',
    items: {
      dashboard: { label: 'Painel', description: 'Voltar ao painel principal' },
      'settings-workspace': { label: 'Definições do workspace', description: 'Nome da agência, idiomas, preferências' },
      billing: { label: 'Subscrição e faturação', description: 'Gerencie o seu plano' },
      compliance: { label: 'Conformidade', description: 'RGPD, CCPA e documentos legais' },
      docs: { label: 'Documentação', description: 'Guias e tutoriais' },
    },
  },
} as const satisfies DashboardNavUi['jtbd'];

export const commandPaletteExtrasPt: CommandPaletteExtraStrings = {
  quick: {
    'ql-listings': {
      label: 'Biblioteca de anúncios',
      description: 'Anúncios guardados e rascunhos',
      keywords: 'biblioteca guardados anúncios',
    },
    'ql-perfect-copy': {
      label: 'Perfect Copy',
      description: '5 variantes de copy de uma vez',
      keywords: 'copy anúncio variantes',
    },
    'ql-pipeline': {
      label: 'Pipeline de leads',
      description: 'Kanban de estados do lead',
      keywords: 'kanban crm lead',
    },
    'ql-lead-score': {
      label: 'Lead Score IA',
      description: 'Pontuação inteligente de leads',
      keywords: 'score pontuação lead',
    },
    'ql-billing': {
      label: 'Faturação',
      description: 'Plano, Stripe, faturas',
      keywords: 'subscrição plano stripe fatura',
    },
    'ql-workspace': {
      label: 'Workspace',
      description: 'Módulos e preferências da agência',
      keywords: 'definições módulos agência',
    },
    'ql-home': {
      label: 'Centro de comando (início)',
      description: 'Painel principal',
      keywords: 'início principal visão',
    },
  },
  guides: {
    'g-hub': {
      label: 'Hub de documentação',
      description: 'Todas as guias e FAQ',
      keywords: 'docs ajuda faq',
    },
    'g-welcome': {
      label: 'Guia: Boas-vindas',
      description: 'Introdução à plataforma',
      keywords: 'início intro onboarding',
    },
    'g-first-listing': {
      label: 'Guia: Primeiro anúncio',
      description: 'Fluxo rápido para gerar copy',
      keywords: 'primeiro anúncio gerar tutorial',
    },
    'g-workspace-doc': {
      label: 'Guia: Workspace',
      description: 'Módulos e personalização',
      keywords: 'workspace módulos definições',
    },
    'g-perfect-copy': {
      label: 'Guia: Perfect Copy',
      description: 'Campos do formulário e variantes',
      keywords: 'perfect copy formulário variantes',
    },
    'g-pipeline': {
      label: 'Guia: Pipeline Kanban',
      description: 'Arrastar estados e CRM',
      keywords: 'pipeline kanban lead crm',
    },
    'g-billing': {
      label: 'Guia: Plano e faturação',
      description: 'Stripe e subscrição',
      keywords: 'faturação stripe subscrição',
    },
    'g-arbitrage': {
      label: 'Guia: Arbitragem / Market Gap',
      description: 'Oportunidades e preços',
      keywords: 'arbitragem market gap negócio',
    },
  },
};

export const dashboardNavUiPt: DashboardNavUi = {
  jtbd: jtbdPt,
  commandPalette: {
    placeholder: 'Pesquisar ferramentas, páginas, ações…',
    noResults: 'Nenhum resultado.',
    hint: 'Prima',
    hintOpen: 'para abrir o Centro de comando',
    signOut: 'Sair',
    signOutDesc: 'Terminar sessão neste dispositivo',
    help: 'Centro de ajuda',
    helpDesc: 'Guias e FAQ',
    quickLinksHeading: 'Ligações rápidas',
    guidesHeading: 'Guias (novo separador)',
    opensNewTab: 'Abre num novo separador',
    quickActionsHeading: 'Ações rápidas',
  },
  layout: {
    sidebarAriaLabel: 'Navegação da área de trabalho',
    sidebarKicker: 'Área de trabalho',
    sidebarSubtitle: 'Ferramentas por função',
    mobileOpenMenuAria: 'Abrir menu da área de trabalho',
    mobileCloseMenuAria: 'Fechar menu',
    mobileTitle: 'Área de trabalho',
    mobileSubtitle: 'Os mesmos grupos da barra lateral no desktop',
    mobileNavAriaLabel: 'Navegação móvel',
    menuButtonLabel: 'Menu',
  },
};

const jtbdAr = {
  content: {
    heading: 'الإعلانات والمحتوى',
    items: {
      listings: { label: 'إنشاء إعلان', description: 'أنشئ إعلانات بالذكاء الاصطناعي في 30 ثانية' },
      'perfect-copy': { label: 'Perfect Copy', description: 'نص مقنع مع خطاف + نص + دعوة لإجراء' },
      titles: { label: 'إنشاء عناوين', description: '10 عناوين جذابة بالذكاء الاصطناعي' },
      'emotional-listing': { label: 'إعلان عاطفي', description: 'سرد يبيع' },
      'refine-listing': { label: 'تحسين الإعلان', description: 'حسّن النصوص الحالية' },
      translate: { label: 'ترجمة الإعلان', description: 'ترجمة لأكثر من 10 لغات' },
      'social-posts': { label: 'منشورات اجتماعية', description: 'إنستغرام، فيسبوك، لينكد إن' },
      hashtags: { label: 'وسوم', description: 'مجموعات محسّنة لكل منصة' },
      'followup-emails': { label: 'بريد متابعة', description: 'رسائل احترافية لكل مرحلة' },
      'video-scripts': { label: 'نصوص فيديو', description: 'لـ Reels وتيك توك' },
      'agent-bio': { label: 'سيرة الوكيل', description: 'سيرة احترافية لملفك' },
      pdf: { label: 'إنشاء PDF', description: 'كتيب احترافي في ثوانٍ' },
    },
  },
  crm: {
    heading: 'العملاء المحتملون وCRM والتسويق',
    items: {
      prospecting: {
        label: 'محرك التسويق',
        description: 'اعثر على عقارات في Idealista وZillow وImmobiliare.it',
      },
      leads: { label: 'CRM للعملاء', description: 'إدارة كل العملاء المحتملين' },
      pipeline: { label: 'مسار العملاء', description: 'لوحة كانبان للعملاء' },
      'workflow-automations': {
        label: 'أتمتة سير العمل',
        description: 'متابعات وتذكيرات ومحتوى متكرر',
      },
      'crm-automations': {
        label: 'قواعد CRM (إذا/فإن)',
        description: 'محفزات على أحداث العميل: الحالة، الدرجة، البريد…',
      },
      map: { label: 'خريطة تكتيكية', description: 'اعرض الصفقات على الخريطة التفاعلية' },
      'lead-score': { label: 'درجة العميل بالذكاء الاصطناعي', description: 'تسجيل ذكي لكل عميل محتمل' },
      opportunities: { label: 'فرص', description: 'صفقات مع فجوة سوق محددة' },
    },
  },
  intel: {
    heading: 'الذكاء والبحث',
    items: {
      analyze: { label: 'تحليل عقار', description: 'أشعة سيناء بالذكاء الاصطناعي على الصور والمخططات' },
      auditor: { label: 'مدقق بالذكاء الاصطناعي', description: 'جودة الإعلانات الحالية' },
      autopilot: { label: 'Autopilot', description: 'تسويق تلقائي 24/7' },
      scraper: { label: 'مكشطة عالمية', description: 'بحث في بوابات عالمية' },
    },
  },
  brand: {
    heading: 'العلامة والنمو',
    items: {
      'agency-branding': { label: 'هوية الوكالة', description: 'الشعار والألوان والأسلوب' },
      'agency-assistant': { label: 'مساعد الوكالة', description: 'ذكاء اصطناعي مخصص لوكالتك' },
      packages: { label: 'حزم خدمات', description: 'أنشئ عروضاً للعملاء' },
      referral: { label: 'برنامج الإحالة', description: 'اكسب بدعوة الزملاء' },
    },
  },
  account: {
    heading: 'الحساب ومساحة العمل',
    items: {
      dashboard: { label: 'لوحة التحكم', description: 'العودة للوحة الرئيسية' },
      'settings-workspace': { label: 'إعدادات مساحة العمل', description: 'اسم الوكالة واللغات والتفضيلات' },
      billing: { label: 'الاشتراك والفوترة', description: 'إدارة خطتك' },
      compliance: { label: 'الامتثال', description: 'GDPR وCCPA والوثائق القانونية' },
      docs: { label: 'التوثيق', description: 'أدلة ودروس' },
    },
  },
} as const satisfies DashboardNavUi['jtbd'];

export const commandPaletteExtrasAr: CommandPaletteExtraStrings = {
  quick: {
    'ql-listings': {
      label: 'مكتبة الإعلانات',
      description: 'إعلانات محفوظة ومسودات',
      keywords: 'مكتبة محفوظ إعلان',
    },
    'ql-perfect-copy': {
      label: 'Perfect Copy',
      description: '5 نسخ نصية دفعة واحدة',
      keywords: 'نص إعلان نسخ',
    },
    'ql-pipeline': {
      label: 'مسار العملاء',
      description: 'كانبان لحالات العميل',
      keywords: 'كانبان crm عميل',
    },
    'ql-lead-score': {
      label: 'درجة العميل بالذكاء الاصطناعي',
      description: 'تسجيل ذكي',
      keywords: 'درجة تقييم عميل',
    },
    'ql-billing': {
      label: 'الفوترة',
      description: 'الخطة وسترايب والفواتير',
      keywords: 'اشتراك خطة فاتورة',
    },
    'ql-workspace': {
      label: 'مساحة العمل',
      description: 'وحدات وتفضيلات الوكالة',
      keywords: 'إعدادات وحدات وكالة',
    },
    'ql-home': {
      label: 'مركز القيادة (الرئيسية)',
      description: 'لوحة التحكم الرئيسية',
      keywords: 'رئيسية بداية نظرة',
    },
  },
  guides: {
    'g-hub': {
      label: 'مركز التوثيق',
      description: 'كل الأدلة والأسئلة الشائعة',
      keywords: 'docs مساعدة أسئلة',
    },
    'g-welcome': {
      label: 'دليل: ترحيب',
      description: 'مقدمة المنصة',
      keywords: 'بداية مقدمة تهيئة',
    },
    'g-first-listing': {
      label: 'دليل: أول إعلان',
      description: 'مسار سريع لإنشاء النص',
      keywords: 'أول إعلان إنشاء درس',
    },
    'g-workspace-doc': {
      label: 'دليل: مساحة العمل',
      description: 'الوحدات والتخصيص',
      keywords: 'workspace وحدات إعدادات',
    },
    'g-perfect-copy': {
      label: 'دليل: Perfect Copy',
      description: 'حقول النموذج والنسخ',
      keywords: 'perfect copy نموذج',
    },
    'g-pipeline': {
      label: 'دليل: مسار كانبان',
      description: 'سحب الحالات وCRM',
      keywords: 'pipeline كانبان عميل',
    },
    'g-billing': {
      label: 'دليل: الخطة والفوترة',
      description: 'سترايب والاشتراك',
      keywords: 'فوترة اشتراك',
    },
    'g-arbitrage': {
      label: 'دليل: المراجحة / فجوة السوق',
      description: 'فرص وأسعار',
      keywords: 'arbitrage market gap',
    },
  },
};

export const dashboardNavUiAr: DashboardNavUi = {
  jtbd: jtbdAr,
  commandPalette: {
    placeholder: 'البحث عن أدوات وصفحات وإجراءات…',
    noResults: 'لا توجد نتائج.',
    hint: 'اضغط',
    hintOpen: 'لفتح مركز القيادة',
    signOut: 'خروج',
    signOutDesc: 'تسجيل الخروج من هذا الجهاز',
    help: 'مركز المساعدة',
    helpDesc: 'أدلة وأسئلة شائعة',
    quickLinksHeading: 'روابط سريعة',
    guidesHeading: 'أدلة (تبويب جديد)',
    opensNewTab: 'يفتح في تبويب جديد',
    quickActionsHeading: 'إجراءات سريعة',
  },
  layout: {
    sidebarAriaLabel: 'تنقل مساحة العمل',
    sidebarKicker: 'مساحة العمل',
    sidebarSubtitle: 'أدوات حسب المهمة',
    mobileOpenMenuAria: 'فتح قائمة مساحة العمل',
    mobileCloseMenuAria: 'إغلاق القائمة',
    mobileTitle: 'مساحة العمل',
    mobileSubtitle: 'نفس مجموعات الشريط الجانبي على سطح المكتب',
    mobileNavAriaLabel: 'التنقل على الجوال',
    menuButtonLabel: 'القائمة',
  },
};
