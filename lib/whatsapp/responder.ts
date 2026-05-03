/**
 * WhatsApp Responder — Generates responses based on intent + context
 */

import { sendMessage, sendListingCarousel, sendBookingLink, type WAListingCard } from "./client";
import type { WAIntent, ClassificationResult } from "./intent-classifier";

interface LeadContext {
  name: string | null;
  language: string;
  previousMessages: number;
}

interface ListingData {
  title: string;
  description: string;
  price: string;
  imageUrl: string;
  url: string;
  surface: string;
  rooms: number;
}

/* ─── Language-specific responses ─── */

const GREETINGS: Record<string, string> = {
  it: "Ciao! 👋 Benvenuto su PropertyPilot. Come posso aiutarti?\n\n🏠 Cerca immobili\n📅 Prenota una visita\n💰 Informazioni sui prezzi\n❓ Domanda generale",
  fr: "Bonjour ! 👋 Bienvenue sur PropertyPilot. Comment puis-je vous aider ?\n\n🏠 Rechercher des biens\n📅 Réserver une visite\n💰 Informations sur les prix\n❓ Question générale",
  es: "¡Hola! 👋 Bienvenido a PropertyPilot. ¿Cómo puedo ayudarle?\n\n🏠 Buscar propiedades\n📅 Reservar una visita\n💰 Información de precios\n❓ Pregunta general",
  de: "Hallo! 👋 Willkommen bei PropertyPilot. Wie kann ich Ihnen helfen?\n\n🏠 Immobilien suchen\n📅 Besichtigung buchen\n💰 Preisinformationen\n❓ Allgemeine Frage",
  en: "Hello! 👋 Welcome to PropertyPilot. How can I help you?\n\n🏠 Search properties\n📅 Book a viewing\n💰 Price information\n❓ General question",
  pt: "Olá! 👋 Bem-vindo ao PropertyPilot. Como posso ajudar?\n\n🏠 Pesquisar imóveis\n📅 Agendar uma visita\n💰 Informações de preços\n❓ Pergunta geral",
};

const VIEWING_PROMPTS: Record<string, string> = {
  it: "Perfetto! 📅 Per prenotare una visita, scelga uno slot disponibile:",
  fr: "Parfait ! 📅 Pour réserver une visite, choisissez un créneau :",
  es: "¡Perfecto! 📅 Para reservar una visita, elija un horario disponible:",
  de: "Perfekt! 📅 Um eine Besichtigung zu buchen, wählen Sie einen Termin:",
  en: "Great! 📅 To book a viewing, choose an available slot:",
  pt: "Perfeito! 📅 Para agendar uma visita, escolha um horário disponível:",
};

const PRICE_RESPONSES: Record<string, string> = {
  it: "💰 Il prezzo dell'immobile è {price}.\n\nDesideri informazioni sul finanziamento o vuoi prenotare una visita?",
  fr: "💰 Le prix du bien est {price}.\n\nSouhaitez-vous des informations sur le financement ou réserver une visite ?",
  es: "💰 El precio del inmueble es {price}.\n\nDesea información sobre financiación o reservar una visita?",
  de: "💰 Der Preis der Immobilie beträgt {price}.\n\nMöchten Sie Finanzierungsinformationen oder eine Besichtigung buchen?",
  en: "💰 The property price is {price}.\n\nWould you like financing information or to book a viewing?",
  pt: "💰 O preço do imóvel é {price}.\n\nDeseja informações sobre financiamento ou agendar uma visita?",
};

const THANKS: Record<string, string> = {
  it: "Grazie a te! 🙏 Se hai bisogno di altro, sono qui. Buona giornata! ☀️",
  fr: "Merci à vous ! 🙏 Si vous avez besoin d'autre chose, je suis là. Bonne journée ! ☀️",
  es: "¡Gracias! 🙏 Si necesita algo más, estoy aquí. ¡Buen día! ☀️",
  de: "Vielen Dank! 🙏 Wenn Sie etwas anderes brauchen, bin ich hier. Schönen Tag! ☀️",
  en: "Thank you! 🙏 If you need anything else, I'm here. Have a great day! ☀️",
  pt: "Obrigado! 🙏 Se precisar de mais alguma coisa, estou aqui. Bom dia! ☀️",
};

/**
 * Generate and send appropriate response based on classified intent
 */
export async function respondToMessage(
  phone: string,
  classification: ClassificationResult,
  lead: LeadContext,
  listings: ListingData[],
  calComUrl: string | null
): Promise<{ response: string; messagesSent: number }> {
  const lang = classification.language || lead.language || "en";
  let response = "";
  let messagesSent = 0;

  switch (classification.intent) {
    case "greeting": {
      response = GREETINGS[lang] || GREETINGS.en;
      await sendMessage(phone, response);
      messagesSent = 1;
      break;
    }

    case "listing_inquiry": {
      if (listings.length > 0) {
        const cards: WAListingCard[] = listings.slice(0, 5).map((l) => ({
          title: l.title, description: `${l.surface} · ${l.rooms} rooms`,
          imageUrl: l.imageUrl, price: l.price, url: l.url,
        }));
        await sendListingCarousel(phone, cards);
        response = `Sent ${cards.length} matching listings`;
        messagesSent = 1;
      } else {
        const noResults: Record<string, string> = {
          it: "Al momento non ho annunci corrispondenti alla tua ricerca. Vuoi che ti avvisi quando ne trovo uno?",
          en: "I don't have matching listings right now. Shall I notify you when I find one?",
        };
        response = noResults[lang] || noResults.en;
        await sendMessage(phone, response);
        messagesSent = 1;
      }
      break;
    }

    case "viewing_request": {
      const prompt = VIEWING_PROMPTS[lang] || VIEWING_PROMPTS.en;
      if (calComUrl) {
        const propertyTitle = listings[0]?.title || "Property";
        await sendBookingLink(phone, calComUrl, propertyTitle);
        response = prompt;
      } else {
        const noCalendar: Record<string, string> = {
          it: "📅 Sarò felice di organizzare una visita. Quali giorni e orari preferisci?",
          en: "📅 I'd be happy to arrange a viewing. What days and times work for you?",
        };
        response = noCalendar[lang] || noCalendar.en;
        await sendMessage(phone, response);
      }
      messagesSent = 1;
      break;
    }

    case "price_question": {
      const priceText = listings[0]?.price || "on request";
      response = (PRICE_RESPONSES[lang] || PRICE_RESPONSES.en).replace("{price}", priceText);
      await sendMessage(phone, response);
      messagesSent = 1;
      break;
    }

    case "thank_you": {
      response = THANKS[lang] || THANKS.en;
      await sendMessage(phone, response);
      messagesSent = 1;
      break;
    }

    default: {
      const defaults: Record<string, string> = {
        it: "Grazie per il messaggio! Un agente ti risponderà a breve. Nel frattempo, posso aiutarti a cercare immobili o prenotare una visita. 🏠",
        en: "Thanks for your message! An agent will get back to you shortly. Meanwhile, I can help you search properties or book a viewing. 🏠",
      };
      response = defaults[lang] || defaults.en;
      await sendMessage(phone, response);
      messagesSent = 1;
      break;
    }
  }

  return { response, messagesSent };
}
