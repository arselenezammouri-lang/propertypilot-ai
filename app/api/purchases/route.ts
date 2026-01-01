import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: purchases, error } = await supabase
      .from('purchases')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching purchases:', error);
      return NextResponse.json(
        { error: 'Failed to fetch purchases' },
        { status: 500 }
      );
    }

    const summary = {
      totalPurchases: purchases?.length || 0,
      totalSpent: purchases?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0,
      activePackages: purchases?.filter(p => p.status === 'completed') || [],
    };

    return NextResponse.json({
      purchases: purchases || [],
      summary,
    });
  } catch (error) {
    console.error('Error in purchases API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

const VALID_DELIVERABLE_TYPES = ['listings', 'audits', 'templates'] as const;
type DeliverableType = typeof VALID_DELIVERABLE_TYPES[number];

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { purchaseId, type, increment = 1 } = await request.json();

    if (!purchaseId || !type) {
      return NextResponse.json(
        { error: 'Missing purchaseId or type' },
        { status: 400 }
      );
    }

    if (!VALID_DELIVERABLE_TYPES.includes(type as DeliverableType)) {
      return NextResponse.json(
        { error: `Tipo non valido. Tipi validi: ${VALID_DELIVERABLE_TYPES.join(', ')}` },
        { status: 400 }
      );
    }

    const { data: purchase, error: fetchError } = await supabase
      .from('purchases')
      .select('deliverables, deliverables_used')
      .eq('id', purchaseId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !purchase) {
      return NextResponse.json(
        { error: 'Purchase not found' },
        { status: 404 }
      );
    }

    const deliverables = purchase.deliverables || {};
    const used = purchase.deliverables_used || { listings: 0, audits: 0, templates: 0 };
    
    const limit = deliverables[type as keyof typeof deliverables];
    
    if (typeof limit === 'boolean') {
      return NextResponse.json(
        { error: `${type} non è un deliverable contabile` },
        { status: 400 }
      );
    }
    
    if (limit === undefined) {
      return NextResponse.json(
        { error: `${type} non disponibile per questo pacchetto` },
        { status: 400 }
      );
    }

    const currentUsed = typeof used[type as keyof typeof used] === 'number' 
      ? (used[type as keyof typeof used] as number) 
      : 0;
    
    if (limit !== -1 && currentUsed + increment > (limit as number)) {
      return NextResponse.json(
        { 
          error: `Limite raggiunto per ${type}`,
          current: currentUsed,
          limit: limit,
        },
        { status: 400 }
      );
    }

    const newUsed = {
      ...used,
      [type]: currentUsed + increment,
    };

    const { data: updated, error: updateError } = await supabase
      .from('purchases')
      .update({
        deliverables_used: newUsed,
        updated_at: new Date().toISOString(),
      })
      .eq('id', purchaseId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating purchase:', updateError);
      return NextResponse.json(
        { error: 'Failed to update purchase' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      purchase: updated,
      remaining: limit === -1 ? 'unlimited' : (limit as number) - (currentUsed + increment),
    });
  } catch (error) {
    console.error('Error in purchases PATCH API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
