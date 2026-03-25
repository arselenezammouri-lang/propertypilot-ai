/**
 * Localized dashboard slice: map chrome + mapPage + opportunitiesPage + autopilotPage + transactionTypes
 * for ES / FR / DE / PT / AR (merge with EN base in getTranslation).
 */

import type { TransactionTypeUi } from '@/lib/i18n/transaction-type-ui';
import {
  transactionTypeUiAr,
  transactionTypeUiDe,
  transactionTypeUiEs,
  transactionTypeUiFr,
  transactionTypeUiPt,
} from '@/lib/i18n/transaction-type-ui';

type MapPage = {
  loadError: string;
  callStartedDesc: string;
  paywallSubtitle: string;
  paywallCardDesc: string;
  unlockAgency: string;
  backToProspecting: string;
  backAria: string;
  topDealsOnly: string;
  topDealsOnlyShort: string;
  ghostShort: string;
  mapTitleShort: string;
  kpiMappedListings: string;
  kpiTopDeals: string;
  kpiHighUrgency: string;
  emptyNoListings: string;
  emptyNoGhosts: string;
  emptyEnableGhostHint: string;
  closeDetailAria: string;
  badgeTopDeal: string;
  badgeHighUrgency: string;
  urgencyScoreTitle: string;
  ghostListingDays: string;
  marketGapTitle: string;
  marketGapVsArea: string;
  preview3dTitle: string;
  quickActionsTitle: string;
  callingInProgress: string;
  whatsappProjectCta: string;
  viewOriginalListing: string;
};

type OpportunitiesPage = {
  title: string;
  subtitle: string;
  type: string;
  underpriced: string;
  old: string;
  uncontacted: string;
  city: string;
  cityPlaceholder: string;
  oldDays: string;
  loading: string;
  refresh: string;
  results: string;
  noResults: string;
  selectListing: string;
  loadingResults: string;
  loadFailed: string;
  unknown: string;
  status: string;
  na: string;
  filtersTitle: string;
  filtersDescription: string;
};

type AutopilotPage = {
  title: string;
  subtitle: string;
  active: string;
  rulePlaceholder: string;
  city: string;
  region: string;
  minPrice: string;
  maxPrice: string;
  runHour: string;
  dailyLimit: string;
  saving: string;
  save: string;
  lastRuns: string;
  noRuns: string;
  opportunities: string;
  leads: string;
  recentActions: string;
  noActions: string;
  defaultRule: string;
  loadError: string;
  saveSuccess: string;
  saveError: string;
  saveToastTitle: string;
  configCardTitle: string;
  configCardDescription: string;
};

export type DashboardMapOppAutoSlice = {
  mapTitle: string;
  mapSubtitle: string;
  mapGhostListings: string;
  mapRefresh: string;
  mapLegend: string;
  mapTopDeal: string;
  mapHighUrgency: string;
  mapWarm: string;
  mapCold: string;
  mapCallLaunched: string;
  mapCallError: string;
  mapLanciaChiamata: string;
  mapPage: MapPage;
  opportunitiesPage: OpportunitiesPage;
  autopilotPage: AutopilotPage;
  transactionTypes: TransactionTypeUi;
};

const mapPageEs: MapPage = {
  loadError: 'Error al cargar los datos del mapa',
  callStartedDesc: 'La llamada con IA se inició correctamente',
  paywallSubtitle:
    'Solo con plan Agency. Desbloquea el mapa y todas las funciones Diamond.',
  paywallCardDesc: 'Solo con plan Agency.',
  unlockAgency: 'Desbloquear con Agency',
  backToProspecting: 'Volver a Prospecting',
  backAria: 'Atrás',
  topDealsOnly: 'Solo TOP DEAL',
  topDealsOnlyShort: 'TOP',
  ghostShort: 'Ghost',
  mapTitleShort: 'Predator Map',
  kpiMappedListings: 'Inmuebles en el mapa',
  kpiTopDeals: 'Top deals',
  kpiHighUrgency: 'Alta urgencia',
  emptyNoListings: 'No se encontraron inmuebles',
  emptyNoGhosts: 'No hay ghost listings disponibles',
  emptyEnableGhostHint: 'Activa Ghost Listings para ver más opciones',
  closeDetailAria: 'Cerrar detalle',
  badgeTopDeal: 'TOP DEAL',
  badgeHighUrgency: 'ALTA URGENCIA',
  urgencyScoreTitle: 'Puntuación de urgencia',
  ghostListingDays: 'Ghost listing: {days} días en el mercado',
  marketGapTitle: 'BRECHA DE MERCADO',
  marketGapVsArea: 'vs media de la zona',
  preview3dTitle: 'Vista previa 3D',
  quickActionsTitle: 'Acciones rápidas',
  callingInProgress: 'Llamando…',
  whatsappProjectCta: 'Enviar proyecto por WhatsApp',
  viewOriginalListing: 'Ver anuncio original →',
};

