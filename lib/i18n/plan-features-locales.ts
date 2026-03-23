/**
 * Dashboard "All tools" grid — ES / FR / DE / PT / AR (DashboardPlanFeatures).
 * IT/EN restano in plan-features-ui.ts.
 */
import type { PlanFeaturesUi } from '@/lib/i18n/plan-features-ui';

const chromeEs = {
  plan: 'Plan',
  planNames: { free: 'Free', starter: 'Starter', pro: 'Pro', agency: 'Agency' },
  free: 'Gratis',
  freeLimit: '5 anuncios/mes',
  starterLimit: '50 anuncios/mes',
  proLimit: '200 anuncios/mes',
  agencyLimit: 'Ilimitados',
  currentPlan: 'Tu plan actual',
  requiresHigherPlan: 'Requiere un plan superior',
  open: 'Abrir',
  unlock: 'Desbloquear',
  higherPlans: 'Funciones disponibles en planes superiores',
  unlockPlan: 'Desbloquear plan',
} as const;

const itemsEs: PlanFeaturesUi['items'] = {
  generate: {
    name: 'Generar nuevo anuncio',
    description: 'Crea contenido profesional con IA en segundos',
  },
  scraper: {
    name: 'AI Scraper',
    description: 'Importa anuncios de Immobiliare, Idealista, Casa y Subito',
  },
  analyze: {
    name: 'Análisis desde enlace',
    description: 'Pega un enlace y obtén análisis y reescritura IA al instante',
  },
  pdf: {
    name: 'Fichas PDF premium',
    description: 'Genera fichas inmobiliarias profesionales estilo Canva',
  },
  'lead-score': {
    name: 'Lead Scoring IA',
    description: 'Analiza leads con puntuación 0-100, prioridad de acción y plantillas de respuesta',
  },
  'perfect-copy': {
    name: 'Perfect Copy 2.0',
    description: '5 variantes premium: Profesional, Emocional, Corto, SEO, Luxury',
  },
  translate: {
    name: 'Traductor 12 idiomas',
    description: 'Traduce anuncios a 12 idiomas con adaptación cultural y SEO local',
  },
  'social-posts': {
    name: 'Publicaciones sociales IA',
    description: 'Genera posts para Instagram, Facebook y TikTok',
  },
  titles: {
    name: 'Títulos A/B de alto CTR',
    description: '19 títulos optimizados: clickbait, luxury, SEO',
  },
  hashtags: {
    name: 'Generador de hashtags IA',
    description: 'Más de 50 hashtags optimizados para maximizar el alcance',
  },
  'emotional-listing': {
    name: 'Emotional Listing IA',
    description: 'Descripciones emocionales que conectan con los compradores',
  },
  'refine-listing': {
    name: 'Perfect Again IA',
    description: 'Refina y mejora tus anuncios existentes con IA',
  },
  auditor: {
    name: 'Auditoría inmobiliaria IA',
    description: 'Auditoría completa: estructura, SEO, emoción, alertas y versión optimizada',
  },
  'agent-bio': {
    name: 'Agent BIO IA Creator',
    description: '5 biografías profesionales: Pro, Emocional, Luxury, Social, Web SEO',
  },
  'followup-emails': {
    name: 'Emails de seguimiento IA',
    description: '6 emails profesionales para convertir tus leads inmobiliarios',
  },
  'video-scripts': {
    name: 'Guiones de vídeo IA',
    description: 'Guiones profesionales con marcas de tiempo e indicaciones visuales',
  },
  'agency-branding': {
    name: 'Branding de agencia',
    description: 'Personaliza el branding de tu agencia',
  },
  crm: {
    name: 'Lead Manager + IA',
    description: 'Email, WhatsApp, SMS con IA — pipeline, automatizaciones, formularios',
  },
  'virtual-staging': {
    name: 'Virtual Staging 3D',
    description: 'Staging 3D profesional para tus inmuebles',
  },
  'voice-calling': {
    name: 'Llamadas de voz IA',
    description: 'Llamadas automáticas IA a propietarios (30/mes)',
  },
  'agency-assistant': {
    name: 'Agency Assistant IA',
    description: 'Chatbot para anuncios, email, redes y estrategia inmobiliaria',
  },
  automations: {
    name: 'Flujos de automatización',
    description: 'Seguimientos programados, recordatorios de visitas y contenido semanal',
  },
  'crm-automation-rules': {
    name: 'Reglas de automatización CRM',
    description: 'Si/entonces en eventos de lead: nuevo lead, cambio de estado, score, notificaciones',
  },
  'unlimited-voice': {
    name: 'Llamadas de voz IA ilimitadas',
    description: 'Llamadas automáticas IA 24/7 sin límites',
  },
  'team-management': {
    name: 'Gestión de equipo multiusuario',
    description: 'Equipos de hasta 10 agentes, roles y permisos avanzados',
  },
  'aura-vr': {
    name: 'Aura VR: generación de tour virtual',
    description: 'Generación ilimitada de tours virtuales cinematográficos',
  },
  prospecting: {
    name: 'War Room Prospecting',
    description: 'Panel de inteligencia IA para operaciones inmobiliarias',
  },
  map: {
    name: 'Mapa de territorio IA',
    description: 'Visualiza inmuebles y oportunidades en el mapa',
  },
};

