import { NextRequest, NextResponse } from 'next/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import type { LeadCapturePayload } from '@/lib/types/database.types';

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQUESTS_PER_KEY = 30;
const requestCounts = new Map<string, { count: number; resetAt: number }>();

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
};

function corsResponse(data: object, status: number) {
  return NextResponse.json(data, { 
    status, 
    headers: CORS_HEADERS 
  });
}

function checkRateLimit(apiKey: string): boolean {
  const now = Date.now();
  const record = requestCounts.get(apiKey);

  if (!record || now > record.resetAt) {
    requestCounts.set(apiKey, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= MAX_REQUESTS_PER_KEY) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-api-key') || request.headers.get('authorization')?.replace('Bearer ', '');

    if (!apiKey) {
      return corsResponse(
        { error: 'API key richiesta', code: 'MISSING_API_KEY' },
        401
      );
    }

    if (!checkRateLimit(apiKey)) {
      return corsResponse(
        { error: 'Troppo richieste. Riprova tra un minuto.', code: 'RATE_LIMIT_EXCEEDED' },
        429
      );
    }

    const { data: keyData, error: keyError } = await supabaseAdmin
      .from('user_api_keys')
      .select('user_id, auto_lead_score, auto_followup, default_market, is_active, expires_at')
      .eq('api_key', apiKey)
      .single();

    if (keyError || !keyData) {
      return corsResponse(
        { error: 'API key non valida', code: 'INVALID_API_KEY' },
        401
      );
    }

    if (!keyData.is_active) {
      return corsResponse(
        { error: 'API key disattivata', code: 'API_KEY_INACTIVE' },
        403
      );
    }

    if (keyData.expires_at && new Date(keyData.expires_at) < new Date()) {
      return corsResponse(
        { error: 'API key scaduta', code: 'API_KEY_EXPIRED' },
        403
      );
    }

    const body: LeadCapturePayload = await request.json();

    if (!body.nome || body.nome.trim().length === 0) {
      return corsResponse(
        { error: 'Il campo nome è obbligatorio', code: 'VALIDATION_ERROR' },
        400
      );
    }

    if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return corsResponse(
        { error: 'Formato email non valido', code: 'VALIDATION_ERROR' },
        400
      );
    }

    const leadData = {
      user_id: keyData.user_id,
      nome: body.nome.trim(),
      email: body.email?.trim() || null,
      telefono: body.telefono?.trim() || null,
      messaggio: body.messaggio?.trim() || null,
      property_url: body.property_url?.trim() || null,
      source: body.source?.trim() || 'embed_form',
      market: body.market || keyData.default_market || 'italy',
      status: 'new',
      priorita: 'medium',
      lead_score: 0
    };

    const { data: newLead, error: insertError } = await supabaseAdmin
      .from('leads')
      .insert(leadData)
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting lead:', insertError);
      return corsResponse(
        { error: 'Errore nel salvataggio del lead', code: 'INSERT_ERROR' },
        500
      );
    }

    try {
      const { data: currentKey } = await supabaseAdmin
        .from('user_api_keys')
        .select('leads_captured')
        .eq('api_key', apiKey)
        .single();

      await supabaseAdmin
        .from('user_api_keys')
        .update({ 
          leads_captured: (currentKey?.leads_captured || 0) + 1,
          last_used_at: new Date().toISOString()
        })
        .eq('api_key', apiKey);
    } catch (updateError) {
      console.error('Failed to update API key stats:', updateError);
    }

    let automationResults: { lead_score?: number; followup_scheduled?: boolean } = {};

    if (keyData.auto_lead_score && newLead) {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
        const scoreResponse = await fetch(`${baseUrl}/api/lead-score`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nome: newLead.nome,
            email: newLead.email,
            messaggio: newLead.messaggio,
            market: newLead.market
          })
        });

        if (scoreResponse.ok) {
          const scoreData = await scoreResponse.json();
          // Bug fix: la risposta API ha struttura { success: true, data: { leadScore: number, ... } }
          if (scoreData.success && scoreData.data?.leadScore !== undefined) {
            await supabaseAdmin
              .from('leads')
              .update({ lead_score: scoreData.data.leadScore })
              .eq('id', newLead.id);
            
            automationResults.lead_score = scoreData.data.leadScore;
          }
        }
      } catch (scoreError) {
        console.error('Auto lead score failed:', scoreError);
      }
    }

    return corsResponse({
      success: true,
      lead_id: newLead.id,
      message: 'Lead catturato con successo',
      automations: automationResults
    }, 201);

  } catch (error) {
    console.error('Error in POST /api/public/lead-capture:', error);
    return corsResponse(
      { error: 'Errore interno del server', code: 'INTERNAL_ERROR' },
      500
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
      'Access-Control-Max-Age': '86400',
    },
  });
}
