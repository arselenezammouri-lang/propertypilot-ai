import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireProOrAgencySubscription } from '@/lib/utils/subscription-check';
import { ScraperFactory } from '@/lib/scrapers/factory';
import { IdealistaSearchScraper, type SearchCriteria } from '@/lib/scrapers/idealista-search';
import { ZillowSearchScraper, type ZillowSearchCriteria } from '@/lib/scrapers/zillow-search';
import { scorePropertyListing } from '@/lib/ai/property-scoring';
import { createHash } from 'crypto';
import type { ScrapedListing } from '@/lib/scrapers/types';
import { logger } from '@/lib/utils/safe-logger';

/**
 * POST /api/prospecting/automate
 * Automation Bridge: Esegue scraping automatico basato su filtri attivi
 * 
 * Body opzionale:
 * - filter_id: UUID del filtro specifico da eseguire (se non fornito, esegue tutti i filtri con auto_run=true)
 * - auto_call: boolean - Se true, chiama automaticamente Bland AI per nuovi listing (opzionale per ora)
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Non autenticato' },
        { status: 401 }
      );
    }

    // Check PRO or AGENCY subscription
    const subscriptionCheck = await requireProOrAgencySubscription(supabase, user.id);
    if (!subscriptionCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: subscriptionCheck.error || 'Piano Premium richiesto',
        },
        { status: 403 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { filter_id, auto_call = false } = body;

    // Recupera filtri da eseguire
    let filtersQuery = supabase
      .from('prospecting_filters')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true);

    if (filter_id) {
      filtersQuery = filtersQuery.eq('id', filter_id);
    } else {
      filtersQuery = filtersQuery.eq('auto_run', true);
    }

    const { data: filters, error: filtersError } = await filtersQuery;

    if (filtersError) {
      logger.error('Error fetching filters', filtersError, { endpoint: '/api/prospecting/automate' });
      return NextResponse.json(
        {
          success: false,
          error: 'Errore nel recupero dei filtri',
          message: filtersError.message,
        },
        { status: 500 }
      );
    }

    if (!filters || filters.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Nessun filtro attivo con auto_run abilitato',
        data: {
          filters_processed: 0,
          listings_found: 0,
          listings_added: 0,
        },
      });
    }

    let totalListingsFound = 0;
    let totalListingsAdded = 0;
    const errors: string[] = [];

    // Per ogni filtro, esegui scraping
    for (const filter of filters) {
      try {
        const criteria = filter.criteria as {
          location?: string;
          price_min?: number;
          price_max?: number;
          property_type?: string;
          rooms_min?: number;
          rooms_max?: number;
          source_platforms?: string[];
        };

        logger.debug('Processing filter', { filterId: filter.id, filterName: filter.name, endpoint: '/api/prospecting/automate' });

        // Supporto per Idealista e Zillow (implementati)
        const platforms = criteria.source_platforms || ['idealista'];
        
        for (const platform of platforms) {
          if (platform === 'idealista') {
            // Usa IdealistaSearchScraper
            const searchScraper = new IdealistaSearchScraper();
            
            const searchCriteria: SearchCriteria = {
              location: criteria.location,
              price_min: criteria.price_min,
              price_max: criteria.price_max,
              rooms_min: criteria.rooms_min,
              rooms_max: criteria.rooms_max,
            };

            logger.debug('Searching Idealista', { criteria: searchCriteria, endpoint: '/api/prospecting/automate' });
            
            // Cerca listing URLs
            const searchResult = await searchScraper.searchListings(searchCriteria, 3); // Max 3 pagine
            
            if (!searchResult.success || !searchResult.urls || searchResult.urls.length === 0) {
              logger.warn('No listings found', { filterName: filter.name, platform, endpoint: '/api/prospecting/automate' });
              continue;
            }

            logger.debug('Found listing URLs', { count: searchResult.urls.length, platform, endpoint: '/api/prospecting/automate' });

            // Per ogni URL trovato, usa lo scraper normale per ottenere i dettagli
            const listingScraper = ScraperFactory.getScraper(searchResult.urls[0]);
            if (!listingScraper) {
              errors.push(`Filter ${filter.name}: Scraper not available for ${platform}`);
              continue;
            }

            // Processa ogni URL (con limite per non sovraccaricare)
            const maxListingsToProcess = 20; // Limite per sicurezza
            let processedCount = 0;

            for (const listingUrl of searchResult.urls.slice(0, maxListingsToProcess)) {
              try {
                // Scrape dettagli listing
                const scrapeResult = await listingScraper.scrape(listingUrl);
                
                if (scrapeResult.success && scrapeResult.data) {
                  // AI Scoring: analizza e assegna lead_score
                  let leadScore: number | null = null;
                  try {
                    const scoringResult = await scorePropertyListing({
                      title: scrapeResult.data.title || '',
                      price: parseFloat(scrapeResult.data.price?.replace(/[^\d,.-]/g, '').replace(',', '.') || '0') || null,
                      location: scrapeResult.data.location || '',
                      description: scrapeResult.data.description_raw || '',
                      features: scrapeResult.data.features || [],
                      propertyType: scrapeResult.data.propertyType,
                    });
                    leadScore = scoringResult.leadScore;
                    logger.debug('Scored listing', { leadScore: scoringResult.leadScore, endpoint: '/api/prospecting/automate' });
                  } catch (scoringError: any) {
                    logger.error('Error scoring listing', scoringError, { endpoint: '/api/prospecting/automate' });
                    // Continue without score
                  }

                  // Salva nel database (con lead_score)
                  const saveResult = await saveListing(
                    scrapeResult.data,
                    listingUrl,
                    platform,
                    user.id,
                    supabase,
                    leadScore
                  );

                  if (saveResult.added) {
                    totalListingsAdded++;
                    processedCount++;
                  }
                  totalListingsFound++;

                  // Small delay tra le chiamate
                  await new Promise(resolve => setTimeout(resolve, 1000)); // 1 secondo
                }
              } catch (urlError: any) {
                logger.error('Error processing URL', urlError, { endpoint: '/api/prospecting/automate', listingUrl });
                // Continue with next URL
              }
            }

            logger.debug('Processed listings', { count: processedCount, platform, filterName: filter.name, endpoint: '/api/prospecting/automate' });

          } else if (platform === 'zillow') {
            // Usa ZillowSearchScraper per mercato USA
            const searchScraper = new ZillowSearchScraper();
            
            // Mappa criteria a Zillow format
            // Zillow usa city/state invece di location generica
            const locationParts = criteria.location?.split(',').map(s => s.trim()) || [];
            const city = locationParts[0] || criteria.location;
            const state = locationParts[1]?.toUpperCase().substring(0, 2);
            
            const zillowCriteria: ZillowSearchCriteria = {
              city: city,
              state: state,
              price_min: criteria.price_min,
              price_max: criteria.price_max,
              bedrooms_min: criteria.rooms_min,
            };

            logger.debug('Searching Zillow', { criteria: zillowCriteria, endpoint: '/api/prospecting/automate' });
            
            // Cerca listing URLs
            const searchResult = await searchScraper.searchListings(zillowCriteria, 3); // Max 3 pagine
            
            if (!searchResult.success || !searchResult.urls || searchResult.urls.length === 0) {
              logger.warn('No listings found', { filterName: filter.name, platform, endpoint: '/api/prospecting/automate' });
              continue;
            }

            logger.debug('Found listing URLs', { count: searchResult.urls.length, platform, endpoint: '/api/prospecting/automate' });

            // Per ogni URL trovato, usa lo scraper normale per ottenere i dettagli
            const listingScraper = ScraperFactory.getScraper(searchResult.urls[0]);
            if (!listingScraper) {
              errors.push(`Filter ${filter.name}: Scraper not available for ${platform}`);
              continue;
            }

            // Processa ogni URL (con limite per non sovraccaricare)
            const maxListingsToProcess = 20; // Limite per sicurezza
            let processedCount = 0;

            for (const listingUrl of searchResult.urls.slice(0, maxListingsToProcess)) {
              try {
                // Scrape dettagli listing
                const scrapeResult = await listingScraper.scrape(listingUrl);
                
                if (scrapeResult.success && scrapeResult.data) {
                  // AI Scoring: analizza e assegna lead_score
                  let leadScore: number | null = null;
                  try {
                    const scoringResult = await scorePropertyListing({
                      title: scrapeResult.data.title || '',
                      price: parseFloat(scrapeResult.data.price?.replace(/[^\d,.-]/g, '').replace(',', '.') || '0') || null,
                      location: scrapeResult.data.location || '',
                      description: scrapeResult.data.description_raw || '',
                      features: scrapeResult.data.features || [],
                      propertyType: scrapeResult.data.propertyType,
                    });
                    leadScore = scoringResult.leadScore;
                    logger.debug('Scored listing', { leadScore: scoringResult.leadScore, endpoint: '/api/prospecting/automate' });
                  } catch (scoringError: any) {
                    logger.error('Error scoring listing', scoringError, { endpoint: '/api/prospecting/automate' });
                    // Continue without score
                  }

                  // Salva nel database (con lead_score)
                  const saveResult = await saveListing(
                    scrapeResult.data,
                    listingUrl,
                    platform,
                    user.id,
                    supabase,
                    leadScore
                  );

                  if (saveResult.added) {
                    totalListingsAdded++;
                    processedCount++;
                  }
                  totalListingsFound++;

                  // Small delay tra le chiamate (Zillow è più strict)
                  await new Promise(resolve => setTimeout(resolve, 2000)); // 2 secondi per Zillow
                }
              } catch (urlError: any) {
                logger.error('Error processing URL', urlError, { endpoint: '/api/prospecting/automate', listingUrl });
                // Continue with next URL
              }
            }

            logger.debug('Processed listings', { count: processedCount, platform, filterName: filter.name, endpoint: '/api/prospecting/automate' });

          } else {
            // Altre piattaforme non ancora implementate
            errors.push(`Filter ${filter.name}: Platform ${platform} not yet supported for automatic search`);
          }
        }

      } catch (filterError: any) {
        console.error(`[PROSPECTING AUTOMATE] Error processing filter ${filter.id}:`, filterError);
        errors.push(`Filter ${filter.name}: ${filterError.message}`);
      }
    }

    // Aggiorna last_run_at per i filtri processati
    if (filters.length > 0) {
      await supabase
        .from('prospecting_filters')
        .update({ last_run_at: new Date().toISOString() })
        .in('id', filters.map(f => f.id));
    }

    return NextResponse.json({
      success: true,
      message: `Processati ${filters.length} filtri`,
      data: {
        filters_processed: filters.length,
        listings_found: totalListingsFound,
        listings_added: totalListingsAdded,
        errors: errors.length > 0 ? errors : undefined,
      },
      note: 'Scraping automatico basato su filtri richiede implementazione API di ricerca per piattaforma. Gli scrapers attuali supportano solo URL singoli.',
    });

  } catch (error: any) {
    logger.error('Unexpected error in automate', error, { endpoint: '/api/prospecting/automate' });
    return NextResponse.json(
      {
        success: false,
        error: 'Errore interno del server',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * Helper function per salvare un listing nel database (con deduplicazione)
 */
