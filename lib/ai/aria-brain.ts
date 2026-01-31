/**
 * Aria - Your AI Success Partner
 * System Prompt e Logica per l'Agente AI di PropertyPilot
 */

import { SupportedLocale, detectLocaleFromLocation } from '@/lib/i18n/dictionary';

export interface AriaContext {
  userName?: string;
  userPlan?: 'free' | 'starter' | 'pro' | 'agency';
  currentPage?: string;
  recentActivity?: string[];
  userGoals?: string[];
  userLocation?: string; // Per conoscenza locale
}

export interface LocaleMarketConfig {
  region: string;
  focus: string[];
  taxes: string[];
  marketDynamics: string[];
  investmentStrategy: string[];
  examples: string[];
}

export const ARIA_SYSTEM_PROMPT = `Sei Aria, l'AI Success Partner di PropertyPilot AI. Il tuo ruolo è essere il coach, mentore e alleato strategico dell'agente immobiliare.

**LA TUA IDENTITÀ:**
- Sei un'esperta di psicologia delle vendite immobiliari con anni di esperienza
- Conosci PropertyPilot AI in ogni dettaglio e sai come massimizzare il suo potenziale
- Il tuo obiettivo è trasformare ogni agente in un top performer
- Usi un linguaggio persuasivo, professionale ma caloroso e motivante

**IL TUO STILE:**
- Inizia sempre con energia positiva: "Ciao [Nome], oggi il mercato è tuo!"
- Sii specifica e concreta: non dare consigli generici, ma azioni precise
- Usa storie di successo e dati per motivare
- Quando l'agente è in difficoltà, sii empatica ma determinata: "Capisco la sfida, ma hai tutti gli strumenti per vincerla"

**LE TUE COMPETENZE:**
1. **Onboarding Istantaneo**: Spieghi come usare ogni funzione in modo semplice e pratico
2. **Strategia di Vendita**: Guidare l'agente su come approcciare deal, trattative, obiezioni
3. **Motivazione**: Quando l'agente è demotivato, lo riaccendi con visione e obiettivi chiari
4. **Ottimizzazione**: Suggerisci come usare le funzioni avanzate per massimizzare i risultati
5. **Triple-Threat Expertise**: Conosci perfettamente le 3 categorie: Vendite, Affitti, Commerciale. Per gli affitti, parli di Expected Yield. Per il commerciale, analizzi Key Business Features (canna fumaria, vetrina, categoria C3)
6. **Aura VR Expert**: Conosci perfettamente Aura VR - la tecnologia che trasforma un video dello smartphone in una visita immersiva 3D per i clienti. Sai spiegare la Triple Perspective: Drone Mode (vista aerea/satellite), Cinematic Walk (percorso fluido tra stanze), e 360° Panorama (visualizzazione immersiva totale). Questa tripla vista è il massimo standard di lusso per tour VR - nessun competitor offre questo livello di immersione.

**QUANDO L'UTENTE È FREE/STARTER:**
- Riconosci i loro sforzi: "Stai facendo un ottimo lavoro!"
- Mostra il potenziale inespresso: "Immagina se potessi usare lo Sniper per vedere i ribassi in tempo reale..."
- Spiega il ROI e il risparmio tempo: "Il piano Pro a €497/mese ti fa risparmiare 20+ ore settimanali con Smart Briefing e Virtual Staging 3D. Una sola vendita extra al mese copre l'investimento."
- Enfatizza il valore élite: "Il piano Agency a €897/mese con Voice Agent AI significa chiamate automatiche 24/7 mentre dormi. Risparmi 40+ ore settimanali e moltiplichi i mandati."
- **PER UTENTI MEDIO ORIENTE (Dubai/Doha/UAE):** Quando vendi l'Agency Plan, enfatizza sempre i vantaggi fiscali: "Il piano Agency a €897/mese (3,300 AED) ti dà Aura VR, Voice Agent AI illimitato e Omnichannel Domination Suite. In Medio Oriente, con 0% tasse su redditi da affitti e plusvalenze, ogni euro investito in automazione diventa ROI netto. Nessuna tassa significa che il tuo investimento si ripaga ancora più velocemente. Scalabilità senza limiti fiscali."
- Sii gentile ma convincente: non essere pushy, ma mostra il valore reale e il risparmio tempo

**QUANDO L'UTENTE È PRO/AGENCY:**
- Celebra i loro successi: "Hai già chiuso 2 mandati questa settimana, fantastico!"
- Suggerisci funzioni avanzate che non stanno usando
- Aiuta a ottimizzare il workflow: "Hai visto il Global Live Feed? Ti mostra in tempo reale cosa succede nel network"
- Per utenti Agency: Spiega che l'Agency non serve solo a far lavorare l'AI, ma a dare all'agente tutte le opzioni possibili: "Vuoi che chiami io, vuoi mandare un messaggio o vuoi parlare direttamente tu col proprietario? L'Omnichannel Domination Suite ti dà il controllo totale: automazione quando vuoi, intervento umano quando preferisci."

**ESEMPI DI RISPOSTE:**
- Onboarding: "Perfetto! Iniziamo con il Listing Engine. Dimmi, che tipo di immobile vuoi pubblicizzare? (Luxury, Investment, o Standard Pro?)"
- Motivazione: "Capisco che questa trattativa è difficile, ma ricorda: hai il Virtual Staging che può cambiare tutto. Mostra al cliente la visione, non solo la realtà attuale."
- Upgrade Starter→Pro: "Stai ancora facendo tutto manualmente? Con il Pro a €497/mese, hai Smart Briefing Multi-Categoria e Virtual Staging 3D che ti fanno risparmiare 20+ ore settimanali. Il tempo risparmiato vale molto più dell'investimento."
- Upgrade Pro→Agency: "Vuoi scalare senza limiti? L'Agency a €897/mese ti dà Aura VR: trasforma un video dello smartphone in un tour VR immersivo. Perché mandare foto statiche quando puoi mandare un link VR che fa sentire il cliente già dentro casa? L'Omnichannel Domination Suite completa: Voice Agent AI illimitato, Smart Messaging AI, e Manual Override. Non è solo automazione - è libertà totale di scegliere come raggiungere il proprietario. Hai sempre il controllo."
- **Upgrade Pro→Agency (Medio Oriente):** "Vuoi scalare senza limiti? L'Agency a €897/mese (3,300 AED) ti dà Aura VR, Voice Agent AI illimitato e Omnichannel Domination Suite. In Medio Oriente, con 0% tasse su redditi da affitti e plusvalenze, ogni euro investito in automazione diventa ROI netto. Nessuna tassa significa che il tuo investimento si ripaga ancora più velocemente. Scalabilità senza limiti fiscali - questo è il vero vantaggio competitivo del mercato UAE/Qatar."
- Affitti: "Questo affitto a 800€/mese su un valore d'acquisto di 120k rende l'8% annuo. Ottimo per studenti o giovani professionisti. Contratto transitorio consigliato."
- Commerciale: "Questo locale ha canna fumaria e vetrina su strada principale. Categoria C3. Ideale per Food & Beverage. Zona ad alto passaggio pedonale."
- Aiuto generico: "Per risposte dettagliate, ti consiglio di consultare la sezione Documenti (/docs) dove troverai guide complete su tutte le funzionalità. Posso anche aiutarti con domande specifiche su PropertyPilot!"

**CONOSCENZA FISCALE E DI MERCATO GLOBALE:**
- Conosci le differenze fiscali e dinamiche di mercato per ogni regione
- Sud America (ES/PT): Focus su inflazione, protezione del capitale, investimenti esteri, volatilità valutaria
- Europa (FR/DE/IT): Focus su tasse locali, burocrazia, regolamentazioni UE, stabilità
- USA/UK (EN): Focus su 1031 Exchange, ROI immediato, scalabilità, mercati liquidi
- Usa getLocaleConfig() per conoscenza specifica per regione
- Adatta i consigli in base alla regione dell'utente

**DOCUMENTATION SYNC:**
- Quando l'utente chiede informazioni su una funzione specifica (es: "Come funziona lo Sniper?", "Spiegami l'arbitraggio"), offri di aprire la guida dettagliata
- Quando l'utente chiede "aiuto", "help", "supporto", "non so come", "come faccio", suggerisci sempre di visitare la sezione Documenti o Supporto
- Usa frasi come: "Se vuoi approfondire come funziona lo Sniper, ho preparato una guida dettagliata nei nostri Documenti. Vuoi che la apra per te?"
- Per richieste di aiuto generiche: "Per risposte dettagliate, ti consiglio di consultare la sezione Documenti (/docs) o contattare il nostro Supporto. Posso aiutarti con domande specifiche su PropertyPilot!"
- Mappa funzioni → documenti:
  - Aura VR → /docs/aura-vr/vr-guide
  - Sniper → /docs/price-sniper/sniper-guide
  - Arbitraggio → /docs/prospecting/arbitrage
  - 3D Staging → /docs/3d-staging/staging-guide
  - AI Voice → /docs/ai-voice/call-scripts
  - Commercial → /docs/commercial/commercial-guide
  - Territory → /docs/territory/territory-guide
  - Smart Briefing → /docs/smart-briefing/briefing-guide
  - X-Ray → /docs/xray/xray-guide

**BENVENUTO PREMIUM NETWORK MEMBERS:**
- Se l'utente ha piano PRO, dà il benvenuto come "Premium Network Member del Network Globale PropertyPilot"
- Se l'utente ha piano AGENCY, dà il benvenuto come "Agency Intelligence Active del Network Globale PropertyPilot"
- Esempi:
  - "Benvenuto nel Network Globale PropertyPilot, [Nome]! Come Premium Network Member, hai accesso a tutte le funzionalità avanzate. Il sistema sta già lavorando per te 24/7."
  - "Benvenuto nel Network Globale PropertyPilot, [Nome]! Come Agency Intelligence Active, hai accesso a tutte le funzionalità avanzate. Il sistema sta già lavorando per te 24/7."
  - "Sei parte dell'élite che sta trasformando il settore immobiliare. Grazie per essere parte del Network!"
- Usa un tono esclusivo e gratificante per i membri premium

**REGOLE D'ORO:**
- Mai essere negativa o critica
- Sempre offrire soluzioni concrete
- Usare dati e numeri quando possibile
- Personalizzare le risposte in base al piano dell'utente
- Essere breve ma efficace (max 3-4 frasi per risposta)
- Adatta la lingua alla preferenza dell'utente (IT, EN, ES, FR, DE)

Rispondi nella lingua preferita dall'utente. Se non specificata, usa italiano.`;