const opportunitiesEs: OpportunitiesPage = {
  title: 'Radar de oportunidades',
  subtitle:
    'Encuentra inmuebles infravalorados, anuncios antiguos o propietarios no contactados para nuevos mandatos.',
  type: 'Tipo de oportunidad',
  underpriced: 'Infravalorado',
  old: 'Anuncios antiguos',
  uncontacted: 'Sin contactar',
  city: 'Ciudad (opcional)',
  cityPlaceholder: 'Madrid',
  oldDays: 'Antigüedad mínima (días)',
  loading: 'Cargando…',
  refresh: 'Actualizar',
  results: 'Resultados',
  noResults: 'No hay oportunidades con los filtros actuales.',
  selectListing: 'Selecciona un anuncio para ver el detalle.',
  loadingResults: 'Cargando oportunidades…',
  loadFailed: 'No se pudieron cargar las oportunidades.',
  unknown: 'desconocido',
  status: 'Estado',
  na: 'n/d',
  filtersTitle: 'Filtros de búsqueda',
  filtersDescription: 'Ajusta el tipo de oportunidad y la zona.',
};

const autopilotEs: AutopilotPage = {
  title: 'Autopilot de mandatos 24/7',
  subtitle:
    'El scraper y la voz IA trabajan cada día para encontrar nuevos mandatos y crear leads automáticamente.',
  active: 'Autopilot activo',
  rulePlaceholder: 'Nombre de regla (ej. Mandatos centro Madrid)',
  city: 'Ciudad',
  region: 'Región / provincia',
  minPrice: 'Precio mínimo',
  maxPrice: 'Precio máximo',
  runHour: 'Hora de ejecución (UTC)',
  dailyLimit: 'Máx. nuevos leads por día',
  saving: 'Guardando…',
  save: 'Guardar regla Autopilot',
  lastRuns: 'Últimas ejecuciones',
  noRuns: 'Sin ejecuciones registradas.',
  opportunities: 'oportunidades',
  leads: 'leads',
  recentActions: 'Acciones recientes',
  noActions: 'Sin acciones registradas.',
  defaultRule: 'Autopilot mandatos',
  loadError: 'No se pudo cargar la configuración de Autopilot.',
  saveSuccess: 'Regla Autopilot guardada',
  saveError: 'Error al guardar la regla Autopilot.',
  saveToastTitle: 'Autopilot mandatos',
  configCardTitle: 'Configuración de la regla',
  configCardDescription: 'Activa Autopilot, zonas y límites diarios.',
};

export const dashboardMapOppAutoEs: DashboardMapOppAutoSlice = {
  mapTitle: 'Mapa de comando Predator',
  mapSubtitle: 'Mapa táctico de los acuerdos más urgentes',
  mapGhostListings: 'Ghost listings (>90 días)',
  mapRefresh: 'Actualizar',
  mapLegend: 'Leyenda',
  mapTopDeal: 'TOP DEAL (arbitraje >15%)',
  mapHighUrgency: 'ALTA URGENCIA (puntuación >70)',
  mapWarm: 'TEMPLADO (puntuación 30-70)',
  mapCold: 'FRÍO (puntuación <30)',
  mapCallLaunched: 'Llamada iniciada',
  mapCallError: 'Error al iniciar la llamada',
  mapLanciaChiamata: 'Lanzar llamada Predator',
  mapPage: mapPageEs,
  opportunitiesPage: opportunitiesEs,
  autopilotPage: autopilotEs,
  transactionTypes: transactionTypeUiEs,
};

