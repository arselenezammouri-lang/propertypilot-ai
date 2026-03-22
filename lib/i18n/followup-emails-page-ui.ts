/** `/dashboard/followup-emails` */

export type FollowupEmailTabId =
  | 'immediateResponse'
  | 'followUp24h'
  | 'followUp72h'
  | 'appointmentScheduling'
  | 'postVisit'
  | 'luxuryLeadFollowUp';

export type FollowupEmailTone = 'professionale' | 'amichevole' | 'luxury';

export type FollowupEmailsPageUi = {
  pageTitle: string;
  heroBadge: string;
  leadNameRequired: string;
  agentNameRequired: string;
  agencyNameRequired: string;
  propertyTitleRequired: string;
  propertyLocationRequired: string;
  propertyPriceRequired: string;
  reasonRequired: string;
  generateError: string;
  success: string;
  cacheResult: string;
  ready6: string;
  copied: string;
  copiedText: string;
  copyFailed: string;
  subjectLabel: string;
  psLabel: string;
  standardVersion: string;
  longVersion: string;
  copyEmail: string;
  emailTextLong: string;
  emailText: string;
  shortVersion: string;
  back: string;
  pageSubtitle: string;
  leadName: string;
  agentName: string;
  agencyName: string;
  propertyTitle: string;
  propertyLocation: string;
  propertyPrice: string;
  reasonInterest: string;
  tone: string;
  selectTone: string;
  generating: string;
  generate6: string;
  noResultTitle: string;
  readyTitle: string;
  readyDesc: string;
  generatingTitle: string;
  generatingDesc: string;
  convertTip: string;
  ctaLabel: string;
  formCardTitle: string;
  formCardDesc: string;
  leadNamePlaceholder: string;
  agentNamePlaceholder: string;
  agencyNamePlaceholder: string;
  propertyTitlePlaceholder: string;
  propertyLocationPlaceholder: string;
  propertyPricePlaceholder: string;
  reasonPlaceholder: string;
  emailTypes: Array<{
    id: FollowupEmailTabId;
    label: string;
    description: string;
  }>;
  toneOptions: Array<{ value: FollowupEmailTone; label: string }>;
};

export const followupEmailsPageUiIt: FollowupEmailsPageUi = {
  pageTitle: 'Follow-Up Email AI',
  heroBadge: 'Lead Converter AI',
  leadNameRequired: 'Inserisci il nome del lead',
  agentNameRequired: "Inserisci il nome dell'agente",
  agencyNameRequired: "Inserisci il nome dell'agenzia",
  propertyTitleRequired: "Inserisci il titolo dell'immobile",
  propertyLocationRequired: "Inserisci la località dell'immobile",
  propertyPriceRequired: "Inserisci il prezzo dell'immobile",
  reasonRequired:
    'Descrivi il motivo di interesse del lead (min 10 caratteri)',
  generateError: 'Errore nella generazione',
  success: 'Email generate con successo!',
  cacheResult: 'Risultato dalla cache (24h)',
  ready6: "6 email pronte all'uso",
  copied: 'Copiato!',
  copiedText: 'Testo copiato negli appunti',
  copyFailed: 'Impossibile copiare il testo',
  subjectLabel: 'Oggetto',
  psLabel: 'P.S.',
  standardVersion: 'Versione standard',
  longVersion: 'Versione lunga',
  copyEmail: 'Copia email',
  emailTextLong: 'Testo email (versione lunga)',
  emailText: 'Testo email',
  shortVersion: 'Versione breve (WhatsApp / SMS)',
  back: 'Torna alla dashboard',
  pageSubtitle:
    'Genera 6 email professionali per convertire i tuoi lead immobiliari',
  leadName: 'Nome lead *',
  agentName: 'Nome agente *',
  agencyName: 'Nome agenzia *',
  propertyTitle: 'Titolo immobile *',
  propertyLocation: 'Località *',
  propertyPrice: 'Prezzo *',
  reasonInterest: 'Motivo di interesse *',
  tone: 'Tono delle email',
  selectTone: 'Seleziona tono',
  generating: 'Generazione in corso...',
  generate6: 'Genera 6 email follow-up',
  noResultTitle: 'Nessuna email generata',
  readyTitle: 'Pronto a generare le tue email',
  readyDesc:
    'Compila il form con i dati del lead e clicca «Genera» per creare 6 email professionali personalizzate.',
  generatingTitle: 'Generazione in corso...',
  generatingDesc: 'Stiamo creando 6 email personalizzate per il tuo lead',
  convertTip: 'Consiglio per convertire questo lead',
  ctaLabel: "Invito all'azione",
  formCardTitle: 'Dati del lead',
  formCardDesc:
    'Inserisci le informazioni per generare email personalizzate',
  leadNamePlaceholder: 'es. Marco Rossi',
  agentNamePlaceholder: 'es. Anna Bianchi',
  agencyNamePlaceholder: 'es. Immobiliare Milano',
  propertyTitlePlaceholder: 'es. Attico con terrazzo panoramico',
  propertyLocationPlaceholder: 'es. Milano Centro',
  propertyPricePlaceholder: 'es. €450.000',
  reasonPlaceholder:
    'es. Il cliente cerca un attico in zona centrale per uso abitativo, ha visitato il portale e richiesto info...',
  emailTypes: [
    {
      id: 'immediateResponse',
      label: 'Risposta immediata',
      description: 'Entro 1 ora',
    },
    { id: 'followUp24h', label: 'Follow-up 24h', description: 'Dopo 24 ore' },
    { id: 'followUp72h', label: 'Follow-up 72h', description: 'Dopo 72 ore' },
    {
      id: 'appointmentScheduling',
      label: 'Appuntamento',
      description: 'Fissa visita',
    },
    { id: 'postVisit', label: 'Post-visita', description: 'Dopo la visita' },
    {
      id: 'luxuryLeadFollowUp',
      label: 'Luxury lead',
      description: 'Clienti VIP',
    },
  ],
  toneOptions: [
    { value: 'professionale', label: 'Professionale' },
    { value: 'amichevole', label: 'Amichevole' },
    { value: 'luxury', label: 'Luxury' },
  ],
};

