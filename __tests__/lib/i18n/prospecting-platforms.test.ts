import { getProspectingPlatform, PROSPECTING_PLATFORM_KEYS } from '@/lib/i18n/prospecting-platforms';

describe('prospecting-platforms', () => {
  it('lists known keys with iconKey and label', () => {
    expect(PROSPECTING_PLATFORM_KEYS).toContain('idealista');
    const p = getProspectingPlatform('idealista');
    expect(p.label).toBe('Idealista');
    expect(p.iconKey).toBe('home');
  });

  it('falls back for unknown platform', () => {
    const p = getProspectingPlatform('unknown_portal');
    expect(p.label).toBe('unknown_portal');
    expect(p.iconKey).toBe('home');
  });
});
