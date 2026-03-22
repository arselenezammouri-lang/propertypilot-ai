/**
 * AI Next-Action Suggestion
 * Suggerisce la prossima azione ottimale per un immobile basandosi sul suo stato
 */

import {
  buildLocalizedNextActionSuggestion,
  type ProspectingNextActionUi,
} from '@/lib/i18n/prospecting-next-action-ui';
import type { NextActionIconKey, NextActionSuggestion } from '@/lib/ai/next-action-types';

export type { NextActionIconKey, NextActionSuggestion } from '@/lib/ai/next-action-types';

export interface ListingContext {
  status: 'new' | 'analyzed' | 'called' | 'in_negotiation' | 'mandate_taken';
  price_drop_percentage?: number | null;
  days_since_last_contact?: number;
  has_virtual_staging?: boolean;
  urgency_score?: number;
  market_gap?: number | null;
  last_action?: string;
}

/**
 * Genera suggerimento per la prossima azione (copy dalla lingua UI dashboard).
 */
export function suggestNextAction(
  copy: ProspectingNextActionUi,
  context: ListingContext
): NextActionSuggestion {
  if (context.price_drop_percentage && context.price_drop_percentage > 0) {
    return buildLocalizedNextActionSuggestion(copy, {
      iconKey: 'barChart',
      priority: 'high',
      minutes: 2,
      block: 'priceDrop',
      pct: Math.round(context.price_drop_percentage),
    });
  }

  if (
    context.status === 'called' &&
    context.days_since_last_contact &&
    context.days_since_last_contact >= 2
  ) {
    if (context.has_virtual_staging) {
      return buildLocalizedNextActionSuggestion(copy, {
        iconKey: 'smartphone',
        priority: 'high',
        minutes: 1,
        block: 'whatsapp3d',
      });
    }
    return buildLocalizedNextActionSuggestion(copy, {
      iconKey: 'palette',
      priority: 'high',
      minutes: 5,
      block: 'virtualStagingSend',
    });
  }

  if (context.urgency_score && context.urgency_score >= 70 && context.status === 'new') {
    return buildLocalizedNextActionSuggestion(copy, {
      iconKey: 'phone',
      priority: 'high',
      minutes: 3,
      block: 'predatorCall',
    });
  }

  if (context.market_gap && context.market_gap > 15 && context.status === 'new') {
    return buildLocalizedNextActionSuggestion(copy, {
      iconKey: 'fileText',
      priority: 'medium',
      minutes: 3,
      block: 'premiumReport',
      pct: Math.round(context.market_gap),
    });
  }

  if (
    context.status === 'in_negotiation' &&
    context.days_since_last_contact &&
    context.days_since_last_contact >= 7
  ) {
    return buildLocalizedNextActionSuggestion(copy, {
      iconKey: 'mail',
      priority: 'medium',
      minutes: 2,
      block: 'emotionalFollowUp',
    });
  }

  if (context.status === 'new') {
    return buildLocalizedNextActionSuggestion(copy, {
      iconKey: 'search',
      priority: 'low',
      minutes: 1,
      block: 'aiBriefing',
    });
  }

  return buildLocalizedNextActionSuggestion(copy, {
    iconKey: 'eye',
    priority: 'low',
    minutes: 0,
    block: 'monitor',
  });
}
