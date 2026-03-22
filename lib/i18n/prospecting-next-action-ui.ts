/** Next-action badge copy for `/dashboard/prospecting` table (UI locale). */

import type { NextActionIconKey, NextActionSuggestion } from '@/lib/ai/next-action-types';

export type ProspectingNextActionBlock =
  | 'priceDrop'
  | 'whatsapp3d'
  | 'virtualStagingSend'
  | 'predatorCall'
  | 'premiumReport'
  | 'emotionalFollowUp'
  | 'aiBriefing'
  | 'monitor';

export type ProspectingNextActionUi = {
  est0: string;
  /** replace('{n}', minutes as string) */
  estMinutes: string;
  priceDrop: { action: string; reasoning: string };
  whatsapp3d: { action: string; reasoning: string };
  virtualStagingSend: { action: string; reasoning: string };
  predatorCall: { action: string; reasoning: string };
  premiumReport: { action: string; reasoning: string };
  emotionalFollowUp: { action: string; reasoning: string };
  aiBriefing: { action: string; reasoning: string };
  monitor: { action: string; reasoning: string };
};

export function buildLocalizedNextActionSuggestion(
  copy: ProspectingNextActionUi,
  def: {
    iconKey: NextActionIconKey;
    priority: 'high' | 'medium' | 'low';
    minutes: number;
    block: ProspectingNextActionBlock;
    pct?: number;
  }
): NextActionSuggestion {
  const row = copy[def.block];
  let reasoning = row.reasoning;
  if (def.pct !== undefined) {
    reasoning = reasoning.replace(/\{pct\}/g, String(def.pct));
  }
  const estimatedTime =
    def.minutes <= 0
      ? copy.est0
      : copy.estMinutes.replace(/\{n\}/g, String(def.minutes));
  return {
    action: row.action,
    iconKey: def.iconKey,
    priority: def.priority,
    reasoning,
    estimatedTime,
  };
}

export const prospectingNextActionUiIt: ProspectingNextActionUi = {
  est0: '0 min',
  estMinutes: '{n} min',
  priceDrop: {
    action: 'Invia report aggiornato',
    reasoning:
      'Rilevato ribasso del {pct}%. Il proprietario è probabilmente più motivato a trattare.',
  },
  whatsapp3d: {
    action: 'Invia WhatsApp con visione 3D',
    reasoning:
      'Sono passati alcuni giorni dalla chiamata: la visione 3D può rinnovare interesse.',
  },
  virtualStagingSend: {
    action: 'Genera virtual staging e invia',
    reasoning:
      'Nessuna risposta da tempo: lo staging virtuale può riaccendere la conversazione.',
  },
  predatorCall: {
    action: 'Avvia chiamata AI (Predator)',
    reasoning:
      'Urgenza elevata: il proprietario potrebbe essere pronto a muoversi in fretta.',
  },
  premiumReport: {
    action: 'Genera report premium e invia',
    reasoning:
      'Opportunità di arbitraggio circa {pct}%: un report strutturato può convincere il proprietario.',
  },
  emotionalFollowUp: {
    action: 'Invia follow-up emotivo',
    reasoning:
      'La trattativa si allunga: un messaggio più umano può sbloccare la chiusura.',
  },
  aiBriefing: {
    action: 'Analizza con AI briefing',
    reasoning:
      'Nuovo annuncio: valuta pregi e difetti prima del primo contatto.',
  },
  monitor: {
    action: 'Monitora e attendi',
    reasoning: 'Nessuna azione urgente: continua a osservare evoluzione e segnali.',
  },
};

export const prospectingNextActionUiEn: ProspectingNextActionUi = {
  est0: '0 min',
  estMinutes: '{n} min',
  priceDrop: {
    action: 'Send updated report',
    reasoning:
      '{pct}% price drop detected. The owner may be more motivated to negotiate.',
  },
  whatsapp3d: {
    action: 'Send WhatsApp with 3D vision',
    reasoning:
      'Several days since the call: 3D visuals can renew interest.',
  },
  virtualStagingSend: {
    action: 'Generate virtual staging and send',
    reasoning:
      'No response for a while: virtual staging can restart the conversation.',
  },
  predatorCall: {
    action: 'Start AI call (Predator)',
    reasoning:
      'High urgency: the owner may be ready to move quickly.',
  },
  premiumReport: {
    action: 'Generate and send premium report',
    reasoning:
      'Roughly {pct}% arbitrage opportunity: a structured report can persuade the owner.',
  },
  emotionalFollowUp: {
    action: 'Send emotional follow-up',
    reasoning:
      'Negotiation is stalling: a more human touch can unlock a close.',
  },
  aiBriefing: {
    action: 'Analyze with AI briefing',
    reasoning:
      'New listing: review pros and cons before first outreach.',
  },
  monitor: {
    action: 'Monitor and wait',
    reasoning: 'No urgent action: keep watching for signals.',
  },
};
