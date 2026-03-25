import type { AuthUi } from '@/lib/i18n/auth-locales';

type AuthToast = AuthUi['toast'];

/** Supabase GoTrue / auth-js often expose `error.code` (snake_case). */
export function extractAuthErrorCode(error: unknown): string | undefined {
  if (!error || typeof error !== 'object') return undefined;
  const code = (error as { code?: unknown }).code;
  return typeof code === 'string' && code.length > 0 ? code : undefined;
}

function mapErrorCodeToDescription(
  codeRaw: string,
  t: AuthToast,
  context: 'login' | 'signup'
): string | null {
  const code = codeRaw.trim().toLowerCase();
  const generic = context === 'login' ? t.loginFailedGeneric : t.signupFailedGeneric;

  switch (code) {
    case 'email_not_confirmed':
      return t.emailNotConfirmed;
    case 'user_already_registered':
    case 'user_already_exists':
      return t.userAlreadyRegistered;
    case 'weak_password':
      return t.passwordTooShort;
    case 'invalid_email':
    case 'email_address_invalid':
      return t.invalidEmail;
    case 'over_email_send_rate_limit':
    case 'too_many_requests':
      return t.rateLimitMsg;
    case 'invalid_credentials':
      return generic;
    case 'session_expired':
    case 'jwt_expired':
    case 'refresh_token_not_found':
      return t.sessionExpired;
    case 'signup_disabled':
      return t.signupDisabled;
    case 'flow_state_expired':
    case 'bad_oauth_state':
    case 'oauth_error':
    case 'provider_disabled':
      return t.oauthFailed;
    case 'identity_already_exists':
      return t.userAlreadyRegistered;
    default:
      return null;
  }
}

/**
 * Maps common Supabase Auth / browser error strings to localized copy.
 * Unmatched messages are returned as-is (may be English from the API).
 */
export function resolveAuthErrorDescription(
  rawMessage: string,
  t: AuthToast,
  context: 'login' | 'signup',
  errorCode?: string | null
): string {
  const m = rawMessage.trim();
  const lower = m.toLowerCase();
  const generic = context === 'login' ? t.loginFailedGeneric : t.signupFailedGeneric;

  if (errorCode) {
    const fromCode = mapErrorCodeToDescription(errorCode, t, context);
    if (fromCode !== null) return fromCode;
  }

  if (!m) return generic;

  if (
    lower.includes('session expired') ||
    lower.includes('jwt expired') ||
    lower.includes('refresh token') ||
    lower.includes('invalid refresh token')
  ) {
    return t.sessionExpired;
  }

  if (
    lower.includes('sign up') &&
    (lower.includes('disabled') || lower.includes('not allowed') || lower.includes('not enabled'))
  ) {
    return t.signupDisabled;
  }

  if (lower.includes('identity already exists')) {
    return t.userAlreadyRegistered;
  }

  if (
    lower.includes('oauth') ||
    (lower.includes('provider') && lower.includes('error'))
  ) {
    return t.oauthFailed;
  }

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

/** Rate limits from `error.code` (e.g. GoTrue) or English message heuristics. */
export function isAuthRateLimited(rawMessage: string, errorCode?: string | null): boolean {
  const c = errorCode?.trim().toLowerCase();
  if (c === 'over_email_send_rate_limit' || c === 'too_many_requests') return true;
  return isAuthRateLimitedMessage(rawMessage);
}
