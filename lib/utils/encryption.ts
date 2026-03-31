/**
 * Global Compliance Shield - Encryption
 * Crittografia AES-256 per dati sensibili (numeri di telefono, email)
 */

import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;
const ITERATIONS = 100000;

/**
 * Deriva una chiave da una password usando PBKDF2
 */
function deriveKey(password: string, salt: Buffer): Buffer {
  return crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, 'sha512');
}

/**
 * Cripta un valore sensibile
 */
export function encryptSensitiveData(
  text: string,
  secretKey: string = process.env.ENCRYPTION_KEY || 'default-key-change-in-production'
): string {
  try {
    const salt = crypto.randomBytes(SALT_LENGTH);
    const key = deriveKey(secretKey, salt);
    const iv = crypto.randomBytes(IV_LENGTH);
    
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag();
    
    // Ritorna: salt:iv:tag:encrypted
    return `${salt.toString('hex')}:${iv.toString('hex')}:${tag.toString('hex')}:${encrypted}`;
  } catch (error) {
    console.error('[ENCRYPTION] Error encrypting:', error);
    throw new Error('Encryption failed');
  }
}

/**
 * Decripta un valore sensibile
 */
export function decryptSensitiveData(
  encryptedText: string,
  secretKey: string = process.env.ENCRYPTION_KEY || 'default-key-change-in-production'
): string {
  try {
    const parts = encryptedText.split(':');
    if (parts.length !== 4) {
      throw new Error('Invalid encrypted data format');
    }
    
    const [saltHex, ivHex, tagHex, encrypted] = parts;
    
    const salt = Buffer.from(saltHex, 'hex');
    const key = deriveKey(secretKey, salt);
    const iv = Buffer.from(ivHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('[ENCRYPTION] Error decrypting:', error);
    throw new Error('Decryption failed');
  }
}

/**
 * Hash sicuro per numeri di telefono (one-way)
 */
export function hashPhoneNumber(phoneNumber: string): string {
  return crypto
    .createHash('sha256')
    .update(phoneNumber + (process.env.HASH_SALT || 'default-salt'))
    .digest('hex');
}