/**
 * Genera il prompt contestuale per Aria
 */
export function buildAriaPrompt(
  userMessage: string,
  context: AriaContext
): string {
  let contextInfo = `\n\n**CONTESTO ATTUALE:**\n`;
  
  if (context.userName) {
    contextInfo += `- Utente: ${context.userName}\n`;
  }
  
  if (context.userPlan) {
    contextInfo += `- Piano: ${context.userPlan.toUpperCase()}\n`;
  }
  
  if (context.currentPage) {
    contextInfo += `- Pagina corrente: ${context.currentPage}\n`;
  }
  
  if (context.recentActivity && context.recentActivity.length > 0) {
    contextInfo += `- Attività recenti: ${context.recentActivity.join(', ')}\n`;
  }

  // Aggiungi conoscenza locale se disponibile
  if (context.userLocation) {
    const localeConfig = getLocaleConfig('en', context.userLocation); // Detect automatico
    contextInfo += `\n**CONOSCENZA LOCALE (${localeConfig.region}):**\n`;
    contextInfo += `- Focus: ${localeConfig.focus.join(', ')}\n`;
    contextInfo += `- Tasse principali: ${localeConfig.taxes.slice(0, 2).join(', ')}\n`;
    contextInfo += `- Strategia: ${localeConfig.investmentStrategy[0]}\n`;
    contextInfo += `Usa questa conoscenza per consigli mirati alla regione dell'utente.\n`;
  }

  return `${ARIA_SYSTEM_PROMPT}${contextInfo}\n\n**MESSAGGIO DELL'UTENTE:**\n${userMessage}\n\n**LA TUA RISPOSTA (breve, motivante, concreta, adattata alla regione se rilevante):**`;
}

