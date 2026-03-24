import { cookies } from 'next/headers';
import { locales, type Locale } from '@/lib/i18n/config';

/**
 * Reads `propertypilot_locale` (same cookie as root `generateMetadata` / `LocaleProvider`).
 * Defaults to `en` when missing or invalid.
 */
export async function getServerLocaleFromCookies(): Promise<Locale> {
  const cookieStore = await cookies();
  const raw = cookieStore.get('propertypilot_locale')?.value;
  if (raw && locales.includes(raw as Locale)) {
    return raw as Locale;
  }
  return 'en';
}
