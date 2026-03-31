/**
 * Centralized API Error Handling System
 * Provides user-friendly error messages for common failure scenarios
 */

export class APIError extends Error {
  constructor(
    message: string,
    public userMessage: string,
    public statusCode: number = 500,
    public suggestion?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export class OpenAIQuotaError extends APIError {
  constructor() {
    super(
      'OpenAI quota exceeded',
      'Il servizio AI è temporaneamente non disponibile. Il nostro team è stato notificato.',
      503,
      'Riprova tra qualche minuto. Se il problema persiste, contatta il supporto.'
    );
    this.name = 'OpenAIQuotaError';
  }
}

export class ScraperBlockedError extends APIError {
  constructor(portalName?: string) {
    const portal = portalName ? ` ${portalName}` : '';
    super(
      'Scraping blocked by portal protection',
      `Il portale${portal} ha bloccato la richiesta automatica.`,
      403,
      'Copia e incolla manualmente il testo dell\'annuncio nella sezione "Inserisci Testo" oppure prova con un URL diverso.'
    );
    this.name = 'ScraperBlockedError';
  }
}

export class RateLimitError extends APIError {
  constructor() {
    super(
      'Rate limit exceeded',
      'Troppe richieste in poco tempo.',
      429,
      'Attendi qualche secondo e riprova.'
    );
    this.name = 'RateLimitError';
  }
}

/**
 * Detect OpenAI quota/billing errors from error object
 */
export function isOpenAIQuotaError(error: any): boolean {
  if (!error) return false;
  
  const errorString = JSON.stringify(error).toLowerCase();
  const errorMessage = error.message?.toLowerCase() || '';
  const errorCode = error.code?.toLowerCase() || '';
  
  return (
    errorCode === 'insufficient_quota' ||
    errorString.includes('insufficient_quota') ||
    errorString.includes('quota') && errorString.includes('exceeded') ||
    errorMessage.includes('quota') ||
    errorMessage.includes('billing')
  );
}

/**
 * Detect 403 Forbidden errors from scraping
 */
export function isScraperBlockedError(error: any): boolean {
  if (!error) return false;
  
  const status = error.status || error.response?.status || error.statusCode;
  const errorMessage = error.message?.toLowerCase() || '';
  
  return (
    status === 403 ||
    errorMessage.includes('403') ||
    errorMessage.includes('forbidden')
  );
}

/**
 * Detect rate limit errors
 */
export function isRateLimitError(error: any): boolean {
  if (!error) return false;
  
  const status = error.status || error.response?.status || error.statusCode;
  const errorMessage = error.message?.toLowerCase() || '';
  
  return (
    status === 429 ||
    errorMessage.includes('rate limit') ||
    errorMessage.includes('too many requests')
  );
}

/**
 * Convert any error to user-friendly APIError
 */
export function toAPIError(error: any, context?: string): APIError {
  // Already an APIError
  if (error instanceof APIError) {
    return error;
  }
  
  // OpenAI quota errors
  if (isOpenAIQuotaError(error)) {
    return new OpenAIQuotaError();
  }
  
  // Scraper blocked errors
  if (isScraperBlockedError(error)) {
    return new ScraperBlockedError();
  }
  
  // Rate limit errors
  if (isRateLimitError(error)) {
    return new RateLimitError();
  }
  
  // Generic error
  const message = error.message || 'Si è verificato un errore imprevisto';
  const contextPrefix = context ? `${context}: ` : '';
  
  return new APIError(
    error.message || 'Unknown error',
    `${contextPrefix}${message}`,
    error.statusCode || error.status || 500,
    'Riprova. Se il problema persiste, contatta il supporto.'
  );
}

/**
 * Format error for API response
 */
export function formatErrorResponse(error: any, context?: string) {
  const apiError = toAPIError(error, context);
  
  return {
    error: apiError.name,
    message: apiError.userMessage,
    suggestion: apiError.suggestion,
    // Include technical details only in development
    ...(process.env.NODE_ENV === 'development' && {
      details: apiError.message,
      stack: apiError.stack
    })
  };
}
