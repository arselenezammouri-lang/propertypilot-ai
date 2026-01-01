import { supabaseService } from '@/lib/supabase/service';

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
 */
export async function incrementGenerationCount(userId: string): Promise<void> {
  const supabase = supabaseService;
  
  try {
    // Atomic increment using RPC function
    const { data, error } = await supabase.rpc('increment_generation_count', {
      p_user_id: userId
    });
    
    if (error) {
      console.error('Failed to increment generation count via RPC:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to increment generation count:', error);
    // Don't throw - count update failure shouldn't block generation
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
