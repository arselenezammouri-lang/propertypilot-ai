import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getResendClient } from '@/lib/resend-client';
import { emailTemplates } from '@/lib/email-templates';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { userId, email, type } = await request.json();

    if (!userId || !email || !type) {
      return NextResponse.json({ error: 'Dati mancanti' }, { status: 400 });
    }

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
    console.error('Error in email trigger:', error);
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 });
  }
}