const chromeFr = {
  plan: 'Forfait',
  planNames: { free: 'Free', starter: 'Starter', pro: 'Pro', agency: 'Agency' },
  free: 'Gratuit',
  freeLimit: '5 annonces/mois',
  starterLimit: '50 annonces/mois',
  proLimit: '200 annonces/mois',
  agencyLimit: 'Illimité',
  currentPlan: 'Votre forfait actuel',
  requiresHigherPlan: 'Nécessite un forfait supérieur',
  open: 'Ouvrir',
  unlock: 'Débloquer',
  higherPlans: 'Fonctionnalités disponibles dans les forfaits supérieurs',
  unlockPlan: 'Débloquer le forfait',
} as const;

const itemsFr: PlanFeaturesUi['items'] = {
  generate: {
    name: 'Générer une nouvelle annonce',
    description: 'Créez du contenu professionnel avec l’IA en quelques secondes',
  },
  scraper: {
    name: 'AI Scraper',
    description: 'Importez des annonces depuis Immobiliare, Idealista, Casa et Subito',
  },
  analyze: {
    name: 'Analyse depuis lien',
    description: 'Collez un lien pour une analyse et une réécriture IA instantanées',
  },
  pdf: {
    name: 'Fiches PDF premium',
    description: 'Générez des fiches immobilières pro façon Canva',
  },
  'lead-score': {
    name: 'Lead Scoring IA',
    description: 'Analysez les leads avec score 0-100, priorité d’action et modèles de réponse',
  },
  'perfect-copy': {
    name: 'Perfect Copy 2.0',
    description: '5 variantes premium : Professionnel, Émotionnel, Court, SEO, Luxury',
  },
  translate: {
    name: 'Traduction 12 langues',
    description: 'Traduisez les annonces en 12 langues avec adaptation culturelle et SEO local',
  },
  'social-posts': {
    name: 'Posts sociaux IA',
    description: 'Générez des posts pour Instagram, Facebook et TikTok',
  },
  titles: {
    name: 'Titres A/B à fort CTR',
    description: '19 titres optimisés : clickbait, luxe, SEO',
  },
  hashtags: {
    name: 'Générateur de hashtags IA',
    description: 'Plus de 50 hashtags optimisés pour maximiser la portée',
  },
  'emotional-listing': {
    name: 'Emotional Listing IA',
    description: 'Descriptions émotionnelles qui touchent les acheteurs',
  },
  'refine-listing': {
    name: 'Perfect Again IA',
    description: 'Affinez et améliorez vos annonces existantes avec l’IA',
  },
  auditor: {
    name: 'Audit immobilier IA',
    description: 'Audit complet : structure, SEO, émotion, alertes et version optimisée',
  },
  'agent-bio': {
    name: 'Agent BIO IA Creator',
    description: '5 bios pro : Pro, Émotionnel, Luxe, Social, Site SEO',
  },
  'followup-emails': {
    name: 'Emails de relance IA',
    description: '6 emails pros pour convertir vos leads immobiliers',
  },
  'video-scripts': {
    name: 'Scripts vidéo IA',
    description: 'Scripts vidéo pros avec horodatage et indications visuelles',
  },
  'agency-branding': {
    name: 'Branding agence',
    description: 'Personnalisez le branding de votre agence',
  },
  crm: {
    name: 'Lead Manager + IA',
    description: 'Email, WhatsApp, SMS avec IA — pipeline, automatisations, formulaires',
  },
  'virtual-staging': {
    name: 'Home staging virtuel 3D',
    description: 'Staging 3D professionnel pour vos biens',
  },
  'voice-calling': {
    name: 'Appels vocaux IA',
    description: 'Appels IA automatiques aux propriétaires (30/mois)',
  },
  'agency-assistant': {
    name: 'Agency Assistant IA',
    description: 'Chatbot pour annonces, email, réseaux et stratégie immobilière',
  },
  automations: {
    name: 'Automatisations de workflow',
    description: 'Relances planifiées, rappels de visites et contenu hebdomadaire',
  },
  'crm-automation-rules': {
    name: 'Règles d’automatisation CRM',
    description: 'Si/alors sur événements lead : nouveau lead, statut, score, notifications',
  },
  'unlimited-voice': {
    name: 'Appels vocaux IA illimités',
    description: 'Appels IA automatiques 24/7 sans limite',
  },
  'team-management': {
    name: 'Gestion d’équipe multi-utilisateurs',
    description: 'Équipes jusqu’à 10 agents, rôles et permissions avancés',
  },
  'aura-vr': {
    name: 'Aura VR : génération de visite virtuelle',
    description: 'Génération illimitée de visites virtuelles cinématographiques',
  },
  prospecting: {
    name: 'War Room Prospecting',
    description: 'Tableau de bord intelligence IA pour les opérations immobilières',
  },
  map: {
    name: 'Carte de territoire IA',
    description: 'Visualisez biens et opportunités sur la carte',
  },
};

