/** IT/EN here; ES/FR/DE/PT/AR in `onboarding-wizard-locales.ts`. */

export type OnboardingWizardStepUi = {
  title: string;
  description: string;
  details: string[];
};

export type OnboardingWizardUi = {
  steps: [OnboardingWizardStepUi, OnboardingWizardStepUi, OnboardingWizardStepUi];
  readyToStart: string;
  back: string;
  skip: string;
  createFirstListing: string;
  next: string;
};

export const onboardingWizardUiIt: OnboardingWizardUi = {
  steps: [
    {
      title: 'Benvenuto in PropertyPilot AI!',
      description:
        "Sono Aria, la tua assistente AI. Ti guiderò nella creazione del tuo primo annuncio professionale in pochi minuti.",
      details: [
        "Genera annunci professionali con l'AI",
        'Scegli tra vendita, affitto o affitto breve',
        'Ottieni titoli, descrizioni e traduzioni automatiche',
      ],
    },
    {
      title: 'Crea il tuo primo annuncio',
      description:
        "Vai alla sezione «Genera annuncio» e inserisci i dati dell'immobile. L'AI farà tutto il resto!",
      details: [
        '1. Scegli il tipo di transazione (vendita/affitto)',
        '2. Inserisci indirizzo, prezzo e caratteristiche',
        "3. Clicca «Genera» e ricevi l'annuncio in 30 secondi",
      ],
    },
    {
      title: 'Sei pronto a dominare!',
      description:
        'Ora hai tutti gli strumenti per creare annunci professionali che convertono. Buon lavoro!',
      details: [
        'Usa i titoli A/B per massimizzare i click',
        'Esplora gli hashtag AI per i social',
        'Prova il generatore PDF per schede professionali',
      ],
    },
  ],
  readyToStart: 'Pronto a iniziare!',
  back: 'Indietro',
  skip: 'Salta',
  createFirstListing: 'Crea il primo annuncio',
  next: 'Avanti',
};

export const onboardingWizardUiEn: OnboardingWizardUi = {
  steps: [
    {
      title: 'Welcome to PropertyPilot AI!',
      description:
        "I'm Aria, your AI assistant. I'll guide you through creating your first professional listing in just a few minutes.",
      details: [
        'Generate professional listings with AI',
        'Choose between sale, rent, or short-term rental',
        'Get titles, descriptions, and automatic translations',
      ],
    },
    {
      title: 'Create your first listing',
      description:
        "Go to the Generate Listing section and enter the property details. The AI will do the rest!",
      details: [
        '1. Choose the transaction type (sale/rent)',
        '2. Enter address, price, and features',
        "3. Click Generate and receive your listing in 30 seconds",
      ],
    },
    {
      title: "You're ready to dominate!",
      description:
        'You now have all the tools to create professional listings that convert. Good luck!',
      details: [
        'Use A/B titles to maximize clicks',
        'Explore AI hashtags for social media',
        'Try the PDF generator for professional property sheets',
      ],
    },
  ],
  readyToStart: 'Ready to start!',
  back: 'Back',
  skip: 'Skip',
  createFirstListing: 'Create first listing',
  next: 'Next',
};
