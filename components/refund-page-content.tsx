"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";
import { getTranslation, type SupportedLocale } from "@/lib/i18n/dictionary";
import { RefreshCw, Clock, CheckCircle, AlertTriangle, Mail, CreditCard, XCircle } from "lucide-react";

export function RefundPageContent() {
  const { locale } = useLocaleContext();
  const copy = useMemo(() => getTranslation(locale as SupportedLocale).refundPolicyPage, [locale]);

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="mb-10 animate-fade-in-up">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl border border-[#fbbf24]/50 bg-[#fbbf24]/10 flex items-center justify-center">
            <RefreshCw className="h-7 w-7 text-[#fbbf24]" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold" data-testid="heading-refund">
              {copy.title}{" "}
              <span className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] bg-clip-text text-transparent">
                {copy.highlight}
              </span>
            </h1>
            <p className="text-white/60">{copy.updated}</p>
          </div>
        </div>
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
        <section className="diamond-card border border-white/[0.08] p-6 md:p-8 rounded-xl">
          <div className="flex items-start gap-4">
            <CheckCircle className="h-8 w-8 text-neon-aqua flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-bold mb-2">{copy.guaranteeTitle}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {copy.guaranteeBodyStart} <strong className="text-neon-aqua">{copy.guaranteeBodyStrong}</strong>{" "}
                {copy.guaranteeBodyEnd}
              </p>
            </div>
          </div>
        </section>

        <section className="diamond-card border border-white/[0.08] p-6 md:p-8 rounded-xl">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-electric-blue" />
            {copy.trialTitle}
          </h2>
          <div className="space-y-4">
            <div className="bg-electric-blue/5 p-4 rounded-lg border border-electric-blue/20">
              <h3 className="font-semibold text-electric-blue mb-2">{copy.freeTrialTitle}</h3>
              <p className="text-muted-foreground text-sm">{copy.freeTrialBody}</p>
            </div>
            <div className="bg-neon-aqua/5 p-4 rounded-lg border border-neon-aqua/20">
              <h3 className="font-semibold text-neon-aqua mb-2">{copy.guarantee14Title}</h3>
              <p className="text-muted-foreground text-sm">{copy.guarantee14Body}</p>
            </div>
          </div>
        </section>

        <section className="diamond-card border border-white/[0.08] p-6 md:p-8 rounded-xl">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-sunset-gold" />
            {copy.conditionsTitle}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">{copy.conditionsIntro}</p>
          <ul className="space-y-3">
            {copy.conditions.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-neon-aqua flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="diamond-card border border-white/[0.08] p-6 md:p-8 rounded-xl">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-500" />
            {copy.nonRefundableTitle}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">{copy.nonRefundableIntro}</p>
          <ul className="space-y-3">
            {copy.nonRefundable.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-red-500/70 flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="diamond-card border border-white/[0.08] p-6 md:p-8 rounded-xl">
          <h2 className="text-xl font-bold mb-4">{copy.cancelTitle}</h2>
          <p className="text-muted-foreground leading-relaxed">{copy.cancelIntro}</p>
          <ol className="list-decimal list-inside text-muted-foreground mt-4 space-y-2">
            {copy.cancelSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p className="text-muted-foreground leading-relaxed mt-4">
            <strong>{copy.cancelImportant}</strong> {copy.cancelImportantBody}
          </p>
        </section>

        <section className="diamond-card border border-white/[0.08] p-6 md:p-8 rounded-xl">
          <h2 className="text-xl font-bold mb-4">{copy.processTitle}</h2>
          <div className="space-y-4">
            {copy.process.map((item) => (
              <div key={`${item.step}-${item.title}`} className="flex items-start gap-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    item.step === "✓" ? "bg-neon-aqua/20 text-neon-aqua" : "bg-royal-purple/20 text-royal-purple"
                  }`}
                >
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="diamond-card border border-white/[0.08] p-6 md:p-8 rounded-xl">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            {copy.boostTitle}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {copy.boostIntro} <strong>{copy.boostProductLabel}</strong> {copy.boostBody}
          </p>
          <ul className="list-disc list-inside text-muted-foreground mt-4 space-y-2">
            {copy.boostRules.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="diamond-card border border-white/[0.08] p-6 md:p-8 rounded-xl border-2 border-royal-purple/30">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Mail className="h-5 w-5 text-royal-purple" />
            {copy.contactTitle}
          </h2>
          <p className="text-muted-foreground leading-relaxed">{copy.contactIntro}</p>
          <ul className="text-muted-foreground mt-4 space-y-2">
            <li>
              <strong>{copy.refundEmail}</strong>{" "}
              <a href="mailto:billing@propertypilotai.com" className="text-royal-purple hover:underline">
                billing@propertypilotai.com
              </a>
            </li>
            <li>
              <strong>{copy.supportEmail}</strong>{" "}
              <a href="mailto:support@propertypilotai.com" className="text-royal-purple hover:underline">
                support@propertypilotai.com
              </a>
            </li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-4">{copy.contactOutro}</p>
        </section>
      </div>

      <div className="mt-12 flex flex-wrap gap-4 justify-center">
        <Link href="/terms">
          <Button variant="outline" className="gap-2">
            <CreditCard className="h-4 w-4" />
            {copy.terms}
          </Button>
        </Link>
        <Link href="/privacy">
          <Button variant="outline" className="gap-2">
            <CreditCard className="h-4 w-4" />
            {copy.privacy}
          </Button>
        </Link>
        <Link href="/pricing">
          <Button className="neon-button gap-2">{copy.pricing}</Button>
        </Link>
      </div>
    </main>
  );
}
