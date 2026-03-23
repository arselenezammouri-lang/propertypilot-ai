import type { PrivacyPolicyPageUi } from '@/lib/i18n/privacy-policy-page-ui';

/** Non-IT locales: no Italian DPA block in privacy (section 10 uses generic note). */
export function privacyFooterNonIt(exerciseRightsPrefix: string): Pick<
  PrivacyPolicyPageUi,
  'exerciseRightsPrefix' | 'exerciseRightsSuffix' | 'dpaItalyBefore' | 'dpaItalyAfter' | 'dpaLinkHref' | 'dpaLinkLabel'
> {
  return {
    exerciseRightsPrefix,
    exerciseRightsSuffix: '',
    dpaItalyBefore: '',
    dpaItalyAfter: '',
    dpaLinkHref: 'https://www.garanteprivacy.it',
    dpaLinkLabel: '',
  };
}
