import {
  brandingNotificationsPackagesLocalesEs,
  brandingNotificationsPackagesLocalesAr,
} from '@/lib/i18n/branding-notifications-packages-locales';

describe('branding-notifications-packages-locales', () => {
  it('ES bundles have no emoji in agency badge and notification preview header', () => {
    const { agencyBrandingPage, notificationsSettingsPage, packagesPage } =
      brandingNotificationsPackagesLocalesEs;
    expect(agencyBrandingPage.badgeWhiteLabel).not.toMatch(/[\u{1F300}-\u{1F9FF}]/u);
    expect(notificationsSettingsPage.previewHeader).not.toMatch(/🔥/);
    expect(packagesPage.boostFeatures).toHaveLength(3);
    expect(packagesPage.purchasedOn.length).toBeGreaterThan(5);
  });

  it('AR packages has status keys', () => {
    const { packagesPage } = brandingNotificationsPackagesLocalesAr;
    expect(packagesPage.statusPending.length).toBeGreaterThan(2);
    expect(packagesPage.tabPurchases.length).toBeGreaterThan(3);
  });
});
