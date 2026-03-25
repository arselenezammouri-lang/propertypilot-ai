/** Prospecting modals & AI X-Ray — IT/EN base bundles */

export type PriceDropSniperUi = {
  chartLabel30dAgo: string;
  chartLabel15dAgo: string;
  chartLabelToday: string;
  /** Placeholders: {owner}, {location}, {price} */
  scriptTemplate: string;
  toastCopyTitle: string;
  toastCopyDesc: string;
  toastErrorTitle: string;
  toastErrorDesc: string;
  dialogTitle: string;
  dialogDescription: string;
  locationLabel: string;
  currentPrice: string;
  priceVariation: string;
  callScriptTitle: string;
  copy: string;
  copied: string;
  close: string;
  launchCall: string;
  ownerFallback: string;
};

export type InvestmentAnalysisUi = {
  dialogTitle: string;
  purchasePrice: string;
  /** `{pct}` */
  marketVsLine: string;
  renovationTitle: string;
  renovationHint: string;
  resaleTitle: string;
  resaleHint: string;
  roiTitle: string;
  totalInvestment: string;
  potentialProfit: string;
  disclaimerLead: string;
  disclaimer: string;
  close: string;
  download: string;
  exportHeader: string;
  exportPropertyLine: string;
  exportLocationLine: string;
  exportPurchase: string;
  exportRenovation: string;
  exportTotalInv: string;
  exportResale: string;
  exportProfit: string;
  exportRoi: string;
  downloadFilenamePrefix: string;
};

export type WhatsAppSenderUi = {
  dialogTitle: string;
  /** Preview line: `{owner}` = owner name or descriptionOwnerFallback */
  description: string;
  descriptionOwnerFallback: string;
  /** Salutation in message body when name missing */
  messageOwnerFallback: string;
  previewLabel: string;
  copy: string;
  copied: string;
  recipient: string;
  phone: string;
  noteLead: string;
  note: string;
  cancel: string;
  openWhatsApp: string;
  clipboardErrorTitle: string;
  clipboardErrorDesc: string;
  /** `{owner}`, `{agentName}`, `{location}` */
  messageTemplate: string;
};

export type AIXRayVisionUi = {
  toastNoImageTitle: string;
  toastNoImageDesc: string;
  toastCompleteTitle: string;
  /** `{count}` */
  toastCompleteDesc: string;
  toastCalibrationTitle: string;
  toastCalibrationDesc: string;
  title: string;
  subtitle: string;
  scanning: string;
  startScan: string;
  propertyImageAlt: string;
  scanInProgress: string;
  estimatedCostPrefix: string;
  valueAddedPrefix: string;
  confidenceLabel: string;
  ariaInsight: string;
  renovationBudgetTitle: string;
  priorityHigh: string;
  priorityMedium: string;
  priorityLow: string;
  total: string;
  estimatedRoi: string;
  estimatedTime: string;
};

export type TerritoryCommanderLabelsUi = {
  cardTitle: string;
  demandPulse: string;
  demandLevelLabel: string;
  demandScoreLabel: string;
  trendLabel: string;
  trendUp: string;
  trendDown: string;
  trendStable: string;
  neighborhoodDna: string;
  strengths: string;
  weaknesses: string;
  overallDnaScore: string;
  soldVelocity: string;
  avgSaleTime: string;
  days: string;
  category: string;
  vsCityAvg: string;
  cityAverage: string;
  neighborhoodAverage: string;
  fasterThanCity: string;
  slowerThanCity: string;
  inlineWithCity: string;
  commercialIntel: string;
  recommendedTargets: string;
  marketGaps: string;
  footTraffic: string;
  competitionLevel: string;
  ariaMarketInsight: string;
  ariaStrategyTitle: string;
  high: string;
  medium: string;
  low: string;
  demandHot: string;
  demandWarm: string;
  demandCold: string;
  velocityUltraFast: string;
  velocityFast: string;
  velocityNormal: string;
  velocitySlow: string;
  velocityVerySlow: string;
  categoryEducation: string;
  categoryTransport: string;
  categoryGreen: string;
  categoryBusiness: string;
  categorySecurity: string;
};