const chromeDe = {
  plan: 'Tarif',
  planNames: { free: 'Free', starter: 'Starter', pro: 'Pro', agency: 'Agency' },
  free: 'Kostenlos',
  freeLimit: '5 Inserate/Monat',
  starterLimit: '50 Inserate/Monat',
  proLimit: '200 Inserate/Monat',
  agencyLimit: 'Unbegrenzt',
  currentPlan: 'Ihr aktueller Tarif',
  requiresHigherPlan: 'Erfordert einen höheren Tarif',
  open: 'Öffnen',
  unlock: 'Freischalten',
  higherPlans: 'Funktionen in höheren Tarifen verfügbar',
  unlockPlan: 'Tarif freischalten',
} as const;

const itemsDe: PlanFeaturesUi['items'] = {
  generate: {
    name: 'Neues Inserat erstellen',
    description: 'Erstellen Sie in Sekunden professionelle KI-Inhalte',
  },
  scraper: {
    name: 'AI Scraper',
    description: 'Import von Immobiliare, Idealista, Casa und Subito',
  },
  analyze: {
    name: 'Link-Analyse',
    description: 'Link einfügen — sofortige KI-Analyse und Umschreibung',
  },
  pdf: {
    name: 'Premium-PDF-Karten',
    description: 'Professionelle Objektblätter im Canva-Stil',
  },
  'lead-score': {
    name: 'KI-Lead-Scoring',
    description: 'Leads mit Score 0-100, Aktionspriorität und Antwortvorlagen analysieren',
  },
  'perfect-copy': {
    name: 'Perfect Copy 2.0',
    description: '5 Premium-Varianten: Professionell, Emotional, Kurz, SEO, Luxury',
  },
  translate: {
    name: '12-Sprachen-Übersetzer',
    description: 'Inserate in 12 Sprachen mit kultureller und lokaler SEO-Anpassung',
  },
  'social-posts': {
    name: 'KI-Social-Posts',
    description: 'Posts für Instagram, Facebook und TikTok generieren',
  },
  titles: {
    name: 'A/B-Titel mit hohem CTR',
    description: '19 optimierte Titel: Clickbait, Luxus, SEO',
  },
  hashtags: {
    name: 'KI-Hashtag-Generator',
    description: '50+ optimierte Hashtags für maximale Reichweite',
  },
  'emotional-listing': {
    name: 'Emotional Listing KI',
    description: 'Emotionale Beschreibungen, die Käufer erreichen',
  },
  'refine-listing': {
    name: 'Perfect Again KI',
    description: 'Bestehende Inserate mit KI verfeinern und verbessern',
  },
  auditor: {
    name: 'KI-Immobilien-Audit',
    description: 'Vollständiges Audit: Struktur, SEO, Emotion, Red Flags, optimierte Version',
  },
  'agent-bio': {
    name: 'Agent BIO KI Creator',
    description: '5 professionelle Bios: Pro, Emotional, Luxury, Social, Website-SEO',
  },
  'followup-emails': {
    name: 'KI-Follow-up-E-Mails',
    description: '6 professionelle E-Mails zur Konversion Ihrer Leads',
  },
  'video-scripts': {
    name: 'KI-Video-Skripte',
    description: 'Professionelle Skripte mit Zeitstempeln und Bildhinweisen',
  },
  'agency-branding': {
    name: 'Agentur-Branding',
    description: 'Passen Sie das Branding Ihrer Agentur an',
  },
  crm: {
    name: 'Lead Manager + KI',
    description: 'E-Mail, WhatsApp, SMS mit KI — Pipeline, Automatisierungen, Formulare',
  },
  'virtual-staging': {
    name: '3D Virtual Staging',
    description: 'Professionelles 3D-Staging für Ihre Objekte',
  },
  'voice-calling': {
    name: 'KI-Sprachanrufe',
    description: 'Automatische KI-Anrufe bei Eigentümern (30/Monat)',
  },
  'agency-assistant': {
    name: 'Agency Assistant KI',
    description: 'Chatbot für Inserate, E-Mail, Social und Strategie',
  },
  automations: {
    name: 'Automatisierungs-Workflows',
    description: 'Geplante Follow-ups, Besichtigungserinnerungen, wöchentlicher Content',
  },
  'crm-automation-rules': {
    name: 'CRM-Automatisierungsregeln',
    description: 'Wenn/dann bei Lead-Ereignissen: neuer Lead, Status, Score, Benachrichtigungen',
  },
  'unlimited-voice': {
    name: 'Unbegrenzte KI-Sprachanrufe',
    description: '24/7 automatische KI-Anrufe ohne Limit',
  },
  'team-management': {
    name: 'Multi-User-Teamverwaltung',
    description: 'Teams bis 10 Makler, erweiterte Rollen und Berechtigungen',
  },
  'aura-vr': {
    name: 'Aura VR: Virtuelle Rundgänge',
    description: 'Unbegrenzte filmische virtuelle Rundgänge',
  },
  prospecting: {
    name: 'War Room Prospecting',
    description: 'KI-Intelligence-Dashboard für Immobiliendeals',
  },
  map: {
    name: 'KI-Gebietskarte',
    description: 'Objekte und Chancen auf der Karte sehen',
  },
};