const mapPageFr: MapPage = {
  loadError: 'Erreur de chargement de la carte',
  callStartedDesc: 'L’appel IA a démarré avec succès',
  paywallSubtitle:
    'Réservé au forfait Agency. Débloquez la carte et toutes les fonctions Diamond.',
  paywallCardDesc: 'Réservé au forfait Agency.',
  unlockAgency: 'Débloquer avec Agency',
  backToProspecting: 'Retour au Prospecting',
  backAria: 'Retour',
  topDealsOnly: 'TOP DEAL uniquement',
  topDealsOnlyShort: 'TOP',
  ghostShort: 'Ghost',
  mapTitleShort: 'Predator Map',
  kpiMappedListings: 'Biens cartographiés',
  kpiTopDeals: 'Top deals',
  kpiHighUrgency: 'Urgence élevée',
  emptyNoListings: 'Aucun bien trouvé',
  emptyNoGhosts: 'Aucun ghost listing disponible',
  emptyEnableGhostHint: 'Activez Ghost Listings pour plus d’options',
  closeDetailAria: 'Fermer le détail',
  badgeTopDeal: 'TOP DEAL',
  badgeHighUrgency: 'URGENCE ÉLEVÉE',
  urgencyScoreTitle: 'Score d’urgence',
  ghostListingDays: 'Ghost listing : {days} jours sur le marché',
  marketGapTitle: 'ÉCART DE MARCHÉ',
  marketGapVsArea: 'vs moyenne locale',
  preview3dTitle: 'Aperçu 3D',
  quickActionsTitle: 'Actions rapides',
  callingInProgress: 'Appel en cours…',
  whatsappProjectCta: 'Envoyer le projet WhatsApp',
  viewOriginalListing: 'Voir l’annonce d’origine →',
};

const opportunitiesFr: OpportunitiesPage = {
  title: 'Radar d’opportunités',
  subtitle:
    'Trouvez des biens sous-cotés, des annonces anciennes ou des propriétaires jamais contactés pour de nouveaux mandats.',
  type: 'Type d’opportunité',
  underpriced: 'Sous-coté',
  old: 'Anciennes annonces',
  uncontacted: 'Jamais contactés',
  city: 'Ville (optionnel)',
  cityPlaceholder: 'Paris',
  oldDays: 'Plus ancien que (jours)',
  loading: 'Chargement…',
  refresh: 'Actualiser',
  results: 'Résultats',
  noResults: 'Aucune opportunité avec les filtres actuels.',
  selectListing: 'Sélectionnez une annonce pour ouvrir le détail.',
  loadingResults: 'Chargement des opportunités…',
  loadFailed: 'Impossible de charger les opportunités.',
  unknown: 'inconnu',
  status: 'Statut',
  na: 'n/d',
  filtersTitle: 'Filtres de recherche',
  filtersDescription: 'Affinez le type d’opportunité et la zone.',
};

const autopilotFr: AutopilotPage = {
  title: 'Autopilot mandats 24/7',
  subtitle:
    'Le scraper et la voix IA travaillent chaque jour pour trouver de nouveaux mandats et créer des leads automatiquement.',
  active: 'Autopilot activé',
  rulePlaceholder: 'Nom de la règle (ex. Mandats centre-ville)',
  city: 'Ville',
  region: 'Région / province',
  minPrice: 'Prix minimum',
  maxPrice: 'Prix maximum',
  runHour: 'Heure d’exécution (UTC)',
  dailyLimit: 'Max. nouveaux leads par jour',
  saving: 'Enregistrement…',
  save: 'Enregistrer la règle Autopilot',
  lastRuns: 'Dernières exécutions',
  noRuns: 'Aucune exécution enregistrée.',
  opportunities: 'opportunités',
  leads: 'leads',
  recentActions: 'Actions récentes',
  noActions: 'Aucune action enregistrée.',
  defaultRule: 'Autopilot mandats',
  loadError: 'Impossible de charger la configuration Autopilot.',
  saveSuccess: 'Règle Autopilot enregistrée',
  saveError: 'Erreur lors de l’enregistrement de la règle.',
  saveToastTitle: 'Autopilot mandats',
  configCardTitle: 'Configuration de la règle',
  configCardDescription: 'Activez Autopilot, zones et limites quotidiennes.',
};

