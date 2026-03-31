import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireProOrAgencySubscription } from '@/lib/utils/subscription-check';
import { isLocalMockModeEnabled } from '@/lib/utils/local-dev';
import { getLocalMockEliteDeals } from '@/lib/api/local-mock-service';

export const dynamic = 'force-dynamic';

/**
 * Deal elite Milano + Miami per Predator Map (solo piano Agency).
 * Restituiti istantaneamente al caricamento mappa per utenti Agency.
 * Formato compatibile con external_listings / MapMarker.
 */
const ELITE_DEALS_MILANO_MIAMI = [
  { id: 'elite-milano-1', title: 'Attico di Lusso con Terrazza - Porta Nuova', location: 'Milano, Porta Nuova', price: 1250000, source_platform: 'idealista', status: 'new' as const, owner_name: 'Alessandro Ferrari', phone_number: '+39 333 1234567', source_url: 'https://www.idealista.it/annuncio/elite-milano-001/', ai_summary: { summary_note: 'Market Gap -22.5%. Opportunità premium.', market_gap: 22.5 }, raw_data: { surface: 180, description: 'Attico 180 mq Porta Nuova.' }, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'elite-milano-2', title: 'Villa Moderna con Piscina - Brera', location: 'Milano, Brera', price: 1850000, source_platform: 'immobiliare', status: 'new' as const, owner_name: 'Giulia Romano', phone_number: '+39 345 9876543', source_url: 'https://www.immobiliare.it/annunci/elite-milano-002/', ai_summary: { summary_note: 'Market Gap -20.3%. Villa zona esclusiva.', market_gap: 20.3 }, raw_data: { surface: 250, description: 'Villa 250 mq Brera.' }, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'elite-milano-3', title: 'Loft Design sui Navigli', location: 'Milano, Navigli', price: 680000, source_platform: 'casa', status: 'new' as const, owner_name: 'Marco Bianchi', phone_number: '+39 347 5551234', source_url: 'https://www.casa.it/annunci/elite-milano-003/', ai_summary: { summary_note: 'Market Gap -19%. Zona trend.', market_gap: 19 }, raw_data: { surface: 95, description: 'Loft 95 mq Navigli.' }, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'elite-miami-1', title: 'Luxury Condo Ocean View - Miami Beach', location: 'Miami Beach, FL', price: 2450000, source_platform: 'zillow', status: 'new' as const, owner_name: 'John Smith', phone_number: '+1 305 123 4567', source_url: 'https://www.zillow.com/homedetails/elite-miami-001/', ai_summary: { summary_note: 'Market Gap -21%. Ocean front.', market_gap: 21 }, raw_data: { surface: 220, description: 'Condo 220 mq Miami Beach.' }, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'elite-miami-2', title: 'Penthouse Brickell - Downtown Miami', location: 'Miami, Brickell', price: 1890000, source_platform: 'zillow', status: 'new' as const, owner_name: 'Maria Garcia', phone_number: '+1 305 987 6543', source_url: 'https://www.zillow.com/homedetails/elite-miami-002/', ai_summary: { summary_note: 'Market Gap -18.5%. Skyline view.', market_gap: 18.5 }, raw_data: { surface: 180, description: 'Penthouse 180 mq Brickell.' }, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'elite-miami-3', title: 'Penthouse with Rooftop Terrace - Downtown Miami', location: 'Miami, Downtown', price: 2100000, source_platform: 'zillow', status: 'new' as const, owner_name: 'David Lee', phone_number: null, source_url: 'https://www.zillow.com/homedetails/elite-miami-003/', ai_summary: { summary_note: 'Market Gap -19.5%. Rooftop terrace.', market_gap: 19.5 }, raw_data: { surface: 200, description: 'Penthouse 200 mq Downtown.' }, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

export async function GET() {
  try {
    if (isLocalMockModeEnabled()) {
      return NextResponse.json({
        success: true,
        data: getLocalMockEliteDeals(),
        source: 'elite-local-mock',
        fallback: true,
      });
    }

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Non autenticato' }, { status: 401 });
    }

    const subscriptionCheck = await requireProOrAgencySubscription(supabase, user.id);
    if (!subscriptionCheck.allowed || subscriptionCheck.planType !== 'agency') {
      return NextResponse.json(
        { success: false, error: 'Solo il piano Agency può accedere ai deal elite Milano e Miami.' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: ELITE_DEALS_MILANO_MIAMI,
      source: 'elite',
    });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: (e as Error).message },
      { status: 500 }
    );
  }
}
