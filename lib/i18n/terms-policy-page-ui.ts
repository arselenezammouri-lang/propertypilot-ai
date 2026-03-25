export type TermsPolicySectionUi = {
  title: string;
  iconKey?: 'fileText' | 'shield' | 'checkCircle' | 'alertTriangle';
  color?: string;
  paragraphs: string[];
  items?: string[];
  note?: string;
  linkText?: string;
  linkIntro?: string;
  contacts?: string[];
};

export type TermsPolicyPageUi = {
  title: string;
  highlight: string;
  updated: string;
  sections: TermsPolicySectionUi[];
  privacy: string;
  refund: string;
};

export const termsPolicyPageUiIt: TermsPolicyPageUi = {
  title: 'Termini e',
  highlight: 'Condizioni',
  updated: 'Ultimo aggiornamento: dicembre 2024',
  privacy: 'Privacy Policy',
  refund: 'Politica rimborsi',
  sections: [
    {
      iconKey: 'fileText',
      color: 'text-electric-blue',
      title: '1. Accettazione dei termini',
      paragraphs: [
        'Utilizzando PropertyPilot AI ("Servizio"), accetti di essere vincolato da questi Termini e Condizioni. Se non accetti questi termini, ti preghiamo di non utilizzare il nostro Servizio.',
        'PropertyPilot AI si riserva il diritto di modificare questi termini in qualsiasi momento. Le modifiche saranno effettive immediatamente dopo la pubblicazione sul sito.',
      ],
    },
    {
      iconKey: 'shield',
      color: 'text-neon-aqua',
      title: '2. Descrizione del servizio',
      paragraphs: ['PropertyPilot AI è una piattaforma basata su intelligenza artificiale che fornisce:'],
      items: [
        'Generazione automatica di descrizioni immobiliari professionali',
        'Ottimizzazione SEO per annunci immobiliari',
        'Traduzione multilingua di contenuti',
        'Strumenti CRM per la gestione dei lead',
        'Analisi e audit di annunci esistenti',
        'Generazione di materiali marketing (PDF, post social)',
      ],
    },
    {
      iconKey: 'checkCircle',
      color: 'text-sunset-gold',
      title: '3. Account utente',
      paragraphs: ['Per utilizzare PropertyPilot AI devi:'],
      items: [
        'Avere almeno 18 anni',
        'Fornire informazioni accurate e complete durante la registrazione',
        'Mantenere la sicurezza del tuo account e password',
        'Notificarci immediatamente di qualsiasi uso non autorizzato',
      ],
      note: 'Sei responsabile di tutte le attività che avvengono sotto il tuo account.',
    },
    {
      title: '4. Piani e pagamenti',
      paragraphs: ['PropertyPilot AI offre diversi piani di abbonamento:'],
      items: [
        'Starter (EUR 197/mese): funzionalità base per agenti singoli',
        'Pro (EUR 497/mese): CRM completo e automazioni avanzate',
        'Agency (EUR 897/mese): per team fino a 10 agenti',
        'Agency Boost (EUR 2.497 una tantum): setup completo e consulenza',
      ],
      note: 'I pagamenti vengono elaborati tramite Stripe. I prezzi non includono IVA.',
    },
    {
      title: '5. Proprietà intellettuale',
      paragraphs: [
        "Tutti i contenuti generati dall'AI attraverso PropertyPilot AI sono di proprietà dell'utente che li ha generati. PropertyPilot AI mantiene i diritti sulla piattaforma, sul software, sul design e sui materiali correlati.",
        'È vietato copiare, modificare o distribuire parti del Servizio senza autorizzazione scritta.',
      ],
    },
    {
      iconKey: 'alertTriangle',
      color: 'text-orange-500',
      title: '6. Limitazioni di responsabilità',
      paragraphs: [
        "PropertyPilot AI non garantisce che i contenuti generati dall'AI siano privi di errori o adatti a tutti gli scopi. L'utente è responsabile della revisione e verifica dei contenuti prima della pubblicazione.",
        "PropertyPilot AI non sarà responsabile per danni indiretti, incidentali o consequenziali derivanti dall'uso del Servizio.",
      ],
    },
    {
      title: '7. Uso accettabile',
      paragraphs: ['È vietato utilizzare PropertyPilot AI per:'],
      items: [
        'Attività illegali o fraudolente',
        'Generare contenuti diffamatori, offensivi o discriminatori',
        'Violare diritti di terzi',
        'Tentare di accedere a sistemi o dati non autorizzati',
        'Distribuire malware o codice dannoso',
      ],
    },
    {
      title: '8. Cancellazione e sospensione',
      paragraphs: [
        'Puoi cancellare il tuo account in qualsiasi momento dalla dashboard. PropertyPilot AI si riserva il diritto di sospendere o terminare account che violano questi termini.',
      ],
      linkText: 'Politica di rimborso',
      linkIntro: 'Per la politica di rimborso, consulta la nostra',
    },
    {
      title: '9. Legge applicabile',
      paragraphs: [
        'Questi termini sono regolati dalle leggi italiane. Per qualsiasi controversia, sarà competente il Foro di Milano.',
      ],
    },
    {
      title: '10. Contatti',
      paragraphs: ['Per domande su questi termini, contattaci:'],
      contacts: ['Email: legal@propertypilotai.com', 'Supporto: support@propertypilotai.com'],
    },
  ],
};

