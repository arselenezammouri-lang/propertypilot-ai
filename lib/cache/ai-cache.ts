import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export interface CachedAIResponse {
  id: string;
  cache_key: string;
  prompt_type: 'audit' | 'generate' | 'analyze' | 'generate_all' | 'lead_score' | 'audit_listing_v2' | 'lead_enrich';
  input_hash: string;
  response_data: any;
  created_at: string;
  expires_at: string;
  hit_count: number;
}

export interface CacheOptions {
  ttl?: number;
  enabled?: boolean;
}

export function generateCacheKey(content: string, promptType: string): string {
  const normalized = content.trim().toLowerCase();
  
  const hash = crypto
    .createHash('sha256')
    .update(normalized + promptType)
    .digest('hex');
  
  return `${promptType}:${hash.substring(0, 32)}`;
}

export class AICacheService {
  private enabled: boolean;
  private defaultTTL: number;

  constructor(options: CacheOptions = {}) {
    this.enabled = options.enabled ?? true;
    this.defaultTTL = options.ttl ?? 86400;
  }

  async get(content: string, promptType: string): Promise<any | null> {
    if (!this.enabled) {
      return null;
    }

    try {
      const cacheKey = generateCacheKey(content, promptType);

      const { data, error } = await supabaseAdmin
        .from('ai_response_cache')
        .select('*')
        .eq('cache_key', cacheKey)
        .gt('expires_at', new Date().toISOString())
        .maybeSingle();

      if (error) {
        console.error('[AI CACHE] Error fetching from cache:', error);
        return null;
      }

      if (data) {
        supabaseAdmin
          .from('ai_response_cache')
          .update({ hit_count: (data.hit_count || 0) + 1 })
          .eq('id', data.id)
          .then(() => {});

        return data.response_data;
      }

      return null;
    } catch (error) {
      console.error('[AI CACHE] Error in get:', error);
      return null;
    }
  }

  async set(
    content: string,
    promptType: string,
    response: any,
    ttl?: number
  ): Promise<void> {
    if (!this.enabled) {
      return;
    }

    try {
      const cacheKey = generateCacheKey(content, promptType);
      const inputHash = crypto
        .createHash('sha256')
        .update(content.trim())
        .digest('hex')
        .substring(0, 32);
      const expiresAt = new Date(Date.now() + (ttl || this.defaultTTL) * 1000);

      const { error } = await supabaseAdmin
        .from('ai_response_cache')
        .upsert({
          cache_key: cacheKey,
          prompt_type: promptType,
          input_hash: inputHash,
          response_data: response,
          expires_at: expiresAt.toISOString(),
          hit_count: 0,
        }, {
          onConflict: 'cache_key',
        });

      if (error) {
        console.error('[AI CACHE] Error storing in cache:', error);
      }
    } catch (error) {
      console.error('[AI CACHE] Error in set:', error);
    }
  }

  async clearExpired(): Promise<number> {
    try {
      const { data, error } = await supabaseAdmin
        .from('ai_response_cache')
        .delete()
        .lt('expires_at', new Date().toISOString())
        .select('id');

      if (error) {
        console.error('[AI CACHE] Error clearing expired:', error);
        return 0;
      }

      const count = data?.length || 0;
      return count;
    } catch (error) {
      console.error('[AI CACHE] Error in clearExpired:', error);
      return 0;
    }
  }

  async getStats(): Promise<{
    totalEntries: number;
    totalHits: number;
    avgHitCount: number;
    cacheHitRate: string;
  }> {
    try {
      const { data, error } = await supabaseAdmin
        .from('ai_response_cache')
        .select('hit_count')
        .gt('expires_at', new Date().toISOString());

      if (error || !data) {
        return { totalEntries: 0, totalHits: 0, avgHitCount: 0, cacheHitRate: '0%' };
      }

      const totalEntries = data.length;
      const totalHits = data.reduce((sum, row) => sum + (row.hit_count || 0), 0);
      const avgHitCount = totalEntries > 0 ? totalHits / totalEntries : 0;

      return {
        totalEntries,
        totalHits,
        avgHitCount: Math.round(avgHitCount * 100) / 100,
        cacheHitRate: totalEntries > 0 ? `${Math.round((totalHits / (totalHits + totalEntries)) * 100)}%` : '0%',
      };
    } catch (error) {
      console.error('[AI CACHE] Error getting stats:', error);
      return { totalEntries: 0, totalHits: 0, avgHitCount: 0, cacheHitRate: '0%' };
    }
  }
}

let cacheServiceInstance: AICacheService | null = null;

export function getAICacheService(): AICacheService {
  if (!cacheServiceInstance) {
    cacheServiceInstance = new AICacheService();
  }
  return cacheServiceInstance;
}
