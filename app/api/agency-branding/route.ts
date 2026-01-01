import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { Pool } from '@neondatabase/serverless';

const brandingSchema = z.object({
  agency_name: z.string().min(2, 'Nome agenzia obbligatorio').max(255),
  logo_url: z.string().url().nullable().optional(),
  primary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Colore primario non valido').default('#1E3A5F'),
  secondary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Colore secondario non valido').default('#60A5FA'),
  accent_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Colore accento non valido').default('#F59E0B'),
  contact_name: z.string().max(255).nullable().optional(),
  contact_phone: z.string().max(50).nullable().optional(),
  contact_email: z.string().email().nullable().optional(),
  website_url: z.string().url().nullable().optional(),
});

export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Devi effettuare il login per accedere al branding.' },
        { status: 401 }
      );
    }

    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    
    const result = await pool.query(
      'SELECT * FROM agency_branding WHERE user_id = $1',
      [user.id]
    );
    
    await pool.end();

    if (result.rows.length === 0) {
      return NextResponse.json({ branding: null });
    }

    return NextResponse.json({ branding: result.rows[0] });

  } catch (error) {
    console.error('Agency branding GET error:', error);
    return NextResponse.json(
      { error: 'Errore nel recupero del branding.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Devi effettuare il login per salvare il branding.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    const validationResult = brandingSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(e => e.message).join(', ');
      return NextResponse.json(
        { error: `Dati non validi: ${errors}` },
        { status: 400 }
      );
    }

    const data = validationResult.data;
    
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    
    const existingResult = await pool.query(
      'SELECT id FROM agency_branding WHERE user_id = $1',
      [user.id]
    );

    let result;
    
    if (existingResult.rows.length > 0) {
      result = await pool.query(
        `UPDATE agency_branding SET
          agency_name = $1,
          logo_url = $2,
          primary_color = $3,
          secondary_color = $4,
          accent_color = $5,
          contact_name = $6,
          contact_phone = $7,
          contact_email = $8,
          website_url = $9,
          updated_at = NOW()
        WHERE user_id = $10
        RETURNING *`,
        [
          data.agency_name,
          data.logo_url || null,
          data.primary_color,
          data.secondary_color,
          data.accent_color,
          data.contact_name || null,
          data.contact_phone || null,
          data.contact_email || null,
          data.website_url || null,
          user.id
        ]
      );
    } else {
      result = await pool.query(
        `INSERT INTO agency_branding (
          user_id, agency_name, logo_url, primary_color, secondary_color, accent_color,
          contact_name, contact_phone, contact_email, website_url
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *`,
        [
          user.id,
          data.agency_name,
          data.logo_url || null,
          data.primary_color,
          data.secondary_color,
          data.accent_color,
          data.contact_name || null,
          data.contact_phone || null,
          data.contact_email || null,
          data.website_url || null
        ]
      );
    }

    await pool.end();

    return NextResponse.json({
      success: true,
      branding: result.rows[0],
      message: existingResult.rows.length > 0 ? 'Branding aggiornato' : 'Branding creato'
    });

  } catch (error) {
    console.error('Agency branding POST error:', error);
    return NextResponse.json(
      { error: 'Errore nel salvataggio del branding.' },
      { status: 500 }
    );
  }
}