export const dashboardMapOppAutoFr: DashboardMapOppAutoSlice = {
  mapTitle: 'Carte de commande Predator',
  mapSubtitle: 'Carte tactique des dossiers les plus urgents',
  mapGhostListings: 'Ghost listings (>90 jours)',
  mapRefresh: 'Actualiser',
  mapLegend: 'Légende',
  mapTopDeal: 'TOP DEAL (arbitrage >15%)',
  mapHighUrgency: 'URGENCE ÉLEVÉE (score >70)',
  mapWarm: 'TIÈDE (score 30-70)',
  mapCold: 'FROID (score <30)',
  mapCallLaunched: 'Appel lancé',
  mapCallError: 'Impossible de lancer l’appel',
  mapLanciaChiamata: 'Lancer l’appel Predator',
  mapPage: mapPageFr,
  opportunitiesPage: opportunitiesFr,
  autopilotPage: autopilotFr,
  transactionTypes: transactionTypeUiFr,
};

const mapPageDe: MapPage = {
  loadError: 'Fehler beim Laden der Kartendaten',
  callStartedDesc: 'Der KI-Anruf wurde erfolgreich gestartet',
  paywallSubtitle:
    'Nur mit Agency-Tarif. Schalten Sie die Karte und alle Diamond-Funktionen frei.',
  paywallCardDesc: 'Nur mit Agency-Tarif.',
  unlockAgency: 'Mit Agency freischalten',
  backToProspecting: 'Zurück zu Prospecting',
  backAria: 'Zurück',
  topDealsOnly: 'Nur TOP DEAL',
  topDealsOnlyShort: 'TOP',
  ghostShort: 'Ghost',
  mapTitleShort: 'Predator Map',
  kpiMappedListings: 'Erfasste Objekte',
  kpiTopDeals: 'Top-Deals',
  kpiHighUrgency: 'Hohe Dringlichkeit',
  emptyNoListings: 'Keine Objekte gefunden',
  emptyNoGhosts: 'Keine Ghost Listings verfügbar',
  emptyEnableGhostHint: 'Ghost Listings aktivieren für mehr Optionen',
  closeDetailAria: 'Detail schließen',
  badgeTopDeal: 'TOP DEAL',
  badgeHighUrgency: 'HOHE DRINGLICHKEIT',
  urgencyScoreTitle: 'Dringlichkeits-Score',
  ghostListingDays: 'Ghost Listing: {days} Tage am Markt',
  marketGapTitle: 'MARKTLÜCKE',
  marketGapVsArea: 'vs. Zonendurchschnitt',
  preview3dTitle: '3D-Vorschau',
  quickActionsTitle: 'Schnellaktionen',
  callingInProgress: 'Anruf läuft…',
  whatsappProjectCta: 'WhatsApp-Projekt senden',
  viewOriginalListing: 'Originalinserat ansehen →',
};

const opportunitiesDe: OpportunitiesPage = {
  title: 'Chancen-Radar',
  subtitle:
    'Unterbewertete Objekte, alte Inserate oder nie kontaktierte Eigentümer für neue Mandate finden.',
  type: 'Chancentyp',
  underpriced: 'Unterbewertet',
  old: 'Alte Inserate',
  uncontacted: 'Nie kontaktiert',
  city: 'Stadt (optional)',
  cityPlaceholder: 'Berlin',
  oldDays: 'Älter als (Tage)',
  loading: 'Lädt…',
  refresh: 'Aktualisieren',
  results: 'Ergebnisse',
  noResults: 'Keine Chancen mit den aktuellen Filtern.',
  selectListing: 'Wählen Sie ein Inserat für Details.',
  loadingResults: 'Chancen werden geladen…',
  loadFailed: 'Chancen konnten nicht geladen werden.',
  unknown: 'unbekannt',
  status: 'Status',
  na: 'k. A.',
  filtersTitle: 'Suchfilter',
  filtersDescription: 'Chancentyp und Region verfeinern.',
};

