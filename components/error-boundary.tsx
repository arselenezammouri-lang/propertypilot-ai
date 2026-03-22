"use client";

import React, { Component, ErrorInfo, ReactNode, useCallback, useMemo } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { logger } from '@/lib/utils/safe-logger';
import { useLocale } from '@/lib/i18n/locale-context';
import type { ErrorBoundaryUi } from '@/lib/i18n/error-boundary-ui';
import { errorBoundaryModuleUiEn } from '@/lib/i18n/error-boundary-ui';
import { getTranslation, type SupportedLocale } from '@/lib/i18n/dictionary';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  locale?: string;
  /** Copy for the default error card (from `getTranslation(locale).errorBoundaryModule.boundary`) */
  errorUi?: ErrorBoundaryUi;
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

      const eb = this.props.errorUi ?? errorBoundaryModuleUiEn.boundary;

      return (
        <div className="flex items-center justify-center min-h-[400px] p-4">
          <Card className="max-w-md w-full border-red-500/30 bg-red-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                <AlertCircle className="h-5 w-5" />
                {eb.title}
              </CardTitle>
              <CardDescription>{eb.desc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                {this.state.error?.message || eb.unknown}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={this.handleReset}
                  variant="outline"
                  className="flex-1"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {eb.retry}
                </Button>
                <Button
                  onClick={() => window.location.reload()}
                  variant="default"
                  className="flex-1"
                >
                  {eb.reload}
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
 * Wrapper funzionale che inietta automaticamente il locale nell'ErrorBoundary
 */
export function LocalizedErrorBoundary({ children, fallback, onError }: Omit<Props, 'locale' | 'errorUi'>) {
  const { locale } = useLocale();
  const errorUi = getTranslation(locale as SupportedLocale).errorBoundaryModule.boundary;
  return (
    <ErrorBoundary locale={locale} errorUi={errorUi} fallback={fallback} onError={onError}>
      {children}
    </ErrorBoundary>
  );
}

/**
 * Hook per gestire errori API in modo elegante
 */
export function useAPIErrorHandler() {
  const { locale } = useLocale();
  const apiHandler = useMemo(
    () => getTranslation(locale as SupportedLocale).errorBoundaryModule.apiHandler,
    [locale]
  );

  const handleAPIError = useCallback(
    (error: any, context?: string): string => {
      if (error?.message?.includes('API_KEY') || error?.message?.includes('SECRET')) {
        return apiHandler.configError;
      }

      if (error?.message?.includes('quota') || error?.message?.includes('billing')) {
        return apiHandler.quotaError;
      }

      if (error?.message?.includes('rate limit') || error?.code === 429) {
        return apiHandler.rateLimitError;
      }

      if (error?.message?.includes('timeout') || error?.code === 'ETIMEDOUT') {
        return apiHandler.timeoutError;
      }

      const contextMsg = context ? `${context}: ` : '';
      return `${contextMsg}${error?.message || apiHandler.genericError}`;
    },
    [apiHandler]
  );

  return { handleAPIError };
}
