import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { logger } from '@/lib/utils/safe-logger';
import { getResendClient } from '@/lib/resend-client';
import { withApiSecurity } from '@/lib/utils/api-security';

export const dynamic = 'force-dynamic';

const messages = {
  it: {
    rateLimit: "Troppe richieste. Riprova tra un minuto.",
    sendFailed: "Impossibile inviare il messaggio. Riprova più tardi.",
    success: "Messaggio ricevuto! Ti risponderemo entro 24 ore.",
    serverError: "Errore interno del server",
  },
  en: {
    rateLimit: "Too many requests. Please try again in a minute.",
    sendFailed: "Unable to send message. Please try again later.",
    success: "Message received! We'll respond within 24 hours.",
    serverError: "Internal server error",
  },
} as const;

function getLocaleFromRequest(request: NextRequest): 'it' | 'en' {
  const acceptLanguage = request.headers.get('accept-language') || '';
  const enMatch = acceptLanguage.match(/\ben\b/i);
  return enMatch ? 'en' : 'it';
}

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().max(200).optional(),
  message: z.string().min(10).max(5000)
});

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 60 * 1000;

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIp) {
    return realIp;
  }
  return 'unknown';
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }
  
  if (record.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0 };
  }
  
  record.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX - record.count };
}

const validationErrorsByLocale: Record<'it' | 'en', Record<string, string>> = {
  it: { name: 'Nome troppo corto', email: 'Email non valida', message: 'Messaggio troppo corto (minimo 10 caratteri)' },
  en: { name: 'Name must be at least 2 characters', email: 'Invalid email', message: 'Message must be at least 10 characters' },
};

async function postContact(request: NextRequest) {
  const locale = getLocaleFromRequest(request);
  const msg = messages[locale];

  try {
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(clientIp);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: msg.rateLimit },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'Retry-After': '60'
          }
        }
      );
    }

    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    logger.debug('[Contact Form] New submission', {
      timestamp: new Date().toISOString(),
      messageLength: validatedData.message.length
    });

    // Invia email a supporto tramite Resend
    const toEmail = process.env.CONTACT_EMAIL || process.env.RESEND_FROM_EMAIL || 'support@propertypilot.ai';
    try {
      const { client, fromEmail } = await getResendClient();
      const subject = validatedData.subject
        ? `[PropertyPilot] ${validatedData.subject}`
        : `[PropertyPilot] Messaggio da ${validatedData.name}`;

      const html = `
        <h2>Nuovo messaggio dal form contatti</h2>
        <p><strong>Da:</strong> ${validatedData.name} &lt;${validatedData.email}&gt;</p>
        ${validatedData.subject ? `<p><strong>Oggetto:</strong> ${validatedData.subject}</p>` : ''}
        <hr />
        <p>${validatedData.message.replace(/\n/g, '<br />')}</p>
      `;

      await client.emails.send({
        from: fromEmail,
        to: toEmail,
        replyTo: validatedData.email,
        subject,
        html,
      });
    } catch (emailError) {
      logger.error('[Contact Form] Email send failed', emailError as Error, { component: 'contact' });
      return NextResponse.json(
        { success: false, error: msg.sendFailed },
        { status: 503, headers: { 'X-RateLimit-Remaining': String(rateLimit.remaining) } }
      );
    }

    return NextResponse.json({
      success: true,
      message: msg.success
    }, {
      headers: {
        'X-RateLimit-Remaining': String(rateLimit.remaining)
      }
    });

  } catch (error) {
    const locale = getLocaleFromRequest(request);
    const msg = messages[locale];

    if (error instanceof z.ZodError) {
      const first = error.errors[0];
      const field = first?.path?.[0] as string;
      const validationMap = validationErrorsByLocale[locale];
      const errorMsg = (field && validationMap?.[field]) || first?.message || msg.serverError;
      return NextResponse.json(
        { success: false, error: errorMsg },
        { status: 400 }
      );
    }

    logger.error('[Contact Form] Error', error as Error, { component: 'contact' });
    return NextResponse.json(
      { success: false, error: msg.serverError },
      { status: 500 }
    );
  }
}

export const POST = withApiSecurity(postContact, {
  allowedMethods: ['POST'],
});
