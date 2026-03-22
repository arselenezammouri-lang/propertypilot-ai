import { videoScriptsPageUiEs } from '@/lib/i18n/video-followup-locales-es';
import { followupEmailsPageUiEs } from '@/lib/i18n/video-followup-locales-es';
import { videoScriptsPageUiAr } from '@/lib/i18n/video-followup-locales-ar';

describe('video + followup locale bundles', () => {
  it('ES video: tab ids and copy export placeholder', () => {
    expect(videoScriptsPageUiEs.scriptTabs.map((x) => x.id)).toEqual([
      'script15s',
      'script30s',
      'script60s',
      'scriptLuxury',
      'hooksVirali',
    ]);
    expect(videoScriptsPageUiEs.copyExportTitle).toContain('{duration}');
    expect(videoScriptsPageUiEs.copySceneBlock).toContain('{timestamp}');
  });

  it('ES followup: email tab ids match API keys', () => {
    expect(followupEmailsPageUiEs.emailTypes.map((e) => e.id)).toEqual([
      'immediateResponse',
      'followUp24h',
      'followUp72h',
      'appointmentScheduling',
      'postVisit',
      'luxuryLeadFollowUp',
    ]);
    expect(followupEmailsPageUiEs.toneOptions.map((o) => o.value)).toEqual([
      'professionale',
      'amichevole',
      'luxury',
    ]);
  });

  it('AR video: no emoji in empty subtitle', () => {
    expect(videoScriptsPageUiAr.emptySubtitle).not.toMatch(/[\u{1F300}-\u{1FAFF}]/u);
  });
});
