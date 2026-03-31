'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';
import { useLocale as useLocaleContext } from '@/lib/i18n/locale-context';
import { getTranslation, SupportedLocale } from '@/lib/i18n/dictionary';

export default function NotFound() {
  const { locale } = useLocaleContext();
  const t = getTranslation(locale as SupportedLocale);

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-6xl font-black diamond-text-gradient">404</h1>
        <h2 className="text-2xl font-bold text-foreground">{t.errors?.pageNotFound ?? 'Page not found'}</h2>
        <p className="text-gray-400 diamond-text-muted">
          {t.errors?.pageNotFoundDesc ?? 'The page you are looking for does not exist or has been moved.'}
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button className="diamond-button-primary">
              <Home className="h-4 w-4 mr-2" />
              {t.errors?.backToHome ?? 'Back to Home'}
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button className="diamond-button-secondary">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t.errors?.dashboard ?? 'Dashboard'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
