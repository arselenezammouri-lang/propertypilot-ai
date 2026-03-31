import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import type { InsertCommunicationLog } from '@/lib/types/database.types';

export const dynamic = 'force-dynamic';

const sendWhatsAppSchema = z.object({
  lead_id: z.string().uuid(),
  message: z.string().min(1).max(4096),
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
    const validationResult = sendWhatsAppSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ 
        error: 'Dati non validi', 
        details: validationResult.error.errors 
      }, { status: 400 });
    }

    const { lead_id, message, template_id } = validationResult.data;

    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('id, telefono, nome, user_id')
      .eq('id', lead_id)
      .eq('user_id', user.id)
      .single();

    if (leadError || !lead) {
      return NextResponse.json({ error: 'Lead non trovato' }, { status: 404 });
    }

    if (!lead.telefono) {
      return NextResponse.json({ error: 'Il lead non ha un numero di telefono' }, { status: 400 });
    }

    const phoneNumber = lead.telefono.replace(/\s+/g, '').replace(/^00/, '+').replace(/^0/, '+39');
    const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;

    const logData: InsertCommunicationLog & { user_id: string } = {
      lead_id,
      user_id: user.id,
      channel: 'whatsapp',
      direction: 'outbound',
      subject: undefined,
      message,
      metadata: {
        template_id,
        recipient_phone: lead.telefono,
        recipient_name: lead.nome,
        whatsapp_url: whatsappUrl,
        prepared_at: new Date().toISOString(),
      },
      status: 'pending',
    };

    const { data: log, error: logError } = await supabase
      .from('communication_logs')
      .insert(logData)
      .select()
      .single();

    if (logError) {
      console.error('Error logging WhatsApp message:', logError);
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
      whatsapp_url: whatsappUrl,
      message: `Messaggio WhatsApp preparato per ${lead.nome || lead.telefono}`,
    });
  } catch (error) {
    console.error('Error in POST /api/communications/send-whatsapp:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}
