/**
 * AI Next-Action Suggestion
 * Suggerisce la prossima azione ottimale per un immobile basandosi sul suo stato
 */

export interface NextActionSuggestion {
  action: string;
  icon: string;
  priority: "high" | "medium" | "low";
  reasoning: string;
  estimatedTime: string; // es: "2 min"
}

export interface ListingContext {
  status: "new" | "analyzed" | "called" | "in_negotiation" | "mandate_taken";
  price_drop_percentage?: number | null;
  days_since_last_contact?: number;
  has_virtual_staging?: boolean;
  urgency_score?: number;
  market_gap?: number | null;
  last_action?: string;
}

/**
 * Genera suggerimento per la prossima azione
 */
export function suggestNextAction(context: ListingContext): NextActionSuggestion {
  // PRIORITÀ ALTA: Price Drop rilevato
  if (context.price_drop_percentage && context.price_drop_percentage > 0) {
    return {
      action: "Invia Report Aggiornato",
      icon: "📊",
      priority: "high",
      reasoning: `Ribasso di ${context.price_drop_percentage.toFixed(0)}% rilevato. Il proprietario è probabilmente motivato.`,
      estimatedTime: "2 min",
    };
  }

  // PRIORITÀ ALTA: Chiamato ma nessuna risposta dopo 48h
  if (context.status === "called" && context.days_since_last_contact && context.days_since_last_contact >= 2) {
    if (context.has_virtual_staging) {
      return {
        action: "Manda WhatsApp 3D Vision",
        icon: "📱",
        priority: "high",
        reasoning: "Sono passati 3 giorni dalla chiamata. Rinvitalizza l'interesse con la visione 3D.",
        estimatedTime: "1 min",
      };
    } else {
      return {
        action: "Genera Virtual Staging e Invia",
        icon: "🎨",
        priority: "high",
        reasoning: "Sono passati 3 giorni senza risposta. La visione 3D può riaccendere l'interesse.",
        estimatedTime: "5 min",
      };
    }
  }

  // PRIORITÀ ALTA: Urgenza alta e non ancora contattato
  if (context.urgency_score && context.urgency_score >= 70 && context.status === "new") {
    return {
      action: "Lancia Chiamata Predator",
      icon: "📞",
      priority: "high",
      reasoning: "Urgenza CRITICA rilevata. Il proprietario è probabilmente molto motivato.",
      estimatedTime: "3 min",
    };
  }

  // PRIORITÀ MEDIA: Market Gap alto
  if (context.market_gap && context.market_gap > 15 && context.status === "new") {
    return {
      action: "Genera Premium Report e Invia",
      icon: "📄",
      priority: "medium",
      reasoning: `Opportunità di arbitraggio ${context.market_gap.toFixed(0)}%. Il report può convincere il proprietario.`,
      estimatedTime: "3 min",
    };
  }

  // PRIORITÀ MEDIA: In trattativa da più di 7 giorni
  if (context.status === "in_negotiation" && context.days_since_last_contact && context.days_since_last_contact >= 7) {
    return {
      action: "Invia Follow-Up Emozionale",
      icon: "💌",
      priority: "medium",
      reasoning: "La trattativa si sta allungando. Un follow-up emozionale può chiudere l'affare.",
      estimatedTime: "2 min",
    };
  }

  // PRIORITÀ BASSA: Nuovo listing
  if (context.status === "new") {
    return {
      action: "Analizza con AI Briefing",
      icon: "🔍",
      priority: "low",
      reasoning: "Nuovo immobile rilevato. Analizza vantaggi e difetti prima di procedere.",
      estimatedTime: "1 min",
    };
  }

  // Default: Nessuna azione urgente
  return {
    action: "Monitora e Attendi",
    icon: "👁️",
    priority: "low",
    reasoning: "Nessuna azione urgente richiesta. Continua a monitorare.",
    estimatedTime: "0 min",
  };
}

