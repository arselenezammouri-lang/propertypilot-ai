import { isFounderEmail } from '@/lib/utils/founder-access';

export type UiSubscriptionPlan = 'free' | 'starter' | 'pro' | 'agency';

/**
 * Piano effettivo per UI server/client: allineato a GET /api/user/subscription.
 * L'account founder è trattato come AGENCY indipendentemente dalla riga DB
 * (preview locale, webhook in ritardo, ecc.).
 */
export function resolveUiSubscriptionPlan(
  email: string | null | undefined,
  rawFromDb: string | null | undefined
): UiSubscriptionPlan {
  if (isFounderEmail(email)) {
    return 'agency';
  }
  const v = (rawFromDb ?? 'free').toString().trim().toLowerCase();
  if (v === 'starter' || v === 'pro' || v === 'agency') {
    return v;
  }
  return 'free';
}
