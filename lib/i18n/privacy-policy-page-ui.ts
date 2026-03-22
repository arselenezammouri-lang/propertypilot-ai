export type PrivacyPolicySectionUi = {
  title: string;
  iconKey?: 'eye' | 'database' | 'lock' | 'globe' | 'userCheck' | 'mail';
  color?: string;
  body?: string[];
  lists?: { title: string; items: string[] }[];
  items?: string[];
  contacts?: string[];
  /** Plain footer paragraph */
  note?: string;
  /** Render exercise-rights line with mailto (localized via page chrome) */
  noteKey?: 'exerciseRights' | 'dpaItaly';
};

export type PrivacyPolicyPageUi = {
  title: string;
  highlight: string;
  updated: string;
  sections: PrivacyPolicySectionUi[];
  terms: string;
  refund: string;
  /** Prefix before privacy@ mailto (exercise rights) */
  exerciseRightsPrefix: string;
  exerciseRightsSuffix: string;
  /** Italian DPA complaint block */
  dpaItalyBefore: string;
  dpaItalyAfter: string;
  dpaLinkHref: string;
  dpaLinkLabel: string;
};

export const privacyPolicyPageUiIt: PrivacyPolicyPageUi = {
  title: 'Privacy',
  highlight: 'Policy',
  updated: 'Ultimo aggiornamento: dicembre 2024',
  exerciseRightsPrefix: 'Per esercitare questi diritti, contattaci a ',
  exerciseRightsSuffix: '',
  dpaItalyBefore: 'Hai il diritto di presentare reclamo al Garante per la Protezione dei Dati Personali (',
  dpaItalyAfter: ').',
  dpaLinkHref: 'https://www.garanteprivacy.it',
  dpaLinkLabel: 'www.garanteprivacy.it',
  terms: 'Termini e Condizioni',
  refund: 'Politica rimborsi',
  sections: [
    {
      iconKey: 'eye',
      color: 'text-electric-blue',
      title: '1. Informazioni generali',
      body: [
        'PropertyPilot AI ("noi", "nostro") rispetta la tua privacy e si impegna a proteggere i tuoi dati personali. Questa informativa descrive come raccogliamo, utilizziamo e proteggiamo le tue informazioni in conformità con il GDPR e la normativa italiana.',
        'Titolare del trattamento: PropertyPilot AI',
        'Email: privacy@propertypilotai.com',
      ],
    },
    {
      iconKey: 'database',
      color: 'text-sunset-gold',
      title: '2. Dati che raccogliamo',
      body: ['Raccogliamo le seguenti categorie di dati:'],
      lists: [
        {
          title: 'Dati forniti direttamente:',
          items: [
            'Nome e cognome',
            'Indirizzo email',
            'Nome agenzia/azienda',
            'Informazioni di pagamento (elaborate da Stripe)',
            'Contenuti immobiliari inseriti per la generazione AI',
          ],
        },
        {
          title: 'Dati raccolti automaticamente:',
          items: [
            'Indirizzo IP',
            'Tipo di browser e dispositivo',
            'Pagine visitate e interazioni',
            'Cookie tecnici e analitici',
          ],
        },
      ],
    },
    {
      iconKey: 'lock',
      color: 'text-royal-purple',
      title: '3. Come utilizziamo i tuoi dati',
      body: ['Utilizziamo i tuoi dati per:'],
      items: [
        'Fornire e migliorare i nostri servizi AI',
        'Gestire il tuo account e abbonamento',
        'Elaborare pagamenti tramite Stripe',
        'Inviarti comunicazioni relative al servizio',
        "Analizzare l'utilizzo per migliorare la piattaforma",
        'Rispettare obblighi legali',
      ],
      note: 'Non vendiamo mai i tuoi dati a terzi.',
    },
    {
      iconKey: 'globe',
      color: 'text-neon-aqua',
      title: '4. Condivisione dei dati',
      body: ['Condividiamo i tuoi dati solo con:'],
      items: [
        'Stripe: per elaborazione pagamenti sicura',
        'Supabase: per hosting database e autenticazione',
        'OpenAI: per generazione contenuti AI (dati anonimizzati)',
        'Vercel: per hosting della piattaforma',
      ],
      note: 'Tutti i nostri fornitori sono conformi GDPR e offrono adeguate garanzie di sicurezza.',
    },
    {
      iconKey: 'userCheck',
      color: 'text-electric-blue',
      title: '5. I tuoi diritti',
      body: ['In base al GDPR, hai diritto di:'],
      items: [
        'Accesso: richiedere una copia dei tuoi dati',
        'Rettifica: correggere dati inesatti',
        'Cancellazione: richiedere la cancellazione dei tuoi dati',
        'Portabilità: ricevere i tuoi dati in formato leggibile',
        'Opposizione: opporti al trattamento per marketing',
        'Limitazione: limitare il trattamento in certe circostanze',
      ],
      noteKey: 'exerciseRights',
    },
    {
      title: '6. Cookie',
      body: ['Utilizziamo i seguenti tipi di cookie:'],
      items: [
        'Cookie tecnici: necessari per il funzionamento del sito',
        'Cookie di sessione: per mantenere l’autenticazione',
        'Cookie analitici: per comprendere come usi il sito (anonimizzati)',
      ],
      note: 'Puoi gestire le preferenze cookie dal tuo browser.',
    },
    {
      title: '7. Sicurezza dei dati',
      body: ['Implementiamo misure di sicurezza avanzate:'],
      items: [
        'Crittografia SSL/TLS per tutte le comunicazioni',
        'Crittografia dei dati a riposo',
        'Autenticazione a due fattori disponibile',
        'Backup regolari e disaster recovery',
        'Accesso limitato ai dati solo al personale autorizzato',
      ],
    },
    {
      title: '8. Conservazione dei dati',
      body: ['Conserviamo i tuoi dati per il tempo necessario a fornire il servizio:'],
      items: [
        'Dati account: fino alla cancellazione dell’account + 30 giorni',
        'Dati di fatturazione: 10 anni (obblighi fiscali)',
        'Log di sistema: 90 giorni',
        'Contenuti generati: fino alla cancellazione da parte dell’utente',
      ],
    },
    {
      title: '9. Trasferimenti internazionali',
      body: [
        'Alcuni dei nostri fornitori di servizi potrebbero essere situati fuori dall’UE. In questi casi, ci assicuriamo che esistano adeguate garanzie come clausole contrattuali standard o certificazioni equivalenti.',
      ],
    },
    {
      iconKey: 'mail',
      color: 'text-sunset-gold',
      title: '10. Contatti e reclami',
      body: ['Per domande sulla privacy o per esercitare i tuoi diritti:'],
      contacts: ['Email: privacy@propertypilotai.com'],
      noteKey: 'dpaItaly',
    },
  ],
};

