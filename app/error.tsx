/**
 * Global Error Page - Gestisce errori a livello di route
 * Next.js chiama automaticamente questa pagina quando c'è un errore non gestito
 */

'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { logger } from '@/lib/utils/safe-logger';
import { useLocale as useLocaleContext } from '@/lib/i18n/locale-context';
import { getTranslation, SupportedLocale } from '@/lib/i18n/dictionary';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { locale } = useLocaleContext();
  const t = getTranslation(locale as SupportedLocale);

  useEffect(() => {
    // Log error usando logger sicuro
    logger.error('[GLOBAL ERROR] Unhandled route error', error, {
      digest: error.digest,
    });

  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen p-4 diamond-force-black diamond-force-white-text">
      <Card className="max-w-md w-full border-red-500/30 bg-red-500/5 diamond-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-400">
            <AlertCircle className="h-5 w-5" />
            {t.errors?.somethingWentWrong ?? 'Something went wrong'}
          </CardTitle>
          <CardDescription>
            {t.errors?.unexpectedError ?? 'An unexpected error occurred. Your data is safe.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            {error.message || (t.errors?.unknownError ?? 'Unknown error')}
          </div>
          {error.digest && (
            <div className="text-xs text-muted-foreground font-mono">
              {t.errors?.errorId ?? 'Error ID'}: {error.digest}
            </div>
          )}
          <div className="flex gap-2">
            <Button
              onClick={reset}
              variant="outline"
              className="flex-1"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {t.errors?.tryAgain ?? 'Try again'}
            </Button>
            <Button
              onClick={() => window.location.href = '/'}
              variant="default"
              className="flex-1"
            >
              <Home className="h-4 w-4 mr-2" />
              {t.errors?.backToHome ?? 'Back to Home'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
