/** Strings for `components/pending-checkout-banner.tsx`. IT + EN. */

export type PendingCheckoutUi = {
  planNames: {
    starter: string;
    pro: string;
    agency: string;
    boost: string;
  };
  syncError: string;
  syncDone: string;
  /** replace('{plan}', plan label e.g. PRO) */
  syncPlan: string;
  errorTitle: string;
  invalidPlan: string;
  checkoutError: string;
  checkoutUrlMissing: string;
  paymentError: string;
  closeLabel: string;
  /** replace('{name}', plan display name) */
  activatePlan: string;
  /** replace('{name}', '{price}') */
  activateDesc: string;
  loading: string;
  goToPayment: string;
  syncing: string;
  alreadyPaid: string;
};

const it: PendingCheckoutUi = {
  planNames: {
    starter: 'Starter',
    pro: 'Pro',
    agency: 'Agency',
    boost: 'Agency Boost',
  },
  syncError: 'Errore durante la sincronizzazione',
  syncDone: 'Sincronizzazione completata!',
  syncPlan: 'Piano attuale: {plan}',
  errorTitle: 'Errore',
  invalidPlan: 'Piano non valido',
  checkoutError: 'Errore durante la creazione del checkout',
  checkoutUrlMissing: 'URL checkout non ricevuto',
  paymentError: 'Impossibile avviare il pagamento',
  closeLabel: 'Chiudi',
  activatePlan: "Completa l'attivazione del piano {name}",
  activateDesc:
    'Hai selezionato il piano {name} ({price}). Clicca il pulsante per completare il pagamento e attivare tutte le funzionalità.',
  loading: 'Caricamento…',
  goToPayment: 'Vai al pagamento',
  syncing: 'Sincronizzazione…',
  alreadyPaid: 'Già pagato? Sincronizza',
};

const en: PendingCheckoutUi = {
  planNames: {
    starter: 'Starter',
    pro: 'Pro',
    agency: 'Agency',
    boost: 'Agency Boost',
  },
  syncError: 'Error during synchronization',
  syncDone: 'Sync completed!',
  syncPlan: 'Current plan: {plan}',
  errorTitle: 'Error',
  invalidPlan: 'Invalid plan',
  checkoutError: 'Error creating checkout',
  checkoutUrlMissing: 'Checkout URL not received',
  paymentError: 'Unable to start payment',
  closeLabel: 'Close',
  activatePlan: 'Complete {name} plan activation',
  activateDesc:
    'You selected the {name} plan ({price}). Click the button to complete payment and activate all features.',
  loading: 'Loading…',
  goToPayment: 'Go to payment',
  syncing: 'Syncing…',
  alreadyPaid: 'Already paid? Sync',
};

export const pendingCheckoutUiIt = it;
export const pendingCheckoutUiEn = en;