export const followupEmailsPageUiEn: FollowupEmailsPageUi = {
  pageTitle: 'Follow-Up Email AI',
  heroBadge: 'Lead Converter AI',
  leadNameRequired: 'Enter the lead name',
  agentNameRequired: 'Enter the agent name',
  agencyNameRequired: 'Enter the agency name',
  propertyTitleRequired: 'Enter the property title',
  propertyLocationRequired: 'Enter the property location',
  propertyPriceRequired: 'Enter the property price',
  reasonRequired:
    "Describe the lead's reason for interest (min 10 characters)",
  generateError: 'Generation error',
  success: 'Emails generated successfully!',
  cacheResult: 'Result from cache (24h)',
  ready6: '6 emails ready to use',
  copied: 'Copied!',
  copiedText: 'Text copied to clipboard',
  copyFailed: 'Unable to copy text',
  subjectLabel: 'Subject',
  psLabel: 'P.S.',
  standardVersion: 'Standard version',
  longVersion: 'Long version',
  copyEmail: 'Copy email',
  emailTextLong: 'Email body (long version)',
  emailText: 'Email body',
  shortVersion: 'Short version (WhatsApp / SMS)',
  back: 'Back to dashboard',
  pageSubtitle:
    'Generate 6 professional emails to convert your real estate leads',
  leadName: 'Lead name *',
  agentName: 'Agent name *',
  agencyName: 'Agency name *',
  propertyTitle: 'Property title *',
  propertyLocation: 'Location *',
  propertyPrice: 'Price *',
  reasonInterest: 'Reason for interest *',
  tone: 'Email tone',
  selectTone: 'Select tone',
  generating: 'Generating...',
  generate6: 'Generate 6 follow-up emails',
  noResultTitle: 'No emails generated yet',
  readyTitle: 'Ready to generate your emails',
  readyDesc:
    'Fill in the form with the lead details and click Generate to create 6 personalized professional emails.',
  generatingTitle: 'Generation in progress...',
  generatingDesc: "We're creating 6 personalized emails for your lead",
  convertTip: 'Tip to convert this lead',
  ctaLabel: 'Call to action',
  formCardTitle: 'Lead details',
  formCardDesc: 'Enter the information to generate personalized emails',
  leadNamePlaceholder: 'e.g. John Smith',
  agentNamePlaceholder: 'e.g. Anna Brown',
  agencyNamePlaceholder: 'e.g. Prime Realty',
  propertyTitlePlaceholder: 'e.g. Penthouse with panoramic terrace',
  propertyLocationPlaceholder: 'e.g. Downtown Miami',
  propertyPricePlaceholder: 'e.g. $450,000',
  reasonPlaceholder:
    'e.g. The client is looking for a central penthouse for residential use, visited the portal and requested info...',
  emailTypes: [
    {
      id: 'immediateResponse',
      label: 'Immediate response',
      description: 'Within 1 hour',
    },
    {
      id: 'followUp24h',
      label: '24h follow-up',
      description: 'After 24 hours',
    },
    {
      id: 'followUp72h',
      label: '72h follow-up',
      description: 'After 72 hours',
    },
    {
      id: 'appointmentScheduling',
      label: 'Appointment',
      description: 'Book a visit',
    },
    { id: 'postVisit', label: 'Post-visit', description: 'After the visit' },
    {
      id: 'luxuryLeadFollowUp',
      label: 'Luxury lead',
      description: 'VIP clients',
    },
  ],
  toneOptions: [
    { value: 'professionale', label: 'Professional' },
    { value: 'amichevole', label: 'Friendly' },
    { value: 'luxury', label: 'Luxury' },
  ],
};