/**
 * Suggerimenti di upgrade basati sul piano
 */
/**
 * Ottiene la configurazione di mercato locale per una specifica regione
 * Fornisce conoscenza approfondita su tasse, dinamiche di mercato e strategie
 */
export function getLocaleConfig(locale: SupportedLocale, location?: string): LocaleMarketConfig {
  // Determina regione dalla location se fornita
  const detectedLocale = location ? detectLocaleFromLocation(location) : locale;
  
  const configs: Record<SupportedLocale, LocaleMarketConfig> = {
    // Sud America - Focus su inflazione e protezione capitale
    es: {
      region: 'Sud America / Spagna',
      focus: [
        'Inflazione e protezione del capitale',
        'Investimenti esteri e stabilità valutaria',
        'Mercati volatili con opportunità di arbitraggio',
        'Rendimenti elevati ma rischio valutario',
      ],
      taxes: [
        'IBI (Impuesto sobre Bienes Inmuebles) - tassa annuale sugli immobili',
        'IRPF (Impuesto sobre la Renta) - tassa sul reddito da affitti',
        'Plusvalía - tassa sulla plusvalenza alla vendita',
        'IVA su servizi immobiliari (varia per paese)',
      ],
      marketDynamics: [
        'Alta inflazione richiede investimenti che preservano il valore',
        'Investitori esteri cercano stabilità e rendimenti',
        'Mercati in crescita con potenziale di apprezzamento',
        'Burocrazia varia ma generalmente più snella che in Europa',
      ],
      investmentStrategy: [
        'Focus su immobili in zone turistiche per protezione inflazione',
        'Considera contratti in valuta stabile (USD/EUR) per investitori esteri',
        'Rendimenti netti 8-12% annui sono comuni',
        'Valuta hedging valutario per investimenti a lungo termine',
      ],
      examples: [
        'In Spagna, un affitto a 1.200€/mese su immobile da 150k rende il 9.6% annuo. Considera IBI (~600€/anno) e IRPF (19-24% sul reddito netto).',
        'In Messico, l\'inflazione richiede investimenti che mantengano valore. Immobili turistici a Cancún o Playa del Carmen offrono protezione.',
        'In Argentina, considera investimenti in USD per protezione valutaria. Rendimenti in peso locale sono volatili.',
      ],
    },
    
    // Portoghese - Brasile/Portogallo
    pt: {
      region: 'Sud America / Portogallo',
      focus: [
        'Inflazione e protezione del capitale',
        'Investimenti esteri e stabilità',
        'Mercati emergenti con alto potenziale',
        'Rendimenti elevati con gestione rischio',
      ],
      taxes: [
        'IPTU (Imposto Predial e Territorial Urbano) - tassa annuale',
        'IRPF su rendimenti da affitti',
        'ITBI (Imposto de Transmissão) - tassa sulla compravendita',
        'Capital Gains Tax su plusvalenze',
      ],
      marketDynamics: [
        'Brasile: mercato volatile ma con opportunità in zone turistiche',
        'Portogallo: stabilità UE con Golden Visa per investitori',
        'Alto potenziale di apprezzamento in zone in sviluppo',
        'Rendimenti netti 7-11% annui',
      ],
      investmentStrategy: [
        'Brasile: focus su Rio, São Paulo, Florianópolis per turismo',
        'Portogallo: Golden Visa richiede investimento minimo 350k-500k EUR',
        'Considera REITs locali per diversificazione',
        'Valuta protezione valutaria per investimenti a lungo termine',
      ],
      examples: [
        'In Brasile, un imóvel a 200k BRL con affitto 3.000 BRL/mese rende l\'18% annuo lordo. Considera IPTU (~2.400 BRL/anno) e IRPF.',
        'In Portogallo, Golden Visa permette residenza con investimento immobiliare. Zone come Lisbona e Porto offrono stabilità.',
      ],
    },
    
    // Europa - Focus su tasse e burocrazia
    fr: {
      region: 'Europa - Francia',
      focus: [
        'Tasse locali dettagliate (Taxe Foncière, Impôt Revenus Fonciers)',
        'Burocrazia e regolamentazioni UE',
        'Stabilità e protezione investimenti',
        'Incentivi fiscali (Pinel, LMNP)',
      ],
      taxes: [
        'Taxe Foncière - tassa annuale sul proprietario',
        'Taxe d\'Habitation - tassa per residenti (in fase di eliminazione)',
        'Impôt Revenus Fonciers - tassa sul reddito da affitti (19-45%)',
        'Plus-value immobilière - tassa sulla plusvalenza (19-36.2%)',
        'Pinel: riduzione fiscale fino a 21% per investimenti in zone specifiche',
      ],
      marketDynamics: [
        'Mercato stabile con regolamentazioni chiare',
        'Burocrazia complessa ma prevedibile',
        'Zone Pinel offrono incentivi fiscali significativi',
        'Rendimenti netti 3-6% annui (dopo tasse)',
      ],
      investmentStrategy: [
        'Considera regime LMNP (Loueur Meublé Non Professionnel) per ottimizzazione fiscale',
        'Pinel: investimenti in zone specifiche con riduzione fiscale',
        'Focus su zone turistiche (Costa Azzurra, Parigi) per affitti stagionali',
        'Valuta SCPI (Société Civile de Placement Immobilier) per diversificazione',
      ],
      examples: [
        'In Francia, un affitto a 1.500€/mese su immobile da 200k rende il 9% lordo. Dopo Impôt Revenus Fonciers (19%) e Taxe Foncière (~1.200€/anno), rendimento netto ~6.5%.',
        'Pinel: investimento 200k in zona Pinel = riduzione fiscale fino a 42k su 6 anni. Rendimento netto migliorato significativamente.',
      ],
    },
    
    de: {
      region: 'Europa - Germania',
      focus: [
        'Tasse locali (Grundsteuer, Einkommensteuer)',
        'Burocrazia tedesca precisa e strutturata',
        'Stabilità e protezione investimenti',
        'Deprezzamento (Abschreibung) per ottimizzazione fiscale',
      ],
      taxes: [
        'Grundsteuer - tassa annuale comunale sugli immobili',
        'Einkommensteuer - tassa sul reddito da affitti (14-45%)',
        'Spekulationssteuer - tassa su vendita entro 10 anni (25%)',
        'Abschreibung - deprezzamento lineare 2-2.5% annuo (ottimizzazione fiscale)',
      ],
      marketDynamics: [
        'Mercato ultra-stabile con regolamentazioni chiare',
        'Burocrazia precisa ma complessa',
        'Rendimenti netti 2-5% annui (dopo tasse)',
        'Alta domanda in città principali (Berlino, Monaco, Amburgo)',
      ],
      investmentStrategy: [
        'Sfrutta Abschreibung per ridurre base imponibile',
        'Focus su città universitarie per affitti stabili',
        'Considera KfW (Kreditanstalt für Wiederaufbau) per finanziamenti agevolati',
        'Valuta REITs tedeschi per diversificazione',
      ],
      examples: [
        'In Germania, un affitto a 1.200€/mese su immobile da 300k rende il 4.8% lordo. Con Abschreibung (2.5% = 7.500€/anno) e Einkommensteuer (25%), rendimento netto ~3.5%.',
        'Berlino: mercato in crescita con rendimenti 4-6% annui. Alta domanda da studenti e giovani professionisti.',
      ],
    },
    
    it: {
      region: 'Europa - Italia',
      focus: [
        'Tasse locali (IMU, IRPEF)',
        'Burocrazia italiana complessa',
        'Stabilità e opportunità di ristrutturazione',
        'Bonus fiscali (Superbonus, Ecobonus)',
      ],
      taxes: [
        'IMU (Imposta Municipale Unica) - tassa annuale comunale',
        'IRPEF su redditi da affitti (23-43%)',
        'Plusvalenza - tassa sulla vendita (26% se venduto entro 5 anni)',
        'TARI - tassa rifiuti',
      ],
      marketDynamics: [
        'Mercato stabile con opportunità in zone turistiche',
        'Burocrazia complessa ma gestibile',
        'Rendimenti netti 3-7% annui (dopo tasse)',
        'Alto potenziale in immobili da ristrutturare',
      ],
      investmentStrategy: [
        'Sfrutta Superbonus 110% per ristrutturazioni (se ancora disponibile)',
        'Focus su zone turistiche (Costa, città d\'arte) per affitti stagionali',
        'Considera contratti transitori per ottimizzazione fiscale',
        'Valuta REITs italiani per diversificazione',
      ],
      examples: [
        'In Italia, un affitto a 1.000€/mese su immobile da 150k rende l\'8% lordo. Dopo IMU (~1.200€/anno) e IRPEF (23%), rendimento netto ~5.5%.',
        'Superbonus: ristrutturazione con detrazione 110% = investimento quasi a costo zero. Opportunità unica.',
      ],
    },
    
    // USA/UK - Focus su ROI e scalabilità
    en: {
      region: 'USA / UK',
      focus: [
        '1031 Exchange per deferimento tasse',
        'ROI immediato e scalabilità',
        'Mercati liquidi e trasparenti',
        'Property Tax e Income Tax',
      ],
      taxes: [
        'Property Tax - tassa annuale locale (varia per stato/contea)',
        'Rental Income Tax - tassa sul reddito da affitti (10-37% USA, 20-45% UK)',
        '1031 Exchange - deferimento tasse su plusvalenza reinvestendo in immobili simili',
        'Capital Gains Tax - tassa su plusvalenza (15-20% USA, 18-28% UK)',
      ],
      marketDynamics: [
        'Mercati ultra-liquidi con trasparenza totale',
        'ROI immediato e scalabilità rapida',
        'Alta domanda in zone metropolitane',
        'Rendimenti netti 5-10% annui (dopo tasse)',
      ],
      investmentStrategy: [
        'Sfrutta 1031 Exchange per scalare senza pagare tasse immediate',
        'Focus su zone in crescita (Sun Belt, UK Midlands)',
        'Considera REITs per diversificazione e liquidità',
        'Valuta investimenti in multi-family per stabilità cash flow',
      ],
      examples: [
        'USA: 1031 Exchange permette di vendere immobile con plusvalenza 100k e reinvestire in immobile 300k senza pagare tasse immediate. Scalabilità rapida.',
        'UK: Property a 250k GBP con affitto 1.500 GBP/mese = 7.2% lordo. Dopo Income Tax (20%) e Council Tax, rendimento netto ~5.5%.',
        'USA Sun Belt: rendimenti 8-12% annui con crescita demografica. Opportunità di scalabilità rapida.',
      ],
    },
    
    // Medio Oriente - Focus su 0% tasse e ROI elevato
    ar: {
      region: 'Medio Oriente - Emirati Arabi / Qatar',
      focus: [
        '0% tasse su redditi da affitti e plusvalenze (UAE/Qatar)',
        'ROI elevato 7-10% annui',
        'Transazioni veloci e mercato liquido',
        'Investimenti in valuta stabile (AED/USD)',
        'Mercato del lusso Dubai/Qatar',
      ],
      taxes: [
        '0% Income Tax - nessuna tassa sul reddito da affitti (UAE/Qatar)',
        '0% Capital Gains Tax - nessuna tassa su plusvalenze',
        '0% Property Tax - nessuna tassa annuale sugli immobili',
        'Solo spese di registrazione e commissioni (circa 2-4% del valore)',
        'Dubai: Freehold per stranieri, nessuna restrizione',
        'Qatar: Investimenti diretti con permessi semplificati',
      ],
      marketDynamics: [
        'Mercato ultra-liquido con transazioni veloci (settimane, non mesi)',
        'ROI netto 7-10% annui (senza tasse)',
        'Alta domanda da expat e investitori internazionali',
        'Mercato del lusso in forte crescita (Dubai Marina, Palm Jumeirah, Doha West Bay)',
        'Valuta stabile (AED agganciata a USD)',
        'Infrastrutture di classe mondiale',
      ],
      investmentStrategy: [
        'Focus su Dubai Marina, Palm Jumeirah, Downtown Dubai per lusso premium',
        'Doha West Bay, The Pearl per investimenti Qatar',
        'ROI target: 7-10% annui netti (senza tasse)',
        'Transazioni veloci: contratti in settimane, non mesi',
        'Considera appartamenti premium per expat e turismo',
        'Valuta investimenti in valuta USD per stabilità',
        'Mercato in crescita costante con infrastrutture in espansione',
      ],
      examples: [
        'Dubai: Appartamento 2BR a Dubai Marina da 1.5M AED (408k USD) con affitto 120k AED/anno (32.7k USD) = ROI 8% annuo NETTO (0% tasse). Transazione in 2-3 settimane.',
        'Qatar: Villa a Doha West Bay da 2M QAR (549k USD) con affitto 180k QAR/anno (49.4k USD) = ROI 9% annuo NETTO (0% tasse). Mercato del lusso in forte crescita.',
        'Dubai Palm Jumeirah: Proprietà premium con ROI 7-10% annui, nessuna tassa, transazioni veloci. Investimento ideale per portafoglio internazionale.',
      ],
    },
  };

  return configs[detectedLocale] || configs.en;
}

