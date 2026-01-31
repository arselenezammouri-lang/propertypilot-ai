import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Carica variabili ambiente da .env.local
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

async function getFirstProfileId() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .order('created_at', { ascending: true })
    .limit(1);

  if (error) {
    console.error('❌ Errore nel recupero del primo profilo:', error.message);
    process.exit(1);
  }

  if (!data || data.length === 0) {
    console.error('❌ Nessun profilo trovato nella tabella profiles.');
    process.exit(1);
  }

  const firstProfile = data[0];
  console.log(firstProfile.id);
}

getFirstProfileId()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Errore fatale:', err);
    process.exit(1);
  });

