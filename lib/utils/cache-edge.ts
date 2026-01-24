/**
 * Infrastructure Scaling - Edge Cache
 * Sistema di cache per ottimizzare chiamate Supabase
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class EdgeCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private maxSize: number = 1000; // Max entries

  /**
   * Ottiene un valore dalla cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Controlla se è scaduto
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Salva un valore nella cache
   */
  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    // Rimuovi entry più vecchie se cache piena
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Invalida una chiave specifica
   */
  invalidate(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Invalida tutte le entry che matchano un pattern
   */
  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Pulisce tutta la cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Ottiene statistiche cache
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Singleton instance
export const edgeCache = new EdgeCache();

/**
 * Wrapper per chiamate Supabase con cache
 */
export async function cachedSupabaseQuery<T>(
  key: string,
  queryFn: () => Promise<T>,
  ttl: number = 5 * 60 * 1000 // 5 minuti default
): Promise<T> {
  // Controlla cache
  const cached = edgeCache.get<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Esegui query
  const data = await queryFn();

  // Salva in cache
  edgeCache.set(key, data, ttl);

  return data;
}

