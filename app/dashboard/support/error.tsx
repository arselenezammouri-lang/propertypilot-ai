'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error('Support page error:', error); }, [error]);

  return (
    <div className="p-6 max-w-3xl mx-auto text-center py-20">
      <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
      <h2 className="text-lg font-semibold text-foreground mb-2">Something went wrong</h2>
      <p className="text-muted-foreground mb-4">{error?.message || 'An unexpected error occurred.'}</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
