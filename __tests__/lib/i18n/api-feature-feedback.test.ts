import {
  apiFailureToast,
  networkFailureToast,
  validationToast,
  premiumFeatureToast,
} from '@/lib/i18n/api-feature-feedback';

describe('apiFailureToast', () => {
  it('maps 401 to sign-in copy', () => {
    const r = apiFailureToast('en', 'perfectCopy', { status: 401 }, 'fallback');
    expect(r.title).toContain('Sign-in');
    expect(r.description.toLowerCase()).toContain('session');
  });

  it('maps 429 to rate limit copy', () => {
    const r = apiFailureToast('it', 'leadManager', { status: 429 }, 'x');
    expect(r.title).toContain('Limite');
  });

  it('prefers server message on 500 when present', () => {
    const r = apiFailureToast('en', 'perfectCopy', { status: 500, message: 'Dev — boom' }, 'fallback');
    expect(r.description).toBe('Dev — boom');
  });

  it('uses fallback for 400 without server text', () => {
    const r = apiFailureToast('it', 'leadManager', { status: 400 }, 'Impossibile salvare');
    expect(r.description).toContain('Impossibile salvare');
  });
});

describe('networkFailureToast', () => {
  it('returns feature-scoped connection title', () => {
    const r = networkFailureToast('en', 'perfectCopy');
    expect(r.title).toContain('Perfect Copy');
    expect(r.title).toContain('Connection');
  });
});

describe('validationToast', () => {
  it('wraps validation message with feature label', () => {
    const r = validationToast('it', 'perfectCopy', 'Compila i campi');
    expect(r.title).toContain('Perfect Copy');
    expect(r.description).toBe('Compila i campi');
  });
});

describe('premiumFeatureToast', () => {
  it('uses plan-required title', () => {
    const r = premiumFeatureToast('en', 'leadManager', 'Upgrade to Pro');
    expect(r.title).toContain('Plan required');
  });
});

describe('B1 feature labels', () => {
  it('includes listings library label', () => {
    const r = apiFailureToast('it', 'listingsLibrary', { status: 500 }, 'fallback');
    expect(r.title).toContain('Libreria annunci');
  });

  it('includes title generator label', () => {
    const r = apiFailureToast('en', 'titleGenerator', { status: 429 }, 'x');
    expect(r.title).toContain('A/B titles');
  });

  it('includes pdf sheets label', () => {
    const r = apiFailureToast('it', 'pdfSheets', { status: 500 }, 'x');
    expect(r.title).toContain('Schede PDF');
  });

  it('includes lead scoring label', () => {
    const r = apiFailureToast('en', 'leadScoring', { status: 429 }, 'x');
    expect(r.title).toContain('Lead scoring');
  });

  it('includes workflow automations label', () => {
    const r = apiFailureToast('it', 'workflowAutomations', { status: 403 }, 'x');
    expect(r.title).toContain('Workflow automazioni');
  });

  it('includes link analysis label', () => {
    const r = apiFailureToast('en', 'linkAnalysis', { status: 500 }, 'x');
    expect(r.title).toContain('Link analysis');
  });

  it('includes prospecting and map labels', () => {
    expect(apiFailureToast('it', 'prospectingCommand', { status: 403 }, 'x').title).toContain(
      'Prospecting'
    );
    expect(apiFailureToast('en', 'predatorMap', { status: 429 }, 'x').title).toContain(
      'Territory map'
    );
  });

  it('includes billing label', () => {
    expect(apiFailureToast('en', 'billingSubscription', { status: 500 }, 'x').title).toContain(
      'Subscription'
    );
  });

  it('includes B5 communication labels', () => {
    expect(apiFailureToast('it', 'agencyAssistantChat', { status: 429 }, 'x').title).toContain(
      'Assistente'
    );
    expect(apiFailureToast('en', 'crmLeadCapture', { status: 403 }, 'x').title).toContain('Lead capture');
  });
});
