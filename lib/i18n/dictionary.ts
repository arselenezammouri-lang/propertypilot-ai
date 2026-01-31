/**
 * PropertyPilot AI - Internationalization Dictionary
 * Support: IT, EN, ES, FR, DE, PT, AR
 */

export type SupportedLocale = 'it' | 'en' | 'es' | 'fr' | 'de' | 'pt' | 'ar';

export interface TranslationDictionary {
  // Dashboard General
  dashboard: {
    title: string;
    subtitle: string;
    loading: string;
    error: string;
    success: string;
  };
  
  // Aura VR Generator
  auraVR: {
    title: string;
    subtitle: string;
    startScan: string;
    processing: {
      analyzing: string;
      mapping: string;
      rendering: string;
      optimizing: string;
      preparing: string;
      finalizing: string;
      complete: string;
    };
    progress: {
      analyzingSub: string;
      mappingSub: string;
      renderingSub: string;
      optimizingSub: string;
      preparingSub: string;
      finalizingSub: string;
      completeSub: string;
    };
    result: {
      title: string;
      subtitle: string;
      linkLabel: string;
      copyLink: string;
      shareWhatsApp: string;
      generateNew: string;
      videoSource: string;
      tourTime: string;
    };
    aria: {
      message: string;
      stats: string;
      action: string;
    };
  };
  
  // Common Actions
  common: {
    copy: string;
    share: string;
    send: string;
    cancel: string;
    confirm: string;
    save: string;
    delete: string;
    edit: string;
    view: string;
  };
  
  // Landing Page
  landing: {
    nav: {
      tagline: string;
      features: string;
      pricing: string;
      compliance: string;
      login: string;
      getStarted: string;
    };
      hero: {
        poweredBy: string;
        titlePart1: string;
        titlePart2: string;
        titleAI: string;
        socialProof: string;
        socialProofAgencies: string;
        socialProofLocation: string;
        subtitle: string;
        ctaStart: string;
        ctaDemo: string;
        trustedBy: string;
        stats: {
          automation: string;
          listingsPerDay: string;
          conversionRate: string;
        };
      };
    features: {
      title: string;
      subtitle: string;
      aiListing: {
        title: string;
        description: string;
        benefit: string;
      };
      crmAI: {
        title: string;
        description: string;
        benefit: string;
      };
      globalReach: {
        title: string;
        description: string;
        benefit: string;
      };
    };
      searchEngine: {
        title: string;
        subtitle: string;
        exclusive: string;
        exclusiveInPlan: string;
        benefit: string;
      step1: {
        title: string;
        description: string;
        status: string;
      };
      step2: {
        title: string;
        description: string;
        status: string;
      };
      step3: {
        title: string;
        description: string;
        status: string;
      };
      step4: {
        title: string;
        description: string;
        status: string;
      };
    };
    tuesdayMorning: {
      title: string;
      subtitle: string;
      time1: string;
      time1Title: string;
      time1Desc: string;
      time2: string;
      time2Title: string;
      time2Desc: string;
      time3: string;
      time3Title: string;
      time3Desc: string;
    };
    testimonials: {
      title: string;
      subtitle: string;
      testimonial1: {
        name: string;
        role: string;
        content: string;
      };
      testimonial2: {
        name: string;
        role: string;
        content: string;
      };
      testimonial3: {
        name: string;
        role: string;
        content: string;
      };
    };
    aria: {
      badge: string;
      title: string;
      subtitle: string;
      mentoring: {
        title: string;
        description: string;
        benefit: string;
      };
      onboarding: {
        title: string;
        description: string;
        benefit: string;
      };
      support: {
        title: string;
        description: string;
        benefit: string;
      };
      available: string;
      availableFree: string;
    };
    pricing: {
      title: string;
      subtitle: string;
      feature: string;
      bestValue: string;
      perMonth: string;
      agencySubtitle: string;
      agencyExtra: string;
      features: {
        listingsPerMonth: string;
        aiGeneration: string;
        aiStyles: string;
        multilingual: string;
        pdf: string;
        crm: string;
        kanban: string;
        leadScoring: string;
        briefing: string;
        staging: string;
        followup: string;
        automations: string;
        forms: string;
        whiteLabel: string;
        assistant: string;
        multiUser: string;
        roles: string;
        distribution: string;
        reports: string;
        multiOffice: string;
        auraVR: string;
        voiceCalling: string;
        messaging: string;
        manualOverride: string;
        humanOverride: string;
        autoProspecting: string;
        scraping: string;
        dashboard: string;
        calendar: string;
        notifications: string;
        support: string;
      };
      plans: {
        free: string;
        starter: string;
        pro: string;
        agency: string;
        unlimited: string;
        advanced: string;
        exclusive: string;
        active: string;
        viewer: string;
        community: string;
        email: string;
        priority: string;
        dedicated: string;
      };
      cta: {
        startFree: string;
        chooseStarter: string;
        choosePro: string;
        chooseAgency: string;
      };
    };
    cta: {
      title: string;
      subtitle: string;
      button: string;
    };
    footer: {
      tagline: string;
      product: string;
      company: string;
      support: string;
      pricing: string;
      dashboard: string;
      features: string;
      about: string;
      contact: string;
      blog: string;
      privacy: string;
      terms: string;
      refund: string;
      copyright: string;
    };
  };
}

