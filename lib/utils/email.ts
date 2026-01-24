/**
 * Email utility using Resend
 * Sends transactional emails via Resend API
 */

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

/**
 * Send email via Resend
 */
export async function sendEmail(options: SendEmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn('[EMAIL] RESEND_API_KEY not configured, email not sent');
    return {
      success: false,
      error: 'RESEND_API_KEY not configured',
    };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: options.from || process.env.RESEND_FROM_EMAIL || 'PropertyPilot AI <noreply@propertypilot.ai>',
        to: options.to,
        subject: options.subject,
        html: options.html,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Resend API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      success: true,
      messageId: data.id,
    };

  } catch (error: any) {
    console.error('[EMAIL] Error sending email:', error);
    return {
      success: false,
      error: error.message || 'Unknown error',
    };
  }
}

/**
 * Generate HTML email template for appointment notification
 */
export function generateAppointmentNotificationEmail(listing: {
  title: string;
  location: string;
  price?: number | null;
  source_url: string;
  owner_name?: string | null;
  phone_number?: string | null;
  ai_summary?: any;
}): string {
  const priceFormatted = listing.price 
    ? new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(listing.price)
    : 'Prezzo non disponibile';

  const qualityScore = listing.ai_summary?.quality_score || 'N/A';
  const summaryNote = listing.ai_summary?.summary_note || 'Nessuna nota disponibile';
  const bestTimeToCall = listing.ai_summary?.best_time_to_call || 'Non specificato';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🎯 TOP DEAL - Appuntamento Fissato</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background: #0a0a0a;">
  <div style="background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f59e0b 100%); padding: 40px; text-align: center; border-radius: 12px 12px 0 0; box-shadow: 0 10px 40px rgba(139, 92, 246, 0.3);">
    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 10px rgba(0,0,0,0.3);">🔥 TOP DEAL - Appuntamento Fissato</h1>
    <p style="color: rgba(255,255,255,0.95); margin: 10px 0 0 0; font-size: 16px; font-weight: 500;">La tua AI ha chiuso un affare d'oro</p>
  </div>
  
  <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 35px; border-radius: 0 0 12px 12px; border: 1px solid #3a3a3a; box-shadow: 0 10px 40px rgba(0,0,0,0.5);">
    <p style="font-size: 17px; margin-bottom: 25px; color: #e5e7eb; font-weight: 500;">
      🎯 <strong style="color: #f59e0b;">Eccellente lavoro!</strong> La chiamata AI Voice Agent ha avuto successo e un appuntamento è stato fissato per questo immobile premium:
    </p>
    
    <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 25px; border-radius: 10px; margin-bottom: 25px; border-left: 5px solid #f59e0b; box-shadow: 0 4px 20px rgba(245, 158, 11, 0.2);">
      <h2 style="margin-top: 0; color: #fbbf24; font-size: 22px; font-weight: 700; text-shadow: 0 2px 10px rgba(245, 158, 11, 0.3);">${listing.title}</h2>
      <p style="margin: 12px 0; color: #cbd5e1; font-size: 15px;">
        <strong style="color: #f59e0b;">📍 Location:</strong> <span style="color: #e5e7eb;">${listing.location}</span>
      </p>
      <p style="margin: 12px 0; color: #cbd5e1; font-size: 15px;">
        <strong style="color: #f59e0b;">💰 Prezzo:</strong> <span style="color: #10b981; font-weight: 600; font-size: 16px;">${priceFormatted}</span>
      </p>
      ${listing.owner_name ? `
      <p style="margin: 12px 0; color: #cbd5e1; font-size: 15px;">
        <strong style="color: #f59e0b;">👤 Proprietario:</strong> <span style="color: #e5e7eb;">${listing.owner_name}</span>
      </p>
      ` : ''}
      ${listing.phone_number ? `
      <p style="margin: 12px 0; color: #cbd5e1; font-size: 15px;">
        <strong style="color: #f59e0b;">📞 Telefono:</strong> <span style="color: #10b981; font-weight: 600;">${listing.phone_number}</span>
      </p>
      ` : ''}
    </div>

    <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 25px; border-radius: 10px; margin-bottom: 25px; border: 1px solid #3a3a3a;">
      <h3 style="margin-top: 0; color: #8b5cf6; font-size: 20px; font-weight: 700; text-shadow: 0 2px 10px rgba(139, 92, 246, 0.3);">🤖 Analisi AI Premium</h3>
      <p style="margin: 12px 0; color: #cbd5e1; font-size: 15px;">
        <strong style="color: #8b5cf6;">Quality Score:</strong> <span style="color: #10b981; font-weight: 600; font-size: 16px;">${qualityScore}/100</span>
      </p>
      <p style="margin: 12px 0; color: #cbd5e1; font-size: 15px;">
        <strong style="color: #8b5cf6;">Nota Strategica:</strong> <span style="color: #e5e7eb;">${summaryNote}</span>
      </p>
      <p style="margin: 12px 0; color: #cbd5e1; font-size: 15px;">
        <strong style="color: #8b5cf6;">⏰ Orario Ottimale:</strong> <span style="color: #f59e0b; font-weight: 600;">${bestTimeToCall}</span>
      </p>
    </div>

    <div style="text-align: center; margin-top: 35px;">
      <a href="${listing.source_url}" 
         style="display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4); transition: transform 0.2s;">
        🚀 Vedi Annuncio Completo
      </a>
    </div>

    <p style="margin-top: 35px; font-size: 14px; color: #6b7280; text-align: center; border-top: 1px solid #3a3a3a; padding-top: 20px;">
      <strong style="color: #8b5cf6;">PropertyPilot AI</strong> - Real Estate Automation Platform Elite<br>
      <span style="color: #9ca3af;">Il tuo arsenale AI per chiudere affari d'oro</span>
    </p>
  </div>
</body>
</html>
  `.trim();
}

