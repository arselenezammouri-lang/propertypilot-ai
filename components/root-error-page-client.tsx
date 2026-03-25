/**
 * Global route error UI — used by `app/error.tsx` (inside LocaleProvider).
 */

'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { logger } from '@/lib/utils/safe-logger';
import { useLocale as useLocaleContext } from '@/lib/i18n/locale-context';
import { getTranslation, SupportedLocale } from '@/lib/i18n/dictionary';
import { SEO_APP_NAME } from '@/lib/i18n/root-site-metadata';

export function RootErrorPageClient({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { locale } = useLocaleContext();
  const t = getTranslation(locale as SupportedLocale).errors;

  useEffect(() => {
    logger.error('[GLOBAL ERROR] Unhandled route error', error, {
      digest: error.digest,
    });
  }, [error]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = `${t.somethingWentWrong} | ${SEO_APP_NAME}`;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', t.unexpectedError);
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.setAttribute('name', 'robots');
      document.head.appendChild(robots);
    }
    robots.setAttribute('content', 'noindex, nofollow');
  }, [t.somethingWentWrong, t.unexpectedError]);

  return (
    <div className="flex items-center justify-center min-h-screen p-4 diamond-force-black diamond-force-white-text">
      <Card className="max-w-md w-full border-red-500/30 bg-red-500/5 diamond-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-400">
            <AlertCircle className="h-5 w-5" aria-hidden />
            {t.somethingWentWrong}
          </CardTitle>
          <CardDescription>{t.unexpectedError}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            {error.message || t.unknownError}
          </div>
          {error.digest ? (
            <div className="text-xs text-muted-foreground font-mono">
              {t.errorId}: {error.digest}
            </div>
          ) : null}
          <div className="flex gap-2">
            <Button onClick={reset} variant="outline" className="flex-1">
              <RefreshCw className="h-4 w-4 mr-2" aria-hidden />
              {t.tryAgain}
            </Button>
            <Button onClick={() => (window.location.href = '/')} variant="default" className="flex-1">
              <Home className="h-4 w-4 mr-2" aria-hidden />
              {t.backToHome}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
