import { commandPaletteExtrasEn, dashboardNavUiEn } from '@/lib/i18n/dashboard-nav-ui';
import {
  commandPaletteExtrasAr,
  commandPaletteExtrasDe,
  commandPaletteExtrasEs,
  commandPaletteExtrasFr,
  commandPaletteExtrasPt,
  dashboardNavUiAr,
  dashboardNavUiDe,
  dashboardNavUiEs,
  dashboardNavUiFr,
  dashboardNavUiPt,
} from '@/lib/i18n/dashboard-nav-command-palette-locales';

const navBundles = [
  dashboardNavUiEs,
  dashboardNavUiFr,
  dashboardNavUiDe,
  dashboardNavUiPt,
  dashboardNavUiAr,
] as const;

const extrasBundles = [
  commandPaletteExtrasEs,
  commandPaletteExtrasFr,
  commandPaletteExtrasDe,
  commandPaletteExtrasPt,
  commandPaletteExtrasAr,
] as const;

describe('dashboard-nav-command-palette-locales', () => {
  it('jtbd groups and item keys match EN', () => {
    const enJtbd = dashboardNavUiEn.jtbd;
    const enGroupKeys = Object.keys(enJtbd).sort() as (keyof typeof enJtbd)[];
    for (const nav of navBundles) {
      expect(Object.keys(nav.jtbd).sort()).toEqual(enGroupKeys);
      for (const g of enGroupKeys) {
        expect(nav.jtbd[g].heading.length).toBeGreaterThan(2);
        expect(Object.keys(nav.jtbd[g].items).sort()).toEqual(Object.keys(enJtbd[g].items).sort());
      }
    }
  });

  it('command palette extras quick + guide ids match EN', () => {
    const enQ = Object.keys(commandPaletteExtrasEn.quick).sort();
    const enG = Object.keys(commandPaletteExtrasEn.guides).sort();
    for (const ex of extrasBundles) {
      expect(Object.keys(ex.quick).sort()).toEqual(enQ);
      expect(Object.keys(ex.guides).sort()).toEqual(enG);
    }
  });
});
