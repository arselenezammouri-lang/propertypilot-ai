/** Copy for `/dashboard/prospecting` — Arbitrage Command Center. IT + EN. */

export type ProspectingStatusRowLabels = {
  new: string;
  analyzed: string;
  called: string;
  in_negotiation: string;
  mandate_taken: string;
  appointment_set: string;
  rejected: string;
  converted: string;
};

export type ProspectingPageUi = {
  heroTitle: string;
  heroSubtitle: string;
  topMatchOnly: string;
  exportLeads: string;
  refresh: string;
  filters: string;
  ariaName: string;
  ariaMsg: string;
  statusLabel: string;
  allStatuses: string;
  platformLabel: string;
  allPlatforms: string;
  locationLabel: string;
  locationPlaceholder: string;
  activeFilters: string;
  noFilters: string;
  editFilter: string;
  deleteFilter: string;
  filterMoreOptionsAria: string;
  autoRun: string;
  lastRun: string;
  listings: string;
  exportConfirm: string;
  premiumRequired: string;
  premiumCallDesc: string;
  callStarted: string;
  callStartedDesc: string;
  errorTitle: string;
  connectionError: string;
  loadError: string;
  callError: string;
  msgGenerated: string;
  msgGeneratedDesc: string;
  filtersComingSoon: string;
  statusUpdated: string;
  statusUpdateError: string;
  autoRunUpdated: string;
  autoRunEnabled: string;
  autoRunDisabled: string;
  autoRunError: string;
  deleted: string;
  deleteError: string;
  statusRow: ProspectingStatusRowLabels;
  statusSelectNew: string;
  statusSelectAnalyzed: string;
  statusSelectCalled: string;
  statusSelectNegotiation: string;
  statusSelectMandate: string;
  colTitle: string;
  colAiBriefing: string;
  colLocation: string;
  colPrice: string;
  colMarketGap: string;
  colPlatform: string;
  colStatus: string;
  colNextAction: string;
  colActions: string;
  copied: string;
  copiedTitle: string;
  copiedDesc: string;
  copyForClient: string;
  copyError: string;
  noListings: string;
  ariaAdvice: string;
  ariaEmptyMsg: string;
  viewDetails: string;
  callAI: string;
  smartMessage: string;
  investmentAnalysis: string;
  premiumReport: string;
  priceDropSniper: string;
  virtualStaging: string;
  xRayVision: string;
  auraVR: string;
  contactOwner: string;
  loading: string;
  starting: string;
  callNow: string;
  outreach: string;
  startAiCall: string;
  /** Use replace('{n}', String(n)) */
  callsRemaining: string;
  callLimitReached: string;
  aiVoiceCall: string;
  aiVoiceCallDesc: string;
  aiSmartMessage: string;
  aiSmartMessageDesc: string;
  auraVRTitle: string;
  auraVRDesc: string;
  auraVRMenuTitle: string;
  auraVRMenuDesc: string;
  manualOverrideTitle: string;
  manualOverrideDesc: string;
  manualOverrideDialogTitle: string;
  manualOverrideDialogDesc: string;
  manualOverrideOwnerLabel: string;
  manualOverridePhoneLabel: string;
  manualOverrideLocationLabel: string;
  upgradeOutreach: string;
  vsMarket: string;
  /** replace('{label}', status label) */
  statusUpdatedDesc: string;
  statusUpdateFailDesc: string;
  backAria: string;
  planAgency: string;
  planPro: string;
  planStarter: string;
  planFree: string;
  na: string;
  propertyFallback: string;
  /** replace('{title}', '{location}') */
  liveFeedAiCalling: string;
  /** replace('{location}') */
  liveFeedWhatsAppGenerated: string;
  liveFeedAuraVrStarted: string;
  listingsFoundTitle: string;
  listingsCardDesc: string;
  eliteDealBadge: string;
  topDealBadge: string;
  detailModalTitle: string;
  detailModalDesc: string;
  detailOwner: string;
  detailPhone: string;
  detailOwnerMaskedLabel: string;
  detailPhoneMaskedLabel: string;
  detailOwnerData: string;
  detailUnlockAgency: string;
  detailUpgradeNow: string;
  virtualStagingPaywallTitle: string;
  virtualStagingPaywallDesc: string;
  marketGapTitle: string;
  /** replace('{pct}', percentage string) */
  marketGapVs: string;
  marketGapSubtitle: string;
  photoAnalysisTitle: string;
  downloadInvestmentAnalysis: string;
  aiAnalysisTitle: string;
  aiQualityScore: string;
  aiNote: string;
  aiBestTimeToCall: string;
  aiCallTranscript: string;
  seeOriginalListing: string;
  phoneCopiedDesc: string;
  messageCopiedDesc: string;
  copyMessage: string;
  sendWhatsapp: string;
  smartMessageModalTitle: string;
  /** replace('{title}') */
  smartMessageModalDesc: string;
  generatedMessageLabel: string;
  manualOverrideClose: string;
  manualOverrideCallNow: string;
  auraVrModalTitle: string;
  /** replace('{title}') */
  auraVrModalDesc: string;
  priceNa: string;
  /** Mock AI photo tags (UI preview) */
  imageInsightTags: string[];
};