export const translations: Record<SupportedLocale, TranslationDictionary> = {
  it: {
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Pannello di controllo',
      loading: 'Caricamento...',
      error: 'Errore',
      success: 'Successo',
    },
    auraVR: {
      title: 'Aura VR Generator',
      subtitle: 'Trasforma un video dello smartphone in un tour VR immersivo 3D',
      startScan: 'Inizia Scansione Aura VR',
      processing: {
        analyzing: '📹 Analisi video in corso...',
        mapping: '🏠 Mappatura stanze in corso...',
        rendering: '🎥 Rendering Cinematico 3D...',
        optimizing: '✨ Ottimizzazione VR per mobile...',
        preparing: '🌐 Preparazione link VR...',
        finalizing: '⚡ Finalizzazione tour immersivo...',
        complete: '✅ Tour VR pronto!',
      },
      progress: {
        analyzingSub: 'Rilevamento frame chiave',
        mappingSub: 'Ricostruzione spaziale 3D',
        renderingSub: 'Generazione texture immersive',
        optimizingSub: 'Compressione e streaming',
        preparingSub: 'Configurazione accesso pubblico',
        finalizingSub: 'Aggiunta effetti cinematici',
        completeSub: 'Link generato con successo',
      },
      result: {
        title: 'Tour VR Generato!',
        subtitle: 'Il tuo tour immersivo è pronto per essere condiviso',
        linkLabel: 'Link VR:',
        copyLink: 'Copia Link',
        shareWhatsApp: 'WhatsApp',
        generateNew: 'Genera nuovo tour',
        videoSource: 'Video smartphone',
        tourTime: 'Tour VR in 60s',
      },
      aria: {
        message: 'Aria: Ottimo lavoro!',
        stats: 'Questa scansione attirerà il',
        action: 'di visite in più. Vuoi che la invii io ai tuoi lead caldi?',
      },
    },
    common: {
      copy: 'Copia',
      share: 'Condividi',
      send: 'Invia',
      cancel: 'Annulla',
      confirm: 'Conferma',
      save: 'Salva',
      delete: 'Elimina',
      edit: 'Modifica',
      view: 'Visualizza',
    },
    landing: {
      nav: {
        tagline: 'Pilot Your Agency to the Next Level',
        features: 'Features',
        pricing: 'Pricing',
        compliance: 'Compliance',
        login: 'Login',
        getStarted: 'Get Started',
      },
      hero: {
        poweredBy: 'Powered by GPT-4',
        titlePart1: 'Il tuo Agente',
        titlePart2: 'Immobiliare',
        titleAI: 'AI',
        socialProof: 'Scelto da',
        socialProofAgencies: '+500 agenzie',
        socialProofLocation: 'in Europa',
        subtitle: "L'unico Sistema Operativo AI che trova, analizza e ottiene mandati in totale autonomia",
        ctaStart: 'Inizia Gratis',
        ctaDemo: 'Vedi Demo',
        trustedBy: 'Compatibile con i principali portali',
        stats: {
          automation: 'Automazione',
          listingsPerDay: 'Annunci/Giorno',
          conversionRate: 'Conversion Rate',
        },
      },
      features: {
        title: 'Why PropertyPilot AI?',
        subtitle: 'La piattaforma AI completa per agenti immobiliari che vogliono scalare',
        aiListing: {
          title: 'AI Listing Engine',
          description: 'Genera annunci professionali in secondi con stili personalizzati (Luxury, Investment, Standard Pro). Multi-lingua e ottimizzato per Zillow, Idealista, Immobiliare.',
          benefit: 'Risparmia 5 ore a settimana su scrittura annunci',
        },
        crmAI: {
          title: 'CRM AI Intelligence',
          description: 'Lead Scoring automatico, follow-up AI multi-canale (WhatsApp, Email, SMS). Categorizza lead HOT/WARM/COLD e suggerisce azioni prioritarie.',
          benefit: 'Aumenta conversioni del 40% con prioritizzazione AI',
        },
        globalReach: {
          title: 'Global Reach',
          description: 'Operiamo su USA (Zillow, MLS), Italia (Idealista, Immobiliare), Spagna (Idealista.es). Terminologia localizzata e formati di mercato.',
          benefit: 'Espandi il tuo business in 3 continenti',
        },
      },
      searchEngine: {
        title: 'Il Motore di Ricerca che non dorme mai',
        subtitle: 'Disponibile',
        exclusive: 'ESCLUSIVAMENTE',
        benefit: 'Risparmia 20 ore di telefonate a settimana',
        step1: {
          title: 'Scansione Globale',
          description: "L'AI scansiona automaticamente Idealista, Immobiliare, Zillow e MLS 24/7, trovando migliaia di annunci ogni giorno.",
          status: 'Scansione in corso...',
        },
        step2: {
          title: 'Filtrazione IA',
          description: 'Ogni annuncio riceve un Lead Score AI (0-100). Solo i "TOP DEAL" (80+) vengono selezionati per le chiamate.',
          status: 'TOP DEAL rilevato',
        },
        step3: {
          title: 'Chiamata Automatica',
          description: 'Voice AI (Bland AI) chiama i proprietari, gestisce obiezioni e propone appuntamenti in modo naturale e persuasivo.',
          status: 'Chiamata in corso...',
        },
        step4: {
          title: 'Appuntamento in Agenda',
          description: "L'appuntamento viene automaticamente aggiunto al tuo Google Calendar e ricevi una notifica email con tutti i dettagli.",
          status: 'Appuntamento confermato',
        },
      },
      tuesdayMorning: {
        title: 'Il tuo nuovo Martedì mattina',
        subtitle: 'Immagina di svegliarti con il lavoro già fatto',
        time1: 'Ore 08:00',
        time1Title: "L'IA ha già analizzato 500 annunci",
        time1Desc: "Mentre dormivi, il sistema ha scansionato Idealista, Immobiliare, Zillow e MLS. Ogni annuncio è stato analizzato e classificato con un Lead Score AI.",
        time2: 'Ore 08:30',
        time2Title: '3 proprietari hanno confermato la visita',
        time2Desc: 'Voice AI ha chiamato i proprietari dei TOP DEAL (score 80+). Tre hanno già confermato la disponibilità per una visita questa settimana.',
        time3: 'Ore 09:00',
        time3Title: "Ti svegli e apri l'agenda già piena",
        time3Desc: 'Apri PropertyPilot AI e trovi 3 appuntamenti già in calendario, con tutti i dettagli dell\'immobile, contatti del proprietario e note AI.',
      },
      testimonials: {
        title: 'Loved by Agents Worldwide',
        subtitle: 'Migliaia di agenti immobiliari si fidano di PropertyPilot AI',
        testimonial1: {
          name: 'Marco Rossi',
          role: 'Agente Immobiliare, Milano',
          content: 'PropertyPilot AI ha triplicato i miei affari. Il Lead Scoring AI mi dice esattamente su quali lead concentrarmi.',
        },
        testimonial2: {
          name: 'Sarah Johnson',
          role: 'Real Estate Agent, Miami',
          content: 'La funzione di generazione annunci è incredibile. Creo listing professionali in 30 secondi invece di ore.',
        },
        testimonial3: {
          name: 'Carlos Garcia',
          role: 'Agente, Barcelona',
          content: 'Il CRM AI è un game-changer. I follow-up automatici mi fanno risparmiare 10 ore a settimana.',
        },
      },
      aria: {
        badge: 'Disponibile in tutti i piani',
        title: 'Aria - Your AI Success Partner',
        subtitle: 'Il tuo coach personale, sempre disponibile. Onboarding, strategia, motivazione: tutto in una chat.',
        mentoring: {
          title: 'Mentoring 24/7',
          description: 'Mai più solo nelle trattative. Aria ti guida passo dopo passo, anche quando il cliente fa obiezioni difficili.',
          benefit: 'Riduci lo stress e aumenta la sicurezza',
        },
        onboarding: {
          title: 'Onboarding Istantaneo',
          description: 'Impara a dominare PropertyPilot in 5 minuti parlando con Aria. Nessun tutorial lungo, solo conversazione naturale.',
          benefit: 'Diventa produttivo da subito',
        },
        support: {
          title: 'Supporto Psicologico',
          description: "L'alleata che ti motiva a chiudere quel mandato quando la sfida si fa dura. Aria conosce la psicologia delle vendite.",
          benefit: 'Mantieni alta la motivazione',
        },
        available: 'Aria è sempre disponibile. Clicca sulla bolla in basso a destra per iniziare.',
        availableFree: 'Disponibile anche nel piano FREE',
      },
      pricing: {
        title: 'Prezzi',
        subtitle: 'Confronta i piani e scegli quello perfetto per il tuo business',
        feature: 'Funzionalità',
        bestValue: 'BEST VALUE',
        perMonth: '/mese',
        agencySubtitle: 'Omnichannel Domination Suite',
        agencyExtra: '+ Modulo Commerciale & Arbitraggio Esteso',
        features: {
          listingsPerMonth: 'Annunci al mese',
          aiGeneration: 'Generazione Annunci AI',
          aiStyles: 'Stili AI (Luxury, Investment, Pro)',
          multilingual: 'Multi-lingua (IT, EN, ES)',
          pdf: 'PDF Professionali',
          crm: 'CRM Completo',
          kanban: 'Pipeline Kanban',
          leadScoring: 'Lead Scoring AI Base',
          briefing: 'Smart Briefing Multi-Categoria',
          staging: 'Virtual Staging 3D',
          followup: 'Follow-up AI Multi-canale',
          automations: 'Automazioni AI',
          forms: 'Smart Lead Capture Forms',
          whiteLabel: 'White-label PDF',
          assistant: 'Agency Assistant AI',
          multiUser: 'Multi-utente',
          roles: 'Ruoli e Permessi',
          distribution: 'Distribuzione Lead Automatica',
          reports: 'Report Attività Team',
          multiOffice: 'Integrazione Multi-sede',
          auraVR: '🥽 Aura VR: Cinematic Virtual Tour Generation',
          voiceCalling: 'AI Voice Calling (Bland AI)',
          messaging: 'AI Smart Messaging (SMS/WhatsApp AI)',
          manualOverride: 'Manual Override: Accesso diretto dati proprietario',
          humanOverride: "Libertà d'intervento umano",
          autoProspecting: 'Auto-Prospecting 24/7',
          scraping: 'Scraping Intelligente',
          dashboard: 'Dashboard War Room',
          calendar: 'Google Calendar Integration',
          notifications: 'Notifiche Email Automatiche',
          support: 'Supporto',
        },
        plans: {
          free: 'FREE',
          starter: 'STARTER',
          pro: 'PRO',
          agency: 'AGENCY',
          unlimited: 'Illimitati',
          advanced: 'Avanzato',
          exclusive: 'ESCLUSIVO',
          active: 'Attivo',
          viewer: 'Visualizzatore',
          community: 'Community',
          email: 'Email',
          priority: 'Prioritario',
          dedicated: 'Dedicato 24/7',
        },
        cta: {
          startFree: 'Inizia Gratis',
          chooseStarter: 'Scegli Starter',
          choosePro: 'Scegli Pro',
          chooseAgency: 'Scegli Agency',
        },
      },
      cta: {
        title: 'Pronto a moltiplicare i tuoi affari?',
        subtitle: 'Unisciti a centinaia di agenti che già usano PropertyPilot AI',
        button: 'Get Started Gratis',
      },
      footer: {
        tagline: 'Il tuo Agente Immobiliare AI che lavora 24/7',
        product: 'Prodotto',
        company: 'Azienda',
        support: 'Supporto',
        pricing: 'Pricing',
        dashboard: 'Dashboard',
        features: 'Features',
        about: 'Chi Siamo',
        contact: 'Contatti',
        blog: 'Blog',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
        refund: 'Refund Policy',
        copyright: 'Tutti i diritti riservati.',
      },
    },
  },
  
  en: {
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Control Panel',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
    },
    auraVR: {
      title: 'Aura VR Generator',
      subtitle: 'Transform a smartphone video into an immersive 3D VR tour',
      startScan: 'Start Aura VR Scan',
      processing: {
        analyzing: '📹 Analyzing video...',
        mapping: '🏠 Mapping rooms...',
        rendering: '🎥 Cinematic 3D Rendering...',
        optimizing: '✨ Optimizing VR for mobile...',
        preparing: '🌐 Preparing VR link...',
        finalizing: '⚡ Finalizing immersive tour...',
        complete: '✅ VR Tour Ready!',
      },
      progress: {
        analyzingSub: 'Key frame detection',
        mappingSub: '3D spatial reconstruction',
        renderingSub: 'Generating immersive textures',
        optimizingSub: 'Compression and streaming',
        preparingSub: 'Configuring public access',
        finalizingSub: 'Adding cinematic effects',
        completeSub: 'Link generated successfully',
      },
      result: {
        title: 'VR Tour Generated!',
        subtitle: 'Your immersive tour is ready to share',
        linkLabel: 'VR Link:',
        copyLink: 'Copy Link',
        shareWhatsApp: 'WhatsApp',
        generateNew: 'Generate new tour',
        videoSource: 'Smartphone video',
        tourTime: 'VR Tour in 60s',
      },
      aria: {
        message: 'Aria: Great work!',
        stats: 'This scan will attract',
        action: 'more visits. Would you like me to send it to your hot leads?',
      },
    },
    common: {
      copy: 'Copy',
      share: 'Share',
      send: 'Send',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
    },
    landing: {
      nav: {
        tagline: 'Pilot Your Agency to the Next Level',
        features: 'Features',
        pricing: 'Pricing',
        compliance: 'Compliance',
        login: 'Login',
        getStarted: 'Get Started',
      },
      hero: {
        poweredBy: 'Powered by GPT-4',
        titlePart1: 'Your Real Estate',
        titlePart2: 'Agent',
        titleAI: 'AI',
        socialProof: 'Trusted by',
        socialProofAgencies: '+500 agencies',
        socialProofLocation: 'in Europe',
        subtitle: 'The only AI Operating System that finds, analyzes, and secures mandates completely autonomously',
        ctaStart: 'Start Free',
        ctaDemo: 'View Demo',
        trustedBy: 'Compatible with major portals',
        stats: {
          automation: 'Automation',
          listingsPerDay: 'Listings/Day',
          conversionRate: 'Conversion Rate',
        },
      },
      features: {
        title: 'Why PropertyPilot AI?',
        subtitle: 'The complete AI platform for real estate agents who want to scale',
        aiListing: {
          title: 'AI Listing Engine',
          description: 'Generate professional listings in seconds with custom styles (Luxury, Investment, Standard Pro). Multi-language and optimized for Zillow, Idealista, Immobiliare.',
          benefit: 'Save 5 hours per week on listing writing',
        },
        crmAI: {
          title: 'CRM AI Intelligence',
          description: 'Automatic Lead Scoring, multi-channel AI follow-up (WhatsApp, Email, SMS). Categorizes HOT/WARM/COLD leads and suggests priority actions.',
          benefit: 'Increase conversions by 40% with AI prioritization',
        },
        globalReach: {
          title: 'Global Reach',
          description: 'We operate in USA (Zillow, MLS), Italy (Idealista, Immobiliare), Spain (Idealista.es). Localized terminology and market formats.',
          benefit: 'Expand your business across 3 continents',
        },
      },
      searchEngine: {
        title: 'The Search Engine That Never Sleeps',
        subtitle: 'Available',
        exclusive: 'EXCLUSIVELY',
        exclusiveInPlan: 'in the AGENCY plan',
        benefit: 'Save 20 hours of phone calls per week',
        step1: {
          title: 'Global Scan',
          description: 'AI automatically scans Idealista, Immobiliare, Zillow, and MLS 24/7, finding thousands of listings every day.',
          status: 'Scanning in progress...',
        },
        step2: {
          title: 'AI Filtering',
          description: 'Each listing receives an AI Lead Score (0-100). Only "TOP DEAL" (80+) are selected for calls.',
          status: 'TOP DEAL detected',
        },
        step3: {
          title: 'Automatic Call',
          description: 'Voice AI (Bland AI) calls owners, handles objections, and proposes appointments naturally and persuasively.',
          status: 'Call in progress...',
        },
        step4: {
          title: 'Appointment in Calendar',
          description: 'The appointment is automatically added to your Google Calendar and you receive an email notification with all details.',
          status: 'Appointment confirmed',
        },
      },
      tuesdayMorning: {
        title: 'Your New Tuesday Morning',
        subtitle: 'Imagine waking up with the work already done',
        time1: '08:00 AM',
        time1Title: 'AI has already analyzed 500 listings',
        time1Desc: 'While you slept, the system scanned Idealista, Immobiliare, Zillow, and MLS. Each listing was analyzed and classified with an AI Lead Score.',
        time2: '08:30 AM',
        time2Title: '3 owners have confirmed the visit',
        time2Desc: 'Voice AI called the owners of TOP DEALs (score 80+). Three have already confirmed availability for a visit this week.',
        time3: '09:00 AM',
        time3Title: 'You wake up and open your already full calendar',
        time3Desc: 'Open PropertyPilot AI and find 3 appointments already scheduled, with all property details, owner contacts, and AI notes.',
      },
      testimonials: {
        title: 'Loved by Agents Worldwide',
        subtitle: 'Thousands of real estate agents trust PropertyPilot AI',
        testimonial1: {
          name: 'Marco Rossi',
          role: 'Real Estate Agent, Milan',
          content: 'PropertyPilot AI has tripled my business. The AI Lead Scoring tells me exactly which leads to focus on.',
        },
        testimonial2: {
          name: 'Sarah Johnson',
          role: 'Real Estate Agent, Miami',
          content: 'The listing generation feature is incredible. I create professional listings in 30 seconds instead of hours.',
        },
        testimonial3: {
          name: 'Carlos Garcia',
          role: 'Agent, Barcelona',
          content: 'The AI CRM is a game-changer. Automatic follow-ups save me 10 hours per week.',
        },
      },
      aria: {
        badge: 'Available in all plans',
        title: 'Aria - Your AI Success Partner',
        subtitle: 'Your personal coach, always available. Onboarding, strategy, motivation: everything in one chat.',
        mentoring: {
          title: '24/7 Mentoring',
          description: 'Never alone in negotiations again. Aria guides you step by step, even when the client raises difficult objections.',
          benefit: 'Reduce stress and increase confidence',
        },
        onboarding: {
          title: 'Instant Onboarding',
          description: 'Learn to master PropertyPilot in 5 minutes by talking to Aria. No long tutorials, just natural conversation.',
          benefit: 'Become productive immediately',
        },
        support: {
          title: 'Psychological Support',
          description: 'The ally that motivates you to close that mandate when the challenge gets tough. Aria knows sales psychology.',
          benefit: 'Keep motivation high',
        },
        available: 'Aria is always available. Click the bubble in the bottom right to start.',
        availableFree: 'Also available in the FREE plan',
      },
      pricing: {
        title: 'Pricing',
        subtitle: 'Compare plans and choose the perfect one for your business',
        feature: 'Feature',
        bestValue: 'BEST VALUE',
        perMonth: '/month',
        agencySubtitle: 'Omnichannel Domination Suite',
        agencyExtra: '+ Commercial Module & Extended Arbitrage',
        features: {
          listingsPerMonth: 'Listings per month',
          aiGeneration: 'AI Listing Generation',
          aiStyles: 'AI Styles (Luxury, Investment, Pro)',
          multilingual: 'Multi-language (IT, EN, ES)',
          pdf: 'Professional PDFs',
          crm: 'Complete CRM',
          kanban: 'Kanban Pipeline',
          leadScoring: 'Base AI Lead Scoring',
          briefing: 'Multi-Category Smart Briefing',
          staging: '3D Virtual Staging',
          followup: 'Multi-channel AI Follow-up',
          automations: 'AI Automations',
          forms: 'Smart Lead Capture Forms',
          whiteLabel: 'White-label PDF',
          assistant: 'Agency Assistant AI',
          multiUser: 'Multi-user',
          roles: 'Roles and Permissions',
          distribution: 'Automatic Lead Distribution',
          reports: 'Team Activity Reports',
          multiOffice: 'Multi-office Integration',
          auraVR: '🥽 Aura VR: Cinematic Virtual Tour Generation',
          voiceCalling: 'AI Voice Calling (Bland AI)',
          messaging: 'AI Smart Messaging (SMS/WhatsApp AI)',
          manualOverride: 'Manual Override: Direct owner data access',
          humanOverride: 'Human intervention freedom',
          autoProspecting: '24/7 Auto-Prospecting',
          scraping: 'Intelligent Scraping',
          dashboard: 'War Room Dashboard',
          calendar: 'Google Calendar Integration',
          notifications: 'Automatic Email Notifications',
          support: 'Support',
        },
        plans: {
          free: 'FREE',
          starter: 'STARTER',
          pro: 'PRO',
          agency: 'AGENCY',
          unlimited: 'Unlimited',
          advanced: 'Advanced',
          exclusive: 'EXCLUSIVE',
          active: 'Active',
          viewer: 'Viewer',
          community: 'Community',
          email: 'Email',
          priority: 'Priority',
          dedicated: 'Dedicated 24/7',
        },
        cta: {
          startFree: 'Start Free',
          chooseStarter: 'Choose Starter',
          choosePro: 'Choose Pro',
          chooseAgency: 'Choose Agency',
        },
      },
      cta: {
        title: 'Ready to multiply your business?',
        subtitle: 'Join hundreds of agents already using PropertyPilot AI',
        button: 'Get Started Free',
      },
      footer: {
        tagline: 'Your Real Estate AI Agent that works 24/7',
        product: 'Product',
        company: 'Company',
        support: 'Support',
        pricing: 'Pricing',
        dashboard: 'Dashboard',
        features: 'Features',
        about: 'About Us',
        contact: 'Contact',
        blog: 'Blog',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
        refund: 'Refund Policy',
        copyright: 'All rights reserved.',
      },
    },
  },
  
  es: {
    dashboard: {
      title: 'Panel de Control',
      subtitle: 'Tablero de mandos',
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito',
    },
    auraVR: {
      title: 'Generador Aura VR',
      subtitle: 'Transforma un video del smartphone en un tour VR inmersivo 3D',
      startScan: 'Iniciar Escaneo Aura VR',
      processing: {
        analyzing: '📹 Analizando video...',
        mapping: '🏠 Mapeando habitaciones...',
        rendering: '🎥 Renderizado Cinematográfico 3D...',
        optimizing: '✨ Optimizando VR para móvil...',
        preparing: '🌐 Preparando enlace VR...',
        finalizing: '⚡ Finalizando tour inmersivo...',
        complete: '✅ ¡Tour VR Listo!',
      },
      progress: {
        analyzingSub: 'Detección de frames clave',
        mappingSub: 'Reconstrucción espacial 3D',
        renderingSub: 'Generando texturas inmersivas',
        optimizingSub: 'Compresión y streaming',
        preparingSub: 'Configurando acceso público',
        finalizingSub: 'Añadiendo efectos cinematográficos',
        completeSub: 'Enlace generado con éxito',
      },
      result: {
        title: '¡Tour VR Generado!',
        subtitle: 'Tu tour inmersivo está listo para compartir',
        linkLabel: 'Enlace VR:',
        copyLink: 'Copiar Enlace',
        shareWhatsApp: 'WhatsApp',
        generateNew: 'Generar nuevo tour',
        videoSource: 'Video smartphone',
        tourTime: 'Tour VR en 60s',
      },
      aria: {
        message: 'Aria: ¡Excelente trabajo!',
        stats: 'Este escaneo atraerá un',
        action: 'más de visitas. ¿Quieres que lo envíe a tus leads calientes?',
      },
    },
    common: {
      copy: 'Copiar',
      share: 'Compartir',
      send: 'Enviar',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      save: 'Guardar',
      delete: 'Eliminar',
      edit: 'Editar',
      view: 'Ver',
    },
    landing: {
      nav: {
        tagline: 'Pilot Your Agency to the Next Level',
        features: 'Características',
        pricing: 'Precios',
        compliance: 'Cumplimiento',
        login: 'Iniciar Sesión',
        getStarted: 'Comenzar',
      },
      hero: {
        poweredBy: 'Impulsado por GPT-4',
        titlePart1: 'Tu Agente',
        titlePart2: 'Inmobiliario',
        titleAI: 'IA',
        socialProof: 'Elegido por',
        socialProofAgencies: '+500 agencias',
        socialProofLocation: 'en Europa',
        subtitle: 'El único Sistema Operativo IA que encuentra, analiza y obtiene mandatos de forma totalmente autónoma',
        ctaStart: 'Empezar Gratis',
        ctaDemo: 'Ver Demo',
        trustedBy: 'Compatible con los principales portales',
        stats: {
          automation: 'Automatización',
          listingsPerDay: 'Anuncios/Día',
          conversionRate: 'Tasa de Conversión',
        },
      },
      features: {
        title: '¿Por qué PropertyPilot AI?',
        subtitle: 'La plataforma IA completa para agentes inmobiliarios que quieren escalar',
        aiListing: {
          title: 'Motor de Anuncios IA',
          description: 'Genera anuncios profesionales en segundos con estilos personalizados (Lujo, Inversión, Estándar Pro). Multiidioma y optimizado para Zillow, Idealista, Immobiliare.',
          benefit: 'Ahorra 5 horas a la semana en escritura de anuncios',
        },
        crmAI: {
          title: 'Inteligencia CRM IA',
          description: 'Puntuación de Leads automática, seguimiento IA multicanal (WhatsApp, Email, SMS). Categoriza leads CALIENTES/TIBIOS/FRÍOS y sugiere acciones prioritarias.',
          benefit: 'Aumenta conversiones en un 40% con priorización IA',
        },
        globalReach: {
          title: 'Alcance Global',
          description: 'Operamos en USA (Zillow, MLS), Italia (Idealista, Immobiliare), España (Idealista.es). Terminología localizada y formatos de mercado.',
          benefit: 'Expande tu negocio en 3 continentes',
        },
      },
      searchEngine: {
        title: 'El Motor de Búsqueda que Nunca Duerme',
        subtitle: 'Disponible',
        exclusive: 'EXCLUSIVAMENTE',
        exclusiveInPlan: 'en el plan AGENCY',
        benefit: 'Ahorra 20 horas de llamadas telefónicas a la semana',
        step1: {
          title: 'Escaneo Global',
          description: 'La IA escanea automáticamente Idealista, Immobiliare, Zillow y MLS 24/7, encontrando miles de anuncios cada día.',
          status: 'Escaneo en curso...',
        },
        step2: {
          title: 'Filtrado IA',
          description: 'Cada anuncio recibe una Puntuación de Lead IA (0-100). Solo los "TOP DEAL" (80+) se seleccionan para llamadas.',
          status: 'TOP DEAL detectado',
        },
        step3: {
          title: 'Llamada Automática',
          description: 'Voice IA (Bland AI) llama a los propietarios, gestiona objeciones y propone citas de forma natural y persuasiva.',
          status: 'Llamada en curso...',
        },
        step4: {
          title: 'Cita en Agenda',
          description: 'La cita se añade automáticamente a tu Google Calendar y recibes una notificación por email con todos los detalles.',
          status: 'Cita confirmada',
        },
      },
      tuesdayMorning: {
        title: 'Tu Nuevo Martes por la Mañana',
        subtitle: 'Imagina despertar con el trabajo ya hecho',
        time1: '08:00',
        time1Title: 'La IA ya ha analizado 500 anuncios',
        time1Desc: 'Mientras dormías, el sistema escaneó Idealista, Immobiliare, Zillow y MLS. Cada anuncio fue analizado y clasificado con una Puntuación de Lead IA.',
        time2: '08:30',
        time2Title: '3 propietarios han confirmado la visita',
        time2Desc: 'Voice IA llamó a los propietarios de TOP DEALs (puntuación 80+). Tres ya han confirmado disponibilidad para una visita esta semana.',
        time3: '09:00',
        time3Title: 'Te despiertas y abres la agenda ya llena',
        time3Desc: 'Abre PropertyPilot AI y encuentra 3 citas ya programadas, con todos los detalles de la propiedad, contactos del propietario y notas IA.',
      },
      testimonials: {
        title: 'Amado por Agentes en Todo el Mundo',
        subtitle: 'Miles de agentes inmobiliarios confían en PropertyPilot AI',
        testimonial1: {
          name: 'Marco Rossi',
          role: 'Agente Inmobiliario, Milán',
          content: 'PropertyPilot AI ha triplicado mis negocios. La Puntuación de Leads IA me dice exactamente en qué leads concentrarme.',
        },
        testimonial2: {
          name: 'Sarah Johnson',
          role: 'Agente Inmobiliario, Miami',
          content: 'La función de generación de anuncios es increíble. Creo anuncios profesionales en 30 segundos en lugar de horas.',
        },
        testimonial3: {
          name: 'Carlos Garcia',
          role: 'Agente, Barcelona',
          content: 'El CRM IA es un cambio de juego. Los seguimientos automáticos me ahorran 10 horas a la semana.',
        },
      },
      aria: {
        badge: 'Disponible en todos los planes',
        title: 'Aria - Tu Socio de Éxito IA',
        subtitle: 'Tu coach personal, siempre disponible. Onboarding, estrategia, motivación: todo en un chat.',
        mentoring: {
          title: 'Mentoría 24/7',
          description: 'Nunca más solo en las negociaciones. Aria te guía paso a paso, incluso cuando el cliente plantea objeciones difíciles.',
          benefit: 'Reduce el estrés y aumenta la confianza',
        },
        onboarding: {
          title: 'Onboarding Instantáneo',
          description: 'Aprende a dominar PropertyPilot en 5 minutos hablando con Aria. Sin tutoriales largos, solo conversación natural.',
          benefit: 'Conviértete en productivo de inmediato',
        },
        support: {
          title: 'Apoyo Psicológico',
          description: 'La aliada que te motiva a cerrar ese mandato cuando el desafío se vuelve difícil. Aria conoce la psicología de las ventas.',
          benefit: 'Mantén alta la motivación',
        },
        available: 'Aria está siempre disponible. Haz clic en la burbuja en la esquina inferior derecha para comenzar.',
        availableFree: 'También disponible en el plan GRATIS',
      },
      pricing: {
        title: 'Precios',
        subtitle: 'Compara los planes y elige el perfecto para tu negocio',
        feature: 'Característica',
        bestValue: 'MEJOR VALOR',
        perMonth: '/mes',
        agencySubtitle: 'Suite de Dominación Omnicanal',
        agencyExtra: '+ Módulo Comercial y Arbitraje Extendido',
        features: {
          listingsPerMonth: 'Anuncios al mes',
          aiGeneration: 'Generación de Anuncios IA',
          aiStyles: 'Estilos IA (Lujo, Inversión, Pro)',
          multilingual: 'Multiidioma (IT, EN, ES)',
          pdf: 'PDFs Profesionales',
          crm: 'CRM Completo',
          kanban: 'Pipeline Kanban',
          leadScoring: 'Puntuación de Leads IA Base',
          briefing: 'Briefing Inteligente Multi-Categoría',
          staging: 'Virtual Staging 3D',
          followup: 'Seguimiento IA Multicanal',
          automations: 'Automatizaciones IA',
          forms: 'Formularios de Captura de Leads Inteligentes',
          whiteLabel: 'PDF White-label',
          assistant: 'Asistente IA de Agencia',
          multiUser: 'Multi-usuario',
          roles: 'Roles y Permisos',
          distribution: 'Distribución Automática de Leads',
          reports: 'Informes de Actividad del Equipo',
          multiOffice: 'Integración Multi-sede',
          auraVR: '🥽 Aura VR: Generación de Tour Virtual Cinematográfico',
          voiceCalling: 'Llamadas de Voz IA (Bland AI)',
          messaging: 'Mensajería Inteligente IA (SMS/WhatsApp IA)',
          manualOverride: 'Anulación Manual: Acceso directo a datos del propietario',
          humanOverride: 'Libertad de intervención humana',
          autoProspecting: 'Auto-Prospección 24/7',
          scraping: 'Scraping Inteligente',
          dashboard: 'Dashboard War Room',
          calendar: 'Integración con Google Calendar',
          notifications: 'Notificaciones por Email Automáticas',
          support: 'Soporte',
        },
        plans: {
          free: 'GRATIS',
          starter: 'STARTER',
          pro: 'PRO',
          agency: 'AGENCY',
          unlimited: 'Ilimitados',
          advanced: 'Avanzado',
          exclusive: 'EXCLUSIVO',
          active: 'Activo',
          viewer: 'Visualizador',
          community: 'Comunidad',
          email: 'Email',
          priority: 'Prioritario',
          dedicated: 'Dedicado 24/7',
        },
        cta: {
          startFree: 'Empezar Gratis',
          chooseStarter: 'Elegir Starter',
          choosePro: 'Elegir Pro',
          chooseAgency: 'Elegir Agency',
        },
      },
      cta: {
        title: '¿Listo para multiplicar tus negocios?',
        subtitle: 'Únete a cientos de agentes que ya usan PropertyPilot AI',
        button: 'Empezar Gratis',
      },
      footer: {
        tagline: 'Tu Agente Inmobiliario IA que trabaja 24/7',
        product: 'Producto',
        company: 'Empresa',
        support: 'Soporte',
        pricing: 'Precios',
        dashboard: 'Panel',
        features: 'Características',
        about: 'Sobre Nosotros',
        contact: 'Contacto',
        blog: 'Blog',
        privacy: 'Política de Privacidad',
        terms: 'Términos de Servicio',
        refund: 'Política de Reembolso',
        copyright: 'Todos los derechos reservados.',
      },
    },
  },
  
  fr: {
    dashboard: {
      title: 'Tableau de Bord',
      subtitle: 'Panneau de contrôle',
      loading: 'Chargement...',
      error: 'Erreur',
      success: 'Succès',
    },
    auraVR: {
      title: 'Générateur Aura VR',
      subtitle: 'Transformez une vidéo smartphone en visite VR immersive 3D',
      startScan: 'Démarrer Scan Aura VR',
      processing: {
        analyzing: '📹 Analyse vidéo en cours...',
        mapping: '🏠 Cartographie des pièces...',
        rendering: '🎥 Rendu Cinématique 3D...',
        optimizing: '✨ Optimisation VR pour mobile...',
        preparing: '🌐 Préparation du lien VR...',
        finalizing: '⚡ Finalisation de la visite immersive...',
        complete: '✅ Visite VR Prête!',
      },
      progress: {
        analyzingSub: 'Détection des images clés',
        mappingSub: 'Reconstruction spatiale 3D',
        renderingSub: 'Génération de textures immersives',
        optimizingSub: 'Compression et streaming',
        preparingSub: 'Configuration de l\'accès public',
        finalizingSub: 'Ajout d\'effets cinématographiques',
        completeSub: 'Lien généré avec succès',
      },
      result: {
        title: 'Visite VR Générée!',
        subtitle: 'Votre visite immersive est prête à être partagée',
        linkLabel: 'Lien VR:',
        copyLink: 'Copier le Lien',
        shareWhatsApp: 'WhatsApp',
        generateNew: 'Générer une nouvelle visite',
        videoSource: 'Vidéo smartphone',
        tourTime: 'Visite VR en 60s',
      },
      aria: {
        message: 'Aria: Excellent travail!',
        stats: 'Ce scan attirera',
        action: 'de visites en plus. Voulez-vous que je l\'envoie à vos leads chauds?',
      },
    },
    common: {
      copy: 'Copier',
      share: 'Partager',
      send: 'Envoyer',
      cancel: 'Annuler',
      confirm: 'Confirmer',
      save: 'Enregistrer',
      delete: 'Supprimer',
      edit: 'Modifier',
      view: 'Voir',
    },
    landing: {
      nav: {
        tagline: 'Pilot Your Agency to the Next Level',
        features: 'Fonctionnalités',
        pricing: 'Tarifs',
        compliance: 'Conformité',
        login: 'Connexion',
        getStarted: 'Commencer',
      },
      hero: {
        poweredBy: 'Alimenté par GPT-4',
        titlePart1: 'Votre Agent',
        titlePart2: 'Immobilier',
        titleAI: 'IA',
        socialProof: 'Choisi par',
        socialProofAgencies: '+500 agences',
        socialProofLocation: 'en Europe',
        subtitle: 'Le seul Système d\'Exploitation IA qui trouve, analyse et obtient des mandats de manière totalement autonome',
        ctaStart: 'Commencer Gratuitement',
        ctaDemo: 'Voir la Démo',
        trustedBy: 'Compatible avec les principaux portails',
        stats: {
          automation: 'Automatisation',
          listingsPerDay: 'Annonces/Jour',
          conversionRate: 'Taux de Conversion',
        },
      },
      features: {
        title: 'Pourquoi PropertyPilot AI?',
        subtitle: 'La plateforme IA complète pour les agents immobiliers qui veulent évoluer',
        aiListing: {
          title: 'Moteur d\'Annonces IA',
          description: 'Générez des annonces professionnelles en secondes avec des styles personnalisés (Luxe, Investissement, Standard Pro). Multilingue et optimisé pour Zillow, Idealista, Immobiliare.',
          benefit: 'Économisez 5 heures par semaine sur l\'écriture d\'annonces',
        },
        crmAI: {
          title: 'Intelligence CRM IA',
          description: 'Scoring de Leads automatique, suivi IA multicanal (WhatsApp, Email, SMS). Catégorise les leads CHAUD/TIÈDE/FROID et suggère des actions prioritaires.',
          benefit: 'Augmentez les conversions de 40% avec la priorisation IA',
        },
        globalReach: {
          title: 'Portée Mondiale',
          description: 'Nous opérons aux USA (Zillow, MLS), en Italie (Idealista, Immobiliare), en Espagne (Idealista.es). Terminologie localisée et formats de marché.',
          benefit: 'Développez votre activité sur 3 continents',
        },
      },
      searchEngine: {
        title: 'Le Moteur de Recherche qui ne Dort Jamais',
        subtitle: 'Disponible',
        exclusive: 'EXCLUSIVEMENT',
        exclusiveInPlan: 'dans le plan AGENCY',
        benefit: 'Économisez 20 heures d\'appels téléphoniques par semaine',
        step1: {
          title: 'Scan Global',
          description: 'L\'IA scanne automatiquement Idealista, Immobiliare, Zillow et MLS 24/7, trouvant des milliers d\'annonces chaque jour.',
          status: 'Scan en cours...',
        },
        step2: {
          title: 'Filtrage IA',
          description: 'Chaque annonce reçoit un Score de Lead IA (0-100). Seuls les "TOP DEAL" (80+) sont sélectionnés pour les appels.',
          status: 'TOP DEAL détecté',
        },
        step3: {
          title: 'Appel Automatique',
          description: 'Voice IA (Bland AI) appelle les propriétaires, gère les objections et propose des rendez-vous de manière naturelle et persuasive.',
          status: 'Appel en cours...',
        },
        step4: {
          title: 'Rendez-vous dans l\'Agenda',
          description: 'Le rendez-vous est automatiquement ajouté à votre Google Calendar et vous recevez une notification email avec tous les détails.',
          status: 'Rendez-vous confirmé',
        },
      },
      tuesdayMorning: {
        title: 'Votre Nouveau Mardi Matin',
        subtitle: 'Imaginez vous réveiller avec le travail déjà fait',
        time1: '08h00',
        time1Title: 'L\'IA a déjà analysé 500 annonces',
        time1Desc: 'Pendant que vous dormiez, le système a scanné Idealista, Immobiliare, Zillow et MLS. Chaque annonce a été analysée et classée avec un Score de Lead IA.',
        time2: '08h30',
        time2Title: '3 propriétaires ont confirmé la visite',
        time2Desc: 'Voice IA a appelé les propriétaires des TOP DEALs (score 80+). Trois ont déjà confirmé leur disponibilité pour une visite cette semaine.',
        time3: '09h00',
        time3Title: 'Vous vous réveillez et ouvrez l\'agenda déjà plein',
        time3Desc: 'Ouvrez PropertyPilot AI et trouvez 3 rendez-vous déjà programmés, avec tous les détails du bien, contacts du propriétaire et notes IA.',
      },
      testimonials: {
        title: 'Aimé par les Agents du Monde Entier',
        subtitle: 'Des milliers d\'agents immobiliers font confiance à PropertyPilot AI',
        testimonial1: {
          name: 'Marco Rossi',
          role: 'Agent Immobilier, Milan',
          content: 'PropertyPilot AI a triplé mes affaires. Le Scoring de Leads IA me dit exactement sur quels leads me concentrer.',
        },
        testimonial2: {
          name: 'Sarah Johnson',
          role: 'Agent Immobilier, Miami',
          content: 'La fonction de génération d\'annonces est incroyable. Je crée des annonces professionnelles en 30 secondes au lieu d\'heures.',
        },
        testimonial3: {
          name: 'Carlos Garcia',
          role: 'Agent, Barcelone',
          content: 'Le CRM IA est un changement de jeu. Les suivis automatiques me font économiser 10 heures par semaine.',
        },
      },
      aria: {
        badge: 'Disponible dans tous les plans',
        title: 'Aria - Votre Partenaire de Succès IA',
        subtitle: 'Votre coach personnel, toujours disponible. Onboarding, stratégie, motivation: tout dans un chat.',
        mentoring: {
          title: 'Mentorat 24/7',
          description: 'Plus jamais seul dans les négociations. Aria vous guide étape par étape, même quand le client soulève des objections difficiles.',
          benefit: 'Réduisez le stress et augmentez la confiance',
        },
        onboarding: {
          title: 'Onboarding Instantané',
          description: 'Apprenez à maîtriser PropertyPilot en 5 minutes en parlant à Aria. Pas de longs tutoriels, juste une conversation naturelle.',
          benefit: 'Devenez productif immédiatement',
        },
        support: {
          title: 'Soutien Psychologique',
          description: 'L\'alliée qui vous motive à conclure ce mandat quand le défi devient difficile. Aria connaît la psychologie des ventes.',
          benefit: 'Maintenez la motivation élevée',
        },
        available: 'Aria est toujours disponible. Cliquez sur la bulle en bas à droite pour commencer.',
        availableFree: 'Également disponible dans le plan GRATUIT',
      },
      pricing: {
        title: 'Tarifs',
        subtitle: 'Comparez les plans et choisissez celui parfait pour votre entreprise',
        feature: 'Fonctionnalité',
        bestValue: 'MEILLEURE VALEUR',
        perMonth: '/mois',
        agencySubtitle: 'Suite de Domination Omnicanale',
        agencyExtra: '+ Module Commercial et Arbitrage Étendu',
        features: {
          listingsPerMonth: 'Annonces par mois',
          aiGeneration: 'Génération d\'Annonces IA',
          aiStyles: 'Styles IA (Luxe, Investissement, Pro)',
          multilingual: 'Multilingue (IT, EN, ES)',
          pdf: 'PDFs Professionnels',
          crm: 'CRM Complet',
          kanban: 'Pipeline Kanban',
          leadScoring: 'Scoring de Leads IA de Base',
          briefing: 'Briefing Intelligent Multi-Catégorie',
          staging: 'Virtual Staging 3D',
          followup: 'Suivi IA Multicanal',
          automations: 'Automatisations IA',
          forms: 'Formulaires de Capture de Leads Intelligents',
          whiteLabel: 'PDF White-label',
          assistant: 'Assistant IA d\'Agence',
          multiUser: 'Multi-utilisateur',
          roles: 'Rôles et Permissions',
          distribution: 'Distribution Automatique des Leads',
          reports: 'Rapports d\'Activité de l\'Équipe',
          multiOffice: 'Intégration Multi-sites',
          auraVR: '🥽 Aura VR: Génération de Visite Virtuelle Cinématique',
          voiceCalling: 'Appels Vocaux IA (Bland AI)',
          messaging: 'Messagerie Intelligente IA (SMS/WhatsApp IA)',
          manualOverride: 'Surcharge Manuelle: Accès direct aux données du propriétaire',
          humanOverride: 'Liberté d\'intervention humaine',
          autoProspecting: 'Auto-Prospection 24/7',
          scraping: 'Scraping Intelligent',
          dashboard: 'Tableau de Bord War Room',
          calendar: 'Intégration Google Calendar',
          notifications: 'Notifications Email Automatiques',
          support: 'Support',
        },
        plans: {
          free: 'GRATUIT',
          starter: 'STARTER',
          pro: 'PRO',
          agency: 'AGENCY',
          unlimited: 'Illimité',
          advanced: 'Avancé',
          exclusive: 'EXCLUSIF',
          active: 'Actif',
          viewer: 'Visualiseur',
          community: 'Communauté',
          email: 'Email',
          priority: 'Prioritaire',
          dedicated: 'Dédié 24/7',
        },
        cta: {
          startFree: 'Commencer Gratuitement',
          chooseStarter: 'Choisir Starter',
          choosePro: 'Choisir Pro',
          chooseAgency: 'Choisir Agency',
        },
      },
      cta: {
        title: 'Prêt à multiplier vos affaires?',
        subtitle: 'Rejoignez des centaines d\'agents qui utilisent déjà PropertyPilot AI',
        button: 'Commencer Gratuitement',
      },
      footer: {
        tagline: 'Votre Agent Immobilier IA qui travaille 24/7',
        product: 'Produit',
        company: 'Entreprise',
        support: 'Support',
        pricing: 'Tarifs',
        dashboard: 'Tableau de Bord',
        features: 'Fonctionnalités',
        about: 'À Propos',
        contact: 'Contact',
        blog: 'Blog',
        privacy: 'Politique de Confidentialité',
        terms: 'Conditions d\'Utilisation',
        refund: 'Politique de Remboursement',
        copyright: 'Tous droits réservés.',
      },
    },
  },
  
  de: {
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Kontrollpanel',
      loading: 'Lädt...',
      error: 'Fehler',
      success: 'Erfolg',
    },
    auraVR: {
      title: 'Aura VR Generator',
      subtitle: 'Verwandeln Sie ein Smartphone-Video in eine immersive 3D-VR-Tour',
      startScan: 'Aura VR Scan starten',
      processing: {
        analyzing: '📹 Video wird analysiert...',
        mapping: '🏠 Räume werden kartiert...',
        rendering: '🎥 Kinematisches 3D-Rendering...',
        optimizing: '✨ VR-Optimierung für Mobilgeräte...',
        preparing: '🌐 VR-Link wird vorbereitet...',
        finalizing: '⚡ Immersive Tour wird finalisiert...',
        complete: '✅ VR-Tour bereit!',
      },
      progress: {
        analyzingSub: 'Schlüsselbild-Erkennung',
        mappingSub: '3D-Raumrekonstruktion',
        renderingSub: 'Generierung immersiver Texturen',
        optimizingSub: 'Komprimierung und Streaming',
        preparingSub: 'Konfiguration des öffentlichen Zugangs',
        finalizingSub: 'Hinzufügen kinematischer Effekte',
        completeSub: 'Link erfolgreich generiert',
      },
      result: {
        title: 'VR-Tour generiert!',
        subtitle: 'Ihre immersive Tour ist bereit zum Teilen',
        linkLabel: 'VR-Link:',
        copyLink: 'Link kopieren',
        shareWhatsApp: 'WhatsApp',
        generateNew: 'Neue Tour generieren',
        videoSource: 'Smartphone-Video',
        tourTime: 'VR-Tour in 60s',
      },
      aria: {
        message: 'Aria: Große Arbeit!',
        stats: 'Dieser Scan wird',
        action: 'mehr Besuche anziehen. Soll ich es an Ihre heißen Leads senden?',
      },
    },
    common: {
      copy: 'Kopieren',
      share: 'Teilen',
      send: 'Senden',
      cancel: 'Abbrechen',
      confirm: 'Bestätigen',
      save: 'Speichern',
      delete: 'Löschen',
      edit: 'Bearbeiten',
      view: 'Anzeigen',
    },
    landing: {
      nav: {
        tagline: 'Pilot Your Agency to the Next Level',
        features: 'Funktionen',
        pricing: 'Preise',
        compliance: 'Compliance',
        login: 'Anmelden',
        getStarted: 'Loslegen',
      },
      hero: {
        poweredBy: 'Angetrieben von GPT-4',
        titlePart1: 'Ihr Immobilien',
        titlePart2: 'Makler',
        titleAI: 'KI',
        socialProof: 'Vertraut von',
        socialProofAgencies: '+500 Agenturen',
        socialProofLocation: 'in Europa',
        subtitle: 'Das einzige KI-Betriebssystem, das Mandate vollständig autonom findet, analysiert und erhält',
        ctaStart: 'Kostenlos Starten',
        ctaDemo: 'Demo Ansehen',
        trustedBy: 'Kompatibel mit führenden Portalen',
        stats: {
          automation: 'Automatisierung',
          listingsPerDay: 'Anzeigen/Tag',
          conversionRate: 'Konversionsrate',
        },
      },
      features: {
        title: 'Warum PropertyPilot AI?',
        subtitle: 'Die vollständige KI-Plattform für Immobilienmakler, die skalieren möchten',
        aiListing: {
          title: 'KI-Anzeigen-Engine',
          description: 'Erstellen Sie professionelle Anzeigen in Sekunden mit benutzerdefinierten Stilen (Luxus, Investition, Standard Pro). Mehrsprachig und optimiert für Zillow, Idealista, Immobiliare.',
          benefit: 'Sparen Sie 5 Stunden pro Woche beim Schreiben von Anzeigen',
        },
        crmAI: {
          title: 'CRM-KI-Intelligenz',
          description: 'Automatisches Lead-Scoring, mehrkanaliges KI-Follow-up (WhatsApp, E-Mail, SMS). Kategorisiert HEISSE/WARME/KALTE Leads und schlägt Prioritätsaktionen vor.',
          benefit: 'Steigern Sie Conversions um 40% mit KI-Priorisierung',
        },
        globalReach: {
          title: 'Globale Reichweite',
          description: 'Wir operieren in den USA (Zillow, MLS), Italien (Idealista, Immobiliare), Spanien (Idealista.es). Lokalisierte Terminologie und Marktformate.',
          benefit: 'Erweitern Sie Ihr Geschäft auf 3 Kontinenten',
        },
      },
      searchEngine: {
        title: 'Die Suchmaschine, die Nie Schläft',
        subtitle: 'Verfügbar',
        exclusive: 'AUSSCHLIESSLICH',
        exclusiveInPlan: 'im AGENCY-Plan',
        benefit: 'Sparen Sie 20 Stunden Telefonanrufe pro Woche',
        step1: {
          title: 'Globale Suche',
          description: 'Die KI scannt automatisch Idealista, Immobiliare, Zillow und MLS 24/7 und findet täglich Tausende von Anzeigen.',
          status: 'Suche läuft...',
        },
        step2: {
          title: 'KI-Filterung',
          description: 'Jede Anzeige erhält einen KI-Lead-Score (0-100). Nur "TOP DEAL" (80+) werden für Anrufe ausgewählt.',
          status: 'TOP DEAL erkannt',
        },
        step3: {
          title: 'Automatischer Anruf',
          description: 'Voice-KI (Bland AI) ruft Eigentümer an, behandelt Einwände und schlägt Termine natürlich und überzeugend vor.',
          status: 'Anruf läuft...',
        },
        step4: {
          title: 'Termin im Kalender',
          description: 'Der Termin wird automatisch zu Ihrem Google Kalender hinzugefügt und Sie erhalten eine E-Mail-Benachrichtigung mit allen Details.',
          status: 'Termin bestätigt',
        },
      },
      tuesdayMorning: {
        title: 'Ihr Neuer Dienstagmorgen',
        subtitle: 'Stellen Sie sich vor, Sie wachen auf und die Arbeit ist bereits erledigt',
        time1: '08:00 Uhr',
        time1Title: 'KI hat bereits 500 Anzeigen analysiert',
        time1Desc: 'Während Sie schliefen, scannte das System Idealista, Immobiliare, Zillow und MLS. Jede Anzeige wurde analysiert und mit einem KI-Lead-Score klassifiziert.',
        time2: '08:30 Uhr',
        time2Title: '3 Eigentümer haben den Besichtigungstermin bestätigt',
        time2Desc: 'Voice-KI rief die Eigentümer von TOP DEALs (Score 80+) an. Drei haben bereits die Verfügbarkeit für eine Besichtigung diese Woche bestätigt.',
        time3: '09:00 Uhr',
        time3Title: 'Sie wachen auf und öffnen den bereits vollen Kalender',
        time3Desc: 'Öffnen Sie PropertyPilot AI und finden Sie 3 bereits geplante Termine mit allen Immobiliendetails, Eigentümerkontakten und KI-Notizen.',
      },
      testimonials: {
        title: 'Geliebt von Maklern Weltweit',
        subtitle: 'Tausende von Immobilienmaklern vertrauen PropertyPilot AI',
        testimonial1: {
          name: 'Marco Rossi',
          role: 'Immobilienmakler, Mailand',
          content: 'PropertyPilot AI hat mein Geschäft verdreifacht. Das KI-Lead-Scoring sagt mir genau, auf welche Leads ich mich konzentrieren soll.',
        },
        testimonial2: {
          name: 'Sarah Johnson',
          role: 'Immobilienmaklerin, Miami',
          content: 'Die Anzeigenerstellungsfunktion ist unglaublich. Ich erstelle professionelle Anzeigen in 30 Sekunden statt Stunden.',
        },
        testimonial3: {
          name: 'Carlos Garcia',
          role: 'Makler, Barcelona',
          content: 'Das KI-CRM ist ein Game-Changer. Automatische Follow-ups sparen mir 10 Stunden pro Woche.',
        },
      },
      aria: {
        badge: 'Verfügbar in allen Plänen',
        title: 'Aria - Ihr KI-Erfolgspartner',
        subtitle: 'Ihr persönlicher Coach, immer verfügbar. Onboarding, Strategie, Motivation: alles in einem Chat.',
        mentoring: {
          title: 'Mentoring 24/7',
          description: 'Nie wieder allein in Verhandlungen. Aria führt Sie Schritt für Schritt, auch wenn der Kunde schwierige Einwände erhebt.',
          benefit: 'Reduzieren Sie Stress und steigern Sie das Vertrauen',
        },
        onboarding: {
          title: 'Sofortiges Onboarding',
          description: 'Lernen Sie PropertyPilot in 5 Minuten zu beherrschen, indem Sie mit Aria sprechen. Keine langen Tutorials, nur natürliche Gespräche.',
          benefit: 'Werden Sie sofort produktiv',
        },
        support: {
          title: 'Psychologische Unterstützung',
          description: 'Die Verbündete, die Sie motiviert, dieses Mandat abzuschließen, wenn die Herausforderung schwierig wird. Aria kennt die Verkaufspsychologie.',
          benefit: 'Halten Sie die Motivation hoch',
        },
        available: 'Aria ist immer verfügbar. Klicken Sie auf die Blase unten rechts, um zu beginnen.',
        availableFree: 'Auch im KOSTENLOSEN Plan verfügbar',
      },
      pricing: {
        title: 'Preise',
        subtitle: 'Vergleichen Sie Pläne und wählen Sie den perfekten für Ihr Unternehmen',
        feature: 'Funktion',
        bestValue: 'BESTER WERT',
        perMonth: '/Monat',
        agencySubtitle: 'Omnichannel-Dominanz-Suite',
        agencyExtra: '+ Kommerzielles Modul & Erweiterte Arbitrage',
        features: {
          listingsPerMonth: 'Anzeigen pro Monat',
          aiGeneration: 'KI-Anzeigenerstellung',
          aiStyles: 'KI-Stile (Luxus, Investition, Pro)',
          multilingual: 'Mehrsprachig (IT, EN, ES)',
          pdf: 'Professionelle PDFs',
          crm: 'Vollständiges CRM',
          kanban: 'Kanban-Pipeline',
          leadScoring: 'Basis-KI-Lead-Scoring',
          briefing: 'Multi-Kategorie Smart Briefing',
          staging: '3D Virtual Staging',
          followup: 'Mehrkanaliges KI-Follow-up',
          automations: 'KI-Automatisierungen',
          forms: 'Intelligente Lead-Capture-Formulare',
          whiteLabel: 'White-Label-PDF',
          assistant: 'Agentur-Assistenten-KI',
          multiUser: 'Multi-User',
          roles: 'Rollen und Berechtigungen',
          distribution: 'Automatische Lead-Verteilung',
          reports: 'Team-Aktivitätsberichte',
          multiOffice: 'Multi-Standort-Integration',
          auraVR: '🥽 Aura VR: Kinematische Virtual-Tour-Generierung',
          voiceCalling: 'KI-Sprachanrufe (Bland AI)',
          messaging: 'KI-Smart-Messaging (SMS/WhatsApp KI)',
          manualOverride: 'Manuelle Überschreibung: Direkter Zugriff auf Eigentümerdaten',
          humanOverride: 'Freiheit menschlicher Intervention',
          autoProspecting: '24/7 Auto-Prospektion',
          scraping: 'Intelligentes Scraping',
          dashboard: 'War Room Dashboard',
          calendar: 'Google Kalender-Integration',
          notifications: 'Automatische E-Mail-Benachrichtigungen',
          support: 'Support',
        },
        plans: {
          free: 'KOSTENLOS',
          starter: 'STARTER',
          pro: 'PRO',
          agency: 'AGENCY',
          unlimited: 'Unbegrenzt',
          advanced: 'Erweitert',
          exclusive: 'EXKLUSIV',
          active: 'Aktiv',
          viewer: 'Betrachter',
          community: 'Community',
          email: 'E-Mail',
          priority: 'Priorität',
          dedicated: 'Dediziert 24/7',
        },
        cta: {
          startFree: 'Kostenlos Starten',
          chooseStarter: 'Starter Wählen',
          choosePro: 'Pro Wählen',
          chooseAgency: 'Agency Wählen',
        },
      },
      cta: {
        title: 'Bereit, Ihr Geschäft zu multiplizieren?',
        subtitle: 'Schließen Sie sich Hunderten von Maklern an, die bereits PropertyPilot AI verwenden',
        button: 'Kostenlos Loslegen',
      },
      footer: {
        tagline: 'Ihr Immobilien-KI-Agent, der 24/7 arbeitet',
        product: 'Produkt',
        company: 'Unternehmen',
        support: 'Support',
        pricing: 'Preise',
        dashboard: 'Dashboard',
        features: 'Funktionen',
        about: 'Über Uns',
        contact: 'Kontakt',
        blog: 'Blog',
        privacy: 'Datenschutzrichtlinie',
        terms: 'Nutzungsbedingungen',
        refund: 'Rückerstattungsrichtlinie',
        copyright: 'Alle Rechte vorbehalten.',
      },
    },
  },
  
  pt: {
    dashboard: {
      title: 'Painel',
      subtitle: 'Painel de controle',
      loading: 'Carregando...',
      error: 'Erro',
      success: 'Sucesso',
    },
    auraVR: {
      title: 'Gerador Aura VR',
      subtitle: 'Transforme um vídeo de smartphone em um tour VR imersivo 3D',
      startScan: 'Iniciar Varredura Aura VR',
      processing: {
        analyzing: '📹 Analisando vídeo...',
        mapping: '🏠 Mapeando cômodos...',
        rendering: '🎥 Renderização Cinematográfica 3D...',
        optimizing: '✨ Otimizando VR para mobile...',
        preparing: '🌐 Preparando link VR...',
        finalizing: '⚡ Finalizando tour imersivo...',
        complete: '✅ Tour VR Pronto!',
      },
      progress: {
        analyzingSub: 'Detecção de frames-chave',
        mappingSub: 'Reconstrução espacial 3D',
        renderingSub: 'Gerando texturas imersivas',
        optimizingSub: 'Compressão e streaming',
        preparingSub: 'Configurando acesso público',
        finalizingSub: 'Adicionando efeitos cinematográficos',
        completeSub: 'Link gerado com sucesso',
      },
      result: {
        title: 'Tour VR Gerado!',
        subtitle: 'Seu tour imersivo está pronto para compartilhar',
        linkLabel: 'Link VR:',
        copyLink: 'Copiar Link',
        shareWhatsApp: 'WhatsApp',
        generateNew: 'Gerar novo tour',
        videoSource: 'Vídeo smartphone',
        tourTime: 'Tour VR em 60s',
      },
      aria: {
        message: 'Aria: Ótimo trabalho!',
        stats: 'Este scan atrairá',
        action: 'mais visitas. Quer que eu envie para seus leads quentes?',
      },
    },
    common: {
      copy: 'Copiar',
      share: 'Compartilhar',
      send: 'Enviar',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      save: 'Salvar',
      delete: 'Excluir',
      edit: 'Editar',
      view: 'Visualizar',
    },
  },
  
  ar: {
    dashboard: {
      title: 'لوحة التحكم',
      subtitle: 'لوحة التحكم الرئيسية',
      loading: 'جاري التحميل...',
      error: 'خطأ',
      success: 'نجاح',
    },
    auraVR: {
      title: 'مولد Aura VR',
      subtitle: 'حول فيديو الهاتف الذكي إلى جولة VR ثلاثية الأبعاد غامرة',
      startScan: 'بدء مسح Aura VR',
      processing: {
        analyzing: '📹 جاري تحليل الفيديو...',
        mapping: '🏠 جاري رسم الخرائط للغرف...',
        rendering: '🎥 عرض سينمائي ثلاثي الأبعاد...',
        optimizing: '✨ تحسين VR للهواتف المحمولة...',
        preparing: '🌐 تحضير رابط VR...',
        finalizing: '⚡ إنهاء الجولة الغامرة...',
        complete: '✅ جولة VR جاهزة!',
      },
      progress: {
        analyzingSub: 'اكتشاف الإطارات الرئيسية',
        mappingSub: 'إعادة بناء مكاني ثلاثي الأبعاد',
        renderingSub: 'إنشاء نسيج غامر',
        optimizingSub: 'الضغط والبث',
        preparingSub: 'تكوين الوصول العام',
        finalizingSub: 'إضافة تأثيرات سينمائية',
        completeSub: 'تم إنشاء الرابط بنجاح',
      },
      result: {
        title: 'تم إنشاء جولة VR!',
        subtitle: 'جولتك الغامرة جاهزة للمشاركة',
        linkLabel: 'رابط VR:',
        copyLink: 'نسخ الرابط',
        shareWhatsApp: 'واتساب',
        generateNew: 'إنشاء جولة جديدة',
        videoSource: 'فيديو الهاتف الذكي',
        tourTime: 'جولة VR في 60 ثانية',
      },
      aria: {
        message: 'آريا: عمل رائع!',
        stats: 'هذا المسح سيجذب',
        action: 'زيارات إضافية. هل تريد أن أرسله إلى عملائك المحتملين؟',
      },
    },
    common: {
      copy: 'نسخ',
      share: 'مشاركة',
      send: 'إرسال',
      cancel: 'إلغاء',
      confirm: 'تأكيد',
      save: 'حفظ',
      delete: 'حذف',
      edit: 'تعديل',
      view: 'عرض',
    },
    landing: {
      nav: {
        tagline: 'Pilot Your Agency to the Next Level',
        features: 'المميزات',
        pricing: 'الأسعار',
        compliance: 'الامتثال',
        login: 'تسجيل الدخول',
        getStarted: 'ابدأ الآن',
      },
      hero: {
        poweredBy: 'مدعوم بـ GPT-4',
        titlePart1: 'وكيلك',
        titlePart2: 'العقاري',
        titleAI: 'الذكي',
        socialProof: 'موثوق من قبل',
        socialProofAgencies: '+500 وكالة',
        socialProofLocation: 'في أوروبا',
        subtitle: 'نظام التشغيل الذكي الوحيد الذي يجد ويحلل ويحصل على التفويضات بشكل مستقل تماماً',
        ctaStart: 'ابدأ مجاناً',
        ctaDemo: 'شاهد العرض التوضيحي',
        trustedBy: 'متوافق مع البوابات الرئيسية',
        stats: {
          automation: 'الأتمتة',
          listingsPerDay: 'إعلان/يوم',
          conversionRate: 'معدل التحويل',
        },
      },
      features: {
        title: 'لماذا PropertyPilot AI?',
        subtitle: 'المنصة الذكية الشاملة لوكلاء العقارات الذين يريدون التوسع',
        aiListing: {
          title: 'محرك الإعلانات الذكي',
          description: 'أنشئ إعلانات احترافية في ثوانٍ بأنماط مخصصة (الفاخر، الاستثماري، الاحترافي القياسي). متعدد اللغات ومحسّن لـ Zillow و Idealista و Immobiliare.',
          benefit: 'وفر 5 ساعات أسبوعياً في كتابة الإعلانات',
        },
        crmAI: {
          title: 'ذكاء CRM الذكي',
          description: 'تقييم العملاء المحتملين تلقائياً، متابعة ذكية متعددة القنوات (واتساب، بريد إلكتروني، رسائل نصية). تصنف العملاء المحتملين الساخنين/الدافئين/الباردين وتقترح إجراءات أولوية.',
          benefit: 'زِد التحويلات بنسبة 40% مع تحديد الأولويات الذكي',
        },
        globalReach: {
          title: 'الوصول العالمي',
          description: 'نعمل في الولايات المتحدة (Zillow و MLS) وإيطاليا (Idealista و Immobiliare) وإسبانيا (Idealista.es). مصطلحات محلية وأشكال سوق.',
          benefit: 'وسّع عملك في 3 قارات',
        },
      },
      searchEngine: {
        title: 'محرك البحث الذي لا ينام أبداً',
        subtitle: 'متاح',
        exclusive: 'حصرياً',
        exclusiveInPlan: 'في خطة AGENCY',
        benefit: 'وفر 20 ساعة من المكالمات الهاتفية أسبوعياً',
        step1: {
          title: 'المسح الشامل',
          description: 'يُمسح الذكي تلقائياً Idealista و Immobiliare و Zillow و MLS على مدار الساعة، ويجد آلاف الإعلانات كل يوم.',
          status: 'جاري المسح...',
        },
        step2: {
          title: 'التصفية الذكية',
          description: 'يحصل كل إعلان على تقييم عميل محتمل ذكي (0-100). يتم اختيار "الصفقات المميزة" (80+) فقط للمكالمات.',
          status: 'تم اكتشاف صفقة مميزة',
        },
        step3: {
          title: 'المكالمة التلقائية',
          description: 'المكالمات الصوتية الذكية (Bland AI) تتصل بالمالكين وتتعامل مع الاعتراضات وتقترح مواعيد بشكل طبيعي ومقنع.',
          status: 'جاري الاتصال...',
        },
        step4: {
          title: 'الموعد في التقويم',
          description: 'يُضاف الموعد تلقائياً إلى Google Calendar الخاص بك وتتلقى إشعاراً بريدياً بجميع التفاصيل.',
          status: 'تم تأكيد الموعد',
        },
      },
      tuesdayMorning: {
        title: 'صباح الثلاثاء الجديد',
        subtitle: 'تخيل الاستيقاظ والعمل قد اكتمل بالفعل',
        time1: '08:00',
        time1Title: 'حلل الذكي بالفعل 500 إعلان',
        time1Desc: 'بينما كنت نائماً، مسح النظام Idealista و Immobiliare و Zillow و MLS. تم تحليل كل إعلان وتصنيفه بتقييم عميل محتمل ذكي.',
        time2: '08:30',
        time2Title: '3 ملاك أكدوا الزيارة',
        time2Desc: 'اتصلت المكالمات الصوتية الذكية بملاك الصفقات المميزة (تقييم 80+). أكد ثلاثة بالفعل توفرهم لزيارة هذا الأسبوع.',
        time3: '09:00',
        time3Title: 'تستيقظ ويفتح التقويم ممتلئاً بالفعل',
        time3Desc: 'افتح PropertyPilot AI وستجد 3 مواعيد مجدولة بالفعل، مع جميع تفاصيل العقار واتصالات المالك وملاحظات الذكي.',
      },
      testimonials: {
        title: 'محبوب من الوكلاء حول العالم',
        subtitle: 'آلاف وكلاء العقارات يثقون بـ PropertyPilot AI',
        testimonial1: {
          name: 'ماركو روسي',
          role: 'وكيل عقاري، ميلانو',
          content: 'ضاعف PropertyPilot AI أعمالي ثلاث مرات. يخبرني تقييم العملاء المحتملين الذكي بالضبط على أي عملاء محتملين أركز.',
        },
        testimonial2: {
          name: 'سارة جونسون',
          role: 'وكيلة عقارية، ميامي',
          content: 'ميزة إنشاء الإعلانات مذهلة. أنشئ إعلانات احترافية في 30 ثانية بدلاً من ساعات.',
        },
        testimonial3: {
          name: 'كارلوس غارسيا',
          role: 'وكيل، برشلونة',
          content: 'CRM الذكي هو تغيير جذري. توفر المتابعات التلقائية 10 ساعات أسبوعياً.',
        },
      },
      aria: {
        badge: 'متاح في جميع الخطط',
        title: 'آريا - شريكك الذكي للنجاح',
        subtitle: 'مدربك الشخصي، متاح دائماً. التعريف، الاستراتيجية، التحفيز: كل شيء في محادثة واحدة.',
        mentoring: {
          title: 'الإرشاد على مدار الساعة',
          description: 'لم تعد وحدك في المفاوضات. ترشدك آريا خطوة بخطوة، حتى عندما يطرح العميل اعتراضات صعبة.',
          benefit: 'قلل التوتر وزد الثقة',
        },
        onboarding: {
          title: 'التعريف الفوري',
          description: 'تعلم إتقان PropertyPilot في 5 دقائق بالتحدث مع آريا. لا دروس طويلة، فقط محادثة طبيعية.',
          benefit: 'كن منتجاً على الفور',
        },
        support: {
          title: 'الدعم النفسي',
          description: 'الحليف الذي يحفزك لإغلاق ذلك التفويض عندما يصبح التحدي صعباً. تعرف آريا على نفسية المبيعات.',
          benefit: 'حافظ على الدافع عالياً',
        },
        available: 'آريا متاحة دائماً. انقر على الفقاعة في الأسفل يميناً للبدء.',
        availableFree: 'متاح أيضاً في الخطة المجانية',
      },
      pricing: {
        title: 'الأسعار',
        subtitle: 'قارن الخطط واختر المثالي لعملك',
        feature: 'الميزة',
        bestValue: 'أفضل قيمة',
        perMonth: '/شهر',
        agencySubtitle: 'مجموعة الهيمنة متعددة القنوات',
        agencyExtra: '+ الوحدة التجارية والتحكيم الممتد',
        features: {
          listingsPerMonth: 'إعلانات شهرياً',
          aiGeneration: 'إنشاء إعلانات ذكي',
          aiStyles: 'أنماط ذكية (فاخر، استثماري، احترافي)',
          multilingual: 'متعدد اللغات (IT, EN, ES)',
          pdf: 'ملفات PDF احترافية',
          crm: 'CRM كامل',
          kanban: 'خط أنابيب Kanban',
          leadScoring: 'تقييم العملاء المحتملين الذكي الأساسي',
          briefing: 'إحاطة ذكية متعددة الفئات',
          staging: 'Virtual Staging ثلاثي الأبعاد',
          followup: 'متابعة ذكية متعددة القنوات',
          automations: 'أتمتة ذكية',
          forms: 'نماذج التقاط العملاء المحتملين الذكية',
          whiteLabel: 'PDF White-label',
          assistant: 'مساعد الوكالة الذكي',
          multiUser: 'متعدد المستخدمين',
          roles: 'الأدوار والصلاحيات',
          distribution: 'توزيع العملاء المحتملين التلقائي',
          reports: 'تقارير نشاط الفريق',
          multiOffice: 'تكامل متعدد المكاتب',
          auraVR: '🥽 Aura VR: إنشاء جولة افتراضية سينمائية',
          voiceCalling: 'مكالمات صوتية ذكية (Bland AI)',
          messaging: 'رسائل ذكية (SMS/واتساب ذكي)',
          manualOverride: 'تجاوز يدوي: الوصول المباشر لبيانات المالك',
          humanOverride: 'حرية التدخل البشري',
          autoProspecting: 'البحث التلقائي على مدار الساعة',
          scraping: 'استخراج ذكي',
          dashboard: 'لوحة تحكم War Room',
          calendar: 'تكامل Google Calendar',
          notifications: 'إشعارات بريد إلكتروني تلقائية',
          support: 'الدعم',
        },
        plans: {
          free: 'مجاني',
          starter: 'STARTER',
          pro: 'PRO',
          agency: 'AGENCY',
          unlimited: 'غير محدود',
          advanced: 'متقدم',
          exclusive: 'حصري',
          active: 'نشط',
          viewer: 'عارض',
          community: 'مجتمع',
          email: 'بريد إلكتروني',
          priority: 'أولوية',
          dedicated: 'مخصص على مدار الساعة',
        },
        cta: {
          startFree: 'ابدأ مجاناً',
          chooseStarter: 'اختر Starter',
          choosePro: 'اختر Pro',
          chooseAgency: 'اختر Agency',
        },
      },
      cta: {
        title: 'جاهز لمضاعفة أعمالك?',
        subtitle: 'انضم إلى مئات الوكلاء الذين يستخدمون بالفعل PropertyPilot AI',
        button: 'ابدأ مجاناً',
      },
      footer: {
        tagline: 'وكيلك العقاري الذكي الذي يعمل على مدار الساعة',
        product: 'المنتج',
        company: 'الشركة',
        support: 'الدعم',
        pricing: 'الأسعار',
        dashboard: 'لوحة التحكم',
        features: 'المميزات',
        about: 'من نحن',
        contact: 'اتصل بنا',
        blog: 'المدونة',
        privacy: 'سياسة الخصوصية',
        terms: 'شروط الخدمة',
        refund: 'سياسة الاسترداد',
        copyright: 'جميع الحقوق محفوظة.',
      },
    },
  },
};

