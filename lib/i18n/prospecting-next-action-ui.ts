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

export const prospectingNextActionUiEs: ProspectingNextActionUi = {
  est0: '0 min',
  estMinutes: '{n} min',
  priceDrop: {
    action: 'Enviar informe actualizado',
    reasoning:
      'Descenso del {pct}% detectado. El propietario podría estar más motivado a negociar.',
  },
  whatsapp3d: {
    action: 'Enviar WhatsApp con visión 3D',
    reasoning:
      'Han pasado varios días desde la llamada: las imágenes 3D pueden renovar el interés.',
  },
  virtualStagingSend: {
    action: 'Generar home staging virtual y enviar',
    reasoning:
      'Sin respuesta desde hace tiempo: el staging virtual puede reactivar la conversación.',
  },
  predatorCall: {
    action: 'Iniciar llamada IA (Predator)',
    reasoning:
      'Alta urgencia: el propietario podría estar listo para avanzar rápido.',
  },
  premiumReport: {
    action: 'Generar y enviar informe premium',
    reasoning:
      'Oportunidad de arbitraje de unos {pct}%: un informe estructurado puede convencer al propietario.',
  },
  emotionalFollowUp: {
    action: 'Enviar seguimiento emocional',
    reasoning:
      'La negociación se estanca: un tono más humano puede desbloquear el cierre.',
  },
  aiBriefing: {
    action: 'Analizar con briefing IA',
    reasoning:
      'Nuevo anuncio: revisa pros y contras antes del primer contacto.',
  },
  monitor: {
    action: 'Monitorizar y esperar',
    reasoning: 'Sin acción urgente: sigue observando señales y evolución.',
  },
};

export const prospectingNextActionUiFr: ProspectingNextActionUi = {
  est0: '0 min',
  estMinutes: '{n} min',
  priceDrop: {
    action: 'Envoyer le rapport mis à jour',
    reasoning:
      'Baisse de {pct}% détectée. Le propriétaire est peut-être plus motivé pour négocier.',
  },
  whatsapp3d: {
    action: 'Envoyer un WhatsApp avec vision 3D',
    reasoning:
      'Plusieurs jours depuis l’appel : les visuels 3D peuvent relancer l’intérêt.',
  },
  virtualStagingSend: {
    action: 'Générer du home staging virtuel et envoyer',
    reasoning:
      'Pas de réponse depuis un moment : le staging virtuel peut relancer l’échange.',
  },
  predatorCall: {
    action: 'Lancer l’appel IA (Predator)',
    reasoning:
      'Urgence élevée : le propriétaire est peut-être prêt à avancer vite.',
  },
  premiumReport: {
    action: 'Générer et envoyer le rapport premium',
    reasoning:
      'Environ {pct}% d’opportunité d’arbitrage : un rapport structuré peut convaincre le propriétaire.',
  },
  emotionalFollowUp: {
    action: 'Envoyer un suivi émotionnel',
    reasoning:
      'La négociation stagne : une touche plus humaine peut débloquer la conclusion.',
  },
  aiBriefing: {
    action: 'Analyser avec le briefing IA',
    reasoning:
      'Nouvelle annonce : passez en revue avantages et limites avant le premier contact.',
  },
  monitor: {
    action: 'Surveiller et attendre',
    reasoning: 'Aucune action urgente : continuez à observer les signaux.',
  },
};

export const prospectingNextActionUiDe: ProspectingNextActionUi = {
  est0: '0 Min.',
  estMinutes: '{n} Min.',
  priceDrop: {
    action: 'Aktualisierten Report senden',
    reasoning:
      '{pct}% Preisrückgang erkannt. Der Eigentümer ist vermutlich verhandlungsbereiter.',
  },
  whatsapp3d: {
    action: 'WhatsApp mit 3D-Ansicht senden',
    reasoning:
      'Mehrere Tage seit dem Anruf: 3D-Visualisierungen können das Interesse neu wecken.',
  },
  virtualStagingSend: {
    action: 'Virtuelles Staging erzeugen und senden',
    reasoning:
      'Lange keine Antwort: virtuelles Staging kann das Gespräch wieder anstoßen.',
  },
  predatorCall: {
    action: 'KI-Anruf starten (Predator)',
    reasoning:
      'Hohe Dringlichkeit: der Eigentümer könnte schnell entscheidungsbereit sein.',
  },
  premiumReport: {
    action: 'Premium-Report erstellen und senden',
    reasoning:
      'Etwa {pct}% Arbitrage-Spielraum: ein strukturierter Report kann überzeugen.',
  },
  emotionalFollowUp: {
    action: 'Emotionales Follow-up senden',
    reasoning:
      'Die Verhandlung stockt: ein persönlicherer Ton kann den Abschluss ermöglichen.',
  },
  aiBriefing: {
    action: 'Mit KI-Briefing analysieren',
    reasoning:
      'Neues Inserat: Vor- und Nachteile vor dem ersten Kontakt prüfen.',
  },
  monitor: {
    action: 'Beobachten und warten',
    reasoning: 'Keine dringende Aktion: weiter auf Signale achten.',
  },
};

