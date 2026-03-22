/** Copy for `/dashboard/packages` — premium one-time packages + purchase history. IT + EN. */
export type PackagesPageUi = {
  purchaseComplete: string;
  purchaseCompleteDesc: string;
  purchaseCanceled: string;
  purchaseCanceledDesc: string;
  checkoutError: string;
  pageTitle: string;
  pageDesc: string;
  tabPackages: string;
  tabPurchases: string;
  oneTime: string;
  setupComplete: string;
  onboarding: string;
  premiumSupport: string;
  included: string;
  purchasedOn: string;
  active: string;
  processing: string;
  buyAgencyBoost: string;
  noPurchases: string;
  noPurchasesDesc: string;
  explorePackages: string;
  packageScale: string;
  featureSetup: string;
  featureLeads: string;
  featureFollowUp: string;
  featureTraining: string;
  /** Agency Boost card (Stripe package; UI layer i18n) */
  boostName: string;
  boostTagline: string;
  boostFeatures: [string, string, string];
  planAgency: string;
  planPro: string;
  planStarter: string;
  planFree: string;
  /** Purchase card badge when status !== completed */
  statusPending: string;
  statusFailed: string;
};

const it: PackagesPageUi = {
  purchaseComplete: 'Acquisto completato!',
  purchaseCompleteDesc:
    'Grazie per aver acquistato Agency Boost. Trovi i dettagli nei tuoi acquisti.',
  purchaseCanceled: 'Acquisto annullato',
  purchaseCanceledDesc:
    'Il pagamento è stato annullato. Puoi riprovare quando vuoi.',
  checkoutError: 'Impossibile avviare il checkout',
  pageTitle: 'Pacchetti premium',
  pageDesc: "Soluzioni complete per scalare la tua agenzia con l'AI",
  tabPackages: 'Pacchetti',
  tabPurchases: 'I miei acquisti',
  oneTime: 'una tantum',
  setupComplete: 'Setup completo',
  onboarding: 'Onboarding',
  premiumSupport: 'Supporto premium',
  included: 'Incluso',
  purchasedOn: 'Acquistato il',
  active: 'Attivo',
  processing: 'Elaborazione…',
  buyAgencyBoost: 'Acquista Agency Boost',
  noPurchases: 'Nessun acquisto',
  noPurchasesDesc:
    'Non hai ancora acquistato nessun pacchetto premium.',
  explorePackages: 'Esplora i pacchetti',
  packageScale: 'Pacchetto Scala in 7 giorni',
  featureSetup: 'Setup completo CRM + automazioni',
  featureLeads: '10 moduli acquisizione lead',
  featureFollowUp: '3 script follow-up personalizzati',
  featureTraining: '1 ora formazione video + consulenza 1:1',
  boostName: 'Agency Boost',
  boostTagline: 'Pacchetto setup chiavi in mano',
  boostFeatures: [
    'Setup completo «done-for-you»',
    'Implementazione e onboarding guidato',
    'Supporto premium per il lancio',
  ],
  planAgency: 'Agency',
  planPro: 'Pro',
  planStarter: 'Starter',
  planFree: 'Free',
  statusPending: 'In sospeso',
  statusFailed: 'Non riuscito',
};

const en: PackagesPageUi = {
  purchaseComplete: 'Purchase complete!',
  purchaseCompleteDesc:
    'Thank you for purchasing Agency Boost. Find the details under My purchases.',
  purchaseCanceled: 'Purchase canceled',
  purchaseCanceledDesc:
    'The payment was canceled. You can try again whenever you want.',
  checkoutError: 'Cannot start checkout',
  pageTitle: 'Premium packages',
  pageDesc: 'Complete solutions to scale your agency with AI',
  tabPackages: 'Packages',
  tabPurchases: 'My purchases',
  oneTime: 'one-time',
  setupComplete: 'Complete setup',
  onboarding: 'Onboarding',
  premiumSupport: 'Premium support',
  included: 'Included',
  purchasedOn: 'Purchased on',
  active: 'Active',
  processing: 'Processing…',
  buyAgencyBoost: 'Buy Agency Boost',
  noPurchases: 'No purchases',
  noPurchasesDesc: "You haven't purchased any premium packages yet.",
  explorePackages: 'Explore packages',
  packageScale: 'Scale in 7 days package',
  featureSetup: 'Full CRM setup + automations',
  featureLeads: '10 lead acquisition modules',
  featureFollowUp: '3 personalized follow-up scripts',
  featureTraining: '1 hour video training + 1:1 consulting',
  boostName: 'Agency Boost',
  boostTagline: 'Done-for-you setup package',
  boostFeatures: [
    'Full “done-for-you” setup',
    'Guided implementation and onboarding',
    'Premium launch support',
  ],
  planAgency: 'Agency',
  planPro: 'Pro',
  planStarter: 'Starter',
  planFree: 'Free',
  statusPending: 'Pending',
  statusFailed: 'Failed',
};

export const packagesPageUiIt = it;
export const packagesPageUiEn = en;
