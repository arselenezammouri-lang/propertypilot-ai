/** Copy for `/dashboard/settings/notifications` — AI Morning Intel. IT + EN. */
export type NotificationsSettingsPageUi = {
  pageTitle: string;
  pageSubtitle: string;
  backAria: string;
  cardTitle: string;
  cardDesc: string;
  enableLabel: string;
  enableDesc: string;
  emailLabel: string;
  emailDesc: string;
  whatsappLabel: string;
  whatsappDesc: string;
  timeLabel: string;
  timeDesc: string;
  sendTestIdle: string;
  sendTestLoading: string;
  sendTestDesc: string;
  previewTitle: string;
  previewDesc: string;
  previewHeader: string;
  previewSampleLines: string[];
  previewFooter: string;
  cancel: string;
  saveIdle: string;
  saveLoading: string;
  savedTitle: string;
  savedDesc: string;
  saveError: string;
  testSentTitle: string;
  testSentDesc: string;
  testError: string;
  testChannelsRequired: string;
  loadErrorGeneric: string;
  planAgency: string;
  planPro: string;
  planStarter: string;
  planFree: string;
};

const it: NotificationsSettingsPageUi = {
  pageTitle: 'AI Morning Intel',
  pageSubtitle: 'Configura le tue notifiche giornaliere di intelligence',
  backAria: 'Indietro',
  cardTitle: 'Briefing mattutino',
  cardDesc:
    'Ricevi ogni mattina le top 3 opportunità immobiliari della tua zona',
  enableLabel: 'Attiva AI Morning Intel',
  enableDesc: 'Ricevi un briefing quotidiano con le migliori opportunità',
  emailLabel: 'Notifica via email',
  emailDesc: 'Ricevi il briefing nella tua casella email',
  whatsappLabel: 'Notifica via WhatsApp',
  whatsappDesc: 'Ricevi il briefing direttamente su WhatsApp',
  timeLabel: 'Orario del briefing',
  timeDesc: "Scegli l'orario in cui vuoi ricevere il briefing quotidiano",
  sendTestIdle: 'Invia prova sul mio cellulare',
  sendTestLoading: 'Invio in corso…',
  sendTestDesc:
    'Ricevi subito un esempio di notifica per vedere quanto è professionale',
  previewTitle: 'Anteprima messaggio',
  previewDesc: 'Ecco come apparirà il tuo briefing mattutino',
  previewHeader: '🔥 TOP 3 OPPORTUNITÀ DI OGGI',
  previewSampleLines: [
    '• [Link report PDF 1] — Prezzo −20%',
    '• [Link report PDF 2] — Urgenza alta',
    '• [Link report PDF 3] — Target investitori',
  ],
  previewFooter:
    'Questi deal sono stati inviati anche a [X] agenzie partner nella tua zona. Affrettati!',
  cancel: 'Annulla',
  saveIdle: 'Salva impostazioni',
  saveLoading: 'Salvataggio…',
  savedTitle: 'Impostazioni salvate',
  savedDesc: 'Le tue preferenze di notifica sono state aggiornate',
  saveError: 'Impossibile salvare le impostazioni',
  testSentTitle: 'Notifica di prova inviata!',
  testSentDesc: 'Controlla la tua email e WhatsApp',
  testError: 'Impossibile inviare la notifica di prova',
  testChannelsRequired:
    'Attiva almeno email o WhatsApp per inviare una prova.',
  loadErrorGeneric: 'Impossibile caricare le notifiche.',
  planAgency: 'Agency',
  planPro: 'Pro',
  planStarter: 'Starter',
  planFree: 'Free',
};

const en: NotificationsSettingsPageUi = {
  pageTitle: 'AI Morning Intel',
  pageSubtitle: 'Configure your daily intelligence notifications',
  backAria: 'Back',
  cardTitle: 'Morning briefing',
  cardDesc: 'Receive the top 3 real estate opportunities in your area every morning',
  enableLabel: 'Enable AI Morning Intel',
  enableDesc: 'Receive a daily briefing with the best opportunities',
  emailLabel: 'Email notification',
  emailDesc: 'Receive the briefing in your inbox',
  whatsappLabel: 'WhatsApp notification',
  whatsappDesc: 'Receive the briefing directly on WhatsApp',
  timeLabel: 'Briefing time',
  timeDesc: 'Choose when you want to receive the daily briefing',
  sendTestIdle: 'Send test to my phone',
  sendTestLoading: 'Sending…',
  sendTestDesc:
    'Get a sample notification now to see how professional it looks',
  previewTitle: 'Message preview',
  previewDesc: 'This is how your morning briefing will appear',
  previewHeader: '🔥 TOP 3 OPPORTUNITIES TODAY',
  previewSampleLines: [
    '• [PDF report link 1] — Price −20%',
    '• [PDF report link 2] — High urgency',
    '• [PDF report link 3] — Investor target',
  ],
  previewFooter:
    'These deals have also been sent to [X] partner agencies in your area. Hurry!',
  cancel: 'Cancel',
  saveIdle: 'Save settings',
  saveLoading: 'Saving…',
  savedTitle: 'Settings saved',
  savedDesc: 'Your notification preferences have been updated',
  saveError: 'Unable to save settings',
  testSentTitle: 'Test notification sent!',
  testSentDesc: 'Check your email and WhatsApp',
  testError: 'Unable to send test notification',
  testChannelsRequired: 'Enable at least email or WhatsApp to send a test.',
  loadErrorGeneric: 'Could not load notification settings.',
  planAgency: 'Agency',
  planPro: 'Pro',
  planStarter: 'Starter',
  planFree: 'Free',
};

export const notificationsSettingsPageUiIt = it;
export const notificationsSettingsPageUiEn = en;