const chromePt = {
  plan: 'Plano',
  planNames: { free: 'Free', starter: 'Starter', pro: 'Pro', agency: 'Agency' },
  free: 'Grátis',
  freeLimit: '5 anúncios/mês',
  starterLimit: '50 anúncios/mês',
  proLimit: '200 anúncios/mês',
  agencyLimit: 'Ilimitados',
  currentPlan: 'O seu plano atual',
  requiresHigherPlan: 'Requer um plano superior',
  open: 'Abrir',
  unlock: 'Desbloquear',
  higherPlans: 'Funcionalidades disponíveis em planos superiores',
  unlockPlan: 'Desbloquear plano',
} as const;

const itemsPt: PlanFeaturesUi['items'] = {
  generate: {
    name: 'Gerar novo anúncio',
    description: 'Crie conteúdo profissional com IA em segundos',
  },
  scraper: {
    name: 'AI Scraper',
    description: 'Importe anúncios de Immobiliare, Idealista, Casa e Subito',
  },
  analyze: {
    name: 'Análise por link',
    description: 'Cole um link e obtenha análise e reescrita IA instantâneas',
  },
  pdf: {
    name: 'Fichas PDF premium',
    description: 'Gere fichas imobiliárias profissionais estilo Canva',
  },
  'lead-score': {
    name: 'Lead Scoring IA',
    description: 'Analise leads com pontuação 0-100, prioridade de ação e modelos de resposta',
  },
  'perfect-copy': {
    name: 'Perfect Copy 2.0',
    description: '5 variantes premium: Profissional, Emocional, Curto, SEO, Luxury',
  },
  translate: {
    name: 'Tradutor 12 línguas',
    description: 'Traduza anúncios para 12 línguas com adaptação cultural e SEO local',
  },
  'social-posts': {
    name: 'Posts sociais IA',
    description: 'Gere posts para Instagram, Facebook e TikTok',
  },
  titles: {
    name: 'Títulos A/B de alto CTR',
    description: '19 títulos otimizados: clickbait, luxury, SEO',
  },
  hashtags: {
    name: 'Gerador de hashtags IA',
    description: 'Mais de 50 hashtags otimizados para maximizar o alcance',
  },
  'emotional-listing': {
    name: 'Emotional Listing IA',
    description: 'Descrições emocionais que conectam com compradores',
  },
  'refine-listing': {
    name: 'Perfect Again IA',
    description: 'Refine e melhore os seus anúncios existentes com IA',
  },
  auditor: {
    name: 'Auditoria imobiliária IA',
    description: 'Auditoria completa: estrutura, SEO, emoção, alertas e versão otimizada',
  },
  'agent-bio': {
    name: 'Agent BIO IA Creator',
    description: '5 bios profissionais: Pro, Emocional, Luxury, Social, Site SEO',
  },
  'followup-emails': {
    name: 'Emails de follow-up IA',
    description: '6 emails profissionais para converter os seus leads',
  },
  'video-scripts': {
    name: 'Guiões de vídeo IA',
    description: 'Guiões profissionais com timestamps e indicações visuais',
  },
  'agency-branding': {
    name: 'Branding da agência',
    description: 'Personalize o branding da sua agência',
  },
  crm: {
    name: 'Lead Manager + IA',
    description: 'Email, WhatsApp, SMS com IA — pipeline, automações, formulários',
  },
  'virtual-staging': {
    name: 'Virtual Staging 3D',
    description: 'Staging 3D profissional para os seus imóveis',
  },
  'voice-calling': {
    name: 'Chamadas de voz IA',
    description: 'Chamadas IA automáticas a proprietários (30/mês)',
  },
  'agency-assistant': {
    name: 'Agency Assistant IA',
    description: 'Chatbot para anúncios, email, redes e estratégia imobiliária',
  },
  automations: {
    name: 'Fluxos de automação',
    description: 'Follow-ups agendados, lembretes de visitas e conteúdo semanal',
  },
  'crm-automation-rules': {
    name: 'Regras de automação CRM',
    description: 'Se/então em eventos de lead: novo lead, estado, score, notificações',
  },
  'unlimited-voice': {
    name: 'Chamadas de voz IA ilimitadas',
    description: 'Chamadas IA automáticas 24/7 sem limites',
  },
  'team-management': {
    name: 'Gestão de equipa multiutilizador',
    description: 'Equipas até 10 agentes, funções e permissões avançadas',
  },
  'aura-vr': {
    name: 'Aura VR: geração de tour virtual',
    description: 'Geração ilimitada de tours virtuais cinematográficos',
  },
  prospecting: {
    name: 'War Room Prospecting',
    description: 'Painel de inteligência IA para negócios imobiliários',
  },
  map: {
    name: 'Mapa de território IA',
    description: 'Veja imóveis e oportunidades no mapa',
  },
};