export const termsPolicyPageUiEn: TermsPolicyPageUi = {
  title: 'Terms and',
  highlight: 'Conditions',
  updated: 'Last updated: December 2024',
  privacy: 'Privacy Policy',
  refund: 'Refund Policy',
  sections: [
    {
      iconKey: 'fileText',
      color: 'text-electric-blue',
      title: '1. Acceptance of Terms',
      paragraphs: [
        'By using PropertyPilot AI ("Service"), you agree to be bound by these Terms and Conditions. If you do not agree with these terms, please do not use our Service.',
        'PropertyPilot AI reserves the right to modify these terms at any time. Changes become effective immediately after publication on the site.',
      ],
    },
    {
      iconKey: 'shield',
      color: 'text-neon-aqua',
      title: '2. Description of the Service',
      paragraphs: ['PropertyPilot AI is an artificial intelligence platform that provides:'],
      items: [
        'Automated generation of professional real estate descriptions',
        'SEO optimization for property listings',
        'Multilingual content translation',
        'CRM tools for lead management',
        'Analysis and auditing of existing listings',
        'Marketing material generation (PDFs, social posts)',
      ],
    },
    {
      iconKey: 'checkCircle',
      color: 'text-sunset-gold',
      title: '3. User Account',
      paragraphs: ['To use PropertyPilot AI you must:'],
      items: [
        'Be at least 18 years old',
        'Provide accurate and complete registration information',
        'Maintain the security of your account and password',
        'Notify us immediately of any unauthorized use',
      ],
      note: 'You are responsible for all activities that occur under your account.',
    },
    {
      title: '4. Plans and Payments',
      paragraphs: ['PropertyPilot AI offers different subscription plans:'],
      items: [
        'Starter (EUR 197/month): Basic features for solo agents',
        'Pro (EUR 497/month): Full CRM and advanced automations',
        'Agency (EUR 897/month): For teams up to 10 agents',
        'Agency Boost (EUR 2,497 one-time): Complete setup and consulting',
      ],
      note: 'Payments are processed through Stripe. Prices do not include VAT.',
    },
    {
      title: '5. Intellectual Property',
      paragraphs: [
        'All content generated by AI through PropertyPilot AI belongs to the user who generated it. PropertyPilot AI retains rights to the platform, software, design, and related materials.',
        'Copying, modifying, or distributing parts of the Service without written permission is prohibited.',
      ],
    },
    {
      iconKey: 'alertTriangle',
      color: 'text-orange-500',
      title: '6. Limitation of Liability',
      paragraphs: [
        'PropertyPilot AI does not guarantee that AI-generated content will be error-free or suitable for every purpose. The user is responsible for reviewing and verifying content before publication.',
        'PropertyPilot AI will not be liable for indirect, incidental, or consequential damages arising from use of the Service.',
      ],
    },
    {
      title: '7. Acceptable Use',
      paragraphs: ['You may not use PropertyPilot AI for:'],
      items: [
        'Illegal or fraudulent activities',
        'Generating defamatory, offensive, or discriminatory content',
        'Violating third-party rights',
        'Attempting unauthorized access to systems or data',
        'Distributing malware or malicious code',
      ],
    },
    {
      title: '8. Cancellation and Suspension',
      paragraphs: [
        'You can cancel your account at any time from the dashboard. PropertyPilot AI reserves the right to suspend or terminate accounts that violate these terms.',
      ],
      linkText: 'Refund Policy',
      linkIntro: 'For the refund policy, see our',
    },
    {
      title: '9. Governing Law',
      paragraphs: [
        'These terms are governed by Italian law. Any dispute will fall under the jurisdiction of the Court of Milan.',
      ],
    },
    {
      title: '10. Contact',
      paragraphs: ['For questions about these terms, contact us:'],
      contacts: ['Email: legal@propertypilotai.com', 'Support: support@propertypilotai.com'],
    },
  ],
};
