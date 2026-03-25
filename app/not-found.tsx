import type { Metadata } from 'next';
import { NotFoundPageClient } from '@/components/not-found-page-client';
import { getServerLocaleFromCookies } from '@/lib/i18n/server-locale';
import { buildNotFoundPageMetadata } from '@/lib/i18n/page-metadata-builders';
import type { SupportedLocale } from '@/lib/i18n/dictionary';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocaleFromCookies();
  return buildNotFoundPageMetadata(locale as SupportedLocale);
}

export default function NotFound() {
  return <NotFoundPageClient />;
}
