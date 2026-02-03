import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getResendClient } from '@/lib/resend-client';
import { emailTemplates } from '@/lib/email-templates';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const { type, data } = await request.json();

    if (!type) {
      return NextResponse.json({ error: 'Tipo email mancante' }, { status: 400 });
    }

    const { client, fromEmail } = await getResendClient();

    let emailContent;
    const userName = data?.userName || user.email?.split('@')[0] || 'Agente';

    switch (type) {
      case 'welcome':
        emailContent = emailTemplates.welcome(userName);
        break;
      case 'upgradeNudge':
        emailContent = emailTemplates.upgradeNudge(
          userName, 
          data?.currentUsage || 0, 
          data?.limit || 50
        );
        break;
      case 'successStory':
        emailContent = emailTemplates.successStory(userName);
        break;
      default:
        return NextResponse.json({ error: 'Tipo email non supportato' }, { status: 400 });
    }

    const result = await client.emails.send({
      from: fromEmail,
      to: user.email!,
      subject: emailContent.subject,
      html: emailContent.html,
    });

    return NextResponse.json({ success: true, id: result.data?.id });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Errore invio email' }, { status: 500 });
  }
}
