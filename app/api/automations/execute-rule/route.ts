import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { supabaseService } from '@/lib/supabase/service';
import type { 
  AutomationRule,
  AutomationCondition,
  AutomationConditionGroup,
  AutomationAction,
  AutomationActionGroup,
  AutomationTriggerType,
  Lead
} from '@/lib/types/database.types';

const executeRequestSchema = z.object({
  trigger_type: z.enum(['new_lead', 'score_updated', 'status_changed', 'priority_changed', 'market_changed']),
  lead_id: z.string().uuid(),
  lead_data: z.record(z.any()),
  previous_data: z.record(z.any()).optional()
});

function evaluateCondition(condition: AutomationCondition, leadData: Partial<Lead>): boolean {
  const fieldValue = (leadData as any)[condition.field];
  const targetValue = condition.value;

  if (fieldValue === undefined || fieldValue === null) {
    return false;
  }

  switch (condition.operator) {
    case 'eq':
      return fieldValue == targetValue;
    case 'neq':
      return fieldValue != targetValue;
    case 'gt':
      return typeof fieldValue === 'number' && typeof targetValue === 'number' && fieldValue > targetValue;
    case 'gte':
      return typeof fieldValue === 'number' && typeof targetValue === 'number' && fieldValue >= targetValue;
    case 'lt':
      return typeof fieldValue === 'number' && typeof targetValue === 'number' && fieldValue < targetValue;
    case 'lte':
      return typeof fieldValue === 'number' && typeof targetValue === 'number' && fieldValue <= targetValue;
    case 'contains':
      return typeof fieldValue === 'string' && typeof targetValue === 'string' && 
             fieldValue.toLowerCase().includes(targetValue.toLowerCase());
    case 'not_contains':
      return typeof fieldValue === 'string' && typeof targetValue === 'string' && 
             !fieldValue.toLowerCase().includes(targetValue.toLowerCase());
    default:
      return false;
  }
}

function evaluateConditionGroup(conditionGroup: AutomationConditionGroup, leadData: Partial<Lead>): boolean {
  if (conditionGroup.all && conditionGroup.all.length > 0) {
    return conditionGroup.all.every(cond => evaluateCondition(cond, leadData));
  }

  if (conditionGroup.any && conditionGroup.any.length > 0) {
    return conditionGroup.any.some(cond => evaluateCondition(cond, leadData));
  }

  if (conditionGroup.field && conditionGroup.operator && conditionGroup.value !== undefined) {
    return evaluateCondition({
      field: conditionGroup.field,
      operator: conditionGroup.operator,
      value: conditionGroup.value
    }, leadData);
  }

  return true;
}

async function applyAction(
  action: AutomationAction, 
  leadId: string, 
  userId: string,
  ruleId: string
): Promise<{ success: boolean; message: string }> {
  try {
    switch (action.type) {
      case 'update_status':
        if (action.value) {
          await supabaseService
            .from('leads')
            .update({ status: action.value })
            .eq('id', leadId);
          return { success: true, message: `Status aggiornato a "${action.value}"` };
        }
        return { success: false, message: 'Valore status mancante' };

      case 'update_priority':
        if (action.value) {
          await supabaseService
            .from('leads')
            .update({ priorita: action.value })
            .eq('id', leadId);
          return { success: true, message: `Priorità aggiornata a "${action.value}"` };
        }
        return { success: false, message: 'Valore priorità mancante' };

      case 'assign_to':
        if (action.value) {
          await supabaseService
            .from('automations_assignments')
            .insert({
              user_id: userId,
              lead_id: leadId,
              assigned_to: action.value,
              assigned_by: 'automation',
              rule_id: ruleId,
              notes: 'Assegnato automaticamente da regola automazione'
            });
          return { success: true, message: `Lead assegnato a "${action.value}"` };
        }
        return { success: false, message: 'Assegnatario mancante' };

      case 'add_note':
        if (action.value) {
          await supabaseService
            .from('lead_notes')
            .insert({
              user_id: userId,
              lead_id: leadId,
              content: `⚡ ${action.value}`,
              note_type: 'automation'
            });
          return { success: true, message: 'Nota aggiunta' };
        }
        return { success: false, message: 'Contenuto nota mancante' };

      case 'trigger_lead_score':
        return { success: true, message: 'Lead Score trigger programmato (richiede implementazione webhook)' };

      case 'trigger_enrichment':
        return { success: true, message: 'Enrichment trigger programmato (richiede implementazione webhook)' };

      case 'send_email':
        return { success: true, message: `Email template "${action.template || 'default'}" programmata (richiede integrazione email)` };

      default:
        return { success: false, message: `Azione non supportata: ${action.type}` };
    }
  } catch (error: any) {
    console.error('Error applying action:', error);
    return { success: false, message: error.message };
  }
}

