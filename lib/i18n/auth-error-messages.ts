import type { AuthUi } from '@/lib/i18n/auth-locales';

type AuthToast = AuthUi['toast'];

/**
 * Maps common Supabase Auth / browser error strings to localized copy.
 * Unmatched messages are returned as-is (may be English from the API).
 */
export function resolveAuthErrorDescription(
  rawMessage: string,
  t: AuthToast,
  context: 'login' | 'signup'
): string {
  const m = rawMessage.trim();
  const lower = m.toLowerCase();
  const generic = context === 'login' ? t.loginFailedGeneric : t.signupFailedGeneric;

  if (!m) return generic;

  if (
    lower.includes('rate limit') ||
    lower.includes('too many requests') ||
    lower.includes('email rate limit')
  ) {
    return t.rateLimitMsg;
  }

  if (lower.includes('email not confirmed') || lower.includes('email_not_confirmed')) {
    return t.emailNotConfirmed;
  }

  if (
    lower.includes('already registered') ||
    lower.includes('user already registered') ||
    lower.includes('already been registered') ||
    lower.includes('user already exists')
  ) {
    return t.userAlreadyRegistered;
  }

  if (
    lower.includes('password') &&
    (lower.includes('at least') ||
      lower.includes('least 6') ||
      lower.includes('least 8') ||
      lower.includes('too short') ||
      lower.includes('weak') ||
      lower.includes('should be longer'))
  ) {
    return t.passwordTooShort;
  }

  if (
    lower.includes('invalid email') ||
    lower.includes('unable to validate email') ||
    lower.includes('email address is invalid') ||
    lower.includes('invalid_email')
  ) {
    return t.invalidEmail;
  }

  if (
    lower.includes('failed to fetch') ||
    lower.includes('networkerror') ||
    lower.includes('network error') ||
    lower.includes('load failed') ||
    lower === 'fetch failed'
  ) {
    return t.networkError;
  }

  if (
    context === 'login' &&
    (lower.includes('invalid login credentials') ||
      lower.includes('invalid credentials') ||
      lower === 'invalid email or password')
  ) {
    return t.loginFailedGeneric;
  }

  return m;
}

export function isAuthRateLimitedMessage(rawMessage: string): boolean {
  const lower = rawMessage.trim().toLowerCase();
  return (
    lower.includes('rate limit') ||
    lower.includes('too many requests') ||
    lower.includes('email rate limit')
  );
}
