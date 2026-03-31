/**
 * Input Validation - Validazione centralizzata per input utente
 * 
 * Previene:
 * - SQL Injection
 * - XSS
 * - Invalid data types
 * - Missing required fields
 */

import { logger } from './safe-logger';

export interface ValidationResult {
  valid: boolean;
  error?: string;
  sanitized?: any;
}

/**
 * Sanitizza una stringa rimuovendo caratteri pericolosi
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .trim()
    .replace(/[<>]/g, '') // Rimuovi < e > per prevenire XSS
    .replace(/javascript:/gi, '') // Rimuovi javascript: protocol
    .replace(/on\w+=/gi, '') // Rimuovi event handlers
    .slice(0, 10000); // Limite massimo lunghezza
}

/**
 * Valida e sanitizza un email
 */
export function validateEmail(email: string): ValidationResult {
  if (!email || typeof email !== 'string') {
    return {
      valid: false,
      error: 'Email non valida',
    };
  }

  const sanitized = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(sanitized)) {
    return {
      valid: false,
      error: 'Formato email non valido',
    };
  }

  if (sanitized.length > 255) {
    return {
      valid: false,
      error: 'Email troppo lunga',
    };
  }

  return {
    valid: true,
    sanitized,
  };
}

/**
 * Valida e sanitizza un URL
 */
export function validateURL(url: string): ValidationResult {
  if (!url || typeof url !== 'string') {
    return {
      valid: false,
      error: 'URL non valido',
    };
  }

  const sanitized = url.trim();

  try {
    const parsed = new URL(sanitized);
    
    // Permetti solo http e https
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return {
        valid: false,
        error: 'URL deve usare protocollo http o https',
      };
    }

    return {
      valid: true,
      sanitized: parsed.toString(),
    };
  } catch {
    return {
      valid: false,
      error: 'URL non valido',
    };
  }
}

/**
 * Valida e sanitizza un numero di telefono
 */
export function validatePhone(phone: string): ValidationResult {
  if (!phone || typeof phone !== 'string') {
    return {
      valid: false,
      error: 'Numero di telefono non valido',
    };
  }

  // Rimuovi spazi, trattini, parentesi
  const sanitized = phone.replace(/[\s\-\(\)]/g, '');

  // Verifica che contenga solo numeri e opzionalmente +
  if (!/^\+?[0-9]{7,15}$/.test(sanitized)) {
    return {
      valid: false,
      error: 'Formato numero di telefono non valido',
    };
  }

  return {
    valid: true,
    sanitized,
  };
}

/**
 * Valida un ID (UUID o stringa alfanumerica)
 */
export function validateID(id: string): ValidationResult {
  if (!id || typeof id !== 'string') {
    return {
      valid: false,
      error: 'ID non valido',
    };
  }

  const sanitized = id.trim();

  // UUID v4 o stringa alfanumerica
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const alphanumericRegex = /^[a-zA-Z0-9_-]{1,100}$/;

  if (!uuidRegex.test(sanitized) && !alphanumericRegex.test(sanitized)) {
    return {
      valid: false,
      error: 'Formato ID non valido',
    };
  }

  return {
    valid: true,
    sanitized,
  };
}

/**
 * Valida un testo (per descrizioni, messaggi, ecc.)
 */
export function validateText(text: string, options: {
  minLength?: number;
  maxLength?: number;
  required?: boolean;
} = {}): ValidationResult {
  const { minLength = 0, maxLength = 50000, required = false } = options;

  if (!text) {
    if (required) {
      return {
        valid: false,
        error: 'Campo obbligatorio',
      };
    }
    return {
      valid: true,
      sanitized: '',
    };
  }

  if (typeof text !== 'string') {
    return {
      valid: false,
      error: 'Deve essere un testo',
    };
  }

  const sanitized = sanitizeString(text);

  if (sanitized.length < minLength) {
    return {
      valid: false,
      error: `Testo troppo corto (minimo ${minLength} caratteri)`,
    };
  }

  if (sanitized.length > maxLength) {
    return {
      valid: false,
      error: `Testo troppo lungo (massimo ${maxLength} caratteri)`,
    };
  }

  return {
    valid: true,
    sanitized,
  };
}

/**
 * Valida un oggetto con schema
 */
export function validateObject<T extends Record<string, any>>(
  obj: any,
  schema: {
    [K in keyof T]: (value: any) => ValidationResult;
  }
): ValidationResult {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return {
      valid: false,
      error: 'Deve essere un oggetto',
    };
  }

  const sanitized: any = {};
  const errors: string[] = [];

  for (const [key, validator] of Object.entries(schema)) {
    const value = obj[key];
    const result = validator(value);

    if (!result.valid) {
      errors.push(`${key}: ${result.error}`);
    } else {
      sanitized[key] = result.sanitized !== undefined ? result.sanitized : value;
    }
  }

  if (errors.length > 0) {
    return {
      valid: false,
      error: errors.join(', '),
    };
  }

  return {
    valid: true,
    sanitized,
  };
}

/**
 * Valida un array
 */
export function validateArray<T>(
  arr: any,
  itemValidator?: (item: any) => ValidationResult,
  options: {
    minLength?: number;
    maxLength?: number;
    required?: boolean;
  } = {}
): ValidationResult {
  const { minLength = 0, maxLength = 1000, required = false } = options;

  if (!arr) {
    if (required) {
      return {
        valid: false,
        error: 'Array obbligatorio',
      };
    }
    return {
      valid: true,
      sanitized: [],
    };
  }

  if (!Array.isArray(arr)) {
    return {
      valid: false,
      error: 'Deve essere un array',
    };
  }

  if (arr.length < minLength) {
    return {
      valid: false,
      error: `Array troppo corto (minimo ${minLength} elementi)`,
    };
  }

  if (arr.length > maxLength) {
    return {
      valid: false,
      error: `Array troppo lungo (massimo ${maxLength} elementi)`,
    };
  }

  if (itemValidator) {
    const sanitized: any[] = [];
    const errors: string[] = [];

    for (let i = 0; i < arr.length; i++) {
      const result = itemValidator(arr[i]);
      if (!result.valid) {
        errors.push(`Elemento ${i}: ${result.error}`);
      } else {
        sanitized.push(result.sanitized !== undefined ? result.sanitized : arr[i]);
      }
    }

    if (errors.length > 0) {
      return {
        valid: false,
        error: errors.join(', '),
      };
    }

    return {
      valid: true,
      sanitized,
    };
  }

  return {
    valid: true,
    sanitized: arr,
  };
}
