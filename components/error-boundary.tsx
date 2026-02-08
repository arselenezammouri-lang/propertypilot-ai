"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { logger } from '@/lib/utils/safe-logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary per gestire errori React in modo elegante
 * Mostra messaggi user-friendly invece di crashare l'app
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error usando logger sicuro (senza dati sensibili)
    logger.error('[ERROR BOUNDARY] React component error', error, {
      componentStack: errorInfo.componentStack?.substring(0, 200),
    });

    // Callback opzionale
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center min-h-[400px] p-4">
          <Card className="max-w-md w-full border-red-500/30 bg-red-500/5">
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
                {this.state.error?.message || 'Errore sconosciuto'}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={this.handleReset}
                  variant="outline"
                  className="flex-1"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Riprova
                </Button>
                <Button
                  onClick={() => window.location.reload()}
                  variant="default"
                  className="flex-1"
                >
                  Ricarica Pagina
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook per gestire errori API in modo elegante
 */
export function useAPIErrorHandler() {
  const handleAPIError = (error: any, context?: string): string => {
    // Sanitizza errori per non esporre dati sensibili
    if (error?.message?.includes('API_KEY') || error?.message?.includes('SECRET')) {
      return 'Errore di configurazione. Contatta il supporto.';
    }

    if (error?.message?.includes('quota') || error?.message?.includes('billing')) {
      return 'Quota AI temporaneamente esaurita. Riprova tra qualche minuto.';
    }

    if (error?.message?.includes('rate limit') || error?.code === 429) {
      return 'Troppe richieste. Attendi qualche secondo prima di riprovare.';
    }

    if (error?.message?.includes('timeout') || error?.code === 'ETIMEDOUT') {
      return 'Il servizio sta impiegando troppo tempo. Riprova tra qualche secondo.';
    }

    // Messaggio generico user-friendly
    const contextMsg = context ? `${context}: ` : '';
    return `${contextMsg}${error?.message || 'Si è verificato un errore. Riprova più tardi.'}`;
  };

  return { handleAPIError };
}
