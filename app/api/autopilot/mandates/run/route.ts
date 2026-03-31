import { NextRequest, NextResponse } from 'next/server';
import { supabaseService } from '@/lib/supabase/service';
import { startAutopilotCall } from '@/lib/autopilot/voice';
import { generateAutopilotFollowup } from '@/lib/autopilot/followup';

export const dynamic = 'force-dynamic';

type AutopilotRule = {
  id: string;
  user_id: string;
  active: boolean;
  name: string;
  city: string | null;
  region: string | null;
  portals: string[];
  min_price: number | null;
  max_price: number | null;
  min_bedrooms: number | null;
  max_bedrooms: number | null;
  run_hour_utc: number;
  daily_limit: number;
};

export async function GET(_req: NextRequest) {
  const now = new Date();
  const currentHourUTC = now.getUTCHours();

  try {
    const { data: rules, error: rulesError } = await supabaseService
      .from('prospecting_autopilot_rules')
      .select('*')
      .eq('active', true)
      .eq('run_hour_utc', currentHourUTC);

    if (rulesError) {
      console.error('[AUTOPILOT] Error loading rules', rulesError);
      return NextResponse.json({ error: 'Error loading rules' }, { status: 500 });
    }

    if (!rules || rules.length === 0) {
      return NextResponse.json({ ok: true, message: 'No rules to run at this hour' });
    }

    const results = [];

    for (const rule of rules as AutopilotRule[]) {
      // eslint-disable-next-line no-await-in-loop
      const result = await runAutopilotForRule(rule);
      results.push(result);
    }

    return NextResponse.json({ ok: true, results });
  } catch (error) {
    console.error('[AUTOPILOT] Fatal error', error);
    return NextResponse.json({ error: 'Unexpected error running autopilot' }, { status: 500 });
  }
}

async function runAutopilotForRule(rule: AutopilotRule) {
  const { data: run, error: runError } = await supabaseService
    .from('autopilot_runs')
    .insert({
      rule_id: rule.id,
      status: 'pending',
    })
    .select('*')
    .single();

  if (runError || !run) {
    console.error('[AUTOPILOT] Error creating run', runError);
    return { ruleId: rule.id, status: 'error', error: 'run_insert_failed' };
  }

  let scanned = 0;
  let opportunities = 0;
  let leadsCreated = 0;

  try {
    const { data: listings, error: listingsError } = await supabaseService
      .from('external_listings')
      .select('*')
      .eq('user_id', rule.user_id)
      .is('archived_at', null)
      .limit(rule.daily_limit * 5);

    if (listingsError) {
      throw listingsError;
    }

    scanned = listings?.length ?? 0;

    const filtered = (listings || []).filter((listing: any) => {
      if (rule.city && listing.city && listing.city !== rule.city) return false;
      if (rule.region && listing.region && listing.region !== rule.region) return false;
      if (rule.min_price && listing.price && listing.price < rule.min_price) return false;
      if (rule.max_price && listing.price && listing.price > rule.max_price) return false;
      if (rule.min_bedrooms && listing.bedrooms && listing.bedrooms < rule.min_bedrooms) return false;
      if (rule.max_bedrooms && listing.bedrooms && listing.bedrooms > rule.max_bedrooms) return false;
      return true;
    });

    const selected = filtered.slice(0, rule.daily_limit);
    opportunities = selected.length;

    for (const listing of selected) {
      // eslint-disable-next-line no-await-in-loop
      const { data: existingLead } = await supabaseService
        .from('leads')
        .select('id')
        .eq('external_listing_id', listing.id)
        .maybeSingle?.() ?? { data: null };

      let leadId = existingLead?.id;

      if (!leadId) {
        // eslint-disable-next-line no-await-in-loop
        const { data: newLead, error: leadError } = await supabaseService
          .from('leads')
          .insert({
            user_id: rule.user_id,
            name: listing.owner_name || 'Proprietario',
            phone: listing.phone_number || null,
            source: 'autopilot',
            status: 'new',
            external_listing_id: listing.id,
          })
          .select('id')
          .single();

        if (leadError || !newLead) {
          console.error('[AUTOPILOT] Error creating lead', leadError);
          // eslint-disable-next-line no-await-in-loop
          await supabaseService.from('autopilot_actions').insert({
            run_id: run.id,
            listing_id: listing.id,
            action_type: 'create_lead',
            action_status: 'failed',
            notes: leadError?.message,
          });
          continue;
        }

        leadId = newLead.id;
        leadsCreated += 1;
      }

      // Voice AI call
      try {
        // eslint-disable-next-line no-await-in-loop
        const callResponse = await startAutopilotCall(listing.id, rule.user_id);
        // eslint-disable-next-line no-await-in-loop
        await supabaseService.from('autopilot_actions').insert({
          run_id: run.id,
          listing_id: listing.id,
          lead_id: leadId,
          action_type: 'call_ai',
          action_status: 'done',
          notes: callResponse.status,
        });
      } catch (e: any) {
        console.error('[AUTOPILOT] Voice call error', e);
        // eslint-disable-next-line no-await-in-loop
        await supabaseService.from('autopilot_actions').insert({
          run_id: run.id,
          listing_id: listing.id,
          lead_id: leadId,
          action_type: 'call_ai',
          action_status: 'failed',
          notes: e.message,
        });
      }

      // Follow-up email draft
      try {
        // eslint-disable-next-line no-await-in-loop
        await generateAutopilotFollowup(listing, rule.user_id);
        // eslint-disable-next-line no-await-in-loop
        await supabaseService.from('autopilot_actions').insert({
          run_id: run.id,
          listing_id: listing.id,
          lead_id: leadId,
          action_type: 'send_email',
          action_status: 'done',
        });
      } catch (e: any) {
        console.error('[AUTOPILOT] Followup error', e);
        // eslint-disable-next-line no-await-in-loop
        await supabaseService.from('autopilot_actions').insert({
          run_id: run.id,
          listing_id: listing.id,
          lead_id: leadId,
          action_type: 'send_email',
          action_status: 'failed',
          notes: e.message,
        });
      }
    }

    await supabaseService
      .from('autopilot_runs')
      .update({
        status: 'success',
        total_listings_scanned: scanned,
        total_opportunities: opportunities,
        total_leads_created: leadsCreated,
      })
      .eq('id', run.id);

    return {
      ruleId: rule.id,
      status: 'success',
      scanned,
      opportunities,
      leadsCreated,
    };
  } catch (error: any) {
    console.error('[AUTOPILOT] Error in run', error);
    await supabaseService
      .from('autopilot_runs')
      .update({
        status: 'error',
        error_message: error?.message ?? String(error),
        total_listings_scanned: scanned,
        total_opportunities: opportunities,
        total_leads_created: leadsCreated,
      })
      .eq('id', run.id);

    return {
      ruleId: rule.id,
      status: 'error',
      error: error?.message ?? 'unknown',
    };
  }
}

