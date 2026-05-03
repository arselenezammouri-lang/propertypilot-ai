/**
 * Bland AI Conversational Pathways — 3 core pathways for real estate
 *
 * Each pathway is a conversation flow that Bland AI follows.
 * Pathways support 6 languages with auto-detect on first response.
 *
 * Language mapping: IT, FR, ES, DE, EN, PT
 * Auto-detect: Bland analyzes the first user response and switches language.
 */

export type PathwayId = "inbound-listing-inquiry" | "outbound-new-lead-callback" | "viewing-booking";
export type VoiceLanguage = "it" | "fr" | "es" | "de" | "en" | "pt";

interface PathwayConfig {
  id: PathwayId;
  name: string;
  description: string;
  task: string;
  first_sentence: Record<VoiceLanguage, string>;
  voice: Record<VoiceLanguage, string>;
  max_duration: number; // minutes
}

/* ─── Language-specific voice IDs (ElevenLabs Multilingual v2) ─── */

export const VOICE_MAP: Record<VoiceLanguage, { voiceId: string; name: string }> = {
  it: { voiceId: "pNInz6obpgDQGcFmaJgB", name: "Adam (Italian)" },
  fr: { voiceId: "EXAVITQu4vr4xnSDxMaL", name: "Sarah (French)" },
  es: { voiceId: "onwK4e9ZLuTAKqWW03F9", name: "Daniel (Spanish)" },
  de: { voiceId: "N2lVS1w4EtoT3dr4eOWO", name: "Callum (German)" },
  en: { voiceId: "21m00Tcm4TlvDq8ikWAM", name: "Rachel (English)" },
  pt: { voiceId: "AZnzlk1XvdvUeBnXmlld", name: "Domi (Portuguese)" },
};

/* ─── Pathway Definitions ─── */

