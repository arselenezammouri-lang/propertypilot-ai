import { getTranslation } from '@/lib/i18n/dictionary';

describe('auraVR + virtualStaging root copy', () => {
  it('IT auraVR has new keys and whatsapp placeholder', () => {
    const av = getTranslation('it').auraVR;
    expect(av.toast.copySuccessTitle.length).toBeGreaterThan(2);
    expect(av.whatsappVrBody).toContain('{link}');
    expect(av.aria.visitsSentence).toContain('{pct}');
    expect(av.views.drone.title.length).toBeGreaterThan(1);
  });

  it('ES virtualStaging matches component usage', () => {
    const vs = getTranslation('es').virtualStaging;
    expect(vs.generateCta.length).toBeGreaterThan(3);
    expect(vs.premiumRequiredTitle.length).toBeGreaterThan(3);
  });
});
