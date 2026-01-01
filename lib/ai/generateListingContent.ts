import OpenAI from 'openai';
import { ScrapedListing } from '@/lib/scrapers/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface PropertyInput {
  type?: string;
  price?: string;
  location?: string;
  surface?: string;
  rooms?: string;
  features?: string[];
  description_raw?: string;
  images?: string[];
}

export interface GeneratedContent {
  professional: string;
  short: string;
  emotional: string;
  titles: string[];
  videoScript: string;
  emailFollowUp: string;
  strengths: string[];
  weaknesses: string[];
  homeStaging: string[];
  portalDescription: string;
}

/**
 * Build comprehensive property description from scraped data or manual input
 */
function buildPropertyDescription(data: PropertyInput): string {
  const parts: string[] = [];
  
  if (data.type) parts.push(`Tipo: ${data.type}`);
  if (data.price) parts.push(`Prezzo: ${data.price}`);
  if (data.location) parts.push(`Località: ${data.location}`);
  if (data.surface) parts.push(`Superficie: ${data.surface}`);
  if (data.rooms) parts.push(`Locali: ${data.rooms}`);
  
  if (data.features && data.features.length > 0) {
    parts.push(`Caratteristiche: ${data.features.join(', ')}`);
  }
  
  if (data.description_raw) {
    parts.push(`Descrizione originale: ${data.description_raw}`);
  }
  
  return parts.join('\n');
}

/**
 * Generate professional listing (150-200 words with SEO optimization)
 */
async function generateProfessionalListing(propertyDescription: string): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `Sei un esperto copywriter immobiliare italiano. Crea descrizioni professionali e persuasive per annunci immobiliari in italiano.
        
Regole:
- Lunghezza: 150-200 parole
- Stile: professionale, convincente, ricco di dettagli
- SEO: includi parole chiave naturalmente integrate
- Struttura: introduzione accattivante, descrizione dettagliata, call-to-action finale
- Enfatizza i punti di forza e le caratteristiche uniche
- Usa linguaggio evocativo ma professionale
- Non inventare dettagli non presenti nei dati forniti`
      },
      {
        role: 'user',
        content: `Crea una descrizione professionale per questo immobile:\n\n${propertyDescription}`
      }
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  return completion.choices[0].message.content || '';
}

/**
 * Generate short listing (max 50 words for portals like Subito.it/Idealista)
 */
async function generateShortListing(propertyDescription: string): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `Sei un esperto copywriter immobiliare. Crea descrizioni brevi e impattanti per annunci immobiliari.
        
Regole:
- Massimo 50 parole
- Stile: diretto, efficace, persuasivo
- Concentrati sui punti chiave: prezzo, posizione, caratteristiche principali
- Usa frasi brevi e incisive
- Ideale per Subito.it, Idealista, Facebook Marketplace`
      },
      {
        role: 'user',
        content: `Crea una descrizione breve (max 50 parole) per questo immobile:\n\n${propertyDescription}`
      }
    ],
    temperature: 0.7,
    max_tokens: 150,
  });

  return completion.choices[0].message.content || '';
}

/**
 * Generate emotional description (story-driven, lifestyle-focused)
 */
async function generateEmotionalListing(propertyDescription: string): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `Sei un esperto storyteller immobiliare. Crea descrizioni emozionali che evocano stili di vita e sogni.
        
Regole:
- Lunghezza: 120-150 parole
- Stile: emotivo, evocativo, narrativo
- Focus su esperienze di vita, non solo caratteristiche tecniche
- Usa i 5 sensi per creare immagini vivide
- Racconta la storia dell'immobile e di chi potrebbe viverci
- Linguaggio coinvolgente e aspirazionale
- Perfetto per social media e marketing emozionale`
      },
      {
        role: 'user',
        content: `Crea una descrizione emozionale per questo immobile:\n\n${propertyDescription}`
      }
    ],
    temperature: 0.8,
    max_tokens: 400,
  });

  return completion.choices[0].message.content || '';
}

/**
 * Generate 5 catchy titles (max 8 words each)
 */
