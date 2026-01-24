/**
 * Seed script per popolare external_listings con dati di test
 * 
 * USAGE:
 *   npx tsx scripts/seed-listings.ts <user_id>
 * 
 * Esempio:
 *   npx tsx scripts/seed-listings.ts 123e4567-e89b-12d3-a456-426614174000
 */

import { createClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Carica variabili ambiente
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Errore: NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY devono essere configurati in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Dati di test
const testListings = [
  {
    title: 'Villa moderna con piscina a Milano',
    location: 'Milano, Via Garibaldi 15',
    price: 850000,
    source_url: 'https://www.immobiliare.it/annunci/12345678/',
    source_platform: 'immobiliare',
    owner_name: 'Mario Rossi',
    phone_number: '+39 333 1234567',
    status: 'new',
  },
  {
    title: 'Appartamento bilocale zona Navigli',
    location: 'Milano, Navigli',
    price: 320000,
    source_url: 'https://www.idealista.it/annuncio/87654321/',
    source_platform: 'idealista',
    owner_name: 'Laura Bianchi',
    phone_number: '+39 345 9876543',
    status: 'new',
  },
  {
    title: 'Trilocale ristrutturato in centro',
    location: 'Roma, Trastevere',
    price: 450000,
    source_url: 'https://www.immobiliare.it/annunci/11223344/',
    source_platform: 'immobiliare',
    owner_name: 'Giuseppe Verdi',
    phone_number: '+39 366 1122334',
    status: 'called',
  },
  {
    title: 'Attico panoramico con terrazzo',
    location: 'Firenze, Oltrarno',
    price: 680000,
    source_url: 'https://www.idealista.it/annuncio/55667788/',
    source_platform: 'idealista',
    owner_name: 'Anna Neri',
    phone_number: '+39 333 5566778',
    status: 'appointment_set',
    ai_summary: {
      quality_score: 85,
      summary_note: 'Ottimo immobile in zona prestigiosa, proprietario molto interessato',
      best_time_to_call: 'Mattina 9-12',
      call_transcript: 'Proprietario molto disponibile, ha confermato disponibilità per visita giovedì pomeriggio.',
    },
  },
  {
    title: 'Casa indipendente con giardino',
    location: 'Torino, Collina',
    price: 520000,
    source_url: 'https://www.casa.it/annunci/99887766/',
    source_platform: 'casa',
    owner_name: 'Marco Gialli',
    phone_number: '+39 347 9988776',
    status: 'rejected',
    ai_summary: {
      quality_score: 45,
      summary_note: 'Proprietario non interessato a collaborare con agenzie',
      call_transcript: 'Proprietario ha rifiutato la proposta, preferisce vendere autonomamente.',
    },
  },
];

async function seedListings(userId: string) {
  console.log(`🌱 Seed listings per user_id: ${userId}\n`);

  // Verifica che l'utente esista
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .single();

  if (profileError || !profile) {
    console.error(`❌ Utente ${userId} non trovato. Assicurati che l'user_id sia corretto.`);
    process.exit(1);
  }

  console.log(`✅ Utente trovato\n`);

  let inserted = 0;
  let skipped = 0;

  for (const listing of testListings) {
    try {
      // Genera hash URL per deduplicazione
      const urlHash = createHash('sha256').update(listing.source_url).digest('hex');

      // Verifica se esiste già
      const { data: existing } = await supabase
        .from('external_listings')
        .select('id')
        .eq('user_id', userId)
        .eq('source_url_hash', urlHash)
        .single();

      if (existing) {
        console.log(`⏭️  Skipped: ${listing.title} (già esistente)`);
        skipped++;
        continue;
      }

      // Inserisci listing
      const { data, error } = await supabase
        .from('external_listings')
        .insert({
          user_id: userId,
          source_url_hash: urlHash,
          source_url: listing.source_url,
          title: listing.title,
          price: listing.price,
          location: listing.location,
          source_platform: listing.source_platform,
          owner_name: listing.owner_name,
          phone_number: listing.phone_number,
          status: listing.status,
          ai_summary: listing.ai_summary || {},
        })
        .select('id')
        .single();

      if (error) {
        console.error(`❌ Errore inserimento ${listing.title}:`, error.message);
        continue;
      }

      console.log(`✅ Inserito: ${listing.title} (${listing.status})`);
      inserted++;
    } catch (error: any) {
      console.error(`❌ Errore processo ${listing.title}:`, error.message);
    }
  }

  console.log(`\n📊 Riepilogo:`);
  console.log(`   ✅ Inseriti: ${inserted}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   📝 Totali: ${testListings.length}\n`);
  console.log(`🎉 Seed completato! Vai su /dashboard/prospecting per vedere i dati.\n`);
}

// Main
const userId = process.argv[2];

if (!userId) {
  console.error('❌ Errore: Fornisci un user_id come argomento');
  console.error('\nUsage:');
  console.error('  npx tsx scripts/seed-listings.ts <user_id>');
  console.error('\nEsempio:');
  console.error('  npx tsx scripts/seed-listings.ts 123e4567-e89b-12d3-a456-426614174000\n');
  process.exit(1);
}

seedListings(userId)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Errore fatale:', error);
    process.exit(1);
  });

