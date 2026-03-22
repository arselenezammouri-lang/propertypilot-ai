"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";
import { getTranslation, type SupportedLocale } from "@/lib/i18n/dictionary";
import type { TermsPolicySectionUi } from "@/lib/i18n/terms-policy-page-ui";
import { FileText, Scale, Shield, AlertTriangle, CheckCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICON_BY_KEY: Record<NonNullable<TermsPolicySectionUi["iconKey"]>, LucideIcon> = {
  fileText: FileText,
  shield: Shield,
  checkCircle: CheckCircle,
  alertTriangle: AlertTriangle,
};

export function TermsPageContent() {
  const { locale } = useLocaleContext();
  const page = useMemo(() => getTranslation(locale as SupportedLocale).termsPolicyPage, [locale]);

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="mb-10 animate-fade-in-up">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl border border-[#9333ea]/50 bg-[#9333ea]/10 flex items-center justify-center">
            <Scale className="h-7 w-7 text-[#9333ea]" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold" data-testid="heading-terms">
              {page.title} <span className="gradient-text-purple">{page.highlight}</span>
            </h1>
            <p className="text-white/60">{page.updated}</p>
          </div>
        </div>
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
        {page.sections.map((section) => {
          const Icon = section.iconKey ? ICON_BY_KEY[section.iconKey] : undefined;
          return (
            <section key={section.title} className="diamond-card border border-white/[0.08] p-6 md:p-8 rounded-xl">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                {Icon ? <Icon className={`h-5 w-5 ${section.color ?? "text-electric-blue"}`} /> : null}
                {section.title}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-muted-foreground leading-relaxed mt-4 first:mt-0">
                  {paragraph}
                </p>
              ))}
              {section.items ? (
                <ul className="list-disc list-inside text-muted-foreground mt-4 space-y-2">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
              {section.note ? <p className="text-muted-foreground leading-relaxed mt-4">{section.note}</p> : null}
              {section.linkText ? (
                <p className="text-muted-foreground leading-relaxed mt-4">
                  {section.linkIntro}{" "}
                  <Link href="/refund" className="text-royal-purple hover:underline">
                    {section.linkText}
                  </Link>
                  .
                </p>
              ) : null}
              {section.contacts ? (
                <ul className="text-muted-foreground mt-4 space-y-2">
                  {section.contacts.map((contact) => (
                    <li key={contact}>
                      {contact.startsWith("Email:") ? (
                        <>
                          Email:{" "}
                          <a href="mailto:legal@propertypilotai.com" className="text-royal-purple hover:underline">
                            legal@propertypilotai.com
                          </a>
                        </>
                      ) : (
                        <>
                          Support:{" "}
                          <a href="mailto:support@propertypilotai.com" className="text-royal-purple hover:underline">
                            support@propertypilotai.com
                          </a>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          );
        })}
      </div>

      <div className="mt-12 flex flex-wrap gap-4 justify-center">
        <Link href="/privacy">
          <Button variant="outline" className="gap-2">
            <Shield className="h-4 w-4" />
            {page.privacy}
          </Button>
        </Link>
        <Link href="/refund">
          <Button variant="outline" className="gap-2">
            <FileText className="h-4 w-4" />
            {page.refund}
          </Button>
        </Link>
      </div>
    </main>
  );
}
