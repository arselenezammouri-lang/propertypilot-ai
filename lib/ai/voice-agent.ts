/**
 * Voice AI Integration - Bland AI
 * Gestisce chiamate automatiche ai proprietari di immobili
 */

export interface BlandAICallRequest {
  phone_number: string;
  task: string; // Script della chiamata
  from?: string; // Numero chiamante (opzionale, può usare numero Bland AI)
  voicemail_detection?: boolean;
  reduce_latency?: boolean;
  model?: string;
  temperature?: number;
  interruption_threshold?: number;
  objection_handlers?: BlandAIObjectionHandler[];
  webhook_url?: string; // URL per ricevere callback con esito chiamata
}

export interface BlandAIObjectionHandler {
  interrupt: string; // Parola/frase che attiva questo handler (es: "non voglio", "non interessato")
  response: string; // Risposta dell'AI a questa obiezione
}

export interface BlandAICallResponse {
  call_id: string;
  status: 'queued' | 'ringing' | 'in-progress' | 'completed' | 'failed';
  message?: string;
}

export interface BlandAICallStatus {
  call_id: string;
  status: 'queued' | 'ringing' | 'in-progress' | 'completed' | 'failed' | 'no-answer' | 'busy';
  duration?: number;
  transcript?: string;
  analysis?: {
    outcome: 'appointment_set' | 'called' | 'rejected' | 'no_answer';
    sentiment?: 'positive' | 'neutral' | 'negative';
    objections_raised?: string[];
    next_steps?: string;
  };
}

/**
 * Crea una chiamata via Bland AI
 */
