import { isFounderEmail } from '@/lib/utils/founder-access';

export type UiSubscriptionPlan = 'free' | 'starter' | 'pro' | 'agency';

export type ResolveUiSubscriptionPlanOptions = {
  /** Solo con Host localhost: founder vede AGENCY senza toccare il DB. */
  localDevHost?: boolean;
};

/**
 * Piano effettivo per UI: su host locale, il founder coincide con GET /api/user/subscription
 * (override preview). In production `localDevHost` è false → solo valore DB.
 */
export function resolveUiSubscriptionPlan(
  email: string | null | undefined,
  rawFromDb: string | null | undefined,
  options?: ResolveUiSubscriptionPlanOptions
): UiSubscriptionPlan {
  if (options?.localDevHost === true && isFounderEmail(email)) {
    return 'agency';
  }
  const v = (rawFromDb ?? 'free').toString().trim().toLowerCase();
  if (v === 'starter' || v === 'pro' || v === 'agency') {
    return v;
  }
  return 'free';
}
