import type { SupportedLocale } from '@/lib/i18n/dictionary';

type Slice = {
  greeting: string;
  /** use replace('{yield}', pct) */
  yieldLine: string;
  noYieldLine: string;
  closing: string;
};

const SLICES: Record<SupportedLocale, Slice> = {
  it: {
    greeting: 'Ciao! Ho visto il tuo immobile a {location}. ',
    yieldLine: 'Il rendimento stimato del {yield}% è molto interessante. ',
    noYieldLine: "Sembra un'opportunità interessante. ",
    closing:
      'Saresti disponibile per una visita? Sono un agente qualificato e ho clienti interessati.',
  },
  en: {
    greeting: 'Hi! I saw your property in {location}. ',
    yieldLine: 'The estimated {yield}% yield looks very strong. ',
    noYieldLine: 'It looks like an interesting opportunity. ',
    closing:
      "Would you be available for a viewing? I'm a qualified agent with interested clients.",
  },
  es: {
    greeting: 'Hola. He visto tu propiedad en {location}. ',
    yieldLine: 'El rendimiento estimado del {yield}% es muy interesante. ',
    noYieldLine: 'Parece una oportunidad interesante. ',
    closing:
      '¿Estarías disponible para una visita? Soy un agente cualificado con clientes interesados.',
  },
  fr: {
    greeting: "Bonjour. J'ai vu votre bien à {location}. ",
    yieldLine: 'Le rendement estimé de {yield}% est très intéressant. ',
    noYieldLine: "Cela semble être une opportunité intéressante. ",
    closing:
      'Seriez-vous disponible pour une visite ? Je suis un agent qualifié avec des clients intéressés.',
  },
  de: {
    greeting: 'Guten Tag. Ich habe Ihre Immobilie in {location} gesehen. ',
    yieldLine: 'Die geschätzte Rendite von {yield}% ist sehr interessant. ',
    noYieldLine: 'Es scheint eine interessante Gelegenheit zu sein. ',
    closing:
      'Wären Sie für eine Besichtigung verfügbar? Ich bin ein qualifizierter Makler mit interessierten Kunden.',
  },
  pt: {
    greeting: 'Olá. Vi seu imóvel em {location}. ',
    yieldLine: 'O rendimento estimado de {yield}% é muito interessante. ',
    noYieldLine: 'Parece uma oportunidade interessante. ',
    closing:
      'Estaria disponível para uma visita? Sou um agente qualificado com clientes interessados.',
  },
  ar: {
    greeting: 'السلام عليكم. لاحظت عقارك في {location}. ',
    yieldLine: 'العائد التقديري {yield}% مثير للاهتمام. ',
    noYieldLine: 'تبدو فرصة جيدة. ',
    closing: 'هل يمكننا ترتيب زيارة؟ أنا وسيط مؤهل ولدي عملاء مهتمون.',
  },
};

/**
 * Messaggio WhatsApp per il proprietario: lingua da `ownerLocale` (es. dalla location),
 * non dalla lingua UI del dashboard.
 */
export function buildProspectingWhatsappMessage(
  ownerLocale: SupportedLocale,
  location: string,
  yieldPercent: string | null
): string {
  const slice = SLICES[ownerLocale] ?? SLICES.en;
  let body =
    slice.greeting.replace('{location}', location) +
    (yieldPercent
      ? slice.yieldLine.replace('{yield}', yieldPercent)
      : slice.noYieldLine) +
    slice.closing;
  body = body.replace(/\s+/g, ' ').trim();
  return body;
}
