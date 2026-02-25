import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/utils/email';
import { z } from 'zod';
import { logger } from '@/lib/utils/safe-logger';

export const dynamic = 'force-dynamic';

const testNotificationSchema = z.object({
  email: z.boolean().optional(),
  whatsapp: z.boolean().optional(),
});

/**
 * POST /api/notifications/test
 * Invia una notifica di prova all'utente
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

    const body = await request.json();
    const validationResult = testNotificationSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Dati non validi', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { email, whatsapp } = validationResult.data;

    // Recupera email utente
    const { data: profile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', user.id)
      .single();

    const userEmail = profile?.email || user.email;

    // Genera messaggio di prova
    const testMessage = generateTestBriefingMessage();

    // Invia email se richiesto
    if (email && userEmail) {
      const emailHtml = generateTestBriefingEmail(testMessage);
      await sendEmail({
        to: userEmail,
        subject: '🔥 PropertyPilot AI - Test Briefing Mattutino',
        html: emailHtml,
      });
    }

    // WhatsApp: in produzione usare API WhatsApp Business
    // Per ora loggiamo solo
    if (whatsapp) {
      logger.debug('[TEST NOTIFICATION] WhatsApp message', { message: testMessage });
      // WhatsApp Business API integration: handled via Twilio or 360dialog
    }

    return NextResponse.json({
      success: true,
      message: 'Notifica di prova inviata',
    });

  } catch (error: any) {
    logger.error('[TEST NOTIFICATION] Error', error as Error, { component: 'test-notification' });
    return NextResponse.json(
      { success: false, error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}

function generateTestBriefingMessage(): string {
  return `🔥 TOP 3 OPPORTUNITÀ DI OGGI

🏠 Villa Moderna Milano - Prezzo -22%
📍 Milano, Via Garibaldi
💰 €850.000
[Link Report PDF]

🏠 Appartamento Centro Roma - Urgenza Alta
📍 Roma, Piazza Navona
💰 €450.000
[Link Report PDF]

🏠 Luxury Condo Miami - Target Investitori
📍 Miami Beach, FL
💰 $1.200.000
[Link Report PDF]

⚡ Questi deal sono stati inviati anche a 12 agenzie partner nella tua zona. Affrettati!

PropertyPilot AI - Il tuo assistente immobiliare 24/7`;
}

function generateTestBriefingEmail(message: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #9333ea 0%, #06b6d4 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
    .listing { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #9333ea; border-radius: 4px; }
    .footer { text-align: center; font-size: 0.8em; color: #777; margin-top: 20px; }
    .fomo { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 4px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔥 PropertyPilot AI</h1>
      <p>Il tuo Briefing Mattutino</p>
    </div>
    <div class="content">
      <h2>TOP 3 OPPORTUNITÀ DI OGGI</h2>
      <div class="listing">
        <h3>🏠 Villa Moderna Milano</h3>
        <p><strong>Prezzo:</strong> -22% vs Mercato</p>
        <p><strong>Location:</strong> Milano, Via Garibaldi</p>
        <p><strong>Prezzo:</strong> €850.000</p>
        <a href="#" style="color: #9333ea;">Vedi Report PDF →</a>
      </div>
      <div class="listing">
        <h3>🏠 Appartamento Centro Roma</h3>
        <p><strong>Urgenza:</strong> Alta</p>
        <p><strong>Location:</strong> Roma, Piazza Navona</p>
        <p><strong>Prezzo:</strong> €450.000</p>
        <a href="#" style="color: #9333ea;">Vedi Report PDF →</a>
      </div>
      <div class="listing">
        <h3>🏠 Luxury Condo Miami</h3>
        <p><strong>Target:</strong> Investitori</p>
        <p><strong>Location:</strong> Miami Beach, FL</p>
        <p><strong>Prezzo:</strong> $1.200.000</p>
        <a href="#" style="color: #9333ea;">Vedi Report PDF →</a>
      </div>
      <div class="fomo">
        <p><strong>⚡ Affrettati!</strong> Questi deal sono stati inviati anche a <strong>12 agenzie partner</strong> nella tua zona.</p>
      </div>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} PropertyPilot AI. Tutti i diritti riservati.</p>
    </div>
  </div>
</body>
</html>
  `;
}

