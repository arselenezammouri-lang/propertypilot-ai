/**
 * ELITE DEALS SEEDING - VERSIONE NEON DB
 * Popola external_listings con 11 immobili elite per Milano, Miami, Dubai e Madrid
 */

import { db } from '../lib/db';
import { externalListings, profiles } from '../shared/schema';
import { createHash } from 'crypto';
import { eq } from 'drizzle-orm';

const FOUNDER_USER_ID = '84cae443-bedb-4cfd-9c88-bcc2ba817ed2';

const eliteDeals = [
  // MILANO (4 immobili)
  {
    title: 'Attico di Lusso con Terrazza Panoramica - Porta Nuova',
    location: 'Milano, Porta Nuova',
    price: 1250000,
    surface: 180,
    rooms: 4,
    marketGap: 22.5,
    leadScore: 94,
    sourceUrl: 'https://www.idealista.it/annuncio/elite-milano-001/',
    sourcePlatform: 'idealista',
    ownerName: 'Alessandro Ferrari',
    phoneNumber: '+39 333 1234567',
    description: `Attico esclusivo di 180 mq nel cuore di Porta Nuova. Ristrutturazione 2023. Market Gap: -22.5%`,
  },
  {
    title: 'Villa Moderna con Piscina - Zona Brera',
    location: 'Milano, Brera',
    price: 1850000,
    surface: 250,
    rooms: 5,
    marketGap: 20.3,
    leadScore: 92,
    sourceUrl: 'https://www.immobiliare.it/annunci/elite-milano-002/',
    sourcePlatform: 'immobiliare',
    ownerName: 'Giulia Romano',
    phoneNumber: '+39 345 9876543',
    description: `Villa indipendente 250 mq con giardino e piscina in Brera. Market Gap: -20.3%`,
  },
  {
    title: 'Duplex Ristrutturato con Giardino - Navigli',
    location: 'Milano, Navigli',
    price: 680000,
    surface: 120,
    rooms: 3,
    marketGap: 19.8,
    leadScore: 90,
    sourceUrl: 'https://www.casa.it/annunci/elite-milano-003/',
    sourcePlatform: 'casa',
    ownerName: 'Marco Bianchi',
    phoneNumber: '+39 366 1122334',
    description: `Duplex ristrutturato 120 mq con giardino privato in zona Navigli. Market Gap: -19.8%`,
  },
  {
    title: 'Loft Industriale Convertito - Isola',
    location: 'Milano, Isola',
    price: 520000,
    surface: 95,
    rooms: 2,
    marketGap: 18.5,
    leadScore: 88,
    sourceUrl: 'https://www.idealista.it/annuncio/elite-milano-004/',
    sourcePlatform: 'idealista',
    ownerName: 'Sofia Conti',
    phoneNumber: '+39 333 4455667',
    description: `Loft industriale 95 mq con soffitti alti 4.5m in zona Isola. Market Gap: -18.5%`,
  },
  // MIAMI (3 immobili)
  {
    title: 'Oceanfront Condo with Private Beach - South Beach',
    location: 'Miami Beach, FL',
    price: 2850000,
    surface: 220,
    rooms: 3,
    marketGap: 24.2,
    leadScore: 96,
    sourceUrl: 'https://www.zillow.com/homedetails/elite-miami-001/',
    sourcePlatform: 'zillow',
    ownerName: 'Robert Martinez',
    phoneNumber: '+1 305 555 1234',
    description: `Luxury oceanfront condo 2,200 sqft in South Beach. Market Gap: -24.2%`,
  },
  {
    title: 'Modern Villa with Infinity Pool - Brickell',
    location: 'Miami, Brickell',
    price: 3200000,
    surface: 350,
    rooms: 5,
    marketGap: 21.8,
    leadScore: 93,
    sourceUrl: 'https://www.zillow.com/homedetails/elite-miami-002/',
    sourcePlatform: 'zillow',
    ownerName: 'Jennifer Chen',
    phoneNumber: '+1 305 555 5678',
    description: `Stunning modern villa 3,500 sqft in Brickell with infinity pool. Market Gap: -21.8%`,
  },
  {
    title: 'Penthouse with Rooftop Terrace - Downtown Miami',
    location: 'Miami, Downtown',
    price: 1950000,
    surface: 180,
    rooms: 2,
    marketGap: 19.5,
    leadScore: 89,
    sourceUrl: 'https://www.zillow.com/homedetails/elite-miami-003/',
    sourcePlatform: 'zillow',
    ownerName: 'David Rodriguez',
    phoneNumber: '+1 305 555 9012',
    description: `Luxury penthouse 1,800 sqft with rooftop terrace in Downtown Miami. Market Gap: -19.5%`,
  },
  // DUBAI
  {
    title: 'Royal Penthouse - Dubai Marina',
    location: 'Dubai Marina, Dubai (UAE)',
    price: 12000000,
    surface: 520,
    rooms: 5,
    marketGap: 18.0,
    leadScore: 97,
    sourceUrl: 'https://www.bayut.com/property/elite-dubai-001/',
    sourcePlatform: 'bayut',
    ownerName: 'Sheikh Al Maktoum',
    phoneNumber: '+971 50 123 4567',
    description: `Royal Penthouse ultra-luxury 520 mq con infinity pool privata. Market Gap: -18%`,
  },
  // MADRID (3 immobili)
  {
    title: 'Piso de Lujo en Salamanca - Barrio de Salamanca',
    location: 'Madrid, Barrio de Salamanca',
    price: 1250000,
    surface: 160,
    rooms: 4,
    marketGap: 23.1,
    leadScore: 95,
    sourceUrl: 'https://www.idealista.com/inmueble/elite-madrid-001/',
    sourcePlatform: 'idealista',
    ownerName: 'Carlos García',
    phoneNumber: '+34 612 345 678',
    description: `Piso de lujo reformado 160 m² en Barrio de Salamanca. Market Gap: -23.1%`,
  },
  {
    title: 'Ático Duplex con Piscina - Chamartín',
    location: 'Madrid, Chamartín',
    price: 1850000,
    surface: 200,
    rooms: 5,
    marketGap: 20.7,
    leadScore: 91,
    sourceUrl: 'https://www.idealista.com/inmueble/elite-madrid-002/',
    sourcePlatform: 'idealista',
    ownerName: 'María López',
    phoneNumber: '+34 687 123 456',
    description: `Ático dúplex 200 m² con piscina privada en Chamartín. Market Gap: -20.7%`,
  },
  {
    title: 'Loft Industrial Reformado - Malasaña',
    location: 'Madrid, Malasaña',
    price: 580000,
    surface: 110,
    rooms: 2,
    marketGap: 18.2,
    leadScore: 88,
    sourceUrl: 'https://www.idealista.com/inmueble/elite-madrid-003/',
    sourcePlatform: 'idealista',
    ownerName: 'Alejandro Ruiz',
    phoneNumber: '+34 611 987 654',
    description: `Loft industrial reformado 110 m² en Malasaña. Market Gap: -18.2%`,
  },
];

