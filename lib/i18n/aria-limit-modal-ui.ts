/** Strings + upgrade tiers for `components/aria-limit-modal.tsx`. IT + EN; ES–AR in `pending-aria-locales.ts`. */

export type AriaLimitUpgradeTier = {
  next: 'starter' | 'pro' | 'agency';
  nextPlan: string;
  features: string[];
};

export type AriaLimitModalUi = {
  title: string;
  /** replace('{used}', '{lim}', '{plan}') */
  desc: string;
  recommended: string;
  /** replace('{name}', next plan name) */
  ariaQuote: string;
  later: string;
  /** replace('{name}', next plan name) */
  upgradeTo: string;
  upgrades: Record<'free' | 'starter' | 'pro', AriaLimitUpgradeTier>;
};

const it: AriaLimitModalUi = {
  title: 'Hai raggiunto il limite!',
  desc: 'Hai utilizzato {used} dei tuoi {lim} annunci mensili con il piano {plan}.',
  recommended: 'CONSIGLIATO',
  ariaQuote: '"Passa a {name} per continuare a dominare il mercato!" — Aria',
  later: 'Più tardi',
  upgradeTo: 'Passa a {name}',
  upgrades: {
    free: {
      next: 'starter',
      nextPlan: 'Starter',
      features: [
        '50 annunci/mese',
        'Tutti gli strumenti AI',
        'PDF professionali',
      ],
    },
    starter: {
      next: 'pro',
      nextPlan: 'Pro',
      features: [
        '200 annunci/mese',
        'CRM completo',
        'Lead scoring AI',
        '20 automazioni',
      ],
    },
    pro: {
      next: 'agency',
      nextPlan: 'Agency',
      features: [
        'Annunci illimitati',
        '10 utenti inclusi',
        'Voice AI 24/7',
        'Supporto prioritario',
      ],
    },
  },
};

const en: AriaLimitModalUi = {
  title: "You've reached your limit!",
  desc: "You've used {used} of your {lim} monthly listings on the {plan} plan.",
  recommended: 'RECOMMENDED',
  ariaQuote: '"Upgrade to {name} and keep dominating the market!" — Aria',
  later: 'Later',
  upgradeTo: 'Upgrade to {name}',
  upgrades: {
    free: {
      next: 'starter',
      nextPlan: 'Starter',
      features: [
        '50 listings/month',
        'All AI tools',
        'Professional PDFs',
      ],
    },
    starter: {
      next: 'pro',
      nextPlan: 'Pro',
      features: [
        '200 listings/month',
        'Full CRM',
        'AI lead scoring',
        '20 automations',
      ],
    },
    pro: {
      next: 'agency',
      nextPlan: 'Agency',
      features: [
        'Unlimited listings',
        '10 users included',
        'Voice AI 24/7',
        'Priority support',
      ],
    },
  },
};

export const ariaLimitModalUiIt = it;
export const ariaLimitModalUiEn = en;
