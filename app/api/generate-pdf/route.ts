import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { renderToBuffer } from '@react-pdf/renderer';
import { GeneratePdfRequestSchema, PdfGenerationResult, AgencyBrandingData } from '@/lib/pdf/types';
import { ModernTemplate } from '@/lib/pdf/templates/modern-template';
import { LuxuryTemplate } from '@/lib/pdf/templates/luxury-template';
import sharp from 'sharp';
import { Pool } from '@neondatabase/serverless';
import { logger } from '@/lib/utils/safe-logger';

const ALLOWED_IMAGE_DOMAINS = [
  'immobiliare.it',
  'idealista.it',
  'casa.it',
  'subito.it',
  'zillow.com',
  'zillowstatic.com',
  'images.unsplash.com',
  'picsum.photos',
  'cloudinary.com',
  'imgix.net',
  'amazonaws.com',
  's3.amazonaws.com',
];

const BLOCKED_IP_PATTERNS = [
  /^127\./,
  /^10\./,
  /^172\.(1[6-9]|2[0-9]|3[01])\./,
  /^192\.168\./,
  /^169\.254\./,
  /^0\./,
  /^localhost/i,
  /metadata\.google/i,
  /169\.254\.169\.254/,
];

function isAllowedImageUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    
    if (!['http:', 'https:'].includes(url.protocol)) {
      logger.warn('[PDF] Invalid protocol', { protocol: url.protocol });
      return false;
    }
    
    const hostname = url.hostname.toLowerCase();
    for (const pattern of BLOCKED_IP_PATTERNS) {
      if (pattern.test(hostname)) {
        logger.warn('[PDF] Blocked IP pattern', { hostname });
        return false;
      }
    }
    
    const isAllowed = ALLOWED_IMAGE_DOMAINS.some(domain => 
      hostname === domain || hostname.endsWith('.' + domain)
    );
    
    if (!isAllowed) {
      logger.warn('[PDF] Domain not in allowlist', { hostname });
    }
    
    return isAllowed;
  } catch {
    logger.warn('[PDF] Invalid URL', { url: urlString });
    return false;
  }
}

async function optimizeImage(imageUrl: string): Promise<string | null> {
  try {
    if (!isAllowedImageUrl(imageUrl)) {
      logger.error('[PDF] URL not allowed for security reasons', new Error('URL blocked'), { url: imageUrl.substring(0, 50) });
      return null;
    }
    
    logger.debug('[PDF] Optimizing image', { url: imageUrl.substring(0, 50) });
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Accept': 'image/*',
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeout);
    
    if (!response.ok) {
      logger.error('[PDF] Failed to fetch image', new Error(`HTTP ${response.status}`), { status: response.status });
      return null;
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType?.startsWith('image/')) {
      logger.error('[PDF] Invalid content type', new Error('Invalid content type'), { contentType });
      return null;
    }
    
    const contentLength = response.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) {
      logger.error('[PDF] Image too large', new Error('Image exceeds size limit'), { contentLength });
      return null;
    }
    
    const imageBuffer = await response.arrayBuffer();
    
    if (imageBuffer.byteLength > 10 * 1024 * 1024) {
      logger.error('[PDF] Image buffer too large', new Error('Buffer exceeds size limit'), { size: imageBuffer.byteLength });
      return null;
    }
    
    const optimizedBuffer = await sharp(Buffer.from(imageBuffer))
      .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer();
    
    const base64 = `data:image/jpeg;base64,${optimizedBuffer.toString('base64')}`;
    logger.debug('[PDF] Image optimized successfully');
    return base64;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      logger.error('[PDF] Image fetch timeout', new Error('Timeout'));
    } else {
      logger.error('[PDF] Image optimization error', error as Error);
    }
    return null;
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      logger.error('[PDF] Authentication failed', authError || new Error('No user'));
      return NextResponse.json(
        { success: false, error: 'Devi effettuare il login per generare PDF.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    const validationResult = GeneratePdfRequestSchema.safeParse(body);
    
    if (!validationResult.success) {
      logger.warn('[PDF] Validation failed', { errors: validationResult.error.errors });
      return NextResponse.json(
        { 
          success: false, 
          error: 'Dati non validi. Controlla i campi obbligatori.',
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;
    logger.debug('[PDF] Generating PDF with template', { template: data.template });

    let optimizedImages: string[] = [];
    if (data.images && data.images.length > 0) {
      logger.debug('[PDF] Processing images', { count: data.images.length });
      
      const imagePromises = data.images.slice(0, 6).map(url => optimizeImage(url));
      const results = await Promise.all(imagePromises);
      optimizedImages = results.filter((img): img is string => img !== null);
      
      logger.debug('[PDF] Optimized images successfully', { count: optimizedImages.length });
    }

    let agencyBranding: AgencyBrandingData | null = null;
    
    if (data.brandingMode === 'agency') {
      logger.debug('[PDF] Loading agency branding');
      try {
        const pool = new Pool({ connectionString: process.env.DATABASE_URL });
        const brandingResult = await pool.query(
          'SELECT * FROM agency_branding WHERE user_id = $1',
          [user.id]
        );
        await pool.end();
        
        if (brandingResult.rows.length > 0) {
          const row = brandingResult.rows[0];
          agencyBranding = {
            agency_name: row.agency_name,
            logo_url: row.logo_url,
            primary_color: row.primary_color || '#1E3A5F',
            secondary_color: row.secondary_color || '#60A5FA',
            accent_color: row.accent_color || '#F59E0B',
            contact_name: row.contact_name,
            contact_phone: row.contact_phone,
            contact_email: row.contact_email,
            website_url: row.website_url,
          };
          logger.debug('[PDF] Agency branding loaded', { agencyName: agencyBranding.agency_name });
        } else {
          logger.debug('[PDF] No agency branding found, using default');
        }
      } catch (error) {
        logger.error('[PDF] Error loading agency branding', error as Error);
      }
    }
    
    const TemplateComponent = data.template === 'luxury' ? LuxuryTemplate : ModernTemplate;
    
    logger.debug('[PDF] Rendering PDF');
    const pdfBuffer = await renderToBuffer(
      TemplateComponent({ data, optimizedImages, agencyBranding })
    );
    
    const brandPrefix = agencyBranding ? agencyBranding.agency_name.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 15) : 'PropertyPilotAI';
    const pdfBase64 = pdfBuffer.toString('base64');
    const fileName = `${brandPrefix}_${data.title.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30)}_${Date.now()}.pdf`;
    
    const duration = Date.now() - startTime;
    logger.debug('[PDF] Generated successfully', { duration });

    const result: PdfGenerationResult = {
      success: true,
      pdfBase64,
      fileName,
    };

    return NextResponse.json(result);

  } catch (error: any) {
    const duration = Date.now() - startTime;
    logger.error('[PDF] Generation error', error as Error, { duration });
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Errore durante la generazione del PDF. Riprova tra qualche istante.' 
      },
      { status: 500 }
    );
  }
}
