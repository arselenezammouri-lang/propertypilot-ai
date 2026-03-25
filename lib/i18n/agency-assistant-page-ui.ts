/** Copy for `/dashboard/agency-assistant`. IT + EN. */
export type AgencyAssistantQuickSuggestion = {
  context: 'copy' | 'email' | 'social' | 'tutorial';
  /** Lucide icon key for the chip (stable across locales) */
  iconKey: 'file' | 'mail' | 'message' | 'lightbulb' | 'video' | 'hash';
  text: string;
};

export type AgencyAssistantPageUi = {
  error: string;
  premiumRequired: string;
  responseError: string;
  title: string;
  subtitle: string;
  aiActive: string;
  backAria: string;
  backLink: string;
  paywallDescription: string;
  introTitle: string;
  introBody: string;
  quickStart: string;
  conversation: string;
  messages: string;
  newChat: string;
  emptyState: string;
  thinking: string;
  placeholder: string;
  sendAria: string;
  inputHint: string;
  quickSuggestions: AgencyAssistantQuickSuggestion[];
  planAgency: string;
  planPro: string;
  planStarter: string;
  planFree: string;
};

const it: AgencyAssistantPageUi = {
  error: 'Errore',
  premiumRequired:
    "L'Agency Assistant AI è una funzionalità Premium. Aggiorna il tuo account al piano PRO o AGENCY.",
  responseError: 'Errore nella risposta',
  title: 'Agency Assistant AI',
  subtitle: 'Il tuo assistente immobiliare 24/7',
  aiActive: 'AI attivo',
  backAria: 'Torna alla dashboard',
  backLink: 'Dashboard',
  paywallDescription:
    "Questa funzionalità è disponibile solo per gli utenti PRO e AGENCY. Aggiorna il tuo account per sbloccare l'assistente AI completo.",
  introTitle: 'Ciao! Sono il tuo assistente AI',
  introBody:
    'Sono specializzato in copywriting immobiliare e conosco tutte le funzionalità di PropertyPilot AI. Chiedimi aiuto per annunci, email, post social, strategie di vendita e molto altro!',
  quickStart: 'Inizia con un suggerimento rapido',
  conversation: 'Conversazione',
  messages: 'messaggi',
  newChat: 'Nuova chat',
  emptyState: 'Scrivi un messaggio per iniziare la conversazione',
  thinking: 'Sto pensando…',
  placeholder: 'Scrivi un messaggio…',
  sendAria: 'Invia messaggio',
  inputHint:
    "Premi Invio per inviare • L'assistente conosce tutte le funzionalità di PropertyPilot AI",
  quickSuggestions: [
    {
      context: 'copy',
      iconKey: 'file',
      text: 'Genera un annuncio per questo immobile',
    },
    {
      context: 'email',
      iconKey: 'mail',
      text: "Crea un'email di follow-up",
    },
    {
      context: 'social',
      iconKey: 'message',
      text: 'Suggerisci post social',
    },
    {
      context: 'tutorial',
      iconKey: 'lightbulb',
      text: 'Come usare Perfect Copy 2.0?',
    },
    {
      context: 'social',
      iconKey: 'video',
      text: 'Consigli per video immobiliari',
    },
    {
      context: 'social',
      iconKey: 'hash',
      text: 'Migliori hashtag per Instagram',
    },
  ],
  planAgency: 'Agency',
  planPro: 'Pro',
  planStarter: 'Starter',
  planFree: 'Free',
};

const en: AgencyAssistantPageUi = {
  error: 'Error',
  premiumRequired:
    'Agency Assistant AI is a Premium feature. Upgrade your account to the PRO or AGENCY plan.',
  responseError: 'Response error',
  title: 'Agency Assistant AI',
  subtitle: 'Your real estate assistant 24/7',
  aiActive: 'AI active',
  backAria: 'Go back to dashboard',
  backLink: 'Dashboard',
  paywallDescription:
    'This feature is only available for PRO and AGENCY users. Upgrade your account to unlock the full AI assistant.',
  introTitle: 'Hi! I am your AI assistant',
  introBody:
    'I specialize in real estate copywriting and know every feature inside PropertyPilot AI. Ask me for help with listings, emails, social posts, sales strategy, and much more.',
  quickStart: 'Start with a quick suggestion',
  conversation: 'Conversation',
  messages: 'messages',
  newChat: 'New chat',
  emptyState: 'Write a message to start the conversation',
  thinking: 'Thinking…',
  placeholder: 'Write a message…',
  sendAria: 'Send message',
  inputHint:
    'Press Enter to send • The assistant knows all PropertyPilot AI features',
  quickSuggestions: [
    {
      context: 'copy',
      iconKey: 'file',
      text: 'Generate a listing for this property',
    },
    {
      context: 'email',
      iconKey: 'mail',
      text: 'Create a follow-up email',
    },
    {
      context: 'social',
      iconKey: 'message',
      text: 'Suggest social posts',
    },
    {
      context: 'tutorial',
      iconKey: 'lightbulb',
      text: 'How do I use Perfect Copy 2.0?',
    },
    {
      context: 'social',
      iconKey: 'video',
      text: 'Tips for real estate videos',
    },
    {
      context: 'social',
      iconKey: 'hash',
      text: 'Best hashtags for Instagram',
    },
  ],
  planAgency: 'Agency',
  planPro: 'Pro',
  planStarter: 'Starter',
  planFree: 'Free',
};

export const agencyAssistantPageUiIt = it;
export const agencyAssistantPageUiEn = en;
