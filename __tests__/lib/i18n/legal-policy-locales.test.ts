import { getTranslation } from '@/lib/i18n/dictionary';
import { privacyPolicyPageUiEn } from '@/lib/i18n/privacy-policy-page-ui';
import { termsPolicyPageUiEn } from '@/lib/i18n/terms-policy-page-ui';
import { refundPolicyPageUiEn } from '@/lib/i18n/refund-policy-page-ui';

describe('legal-policy-locales', () => {
  it('privacy/terms/refund section counts match EN for ES–AR', () => {
    for (const loc of ['es', 'fr', 'de', 'pt', 'ar'] as const) {
      const t = getTranslation(loc);
      expect(t.privacyPolicyPage.sections).toHaveLength(privacyPolicyPageUiEn.sections.length);
      expect(t.termsPolicyPage.sections).toHaveLength(termsPolicyPageUiEn.sections.length);
      expect(t.refundPolicyPage.process).toHaveLength(refundPolicyPageUiEn.process.length);
    }
  });

  it('localized policy titles differ from EN', () => {
    for (const loc of ['es', 'fr', 'de', 'pt', 'ar'] as const) {
      const t = getTranslation(loc);
      expect(t.privacyPolicyPage.title).not.toBe(privacyPolicyPageUiEn.title);
      expect(t.termsPolicyPage.highlight).not.toBe(termsPolicyPageUiEn.highlight);
      expect(t.refundPolicyPage.guaranteeBodyStrong).not.toBe(refundPolicyPageUiEn.guaranteeBodyStrong);
    }
  });

  it('non-IT privacy: last section uses generic authority note, not Italian DPA link', () => {
    for (const loc of ['es', 'fr', 'de', 'pt', 'ar'] as const) {
      const last = getTranslation(loc).privacyPolicyPage.sections.at(-1);
      expect(last?.note).toBeTruthy();
      expect(last?.noteKey).toBeUndefined();
    }
  });
});