export const privacyPolicyPageUiEn: PrivacyPolicyPageUi = {
  title: 'Privacy',
  highlight: 'Policy',
  updated: 'Last updated: December 2024',
  exerciseRightsPrefix: 'To exercise these rights, contact us at ',
  exerciseRightsSuffix: '',
  dpaItalyBefore: '',
  dpaItalyAfter: '',
  dpaLinkHref: 'https://www.garanteprivacy.it',
  dpaLinkLabel: '',
  terms: 'Terms and Conditions',
  refund: 'Refund Policy',
  sections: [
    {
      iconKey: 'eye',
      color: 'text-electric-blue',
      title: '1. General information',
      body: [
        'PropertyPilot AI ("we", "our") respects your privacy and is committed to protecting your personal data. This notice explains how we collect, use, and protect your information in compliance with GDPR and applicable privacy laws.',
        'Data controller: PropertyPilot AI',
        'Email: privacy@propertypilotai.com',
      ],
    },
    {
      iconKey: 'database',
      color: 'text-sunset-gold',
      title: '2. Data we collect',
      body: ['We collect the following categories of data:'],
      lists: [
        {
          title: 'Data provided directly:',
          items: [
            'Full name',
            'Email address',
            'Agency/company name',
            'Payment information (processed by Stripe)',
            'Real estate content submitted for AI generation',
          ],
        },
        {
          title: 'Data collected automatically:',
          items: [
            'IP address',
            'Browser and device type',
            'Visited pages and interactions',
            'Technical and analytics cookies',
          ],
        },
      ],
    },
    {
      iconKey: 'lock',
      color: 'text-royal-purple',
      title: '3. How we use your data',
      body: ['We use your data to:'],
      items: [
        'Provide and improve our AI services',
        'Manage your account and subscription',
        'Process payments through Stripe',
        'Send service-related communications',
        'Analyze usage to improve the platform',
        'Comply with legal obligations',
      ],
      note: 'We never sell your data to third parties.',
    },
    {
      iconKey: 'globe',
      color: 'text-neon-aqua',
      title: '4. Data sharing',
      body: ['We share your data only with:'],
      items: [
        'Stripe: secure payment processing',
        'Supabase: database hosting and authentication',
        'OpenAI: AI content generation (with minimized/anonymous data where possible)',
        'Vercel: platform hosting',
      ],
      note: 'All our providers offer appropriate security guarantees and GDPR-aligned safeguards.',
    },
    {
      iconKey: 'userCheck',
      color: 'text-electric-blue',
      title: '5. Your rights',
      body: ['Under GDPR, you have the right to:'],
      items: [
        'Access: request a copy of your data',
        'Rectification: correct inaccurate data',
        'Erasure: request deletion of your data',
        'Portability: receive your data in a readable format',
        'Objection: object to processing for marketing purposes',
        'Restriction: limit processing in certain circumstances',
      ],
      noteKey: 'exerciseRights',
    },
    {
      title: '6. Cookies',
      body: ['We use the following types of cookies:'],
      items: [
        'Technical cookies: required for site operation',
        'Session cookies: used to maintain authentication',
        'Analytics cookies: to understand how you use the site (anonymized where possible)',
      ],
      note: 'You can manage cookie preferences from your browser.',
    },
    {
      title: '7. Data security',
      body: ['We implement advanced security measures:'],
      items: [
        'SSL/TLS encryption for all communications',
        'Encryption of stored data',
        'Two-factor authentication available',
        'Regular backups and disaster recovery',
        'Restricted data access for authorized personnel only',
      ],
    },
    {
      title: '8. Data retention',
      body: ['We retain your data for the time needed to provide the service:'],
      items: [
        'Account data: until account deletion + 30 days',
        'Billing data: 10 years (tax obligations)',
        'System logs: 90 days',
        'Generated content: until deleted by the user',
      ],
    },
    {
      title: '9. International transfers',
      body: [
        'Some of our service providers may be located outside the EU. In those cases, we ensure appropriate safeguards such as standard contractual clauses or equivalent certifications.',
      ],
    },
    {
      iconKey: 'mail',
      color: 'text-sunset-gold',
      title: '10. Contacts and complaints',
      body: ['For privacy questions or to exercise your rights:'],
      contacts: ['Email: privacy@propertypilotai.com'],
      note: 'You have the right to lodge a complaint with your data protection authority.',
    },
  ],
};