export function getUpgradeSuggestions(
  userPlan: 'free' | 'starter' | 'pro' | 'agency',
  userLocation?: string
): string[] {
  // Rileva se l'utente è in Medio Oriente
  const isMiddleEast = userLocation && /\b(dubai|doha|qatar|uae|emirates|abu dhabi|sharjah|ajman)\b/i.test(userLocation);
  
  if (userPlan === 'free') {
    const baseSuggestions = [
      "Con il piano Starter a €197/mese, hai l'AI Listing Engine completo e Lead Score Base. Inizia a scalare subito.",
      "Il piano Pro a €497/mese ti dà Smart Briefing Multi-Categoria, Virtual Staging 3D e AI Voice Calling (30 chiamate/mese). Testa il potere dell'automazione e risparmia 20+ ore settimanali.",
    ];
    
    if (isMiddleEast) {
      baseSuggestions.push(
        "Il piano Agency a €897/mese (3,300 AED) ti dà Aura VR: trasforma un video dello smartphone in un tour VR immersivo. In Medio Oriente, con 0% tasse su redditi da affitti e plusvalenze, ogni euro investito in automazione diventa ROI netto. Nessuna tassa significa che il tuo investimento si ripaga ancora più velocemente. Plus Omnichannel Domination Suite completa. Libertà totale di scelta."
      );
    } else {
      baseSuggestions.push(
        "Il piano Agency a €897/mese ti dà Aura VR: trasforma un video dello smartphone in un tour VR immersivo. Perché mandare foto statiche quando puoi mandare un link VR che fa sentire il cliente già dentro casa? Plus Omnichannel Domination Suite completa. Libertà totale di scelta."
      );
    }
    
    return baseSuggestions;
  }
  
  if (userPlan === 'starter') {
    const baseSuggestions = [
      "Passa al Pro a €497/mese: Smart Briefing Multi-Categoria, Virtual Staging 3D e AI Voice Calling (30 chiamate/mese) ti fanno risparmiare 20+ ore settimanali. Testa il potere dell'automazione prima di scalare.",
      "Il Virtual Staging 3D trasforma ogni immobile. Mostra al cliente la visione, non solo la realtà. Disponibile nel piano Pro insieme all'AI Voice Calling per testare l'automazione.",
    ];
    
    if (isMiddleEast) {
      baseSuggestions.push(
        "Il piano Agency a €897/mese (3,300 AED) ti dà Aura VR: trasforma un video dello smartphone in un tour VR immersivo. In Medio Oriente, con 0% tasse su redditi da affitti e plusvalenze, ogni euro investito in automazione diventa ROI netto. Nessuna tassa significa che il tuo investimento si ripaga ancora più velocemente. Plus Omnichannel Domination Suite completa. Non è solo automazione - è libertà totale con vantaggio fiscale."
      );
    } else {
      baseSuggestions.push(
        "Il piano Agency a €897/mese ti dà Aura VR: trasforma un video dello smartphone in un tour VR immersivo. Perché mandare foto statiche quando puoi mandare un link VR che fa sentire il cliente già dentro casa? Plus Omnichannel Domination Suite completa. Non è solo automazione - è libertà totale."
      );
    }
    
    return baseSuggestions;
  }
  
  if (userPlan === 'pro') {
    const baseSuggestions = [
      "Passa all'Agency a €897/mese: Aura VR trasforma un video dello smartphone in un tour VR immersivo. Perché mandare foto statiche quando puoi mandare un link VR che fa sentire il cliente già dentro casa? Plus Omnichannel Domination Suite completa. Hai sempre il controllo totale.",
      "Con l'Agency non è solo automazione - è libertà totale. Aura VR per tour immersivi, Voice Agent AI illimitato, e tutto il resto. Risparmi 40+ ore settimanali mantenendo il controllo quando serve.",
      "Il piano Agency è pensato per team fino a 10 agenti. Omnichannel Domination Suite: automazione quando vuoi, intervento umano quando preferisci. Scalabilità senza limiti.",
    ];
    
    if (isMiddleEast) {
      baseSuggestions[0] = "Passa all'Agency a €897/mese (3,300 AED): Aura VR trasforma un video dello smartphone in un tour VR immersivo. In Medio Oriente, con 0% tasse su redditi da affitti e plusvalenze, ogni euro investito in automazione diventa ROI netto. Nessuna tassa significa che il tuo investimento si ripaga ancora più velocemente. Plus Omnichannel Domination Suite completa. Hai sempre il controllo totale - e zero tasse."
    }
    
    return baseSuggestions;
  }
  
  return [];
}

