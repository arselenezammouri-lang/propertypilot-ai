import { supabaseService } from '@/lib/supabase/service';

type FollowupPayload = {
  leadName: string;
  agentName: string;
  agencyName: string;
  propertyTitle: string;
  propertyLocation: string;
  propertyPrice: string;
  reasonOfInterest: string;
  tone: 'professionale' | 'amichevole' | 'luxury';
};

/**
 * Genera un set di email di follow-up usando l'endpoint esistente
 * /api/generate-followup. Restituisce il JSON completo con tutte le varianti.
 */
export async function generateAutopilotFollowup(listing: any, userId: string) {
  const { data: profile } = await supabaseService
    .from('profiles')
    .select('full_name, agency_name')
    .eq('id', userId)
    .single();

  const payload: FollowupPayload = {
    leadName: listing.owner_name || 'Proprietario',
    agentName: profile?.full_name || 'Il tuo consulente immobiliare',
    agencyName: profile?.agency_name || 'PropertyPilot AI',
    propertyTitle: listing.title || 'Immobile',
    propertyLocation: listing.location || '',
    propertyPrice: listing.price ? `${listing.price} €` : 'n.d.',
    reasonOfInterest:
      'Contatto generato automaticamente dal tuo Autopilot Mandati per un possibile mandato di vendita.',
    tone: 'professionale',
  };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) {
    throw new Error('NEXT_PUBLIC_APP_URL non configurata');
  }

  const res = await fetch(`${appUrl}/api/generate-followup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let errorMessage = 'Errore generazione follow-up';
    try {
      const body = await res.json();
      errorMessage = body.error || body.message || errorMessage;
    } catch {
      // ignore parse error, manteniamo messaggio di default
    }
    throw new Error(errorMessage);
  }

  return res.json();
}

