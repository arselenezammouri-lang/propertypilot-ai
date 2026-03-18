type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

function isLocalhostRuntime() {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname;
  return host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0';
}

function buildMockListing() {
  return {
    id: 'mock-listing-001',
    title: 'Appartamento demo trilocale con terrazzo',
    price: '€ 289.000',
    location: 'Milano',
    surface: '95 m²',
    rooms: '3',
    features: ['Terrazzo', 'Ascensore', 'Aria condizionata', 'Cantina'],
    description_raw:
      'Dati demo locali generati automaticamente per mantenere la UI operativa durante la modalità mock.',
    images: [],
    propertyType: 'Appartamento',
    isFallback: true,
    fallbackReason: 'local_mock_service',
    sourcePortal: 'localhost',
  };
}

function getMockPayload(pathname: string, method: HttpMethod): unknown | null {
  if (pathname === '/api/user/usage') {
    return {
      plan: 'free',
      currentUsage: 0,
      limit: 5,
      hasReachedLimit: false,
      isNearLimit: false,
      remainingGenerations: 5,
      percentageUsed: 0,
      fallback: true,
    };
  }

  if (pathname === '/api/user/subscription') {
    return {
      status: 'free',
      stripe_subscription_id: null,
      cancel_at_period_end: false,
      stripe_verified: false,
      fallback: true,
    };
  }

  if (pathname.startsWith('/api/leads')) {
    if (method === 'GET') {
      return { data: [] };
    }
    return { data: { id: 'mock-lead-001', nome: 'Lead Demo', stato: 'new' }, fallback: true };
  }

  if (pathname === '/api/listings' && method === 'GET') {
    return { data: [] };
  }

  if (pathname === '/api/listings/save' && method === 'POST') {
    return { id: 'mock-saved-listing-001', success: true };
  }

  if (pathname.startsWith('/api/prospecting/listings')) {
    return [];
  }

  if (pathname.startsWith('/api/prospecting/filters')) {
    return [];
  }

  if (pathname.startsWith('/api/prospecting/stats')) {
    return {
      totalLeads: 0,
      hotLeads: 0,
      callsThisMonth: 0,
      opportunities: 0,
      fallback: true,
    };
  }

  if (pathname.startsWith('/api/automations/rules')) {
    return { rules: [] };
  }

  if (pathname.startsWith('/api/automations/execute-rule')) {
    return { logs: [] };
  }

  if (pathname === '/api/scrape-listing' && method === 'POST') {
    return buildMockListing();
  }

  if (pathname === '/api/generate-comprehensive' && method === 'POST') {
    return {
      professional:
        'Annuncio demo locale: immobile luminoso in zona servita, pronto per la pubblicazione.',
      short: 'Annuncio demo locale pronto.',
      titles: [
        'Trilocale luminoso in zona servita',
        'Casa con terrazzo pronta da vivere',
        'Appartamento moderno vicino ai servizi',
      ],
      english: 'Local mock listing generated to keep UI flow active.',
    };
  }

  if (pathname === '/api/generate' && method === 'POST') {
    return {
      professional:
        'Annuncio demo locale per garantire continuità durante test UI su localhost.',
      short: 'Annuncio demo locale.',
      titles: ['Titolo demo 1', 'Titolo demo 2', 'Titolo demo 3'],
      english: 'Local mock content.',
    };
  }

  if (pathname.startsWith('/api/stripe/')) {
    return {
      message: 'Mock Stripe response in locale',
      url: '/dashboard/billing',
      fallback: true,
    };
  }

  return null;
}

export function tryLocalMockResponse(url: string, method = 'GET', reason?: string): unknown | null {
  if (!isLocalhostRuntime()) return null;

  try {
    const parsed = new URL(url, window.location.origin);
    const normalizedMethod = (method.toUpperCase() as HttpMethod);
    const payload = getMockPayload(parsed.pathname, normalizedMethod);
    if (!payload) return null;

    console.warn('[LOCAL MOCK SERVICE] Using mock payload', {
      pathname: parsed.pathname,
      method: normalizedMethod,
      reason: reason ?? 'local_fallback',
    });

    return payload;
  } catch {
    return null;
  }
}
