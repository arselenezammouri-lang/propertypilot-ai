/** Copy for `/dashboard/referral`. IT + EN. */
export type ReferralPageUi = {
  copied: string;
  copiedDesc: string;
  programTitle: string;
  programSubtitle: string;
  uniqueLink: string;
  uniqueLinkDesc: string;
  shareWhatsapp: string;
  invitedFriends: string;
  registeredAgencies: string;
  discountsEarned: string;
  totalDiscount: string;
  potentialEarnings: string;
  futureValue: string;
  howItWorks: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  whatsappMessage: string;
  loadError: string;
  clipboardCopyError: string;
  copyLinkAria: string;
  copiedAria: string;
  planAgency: string;
  planPro: string;
  planStarter: string;
  planFree: string;
};

const it: ReferralPageUi = {
  copied: 'Link copiato!',
  copiedDesc: 'Il link di referral è stato copiato negli appunti.',
  programTitle: 'Programma referral',
  programSubtitle:
    "Invita un'altra agenzia e ricevi uno sconto del 20% sul tuo prossimo rinnovo",
  uniqueLink: 'Il tuo link unico',
  uniqueLinkDesc:
    'Condividi questo link con altre agenzie. Quando si iscrivono al piano PRO o AGENCY, ricevi il 20% di sconto sul tuo prossimo rinnovo.',
  shareWhatsapp: 'Condividi su WhatsApp',
  invitedFriends: 'Amici invitati',
  registeredAgencies: 'Agenzie registrate',
  discountsEarned: 'Sconti maturati',
  totalDiscount: 'Sconto totale accumulato',
  potentialEarnings: 'Guadagno potenziale',
  futureValue: 'Valore sconti futuri',
  howItWorks: 'Come funziona',
  step1Title: 'Condividi il tuo link',
  step1Desc: 'Invita altre agenzie usando il link unico o WhatsApp.',
  step2Title: 'Si iscrivono al piano PRO o AGENCY',
  step2Desc:
    "Quando un'amica si iscrive a un piano a pagamento, il sistema la registra automaticamente.",
  step3Title: 'Ricevi il 20% di sconto',
  step3Desc:
    'Lo sconto viene applicato automaticamente al tuo prossimo rinnovo. Puoi accumulare più sconti!',
  whatsappMessage:
    "Ciao! Ho trovato PropertyPilot AI, la piattaforma che sta rivoluzionando il settore immobiliare. Con l'IA puoi generare annunci, trovare deal e ottenere mandati 24/7. Provala anche tu usando il mio link:",
  loadError: 'Impossibile caricare il referral.',
  clipboardCopyError: 'Impossibile copiare il link.',
  copyLinkAria: 'Copia link',
  copiedAria: 'Copiato',
  planAgency: 'Agency',
  planPro: 'Pro',
  planStarter: 'Starter',
  planFree: 'Free',
};

const en: ReferralPageUi = {
  copied: 'Link copied!',
  copiedDesc: 'The referral link has been copied to your clipboard.',
  programTitle: 'Referral program',
  programSubtitle:
    'Invite another agency and receive a 20% discount on your next renewal',
  uniqueLink: 'Your unique link',
  uniqueLinkDesc:
    'Share this link with other agencies. When they subscribe to the PRO or AGENCY plan, you receive a 20% discount on your next renewal.',
  shareWhatsapp: 'Share on WhatsApp',
  invitedFriends: 'Friends invited',
  registeredAgencies: 'Registered agencies',
  discountsEarned: 'Discounts earned',
  totalDiscount: 'Total discount accumulated',
  potentialEarnings: 'Potential earnings',
  futureValue: 'Future discount value',
  howItWorks: 'How it works',
  step1Title: 'Share your link',
  step1Desc: 'Invite other agencies using your unique link or WhatsApp.',
  step2Title: 'They subscribe to the PRO or AGENCY plan',
  step2Desc:
    'When a referred agency subscribes to a paid plan, the system records it automatically.',
  step3Title: 'Receive a 20% discount',
  step3Desc:
    'The discount is automatically applied to your next renewal. You can accumulate multiple discounts!',
  whatsappMessage:
    'Hi! I found PropertyPilot AI, the platform helping real estate agencies generate listings, find deals, and win mandates 24/7. Try it using my link:',
  loadError: 'Could not load referral data.',
  clipboardCopyError: 'Could not copy the link.',
  copyLinkAria: 'Copy link',
  copiedAria: 'Copied',
  planAgency: 'Agency',
  planPro: 'Pro',
  planStarter: 'Starter',
  planFree: 'Free',
};

export const referralPageUiIt = it;
export const referralPageUiEn = en;
