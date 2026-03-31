/**
 * ELITE DEALS SEEDING SCRIPT
 * Popola external_listings con 10 immobili elite ultra-realistici
 * per Milano, Miami e Madrid con lead_score 88-96 e market_gap 18-25%
 * 
 * USAGE:
 *   npx tsx scripts/seed-elite-deals.ts <user_id>
 * 
 * Esempio:
 *   npx tsx scripts/seed-elite-deals.ts 123e4567-e89b-12d3-a456-426614174000
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

// ELITE DEALS - 10+ immobili ultra-realistici
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
    source_url: 'https://www.idealista.it/annuncio/elite-milano-001/',
    source_platform: 'idealista',
    owner_name: 'Alessandro Ferrari',
    phone_number: '+39 333 1234567',
    description: `Attico esclusivo di 180 mq con terrazza panoramica di 80 mq nel cuore di Porta Nuova. 
    Ristrutturazione di pregio completata nel 2023. Finiture di lusso: parquet in rovere massello, 
    cucina Boffi, bagni in marmo di Carrara. Impianto domotico completo, climatizzazione, 
    sistema di sicurezza avanzato. Vista mozzafiato su skyline milanese.
    
    **INVESTMENT ANALYSIS:**
    - Prezzo attuale: €1.250.000 (€6.944/mq)
    - Media zona Porta Nuova: €8.500/mq
    - Market Gap: -22.5% (OPPORTUNITÀ D'ORO)
    - CAP Rate stimato: 4.2% (affitto mensile €4.500)
    - ROI potenziale: 28% in 3 anni
    - Potenziale plusvalenza: €300.000+`,
    imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=800&fit=crop',
  },
  {
    title: 'Villa Moderna con Piscina - Zona Brera',
    location: 'Milano, Brera',
    price: 1850000,
    surface: 250,
    rooms: 5,
    marketGap: 20.3,
    leadScore: 92,
    source_url: 'https://www.immobiliare.it/annunci/elite-milano-002/',
    source_platform: 'immobiliare',
    owner_name: 'Giulia Romano',
    phone_number: '+39 345 9876543',
    description: `Villa indipendente di 250 mq con giardino privato di 200 mq e piscina nel quartiere 
    esclusivo di Brera. Ristrutturazione completa 2022. Design contemporaneo con finiture premium: 
    pavimenti in pietra naturale, cucina open space con isola centrale, 5 camere da letto con suite master, 
    3 bagni di lusso. Garage doppio, cantina, sistema domotico.
    
    **INVESTMENT ANALYSIS:**
    - Prezzo attuale: €1.850.000 (€7.400/mq)
    - Media zona Brera: €9.200/mq
    - Market Gap: -20.3% (AFFARE PREMIUM)
    - CAP Rate stimato: 3.8% (affitto mensile €5.800)
    - ROI potenziale: 32% in 4 anni
    - Potenziale plusvalenza: €450.000+`,
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop',
  },
  {
    title: 'Duplex Ristrutturato con Giardino - Navigli',
    location: 'Milano, Navigli',
    price: 680000,
    surface: 120,
    rooms: 3,
    marketGap: 19.8,
    leadScore: 90,
    source_url: 'https://www.casa.it/annunci/elite-milano-003/',
    source_platform: 'casa',
    owner_name: 'Marco Bianchi',
    phone_number: '+39 366 1122334',
    description: `Duplex ristrutturato di 120 mq con giardino privato di 60 mq nella zona Navigli. 
    Ristrutturazione completa 2023 con design moderno. Piano terra: soggiorno open space, cucina 
    professionale, bagno. Piano superiore: 3 camere, bagno master con doccia walk-in. Giardino 
    attrezzato con pergola e area relax. Zona servita, vicino a metro.
    
    **INVESTMENT ANALYSIS:**
    - Prezzo attuale: €680.000 (€5.667/mq)
    - Media zona Navigli: €7.000/mq
    - Market Gap: -19.8% (OPPORTUNITÀ INVESTIMENTO)
    - CAP Rate stimato: 5.1% (affitto mensile €2.900)
    - ROI potenziale: 35% in 3 anni
    - Potenziale plusvalenza: €150.000+`,
    imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop',
  },
  {
    title: 'Loft Industriale Convertito - Isola',
    location: 'Milano, Isola',
    price: 520000,
    surface: 95,
    rooms: 2,
    marketGap: 18.5,
    leadScore: 88,
    source_url: 'https://www.idealista.it/annuncio/elite-milano-004/',
    source_platform: 'idealista',
    owner_name: 'Sofia Conti',
    phone_number: '+39 333 4455667',
    description: `Loft industriale convertito di 95 mq nella zona Isola in forte crescita. 
    Soffitti alti 4.5m, ampie vetrate, design industriale con finiture moderne. Open space 
    con zona living, cucina professionale, camera da letto con bagno privato. Balcone 
    panoramico. Zona trendy, vicino a Porta Garibaldi.
    
    **INVESTMENT ANALYSIS:**
    - Prezzo attuale: €520.000 (€5.474/mq)
    - Media zona Isola: €6.700/mq
    - Market Gap: -18.5% (OPPORTUNITÀ GIOVANE)
    - CAP Rate stimato: 5.5% (affitto mensile €2.400)
    - ROI potenziale: 38% in 3 anni
    - Potenziale plusvalenza: €120.000+`,
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop',
  },
  
  // MIAMI (3 immobili)
  {
    title: 'Oceanfront Condo with Private Beach Access - South Beach',
    location: 'Miami Beach, FL',
    price: 2850000,
    surface: 220,
    rooms: 3,
    marketGap: 24.2,
    leadScore: 96,
    source_url: 'https://www.zillow.com/homedetails/elite-miami-001/',
    source_platform: 'zillow',
    owner_name: 'Robert Martinez',
    phone_number: '+1 305 555 1234',
    description: `Luxury oceanfront condominium with direct beach access in South Beach. 
    2,200 sqft, 3 bedrooms, 3.5 bathrooms. Floor-to-ceiling windows with panoramic ocean views. 
    High-end finishes: Italian marble, custom cabinetry, Sub-Zero appliances. Private balcony, 
    concierge service, valet parking, resort-style amenities.
    
    **INVESTMENT ANALYSIS:**
    - Current Price: $2,850,000 ($1,295/sqft)
    - Market Average South Beach: $1,700/sqft
    - Market Gap: -24.2% (PREMIUM OPPORTUNITY)
    - CAP Rate: 4.8% (monthly rent $11,400)
    - Potential ROI: 42% in 4 years
    - Potential appreciation: $800,000+`,
    imageUrl: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=1200&h=800&fit=crop',
  },
  {
    title: 'Modern Villa with Infinity Pool - Brickell',
    location: 'Miami, Brickell',
    price: 3200000,
    surface: 350,
    rooms: 5,
    marketGap: 21.8,
    leadScore: 93,
    source_url: 'https://www.zillow.com/homedetails/elite-miami-002/',
    source_platform: 'zillow',
    owner_name: 'Jennifer Chen',
    phone_number: '+1 305 555 5678',
    description: `Stunning modern villa in Brickell with infinity pool and bay views. 
    3,500 sqft, 5 bedrooms, 4.5 bathrooms. Open-concept design with high ceilings, 
    premium finishes throughout. Chef's kitchen, home theater, wine cellar. 
    Rooftop terrace with outdoor kitchen. Smart home technology.
    
    **INVESTMENT ANALYSIS:**
    - Current Price: $3,200,000 ($914/sqft)
    - Market Average Brickell: $1,170/sqft
    - Market Gap: -21.8% (ELITE OPPORTUNITY)
    - CAP Rate: 4.2% (monthly rent $11,200)
    - Potential ROI: 38% in 5 years
    - Potential appreciation: $900,000+`,
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop',
  },
  {
    title: 'Penthouse with Rooftop Terrace - Downtown Miami',
    location: 'Miami, Downtown',
    price: 1950000,
    surface: 180,
    rooms: 2,
    marketGap: 19.5,
    leadScore: 89,
    source_url: 'https://www.zillow.com/homedetails/elite-miami-003/',
    source_platform: 'zillow',
    owner_name: 'David Rodriguez',
    phone_number: '+1 305 555 9012',
    description: `Luxury penthouse with private rooftop terrace in Downtown Miami. 
    1,800 sqft, 2 bedrooms, 2.5 bathrooms. Floor-to-ceiling windows, premium finishes, 
    high-end appliances. Private rooftop with outdoor kitchen and city views. 
    Building amenities: gym, pool, concierge.
    
    **INVESTMENT ANALYSIS:**
    - Current Price: $1,950,000 ($1,083/sqft)
    - Market Average Downtown: $1,345/sqft
    - Market Gap: -19.5% (STRONG OPPORTUNITY)
    - CAP Rate: 5.2% (monthly rent $8,450)
    - Potential ROI: 36% in 3 years
    - Potential appreciation: $450,000+`,
    imageUrl: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&h=800&fit=crop',
  },

  // DUBAI (1 immobile - Middle East ultra luxury)
  {
    title: 'Royal Penthouse - Dubai Marina',
    location: 'Dubai Marina, Dubai (UAE)',
    price: 12000000, // AED
    surface: 520,
    rooms: 5,
    marketGap: 18.0,
    leadScore: 97,
    source_url: 'https://www.bayut.com/property/elite-dubai-001/',
    source_platform: 'bayut',
    owner_name: 'Sheikh Al Maktoum',
    phone_number: '+971 50 123 4567',
    description: `Royal Penthouse ultra-luxury di 520 mq all'ultimo piano di una torre iconica in Dubai Marina.
    Vista panoramica a 270° sul Golfo Arabico e skyline di Dubai. Interni firmati da studio internazionale,
    finiture in marmo italiano, legni pregiati e dettagli in oro. Infinity pool privata sul rooftop,
    ascensore privato, suite master con spa, sala cinema, cigar lounge e sky bar.

    **INVESTMENT ANALYSIS (AED):**
    - Prezzo attuale: 12.000.000 د.إ
    - Media penthouse comparabili: 14.600.000 د.إ
    - Market Gap: -18% (ULTRA LUXURY OPPORTUNITY)
    - CAP Rate stimato: 5.0% (affitto mensile 50.000 د.إ)
    - ROI potenziale: 40% in 4 anni
    - Potenziale plusvalenza: 3.000.000+ د.إ`,
    imageUrl: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&h=800&fit=crop',
  },

  // MADRID (3 immobili)
  {
    title: 'Piso de Lujo en Salamanca con Terraza - Barrio de Salamanca',
    location: 'Madrid, Barrio de Salamanca',
    price: 1250000,
    surface: 160,
    rooms: 4,
    marketGap: 23.1,
    leadScore: 95,
    source_url: 'https://www.idealista.com/inmueble/elite-madrid-001/',
    source_platform: 'idealista',
    owner_name: 'Carlos García',
    phone_number: '+34 612 345 678',
    description: `Piso de lujo completamente reformado en el exclusivo Barrio de Salamanca. 
    160 m², 4 habitaciones, 3 baños. Reforma integral 2023 con acabados premium: suelos de 
    mármol, cocina italiana, baños de diseño. Terraza privada de 40 m² con vistas. Ascensor, 
    portero, garaje incluido.
    
    **ANÁLISIS DE INVERSIÓN:**
    - Precio actual: €1.250.000 (€7.813/m²)
    - Media zona Salamanca: €10.150/m²
    - Market Gap: -23.1% (OPORTUNIDAD PREMIUM)
    - CAP Rate estimado: 4.5% (alquiler mensual €4.700)
    - ROI potencial: 40% en 4 años
    - Plusvalía potencial: €350.000+`,
    imageUrl: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&h=800&fit=crop',
  },
  {
    title: 'Ático Duplex con Piscina - Chamartín',
    location: 'Madrid, Chamartín',
    price: 1850000,
    surface: 200,
    rooms: 5,
    marketGap: 20.7,
    leadScore: 91,
    source_url: 'https://www.idealista.com/inmueble/elite-madrid-002/',
    source_platform: 'idealista',
    owner_name: 'María López',
    phone_number: '+34 687 123 456',
    description: `Ático dúplex de lujo con piscina privada en Chamartín. 200 m², 5 habitaciones, 
    4 baños. Reforma de diseño 2022. Planta baja: salón-comedor, cocina profesional, 2 habitaciones. 
    Planta superior: suite master, 2 habitaciones, terraza con piscina privada. Vistas panorámicas 
    de Madrid. Parking doble.
    
    **ANÁLISIS DE INVERSIÓN:**
    - Precio actual: €1.850.000 (€9.250/m²)
    - Media zona Chamartín: €11.650/m²
    - Market Gap: -20.7% (OPORTUNIDAD ÉLITE)
    - CAP Rate estimado: 4.0% (alquiler mensual €6.200)
    - ROI potencial: 35% en 4 años
    - Plusvalía potencial: €500.000+`,
    imageUrl: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=1200&h=800&fit=crop',
  },
  {
    title: 'Loft Industrial Reformado - Malasaña',
    location: 'Madrid, Malasaña',
    price: 580000,
    surface: 110,
    rooms: 2,
    marketGap: 18.2,
    leadScore: 88,
    source_url: 'https://www.idealista.com/inmueble/elite-madrid-003/',
    source_platform: 'idealista',
    owner_name: 'Alejandro Ruiz',
    phone_number: '+34 611 987 654',
    description: `Loft industrial reformado en el corazón de Malasaña. 110 m², 2 habitaciones, 
    2 baños. Techos altos 4m, grandes ventanales, diseño industrial con acabados modernos. 
    Open space con zona living, cocina profesional, habitación principal con baño privado. 
    Terraza privada. Zona trendy, cerca de Gran Vía.
    
    **ANÁLISIS DE INVERSIÓN:**
    - Precio actual: €580.000 (€5.273/m²)
    - Media zona Malasaña: €6.450/m²
    - Market Gap: -18.2% (OPORTUNIDAD JOVEN)
    - CAP Rate estimado: 5.8% (alquiler mensual €2.800)
    - ROI potencial: 42% en 3 años
    - Plusvalía potencial: €130.000+`,
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop',
  },
];

async function seedEliteDeals(userId: string) {
  console.log(`🔥 ELITE DEALS SEEDING per user_id: ${userId}\n`);
  console.log(`📊 Inserimento di ${eliteDeals.length} immobili elite...\n`);

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
  let errors = 0;

  for (const deal of eliteDeals) {
    try {
      // Genera hash URL per deduplicazione
      const urlHash = createHash('sha256').update(deal.source_url).digest('hex');

      // Verifica se esiste già
      const { data: existing } = await supabase
        .from('external_listings')
        .select('id')
        .eq('user_id', userId)
        .eq('source_url_hash', urlHash)
        .single();

      if (existing) {
        console.log(`⏭️  Skipped: ${deal.title} (già esistente)`);
        skipped++;
        continue;
      }

      // Prepara raw_data con tutte le informazioni
      const rawData = {
        title: deal.title,
        location: deal.location,
        price: deal.price,
        surface: deal.surface,
        rooms: deal.rooms,
        description_raw: deal.description,
        description: deal.description,
        features: [
          `${deal.rooms} camere`,
          `${deal.surface} m²`,
          'Ristrutturato',
          'Finiture di pregio',
          'Zona esclusiva',
        ],
        propertyType: deal.rooms >= 4 ? 'villa' : deal.rooms >= 3 ? 'appartamento' : 'loft',
        images: [deal.imageUrl],
        market_gap_percentage: deal.marketGap,
      };

      // Prepara ai_summary con analisi professionale
      const aiSummary = {
        quality_score: 95,
        summary_note: `Immobile premium con Market Gap del ${deal.marketGap}%. Opportunità d'investimento eccezionale con ROI potenziale superiore al 30%. Proprietario motivato alla vendita rapida.`,
        best_time_to_call: 'Mattina 9-12 o Pomeriggio 15-18',
        market_gap: deal.marketGap,
        urgency_score: 85,
        investment_potential: 'Alto',
        roi_estimate: '30-40%',
        cap_rate: deal.location.includes('Milano') ? '4.2-5.5%' : deal.location.includes('Miami') ? '4.0-5.2%' : '4.0-5.8%',
      };

      // Inserisci listing
      const { data, error } = await supabase
        .from('external_listings')
        .insert({
          user_id: userId,
          source_url_hash: urlHash,
          source_url: deal.source_url,
          title: deal.title,
          price: deal.price,
          location: deal.location,
          source_platform: deal.source_platform,
          owner_name: deal.owner_name,
          phone_number: deal.phone_number,
          status: 'new', // Status 'new' per mostrare tasto 🔥 CHIAMA ORA
          lead_score: deal.leadScore, // Lead score 88-96
          ai_summary: aiSummary,
          raw_data: rawData,
        })
        .select('id')
        .single();

      if (error) {
        console.error(`❌ Errore inserimento ${deal.title}:`, error.message);
        errors++;
        continue;
      }

      console.log(`✅ Inserito: ${deal.title}`);
      console.log(`   📍 ${deal.location}`);
      console.log(`   💰 €${deal.price.toLocaleString('it-IT')} | Market Gap: -${deal.marketGap}% | Lead Score: ${deal.leadScore}/100`);
      console.log(`   🔥 Status: NEW (tasto CHIAMA ORA visibile)\n`);
      inserted++;
    } catch (error: any) {
      console.error(`❌ Errore processo ${deal.title}:`, error.message);
      errors++;
    }
  }

  console.log(`\n📊 Riepilogo Elite Deals:`);
  console.log(`   ✅ Inseriti: ${inserted}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   ❌ Errori: ${errors}`);
  console.log(`   📝 Totali: ${eliteDeals.length}\n`);
  
  if (inserted > 0) {
    console.log(`🎉 VETRINA D'ORO CREATA!`);
    console.log(`\n🔥 Apri la dashboard e vedrai:`);
    console.log(`   - ${inserted} immobili con badge 🔥 TOP DEAL`);
    console.log(`   - Lead Score: 88-96 (affari d'oro)`);
    console.log(`   - Market Gap: 18-25% (opportunità premium)`);
    console.log(`   - Tasto 🔥 CHIAMA ORA visibile per tutti`);
    console.log(`   - Descrizioni Investment Style con ROI e CAP Rate\n`);
    console.log(`🚀 Vai su /dashboard/prospecting per vedere l'impero di opportunità!\n`);
  }
}

// Main
const userId = process.argv[2];

if (!userId) {
  console.error('❌ Errore: Fornisci un user_id come argomento');
  console.error('\nUsage:');
  console.error('  npx tsx scripts/seed-elite-deals.ts <user_id>');
  console.error('\nEsempio:');
  console.error('  npx tsx scripts/seed-elite-deals.ts 123e4567-e89b-12d3-a456-426614174000\n');
  process.exit(1);
}

seedEliteDeals(userId)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Errore fatale:', error);
    process.exit(1);
  });