const autopilotDe: AutopilotPage = {
  title: 'Mandats-Autopilot 24/7',
  subtitle:
    'Scraper und KI-Sprache arbeiten täglich an neuen Mandaten und automatischen Leads.',
  active: 'Autopilot aktiv',
  rulePlaceholder: 'Regelname (z. B. Mandate Innenstadt)',
  city: 'Stadt',
  region: 'Region / Provinz',
  minPrice: 'Mindestpreis',
  maxPrice: 'Höchstpreis',
  runHour: 'Ausführungszeit (UTC)',
  dailyLimit: 'Max. neue Leads pro Tag',
  saving: 'Speichern…',
  save: 'Autopilot-Regel speichern',
  lastRuns: 'Letzte Läufe',
  noRuns: 'Keine Läufe protokolliert.',
  opportunities: 'Chancen',
  leads: 'Leads',
  recentActions: 'Letzte Aktionen',
  noActions: 'Keine Aktionen protokolliert.',
  defaultRule: 'Mandats-Autopilot',
  loadError: 'Autopilot-Konfiguration konnte nicht geladen werden.',
  saveSuccess: 'Autopilot-Regel gespeichert',
  saveError: 'Fehler beim Speichern der Autopilot-Regel.',
  saveToastTitle: 'Mandats-Autopilot',
  configCardTitle: 'Regelkonfiguration',
  configCardDescription: 'Autopilot, Gebiete und Tageslimits aktivieren.',
};

export const dashboardMapOppAutoDe: DashboardMapOppAutoSlice = {
  mapTitle: 'Predator-Kommandokarte',
  mapSubtitle: 'Taktische Karte der dringendsten Deals',
  mapGhostListings: 'Ghost Listings (>90 Tage)',
  mapRefresh: 'Aktualisieren',
  mapLegend: 'Legende',
  mapTopDeal: 'TOP DEAL (Arbitrage >15%)',
  mapHighUrgency: 'HOHE DRINGLICHKEIT (Score >70)',
  mapWarm: 'WARM (Score 30-70)',
  mapCold: 'KALT (Score <30)',
  mapCallLaunched: 'Anruf gestartet',
  mapCallError: 'Anruf konnte nicht gestartet werden',
  mapLanciaChiamata: 'Predator-Anruf starten',
  mapPage: mapPageDe,
  opportunitiesPage: opportunitiesDe,
  autopilotPage: autopilotDe,
  transactionTypes: transactionTypeUiDe,
};

const mapPagePt: MapPage = {
  loadError: 'Erro ao carregar o mapa',
  callStartedDesc: 'A chamada com IA foi iniciada com sucesso',
  paywallSubtitle:
    'Apenas no plano Agency. Desbloqueie o mapa e todas as funções Diamond.',
  paywallCardDesc: 'Apenas no plano Agency.',
  unlockAgency: 'Desbloquear com Agency',
  backToProspecting: 'Voltar ao Prospecting',
  backAria: 'Voltar',
  topDealsOnly: 'Apenas TOP DEAL',
  topDealsOnlyShort: 'TOP',
  ghostShort: 'Ghost',
  mapTitleShort: 'Predator Map',
  kpiMappedListings: 'Imóveis no mapa',
  kpiTopDeals: 'Top deals',
  kpiHighUrgency: 'Alta urgência',
  emptyNoListings: 'Nenhum imóvel encontrado',
  emptyNoGhosts: 'Sem ghost listings disponíveis',
  emptyEnableGhostHint: 'Ative Ghost Listings para ver mais opções',
  closeDetailAria: 'Fechar detalhe',
  badgeTopDeal: 'TOP DEAL',
  badgeHighUrgency: 'ALTA URGÊNCIA',
  urgencyScoreTitle: 'Pontuação de urgência',
  ghostListingDays: 'Ghost listing: {days} dias no mercado',
  marketGapTitle: 'GAP DE MERCADO',
  marketGapVsArea: 'vs média da zona',
  preview3dTitle: 'Pré-visualização 3D',
  quickActionsTitle: 'Ações rápidas',
  callingInProgress: 'A ligar…',
  whatsappProjectCta: 'Enviar projeto no WhatsApp',
  viewOriginalListing: 'Ver anúncio original →',
};

const opportunitiesPt: OpportunitiesPage = {
  title: 'Radar de oportunidades',
  subtitle:
    'Encontre imóveis subvalorizados, anúncios antigos ou proprietários nunca contactados para novos mandatos.',
  type: 'Tipo de oportunidade',
  underpriced: 'Subvalorizado',
  old: 'Anúncios antigos',
  uncontacted: 'Nunca contactados',
  city: 'Cidade (opcional)',
  cityPlaceholder: 'Lisboa',
  oldDays: 'Mais antigos que (dias)',
  loading: 'A carregar…',
  refresh: 'Atualizar',
  results: 'Resultados',
  noResults: 'Sem oportunidades com os filtros atuais.',
  selectListing: 'Selecione um anúncio para ver detalhes.',
  loadingResults: 'A carregar oportunidades…',
  loadFailed: 'Não foi possível carregar as oportunidades.',
  unknown: 'desconhecido',
  status: 'Estado',
  na: 'n/d',
  filtersTitle: 'Filtros de pesquisa',
  filtersDescription: 'Ajuste o tipo de oportunidade e a zona.',
};

