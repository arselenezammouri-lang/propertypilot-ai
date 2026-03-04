import { supabaseService } from '@/lib/supabase/service';
import {
  createBlandAICall,
  generateProspectingCallScript,
  getDefaultObjectionHandlers,
} from '@/lib/ai/voice-agent';

/**
 * Avvia una chiamata Bland AI per un listing specifico, riutilizzando
 * la stessa logica dell'endpoint /api/prospecting/call ma senza passare da HTTP.
 */
export async function startAutopilotCall(listingId: string, userId: string) {
  const { data: listing, error } = await supabaseService
    .from('external_listings')
    .select('*')
    .eq('id', listingId)
    .eq('user_id', userId)
    .single();

  if (error || !listing) {
    throw new Error('Listing non trovato o non accessibile');
  }

  if (!listing.phone_number) {
    throw new Error('Numero di telefono non disponibile per questo listing');
  }

  // Market gap molto semplificato (allineato a /api/prospecting/call)
  let marketGap: number | undefined;
  if (listing.price && listing.raw_data?.surface) {
    const pricePerSqm = listing.price / listing.raw_data.surface;
    const marketAvgPricePerSqm = pricePerSqm * 1.22;
    const gap = ((marketAvgPricePerSqm - pricePerSqm) / marketAvgPricePerSqm) * 100;
    marketGap = gap > 0 ? gap : undefined;
  }

  const callScript = generateProspectingCallScript(
    listing.owner_name || (listing.source_platform === 'zillow' ? 'Sir/Madam' : 'Signore/Signora'),
    listing.location,
    listing.title,
    listing.source_platform,
    marketGap
  );

  const objectionHandlers = getDefaultObjectionHandlers(listing.source_platform, listing.location);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_APP_URL non configurata');
  }

  const webhookUrl = `${baseUrl}/api/prospecting/call/webhook?listing_id=${listingId}`;

  const callResponse = await createBlandAICall({
    phone_number: listing.phone_number,
    task: callScript,
    voicemail_detection: true,
    model: 'enhanced',
    temperature: 0.7,
    interruption_threshold: 500,
    objection_handlers: objectionHandlers,
    webhook_url: webhookUrl,
  });

  await supabaseService
    .from('external_listings')
    .update({
      status: 'called',
      updated_at: new Date().toISOString(),
    })
    .eq('id', listingId)
    .eq('user_id', userId);

  return callResponse;
}

