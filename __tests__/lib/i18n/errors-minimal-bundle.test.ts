import { locales } from '@/lib/i18n/config';
import { ERRORS_MINIMAL } from '@/lib/i18n/errors-minimal-bundle';

describe('errors-minimal-bundle', () => {
  it('has all locales and same keys as EN', () => {
    const enKeys = Object.keys(ERRORS_MINIMAL.en).sort();
    for (const loc of locales) {
      expect(Object.keys(ERRORS_MINIMAL[loc]).sort()).toEqual(enKeys);
      expect(ERRORS_MINIMAL[loc].somethingWentWrong.length).toBeGreaterThan(3);
    }
  });
});
