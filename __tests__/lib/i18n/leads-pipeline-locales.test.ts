import { leadsPipelineLocalesEs } from '@/lib/i18n/leads-pipeline-locales';

describe('leads-pipeline-locales', () => {
  it('ES bundle has placeholders and no emoji in pipeline badge', () => {
    expect(leadsPipelineLocalesEs.leadsPage.deleteWarning).toContain('{name}');
    expect(leadsPipelineLocalesEs.leadPipelinePage.movedTo).toContain('{label}');
    expect(leadsPipelineLocalesEs.leadPipelinePage.heroBadge).toBe('CRM 2.5');
  });
});
