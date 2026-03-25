"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useLocale } from "@/lib/i18n/locale-context";
import { getTranslation, type SupportedLocale } from "@/lib/i18n/dictionary";
import {
  DEV_TEST_ERROR_FOLDER_PATH,
  DEV_TEST_ERROR_TRIGGER_PATH,
  DEV_TEST_ERROR_WITHOUT_QUERY,
} from "@/lib/i18n/dev-test-error-ui";

function TestErrorContent() {
  const searchParams = useSearchParams();
  const trigger = searchParams.get("trigger");
  const { locale } = useLocale();
  const t = getTranslation(locale as SupportedLocale).devTestError;

  if (trigger === "1") {
    throw new Error("Test error boundary: dashboard");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{t.title}</h1>
      <p className="text-muted-foreground mb-4">
        {t.body1BeforeTrigger}
        <code className="bg-muted px-1 rounded">{DEV_TEST_ERROR_TRIGGER_PATH}</code>
        {t.body1BetweenTriggerAndWithout}
        <code className="bg-muted px-1 rounded">{DEV_TEST_ERROR_WITHOUT_QUERY}</code>
        {t.body1AfterWithout}
      </p>
      <p className="text-sm text-muted-foreground">
        {t.body2BeforeFolder}
        <code className="bg-muted px-1 rounded">{DEV_TEST_ERROR_FOLDER_PATH}</code>
        {t.body2AfterFolder}
      </p>
    </div>
  );
}

export function DevTestErrorPageClient() {
  const { locale } = useLocale();
  const loading = getTranslation(locale as SupportedLocale).common.loading;

  return (
    <Suspense fallback={<div className="p-8">{loading}</div>}>
      <TestErrorContent />
    </Suspense>
  );
}
