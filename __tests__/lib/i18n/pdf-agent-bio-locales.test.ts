import { pdfSheetPageUiEs, agentBioPageUiEs } from '@/lib/i18n/pdf-agent-bio-locales-es';
import { pdfSheetPageUiAr, agentBioPageUiAr } from '@/lib/i18n/pdf-agent-bio-locales-ar';

describe('pdf + agent-bio locale bundles', () => {
  it('ES pdf: branding placeholder and zod messages', () => {
    expect(pdfSheetPageUiEs.brandingUseAgencyWithName).toContain('{name}');
    expect(pdfSheetPageUiEs.zodTitleRequired.length).toBeGreaterThan(3);
    expect(pdfSheetPageUiEs.imageAltTemplate).toContain('{n}');
  });

  it('ES agent bio: tone values match API', () => {
    expect(agentBioPageUiEs.toneOptions.map((o) => o.value)).toEqual([
      'professionale',
      'amichevole',
      'luxury',
    ]);
    expect(agentBioPageUiEs.marketOptions.map((o) => o.value)).toEqual([
      'italia',
      'usa',
      'internazionale',
    ]);
  });

  it('AR pdf: RTL-friendly copy without emoji in tips', () => {
    expect(pdfSheetPageUiAr.proTipsTitle.length).toBeGreaterThan(2);
    expect(pdfSheetPageUiAr.chooseTemplateHeading).not.toMatch(/[\u{1F300}-\u{1FAFF}]/u);
  });

  it('AR agent bio: variant keys complete', () => {
    expect(Object.keys(agentBioPageUiAr.variantDisplayName).sort()).toEqual([
      'emotiva',
      'luxury',
      'professionale',
      'social',
      'website',
    ]);
  });
});
