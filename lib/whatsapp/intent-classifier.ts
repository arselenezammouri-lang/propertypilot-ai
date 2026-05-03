/**
 * WhatsApp Intent Classifier — GPT-4o-mini powered
 * Fast classification of incoming WhatsApp messages.
 * Detects intent, language, and extracts entities.
 */

import OpenAI from "openai";

let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  return _openai;
}

export type WAIntent =
  | "listing_inquiry"
  | "viewing_request"
  | "price_question"
  | "location_question"
  | "financing_question"
  | "general_question"
  | "booking_confirmation"
  | "booking_cancellation"
  | "greeting"
  | "thank_you"
  | "unknown";

export interface ClassificationResult {
  intent: WAIntent;
  confidence: number;
  language: string;
  extracted_entities: {
    property_type?: string;
    location?: string;
    budget_min?: number;
    budget_max?: number;
    rooms?: number;
    date_mentioned?: string;
    name?: string;
  };
  suggested_action: string;
}

const SYSTEM_PROMPT = `You are a message classifier for a European real estate WhatsApp agent.
Classify the user's message into exactly one intent and detect their language.

Intents:
- listing_inquiry: asking about a specific property or requesting listings
- viewing_request: wants to schedule/book a property viewing
- price_question: asking about price, value, or cost
- location_question: asking about neighborhood, area, transport, schools
- financing_question: asking about mortgage, financing, installments
- general_question: other real estate question
- booking_confirmation: confirming a scheduled viewing
- booking_cancellation: cancelling a viewing
- greeting: hello, hi, good morning
- thank_you: thanks, grazie, merci
- unknown: can't determine

Languages: it, fr, es, de, en, pt

Extract any entities: property_type, location, budget range, rooms, date, name.

Respond ONLY with valid JSON:
{"intent":"...","confidence":0.0-1.0,"language":"..","extracted_entities":{...},"suggested_action":"..."}`;

export async function classifyMessage(message: string): Promise<ClassificationResult> {
  // Fast path: simple pattern matching for common messages
  const lower = message.toLowerCase().trim();

  if (/^(ciao|salve|buongiorno|hello|hi|bonjour|hola|guten tag|olá|bom dia)/.test(lower)) {
    const langMap: Record<string, string> = {
      ciao: "it", salve: "it", buongiorno: "it",
      hello: "en", hi: "en",
      bonjour: "fr",
      hola: "es",
      "guten tag": "de",
      olá: "pt", "bom dia": "pt",
    };
    const detected = Object.entries(langMap).find(([k]) => lower.startsWith(k));
    return {
      intent: "greeting",
      confidence: 0.95,
      language: detected?.[1] || "en",
      extracted_entities: {},
      suggested_action: "Send welcome message with property search options",
    };
  }

  if (/^(grazie|merci|thanks|gracias|danke|obrigado)/.test(lower)) {
    return { intent: "thank_you", confidence: 0.95, language: "en", extracted_entities: {}, suggested_action: "Send polite closing" };
  }

  // AI classification for complex messages
  try {
    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message },
      ],
      temperature: 0.1,
      max_tokens: 200,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(raw) as ClassificationResult;
    return {
      intent: parsed.intent || "unknown",
      confidence: parsed.confidence || 0.5,
      language: parsed.language || "en",
      extracted_entities: parsed.extracted_entities || {},
      suggested_action: parsed.suggested_action || "",
    };
  } catch {
    // Fallback: keyword-based classification
    if (/visit|visita|visite|besichtigung|voir|viewing/.test(lower)) {
      return { intent: "viewing_request", confidence: 0.7, language: "en", extracted_entities: {}, suggested_action: "Offer viewing slots" };
    }
    if (/price|prezzo|prix|precio|preis|preço/.test(lower)) {
      return { intent: "price_question", confidence: 0.7, language: "en", extracted_entities: {}, suggested_action: "Provide price info" };
    }
    return { intent: "general_question", confidence: 0.3, language: "en", extracted_entities: {}, suggested_action: "Route to AI assistant" };
  }
}
