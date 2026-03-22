import {
  workflowAutomationsLocalesEs,
  workflowAutomationsLocalesAr,
} from '@/lib/i18n/workflow-automations-locales';

describe('workflow-automations-locales', () => {
  it('ES bundle has placeholders and stable email type values', () => {
    const w = workflowAutomationsLocalesEs.workflowAutomationsPage;
    expect(w.activeCount).toContain('{count}');
    expect(w.automationTypes['weekly-content'].description.length).toBeGreaterThan(10);
    expect(w.emailTypes.map((x) => x.value)).toEqual([
      'immediate',
      '24h',
      '72h',
      'appointment',
      'post-visit',
      'luxury',
    ]);
  });

  it('AR bundle keeps repeat interval keys', () => {
    const w = workflowAutomationsLocalesAr.workflowAutomationsPage;
    expect(w.paywallDescription.length).toBeGreaterThan(20);
    expect(w.repeatIntervals.map((x) => x.value)).toEqual(['once', 'daily', 'weekly']);
  });
});
