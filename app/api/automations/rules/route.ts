import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { supabaseService } from '@/lib/supabase/service';
import type { 
  AutomationRule, 
  InsertAutomationRule, 
  UpdateAutomationRule,
  AutomationTriggerType,
  AutomationConditionGroup,
  AutomationActionGroup
} from '@/lib/types/database.types';

const conditionSchema = z.object({
  field: z.string(),
  operator: z.enum(['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'contains', 'not_contains']),
  value: z.union([z.string(), z.number(), z.boolean()])
});

const conditionGroupSchema: z.ZodType<AutomationConditionGroup> = z.lazy(() => 
  z.object({
    all: z.array(conditionSchema).optional(),
    any: z.array(conditionSchema).optional(),
    field: z.string().optional(),
    operator: z.enum(['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'contains', 'not_contains']).optional(),
    value: z.union([z.string(), z.number(), z.boolean()]).optional()
  })
);

const actionSchema = z.object({
  type: z.enum(['update_status', 'update_priority', 'assign_to', 'send_email', 'add_note', 'trigger_lead_score', 'trigger_enrichment']),
  value: z.string().optional(),
  template: z.string().optional()
});

const actionGroupSchema: z.ZodType<AutomationActionGroup> = z.object({
  actions: z.array(actionSchema).optional(),
  type: z.enum(['update_status', 'update_priority', 'assign_to', 'send_email', 'add_note', 'trigger_lead_score', 'trigger_enrichment']).optional(),
  value: z.string().optional(),
  template: z.string().optional()
});

const createRuleSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(500).optional(),
  trigger_type: z.enum(['new_lead', 'score_updated', 'status_changed', 'priority_changed', 'market_changed']),
  condition: conditionGroupSchema,
  action: actionGroupSchema,
  is_active: z.boolean().optional().default(true)
});

const updateRuleSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(500).optional(),
  trigger_type: z.enum(['new_lead', 'score_updated', 'status_changed', 'priority_changed', 'market_changed']).optional(),
  condition: conditionGroupSchema.optional(),
  action: actionGroupSchema.optional(),
  is_active: z.boolean().optional()
});

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
    const triggerType = searchParams.get('trigger_type');
    const isActive = searchParams.get('is_active');

    let query = supabaseService
      .from('automations_rules')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (triggerType && ['new_lead', 'score_updated', 'status_changed', 'priority_changed', 'market_changed'].includes(triggerType)) {
      query = query.eq('trigger_type', triggerType);
    }

    if (isActive !== null && isActive !== undefined) {
      query = query.eq('is_active', isActive === 'true');
    }

    const { data: rules, error } = await query;

    if (error) {
      console.error('Error fetching automation rules:', error);
      return NextResponse.json(
        { error: 'Errore nel recupero delle regole.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ rules: rules || [] });
  } catch (error) {
    console.error('Automation rules GET error:', error);
    return NextResponse.json(
      { error: 'Errore interno del server.' },
      { status: 500 }
    );
  }
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
    const validation = createRuleSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Dati non validi', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { name, description, trigger_type, condition, action, is_active } = validation.data;

    const { data: existingRules, error: countError } = await supabaseService
      .from('automations_rules')
      .select('id')
      .eq('user_id', user.id);

    if (!countError && existingRules && existingRules.length >= 20) {
      return NextResponse.json(
        { error: 'Limite massimo di 20 regole raggiunto.' },
        { status: 400 }
      );
    }

    const { data: rule, error } = await supabaseService
      .from('automations_rules')
      .insert({
        user_id: user.id,
        name,
        description: description || null,
        trigger_type,
        condition,
        action,
        is_active: is_active ?? true,
        execution_count: 0
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating automation rule:', error);
      return NextResponse.json(
        { error: 'Errore nella creazione della regola.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      rule,
      message: `Regola "${name}" creata con successo!`
    }, { status: 201 });
  } catch (error) {
    console.error('Automation rules POST error:', error);
    return NextResponse.json(
      { error: 'Errore interno del server.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
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
    const validation = updateRuleSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Dati non validi', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { id, ...updates } = validation.data;

    const { data: existingRule, error: fetchError } = await supabaseService
      .from('automations_rules')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !existingRule) {
      return NextResponse.json(
        { error: 'Regola non trovata.' },
        { status: 404 }
      );
    }

    const updateData: any = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.trigger_type !== undefined) updateData.trigger_type = updates.trigger_type;
    if (updates.condition !== undefined) updateData.condition = updates.condition;
    if (updates.action !== undefined) updateData.action = updates.action;
    if (updates.is_active !== undefined) updateData.is_active = updates.is_active;

    const { data: rule, error: updateError } = await supabaseService
      .from('automations_rules')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating automation rule:', updateError);
      return NextResponse.json(
        { error: 'Errore nell\'aggiornamento della regola.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      rule,
      message: 'Regola aggiornata con successo!'
    });
  } catch (error) {
    console.error('Automation rules PATCH error:', error);
    return NextResponse.json(
      { error: 'Errore interno del server.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
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
    const ruleId = searchParams.get('id');

    if (!ruleId) {
      return NextResponse.json(
        { error: 'ID regola richiesto.' },
        { status: 400 }
      );
    }

    const { data: existingRule, error: fetchError } = await supabaseService
      .from('automations_rules')
      .select('id, name')
      .eq('id', ruleId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !existingRule) {
      return NextResponse.json(
        { error: 'Regola non trovata.' },
        { status: 404 }
      );
    }

    const { error: deleteError } = await supabaseService
      .from('automations_rules')
      .delete()
      .eq('id', ruleId)
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Error deleting automation rule:', deleteError);
      return NextResponse.json(
        { error: 'Errore nell\'eliminazione della regola.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Regola "${existingRule.name}" eliminata con successo.`
    });
  } catch (error) {
    console.error('Automation rules DELETE error:', error);
    return NextResponse.json(
      { error: 'Errore interno del server.' },
      { status: 500 }
    );
  }
}