/** Premium Investor Report modal + printable HTML */
export type PremiumInvestorReportUi = {
  dialogTitle: string;
  dialogDescription: string;
  previewHeading: string;
  printReadyBadge: string;
  reportSubtitle: string;
  priceLabel: string;
  priceTbd: string;
  /** `{pct}` numeric, no % sign in placeholder (component adds) */
  opportunityLine: string;
  advantagesHeading: string;
  considerationsHeading: string;
  virtualStagingAvailable: string;
  personalNotePreviewLabel: string;
  personalNoteLabel: string;
  personalNotePlaceholder: string;
  cancel: string;
  generatePdf: string;
  generating: string;
  toastSuccessTitle: string;
  toastSuccessDesc: string;
  toastErrorTitle: string;
  toastErrorDesc: string;
  downloadFilenamePrefix: string;
  htmlTitle: string;
  /** `{pct}` */
  htmlOpportunity: string;
  htmlSectionAdvantages: string;
  htmlSectionConsiderations: string;
  htmlVirtualStaging: string;
  htmlPersonalNoteLabel: string;
  /** `{date}` locale-formatted */
  htmlFooterGenerated: string;
  /** `{url}` */
  htmlFooterMoreInfo: string;
};

export type ProspectingModalsUiBundle = {
  priceDropSniper: PriceDropSniperUi;
  investmentAnalysis: InvestmentAnalysisUi;
  whatsappSender: WhatsAppSenderUi;
  aiXRayVision: AIXRayVisionUi;
  territoryCommanderLabels: TerritoryCommanderLabelsUi;
  premiumInvestorReport: PremiumInvestorReportUi;
};

