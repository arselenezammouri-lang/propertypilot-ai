import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import type { CommunicationTemplate, InsertCommunicationTemplate, UpdateCommunicationTemplate } from '@/lib/types/database.types';

export const dynamic = 'force-dynamic';

const MAX_TEMPLATES_PER_USER = 50;

const insertTemplateSchema = z.object({
  channel: z.enum(['email', 'whatsapp', 'sms']),
  name: z.string().min(1).max(100),
  subject: z.string().max(200).optional(),
  content: z.string().min(1).max(5000),
  tone: z.enum(['professional', 'emotional', 'luxury', 'casual', 'urgent']).optional().default('professional'),
  variables: z.array(z.string()).optional().default([]),
});

const updateTemplateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  subject: z.string().max(200).optional(),
  content: z.string().min(1).max(5000).optional(),
  tone: z.enum(['professional', 'emotional', 'luxury', 'casual', 'urgent']).optional(),
  variables: z.array(z.string()).optional(),
  is_active: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const channel = searchParams.get('channel');
    const activeOnly = searchParams.get('active') === 'true';

    let query = supabase
      .from('communication_templates')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (channel && ['email', 'whatsapp', 'sms'].includes(channel)) {
      query = query.eq('channel', channel);
    }

    if (activeOnly) {
      query = query.eq('is_active', true);
    }

    const { data: templates, error } = await query;

    if (error) {
      console.error('Error fetching templates:', error);
      return NextResponse.json({ error: 'Errore nel recupero dei template' }, { status: 500 });
    }

    return NextResponse.json({ templates: templates || [] });
  } catch (error) {
    console.error('Error in GET /api/communications/templates:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const body = await request.json();
    const validationResult = insertTemplateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ 
        error: 'Dati non validi', 
        details: validationResult.error.errors 
      }, { status: 400 });
    }

    const { data: existingTemplates, error: countError } = await supabase
      .from('communication_templates')
      .select('id', { count: 'exact' })
      .eq('user_id', user.id);

    if (countError) {
      console.error('Error counting templates:', countError);
      return NextResponse.json({ error: 'Errore nel conteggio template' }, { status: 500 });
    }

    if ((existingTemplates?.length || 0) >= MAX_TEMPLATES_PER_USER) {
      return NextResponse.json({ 
        error: `Limite massimo di ${MAX_TEMPLATES_PER_USER} template raggiunto` 
      }, { status: 400 });
    }

    const templateData: InsertCommunicationTemplate & { user_id: string } = {
      ...validationResult.data,
      user_id: user.id,
    };

    const { data: template, error } = await supabase
      .from('communication_templates')
      .insert(templateData)
      .select()
      .single();

    if (error) {
      console.error('Error creating template:', error);
      return NextResponse.json({ error: 'Errore nella creazione del template' }, { status: 500 });
    }

    return NextResponse.json({ template }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/communications/templates:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const templateId = searchParams.get('id');

    if (!templateId) {
      return NextResponse.json({ error: 'ID template richiesto' }, { status: 400 });
    }

    const body = await request.json();
    const validationResult = updateTemplateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ 
        error: 'Dati non validi', 
        details: validationResult.error.errors 
      }, { status: 400 });
    }

    const { data: existingTemplate, error: fetchError } = await supabase
      .from('communication_templates')
      .select('*')
      .eq('id', templateId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !existingTemplate) {
      return NextResponse.json({ error: 'Template non trovato' }, { status: 404 });
    }

    const { data: template, error } = await supabase
      .from('communication_templates')
      .update(validationResult.data)
      .eq('id', templateId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating template:', error);
      return NextResponse.json({ error: 'Errore nell\'aggiornamento del template' }, { status: 500 });
    }

    return NextResponse.json({ template });
  } catch (error) {
    console.error('Error in PATCH /api/communications/templates:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const templateId = searchParams.get('id');

    if (!templateId) {
      return NextResponse.json({ error: 'ID template richiesto' }, { status: 400 });
    }

    const { data: existingTemplate, error: fetchError } = await supabase
      .from('communication_templates')
      .select('id')
      .eq('id', templateId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !existingTemplate) {
      return NextResponse.json({ error: 'Template non trovato' }, { status: 404 });
    }

    const { error } = await supabase
      .from('communication_templates')
      .delete()
      .eq('id', templateId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting template:', error);
      return NextResponse.json({ error: 'Errore nell\'eliminazione del template' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/communications/templates:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}
