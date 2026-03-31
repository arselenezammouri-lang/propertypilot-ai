import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getResendClient } from '@/lib/resend-client';
import { emailTemplates } from '@/lib/email-templates';
import { z } from 'zod';
import { timingSafeEqual } from 'crypto';
import { logger } from '@/lib/utils/safe-logger';

export const dynamic = 'force-dynamic';

const emailTriggerSchema = z.object({
  userId: z.string().uuid(),
  email: z.string().email(),
  type: z.enum(['welcome', 'upgradeNudge', 'successStory']),
});

function isSecretValid(providedSecret: string, expectedSecret: string): boolean {
  const provided = Buffer.from(providedSecret);
  const expected = Buffer.from(expectedSecret);

  if (provided.length !== expected.length) return false;
  return timingSafeEqual(provided, expected);
}

export async function POST(request: NextRequest) {
  try {
    const expectedSecret = process.env.INTERNAL_CALLBACK_SECRET;
    if (!expectedSecret) {
      logger.error('[EMAIL TRIGGER] INTERNAL_CALLBACK_SECRET not configured');
      return NextResponse.json({ error: 'Servizio non disponibile' }, { status: 503 });
    }

    const providedSecret = request.headers.get('x-internal-callback-secret');
    if (!providedSecret || !isSecretValid(providedSecret, expectedSecret)) {
      return NextResponse.json({ error: 'Accesso negato' }, { status: 401 });
    }

    const rawBody = await request.json();
    const parsedBody = emailTriggerSchema.safeParse(rawBody);

    if (!parsedBody.success) {
      return NextResponse.json({ error: 'Dati mancanti o non validi' }, { status: 400 });
    }
    const { userId, email, type } = parsedBody.data;


    const { client, fromEmail } = await getResendClient();
    const userName = email.split('@')[0];

    let emailContent;

    switch (type) {
      case 'welcome':
        emailContent = emailTemplates.welcome(userName);
        break;
      case 'upgradeNudge':
        const supabase = await createClient();
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('generations_count, status')
          .eq('user_id', userId)
          .single();

        const currentUsage = subscription?.generations_count || 0;
        const limit = subscription?.status === 'starter' ? 50 : 5;
        emailContent = emailTemplates.upgradeNudge(userName, currentUsage, limit);
        break;
      case 'successStory':
        emailContent = emailTemplates.successStory(userName);
        break;
      default:
        return NextResponse.json({ error: 'Tipo non supportato' }, { status: 400 });
    }

    await client.emails.send({
      from: fromEmail,
      to: email,
      subject: emailContent.subject,
      html: emailContent.html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('[EMAIL TRIGGER] Error', error as Error);
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 });
  }
}