async function seedEliteDeals() {
  console.log('🔥 ELITE DEALS SEEDING (NEON DB)\n');
  console.log(`📊 Inserimento di ${eliteDeals.length} immobili elite per founder...\n`);

  // Verifica che il profilo esista
  const [profile] = await db.select().from(profiles).where(eq(profiles.id, FOUNDER_USER_ID)).limit(1);
  
  if (!profile) {
    console.error('❌ Profilo founder non trovato. Crealo prima.');
    process.exit(1);
  }

  console.log('✅ Profilo founder trovato:', profile.fullName);

  let inserted = 0;
  let skipped = 0;

  for (const deal of eliteDeals) {
    const urlHash = createHash('sha256').update(deal.sourceUrl).digest('hex');
    
    const aiSummary = {
      quality_score: 95,
      market_gap: deal.marketGap,
      summary_note: `Opportunità d'investimento con Market Gap del ${deal.marketGap}%`,
      urgency_score: 85,
    };

    const rawData = {
      title: deal.title,
      location: deal.location,
      price: deal.price,
      surface: deal.surface,
      rooms: deal.rooms,
      description: deal.description,
    };

    try {
      await db.insert(externalListings).values({
        userId: FOUNDER_USER_ID,
        sourceUrlHash: urlHash,
        sourceUrl: deal.sourceUrl,
        title: deal.title,
        price: deal.price,
        location: deal.location,
        sourcePlatform: deal.sourcePlatform,
        ownerName: deal.ownerName,
        phoneNumber: deal.phoneNumber,
        status: 'new',
        leadScore: deal.leadScore,
        aiSummary: aiSummary,
        rawData: rawData,
      }).onConflictDoNothing();

      console.log(`✅ ${deal.title}`);
      console.log(`   📍 ${deal.location} | 💰 €${deal.price.toLocaleString()} | Lead Score: ${deal.leadScore}`);
      inserted++;
    } catch (error: any) {
      if (error.message?.includes('duplicate')) {
        console.log(`⏭️  Già esistente: ${deal.title}`);
        skipped++;
      } else {
        console.error(`❌ Errore: ${deal.title}`, error.message);
      }
    }
  }

  console.log(`\n📊 Riepilogo:`);
  console.log(`   ✅ Inseriti: ${inserted}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`\n🎉 VETRINA D'ORO CREATA! Vai su /dashboard/prospecting`);
}

seedEliteDeals()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Errore:', err);
    process.exit(1);
  });
