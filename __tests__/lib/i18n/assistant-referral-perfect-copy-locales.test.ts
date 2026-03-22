import {
  assistantReferralPerfectCopyLocalesEs,
  assistantReferralPerfectCopyLocalesAr,
} from '@/lib/i18n/assistant-referral-perfect-copy-locales';

describe('assistant-referral-perfect-copy-locales', () => {
  it('ES perfect copy uses iconKey and localized pack labels', () => {
    const { perfectCopyPage, agencyAssistantPage, referralPage } =
      assistantReferralPerfectCopyLocalesEs;
    expect(perfectCopyPage.tipoTransazione[0].iconKey).toBe('tag');
    expect(perfectCopyPage.targetCliente[0].iconKey).toBe('users');
    expect(perfectCopyPage.heroBadge).not.toMatch(/[\u{1F300}-\u{1F9FF}]/u);
    expect(perfectCopyPage.copyPackTitle).toBe('TÍTULO');
    expect(agencyAssistantPage.quickSuggestions).toHaveLength(6);
    expect(referralPage.whatsappMessage).toContain('PropertyPilot');
  });

  it('AR bundle has RTL-friendly strings', () => {
    const { agencyAssistantPage } = assistantReferralPerfectCopyLocalesAr;
    expect(agencyAssistantPage.introTitle.length).toBeGreaterThan(5);
  });
});