export const PATHWAYS: Record<PathwayId, PathwayConfig> = {
  "inbound-listing-inquiry": {
    id: "inbound-listing-inquiry",
    name: "Inbound Listing Inquiry",
    description: "Handles incoming calls about a specific property listing. Qualifies the lead, answers questions, and books a viewing if interested.",
    max_duration: 5,
    first_sentence: {
      it: "Buongiorno, grazie per aver chiamato PropertyPilot. Sono l'assistente AI dell'agenzia. Come posso aiutarla oggi?",
      fr: "Bonjour, merci d'avoir appelé PropertyPilot. Je suis l'assistant IA de l'agence. Comment puis-je vous aider ?",
      es: "Buenos días, gracias por llamar a PropertyPilot. Soy el asistente de IA de la agencia. ¿En qué puedo ayudarle?",
      de: "Guten Tag, vielen Dank für Ihren Anruf bei PropertyPilot. Ich bin der KI-Assistent der Agentur. Wie kann ich Ihnen helfen?",
      en: "Hello, thank you for calling PropertyPilot. I'm the agency's AI assistant. How can I help you today?",
      pt: "Bom dia, obrigado por ligar para a PropertyPilot. Sou o assistente de IA da agência. Como posso ajudá-lo?",
    },
    voice: Object.fromEntries(Object.entries(VOICE_MAP).map(([k, v]) => [k, v.voiceId])) as Record<VoiceLanguage, string>,
    task: `You are a professional real estate AI assistant for a European agency.
Your job is to handle inbound calls about property listings.

CONVERSATION FLOW:
1. GREET warmly and ask which property they're interested in
2. IDENTIFY the listing (ask for address, reference number, or describe what they saw online)
3. QUALIFY the lead:
   - Ask about their budget range
   - Ask about their timeline (when do they want to move/buy?)
   - Ask if they have mortgage pre-approval or financing arranged
   - Ask what features are most important to them
4. ANSWER questions about the property using the context provided
5. If interested, BOOK A VIEWING:
   - Ask for their preferred dates/times
   - Confirm their full name, email, and phone number
   - Say you'll send a calendar invitation
6. If not interested, ask what they ARE looking for and offer to help

RULES:
- Be warm, professional, and concise
- Never pressure the caller
- If you don't know a specific detail about the property, say "I'll have the agent follow up with that information"
- Always end by confirming next steps
- Detect the caller's language and respond in the same language`,
  },

  "outbound-new-lead-callback": {
    id: "outbound-new-lead-callback",
    name: "Outbound Lead Callback",
    description: "Auto-triggered when a hot lead (80+ score) arrives. Calls within 60 seconds to qualify and book.",
    max_duration: 4,
    first_sentence: {
      it: "Buongiorno, sono l'assistente di {agency_name}. Ha recentemente mostrato interesse per un immobile sul nostro sito. Avrebbe qualche minuto per parlarne?",
      fr: "Bonjour, je suis l'assistant de {agency_name}. Vous avez récemment montré de l'intérêt pour un bien sur notre site. Avez-vous quelques minutes ?",
      es: "Buenos días, soy el asistente de {agency_name}. Recientemente mostró interés en una propiedad en nuestro sitio. ¿Tiene unos minutos para hablar?",
      de: "Guten Tag, ich bin der Assistent von {agency_name}. Sie haben kürzlich Interesse an einer Immobilie auf unserer Seite gezeigt. Haben Sie einen Moment Zeit?",
      en: "Hello, I'm the assistant from {agency_name}. You recently showed interest in a property on our website. Do you have a few minutes to chat?",
      pt: "Bom dia, sou o assistente da {agency_name}. Recentemente demonstrou interesse num imóvel no nosso site. Tem alguns minutos?",
    },
    voice: Object.fromEntries(Object.entries(VOICE_MAP).map(([k, v]) => [k, v.voiceId])) as Record<VoiceLanguage, string>,
    task: `You are making a speed-to-lead callback for a real estate agency.
The lead just expressed interest in a property (via Idealista, Immobiliare.it, SeLoger, etc.).
You must call FAST and be efficient.

CONVERSATION FLOW:
1. INTRODUCE yourself as the agency's assistant
2. CONFIRM they inquired about the property
3. QUICK QUALIFY:
   - "Is this for yourself or for investment?"
   - "What's your approximate budget?"
   - "When are you looking to make a decision?"
4. If interested: BOOK a viewing immediately
   - "We have availability this [day]. Would [time] work for you?"
   - Get their full name and confirm contact details
5. If not ready: schedule a follow-up
   - "No problem. When would be a good time for me to call back?"
6. END with clear next steps

RULES:
- Keep it under 3 minutes
- Be enthusiastic but not pushy
- Speed matters — this is about capturing the lead while they're hot
- Match the caller's language automatically`,
  },

  "viewing-booking": {
    id: "viewing-booking",
    name: "Viewing Booking",
    description: "Dedicated pathway for scheduling property viewings. Syncs with calendar.",
    max_duration: 3,
    first_sentence: {
      it: "Buongiorno, la chiamo per organizzare una visita all'immobile che le interessa. Quando le farebbe comodo?",
      fr: "Bonjour, je vous appelle pour organiser une visite du bien qui vous intéresse. Quand cela vous conviendrait-il ?",
      es: "Buenos días, le llamo para organizar una visita al inmueble que le interesa. ¿Cuándo le vendría bien?",
      de: "Guten Tag, ich rufe an, um eine Besichtigung der Immobilie zu vereinbaren, die Sie interessiert. Wann passt es Ihnen?",
      en: "Hello, I'm calling to arrange a viewing of the property you're interested in. When would work best for you?",
      pt: "Bom dia, ligo para organizar uma visita ao imóvel que lhe interessa. Quando lhe daria jeito?",
    },
    voice: Object.fromEntries(Object.entries(VOICE_MAP).map(([k, v]) => [k, v.voiceId])) as Record<VoiceLanguage, string>,
    task: `You are a viewing scheduler for a real estate agency.
Your ONLY job is to find a mutually convenient time and book a viewing.

FLOW:
1. Confirm the property they want to view
2. Offer 2-3 available time slots
3. Confirm their choice
4. Get their full name, email, phone
5. Confirm the booking and say they'll receive a calendar invite

Keep it under 2 minutes. Be efficient and friendly.`,
  },
};

/**
 * Build a Bland AI call request from a pathway + lead context
 */
export function buildCallRequest(
  pathwayId: PathwayId,
  phone: string,
  language: VoiceLanguage,
  context: {
    agencyName?: string;
    propertyTitle?: string;
    propertyAddress?: string;
    propertyPrice?: string;
    leadName?: string;
    leadEmail?: string;
  }
): {
  phone_number: string;
  task: string;
  first_sentence: string;
  voice: string;
  language: string;
  max_duration: number;
  metadata: Record<string, string>;
} {
  const pathway = PATHWAYS[pathwayId];
  let firstSentence = pathway.first_sentence[language] || pathway.first_sentence.en;
  let task = pathway.task;

  // Inject context
  if (context.agencyName) {
    firstSentence = firstSentence.replace("{agency_name}", context.agencyName);
  }
  if (context.propertyTitle) {
    task += `\n\nPROPERTY CONTEXT:\nTitle: ${context.propertyTitle}\nAddress: ${context.propertyAddress || "N/A"}\nPrice: ${context.propertyPrice || "On request"}\nLead name: ${context.leadName || "Unknown"}\nLead email: ${context.leadEmail || "N/A"}`;
  }

  return {
    phone_number: phone,
    task,
    first_sentence: firstSentence,
    voice: pathway.voice[language] || pathway.voice.en,
    language,
    max_duration: pathway.max_duration,
    metadata: {
      pathway_id: pathwayId,
      language,
      lead_name: context.leadName || "",
      lead_email: context.leadEmail || "",
    },
  };
}
