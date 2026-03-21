import {
  getCommandPaletteGuideLinks,
  getCommandPaletteQuickLinks,
} from '@/lib/dashboard/command-palette-extras';

describe('command-palette-extras', () => {
  it('returns quick links with internal paths', () => {
    const it = getCommandPaletteQuickLinks(true);
    expect(it.length).toBeGreaterThanOrEqual(7);
    expect(it.every((x) => x.kind === 'internal')).toBe(true);
    expect(it.some((x) => x.path === '/dashboard/perfect-copy')).toBe(true);
  });

  it('returns guide links pointing at /docs', () => {
    const en = getCommandPaletteGuideLinks(false);
    expect(en.length).toBeGreaterThanOrEqual(8);
    expect(en.every((x) => x.kind === 'external')).toBe(true);
    expect(en.every((x) => x.path.startsWith('/docs'))).toBe(true);
  });
});
