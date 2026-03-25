export type RefundProcessStepUi = { step: string; title: string; body: string };

export type RefundPolicyPageUi = {
  title: string;
  highlight: string;
  updated: string;
  guaranteeTitle: string;
  guaranteeBodyStart: string;
  guaranteeBodyStrong: string;
  guaranteeBodyEnd: string;
  trialTitle: string;
  freeTrialTitle: string;
  freeTrialBody: string;
  guarantee14Title: string;
  guarantee14Body: string;
  conditionsTitle: string;
  conditionsIntro: string;
  conditions: string[];
  nonRefundableTitle: string;
  nonRefundableIntro: string;
  nonRefundable: string[];
  cancelTitle: string;
  cancelIntro: string;
  cancelSteps: string[];
  cancelImportant: string;
  cancelImportantBody: string;
  processTitle: string;
  process: RefundProcessStepUi[];
  boostTitle: string;
  boostIntro: string;
  boostProductLabel: string;
  boostBody: string;
  boostRules: string[];
  contactTitle: string;
  contactIntro: string;
  refundEmail: string;
  supportEmail: string;
  contactOutro: string;
  terms: string;
  privacy: string;
  pricing: string;
};

export const refundPolicyPageUiIt: RefundPolicyPageUi = {
  title: 'Politica di',
  highlight: 'Rimborso',
  updated: 'Ultimo aggiornamento: dicembre 2024',
  guaranteeTitle: 'La nostra garanzia',
  guaranteeBodyStart: 'Siamo sicuri della qualità di PropertyPilot AI. Per questo offriamo una',
  guaranteeBodyStrong: 'garanzia soddisfatti o rimborsati di 14 giorni',
  guaranteeBodyEnd: 'su tutti i nuovi abbonamenti. Se non sei soddisfatto, ti rimborsiamo senza fare domande.',
  trialTitle: '1. Periodo di prova e rimborso',
  freeTrialTitle: 'Prova gratuita 7 giorni',
  freeTrialBody:
    'Tutti i piani includono 7 giorni di prova gratuita. Nessuna carta di credito richiesta per iniziare. Puoi annullare in qualsiasi momento durante il periodo di prova senza alcun addebito.',
  guarantee14Title: 'Garanzia 14 giorni',
  guarantee14Body:
    'Se dopo la prova attivi un abbonamento e non sei soddisfatto, puoi richiedere un rimborso completo entro 14 giorni dalla data del primo pagamento.',
  conditionsTitle: '2. Condizioni per il rimborso',
  conditionsIntro: 'Per ottenere un rimborso devi:',
  conditions: [
    'Richiedere il rimborso entro 14 giorni dal primo pagamento',
    'Essere alla prima sottoscrizione (non si applica ai rinnovi)',
    'Non aver violato i Termini di servizio',
    'Contattarci via email con la richiesta',
  ],
  nonRefundableTitle: '3. Casi non rimborsabili',
  nonRefundableIntro: 'Il rimborso non è applicabile nei seguenti casi:',
  nonRefundable: [
    'Richiesta dopo 14 giorni dal pagamento',
    'Rinnovi automatici (puoi cancellare prima del rinnovo)',
    'Pacchetto Agency Boost (servizio one-time già erogato)',
    'Account sospesi per violazione dei termini',
    'Abbonamenti precedenti già rimborsati',
  ],
  cancelTitle: '4. Cancellazione abbonamento',
  cancelIntro: 'Puoi cancellare il tuo abbonamento in qualsiasi momento:',
  cancelSteps: [
    'Accedi alla tua dashboard',
    'Vai alla sezione «Billing» o «Abbonamento»',
    'Clicca su «Cancella abbonamento»',
    'Conferma la cancellazione',
  ],
  cancelImportant: 'Importante:',
  cancelImportantBody:
    'La cancellazione avrà effetto alla fine del periodo di fatturazione corrente. Continuerai ad avere accesso al servizio fino a quella data.',
  processTitle: '5. Processo di rimborso',
  process: [
    {
      step: '1',
      title: 'Invia la richiesta',
      body: 'Contattaci via email con oggetto «Richiesta rimborso» specificando il tuo account.',
    },
    {
      step: '2',
      title: 'Verifica',
      body: 'Verificheremo che la richiesta rispetti le condizioni (1–2 giorni lavorativi).',
    },
    {
      step: '3',
      title: 'Elaborazione',
      body: 'Il rimborso viene elaborato tramite Stripe (5–10 giorni per apparire sul conto).',
    },
    {
      step: '✓',
      title: 'Completato',
      body: 'Riceverai conferma via email quando il rimborso sarà processato.',
    },
  ],
  boostTitle: '6. Agency Boost — politica speciale',
  boostIntro: 'Il pacchetto',
  boostProductLabel: 'Agency Boost (EUR 2.497)',
  boostBody: 'è un servizio one-time di implementazione personalizzata. Data la natura del servizio:',
  boostRules: [
    "Non è rimborsabile una volta iniziata l'implementazione",
    'È possibile annullare entro 48 ore dall’ordine se il lavoro non è ancora iniziato',
    'Eventuali problemi verranno risolti con supporto aggiuntivo gratuito',
  ],
  contactTitle: '7. Contattaci',
  contactIntro: 'Per richieste di rimborso o domande:',
  refundEmail: 'Email rimborsi:',
  supportEmail: 'Supporto generale:',
  contactOutro: 'Rispondiamo a tutte le richieste entro 24–48 ore lavorative.',
  terms: 'Termini e Condizioni',
  privacy: 'Privacy Policy',
  pricing: 'Vedi i piani',
};

