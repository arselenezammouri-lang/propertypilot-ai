import { getDashboardNavGroups } from '@/lib/dashboard/nav-config';
import { dashboardNavUiEn, dashboardNavUiIt } from '@/lib/i18n/dashboard-nav-ui';

describe('nav-config', () => {
  it('builds groups with localized headings', () => {
    const itGroups = getDashboardNavGroups(dashboardNavUiIt);
    const enGroups = getDashboardNavGroups(dashboardNavUiEn);
    expect(itGroups[0].heading).toContain('Contenuti');
    expect(enGroups[0].heading).toContain('Listings');
    const listingsIt = itGroups[0].items.find((i) => i.id === 'listings');
    const listingsEn = enGroups[0].items.find((i) => i.id === 'listings');
    expect(listingsIt?.label).toMatch(/Annuncio|Genera/i);
    expect(listingsEn?.label).toMatch(/Generate|Listing/i);
  });

  it('preserves hrefs and badges', () => {
    const g = getDashboardNavGroups(dashboardNavUiEn);
    const pdf = g[0].items.find((i) => i.id === 'pdf');
    expect(pdf?.href).toBe('/dashboard/pdf');
    expect(pdf?.badge).toBe('STARTER+');
  });
});