export const prospectingModalsUiIt: ProspectingModalsUiBundle = {
  priceDropSniper: {
    chartLabel30dAgo: '30gg fa',
    chartLabel15dAgo: '15gg fa',
    chartLabelToday: 'Oggi',
    scriptTemplate: `Buongiorno {owner}, sono [Tuo Nome], agente immobiliare di PropertyPilot AI.

Ho visto che ha riposizionato l'immobile a {location} sul mercato a {price}.

Ho un cliente che cercava proprio a questa nuova cifra e potrebbe essere molto interessato. Sarebbe disponibile per una visita rapida questa settimana?

Vorremmo anche discutere un'opportunità di mandato esclusivo per accelerare la vendita.`,
    toastCopyTitle: 'Script copiato!',
    toastCopyDesc: 'Pronto per la chiamata',
    toastErrorTitle: 'Errore',
    toastErrorDesc: 'Impossibile copiare',
    dialogTitle: 'Sniper Alert - Ribasso rilevato',
    dialogDescription: 'Opportunità di attacco immediato',
    locationLabel: 'Location',
    currentPrice: 'Prezzo attuale',
    priceVariation: 'Variazione prezzo',
    callScriptTitle: 'Script di chiamata aggiornato',
    copy: 'Copia',
    copied: 'Copiato',
    close: 'Chiudi',
    launchCall: 'Lancia chiamata Sniper',
    ownerFallback: 'Signore/Signora',
  },
  investmentAnalysis: {
    dialogTitle: 'Analisi investimento',
    purchasePrice: "Prezzo d'acquisto",
    marketVsLine: '-{pct}% vs mercato',
    renovationTitle: 'Costi di ristrutturazione stimati',
    renovationHint:
      "Stima basata su analisi AI delle foto e caratteristiche dell'immobile",
    resaleTitle: 'Prezzo di rivendita stimato',
    resaleHint:
      'Basato su media di mercato della zona e potenziale post-ristrutturazione',
    roiTitle: 'ROI potenziale',
    totalInvestment: 'Investimento totale',
    potentialProfit: 'Profitto potenziale',
    disclaimerLead: 'Nota:',
    disclaimer:
      "Questa analisi è generata automaticamente da AI basandosi su dati di mercato e caratteristiche dell'immobile. I valori sono stime e possono variare in base a condizioni di mercato, costi effettivi di ristrutturazione e altri fattori. Si consiglia sempre una valutazione professionale approfondita prima di procedere.",
    close: 'Chiudi',
    download: 'Scarica analisi',
    exportHeader: 'ANALISI INVESTIMENTO IMMOBILIARE',
    exportPropertyLine: 'Immobile:',
    exportLocationLine: 'Location:',
    exportPurchase: "Prezzo d'acquisto:",
    exportRenovation: 'Costi di ristrutturazione:',
    exportTotalInv: 'Investimento totale:',
    exportResale: 'Prezzo di rivendita stimato:',
    exportProfit: 'Profitto potenziale:',
    exportRoi: 'ROI POTENZIALE:',
    downloadFilenamePrefix: 'analisi-investimento-',
  },
  whatsappSender: {
    dialogTitle: 'Invia progetto via WhatsApp',
    description: 'Anteprima del messaggio che verrà inviato a {owner}',
    descriptionOwnerFallback: 'il proprietario',
    messageOwnerFallback: 'Signore/Signora',
    previewLabel: 'Anteprima messaggio',
    copy: 'Copia',
    copied: 'Copiato',
    recipient: 'Destinatario',
    phone: 'Telefono',
    noteLead: 'Nota:',
    note: 'Cliccando «Apri WhatsApp», si aprirà l\'app con il messaggio precompilato. Il destinatario dovrà confermare l\'invio.',
    cancel: 'Annulla',
    openWhatsApp: 'Apri WhatsApp',
    clipboardErrorTitle: 'Errore',
    clipboardErrorDesc: 'Impossibile copiare il messaggio.',
    messageTemplate: `Ciao {owner}, sono {agentName}, agente immobiliare di PropertyPilot AI.

Ho sviluppato una visione 3D per il tuo immobile in {location} che mostra il potenziale post-ristrutturazione.

Vorrei condividere con te questo progetto personalizzato. Saresti disponibile per una breve chiamata questa settimana per discuterne?

Cordiali saluti,
{agentName}
PropertyPilot AI`,
  },
  aiXRayVision: {
    toastNoImageTitle: 'Errore',
    toastNoImageDesc: 'Nessuna immagine disponibile',
    toastCompleteTitle: 'Analisi completata',
    toastCompleteDesc: 'Rilevati {count} elementi',
    toastCalibrationTitle: 'Ricalibrazione sensori',
    toastCalibrationDesc:
      'Aria sta ricalibrando i sensori X-Ray Vision. Riprova tra un istante.',
    title: 'Analisi tecnica immagini IA',
    subtitle: 'X-Ray Vision — rilevazione difetti e pregi',
    scanning: 'Scansione...',
    startScan: 'Avvia scansione',
    propertyImageAlt: 'Immobile',
    scanInProgress: 'Scansione in corso...',
    estimatedCostPrefix: 'Costo stimato:',
    valueAddedPrefix: 'Valore aggiunto:',
    confidenceLabel: 'Confidenza:',
    ariaInsight: 'Aria Insight',
    renovationBudgetTitle: 'Budget riqualificazione consigliato',
    priorityHigh: 'Alta',
    priorityMedium: 'Media',
    priorityLow: 'Bassa',
    total: 'Totale',
    estimatedRoi: 'ROI stimato:',
    estimatedTime: 'Tempo stimato:',
  },
  territoryCommanderLabels: {
    cardTitle: 'Analisi del territorio e domanda',
    demandPulse: 'Demand Pulse',
    demandLevelLabel: 'Livello domanda',
    demandScoreLabel: 'Livello di domanda',
    trendLabel: 'Trend:',
    trendUp: 'In crescita',
    trendDown: 'In calo',
    trendStable: 'Stabile',
    neighborhoodDna: 'Neighborhood DNA',
    strengths: 'Punti di forza',
    weaknesses: 'Punti deboli',
    overallDnaScore: 'DNA score complessivo',
    soldVelocity: 'Sold Velocity Tracker',
    avgSaleTime: 'Tempo medio vendita',
    days: 'giorni',
    category: 'Categoria',
    vsCityAvg: 'Confronto con media città',
    cityAverage: 'Media città',
    neighborhoodAverage: 'Media quartiere',
    fasterThanCity: 'Più veloce della media città',
    slowerThanCity: 'Più lento della media città',
    inlineWithCity: 'In linea con la media città',
    commercialIntel: 'Commercial Intelligence',
    recommendedTargets: 'Target di attività consigliato',
    marketGaps: 'Gap di mercato',
    footTraffic: 'Passaggio pedonale',
    competitionLevel: 'Livello competizione',
    ariaMarketInsight: 'Aria Market Insight',
    ariaStrategyTitle: 'Aria Strategy — pitch di quartiere',
    high: 'Alto',
    medium: 'Medio',
    low: 'Basso',
    demandHot: 'HOT',
    demandWarm: 'WARM',
    demandCold: 'COLD',
    velocityUltraFast: 'Ultra veloce',
    velocityFast: 'Veloce',
    velocityNormal: 'Normale',
    velocitySlow: 'Lenta',
    velocityVerySlow: 'Molto lenta',
    categoryEducation: 'Istruzione',
    categoryTransport: 'Trasporti',
    categoryGreen: 'Verde',
    categoryBusiness: 'Business',
    categorySecurity: 'Sicurezza',
  },
  premiumInvestorReport: {
    dialogTitle: 'Report investitore premium',
    dialogDescription: "Anteprima del report per l'investitore",
    previewHeading: 'Anteprima report',
    printReadyBadge: 'Pronto per la stampa',
    reportSubtitle: 'Premium Investor Report',
    priceLabel: 'Prezzo:',
    priceTbd: 'Prezzo da definire',
    opportunityLine: 'Opportunità: −{pct}% rispetto alla media di mercato',
    advantagesHeading: 'Vantaggi',
    considerationsHeading: 'Da considerare',
    virtualStagingAvailable: 'Virtual Staging 3D disponibile',
    personalNotePreviewLabel: 'Nota personale:',
    personalNoteLabel: 'Nota personale (opzionale)',
    personalNotePlaceholder: 'Es.: «Marco, questo è perfetto per te!»',
    cancel: 'Annulla',
    generatePdf: 'Genera report PDF',
    generating: 'Generazione…',
    toastSuccessTitle: 'Report generato',
    toastSuccessDesc: 'Il report è stato aperto per stampa o salvataggio',
    toastErrorTitle: 'Errore',
    toastErrorDesc: 'Impossibile generare il report',
    downloadFilenamePrefix: 'Report_',
    htmlTitle: 'Report investitore premium',
    htmlOpportunity: 'Opportunità di arbitraggio: −{pct}% rispetto alla media di mercato',
    htmlSectionAdvantages: 'Vantaggi',
    htmlSectionConsiderations: 'Da considerare',
    htmlVirtualStaging:
      'Virtual Staging 3D disponibile — contatta per la visualizzazione',
    htmlPersonalNoteLabel: 'Nota personale',
    htmlFooterGenerated: 'Report generato da PropertyPilot AI — {date}',
    htmlFooterMoreInfo: 'Ulteriori informazioni: {url}',
  },
};

