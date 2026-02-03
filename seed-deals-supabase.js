const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

const FOUNDER_ID = '84cae443-bedb-4cfd-9c88-bcc2ba817ed2';

const eliteDeals = [
  { title: 'Attico di Lusso con Terrazza Panoramica - Porta Nuova', location: 'Milano, Porta Nuova', price: 1250000, leadScore: 94, marketGap: 22.5, platform: 'idealista', owner: 'Alessandro Ferrari', phone: '+39 333 1234567' },
  { title: 'Villa Moderna con Piscina - Zona Brera', location: 'Milano, Brera', price: 1850000, leadScore: 92, marketGap: 20.3, platform: 'immobiliare', owner: 'Giulia Romano', phone: '+39 345 9876543' },
  { title: 'Duplex Ristrutturato con Giardino - Navigli', location: 'Milano, Navigli', price: 680000, leadScore: 90, marketGap: 19.8, platform: 'casa', owner: 'Marco Bianchi', phone: '+39 366 1122334' },
  { title: 'Loft Industriale Convertito - Isola', location: 'Milano, Isola', price: 520000, leadScore: 88, marketGap: 18.5, platform: 'idealista', owner: 'Sofia Conti', phone: '+39 333 4455667' },
  { title: 'Oceanfront Condo with Private Beach - South Beach', location: 'Miami Beach, FL', price: 2850000, leadScore: 96, marketGap: 24.2, platform: 'zillow', owner: 'Robert Martinez', phone: '+1 305 555 1234' },
  { title: 'Modern Villa with Infinity Pool - Brickell', location: 'Miami, Brickell', price: 3200000, leadScore: 93, marketGap: 21.8, platform: 'zillow', owner: 'Jennifer Chen', phone: '+1 305 555 5678' },
  { title: 'Penthouse with Rooftop Terrace - Downtown Miami', location: 'Miami, Downtown', price: 1950000, leadScore: 89, marketGap: 19.5, platform: 'zillow', owner: 'David Rodriguez', phone: '+1 305 555 9012' },
  { title: 'Royal Penthouse - Dubai Marina', location: 'Dubai Marina, Dubai (UAE)', price: 12000000, leadScore: 97, marketGap: 18.0, platform: 'bayut', owner: 'Sheikh Al Maktoum', phone: '+971 50 123 4567' },
  { title: 'Piso de Lujo en Salamanca - Barrio de Salamanca', location: 'Madrid, Barrio de Salamanca', price: 1250000, leadScore: 95, marketGap: 23.1, platform: 'idealista', owner: 'Carlos García', phone: '+34 612 345 678' },
  { title: 'Ático Duplex con Piscina - Chamartín', location: 'Madrid, Chamartín', price: 1850000, leadScore: 91, marketGap: 20.7, platform: 'idealista', owner: 'María López', phone: '+34 687 123 456' },
  { title: 'Loft Industrial Reformado - Malasaña', location: 'Madrid, Malasaña', price: 580000, leadScore: 88, marketGap: 18.2, platform: 'idealista', owner: 'Alejandro Ruiz', phone: '+34 611 987 654' },
];

async function seedDeals() {
  console.log('🔥 SEEDING ELITE DEALS SU SUPABASE\n');
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
  
  // Prima verifica se la tabella external_listings esiste
  const { data: testData, error: testError } = await supabase
    .from('external_listings')
    .select('id')
    .limit(1);
  
  if (testError) {
    console.log('⚠️ Tabella external_listings non esiste o errore:', testError.message);
    console.log('   Potrebbe essere necessario creare la tabella in Supabase.');
    return;
  }
  
  // Pulisci vecchi deal
  await supabase.from('external_listings').delete().eq('user_id', FOUNDER_ID);
  console.log('🧹 Puliti vecchi deal\n');
  
  let inserted = 0;
  for (const deal of eliteDeals) {
    const urlHash = crypto.createHash('md5').update(deal.title).digest('hex');
    
    const { error } = await supabase.from('external_listings').insert({
      user_id: FOUNDER_ID,
      source_url: `https://${deal.platform}.com/elite-${urlHash.substring(0,8)}/`,
      source_url_hash: urlHash,
      title: deal.title,
      price: deal.price,
      location: deal.location,
      source_platform: deal.platform,
      owner_name: deal.owner,
      phone_number: deal.phone,
      status: 'new',
      lead_score: deal.leadScore,
      ai_summary: { quality_score: 95, market_gap: deal.marketGap, summary_note: `Market Gap -${deal.marketGap}%` },
      raw_data: { title: deal.title, price: deal.price },
    });
    
    if (error) {
      console.error('❌', deal.title.substring(0,40), ':', error.message);
    } else {
      console.log('✅', deal.title.substring(0,50));
      inserted++;
    }
  }
  
  console.log(`\n🎉 INSERITI ${inserted}/11 DEAL ELITE!`);
}

seedDeals().catch(console.error);
