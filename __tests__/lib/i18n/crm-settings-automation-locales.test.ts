import {
  crmSettingsAutomationLocalesEs,
  crmSettingsAutomationLocalesAr,
} from '@/lib/i18n/crm-settings-automation-locales';

describe('crm-settings-automation-locales', () => {
  it('ES bundles include placeholders and iconKey triggers', () => {
    const { crmApiKeysPage, crmAutomationRulesPage } = crmSettingsAutomationLocalesEs;
    expect(crmApiKeysPage.deleteDialogBody).toContain('{name}');
    expect(crmAutomationRulesPage.executions).toContain('{count}');
    expect(crmAutomationRulesPage.triggers.sms_sent.iconKey).toBe('smartphone');
  });

  it('AR API keys page has embed keys', () => {
    const { crmApiKeysPage } = crmSettingsAutomationLocalesAr;
    expect(crmApiKeysPage.embedLabelNome.length).toBeGreaterThan(2);
    expect(crmApiKeysPage.howToUseSteps).toHaveLength(4);
  });
});
