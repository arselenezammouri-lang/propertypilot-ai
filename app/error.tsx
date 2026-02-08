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

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
            Qualcosa è andato storto
          </CardTitle>
          <CardDescription>
            Si è verificato un errore imprevisto. Non ti preoccupare, i tuoi dati sono al sicuro.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            {error.message || 'Errore sconosciuto'}
          </div>
          {error.digest && (
            <div className="text-xs text-muted-foreground font-mono">
              ID Errore: {error.digest}
            </div>
          )}
          <div className="flex gap-2">
            <Button
              onClick={reset}
              variant="outline"
              className="flex-1"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Riprova
            </Button>
            <Button
              onClick={() => window.location.href = '/'}
              variant="default"
              className="flex-1"
            >
              <Home className="h-4 w-4 mr-2" />
              Torna alla Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
