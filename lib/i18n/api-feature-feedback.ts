/**
 * Copy for API/network failures shown as toasts — feature-scoped title + next step (Fase A4).
 * All dashboard locales via `api-feedback-chrome.ts` + localized feature short names.
 */

import type { Locale } from '@/lib/i18n/config';
import type { ApiFeatureId, ApiFailureInput } from '@/lib/i18n/api-feedback-types';
import { featureLabelForLocale, getApiFeedbackChrome } from '@/lib/i18n/api-feedback-chrome';

export type { ApiFeatureId, ApiFailureInput } from '@/lib/i18n/api-feedback-types';

/** Pass `useLocale().locale` (or any SupportedLocale string). */
export type FeedbackLocale = Locale;

function label(feature: ApiFeatureId, locale: string): string {
  return featureLabelForLocale(feature, locale);
}

/**
 * Toast content when `fetchApi` returns success: false or thrown HTTP-like error.
 */
export function apiFailureToast(
  locale: FeedbackLocale,
  feature: ApiFeatureId,
  failure: ApiFailureInput,
  fallbackDescription: string
): { title: string; description: string } {
  const C = getApiFeedbackChrome(locale);
  const L = label(feature, locale);
  const st = failure.status;
  const serverText = [failure.message, failure.error].find(
    (s) => typeof s === 'string' && s.trim().length > 0
  );

  if (st === 401) {
    return {
      title: C.title401(L),
      description: C.desc401,
    };
  }

  if (st === 429) {
    return {
      title: C.title429(L),
      description: C.desc429,
    };
  }

  if (st === 404) {
    return {
      title: C.title404(L),
      description: serverText || C.desc404,
    };
  }

  if (st === 503 || st === 502) {
    return {
      title: C.title502(L),
      description: C.desc502,
    };
  }

  if (st !== undefined && st >= 500) {
    return {
      title: C.title5xx(L),
      description: serverText || C.desc5xx,
    };
  }

  const desc = (serverText || fallbackDescription + C.persistSuffix).trim();

  return {
    title: C.titleGeneric(L),
    description: desc,
  };
}

/**
 * Toast when fetch fails before a response (offline, DNS, CORS in dev, etc.).
 */
export function networkFailureToast(
  locale: FeedbackLocale,
  feature: ApiFeatureId
): { title: string; description: string } {
  const C = getApiFeedbackChrome(locale);
  const L = label(feature, locale);
  return {
    title: C.titleNetwork(L),
    description: C.descNetwork,
  };
}

/**
 * Validation / missing fields — same feature chrome as API errors.
 */
export function validationToast(
  locale: FeedbackLocale,
  feature: ApiFeatureId,
  description: string
): { title: string; description: string } {
  const C = getApiFeedbackChrome(locale);
  const L = label(feature, locale);
  return {
    title: C.titleValidation(L),
    description,
  };
}

/** PRO / AGENCY paywall — same chrome as other feature toasts */
export function premiumFeatureToast(
  locale: FeedbackLocale,
  feature: ApiFeatureId,
  description: string
): { title: string; description: string } {
  const C = getApiFeedbackChrome(locale);
  const L = label(feature, locale);
  return {
    title: C.titlePremium(L),
    description,
  };
}

export function clipboardFailureToast(
  locale: FeedbackLocale,
  feature: ApiFeatureId,
  description: string
): { title: string; description: string } {
  const C = getApiFeedbackChrome(locale);
  const L = label(feature, locale);
  return {
    title: C.titleClipboard(L),
    description,
  };
}
