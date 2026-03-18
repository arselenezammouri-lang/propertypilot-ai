type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type LocalMockPlan = 'free' | 'starter' | 'pro' | 'agency';

export const LOCAL_MOCK_USER_ID = '00000000-0000-0000-0000-000000000001';

function resolveLocalMockPlan(): LocalMockPlan {
  const fromEnv = (
    process.env.NEXT_PUBLIC_LOCAL_MOCK_PLAN ||
    process.env.LOCAL_MOCK_PLAN ||
    process.env.LOCAL_DEV_MOCK_PLAN
  )?.toLowerCase();

  if (fromEnv === 'free' || fromEnv === 'starter' || fromEnv === 'pro' || fromEnv === 'agency') {
    return fromEnv;
  }

  // Founder simulation default: full agency mode.
  return 'agency';
}

export function getLocalMockPlan(): LocalMockPlan {
  return resolveLocalMockPlan();
}

export function getLocalMockUsagePayload() {
  const plan = getLocalMockPlan();
  const isAgency = plan === 'agency';
  return {
    plan,
    currentUsage: isAgency ? 42 : 0,
    limit: isAgency ? -1 : plan === 'pro' ? 200 : plan === 'starter' ? 50 : 5,
    hasReachedLimit: false,
    isNearLimit: false,
    remainingGenerations: isAgency ? -1 : plan === 'pro' ? 200 : plan === 'starter' ? 50 : 5,
    percentageUsed: isAgency ? 0 : 0,
    fallback: true,
  };
}

export function getLocalMockSubscriptionPayload() {
  const plan = getLocalMockPlan();
  return {
    user_id: LOCAL_MOCK_USER_ID,
    status: plan,
    stripe_subscription_id: plan === 'free' ? null : 'sub_local_mock_agency',
    stripe_customer_id: plan === 'free' ? null : 'cus_local_mock_founder',
    cancel_at_period_end: false,
    stripe_verified: plan !== 'free',
    sync_action: 'local_mock_mode',
    fallback: true,
  };
}

export function getLocalMockProspectingListings() {
  const now = new Date().toISOString();
  return [
    {
      id: '11111111-1111-4111-8111-111111111111',
      title: 'Luxury Condo Ocean View - Miami Beach',
      location: 'Miami Beach, FL',
      price: 2450000,
      source_platform: 'zillow',
      status: 'new',
      owner_name: 'John Smith',
      phone_number: '+13051234567',
      source_url: 'https://www.zillow.com/homedetails/11111111',
      ai_summary: { summary_note: 'Market Gap -21%. Ocean front opportunity.', market_gap: 21, price_drop_percentage: 8 },
      lead_score: 96,
      raw_data: { surface: 220, bedrooms: 4, bathrooms: 3, description: 'Oceanfront luxury condo in Miami Beach.' },
      category: 'RESIDENTIAL_SALE',
      created_at: now,
      updated_at: now,
    },
    {
      id: '22222222-2222-4222-8222-222222222222',
      title: 'Penthouse Brickell - Skyline & Bay View',
      location: 'Miami, Brickell',
      price: 1890000,
      source_platform: 'zillow',
      status: 'called',
      owner_name: 'Maria Garcia',
      phone_number: '+13059876543',
      source_url: 'https://www.zillow.com/homedetails/22222222',
      ai_summary: { summary_note: 'Strong upside with premium location.', market_gap: 18.5, price_drop_percentage: 4 },
      lead_score: 93,
      raw_data: { surface: 180, bedrooms: 3, bathrooms: 2, description: 'Brickell penthouse with skyline view.' },
      category: 'RESIDENTIAL_SALE',
      created_at: now,
      updated_at: now,
    },
    {
      id: '33333333-3333-4333-8333-333333333333',
      title: 'Modern Villa with Pool - Milano Brera',
      location: 'Milano, Brera',
      price: 1850000,
      source_platform: 'immobiliare',
      status: 'new',
      owner_name: 'Giulia Romano',
      phone_number: '+393459876543',
      source_url: 'https://www.immobiliare.it/annunci/33333333/',
      ai_summary: { summary_note: 'Premium district, rare inventory.', market_gap: 20.3, price_drop_percentage: 6 },
      lead_score: 91,
      raw_data: { surface: 250, bedrooms: 5, bathrooms: 4, description: 'Luxury villa in Brera.' },
      category: 'RESIDENTIAL_SALE',
      created_at: now,
      updated_at: now,
    },
    {
      id: '44444444-4444-4444-8444-444444444444',
      title: 'Loft Design Navigli - ROI Opportunity',
      location: 'Milano, Navigli',
      price: 680000,
      source_platform: 'idealista',
      status: 'appointment_set',
      owner_name: 'Marco Bianchi',
      phone_number: '+393475551234',
      source_url: 'https://www.idealista.it/annuncio/44444444/',
      ai_summary: { summary_note: 'Excellent yield for short rental strategy.', market_gap: 17.8, price_drop_percentage: 3 },
      lead_score: 88,
      raw_data: { surface: 95, bedrooms: 2, bathrooms: 1, description: 'Design loft on Navigli canal.' },
      category: 'RESIDENTIAL_SALE',
      created_at: now,
      updated_at: now,
    },
  ];
}

export function getLocalMockProspectingStats() {
  return {
    calls_today: 7,
    appointments_this_week: 4,
    new_listings_today: 12,
    total_active: 48,
    calls_this_month: 19,
    fallback: true,
  };
}

export function getLocalMockEliteDeals() {
  return getLocalMockProspectingListings().filter((listing) => (listing.lead_score ?? 0) > 90);
}

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
    return getLocalMockUsagePayload();
  }

  if (pathname === '/api/user/subscription') {
    return getLocalMockSubscriptionPayload();
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
    return getLocalMockProspectingListings();
  }

  if (pathname.startsWith('/api/prospecting/filters')) {
    return [];
  }

  if (pathname.startsWith('/api/prospecting/elite-deals')) {
    return getLocalMockEliteDeals();
  }

  if (pathname.startsWith('/api/prospecting/stats')) {
    return getLocalMockProspectingStats();
  }

  if (pathname.startsWith('/api/prospecting/call') && method === 'POST') {
    return {
      call_id: `local-call-${Date.now()}`,
      status: 'queued',
      listing_id: 'local-mock-listing',
      message: 'Mock Bland AI trigger started in local mode',
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