const it: ProspectingPageUi = {
  heroTitle: 'Arbitrage Command Center',
  heroSubtitle:
    'Identifica opportunità di arbitraggio e ottieni mandati esclusivi',
  topMatchOnly: 'Sola polpa',
  exportLeads: 'Esporta lead',
  refresh: 'Aggiorna',
  filters: 'Filtri',
  ariaName: 'Aria:',
  ariaMsg:
    "Crea il tuo primo filtro per iniziare a trovare deal d'oro! Definisci prezzo, location e caratteristiche desiderate.",
  statusLabel: 'Status',
  allStatuses: 'Tutti',
  platformLabel: 'Piattaforma',
  allPlatforms: 'Tutte',
  locationLabel: 'Location',
  locationPlaceholder: 'Cerca location…',
  activeFilters: 'Filtri attivi',
  noFilters: 'Nessun filtro attivo',
  editFilter: 'Modifica',
  deleteFilter: 'Elimina',
  filterMoreOptionsAria: 'Altre opzioni',
  autoRun: 'Auto-run',
  lastRun: 'Ultimo run:',
  listings: 'annunci',
  exportConfirm:
    'Esporta in Excel? (OK = Excel, Annulla = CSV)',
  premiumRequired: 'Piano Premium richiesto',
  premiumCallDesc:
    'Il Voice AI Prospecting è una funzionalità Premium. Aggiorna il tuo account al piano PRO o AGENCY.',
  callStarted: 'Chiamata avviata',
  callStartedDesc: 'La chiamata AI è stata avviata con successo',
  errorTitle: 'Errore',
  connectionError: 'Errore di connessione',
  loadError: 'Errore nel caricamento degli annunci',
  callError: "Errore nell'avvio della chiamata",
  msgGenerated: 'Messaggio generato',
  msgGeneratedDesc:
    'Il messaggio WhatsApp è stato generato con successo',
  filtersComingSoon:
    'Crea un filtro dalla barra di ricerca sopra. Funzionalità in arrivo.',
  statusUpdated: 'Status aggiornato',
  statusUpdateError: 'Errore aggiornamento status',
  autoRunUpdated: 'Auto-run aggiornato',
  autoRunEnabled: 'Auto-run attivato',
  autoRunDisabled: 'Auto-run disattivato',
  autoRunError: 'Errore aggiornamento auto-run',
  deleted: 'Eliminato',
  deleteError: 'Errore eliminazione',
  statusRow: {
    new: 'Nuovo',
    analyzed: 'Analizzato',
    called: 'Chiamato',
    in_negotiation: 'In trattativa',
    mandate_taken: 'Mandato preso',
    appointment_set: 'Appuntamento fissato',
    rejected: 'Rifiutato',
    converted: 'Convertito',
  },
  statusSelectNew: 'Nuovo',
  statusSelectAnalyzed: 'Analizzato',
  statusSelectCalled: 'Chiamato',
  statusSelectNegotiation: 'In trattativa',
  statusSelectMandate: 'Mandato preso',
  colTitle: 'Titolo',
  colAiBriefing: 'AI Briefing',
  colLocation: 'Location',
  colPrice: 'Prezzo',
  colMarketGap: 'GAP mercato',
  colPlatform: 'Piattaforma',
  colStatus: 'Status',
  colNextAction: 'Prossima azione',
  colActions: 'Azioni',
  copied: 'Copiato',
  copiedTitle: 'Copiato!',
  copiedDesc: 'Riassunto copiato negli appunti',
  copyForClient: 'Copia per cliente',
  copyError: 'Impossibile copiare',
  noListings:
    'Nessun annuncio trovato. Crea un filtro per iniziare.',
  ariaAdvice: '💡 Consiglio di Aria',
  ariaEmptyMsg:
    'Crea un filtro personalizzato con criteri specifici (prezzo, location, yield) per trovare le migliori opportunità. Più specifico sei, più preciso sarà il match!',
  viewDetails: 'Dettagli',
  callAI: 'Chiama AI',
  smartMessage: 'Messaggio smart',
  investmentAnalysis: 'Analisi investimento',
  premiumReport: 'Report premium',
  priceDropSniper: 'Price Drop Sniper',
  virtualStaging: 'Virtual staging',
  xRayVision: 'X-Ray Vision',
  auraVR: 'Aura VR',
  contactOwner: 'Contatta proprietario',
  loading: 'Caricamento…',
  starting: 'Avvio…',
  callNow: '🔥 CHIAMA ORA',
  outreach: 'Outreach',
  startAiCall: 'Avvia chiamata AI',
  callsRemaining: '{n}/30 rimanenti',
  callLimitReached: 'Limite raggiunto',
  aiVoiceCall: '📞 AI Voice Call',
  aiVoiceCallDesc: 'Chiamata automatica 24/7',
  aiSmartMessage: '💬 AI Smart Message',
  aiSmartMessageDesc: 'Genera SMS/WhatsApp con AI',
  auraVRTitle: 'Aura VR aperto',
  auraVRDesc: 'Genera un tour VR immersivo per questo immobile',
  auraVRMenuTitle: '✨ Aura VR',
  auraVRMenuDesc: 'Genera tour VR immersivo',
  manualOverrideTitle: '👤 Manual override',
  manualOverrideDesc: 'Accesso diretto dati proprietario',
  manualOverrideDialogTitle: 'Manual override — accesso dati proprietario',
  manualOverrideDialogDesc:
    'Come membro Agency, hai accesso diretto ai dati del proprietario per chiamate umane',
  manualOverrideOwnerLabel: 'Nome proprietario',
  manualOverridePhoneLabel: 'Numero di telefono',
  manualOverrideLocationLabel: 'Location immobile',
  upgradeOutreach: 'Upgrade per outreach',
  vsMarket: 'vs mercato',
  statusUpdatedDesc: 'Immobile spostato in: {label}',
  statusUpdateFailDesc: 'Impossibile aggiornare lo status',
  backAria: 'Indietro',
  planAgency: 'Agency',
  planPro: 'Pro',
  planStarter: 'Starter',
  planFree: 'Free',
  na: 'N/D',
  propertyFallback: 'un immobile',
  liveFeedAiCalling:
    '🤖 AI sta chiamando il proprietario di «{title}» a {location}',
  liveFeedWhatsAppGenerated:
    '💬 Messaggio WhatsApp generato per immobile a {location}',
  liveFeedAuraVrStarted: '✨ Aura VR avviato per immobile a {location}',
  listingsFoundTitle: 'Annunci trovati ({count})',
  listingsCardDesc:
    'Clicca su «Chiama ora» per avviare una chiamata AI al proprietario',
  eliteDealBadge: '💎 SOLDI',
  topDealBadge: '🔥 TOP DEAL',
  detailModalTitle: 'Dettagli completi',
  detailModalDesc: "Dettagli completi dell'annuncio",
  detailOwner: 'Proprietario',
  detailPhone: 'Telefono',
  detailOwnerMaskedLabel: 'Proprietario',
  detailPhoneMaskedLabel: 'Telefono',
  detailOwnerData: 'Dati proprietario',
  detailUnlockAgency:
    'Sblocca i dati completi con piano Agency.',
  detailUpgradeNow: 'Upgrade ora',
  virtualStagingPaywallTitle: 'Virtual Staging 3D',
  virtualStagingPaywallDesc:
    'Questa funzionalità è disponibile solo per gli utenti PRO e AGENCY. Aggiorna il tuo account per sbloccare il Virtual Staging professionale 3D.',
  marketGapTitle: 'GAP DI MERCATO',
  marketGapVs: '-{pct}% vs mercato',
  marketGapSubtitle:
    'Prezzo inferiore alla media della zona — opportunità di arbitraggio',
  photoAnalysisTitle: 'Analisi foto IA',
  downloadInvestmentAnalysis: 'Scarica analisi investimento',
  aiAnalysisTitle: 'Analisi AI',
  aiQualityScore: 'Quality score:',
  aiNote: 'Nota:',
  aiBestTimeToCall: 'Orario migliore per chiamare:',
  aiCallTranscript: 'Transcript chiamata',
  seeOriginalListing: 'Vedi annuncio originale →',
  phoneCopiedDesc: 'Numero copiato negli appunti',
  messageCopiedDesc: 'Messaggio copiato negli appunti',
  copyMessage: 'Copia messaggio',
  sendWhatsapp: 'Invia su WhatsApp',
  smartMessageModalTitle: 'AI Smart Message',
  smartMessageModalDesc:
    'Messaggio WhatsApp generato per {title}',
  generatedMessageLabel: 'Messaggio generato:',
  manualOverrideClose: 'Chiudi',
  manualOverrideCallNow: 'Chiama ora',
  auraVrModalTitle: 'Aura VR Generator',
  auraVrModalDesc: 'Genera un tour VR immersivo per {title}',
  priceNa: 'N/D',
  imageInsightTags: [
    'Infissi da rifare',
    'Cucina anni 70',
    'Parquet ottimo stato',
    'Bagno da ristrutturare',
    'Impianto elettrico datato',
    'Tetto in buone condizioni',
  ],
};

