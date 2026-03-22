import {
  getCommandPaletteGuideLinks,
  getCommandPaletteQuickLinks,
} from '@/lib/dashboard/command-palette-extras';
import { commandPaletteExtrasEn, commandPaletteExtrasIt } from '@/lib/i18n/dashboard-nav-ui';
import { getTranslation } from '@/lib/i18n/dictionary';

describe('command-palette-extras', () => {
  it('returns quick links with internal paths from IT strings', () => {
    const it = getCommandPaletteQuickLinks(commandPaletteExtrasIt);
    expect(it.length).toBeGreaterThanOrEqual(7);
    expect(it.every((x) => x.kind === 'internal')).toBe(true);
    expect(it.some((x) => x.path === '/dashboard/perfect-copy')).toBe(true);
    expect(it[0].label.length).toBeGreaterThan(2);
  });

  it('returns guide links pointing at /docs from EN strings', () => {
    const en = getCommandPaletteGuideLinks(commandPaletteExtrasEn);
    expect(en.length).toBeGreaterThanOrEqual(8);
    expect(en.every((x) => x.kind === 'external')).toBe(true);
    expect(en.every((x) => x.path.startsWith('/docs'))).toBe(true);
  });

  it('ES locale inherits commandPaletteExtras from EN merge', () => {
    const es = getTranslation('es');
    const quick = getCommandPaletteQuickLinks(es.commandPaletteExtras);
    expect(quick.some((x) => x.path === '/dashboard/billing')).toBe(true);
    expect(es.dashboardNav.jtbd.content.heading).toBe(
      getTranslation('en').dashboardNav.jtbd.content.heading
    );
  });
});