async function generateTitles(propertyDescription: string): Promise<string[]> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `Sei un esperto di titoli pubblicitari immobiliari. Crea titoli accattivanti e SEO-friendly.
        
Regole:
- Genera esattamente 5 titoli diversi
- Massimo 8 parole per titolo
- Stile: persuasivo, chiaro, memorabile
- Includi parole chiave importanti (località, tipo immobile, caratteristica unica)
- Varietà: professionale, emozionale, urgente, aspirazionale, descrittivo
- Formatta ogni titolo su una riga separata, numerato`
      },
      {
        role: 'user',
        content: `Crea 5 titoli accattivanti per questo immobile:\n\n${propertyDescription}`
      }
    ],
    temperature: 0.8,
    max_tokens: 200,
  });

  const response = completion.choices[0].message.content || '';
  
  // Parse numbered list or line-separated titles
  const titles = response
    .split('\n')
    .map(line => line.replace(/^\d+\.\s*/, '').trim())
    .filter(line => line.length > 0)
    .slice(0, 5);

  return titles;
}

/**
 * Generate video script for Instagram Reels / TikTok (30-45 seconds)
 */
async function generateVideoScript(propertyDescription: string): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `Sei un esperto di video marketing immobiliare per social media. Crea script per video brevi e coinvolgenti.
        
Regole:
- Durata: 30-45 secondi (circa 80-120 parole)
- Formato: Instagram Reels, TikTok, YouTube Shorts
- Struttura: Hook potente (1-3 sec) → Punti chiave (25-35 sec) → Call-to-action (5 sec)
- Linguaggio: dinamico, giovane, diretto
- Includi indicazioni per riprese (es. "Panoramica esterna", "Zoom su cucina")
- Numera le scene per facilitare le riprese`
      },
      {
        role: 'user',
        content: `Crea uno script video (30-45 sec) per questo immobile:\n\n${propertyDescription}`
      }
    ],
    temperature: 0.8,
    max_tokens: 300,
  });

  return completion.choices[0].message.content || '';
}

/**
 * Generate follow-up email template for potential buyers
 */
async function generateEmailFollowUp(propertyDescription: string): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `Sei un agente immobiliare esperto in email marketing. Crea email di follow-up professionali e personalizzate.
        
Regole:
- Oggetto email incluso nella prima riga
- Tono: professionale ma cordiale
- Lunghezza: 150-200 parole
- Struttura: saluto → richiamo interesse → dettagli immobile → valore aggiunto → call-to-action
- Includi domande per stimolare risposta
- Suggerisci next steps concreti (visita, video call, documentazione)`
      },
      {
        role: 'user',
        content: `Crea una email di follow-up per un potenziale acquirente interessato a questo immobile:\n\n${propertyDescription}`
      }
    ],
    temperature: 0.7,
    max_tokens: 400,
  });

  return completion.choices[0].message.content || '';
}

/**
 * Analyze property strengths and weaknesses
 */
async function analyzeStrengthsWeaknesses(propertyDescription: string): Promise<{ strengths: string[], weaknesses: string[] }> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `Sei un consulente immobiliare esperto. Analizza oggettivamente punti di forza e debolezze di un immobile.
        
Regole per PUNTI DI FORZA:
- Lista 3-5 caratteristiche positive concrete
- Focus su: posizione, caratteristiche uniche, valore per il prezzo, potenziale
- Sii specifico e realistico

Regole per PUNTI DI DEBOLEZZA:
- Lista 2-4 aspetti critici o aree di miglioramento
- Focus su: problemi strutturali, necessità di ristrutturazione, limitazioni, svantaggi di posizione
- Sii onesto ma diplomatico

Formato risposta:
PUNTI DI FORZA:
1. [punto]
2. [punto]
...

PUNTI DI DEBOLEZZA:
1. [punto]
2. [punto]
...`
      },
      {
        role: 'user',
        content: `Analizza punti di forza e debolezze di questo immobile:\n\n${propertyDescription}`
      }
    ],
    temperature: 0.6,
    max_tokens: 400,
  });

  const response = completion.choices[0].message.content || '';
  
  // Parse strengths and weaknesses
  const strengthsMatch = response.match(/PUNTI DI FORZA:([\s\S]*?)(?=PUNTI DI DEBOLEZZA:|$)/i);
  const weaknessesMatch = response.match(/PUNTI DI DEBOLEZZA:([\s\S]*)/i);
  
  const parseList = (text: string): string[] => {
    return text
      .split('\n')
      .map(line => line.replace(/^\d+\.\s*/, '').replace(/^-\s*/, '').trim())
      .filter(line => line.length > 0);
  };
  
  const strengths = strengthsMatch ? parseList(strengthsMatch[1]) : [];
  const weaknesses = weaknessesMatch ? parseList(weaknessesMatch[1]) : [];

  return { strengths, weaknesses };
}