export const refundPolicyPageUiEn: RefundPolicyPageUi = {
  title: 'Refund',
  highlight: 'Policy',
  updated: 'Last updated: December 2024',
  guaranteeTitle: 'Our guarantee',
  guaranteeBodyStart: 'We are confident in the quality of PropertyPilot AI. That is why we offer a',
  guaranteeBodyStrong: '14-day money-back guarantee',
  guaranteeBodyEnd: 'on all new subscriptions. If you are not satisfied, we will refund you with no hassle.',
  trialTitle: '1. Trial and refund window',
  freeTrialTitle: '7-day free trial',
  freeTrialBody:
    'All plans include a 7-day free trial. No credit card required to get started. You can cancel at any time during the trial period with no charge.',
  guarantee14Title: '14-day guarantee',
  guarantee14Body:
    'If you activate a subscription after the trial and you are not satisfied, you can request a full refund within 14 days of the first payment date.',
  conditionsTitle: '2. Refund conditions',
  conditionsIntro: 'To obtain a refund you must:',
  conditions: [
    'Request the refund within 14 days of the first payment',
    'Be on your first subscription term (renewals are excluded)',
    'Not have violated the Terms of Service',
    'Contact us by email with the request',
  ],
  nonRefundableTitle: '3. Non-refundable cases',
  nonRefundableIntro: 'Refunds do not apply in the following cases:',
  nonRefundable: [
    'Request submitted after 14 days from payment',
    'Automatic renewals (you can cancel before renewal)',
    'Agency Boost package (one-time service already delivered)',
    'Accounts suspended for terms violations',
    'Previous subscriptions already refunded',
  ],
  cancelTitle: '4. Subscription cancellation',
  cancelIntro: 'You can cancel your subscription at any time:',
  cancelSteps: [
    'Log in to your dashboard',
    'Go to the Billing or Subscription section',
    'Click Cancel subscription',
    'Confirm the cancellation',
  ],
  cancelImportant: 'Important:',
  cancelImportantBody:
    'Cancellation takes effect at the end of the current billing period. You will keep access to the service until that date.',
  processTitle: '5. Refund process',
  process: [
    {
      step: '1',
      title: 'Send the request',
      body: 'Contact us by email with the subject "Refund Request" and specify your account.',
    },
    {
      step: '2',
      title: 'Verification',
      body: 'We will verify that the request meets the conditions (1–2 business days).',
    },
    {
      step: '3',
      title: 'Processing',
      body: 'The refund is processed through Stripe (5–10 days to appear in your account).',
    },
    {
      step: '✓',
      title: 'Completed',
      body: 'You will receive an email confirmation when the refund has been processed.',
    },
  ],
  boostTitle: '6. Agency Boost — special policy',
  boostIntro: 'The',
  boostProductLabel: 'Agency Boost (EUR 2,497)',
  boostBody: 'package is a one-time personalized implementation service. Because of the nature of the service:',
  boostRules: [
    'It is not refundable once implementation has started',
    'It can be canceled within 48 hours of the order if work has not started yet',
    'Any delivery issues will be resolved with additional support at no extra cost',
  ],
  contactTitle: '7. Contact us',
  contactIntro: 'For refund requests or questions:',
  refundEmail: 'Refund email:',
  supportEmail: 'General support:',
  contactOutro: 'We reply to all requests within 24–48 business hours.',
  terms: 'Terms and Conditions',
  privacy: 'Privacy Policy',
  pricing: 'View pricing',
};
