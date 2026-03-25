import { planFeaturesUiEn } from '@/lib/i18n/plan-features-ui';
import {
  planFeaturesUiAr,
  planFeaturesUiDe,
  planFeaturesUiEs,
  planFeaturesUiFr,
  planFeaturesUiPt,
} from '@/lib/i18n/plan-features-locales';

const bundles = [
  ['es', planFeaturesUiEs],
  ['fr', planFeaturesUiFr],
  ['de', planFeaturesUiDe],
  ['pt', planFeaturesUiPt],
  ['ar', planFeaturesUiAr],
] as const;

describe('plan-features-locales', () => {
  it('each locale has same item keys as EN', () => {
    const enKeys = Object.keys(planFeaturesUiEn.items).sort();
    for (const [, bundle] of bundles) {
      expect(Object.keys(bundle.items).sort()).toEqual(enKeys);
    }
  });

  it('chrome has required planNames', () => {
    for (const [, bundle] of bundles) {
      expect(bundle.chrome.planNames.free).toBeTruthy();
      expect(bundle.chrome.planNames.agency).toBeTruthy();
      expect(bundle.chrome.open.length).toBeGreaterThan(1);
    }
  });
});