/**
 * Generate home staging suggestions
 */
async function generateHomeStagingSuggestions(propertyDescription: string): Promise<string[]> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `Sei un esperto di home staging immobiliare. Fornisci consigli pratici per valorizzare un immobile prima della vendita.
        
Regole:
- Genera 5-7 suggerimenti concreti e attuabili
- Focus su: pulizia, depersonalizzazione, illuminazione, disposizione mobili, piccoli interventi
- Budget-friendly: privilegia soluzioni a basso costo
- Priorità su impatto visivo massimo
- Linguaggio chiaro e istruzioni precise
- Formatta come lista numerata`
      },
      {
        role: 'user',
        content: `Suggerisci miglioramenti di home staging per questo immobile:\n\n${propertyDescription}`
      }
    ],
    temperature: 0.7,
    max_tokens: 400,
  });

  const response = completion.choices[0].message.content || '';
  
  const suggestions = response
    .split('\n')
    .map(line => line.replace(/^\d+\.\s*/, '').replace(/^-\s*/, '').trim())
    .filter(line => line.length > 0);

  return suggestions;
}

/**
 * Generate optimized description for Italian real estate portals
 */
async function generatePortalDescription(propertyDescription: string): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `Sei un esperto di annunci immobiliari per portali italiani (Immobiliare.it, Idealista.it, Casa.it).
        
Regole:
- Lunghezza: 100-150 parole
- Ottimizzato per SEO dei portali immobiliari
- Includi dettagli tecnici: superficie, locali, piano, stato
- Struttura chiara: tipo immobile → posizione → caratteristiche → servizi → contatto
- Keywords strategiche per i motori di ricerca interni
- Tono professionale ma accessibile
- Formattazione pulita con paragrafi brevi`
      },
      {
        role: 'user',
        content: `Crea una descrizione ottimizzata per portali immobiliari italiani:\n\n${propertyDescription}`
      }
    ],
    temperature: 0.7,
    max_tokens: 400,
  });

  return completion.choices[0].message.content || '';
}

/**
 * Generate English translation for international buyers
 */
async function generateEnglishTranslation(propertyDescription: string): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are an expert real estate copywriter specializing in properties for international buyers in Italy.
        
Rules:
- Length: 150-200 words
- Professional English with focus on international appeal
- Highlight Italy-specific lifestyle benefits
- Include practical info for foreign buyers
- SEO-optimized for international property searches
- Clear, engaging, persuasive tone`
      },
      {
        role: 'user',
        content: `Translate and enhance this Italian property description for international buyers:\n\n${propertyDescription}`
      }
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  return completion.choices[0].message.content || '';
}

/**
 * Main function: Generate all content types for a property
 */
export async function generateComprehensiveContent(
  data: ScrapedListing | PropertyInput
): Promise<GeneratedContent> {
  const propertyDescription = buildPropertyDescription(data);
  
  // Execute all generations in parallel for speed
  const [
    professional,
    short,
    emotional,
    titles,
    videoScript,
    emailFollowUp,
    analysis,
    homeStaging,
    portalDescription,
  ] = await Promise.all([
    generateProfessionalListing(propertyDescription),
    generateShortListing(propertyDescription),
    generateEmotionalListing(propertyDescription),
    generateTitles(propertyDescription),
    generateVideoScript(propertyDescription),
    generateEmailFollowUp(propertyDescription),
    analyzeStrengthsWeaknesses(propertyDescription),
    generateHomeStagingSuggestions(propertyDescription),
    generatePortalDescription(propertyDescription),
  ]);

  return {
    professional,
    short,
    emotional,
    titles,
    videoScript,
    emailFollowUp,
    strengths: analysis.strengths,
    weaknesses: analysis.weaknesses,
    homeStaging,
    portalDescription,
  };
}

/**
 * Generate only basic content (professional, short, titles, English)
 * For backward compatibility with existing generate API
 */
export async function generateBasicContent(
  data: PropertyInput
): Promise<{
  professional: string;
  short: string;
  titles: string[];
  english: string;
}> {
  const propertyDescription = buildPropertyDescription(data);
  
  const [professional, short, titles, english] = await Promise.all([
    generateProfessionalListing(propertyDescription),
    generateShortListing(propertyDescription),
    generateTitles(propertyDescription),
    generateEnglishTranslation(propertyDescription),
  ]);

  return { professional, short, titles, english };
}
