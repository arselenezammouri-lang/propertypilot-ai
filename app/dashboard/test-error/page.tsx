"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function TestErrorContent() {
  const searchParams = useSearchParams();
  const trigger = searchParams.get("trigger");

  if (trigger === "1") {
    throw new Error("Test error boundary: dashboard");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Test Error Boundary</h1>
      <p className="text-muted-foreground mb-4">
        Apri <code className="bg-muted px-1 rounded">/dashboard/test-error?trigger=1</code> per
        forzare un errore e vedere l’error boundary. Senza <code>?trigger=1</code> questa pagina è
        normale.
      </p>
      <p className="text-sm text-muted-foreground">
        Route solo per test; puoi eliminare la cartella <code>app/dashboard/test-error</code> quando
        non serve più.
      </p>
    </div>
  );
}

export default function TestErrorPage() {
  return (
    <Suspense fallback={<div className="p-8">Caricamento...</div>}>
      <TestErrorContent />
    </Suspense>
  );
}
