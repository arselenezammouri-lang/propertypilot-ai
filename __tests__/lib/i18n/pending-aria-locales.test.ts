import { getTranslation } from '@/lib/i18n/dictionary';

describe('pendingCheckoutBanner + ariaLimitModal locales', () => {
  it('ES/FR/DE/PT/AR differ from EN for key strings', () => {
    const enP = getTranslation('en').pendingCheckoutBanner;
    const esP = getTranslation('es').pendingCheckoutBanner;
    expect(esP.goToPayment).not.toBe(enP.goToPayment);
    expect(esP.activateDesc).toContain('{name}');

    const enA = getTranslation('en').ariaLimitModal;
    const frA = getTranslation('fr').ariaLimitModal;
    expect(frA.title).not.toBe(enA.title);
    expect(frA.desc).toContain('{used}');
    expect(frA.upgrades.free.features.length).toBe(3);

    expect(getTranslation('de').pendingCheckoutBanner.syncing.toLowerCase()).toMatch(/sync|synchron/);
    expect(getTranslation('pt').ariaLimitModal.upgradeTo).toContain('{name}');
    expect(getTranslation('ar').ariaLimitModal.later.length).toBeGreaterThan(2);
  });
});
