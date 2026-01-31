/**
 * API Wrapper - Wrapper per gestire automaticamente errori e validazione
 * 
 * Fornisce:
 * - Gestione errori automatica
 * - Validazione input
 * - Logging sicuro
 * - Response formattate
 */

import { NextRequest, NextResponse } from 'next/server';
import { logger } from './safe-logger';
import { formatErrorResponse, toAPIError } from '@/lib/errors/api-errors';
import { createClient } from '@/lib/supabase/server';
import { requireActiveSubscription } from './subscription-check';

type Handler = (req: NextRequest, context: HandlerContext) => Promise<NextResponse>;
type Validator = (body: any) => { valid: boolean; error?: string };

interface HandlerContext {
  user: {
    id: string;
    email?: string;
  };
  supabase: any;
  body?: any;
}

interface ApiWrapperOptions {
  requireAuth?: boolean;
  requireSubscription?: boolean;
  requireProSubscription?: boolean;
  validateBody?: Validator;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
}

/**
 * Wrapper principale per API routes
 */
export function apiWrapper(
  handler: Handler,
  options: ApiWrapperOptions = {}
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const startTime = Date.now();
    const method = req.method;
    const path = req.nextUrl.pathname;

    try {
      // Log richiesta
      logger.apiRequest(method, path);

      // Verifica metodo HTTP
      if (options.method && method !== options.method) {
        return NextResponse.json(
          { error: `Method ${method} not allowed. Use ${options.method}` },
          { status: 405 }
        );
      }

      // Autenticazione
      let user: HandlerContext['user'] | null = null;
      let supabase: any = null;

      if (options.requireAuth !== false) {
        try {
          supabase = await createClient();
          const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

          if (authError || !authUser) {
            logger.warn('Unauthorized API request', { path, method });
            return NextResponse.json(
              { error: 'Non autorizzato. Effettua il login per continuare.' },
              { status: 401 }
            );
          }

          user = {
            id: authUser.id,
            email: authUser.email,
          };
        } catch (authErr) {
          logger.error('Auth check failed', authErr, { path, method });
          return NextResponse.json(
            { error: 'Errore di autenticazione. Riprova più tardi.' },
            { status: 401 }
          );
        }
      }

      // Validazione body (solo per POST/PUT/PATCH)
      let body: any = null;
      if (['POST', 'PUT', 'PATCH'].includes(method)) {
        try {
          body = await req.json();
        } catch (parseError) {
          // Body opzionale, non è un errore se non c'è
          body = null;
        }

        if (options.validateBody && body) {
          const validation = options.validateBody(body);
          if (!validation.valid) {
            logger.warn('Invalid request body', { path, method, error: validation.error });
            return NextResponse.json(
              { error: validation.error || 'Dati non validi' },
              { status: 400 }
            );
          }
        }
      }

      // Verifica subscription
      if (options.requireSubscription && user) {
        const subscriptionCheck = await requireActiveSubscription(supabase, user.id);
        
        if (!subscriptionCheck.allowed) {
          logger.subscriptionCheck(false, subscriptionCheck.planType || 'free', { path, method });
          return NextResponse.json(
            {
              error: subscriptionCheck.error || 'Questa funzionalità richiede un abbonamento attivo.',
              requiresSubscription: true,
            },
            { status: 403 }
          );
        }

        logger.subscriptionCheck(true, subscriptionCheck.planType, { path, method });
      }

      // Verifica subscription PRO/AGENCY
      if (options.requireProSubscription && user) {
        const { requireProOrAgencySubscription } = await import('./subscription-check');
        const subscriptionCheck = await requireProOrAgencySubscription(supabase, user.id);
        
        if (!subscriptionCheck.allowed) {
          logger.subscriptionCheck(false, subscriptionCheck.planType || 'free', { path, method });
          return NextResponse.json(
            {
              error: subscriptionCheck.error || 'Questa funzionalità richiede un abbonamento PRO o AGENCY.',
              requiresProSubscription: true,
            },
            { status: 403 }
          );
        }

        logger.subscriptionCheck(true, subscriptionCheck.planType, { path, method });
      }

      // Esegui handler
      const context: HandlerContext = {
        user: user!,
        supabase,
        body,
      };

      const response = await handler(req, context);
      const duration = Date.now() - startTime;

      // Log risposta
      logger.apiResponse(method, path, response.status, { duration: `${duration}ms` });

      return response;

    } catch (error: any) {
      const duration = Date.now() - startTime;
      const apiError = toAPIError(error, `API ${method} ${path}`);

      logger.error(`API Error: ${method} ${path}`, error, {
        duration: `${duration}ms`,
        statusCode: apiError.statusCode,
      });

      const formattedError = formatErrorResponse(apiError);
      return NextResponse.json(formattedError, { status: apiError.statusCode });
    }
  };
}

/**
 * Helper per creare validatori comuni
 */
export const validators = {
  required: (fields: string[]): Validator => {
    return (body: any) => {
      const missing = fields.filter(field => !body || body[field] === undefined || body[field] === null);
      if (missing.length > 0) {
        return {
          valid: false,
          error: `Campi mancanti: ${missing.join(', ')}`,
        };
      }
      return { valid: true };
    };
  },

  string: (field: string, minLength?: number, maxLength?: number): Validator => {
    return (body: any) => {
      if (!body || typeof body[field] !== 'string') {
        return {
          valid: false,
          error: `Il campo ${field} deve essere una stringa`,
        };
      }
      if (minLength && body[field].length < minLength) {
        return {
          valid: false,
          error: `Il campo ${field} deve essere lungo almeno ${minLength} caratteri`,
        };
      }
      if (maxLength && body[field].length > maxLength) {
        return {
          valid: false,
          error: `Il campo ${field} non può superare ${maxLength} caratteri`,
        };
      }
      return { valid: true };
    };
  },

  email: (field: string = 'email'): Validator => {
    return (body: any) => {
      if (!body || typeof body[field] !== 'string') {
        return {
          valid: false,
          error: `Il campo ${field} deve essere una stringa`,
        };
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body[field])) {
        return {
          valid: false,
          error: `Il campo ${field} deve essere un indirizzo email valido`,
        };
      }
      return { valid: true };
    };
  },

  combine: (...validators: Validator[]): Validator => {
    return (body: any) => {
      for (const validator of validators) {
        const result = validator(body);
        if (!result.valid) {
          return result;
        }
      }
      return { valid: true };
    };
  },
};
