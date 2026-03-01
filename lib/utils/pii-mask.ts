/**
 * PII Masking - Sales Hook per Deal Elite
 * Maschera nomi e telefoni per utenti non Agency, mostrando un teaser (es: +39 **** 123)
 */

/**
 * Maschera un numero di telefono lasciando visibili ultime 3-4 cifre
 * Es: +39 333 1234567 → +39 *** *** 567
 */
export function maskPhone(phone: string | null | undefined): string {
  if (!phone || typeof phone !== 'string') return '*** *** ****';
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return '*** *** ****';
  const last = digits.slice(-3);
  const prefix = phone.startsWith('+') ? phone.match(/^\+\d{1,3}/)?.[0] || '+' : '';
  return `${prefix} *** *** ${last}`;
}

/**
 * Maschera un nome lasciando visibili le iniziali
 * Es: "Mario Rossi" → "M*** R***"
 */
export function maskName(name: string | null | undefined): string {
  if (!name || typeof name !== 'string') return '***';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '***';
  if (parts.length === 1) {
    const initial = parts[0][0]?.toUpperCase() || '';
    return initial + '***';
  }
  return parts
    .slice(0, 2)
    .map((p) => (p[0]?.toUpperCase() || '') + '***')
    .join(' ');
}
