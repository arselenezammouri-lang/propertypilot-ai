import { buildProspectingWhatsappMessage } from '@/lib/i18n/prospecting-whatsapp-outreach';

describe('prospecting-whatsapp-outreach', () => {
  it('includes location and yield for IT', () => {
    const m = buildProspectingWhatsappMessage('it', 'Milano', '5.2');
    expect(m).toContain('Milano');
    expect(m).toContain('5.2');
    expect(m).not.toMatch(/[\u{1F300}-\u{1F9FF}]/u);
  });

  it('works without yield', () => {
    const m = buildProspectingWhatsappMessage('en', 'Miami', null);
    expect(m).toContain('Miami');
    expect(m.toLowerCase()).toMatch(/opportunity|interesting/);
  });
});