export const prospectingNextActionUiPt: ProspectingNextActionUi = {
  est0: '0 min',
  estMinutes: '{n} min',
  priceDrop: {
    action: 'Enviar relatório atualizado',
    reasoning:
      'Queda de {pct}% detetada. O proprietário pode estar mais motivado a negociar.',
  },
  whatsapp3d: {
    action: 'Enviar WhatsApp com visão 3D',
    reasoning:
      'Vários dias desde a chamada: imagens 3D podem renovar o interesse.',
  },
  virtualStagingSend: {
    action: 'Gerar virtual staging e enviar',
    reasoning:
      'Sem resposta há algum tempo: o staging virtual pode reativar a conversa.',
  },
  predatorCall: {
    action: 'Iniciar chamada IA (Predator)',
    reasoning:
      'Alta urgência: o proprietário pode estar pronto para avançar depressa.',
  },
  premiumReport: {
    action: 'Gerar e enviar relatório premium',
    reasoning:
      'Cerca de {pct}% de oportunidade de arbitragem: um relatório estruturado pode convencer o proprietário.',
  },
  emotionalFollowUp: {
    action: 'Enviar follow-up emocional',
    reasoning:
      'A negociação está parada: um tom mais humano pode desbloquear o fecho.',
  },
  aiBriefing: {
    action: 'Analisar com briefing IA',
    reasoning:
      'Novo anúncio: reveja prós e contras antes do primeiro contacto.',
  },
  monitor: {
    action: 'Monitorizar e aguardar',
    reasoning: 'Sem ação urgente: continue a observar sinais e evolução.',
  },
};

export const prospectingNextActionUiAr: ProspectingNextActionUi = {
  est0: '0 د',
  estMinutes: '{n} د',
  priceDrop: {
    action: 'إرسال تقرير محدّث',
    reasoning:
      'تم رصد انخفاض بنسبة {pct}%. قد يكون المالك أكثر استعداداً للتفاوض.',
  },
  whatsapp3d: {
    action: 'إرسال واتساب مع عرض ثلاثي الأبعاد',
    reasoning:
      'مرّت عدة أيام على المكالمة: الصور ثلاثية الأبعاد قد تعيد إثارة الاهتمام.',
  },
  virtualStagingSend: {
    action: 'إنشاء تجهيز افتراضي وإرساله',
    reasoning:
      'لا رد منذ فترة: التجهيز الافتراضي قد يعيد فتح الحوار.',
  },
  predatorCall: {
    action: 'بدء مكالمة بالذكاء الاصطناعي (Predator)',
    reasoning:
      'إلحاح مرتفع: قد يكون المالك مستعداً للتحرك بسرعة.',
  },
  premiumReport: {
    action: 'إنشاء تقرير مميز وإرساله',
    reasoning:
      'فرصة مراجحة تقريباً {pct}%: تقرير منظم قد يقنع المالك.',
  },
  emotionalFollowUp: {
    action: 'إرسال متابعة عاطفية',
    reasoning:
      'المفاوضات راكدة: لمسة أكثر إنسانية قد تفتح الطريق للإغلاق.',
  },
  aiBriefing: {
    action: 'تحليل مع موجز الذكاء الاصطناعي',
    reasoning:
      'إعلان جديد: راجع الإيجابيات والسلبيات قبل أول تواصل.',
  },
  monitor: {
    action: 'راقب وانتظر',
    reasoning: 'لا إجراء عاجل: تابع الإشارات والتطور.',
  },
};
