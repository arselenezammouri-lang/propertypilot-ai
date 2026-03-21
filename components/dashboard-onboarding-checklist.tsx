"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useLocale } from "@/lib/i18n/locale-context";
import { getTranslation, type SupportedLocale } from "@/lib/i18n/dictionary";
import { CheckCircle2, Circle, ListChecks, X } from "lucide-react";

const STORAGE_KEY = "propertypilot_onboarding_checklist_v1";
const DISMISSED_KEY = "propertypilot_onboarding_checklist_dismissed_v1";

type StepId = "generate" | "library" | "pipeline" | "billing" | "workspace";

type StepDef = {
  id: StepId;
  href: string;
  autoPathPrefixes: string[];
};

const STEPS: StepDef[] = [
  {
    id: "generate",
    href: "/dashboard/perfect-copy",
    autoPathPrefixes: [
      "/dashboard/perfect-copy",
      "/dashboard/refine-listing",
      "/dashboard/titles",
      "/dashboard/emotional-listing",
      "/dashboard/translate",
      "/dashboard/social-posts",
    ],
  },
  {
    id: "library",
    href: "/dashboard/listings",
    autoPathPrefixes: ["/dashboard/listings"],
  },
  {
    id: "pipeline",
    href: "/dashboard/leads/pipeline",
    autoPathPrefixes: ["/dashboard/leads/pipeline"],
  },
  {
    id: "billing",
    href: "/dashboard/billing",
    autoPathPrefixes: ["/dashboard/billing"],
  },
  {
    id: "workspace",
    href: "/dashboard/settings/workspace",
    autoPathPrefixes: ["/dashboard/settings/workspace"],
  },
];

function loadSet(): Set<StepId> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((x): x is StepId => typeof x === "string" && STEPS.some((s) => s.id === x)));
  } catch {
    return new Set();
  }
}

function saveSet(done: Set<StepId>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...done]));
}

function isDismissed(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(DISMISSED_KEY) === "true";
}

function setDismissed() {
  if (typeof window === "undefined") return;
  localStorage.setItem(DISMISSED_KEY, "true");
}

function pathAutoCompletes(pathname: string, prefixes: string[]): boolean {
  return prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function DashboardOnboardingChecklist() {
  const pathname = usePathname() ?? "";
  const { locale } = useLocale();
  const t = getTranslation(locale as SupportedLocale).dashboard.onboardingChecklist;
  const [done, setDone] = useState<Set<StepId>>(() => new Set());
  const [dismissed, setDismissedState] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setDone(loadSet());
    setDismissedState(isDismissed());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || pathname === "") return;
    setDone((prev) => {
      let next = prev;
      let changed = false;
      for (const step of STEPS) {
        if (!prev.has(step.id) && pathAutoCompletes(pathname, step.autoPathPrefixes)) {
          if (!changed) next = new Set(prev);
          next.add(step.id);
          changed = true;
        }
      }
      if (changed) saveSet(next);
      return changed ? next : prev;
    });
  }, [hydrated, pathname]);

  const stepCopy = useMemo(
    () => ({
      generate: t.steps.generate,
      library: t.steps.library,
      pipeline: t.steps.pipeline,
      billing: t.steps.billing,
      workspace: t.steps.workspace,
    }),
    [t.steps]
  );

  const total = STEPS.length;
  const doneCount = STEPS.filter((s) => done.has(s.id)).length;
  const allDone = doneCount === total;

  const toggle = useCallback((id: StepId) => {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      saveSet(next);
      return next;
    });
  }, []);

  const dismiss = useCallback(() => {
    setDismissed();
    setDismissedState(true);
  }, []);

  if (!hydrated || dismissed || pathname !== "/dashboard") {
    return null;
  }

  return (
    <section className="dashboard-section mb-6" aria-label={t.title}>
      <Card className="futuristic-card border-royal-purple/20 bg-card/80 backdrop-blur-sm overflow-hidden">
        <CardHeader className="pb-3 space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3 min-w-0">
              <div className="mt-0.5 rounded-lg bg-gradient-to-br from-royal-purple/20 to-electric-blue/20 p-2 shrink-0">
                <ListChecks className="h-5 w-5 text-royal-purple" aria-hidden />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-lg sm:text-xl">{t.title}</CardTitle>
                <CardDescription className="mt-1">{t.subtitle}</CardDescription>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={dismiss}
              className="shrink-0 h-11 min-h-11 touch-manipulation text-muted-foreground self-start sm:self-auto"
              aria-label={t.dismissAria}
            >
              <X className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">{t.dismiss}</span>
            </Button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{t.progress.replace("{done}", String(doneCount)).replace("{total}", String(total))}</span>
              {allDone ? <span className="text-neon-aqua font-medium">{t.allDone}</span> : null}
            </div>
            <Progress value={(doneCount / total) * 100} className="h-2" />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <ul className="space-y-2">
            {STEPS.map((step) => {
              const copy = stepCopy[step.id];
              const isDone = done.has(step.id);
              return (
                <li
                  key={step.id}
                  className="flex flex-col gap-2 rounded-lg border border-border/60 bg-muted/20 p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <Checkbox
                      id={`onboarding-step-${step.id}`}
                      checked={isDone}
                      onCheckedChange={() => toggle(step.id)}
                      className="mt-1 shrink-0"
                      aria-label={copy.title}
                    />
                    <label htmlFor={`onboarding-step-${step.id}`} className="min-w-0 cursor-pointer space-y-0.5">
                      <span className="flex items-center gap-2 font-medium text-sm">
                        {isDone ? (
                          <CheckCircle2 className="h-4 w-4 text-neon-aqua shrink-0" aria-hidden />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden />
                        )}
                        {copy.title}
                      </span>
                      <span className="block text-xs text-muted-foreground">{copy.description}</span>
                    </label>
                  </div>
                  <Button
                    asChild
                    variant={isDone ? "outline" : "secondary"}
                    size="sm"
                    className="w-full sm:w-auto shrink-0 h-11 min-h-11 touch-manipulation"
                  >
                    <Link href={step.href}>{copy.cta}</Link>
                  </Button>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}