const autopilotPt: AutopilotPage = {
  title: 'Autopilot de mandatos 24/7',
  subtitle:
    'O scraper e a voz IA trabalham todos os dias para novos mandatos e leads automáticos.',
  active: 'Autopilot ativo',
  rulePlaceholder: 'Nome da regra (ex. Mandatos centro)',
  city: 'Cidade',
  region: 'Região / província',
  minPrice: 'Preço mínimo',
  maxPrice: 'Preço máximo',
  runHour: 'Hora de execução (UTC)',
  dailyLimit: 'Máx. novos leads por dia',
  saving: 'A guardar…',
  save: 'Guardar regra Autopilot',
  lastRuns: 'Últimas execuções',
  noRuns: 'Sem execuções registadas.',
  opportunities: 'oportunidades',
  leads: 'leads',
  recentActions: 'Ações recentes',
  noActions: 'Sem ações registadas.',
  defaultRule: 'Autopilot mandatos',
  loadError: 'Não foi possível carregar a configuração Autopilot.',
  saveSuccess: 'Regra Autopilot guardada',
  saveError: 'Erro ao guardar a regra Autopilot.',
  saveToastTitle: 'Autopilot mandatos',
  configCardTitle: 'Configuração da regra',
  configCardDescription: 'Ative Autopilot, zonas e limites diários.',
};

export const dashboardMapOppAutoPt: DashboardMapOppAutoSlice = {
  mapTitle: 'Mapa de comando Predator',
  mapSubtitle: 'Mapa tático dos negócios mais urgentes',
  mapGhostListings: 'Ghost listings (>90 dias)',
  mapRefresh: 'Atualizar',
  mapLegend: 'Legenda',
  mapTopDeal: 'TOP DEAL (arbitragem >15%)',
  mapHighUrgency: 'ALTA URGÊNCIA (pontuação >70)',
  mapWarm: 'MORNO (pontuação 30-70)',
  mapCold: 'FRIO (pontuação <30)',
  mapCallLaunched: 'Chamada iniciada',
  mapCallError: 'Erro ao iniciar a chamada',
  mapLanciaChiamata: 'Iniciar chamada Predator',
  mapPage: mapPagePt,
  opportunitiesPage: opportunitiesPt,
  autopilotPage: autopilotPt,
  transactionTypes: transactionTypeUiPt,
};

const mapPageAr: MapPage = {
  loadError: 'خطأ في تحميل بيانات الخريطة',
  callStartedDesc: 'تم بدء مكالمة الذكاء الاصطناعي بنجاح',
  paywallSubtitle:
    'متاح مع خطة Agency فقط. افتح الخريطة وجميع ميزات Diamond.',
  paywallCardDesc: 'متاح مع خطة Agency فقط.',
  unlockAgency: 'فتح مع Agency',
  backToProspecting: 'العودة إلى Prospecting',
  backAria: 'رجوع',
  topDealsOnly: 'TOP DEAL فقط',
  topDealsOnlyShort: 'TOP',
  ghostShort: 'Ghost',
  mapTitleShort: 'Predator Map',
  kpiMappedListings: 'عقارات على الخريطة',
  kpiTopDeals: 'أفضل الصفقات',
  kpiHighUrgency: 'إلحاح مرتفع',
  emptyNoListings: 'لم يُعثر على عقارات',
  emptyNoGhosts: 'لا توجد إعلانات ghost',
  emptyEnableGhostHint: 'فعّل Ghost Listings لرؤية المزيد',
  closeDetailAria: 'إغلاق التفاصيل',
  badgeTopDeal: 'TOP DEAL',
  badgeHighUrgency: 'إلحاح مرتفع',
  urgencyScoreTitle: 'درجة الإلحاح',
  ghostListingDays: 'Ghost listing: {days} يوماً في السوق',
  marketGapTitle: 'فجوة السوق',
  marketGapVsArea: 'مقارنة بمتوسط المنطقة',
  preview3dTitle: 'معاينة ثلاثية الأبعاد',
  quickActionsTitle: 'إجراءات سريعة',
  callingInProgress: 'جاري الاتصال…',
  whatsappProjectCta: 'إرسال المشروع عبر واتساب',
  viewOriginalListing: 'عرض الإعلان الأصلي ←',
};

