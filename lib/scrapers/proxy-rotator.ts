/**
 * Proxy Rotator - Simula rotazione IP residenziali
 * Per evitare blocchi di Idealista, Immobiliare, Zillow
 */

import { ProxyConfig, getRandomProxy, getRandomUserAgent, getBrowserHeaders, getRandomDelay } from './config';

export interface RotatedRequest {
  userAgent: string;
  headers: Record<string, string>;
  proxy?: ProxyConfig;
  delay: number;
}

/**
 * Prepara una richiesta con rotazione completa
 */
export function prepareRotatedRequest(): RotatedRequest {
  const userAgent = getRandomUserAgent();
  const headers = getBrowserHeaders(userAgent);
  const proxy = getRandomProxy();
  const delay = getRandomDelay();

  return {
    userAgent,
    headers,
    proxy: proxy || undefined,
    delay,
  };
}

/**
 * Applica il delay prima della richiesta
 */
export async function applyHumanDelay(delay: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Esegue una richiesta con retry automatico e rotazione
 */
export async function fetchWithRotation(
  url: string,
  options: RequestInit = {},
  maxRetries: number = 3
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // Prepara rotazione
      const rotated = prepareRotatedRequest();

      // Applica delay umano
      if (attempt === 0) {
        await applyHumanDelay(rotated.delay);
      } else {
        // Backoff esponenziale per retry
        const backoffDelay = 1000 * Math.pow(2, attempt);
        await applyHumanDelay(backoffDelay);
      }

      // Costruisci opzioni richiesta
      const requestOptions: RequestInit = {
        ...options,
        headers: {
          ...rotated.headers,
          ...(options.headers || {}),
        },
      };

      // Se proxy configurato, aggiungi (richiede libreria esterna come 'https-proxy-agent')
      // Per ora, usiamo fetch standard (in produzione: integrare con proxy HTTP)

      // Esegui richiesta
      const response = await fetch(url, requestOptions);

      // Controlla se bloccato
      if (response.status === 403 || response.status === 429) {
        throw new Error(`Blocked by server (${response.status})`);
      }

      return response;
    } catch (error) {
      lastError = error as Error;
      console.warn(`[PROXY ROTATOR] Attempt ${attempt + 1} failed:`, error);

      if (attempt < maxRetries - 1) {
        // Continua con retry
        continue;
      }
    }
  }

  throw new Error(`Failed after ${maxRetries} attempts: ${lastError?.message}`);
}

/**
 * Simula comportamento umano: scroll, pause, etc.
 */
export async function simulateHumanBehavior(): Promise<void> {
  // Pausa casuale tra 1-3 secondi
  const pause = 1000 + Math.random() * 2000;
  await new Promise((resolve) => setTimeout(resolve, pause));
}

