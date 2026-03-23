import { errorBoundaryModuleUiEn } from '@/lib/i18n/error-boundary-ui';
import { welcomeTourUiEn } from '@/lib/i18n/welcome-tour-ui';
import {
  errorBoundaryModuleUiAr,
  errorBoundaryModuleUiDe,
  errorBoundaryModuleUiEs,
  errorBoundaryModuleUiFr,
  errorBoundaryModuleUiPt,
  welcomeTourUiAr,
  welcomeTourUiDe,
  welcomeTourUiEs,
  welcomeTourUiFr,
  welcomeTourUiPt,
} from '@/lib/i18n/error-boundary-welcome-locales';

describe('error-boundary-welcome-locales', () => {
  it('errorBoundary keys match EN shape', () => {
    const bundles = [
      errorBoundaryModuleUiEs,
      errorBoundaryModuleUiFr,
      errorBoundaryModuleUiDe,
      errorBoundaryModuleUiPt,
      errorBoundaryModuleUiAr,
    ];
    const en = errorBoundaryModuleUiEn;
    for (const b of bundles) {
      expect(Object.keys(b.boundary).sort()).toEqual(Object.keys(en.boundary).sort());
      expect(Object.keys(b.apiHandler).sort()).toEqual(Object.keys(en.apiHandler).sort());
    }
  });

  it('welcomeTour has {n} in dealLabel', () => {
    for (const wt of [
      welcomeTourUiEs,
      welcomeTourUiFr,
      welcomeTourUiDe,
      welcomeTourUiPt,
      welcomeTourUiAr,
    ]) {
      expect(wt.dealLabel).toContain('{n}');
      expect(wt.dealsFoundLead.length).toBeGreaterThan(0);
      expect(welcomeTourUiEn.dealLabel).toContain('{n}');
    }
  });
});