async function saveListing(
  scrapedData: ScrapedListing,
  sourceUrl: string,
  sourcePlatform: string,
  userId: string,
  supabase: any,
  leadScore?: number | null
): Promise<{ added: boolean; listingId?: string }> {
  try {
    // Genera hash URL per deduplicazione
    const urlHash = createHash('sha256').update(sourceUrl).digest('hex');

    // Verifica se esiste già
    const { data: existing } = await supabase
      .from('external_listings')
      .select('id')
      .eq('user_id', userId)
      .eq('source_url_hash', urlHash)
      .single();

    if (existing) {
      return { added: false, listingId: existing.id };
    }

    // Estrai prezzo numerico
    const priceMatch = scrapedData.price?.match(/[\d.,]+/);
    const price = priceMatch ? parseFloat(priceMatch[0].replace(/[.,]/g, (m, i, s) => s.length - i === 3 ? '.' : '')) : null;

    // Inserisci nuovo listing
    const { data: newListing, error: insertError } = await supabase
      .from('external_listings')
      .insert({
        user_id: userId,
        source_url_hash: urlHash,
        source_url: sourceUrl,
        title: scrapedData.title || 'Titolo non disponibile',
        price: price,
        location: scrapedData.location || 'Location non disponibile',
        source_platform: sourcePlatform,
        raw_data: scrapedData,
        status: 'new',
      })
      .select('id')
      .single();

    if (insertError) {
      throw insertError;
    }

    return { added: true, listingId: newListing.id };

  } catch (error: any) {
    logger.error('Error saving listing', error, { endpoint: '/api/prospecting/automate' });
    throw error;
  }
}

