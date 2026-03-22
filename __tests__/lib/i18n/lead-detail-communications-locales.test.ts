import {
  leadDetailCommLocalesEs,
  leadDetailCommLocalesAr,
} from '@/lib/i18n/lead-detail-communications-locales';

describe('lead-detail-communications-locales', () => {
  it('ES bundle keeps placeholders and CRM subtitles', () => {
    const { leadDetailPage, communicationsHub } = leadDetailCommLocalesEs;
    expect(leadDetailPage.analysisDone).toContain('{ms}');
    expect(leadDetailPage.moreAiActions).toContain('{count}');
    expect(communicationsHub.newMessage).toContain('{channel}');
    expect(communicationsHub.historyToggle).toContain('{count}');
    expect(leadDetailPage.headerSubtitle).toMatch(/CRM 2\.5/i);
  });

  it('AR bundle has RTL-friendly copy and placeholders', () => {
    const { leadDetailPage, communicationsHub } = leadDetailCommLocalesAr;
    expect(leadDetailPage.backToLeads.length).toBeGreaterThan(3);
    expect(communicationsHub.hubTitle.length).toBeGreaterThan(2);
    expect(communicationsHub.smsTooLongDesc).toContain('{n}');
  });
});
