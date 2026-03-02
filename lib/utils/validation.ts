/**
 * Re-export da input-validation.ts per compatibilità e audit.
 * La logica di validazione è in lib/utils/input-validation.ts.
 */
export {
  sanitizeString,
  validateEmail,
  validateURL,
  validatePhone,
  validateID,
  validateText,
  validateObject,
  validateArray,
  type ValidationResult,
} from './input-validation';
