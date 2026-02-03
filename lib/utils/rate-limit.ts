import { supabaseService } from '@/lib/supabase/service';
import { STRIPE_PLANS } from '@/lib/stripe/config';

interface RateLimitResult {
  allowed: boolean;
  remaining?: number;
  resetAt?: Date;
  message?: string;
}

/**
 * Rate limiting per user: max 10 generations per minute
 * Uses service role client to bypass RLS
 */
export async function checkUserRateLimit(userId: string): Promise<RateLimitResult> {
  const supabase = supabaseService;
  
  const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
  
  try {
    const { count, error } = await supabase
      .from('generation_logs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', oneMinuteAgo.toISOString());
    
    if (error) {
      console.error('Rate limit check error:', error);
      return { allowed: true }; // Fail open to avoid blocking users on DB errors
    }
    
    const currentCount = count || 0;
    const maxPerMinute = 10;
    
    if (currentCount >= maxPerMinute) {
      const resetAt = new Date(Date.now() + 60 * 1000);
      return {
        allowed: false,
        remaining: 0,
        resetAt,
        message: `Limite raggiunto: massimo ${maxPerMinute} generazioni al minuto. Riprova tra ${Math.ceil((resetAt.getTime() - Date.now()) / 1000)} secondi.`
      };
    }
    
    return {
      allowed: true,
      remaining: maxPerMinute - currentCount,
      resetAt: new Date(Date.now() + 60 * 1000)
    };
  } catch (error) {
    console.error('Rate limit check failed:', error);
    return { allowed: true }; // Fail open
  }
}

/**
 * Rate limiting per IP: max 20 generations per minute (protects against abuse)
 * Uses service role client to bypass RLS
 */
export async function checkIpRateLimit(ipAddress: string): Promise<RateLimitResult> {
  const supabase = supabaseService;
  
  const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
  
  try {
    const { count, error } = await supabase
      .from('generation_logs')
      .select('*', { count: 'exact', head: true })
      .eq('ip_address', ipAddress)
      .gte('created_at', oneMinuteAgo.toISOString());
    
    if (error) {
      console.error('IP rate limit check error:', error);
      return { allowed: true }; // Fail open
    }
    
    const currentCount = count || 0;
    const maxPerMinute = 20;
    
    if (currentCount >= maxPerMinute) {
      return {
        allowed: false,
        remaining: 0,
        message: 'Troppi tentativi da questo indirizzo IP. Riprova tra 1 minuto.'
      };
    }
    
    return {
      allowed: true,
      remaining: maxPerMinute - currentCount
    };
  } catch (error) {
    console.error('IP rate limit check failed:', error);
    return { allowed: true }; // Fail open
  }
}

/**
 * Log a generation attempt (for both tracking and rate limiting)
 * Uses service role client to bypass RLS
 */
export async function logGeneration(userId: string, ipAddress: string | null): Promise<void> {
  const supabase = supabaseService;
  
  try {
    const { error } = await supabase
      .from('generation_logs')
      .insert({
        user_id: userId,
        ip_address: ipAddress
      });

    if (error) {
      console.error('Failed to log generation:', error);
    }
  } catch (error) {
    console.error('Failed to log generation:', error);
    // Don't throw - logging failure shouldn't block generation
  }
}

/**
 * Increment generation count for subscription tracking
 * Uses atomic increment RPC to avoid race conditions
 * Uses service role client to bypass RLS
 * Also triggers upgrade nudge email at 50% usage
 */
export async function incrementGenerationCount(userId: string): Promise<void> {
  const supabase = supabaseService;
  
  try {
    const { data, error } = await supabase.rpc('increment_generation_count', {
      p_user_id: userId
    });
    
    if (error) {
      console.error('Failed to increment generation count via RPC:', error);
      throw error;
    }

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('generations_count, status')
      .eq('user_id', userId)
      .single();

    if (subscription) {
      const plan = subscription.status || 'free';
      const planConfig = STRIPE_PLANS[plan as keyof typeof STRIPE_PLANS];
      const limit = planConfig?.limits?.listingsPerMonth || 5;
      const currentUsage = subscription.generations_count || 0;
      
      const halfLimit = Math.floor(limit * 0.5);
      if (limit > 0 && plan !== 'agency' && currentUsage >= halfLimit && currentUsage < halfLimit + 3) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('upgrade_email_sent')
          .eq('id', userId)
          .single();

        if (!(profile as any)?.upgrade_email_sent) {
          try {
            const { getResendClient } = await import('@/lib/resend-client');
            const { emailTemplates } = await import('@/lib/email-templates');
            
            const { data: userData } = await supabase.auth.admin.getUserById(userId);
            
            if (userData?.user?.email) {
              const { client, fromEmail } = await getResendClient();
              const userName = userData.user.email.split('@')[0];
              const emailContent = emailTemplates.upgradeNudge(userName, currentUsage, limit);
              
              await client.emails.send({
                from: fromEmail,
                to: userData.user.email,
                subject: emailContent.subject,
                html: emailContent.html,
              });
              
              await supabase
                .from('profiles')
                .update({ upgrade_email_sent: true })
                .eq('id', userId);
              
              console.log('[RATE LIMIT] Upgrade nudge email sent to:', userData.user.email);
            }
          } catch (emailErr) {
            console.error('[RATE LIMIT] Upgrade nudge email error:', emailErr);
          }
        }
      }
    }
  } catch (error) {
    console.error('Failed to increment generation count:', error);
  }
}

/**
 * Get client IP address from Next.js request
 */
export function getClientIp(request: Request): string | null {
  // Try various headers that might contain the real IP
  const headers = [
    'x-real-ip',
    'x-forwarded-for',
    'cf-connecting-ip', // Cloudflare
    'x-vercel-forwarded-for' // Vercel
  ];
  
  for (const header of headers) {
    const value = request.headers.get(header);
    if (value) {
      // x-forwarded-for can be a comma-separated list, take the first one
      return value.split(',')[0].trim();
    }
  }
  
  return null;
}