const chromeAr = {
  plan: 'الخطة',
  planNames: { free: 'Free', starter: 'Starter', pro: 'Pro', agency: 'Agency' },
  free: 'مجاني',
  freeLimit: '5 إعلانات/شهر',
  starterLimit: '50 إعلان/شهر',
  proLimit: '200 إعلان/شهر',
  agencyLimit: 'غير محدود',
  currentPlan: 'خطتك الحالية',
  requiresHigherPlan: 'يتطلب خطة أعلى',
  open: 'فتح',
  unlock: 'فتح القفل',
  higherPlans: 'ميزات متوفرة في الخطط الأعلى',
  unlockPlan: 'ترقية الخطة',
} as const;

const itemsAr: PlanFeaturesUi['items'] = {
  generate: {
    name: 'إنشاء إعلان جديد',
    description: 'أنشئ محتوى احترافياً بالذكاء الاصطناعي في ثوانٍ',
  },
  scraper: {
    name: 'AI Scraper',
    description: 'استيراد الإعلانات من Immobiliare وIdealista وCasa وSubito',
  },
  analyze: {
    name: 'تحليل من رابط',
    description: 'الصق رابطاً واحصل على تحليل وإعادة صياغة فورية بالذكاء الاصطناعي',
  },
  pdf: {
    name: 'بطاقات PDF مميزة',
    description: 'أنشئ بطاقات عقارية احترافية بأسلوب Canva',
  },
  'lead-score': {
    name: 'تسجيل نقاط العملاء بالذكاء الاصطناعي',
    description: 'حلّل العملاء المحتملين بدرجة 0-100 وأولوية الإجراء وقوالب الرد',
  },
  'perfect-copy': {
    name: 'Perfect Copy 2.0',
    description: '5 نسخ مميزة: احترافي، عاطفي، قصير، SEO، فاخر',
  },
  translate: {
    name: 'مترجم 12 لغة',
    description: 'ترجمة الإعلانات إلى 12 لغة مع تكييف ثقافي وSEO محلي',
  },
  'social-posts': {
    name: 'منشورات اجتماعية بالذكاء الاصطناعي',
    description: 'أنشئ منشورات لإنستغرام وفيسبوك وتيك توك',
  },
  titles: {
    name: 'عناوين A/B عالية النقر',
    description: '19 عنواناً محسّناً: clickbait، فاخر، SEO',
  },
  hashtags: {
    name: 'مولد وسوم بالذكاء الاصطناعي',
    description: 'أكثر من 50 وسمًا محسّناً لتعظيم الوصول',
  },
  'emotional-listing': {
    name: 'Emotional Listing بالذكاء الاصطناعي',
    description: 'أوصاف عاطفية تصل إلى المشترين',
  },
  'refine-listing': {
    name: 'Perfect Again بالذكاء الاصطناعي',
    description: 'حسّن إعلاناتك الحالية بالذكاء الاصطناعي',
  },
  auditor: {
    name: 'تدقيق عقاري بالذكاء الاصطناعي',
    description: 'تدقيق كامل: هيكل، SEO، عاطفة، تنبيهات ونسخة محسّنة',
  },
  'agent-bio': {
    name: 'منشئ سيرة الوكيل بالذكاء الاصطناعي',
    description: '5 سير احترافية: احترافي، عاطفي، فاخر، اجتماعي، موقع SEO',
  },
  'followup-emails': {
    name: 'بريد متابعة بالذكاء الاصطناعي',
    description: '6 رسائل احترافية لتحويل العملاء المحتملين',
  },
  'video-scripts': {
    name: 'نصوص فيديو بالذكاء الاصطناعي',
    description: 'نصوص احترافية مع طوابع زمنية وتوجيهات بصرية',
  },
  'agency-branding': {
    name: 'هوية الوكالة',
    description: 'خصّص هوية وكالتك',
  },
  crm: {
    name: 'مدير العملاء + ذكاء اصطناعي',
    description: 'بريد وواتساب ورسائل قصيرة بالذكاء الاصطناعي — مسار، أتمتة، نماذج',
  },
  'virtual-staging': {
    name: 'التجهيز الافتراضي ثلاثي الأبعاد',
    description: 'تجهيز ثلاثي الأبعاد احترافي لعقاراتك',
  },
  'voice-calling': {
    name: 'مكالمات صوتية بالذكاء الاصطناعي',
    description: 'مكالمات تلقائية لأصحاب العقارات (30/شهر)',
  },
  'agency-assistant': {
    name: 'Agency Assistant بالذكاء الاصطناعي',
    description: 'روبوت محادثة للإعلانات والبريد والشبكات والاستراتيجية',
  },
  automations: {
    name: 'أتمتة سير العمل',
    description: 'متابعات مجدولة، تذكير زيارات ومحتوى أسبوعي',
  },
  'crm-automation-rules': {
    name: 'قواعد أتمتة CRM',
    description: 'إذا/فإن لأحداث العميل: عميل جديد، تغيير حالة، درجة، إشعارات',
  },
  'unlimited-voice': {
    name: 'مكالمات صوتية غير محدودة',
    description: 'مكالمات تلقائية على مدار الساعة دون حد',
  },
  'team-management': {
    name: 'إدارة فريق متعدد المستخدمين',
    description: 'فرق حتى 10 وكلاء وأدوار وصلاحيات متقدمة',
  },
  'aura-vr': {
    name: 'Aura VR: جولات افتراضية',
    description: 'إنشاء جولات افتراضية سينمائية بلا حدود',
  },
  prospecting: {
    name: 'War Room Prospecting',
    description: 'لوحة ذكاء للصفقات العقارية بالذكاء الاصطناعي',
  },
  map: {
    name: 'خريطة الإقليم بالذكاء الاصطناعي',
    description: 'اعرض العقارات والفرص على الخريطة',
  },
};

export const planFeaturesUiEs: PlanFeaturesUi = { chrome: chromeEs, items: itemsEs };
export const planFeaturesUiFr: PlanFeaturesUi = { chrome: chromeFr, items: itemsFr };
export const planFeaturesUiDe: PlanFeaturesUi = { chrome: chromeDe, items: itemsDe };
export const planFeaturesUiPt: PlanFeaturesUi = { chrome: chromePt, items: itemsPt };
export const planFeaturesUiAr: PlanFeaturesUi = { chrome: chromeAr, items: itemsAr };
