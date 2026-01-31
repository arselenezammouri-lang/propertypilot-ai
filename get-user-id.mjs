/**
 * Script per ottenere l'user_id corrente da Supabase
 * Esegui: node get-user-id.mjs
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carica variabili d'ambiente
dotenv.config({ path: join(__dirname, '.env.local') });
dotenv.config({ path: join(__dirname, '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ ERRORE: Variabili Supabase non configurate');
  console.error('Assicurati che .env.local contenga:');
  console.error('  - NEXT_PUBLIC_SUPABASE_URL');
  console.error('  - NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function getUserInfo() {
  try {
    // Prova a ottenere la sessione corrente
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      console.log('⚠️  Nessuna sessione attiva trovata.');
      console.log('');
      console.log('💡 OPZIONI:');
      console.log('1. Accedi a http://localhost:3000/dashboard e poi riprova');
      console.log('2. Usa Supabase Dashboard → Authentication → Users per trovare il tuo user_id');
      console.log('');
      console.log('📋 Per testare, puoi anche usare un user_id esistente da Supabase.');
      return;
    }

    const userId = session.user.id;
    const email = session.user.email;

    console.log('✅ USER ID TROVATO:');
    console.log('');
    console.log(`   User ID: ${userId}`);
    console.log(`   Email:   ${email}`);
    console.log('');
    console.log('📋 Usa questo User ID nel comando Stripe:');
    console.log(`   --metadata[userId]=${userId}`);
    console.log('');

    // Verifica subscription esistente
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (subscription) {
      console.log('📊 SUBSCRIPTION ATTUALE:');
      console.log(`   Status: ${subscription.status || 'free'}`);
      console.log(`   Price ID: ${subscription.price_id || 'N/A'}`);
      console.log('');
    } else {
      console.log('ℹ️  Nessuna subscription trovata (verrà creata al primo checkout)');
      console.log('');
    }

  } catch (error) {
    console.error('❌ ERRORE:', error.message);
    process.exit(1);
  }
}

getUserInfo();