/**
 * Get translation for a specific locale
 */
export function getTranslation(locale: SupportedLocale): TranslationDictionary {
  return translations[locale] || translations.en;
}

/**
 * Detect locale from location string (simple heuristic)
 */
export function detectLocaleFromLocation(location: string): SupportedLocale {
  const loc = location.toLowerCase();
  
  // Spanish countries/cities
  if (/\b(madrid|barcelona|valencia|sevilla|málaga|españa|spain|mexico|méxico|buenos aires|argentina|colombia|chile)\b/i.test(loc)) {
    return 'es';
  }
  
  // French countries/cities
  if (/\b(paris|lyon|marseille|france|france|quebec|montreal|belgium|belgique|switzerland|suisse)\b/i.test(loc)) {
    return 'fr';
  }
  
  // German countries/cities
  if (/\b(berlin|münchen|hamburg|frankfurt|germany|deutschland|austria|österreich|zurich|zürich)\b/i.test(loc)) {
    return 'de';
  }
  
  // Portuguese countries/cities
  if (/\b(lisboa|porto|brazil|brasil|portugal|rio de janeiro|são paulo)\b/i.test(loc)) {
    return 'pt';
  }
  
  // Arabic countries/cities (Middle East)
  if (/\b(dubai|doha|qatar|uae|emirates|saudi|riyadh|jeddah|kuwait|bahrain|oman|muscat|abu dhabi|sharjah|ajman)\b/i.test(loc)) {
    return 'ar';
  }
  
  // Italian cities (fallback to IT if contains Italian city names)
  if (/\b(roma|milano|napoli|torino|firenze|venezia|genova|bologna|italia|italy)\b/i.test(loc)) {
    return 'it';
  }
  
  // Default to English for US/UK/other English-speaking regions
  return 'en';
}