const en: ProspectingPageUi = {
  heroTitle: 'Arbitrage Command Center',
  heroSubtitle:
    'Identify arbitrage opportunities and secure exclusive mandates',
  topMatchOnly: 'Top matches only',
  exportLeads: 'Export leads',
  refresh: 'Refresh',
  filters: 'Filters',
  ariaName: 'Aria:',
  ariaMsg:
    'Create your first filter to start finding golden deals! Define price, location, and desired features.',
  statusLabel: 'Status',
  allStatuses: 'All',
  platformLabel: 'Platform',
  allPlatforms: 'All',
  locationLabel: 'Location',
  locationPlaceholder: 'Search location…',
  activeFilters: 'Active filters',
  noFilters: 'No active filters',
  editFilter: 'Edit',
  deleteFilter: 'Delete',
  filterMoreOptionsAria: 'More options',
  autoRun: 'Auto-run',
  lastRun: 'Last run:',
  listings: 'listings',
  exportConfirm: 'Export to Excel? (OK = Excel, Cancel = CSV)',
  premiumRequired: 'Premium plan required',
  premiumCallDesc:
    'Voice AI Prospecting is a Premium feature. Upgrade your account to the PRO or AGENCY plan.',
  callStarted: 'Call started',
  callStartedDesc: 'The AI call was started successfully',
  errorTitle: 'Error',
  connectionError: 'Connection error',
  loadError: 'Error loading listings',
  callError: 'Error starting the call',
  msgGenerated: 'Message generated',
  msgGeneratedDesc: 'The WhatsApp message was generated successfully',
  filtersComingSoon:
    'Create a filter from the search bar above. Feature coming soon.',
  statusUpdated: 'Status updated',
  statusUpdateError: 'Error updating status',
  autoRunUpdated: 'Auto-run updated',
  autoRunEnabled: 'Auto-run enabled',
  autoRunDisabled: 'Auto-run disabled',
  autoRunError: 'Error updating auto-run',
  deleted: 'Deleted',
  deleteError: 'Delete error',
  statusRow: {
    new: 'New',
    analyzed: 'Analyzed',
    called: 'Called',
    in_negotiation: 'In negotiation',
    mandate_taken: 'Mandate taken',
    appointment_set: 'Appointment set',
    rejected: 'Rejected',
    converted: 'Converted',
  },
  statusSelectNew: 'New',
  statusSelectAnalyzed: 'Analyzed',
  statusSelectCalled: 'Called',
  statusSelectNegotiation: 'In negotiation',
  statusSelectMandate: 'Mandate taken',
  colTitle: 'Title',
  colAiBriefing: 'AI briefing',
  colLocation: 'Location',
  colPrice: 'Price',
  colMarketGap: 'Market GAP',
  colPlatform: 'Platform',
  colStatus: 'Status',
  colNextAction: 'Next action',
  colActions: 'Actions',
  copied: 'Copied',
  copiedTitle: 'Copied!',
  copiedDesc: 'Summary copied to clipboard',
  copyForClient: 'Copy for client',
  copyError: 'Cannot copy',
  noListings: 'No listings found. Create a filter to get started.',
  ariaAdvice: "💡 Aria's tip",
  ariaEmptyMsg:
    'Create a custom filter with specific criteria (price, location, yield) to find the best opportunities. The more specific you are, the more accurate the match!',
  viewDetails: 'Details',
  callAI: 'AI call',
  smartMessage: 'Smart message',
  investmentAnalysis: 'Investment analysis',
  premiumReport: 'Premium report',
  priceDropSniper: 'Price Drop Sniper',
  virtualStaging: 'Virtual staging',
  xRayVision: 'X-Ray Vision',
  auraVR: 'Aura VR',
  contactOwner: 'Contact owner',
  loading: 'Loading…',
  starting: 'Starting…',
  callNow: '🔥 CALL NOW',
  outreach: 'Outreach',
  startAiCall: 'Start AI call',
  callsRemaining: '{n}/30 remaining',
  callLimitReached: 'Limit reached',
  aiVoiceCall: '📞 AI Voice Call',
  aiVoiceCallDesc: 'Automatic call 24/7',
  aiSmartMessage: '💬 AI Smart Message',
  aiSmartMessageDesc: 'Generate SMS/WhatsApp with AI',
  auraVRTitle: 'Aura VR opened',
  auraVRDesc: 'Generate an immersive VR tour for this property',
  auraVRMenuTitle: '✨ Aura VR',
  auraVRMenuDesc: 'Generate immersive VR tour',
  manualOverrideTitle: '👤 Manual override',
  manualOverrideDesc:
    'As an Agency member, you have direct access to owner data for human calls',
  manualOverrideDialogTitle: 'Manual override — owner data access',
  manualOverrideDialogDesc:
    'As an Agency member, you have direct access to the owner’s data for human calls',
  manualOverrideOwnerLabel: 'Owner name',
  manualOverridePhoneLabel: 'Phone number',
  manualOverrideLocationLabel: 'Property location',
  upgradeOutreach: 'Upgrade for outreach',
  vsMarket: 'vs market',
  statusUpdatedDesc: 'Property moved to: {label}',
  statusUpdateFailDesc: 'Cannot update status',
  backAria: 'Back',
  planAgency: 'Agency',
  planPro: 'Pro',
  planStarter: 'Starter',
  planFree: 'Free',
  na: 'N/A',
  propertyFallback: 'a property',
  liveFeedAiCalling:
    '🤖 AI is calling the owner of "{title}" at {location}',
  liveFeedWhatsAppGenerated:
    '💬 WhatsApp message generated for property at {location}',
  liveFeedAuraVrStarted: '✨ Aura VR started for property at {location}',
  listingsFoundTitle: 'Listings found ({count})',
  listingsCardDesc:
    'Click "Call now" to start an AI call to the owner',
  eliteDealBadge: '💎 MONEY',
  topDealBadge: '🔥 TOP DEAL',
  detailModalTitle: 'Full details',
  detailModalDesc: 'Complete listing details',
  detailOwner: 'Owner',
  detailPhone: 'Phone',
  detailOwnerMaskedLabel: 'Owner',
  detailPhoneMaskedLabel: 'Phone',
  detailOwnerData: 'Owner data',
  detailUnlockAgency: 'Unlock full data with the Agency plan.',
  detailUpgradeNow: 'Upgrade now',
  virtualStagingPaywallTitle: 'Virtual Staging 3D',
  virtualStagingPaywallDesc:
    'This feature is only available for PRO and AGENCY users. Upgrade to unlock professional 3D virtual staging.',
  marketGapTitle: 'MARKET GAP',
  marketGapVs: '-{pct}% vs market',
  marketGapSubtitle:
    'Price below area average — arbitrage opportunity',
  photoAnalysisTitle: 'AI photo analysis',
  downloadInvestmentAnalysis: 'Download investment analysis',
  aiAnalysisTitle: 'AI analysis',
  aiQualityScore: 'Quality score:',
  aiNote: 'Note:',
  aiBestTimeToCall: 'Best time to call:',
  aiCallTranscript: 'Call transcript',
  seeOriginalListing: 'View original listing →',
  phoneCopiedDesc: 'Phone number copied to clipboard',
  messageCopiedDesc: 'Message copied to clipboard',
  copyMessage: 'Copy message',
  sendWhatsapp: 'Send on WhatsApp',
  smartMessageModalTitle: 'AI Smart Message',
  smartMessageModalDesc: 'WhatsApp message generated for {title}',
  generatedMessageLabel: 'Generated message:',
  manualOverrideClose: 'Close',
  manualOverrideCallNow: 'Call now',
  auraVrModalTitle: 'Aura VR Generator',
  auraVrModalDesc: 'Generate an immersive VR tour for {title}',
  priceNa: 'N/A',
  imageInsightTags: [
    'Windows need updating',
    '1970s kitchen',
    'Hardwood in great shape',
    'Bathroom needs renovation',
    'Dated electrical',
    'Roof in good condition',
  ],
};

export const prospectingPageUiIt = it;
export const prospectingPageUiEn = en;
