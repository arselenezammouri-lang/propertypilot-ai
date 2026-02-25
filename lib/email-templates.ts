const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://propertypilot-ai.vercel.app';

export const emailTemplates = {
  welcome: (userName: string) => ({
    subject: "🏠 Benvenuto in PropertyPilot AI - Il Tuo Copilota Immobiliare",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#050505;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:linear-gradient(135deg,#0a0a0a 0%,#1a1a2e 100%);border-radius:16px;overflow:hidden;">
    
    <div style="background:linear-gradient(135deg,#9333ea 0%,#06b6d4 100%);padding:40px 30px;text-align:center;">
      <h1 style="margin:0;color:#fff;font-size:28px;font-weight:800;">PropertyPilot AI</h1>
      <p style="margin:10px 0 0;color:rgba(255,255,255,0.9);font-size:14px;">Pilot Your Agency to the Next Level</p>
    </div>
    
    <div style="padding:40px 30px;">
      <h2 style="color:#fff;font-size:24px;margin:0 0 20px;">Ciao ${userName}! 👋</h2>
      
      <p style="color:#a1a1aa;font-size:16px;line-height:1.6;margin:0 0 24px;">
        Benvenuto nella piattaforma AI più avanzata per il real estate italiano. Sei pronto a trasformare il modo in cui crei annunci immobiliari?
      </p>
      
      <div style="background:rgba(147,51,234,0.1);border-left:4px solid #9333ea;padding:20px;border-radius:8px;margin:0 0 24px;">
        <h3 style="color:#fff;margin:0 0 12px;font-size:18px;">🚀 I tuoi primi passi:</h3>
        <ul style="color:#a1a1aa;margin:0;padding-left:20px;line-height:1.8;">
          <li><strong style="color:#fff;">Genera il tuo primo annuncio</strong> - Usa l'AI per creare descrizioni professionali</li>
          <li><strong style="color:#fff;">Esplora i titoli A/B</strong> - Crea titoli ad alto CTR in un click</li>
          <li><strong style="color:#fff;">Prova l'Audit AI</strong> - Analizza e migliora i tuoi annunci esistenti</li>
        </ul>
      </div>
      
      <a href="${APP_URL}/dashboard" style="display:inline-block;background:linear-gradient(135deg,#9333ea 0%,#06b6d4 100%);color:#fff;text-decoration:none;padding:16px 32px;border-radius:12px;font-weight:700;font-size:16px;">
        Vai alla Dashboard →
      </a>
      
      <p style="color:#71717a;font-size:14px;margin:32px 0 0;">
        Hai domande? Rispondi a questa email e ti aiuteremo subito.
      </p>
    </div>
    
    <div style="background:rgba(255,255,255,0.05);padding:24px 30px;text-align:center;border-top:1px solid rgba(255,255,255,0.1);">
      <p style="color:#71717a;font-size:12px;margin:0;">
        © 2024 PropertyPilot AI. Tutti i diritti riservati.
      </p>
    </div>
  </div>
</body>
</html>
    `
  }),

  upgradeNudge: (userName: string, currentUsage: number, limit: number) => ({
    subject: "⚡ Hai già usato il 50% del tuo piano - Scopri il ROI del PRO",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#050505;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:linear-gradient(135deg,#0a0a0a 0%,#1a1a2e 100%);border-radius:16px;overflow:hidden;">
    
    <div style="background:linear-gradient(135deg,#f59e0b 0%,#9333ea 100%);padding:40px 30px;text-align:center;">
      <h1 style="margin:0;color:#fff;font-size:28px;font-weight:800;">🎯 Stai Crescendo!</h1>
    </div>
    
    <div style="padding:40px 30px;">
      <h2 style="color:#fff;font-size:22px;margin:0 0 20px;">Ciao ${userName},</h2>
      
      <p style="color:#a1a1aa;font-size:16px;line-height:1.6;margin:0 0 24px;">
        Hai già usato <strong style="color:#f59e0b;">${currentUsage} annunci</strong> dei tuoi ${limit} mensili (50%). Questo significa che stai sfruttando al massimo PropertyPilot AI!
      </p>
      
      <div style="background:linear-gradient(135deg,rgba(245,158,11,0.15) 0%,rgba(147,51,234,0.15) 100%);border:1px solid rgba(245,158,11,0.3);padding:24px;border-radius:12px;margin:0 0 24px;">
        <h3 style="color:#f59e0b;margin:0 0 16px;font-size:20px;">📊 Il ROI del Piano PRO:</h3>
        <ul style="color:#a1a1aa;margin:0;padding-left:20px;line-height:2;">
          <li><strong style="color:#fff;">200 annunci/mese</strong> - 4x rispetto al tuo piano attuale</li>
          <li><strong style="color:#fff;">CRM Completo</strong> - Gestisci tutti i tuoi lead in un posto</li>
          <li><strong style="color:#fff;">Automazioni AI</strong> - Rispondi automaticamente ai lead caldi</li>
          <li><strong style="color:#fff;">Lead Scoring</strong> - Prioritizza chi è pronto a comprare</li>
        </ul>
      </div>
      
      <div style="background:rgba(255,255,255,0.05);padding:20px;border-radius:8px;margin:0 0 24px;text-align:center;">
        <p style="color:#71717a;font-size:14px;margin:0 0 8px;">Risparmio stimato mensile:</p>
        <p style="color:#22c55e;font-size:32px;font-weight:800;margin:0;">€2,500+</p>
        <p style="color:#71717a;font-size:12px;margin:8px 0 0;">basato su ore risparmiate e lead convertiti</p>
      </div>
      
      <a href="${APP_URL}/dashboard/billing" style="display:inline-block;background:linear-gradient(135deg,#f59e0b 0%,#9333ea 100%);color:#fff;text-decoration:none;padding:16px 32px;border-radius:12px;font-weight:700;font-size:16px;">
        Passa a PRO - €497/mese →
      </a>
    </div>
    
    <div style="background:rgba(255,255,255,0.05);padding:24px 30px;text-align:center;border-top:1px solid rgba(255,255,255,0.1);">
      <p style="color:#71717a;font-size:12px;margin:0;">
        © 2024 PropertyPilot AI. Tutti i diritti riservati.
      </p>
    </div>
  </div>
</body>
</html>
    `
  }),

  successStory: (userName: string) => ({
    subject: "🏆 Deal d'Oro: Come gli agenti top usano PropertyPilot AI",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#050505;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:linear-gradient(135deg,#0a0a0a 0%,#1a1a2e 100%);border-radius:16px;overflow:hidden;">
    
    <div style="background:linear-gradient(135deg,#ffd700 0%,#ff6b00 100%);padding:40px 30px;text-align:center;">
      <h1 style="margin:0;color:#000;font-size:28px;font-weight:800;">🏆 Success Stories</h1>
      <p style="margin:10px 0 0;color:rgba(0,0,0,0.7);font-size:14px;">Deal d'Oro da Miami e Milano</p>
    </div>
    
    <div style="padding:40px 30px;">
      <h2 style="color:#fff;font-size:22px;margin:0 0 20px;">Ciao ${userName},</h2>
      
      <p style="color:#a1a1aa;font-size:16px;line-height:1.6;margin:0 0 24px;">
        Vuoi vedere come gli agenti top stanno usando PropertyPilot AI per chiudere deal milionari? Ecco due storie ispiranti:
      </p>
      
      <div style="background:rgba(255,215,0,0.1);border:1px solid rgba(255,215,0,0.3);padding:24px;border-radius:12px;margin:0 0 20px;">
        <div style="display:flex;align-items:center;margin:0 0 12px;">
          <span style="font-size:24px;margin-right:12px;">🌴</span>
          <h3 style="color:#ffd700;margin:0;font-size:18px;">Miami Beach - $4.2M Penthouse</h3>
        </div>
        <p style="color:#a1a1aa;font-size:14px;line-height:1.6;margin:0;">
          "Ho usato il generatore AI per creare 5 varianti del titolo. La versione 'emozionale' ha generato il 340% di click in più su Zillow. Venduto in 12 giorni sopra il prezzo richiesto."
        </p>
        <p style="color:#71717a;font-size:12px;margin:12px 0 0;font-style:italic;">— Marco R., Luxury Agent Miami</p>
      </div>
      
      <div style="background:rgba(147,51,234,0.1);border:1px solid rgba(147,51,234,0.3);padding:24px;border-radius:12px;margin:0 0 24px;">
        <div style="display:flex;align-items:center;margin:0 0 12px;">
          <span style="font-size:24px;margin-right:12px;">🏛️</span>
          <h3 style="color:#9333ea;margin:0;font-size:18px;">Milano Centro - €2.8M Attico</h3>
        </div>
        <p style="color:#a1a1aa;font-size:14px;line-height:1.6;margin:0;">
          "L'Audit AI ha trovato 7 punti deboli nel mio annuncio originale. Dopo le correzioni, le richieste sono triplicate. Il cliente ha firmato il compromesso in 3 settimane."
        </p>
        <p style="color:#71717a;font-size:12px;margin:12px 0 0;font-style:italic;">— Giulia M., RE/MAX Milano</p>
      </div>
      
      <a href="${APP_URL}/dashboard" style="display:inline-block;background:linear-gradient(135deg,#ffd700 0%,#ff6b00 100%);color:#000;text-decoration:none;padding:16px 32px;border-radius:12px;font-weight:700;font-size:16px;">
        Crea il Tuo Annuncio Vincente →
      </a>
    </div>
    
    <div style="background:rgba(255,255,255,0.05);padding:24px 30px;text-align:center;border-top:1px solid rgba(255,255,255,0.1);">
      <p style="color:#71717a;font-size:12px;margin:0;">
        © 2024 PropertyPilot AI. Tutti i diritti riservati.
      </p>
    </div>
  </div>
</body>
</html>
    `
  })
};