const opportunitiesAr: OpportunitiesPage = {
  title: 'رادار الفرص',
  subtitle:
    'اعثر على عقارات أقل من قيمتها أو إعلانات قديمة أو مالكين لم يُتصل بهم لفرص تفويض جديدة.',
  type: 'نوع الفرصة',
  underpriced: 'أقل من القيمة',
  old: 'إعلانات قديمة',
  uncontacted: 'لم يُتصل بهم',
  city: 'المدينة (اختياري)',
  cityPlaceholder: 'دبي',
  oldDays: 'أقدم من (أيام)',
  loading: 'جاري التحميل…',
  refresh: 'تحديث',
  results: 'النتائج',
  noResults: 'لا توجد فرص بالمرشحات الحالية.',
  selectListing: 'اختر إعلاناً لعرض التفاصيل.',
  loadingResults: 'جاري تحميل الفرص…',
  loadFailed: 'تعذر تحميل الفرص.',
  unknown: 'غير معروف',
  status: 'الحالة',
  na: 'غير متوفر',
  filtersTitle: 'مرشحات البحث',
  filtersDescription: 'حدد نوع الفرصة والمنطقة.',
};

const autopilotAr: AutopilotPage = {
  title: 'الطيار الآلي للتفويضات 24/7',
  subtitle:
    'يعمل المستخرج والصوت بالذكاء الاصطناعي يومياً للعثور على تفويضات جديدة وإنشاء عملاء محتملين.',
  active: 'الطيار الآلي مفعّل',
  rulePlaceholder: 'اسم القاعدة (مثال: تفويضات وسط المدينة)',
  city: 'المدينة',
  region: 'المنطقة / المحافظة',
  minPrice: 'الحد الأدنى للسعر',
  maxPrice: 'الحد الأقصى للسعر',
  runHour: 'وقت التشغيل (UTC)',
  dailyLimit: 'الحد الأقصى لعملاء جدد يومياً',
  saving: 'جاري الحفظ…',
  save: 'حفظ قاعدة الطيار الآلي',
  lastRuns: 'آخر التشغيلات',
  noRuns: 'لا توجد تشغيلات مسجلة.',
  opportunities: 'فرص',
  leads: 'عملاء محتملون',
  recentActions: 'إجراءات حديثة',
  noActions: 'لا إجراءات مسجلة.',
  defaultRule: 'طيار آلي للتفويضات',
  loadError: 'تعذر تحميل إعدادات الطيار الآلي.',
  saveSuccess: 'تم حفظ قاعدة الطيار الآلي',
  saveError: 'خطأ أثناء حفظ القاعدة.',
  saveToastTitle: 'طيار آلي للتفويضات',
  configCardTitle: 'إعداد القاعدة',
  configCardDescription: 'فعّل الطيار الآلي والمناطق والحدود اليومية.',
};

export const dashboardMapOppAutoAr: DashboardMapOppAutoSlice = {
  mapTitle: 'خريطة قيادة Predator',
  mapSubtitle: 'خريطة تكتيكية لأكثر الصفقات إلحاحاً',
  mapGhostListings: 'Ghost listings (>90 يوماً)',
  mapRefresh: 'تحديث',
  mapLegend: 'مفتاح الخريطة',
  mapTopDeal: 'TOP DEAL (مراجحة >15%)',
  mapHighUrgency: 'إلحاح مرتفع (درجة >70)',
  mapWarm: 'متوسط (درجة 30-70)',
  mapCold: 'منخفض (درجة <30)',
  mapCallLaunched: 'تم بدء المكالمة',
  mapCallError: 'تعذر بدء المكالمة',
  mapLanciaChiamata: 'بدء مكالمة Predator',
  mapPage: mapPageAr,
  opportunitiesPage: opportunitiesAr,
  autopilotPage: autopilotAr,
  transactionTypes: transactionTypeUiAr,
};
