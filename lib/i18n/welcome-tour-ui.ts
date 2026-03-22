export type WelcomeTourUi = {
  scanSync: string;
  scanArbitrage: string;
  scanRadar: string;
  welcomeTitle: string;
  preparingDesc: string;
  /** e.g. "Trovati " / "Found " */
  dealsFoundLead: string;
  dealsFoundHighlight: string;
  /** e.g. " nella tua zona" / " in your area" */
  dealsFoundTail: string;
  dealsDesc: string;
  /** "{n}" replaced with deal number */
  dealLabel: string;
  unlockBtn: string;
  closeAria: string;
};

export const welcomeTourUiIt: WelcomeTourUi = {
  scanSync: 'Sincronizzazione con i portali globali…',
  scanArbitrage: 'Analisi arbitraggio in corso…',
  scanRadar: 'Radar competitor attivato…',
  welcomeTitle: 'Benvenuto nel futuro del real estate',
  preparingDesc: 'Stiamo preparando il tuo Command Center',
  dealsFoundLead: 'Trovati ',
  dealsFoundHighlight: '3 deal oro',
  dealsFoundTail: ' nella tua zona',
  dealsDesc:
    'Il sistema ha già scansionato i portali e trovato opportunità con market gap significativo.',
  dealLabel: 'Deal #{n}',
  unlockBtn: 'Clicca per sbloccare la tua prima provvigione',
  closeAria: 'Chiudi',
};

export const welcomeTourUiEn: WelcomeTourUi = {
  scanSync: 'Syncing with global portals…',
  scanArbitrage: 'Running arbitrage analysis…',
  scanRadar: 'Competitor radar activated…',
  welcomeTitle: 'Welcome to the future of real estate',
  preparingDesc: "We're preparing your Command Center",
  dealsFoundLead: 'Found ',
  dealsFoundHighlight: '3 gold deals',
  dealsFoundTail: ' in your area',
  dealsDesc:
    'The system has already scanned the portals and found opportunities with significant market gap.',
  dealLabel: 'Deal #{n}',
  unlockBtn: 'Click to unlock your first commission',
  closeAria: 'Close',
};
