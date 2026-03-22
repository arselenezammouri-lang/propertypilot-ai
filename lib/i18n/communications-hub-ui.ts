/** Copy for `CommunicationsHub` on lead detail. IT + EN; merge EN for other locales. */
export type CommunicationsHubUi = {
  hubTitle: string;
  hubBadge: string;
  hubDesc: string;
  channelEmail: string;
  channelWhatsapp: string;
  channelSms: string;
  newMessage: string;
  emailSubjectPlaceholder: string;
  smsPlaceholder: string;
  messagePlaceholder: string;
  generatedVariants: string;
  useVariant: string;
  generating: string;
  generateWithAI: string;
  sending: string;
  openWhatsApp: string;
  whatsappOpened: string;
  whatsappDesc: string;
  send: string;
  historyToggle: string;
  noHistory: string;
  msgGenerated: string;
  fromCache: string;
  characters: string;
  error: string;
  emptyMessage: string;
  smsTooLong: string;
  smsTooLongDesc: string;
  missingSubject: string;
  generationError: string;
  sendError: string;
  sentTitle: string;
  toneProfessional: string;
  toneEmotional: string;
  toneLuxury: string;
  toneCasual: string;
  toneUrgent: string;
  purposeFollowUp: string;
  purposeFirstContact: string;
  purposeAppointment: string;
  purposeOffer: string;
  purposeThankYou: string;
  purposeReminder: string;
  copySuccessTitle: string;
};

const it: CommunicationsHubUi = {
  hubTitle: 'Communication Hub',
  hubBadge: 'CRM 4.0',
  hubDesc: 'Invia email, WhatsApp e SMS con AI — tutto in un unico posto',
  channelEmail: 'Email',
  channelWhatsapp: 'WhatsApp',
  channelSms: 'SMS',
  newMessage: 'Nuovo {channel}',
  emailSubjectPlaceholder: 'Oggetto email...',
  smsPlaceholder: 'Messaggio SMS (max 160 caratteri)...',
  messagePlaceholder: 'Scrivi il tuo {channel}...',
  generatedVariants: 'Varianti generate:',
  useVariant: 'Usa',
  generating: 'Generando...',
  generateWithAI: 'Genera con AI',
  sending: 'Invio...',
  openWhatsApp: 'Apri WhatsApp',
  whatsappOpened: 'WhatsApp aperto!',
  whatsappDesc: 'Invia il messaggio dalla finestra WhatsApp',
  send: 'Invia',
  historyToggle: 'Storico comunicazioni ({count})',
  noHistory: 'Nessuna comunicazione registrata',
  msgGenerated: 'Messaggio generato!',
  fromCache: 'Dalla cache (24h)',
  characters: '{n} caratteri',
  error: 'Errore',
  emptyMessage: 'Inserisci un messaggio',
  smsTooLong: 'SMS troppo lungo',
  smsTooLongDesc: '{n}/160 caratteri. Riduci il testo.',
  missingSubject: "Inserisci l'oggetto email",
  generationError: 'Errore nella generazione',
  sendError: "Errore nell'invio",
  sentTitle: 'Inviato!',
  toneProfessional: 'Professionale',
  toneEmotional: 'Emozionale',
  toneLuxury: 'Luxury',
  toneCasual: 'Informale',
  toneUrgent: 'Urgente',
  purposeFollowUp: 'Follow-up',
  purposeFirstContact: 'Primo contatto',
  purposeAppointment: 'Appuntamento',
  purposeOffer: 'Offerta',
  purposeThankYou: 'Ringraziamento',
  purposeReminder: 'Promemoria',
  copySuccessTitle: 'Copiato!',
};

const en: CommunicationsHubUi = {
  hubTitle: 'Communication Hub',
  hubBadge: 'CRM 4.0',
  hubDesc: 'Send email, WhatsApp, and SMS with AI — all in one place',
  channelEmail: 'Email',
  channelWhatsapp: 'WhatsApp',
  channelSms: 'SMS',
  newMessage: 'New {channel}',
  emailSubjectPlaceholder: 'Email subject...',
  smsPlaceholder: 'SMS message (max 160 characters)...',
  messagePlaceholder: 'Write your {channel}...',
  generatedVariants: 'Generated variants:',
  useVariant: 'Use',
  generating: 'Generating...',
  generateWithAI: 'Generate with AI',
  sending: 'Sending...',
  openWhatsApp: 'Open WhatsApp',
  whatsappOpened: 'WhatsApp opened!',
  whatsappDesc: 'Send the message from the WhatsApp window',
  send: 'Send',
  historyToggle: 'Communication history ({count})',
  noHistory: 'No communications recorded',
  msgGenerated: 'Message generated!',
  fromCache: 'From cache (24h)',
  characters: '{n} characters',
  error: 'Error',
  emptyMessage: 'Please enter a message',
  smsTooLong: 'SMS too long',
  smsTooLongDesc: '{n}/160 characters. Shorten the text.',
  missingSubject: 'Please enter an email subject',
  generationError: 'Generation error',
  sendError: 'Sending error',
  sentTitle: 'Sent!',
  toneProfessional: 'Professional',
  toneEmotional: 'Emotional',
  toneLuxury: 'Luxury',
  toneCasual: 'Casual',
  toneUrgent: 'Urgent',
  purposeFollowUp: 'Follow-up',
  purposeFirstContact: 'First contact',
  purposeAppointment: 'Appointment',
  purposeOffer: 'Offer',
  purposeThankYou: 'Thank you',
  purposeReminder: 'Reminder',
  copySuccessTitle: 'Copied!',
};

export const communicationsHubUiIt = it;
export const communicationsHubUiEn = en;
