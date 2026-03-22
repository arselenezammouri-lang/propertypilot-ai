/** /pricing — plan card copy (prices from STRIPE/formatCurrency; this is labels only) */

export type PricingPlanCardUi = {
  tagline: string;
  period: string;
  includes: string[];
  cta: string;
};

export type PricingPagePlansUi = {
  starter: PricingPlanCardUi;
  pro: PricingPlanCardUi;
  agency: PricingPlanCardUi;
  boost: PricingPlanCardUi;
  popularBadge: string;
  eliteOfferBadge: string;
  vatExcluded: string;
  /** Use `{year}` placeholder */
  footerCopyright: string;
  footerPrivacy: string;
  footerTerms: string;
  footerRefund: string;
};

export const pricingPagePlansUiIt: PricingPagePlansUi = {
  starter: {
    tagline: 'Strumenti AI per agenti individuali',
    period: '/ mese',
    includes: [
      'Strumenti AI di base per annunci',
      'Per singoli agenti',
      'Accesso alle funzioni core di generazione annunci',
    ],
    cta: 'Inizia con Starter',
  },
  pro: {
    tagline: 'CRM, automazioni e strumenti AI',
    period: '/ mese',
    includes: [
      'Tutte le funzionalità Starter',
      'CRM e automazioni',
      'Strumenti AI avanzati per agenzie',
    ],
    cta: 'Passa a Pro',
  },
  agency: {
    tagline: 'Per team fino a 10 agenti',
    period: '/ mese',
    includes: [
      'Tutte le funzionalità Pro',
      'Pensato per team fino a 10 agenti',
      'Gestione multi-utente / multi-agenzia',
    ],
    cta: 'Passa a Agency',
  },
  boost: {
    tagline: 'Pacchetto setup done-for-you',
    period: 'una tantum',
    includes: [
      'Setup completo «done-for-you»',
      'Implementazione e onboarding guidato',
      'Supporto premium per il lancio',
    ],
    cta: 'Acquista Agency Boost',
  },
  popularBadge: 'Consigliato',
  eliteOfferBadge: 'Offerta elite',
  vatExcluded: 'IVA esclusa',
  footerCopyright: '© {year} PropertyPilot AI. Tutti i diritti riservati.',
  footerPrivacy: 'Privacy Policy',
  footerTerms: 'Termini di servizio',
  footerRefund: 'Politica rimborsi',
};

export const pricingPagePlansUiEn: PricingPagePlansUi = {
  starter: {
    tagline: 'AI listing tools for solo agents',
    period: '/ month',
    includes: [
      'Core AI listing tools',
      'Built for solo agents',
      'Access to essential listing generation features',
    ],
    cta: 'Start with Starter',
  },
  pro: {
    tagline: 'CRM, automations & AI tools',
    period: '/ month',
    includes: ['Everything in Starter', 'CRM and automations', 'Advanced AI tools for agencies'],
    cta: 'Upgrade to Pro',
  },
  agency: {
    tagline: 'For teams up to 10 agents',
    period: '/ month',
    includes: [
      'Everything in Pro',
      'Built for teams up to 10 agents',
      'Multi-user / multi-agency management',
    ],
    cta: 'Upgrade to Agency',
  },
  boost: {
    tagline: 'Done-for-you setup package',
    period: 'one-time',
    includes: [
      'Complete done-for-you setup',
      'Guided implementation and onboarding',
      'Premium launch support',
    ],
    cta: 'Buy Agency Boost',
  },
  popularBadge: 'Recommended',
  eliteOfferBadge: 'Elite offer',
  vatExcluded: 'VAT excluded',
  footerCopyright: '© {year} PropertyPilot AI. All rights reserved.',
  footerPrivacy: 'Privacy Policy',
  footerTerms: 'Terms of Service',
  footerRefund: 'Refund Policy',
};