export const prospectingModalsUiEn: ProspectingModalsUiBundle = {
  priceDropSniper: {
    chartLabel30dAgo: '30d ago',
    chartLabel15dAgo: '15d ago',
    chartLabelToday: 'Today',
    scriptTemplate: `Good morning {owner}, this is [Your Name], real estate advisor with PropertyPilot AI.

I noticed you repositioned the property in {location} on the market at {price}.

I have a buyer who was looking right around this new price point and may be very interested. Would you be available for a quick viewing this week?

We could also discuss an exclusive listing agreement to accelerate the sale.`,
    toastCopyTitle: 'Script copied',
    toastCopyDesc: 'Ready for your call',
    toastErrorTitle: 'Error',
    toastErrorDesc: 'Could not copy',
    dialogTitle: 'Sniper alert — price drop detected',
    dialogDescription: 'Immediate outreach opportunity',
    locationLabel: 'Location',
    currentPrice: 'Current price',
    priceVariation: 'Price change',
    callScriptTitle: 'Updated call script',
    copy: 'Copy',
    copied: 'Copied',
    close: 'Close',
    launchCall: 'Launch Sniper call',
    ownerFallback: 'Sir/Madam',
  },
  investmentAnalysis: {
    dialogTitle: 'Investment analysis',
    purchasePrice: 'Purchase price',
    marketVsLine: '-{pct}% vs market',
    renovationTitle: 'Estimated renovation costs',
    renovationHint: 'Estimate based on AI review of photos and property characteristics',
    resaleTitle: 'Estimated resale price',
    resaleHint: 'Based on local market averages and post-renovation potential',
    roiTitle: 'Potential ROI',
    totalInvestment: 'Total investment',
    potentialProfit: 'Potential profit',
    disclaimerLead: 'Note:',
    disclaimer:
      'This analysis is generated automatically from market data and listing characteristics. Figures are estimates and may vary with market conditions, actual renovation costs, and other factors. Always seek professional advice before proceeding.',
    close: 'Close',
    download: 'Download analysis',
    exportHeader: 'REAL ESTATE INVESTMENT ANALYSIS',
    exportPropertyLine: 'Property:',
    exportLocationLine: 'Location:',
    exportPurchase: 'Purchase price:',
    exportRenovation: 'Renovation costs:',
    exportTotalInv: 'Total investment:',
    exportResale: 'Estimated resale price:',
    exportProfit: 'Potential profit:',
    exportRoi: 'POTENTIAL ROI:',
    downloadFilenamePrefix: 'investment-analysis-',
  },
  whatsappSender: {
    dialogTitle: 'Send project via WhatsApp',
    description: 'Preview of the message that will be sent to {owner}',
    descriptionOwnerFallback: 'the owner',
    messageOwnerFallback: 'Sir/Madam',
    previewLabel: 'Message preview',
    copy: 'Copy',
    copied: 'Copied',
    recipient: 'Recipient',
    phone: 'Phone',
    noteLead: 'Note:',
    note: 'When you tap “Open WhatsApp”, the app opens with a pre-filled message. The recipient must confirm sending.',
    cancel: 'Cancel',
    openWhatsApp: 'Open WhatsApp',
    clipboardErrorTitle: 'Error',
    clipboardErrorDesc: 'Could not copy the message.',
    messageTemplate: `Hi {owner}, I'm {agentName}, a real estate advisor with PropertyPilot AI.

I've prepared a 3D vision for your property in {location} showing post-renovation potential.

I'd love to share this tailored project with you. Would you have time for a short call this week?

Best regards,
{agentName}
PropertyPilot AI`,
  },
  aiXRayVision: {
    toastNoImageTitle: 'Error',
    toastNoImageDesc: 'No image available',
    toastCompleteTitle: 'Analysis complete',
    toastCompleteDesc: 'Detected {count} items',
    toastCalibrationTitle: 'Recalibrating sensors',
    toastCalibrationDesc:
      'Aria is recalibrating X-Ray Vision sensors. Please try again in a moment.',
    title: 'AI technical image analysis',
    subtitle: 'X-Ray Vision — defects and highlights',
    scanning: 'Scanning...',
    startScan: 'Start scan',
    propertyImageAlt: 'Property',
    scanInProgress: 'Scan in progress...',
    estimatedCostPrefix: 'Estimated cost:',
    valueAddedPrefix: 'Value add:',
    confidenceLabel: 'Confidence:',
    ariaInsight: 'Aria Insight',
    renovationBudgetTitle: 'Suggested renovation budget',
    priorityHigh: 'High',
    priorityMedium: 'Medium',
    priorityLow: 'Low',
    total: 'Total',
    estimatedRoi: 'Estimated ROI:',
    estimatedTime: 'Estimated time:',
  },
  territoryCommanderLabels: {
    cardTitle: 'Territory & demand analysis',
    demandPulse: 'Demand pulse',
    demandLevelLabel: 'Demand level',
    demandScoreLabel: 'Demand score',
    trendLabel: 'Trend:',
    trendUp: 'Rising',
    trendDown: 'Falling',
    trendStable: 'Stable',
    neighborhoodDna: 'Neighborhood DNA',
    strengths: 'Strengths',
    weaknesses: 'Weaknesses',
    overallDnaScore: 'Overall DNA score',
    soldVelocity: 'Sold velocity tracker',
    avgSaleTime: 'Average time to sale',
    days: 'days',
    category: 'Category',
    vsCityAvg: 'vs city average',
    cityAverage: 'City average',
    neighborhoodAverage: 'Neighborhood average',
    fasterThanCity: 'Faster than city average',
    slowerThanCity: 'Slower than city average',
    inlineWithCity: 'In line with city average',
    commercialIntel: 'Commercial intelligence',
    recommendedTargets: 'Recommended activity targets',
    marketGaps: 'Market gaps',
    footTraffic: 'Foot traffic',
    competitionLevel: 'Competition level',
    ariaMarketInsight: 'Aria Market Insight',
    ariaStrategyTitle: 'Aria Strategy — neighborhood pitch',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    demandHot: 'HOT',
    demandWarm: 'WARM',
    demandCold: 'COLD',
    velocityUltraFast: 'Ultra fast',
    velocityFast: 'Fast',
    velocityNormal: 'Normal',
    velocitySlow: 'Slow',
    velocityVerySlow: 'Very slow',
    categoryEducation: 'Education',
    categoryTransport: 'Transport',
    categoryGreen: 'Green space',
    categoryBusiness: 'Business',
    categorySecurity: 'Safety',
  },
  premiumInvestorReport: {
    dialogTitle: 'Premium investor report',
    dialogDescription: 'Preview of the report for your investor',
    previewHeading: 'Report preview',
    printReadyBadge: 'Print-ready',
    reportSubtitle: 'Premium Investor Report',
    priceLabel: 'Price:',
    priceTbd: 'Price on request',
    opportunityLine: 'Opportunity: −{pct}% vs market average',
    advantagesHeading: 'Strengths',
    considerationsHeading: 'Considerations',
    virtualStagingAvailable: '3D Virtual Staging available',
    personalNotePreviewLabel: 'Personal note:',
    personalNoteLabel: 'Personal note (optional)',
    personalNotePlaceholder: 'E.g. “Alex, this is a strong fit for your portfolio.”',
    cancel: 'Cancel',
    generatePdf: 'Generate PDF report',
    generating: 'Generating…',
    toastSuccessTitle: 'Report ready',
    toastSuccessDesc: 'The report opened for print or save',
    toastErrorTitle: 'Error',
    toastErrorDesc: 'Could not generate the report',
    downloadFilenamePrefix: 'Report_',
    htmlTitle: 'Premium investor report',
    htmlOpportunity: 'Arbitrage opportunity: −{pct}% vs market average',
    htmlSectionAdvantages: 'Strengths',
    htmlSectionConsiderations: 'Considerations',
    htmlVirtualStaging: '3D Virtual Staging available — contact for a walkthrough',
    htmlPersonalNoteLabel: 'Personal note',
    htmlFooterGenerated: 'Report generated by PropertyPilot AI — {date}',
    htmlFooterMoreInfo: 'More information: {url}',
  },
};