async function applyActionGroup(
  actionGroup: AutomationActionGroup, 
  leadId: string, 
  userId: string,
  ruleId: string
): Promise<Array<{ action: string; success: boolean; message: string }>> {
  const results: Array<{ action: string; success: boolean; message: string }> = [];

  if (actionGroup.actions && actionGroup.actions.length > 0) {
    for (const action of actionGroup.actions) {
      const result = await applyAction(action, leadId, userId, ruleId);
      results.push({ action: action.type, ...result });
    }
  } else if (actionGroup.type) {
    const result = await applyAction({
      type: actionGroup.type,
      value: actionGroup.value,
      template: actionGroup.template
    }, leadId, userId, ruleId);
    results.push({ action: actionGroup.type, ...result });
  }

  return results;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non autorizzato. Effettua il login.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = executeRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Dati non validi', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { trigger_type, lead_id, lead_data, previous_data } = validation.data;

    const { data: rules, error: rulesError } = await supabaseService
      .from('automations_rules')
      .select('*')
      .eq('user_id', user.id)
      .eq('trigger_type', trigger_type)
      .eq('is_active', true);

    if (rulesError) {
      console.error('Error fetching rules:', rulesError);
      return NextResponse.json(
        { error: 'Errore nel recupero delle regole.' },
        { status: 500 }
      );
    }

    if (!rules || rules.length === 0) {
      return NextResponse.json({
        success: true,
        executed: 0,
        message: 'Nessuna regola attiva trovata per questo trigger.'
      });
    }

    const executionResults: Array<{
      rule_id: string;
      rule_name: string;
      matched: boolean;
      actions_applied: Array<{ action: string; success: boolean; message: string }>;
    }> = [];

    for (const rule of rules) {
      const conditionMatched = evaluateConditionGroup(rule.condition as AutomationConditionGroup, lead_data as Partial<Lead>);

      if (conditionMatched) {
        const actionResults = await applyActionGroup(
          rule.action as AutomationActionGroup, 
          lead_id, 
          user.id,
          rule.id
        );

        await supabaseService
          .from('automations_rules')
          .update({
            execution_count: (rule.execution_count || 0) + 1,
            last_executed_at: new Date().toISOString()
          })
          .eq('id', rule.id);

        await supabaseService
          .from('automations_logs')
          .insert({
            user_id: user.id,
            rule_id: rule.id,
            lead_id: lead_id,
            trigger_type: trigger_type,
            condition_matched: rule.condition,
            action_applied: rule.action,
            success: actionResults.every(r => r.success),
            error_message: actionResults.filter(r => !r.success).map(r => r.message).join('; ') || null
          });

        executionResults.push({
          rule_id: rule.id,
          rule_name: rule.name,
          matched: true,
          actions_applied: actionResults
        });
      } else {
        executionResults.push({
          rule_id: rule.id,
          rule_name: rule.name,
          matched: false,
          actions_applied: []
        });
      }
    }

    const executedCount = executionResults.filter(r => r.matched).length;

    return NextResponse.json({
      success: true,
      executed: executedCount,
      total_rules: rules.length,
      results: executionResults,
      message: executedCount > 0 
        ? `${executedCount} regola/e eseguita/e con successo!`
        : 'Nessuna regola soddisfatta.'
    });
  } catch (error) {
    console.error('Automation execute-rule error:', error);
    return NextResponse.json(
      { error: 'Errore interno del server.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non autorizzato. Effettua il login.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const ruleId = searchParams.get('rule_id');
    const leadId = searchParams.get('lead_id');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = supabaseService
      .from('automations_logs')
      .select(`
        *,
        automations_rules(name)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (ruleId) {
      query = query.eq('rule_id', ruleId);
    }

    if (leadId) {
      query = query.eq('lead_id', leadId);
    }

    const { data: logs, error } = await query;

    if (error) {
      console.error('Error fetching automation logs:', error);
      return NextResponse.json(
        { error: 'Errore nel recupero dei log.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ logs: logs || [] });
  } catch (error) {
    console.error('Automation logs GET error:', error);
    return NextResponse.json(
      { error: 'Errore interno del server.' },
      { status: 500 }
    );
  }
}
