import { getTranslation } from '@/lib/i18n/dictionary';
import { isAuthRateLimitedMessage, resolveAuthErrorDescription } from '@/lib/i18n/auth-error-messages';

describe('auth-error-messages', () => {
  const itToast = getTranslation('it').auth.toast;

  it('maps invalid credentials to localized login generic', () => {
    expect(
      resolveAuthErrorDescription('Invalid login credentials', itToast, 'login')
    ).toBe(itToast.loginFailedGeneric);
  });

  it('maps email not confirmed', () => {
    expect(resolveAuthErrorDescription('Email not confirmed', itToast, 'login')).toBe(
      itToast.emailNotConfirmed
    );
  });

  it('maps already registered on signup', () => {
    expect(
      resolveAuthErrorDescription('User already registered', itToast, 'signup')
    ).toBe(itToast.userAlreadyRegistered);
  });

  it('returns empty as generic', () => {
    expect(resolveAuthErrorDescription('', itToast, 'signup')).toBe(itToast.signupFailedGeneric);
  });

  it('detects rate limit', () => {
    expect(isAuthRateLimitedMessage('Email rate limit exceeded')).toBe(true);
    expect(isAuthRateLimitedMessage('Invalid login credentials')).toBe(false);
  });

  it('IT differs from EN for resolved credential message', () => {
    const enToast = getTranslation('en').auth.toast;
    expect(
      resolveAuthErrorDescription('Invalid login credentials', itToast, 'login')
    ).not.toBe(resolveAuthErrorDescription('Invalid login credentials', enToast, 'login'));
  });
});
