import { onboardingWizardUiEn } from '@/lib/i18n/onboarding-wizard-ui';
import {
  onboardingWizardUiAr,
  onboardingWizardUiDe,
  onboardingWizardUiEs,
  onboardingWizardUiFr,
  onboardingWizardUiPt,
} from '@/lib/i18n/onboarding-wizard-locales';

describe('onboarding-wizard-locales', () => {
  it('each locale has 3 steps with 3 details like EN', () => {
    const bundles = [
      onboardingWizardUiEs,
      onboardingWizardUiFr,
      onboardingWizardUiDe,
      onboardingWizardUiPt,
      onboardingWizardUiAr,
    ];
    expect(onboardingWizardUiEn.steps).toHaveLength(3);
    for (const b of bundles) {
      expect(b.steps).toHaveLength(3);
      expect(b.steps.every((s) => s.details.length === 3)).toBe(true);
      expect(b.readyToStart.length).toBeGreaterThan(2);
      expect(b.next.length).toBeGreaterThan(1);
    }
  });
});
