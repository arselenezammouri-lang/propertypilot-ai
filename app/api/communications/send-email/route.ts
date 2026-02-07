import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import type { InsertCommunicationLog } from '@/lib/types/database.types';
import { logger } from '@/lib/utils/safe-logger';

export const dynamic = 'force-dynamic';

const sendEmailSchema = z.object({
  lead_id: z.string().uuid(),
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(10000),
  template_id: z.string().uuid().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const body = await request.json();
    const validationResult = sendEmailSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ 
        error: 'Dati non validi', 
        details: validationResult.error.errors 
      }, { status: 400 });
    }

    const { lead_id, subject, message, template_id } = validationResult.data;

    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('id, email, nome, user_id')
      .eq('id', lead_id)
      .eq('user_id', user.id)
      .single();

    if (leadError || !lead) {
      return NextResponse.json({ error: 'Lead non trovato' }, { status: 404 });
    }

    if (!lead.email) {
      return NextResponse.json({ error: 'Il lead non ha un indirizzo email' }, { status: 400 });
    }

    // Send email via Resend
    const { sendEmail } = await import('@/lib/utils/email');
    
    let emailSent = false;
    let emailMessageId: string | undefined;
    let emailError: string | undefined;

    try {
      const emailResult = await sendEmail({
        to: lead.email,
        subject: subject,
        html: message,
      });

      if (emailResult.success) {
        emailSent = true;
        emailMessageId = emailResult.messageId;
        logger.debug('[SEND EMAIL] Email sent successfully', { messageId: emailMessageId });
      } else {
        emailError = emailResult.error;
        logger.error('[SEND EMAIL] Failed to send email', new Error(emailError || 'Unknown error'), { leadId: lead.id });
      }
    } catch (error: any) {
      emailError = error.message || 'Unknown error';
      logger.error('[SEND EMAIL] Error sending email', error as Error, { leadId });
    }

    const status = emailSent ? 'sent' : 'failed';

    const logData: InsertCommunicationLog & { user_id: string } = {
      lead_id,
      user_id: user.id,
      channel: 'email',
      direction: 'outbound',
      subject,
      message,
      metadata: {
        template_id,
        recipient_email: lead.email,
        recipient_name: lead.nome,
        sent_at: new Date().toISOString(),
        message_id: emailMessageId,
        error: emailError,
      },
      status,
    };

    const { data: log, error: logError } = await supabase
      .from('communication_logs')
      .insert(logData)
      .select()
      .single();

    if (logError) {
      logger.error('Error logging email', logError, { leadId });
      return NextResponse.json({ error: 'Errore nel salvataggio del log' }, { status: 500 });
    }

    if (template_id) {
      await supabase
        .from('communication_templates')
        .update({ usage_count: supabase.rpc('increment_usage_count') })
        .eq('id', template_id)
        .eq('user_id', user.id);
    }

    return NextResponse.json({ 
      success: true,
      log,
      message: `Email inviata a ${lead.email}`,
    });
  } catch (error) {
    logger.error('Error in POST /api/communications/send-email', error as Error, { component: 'send-email' });
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}