export async function createBlandAICall(
  request: BlandAICallRequest
): Promise<BlandAICallResponse> {
  const apiKey = process.env.BLAND_AI_API_KEY;

  if (!apiKey) {
    throw new Error('BLAND_AI_API_KEY non configurata nelle variabili d\'ambiente');
  }

  try {
    const response = await fetch('https://api.bland.ai/v1/calls', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        phone_number: request.phone_number,
        task: request.task,
        from: request.from,
        voicemail_detection: request.voicemail_detection ?? true,
        reduce_latency: request.reduce_latency ?? false,
        model: request.model || 'enhanced',
        temperature: request.temperature ?? 0.7,
        interruption_threshold: request.interruption_threshold ?? 500, // ms
        objection_handlers: request.objection_handlers || [],
        webhook_url: request.webhook_url,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || 
        `Bland AI API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    
    return {
      call_id: data.call_id || data.id,
      status: data.status || 'queued',
      message: data.message,
    };
  } catch (error: any) {
    // Log error senza dati sensibili (API key, phone numbers, etc.)
    console.error('[VOICE AGENT] Error creating Bland AI call:', {
      message: error.message,
      status: error.status || error.statusCode,
    });
    throw new Error(`Errore nella creazione della chiamata: ${error.message || 'Servizio temporaneamente non disponibile'}`);
  }
}

/**
 * Recupera lo status di una chiamata Bland AI
 */
export async function getBlandAICallStatus(callId: string): Promise<BlandAICallStatus> {
  const apiKey = process.env.BLAND_AI_API_KEY;

  if (!apiKey) {
    throw new Error('BLAND_AI_API_KEY non configurata nelle variabili d\'ambiente');
  }

  try {
    const response = await fetch(`https://api.bland.ai/v1/calls/${callId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || 
        `Bland AI API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    return {
      call_id: callId,
      status: data.status || 'queued',
      duration: data.duration,
      transcript: data.transcript,
      analysis: data.analysis,
    };
  } catch (error: any) {
    console.error('[VOICE AGENT] Error fetching call status:', error);
    throw new Error(`Errore nel recupero dello status chiamata: ${error.message}`);
  }
}

import { detectLocaleFromLocation, SupportedLocale } from '@/lib/i18n/dictionary';

/**
 * Genera lo script per chiamata prospecting immobiliare (Pitch d'Oro)
 * Supporta traduzione dinamica in base alla location: IT, EN, ES, FR, DE
 * Focus su potenziale inespresso e clienti investitori pronti
 */
export function generateProspectingCallScript(
  ownerName: string,
  location: string,
  propertyTitle?: string,
  platform?: string,
  marketGap?: number
): string {
  // Determina lingua dalla location (priorità) o dalla piattaforma (fallback)
  let locale: SupportedLocale = 'en';
  
  if (platform === 'zillow' || platform === 'mls') {
    locale = 'en'; // US market
  } else {
    locale = detectLocaleFromLocation(location);
  }

  const greeting = getGreeting(locale, ownerName);
  const propertyRef = getPropertyRef(locale, propertyTitle, location);
  const gapText = marketGap && marketGap > 0 ? getGapText(locale, marketGap) : '';
  const pitchText = getPitchText(locale);

  return `${greeting}, ${getIntro(locale)} ${propertyRef}.${gapText} ${pitchText}`;
}

function getGreeting(locale: SupportedLocale, ownerName?: string): string {
  const greetings: Record<SupportedLocale, (name?: string) => string> = {
    it: (name) => name ? `Buongiorno ${name}` : 'Buongiorno',
    en: (name) => name ? `Hello ${name}` : 'Hello',
    es: (name) => name ? `Buenos días ${name}` : 'Buenos días',
    fr: (name) => name ? `Bonjour ${name}` : 'Bonjour',
    de: (name) => name ? `Guten Tag ${name}` : 'Guten Tag',
    pt: (name) => name ? `Bom dia ${name}` : 'Bom dia',
  };
  return greetings[locale](ownerName);
}

function getPropertyRef(locale: SupportedLocale, propertyTitle?: string, location?: string): string {
  const refs: Record<SupportedLocale, (title?: string, loc?: string) => string> = {
    it: (title, loc) => title ? title : `l'immobile a ${loc || 'questo indirizzo'}`,
    en: (title, loc) => title ? title : `the property at ${loc || 'this address'}`,
    es: (title, loc) => title ? title : `la propiedad en ${loc || 'esta dirección'}`,
    fr: (title, loc) => title ? title : `le bien immobilier à ${loc || 'cette adresse'}`,
    de: (title, loc) => title ? title : `die Immobilie in ${loc || 'dieser Adresse'}`,
    pt: (title, loc) => title ? title : `o imóvel em ${loc || 'este endereço'}`,
  };
  return refs[locale](propertyTitle, location);
}

function getGapText(locale: SupportedLocale, marketGap: number): string {
  const texts: Record<SupportedLocale, string> = {
    it: ` Abbiamo analizzato il mercato e notato che il suo immobile ha un potenziale inespresso significativo.`,
    en: ` We've analyzed the market and noticed your property has significant untapped potential.`,
    es: ` Hemos analizado el mercado y notado que su propiedad tiene un potencial sin explotar significativo.`,
    fr: ` Nous avons analysé le marché et remarqué que votre bien a un potentiel inexploité significatif.`,
    de: ` Wir haben den Markt analysiert und festgestellt, dass Ihre Immobilie ein erhebliches ungenutztes Potenzial hat.`,
    pt: ` Analisamos o mercado e notamos que sua propriedade tem um potencial significativo não aproveitado.`,
  };
  return texts[locale];
}

function getIntro(locale: SupportedLocale): string {
  const intros: Record<SupportedLocale, string> = {
    it: 'chiamo da PropertyPilot AI. Abbiamo notato il suo annuncio per',
    en: "I'm calling from PropertyPilot AI. We noticed your listing for",
    es: 'llamo desde PropertyPilot AI. Hemos notado su anuncio de',
    fr: 'j\'appelle de PropertyPilot AI. Nous avons remarqué votre annonce pour',
    de: 'rufe an von PropertyPilot AI. Wir haben Ihr Inserat für',
    pt: 'ligo da PropertyPilot AI. Notamos seu anúncio de',
  };
  return intros[locale];
}

function getPitchText(locale: SupportedLocale): string {
  const pitches: Record<SupportedLocale, string> = {
    it: 'Sappiamo che il suo immobile ha un potenziale inespresso e abbiamo già dei clienti investitori pronti per un\'operazione rapida. Sarebbe disponibile per un sopralluogo per discutere un mandato esclusivo?',
    en: 'We know that your property has untapped potential, and we already have investor clients ready for a quick transaction. Would you be available for a quick viewing to discuss an exclusive mandate?',
    es: 'Sabemos que su propiedad tiene un potencial sin explotar y ya tenemos clientes inversores listos para una transacción rápida. ¿Estaría disponible para una visita rápida para discutir un mandato exclusivo?',
    fr: 'Nous savons que votre bien a un potentiel inexploité et nous avons déjà des clients investisseurs prêts pour une transaction rapide. Seriez-vous disponible pour une visite rapide pour discuter d\'un mandat exclusif?',
    de: 'Wir wissen, dass Ihre Immobilie ungenutztes Potenzial hat und wir haben bereits Investoren-Kunden bereit für eine schnelle Transaktion. Wären Sie für eine kurze Besichtigung verfügbar, um über ein Exklusivmandat zu sprechen?',
    pt: 'Sabemos que sua propriedade tem potencial não aproveitado e já temos clientes investidores prontos para uma transação rápida. Estaria disponível para uma visita rápida para discutir um mandato exclusivo?',
  };
  return pitches[locale];
}

/**
 * Genera gli objection handlers per gestire obiezioni comuni
 * Supporta traduzione dinamica in base alla location: IT, EN, ES, FR, DE, PT
 */
export function getDefaultObjectionHandlers(platform?: string, location?: string): BlandAIObjectionHandler[] {
  // Determina lingua dalla location o dalla piattaforma
  let locale: SupportedLocale = 'en';
  
  if (platform === 'zillow' || platform === 'mls') {
    locale = 'en';
  } else if (location) {
    locale = detectLocaleFromLocation(location);
  } else {
    locale = 'it'; // Default per mercato europeo
  }

  return getObjectionHandlersForLocale(locale);
}

function getObjectionHandlersForLocale(locale: SupportedLocale): BlandAIObjectionHandler[] {
  const handlers: Record<SupportedLocale, BlandAIObjectionHandler[]> = {
    en: [
      {
        interrupt: 'not interested|don\'t want|no thanks|not interested in agencies',
        response: 'I completely understand. We\'re not a traditional agency - we work solely as intermediaries to connect property owners with qualified buyers. We don\'t ask for exclusivity or seller commissions. Would you be available for a simple viewing?',
      },
      {
        interrupt: 'no time|busy|can\'t',
        response: 'I understand, time is precious. The viewing would only take 15-20 minutes and we can schedule it whenever is most convenient for you, even on weekends. When would you be most available?',
      },
      {
        interrupt: 'price too low|not worth it|the price',
        response: 'I understand your concerns about the price. Our client is serious and can make a competitive offer. We can discuss it during the viewing - would you be available to meet?',
      },
      {
        interrupt: 'already sold|not available anymore',
        response: 'Ah, I understand. Thank you for the information. If in the future you should have other properties available, we would be happy to collaborate. Have a great day!',
      },
      {
        interrupt: 'not the owner|wrong number',
        response: 'I apologize for the inconvenience. Could you tell me how to contact the owner?',
      },
      {
        interrupt: 'call me later|call back later',
        response: 'Certainly. What time would you prefer to be called back? I\'ll make a note and call you back at the most convenient time.',
      },
    ],
    it: [
      {
        interrupt: 'non voglio agenzie|non voglio|non mi interessa|non sono interessato',
        response: 'Capisco perfettamente. Non siamo un\'agenzia tradizionale - lavoriamo solo come intermediari per collegare proprietari e acquirenti qualificati. Non chiediamo esclusiva né commissioni al venditore. Sarebbe disponibile per una semplice visita?',
      },
      {
        interrupt: 'non ho tempo|sono occupato|non posso',
        response: 'Capisco, il tempo è prezioso. La visita richiederebbe solo 15-20 minuti e possiamo organizzarci quando fa più comodo a lei, anche durante il weekend. Quando sarebbe più disponibile?',
      },
      {
        interrupt: 'prezzo troppo basso|non conviene|il prezzo',
        response: 'Comprendo le sue preoccupazioni sul prezzo. Il nostro cliente è serio e può proporre un\'offerta competitiva. Possiamo discuterne durante la visita - sarebbe disponibile per incontrarci?',
      },
      {
        interrupt: 'già venduto|non è più disponibile',
        response: 'Ah, capisco. Grazie per l\'informazione. Se in futuro dovesse avere altri immobili disponibili, saremmo felici di collaborare. Buona giornata!',
      },
      {
        interrupt: 'non sono il proprietario|ho sbagliato numero',
        response: 'Mi scusi per il disturbo. Potrebbe indicarmi come contattare il proprietario?',
      },
      {
        interrupt: 'chiamatemi più tardi|chiamate dopo',
        response: 'Certamente. A che ora preferirebbe essere richiamato? Prendo nota e la richiamo al momento più comodo.',
      },
    ],
    es: [
      {
        interrupt: 'no me interesa|no quiero|no gracias|no me interesan las agencias',
        response: 'Entiendo perfectamente. No somos una agencia tradicional - trabajamos únicamente como intermediarios para conectar propietarios con compradores cualificados. No pedimos exclusividad ni comisiones al vendedor. ¿Estaría disponible para una simple visita?',
      },
      {
        interrupt: 'no tengo tiempo|estoy ocupado|no puedo',
        response: 'Entiendo, el tiempo es precioso. La visita solo tomaría 15-20 minutos y podemos organizarla cuando le sea más conveniente, incluso durante el fin de semana. ¿Cuándo estaría más disponible?',
      },
      {
        interrupt: 'precio demasiado bajo|no vale la pena|el precio',
        response: 'Comprendo sus preocupaciones sobre el precio. Nuestro cliente es serio y puede hacer una oferta competitiva. Podemos discutirlo durante la visita - ¿estaría disponible para reunirse?',
      },
      {
        interrupt: 'ya vendido|ya no está disponible',
        response: 'Ah, entiendo. Gracias por la información. Si en el futuro tuviera otras propiedades disponibles, estaríamos encantados de colaborar. ¡Que tenga un buen día!',
      },
      {
        interrupt: 'no soy el propietario|número equivocado',
        response: 'Disculpe las molestias. ¿Podría decirme cómo contactar al propietario?',
      },
      {
        interrupt: 'llámame más tarde|llame después',
        response: 'Por supuesto. ¿A qué hora preferiría que le llamara? Tomo nota y le llamo en el momento más conveniente.',
      },
    ],
    fr: [
      {
        interrupt: 'pas intéressé|je ne veux pas|non merci|pas intéressé par les agences',
        response: 'Je comprends parfaitement. Nous ne sommes pas une agence traditionnelle - nous travaillons uniquement comme intermédiaires pour connecter les propriétaires avec des acheteurs qualifiés. Nous ne demandons ni exclusivité ni commissions au vendeur. Seriez-vous disponible pour une simple visite?',
      },
      {
        interrupt: 'pas de temps|occupé|je ne peux pas',
        response: 'Je comprends, le temps est précieux. La visite ne prendrait que 15-20 minutes et nous pouvons la programmer quand cela vous convient le mieux, même le week-end. Quand seriez-vous le plus disponible?',
      },
      {
        interrupt: 'prix trop bas|ça ne vaut pas|le prix',
        response: 'Je comprends vos préoccupations concernant le prix. Notre client est sérieux et peut faire une offre concurrentielle. Nous pouvons en discuter pendant la visite - seriez-vous disponible pour nous rencontrer?',
      },
      {
        interrupt: 'déjà vendu|plus disponible',
        response: 'Ah, je comprends. Merci pour l\'information. Si à l\'avenir vous aviez d\'autres biens disponibles, nous serions heureux de collaborer. Bonne journée!',
      },
      {
        interrupt: 'pas le propriétaire|mauvais numéro',
        response: 'Je m\'excuse pour le dérangement. Pourriez-vous me dire comment contacter le propriétaire?',
      },
      {
        interrupt: 'rappelez-moi plus tard|rappelez après',
        response: 'Bien sûr. À quelle heure préféreriez-vous être rappelé? Je note et vous rappelle au moment le plus pratique.',
      },
    ],
    de: [
      {
        interrupt: 'nicht interessiert|will nicht|nein danke|nicht interessiert an Agenturen',
        response: 'Ich verstehe völlig. Wir sind keine traditionelle Agentur - wir arbeiten ausschließlich als Vermittler, um Immobilieneigentümer mit qualifizierten Käufern zu verbinden. Wir verlangen weder Exklusivität noch Verkäuferprovisionen. Wären Sie für eine einfache Besichtigung verfügbar?',
      },
      {
        interrupt: 'keine Zeit|beschäftigt|kann nicht',
        response: 'Ich verstehe, Zeit ist kostbar. Die Besichtigung würde nur 15-20 Minuten dauern und wir können sie zu jeder Zeit planen, die für Sie am bequemsten ist, auch am Wochenende. Wann wären Sie am ehesten verfügbar?',
      },
      {
        interrupt: 'Preis zu niedrig|lohnt sich nicht|der Preis',
        response: 'Ich verstehe Ihre Bedenken bezüglich des Preises. Unser Kunde ist seriös und kann ein wettbewerbsfähiges Angebot machen. Wir können es während der Besichtigung besprechen - wären Sie verfügbar, um sich zu treffen?',
      },
      {
        interrupt: 'bereits verkauft|nicht mehr verfügbar',
        response: 'Ah, ich verstehe. Vielen Dank für die Information. Wenn Sie in Zukunft andere Immobilien verfügbar hätten, würden wir gerne zusammenarbeiten. Schönen Tag!',
      },
      {
        interrupt: 'nicht der Eigentümer|falsche Nummer',
        response: 'Entschuldigen Sie die Störung. Könnten Sie mir sagen, wie ich den Eigentümer kontaktieren kann?',
      },
      {
        interrupt: 'rufen Sie mich später an|später anrufen',
        response: 'Gewiss. Zu welcher Zeit möchten Sie bevorzugt zurückgerufen werden? Ich notiere es mir und rufe Sie zum passendsten Zeitpunkt zurück.',
      },
    ],
    pt: [
      {
        interrupt: 'não me interessa|não quero|não obrigado|não me interessa agências',
        response: 'Entendo perfeitamente. Não somos uma agência tradicional - trabalhamos apenas como intermediários para conectar proprietários com compradores qualificados. Não pedimos exclusividade nem comissões ao vendedor. Estaria disponível para uma simples visita?',
      },
      {
        interrupt: 'não tenho tempo|ocupado|não posso',
        response: 'Entendo, o tempo é precioso. A visita levaria apenas 15-20 minutos e podemos agendá-la quando for mais conveniente para você, mesmo nos finais de semana. Quando estaria mais disponível?',
      },
      {
        interrupt: 'preço muito baixo|não vale|o preço',
        response: 'Compreendo suas preocupações sobre o preço. Nosso cliente é sério e pode fazer uma oferta competitiva. Podemos discutir isso durante a visita - estaria disponível para nos encontrarmos?',
      },
      {
        interrupt: 'já vendido|não está mais disponível',
        response: 'Ah, entendo. Obrigado pela informação. Se no futuro você tiver outras propriedades disponíveis, ficaríamos felizes em colaborar. Tenha um ótimo dia!',
      },
      {
        interrupt: 'não sou o proprietário|número errado',
        response: 'Desculpe o incômodo. Você poderia me dizer como entrar em contato com o proprietário?',
      },
      {
        interrupt: 'ligue mais tarde|ligue depois',
        response: 'Certamente. Que horário você prefere que eu ligue? Anoto e ligo no momento mais conveniente.',
      },
    ],
  };

  return handlers[locale] || handlers.en;
}

/**
 * Analizza il transcript della chiamata per determinare l'esito
 * (Questa funzione può essere migliorata con AI per analisi più sofisticata)
 */
export function analyzeCallOutcome(
  transcript: string,
  status: string
): 'appointment_set' | 'called' | 'rejected' | 'no_answer' {
  const transcriptLower = transcript.toLowerCase();

  // No answer o busy
  if (status === 'no-answer' || status === 'busy' || !transcript) {
    return 'no_answer';
  }

  // Segnali positivi (appuntamento fissato)
  const appointmentSignals = [
    'appuntamento',
    'visita',
    'sopralluogo',
    'vediamo',
    'ci sentiamo',
    'ci vediamo',
    'ok va bene',
    'perfetto',
    'd\'accordo',
    'sì disponibile',
    'quando',
    'che ora',
  ];

  if (appointmentSignals.some(signal => transcriptLower.includes(signal))) {
    // Verifica che non ci siano segnali negativi forti
    const strongRejectionSignals = ['no assolutamente', 'non mi interessa', 'non voglio', 'scusate ma no'];
    if (!strongRejectionSignals.some(signal => transcriptLower.includes(signal))) {
      return 'appointment_set';
    }
  }

  // Segnali di rifiuto
  const rejectionSignals = [
    'non mi interessa',
    'non voglio',
    'non sono interessato',
    'non chiamatemi più',
    'già venduto',
    'non disponibile',
    'non conviene',
  ];

  if (rejectionSignals.some(signal => transcriptLower.includes(signal))) {
    return 'rejected';
  }

  // Default: chiamata effettuata ma senza appuntamento
  return 'called';
}

