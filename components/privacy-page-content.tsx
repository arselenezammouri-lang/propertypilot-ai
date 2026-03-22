"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";
import { getTranslation, type SupportedLocale } from "@/lib/i18n/dictionary";
import type { PrivacyPolicySectionUi } from "@/lib/i18n/privacy-policy-page-ui";
import { Shield, Lock, Eye, Database, Globe, UserCheck, Mail } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICON_BY_KEY: Record<NonNullable<PrivacyPolicySectionUi["iconKey"]>, LucideIcon> = {
  eye: Eye,
  database: Database,
  lock: Lock,
  globe: Globe,
  userCheck: UserCheck,
  mail: Mail,
};

export function PrivacyPageContent() {
  const { locale } = useLocaleContext();
  const page = useMemo(() => getTranslation(locale as SupportedLocale).privacyPolicyPage, [locale]);

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="mb-10 animate-fade-in-up">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl border border-[#06b6d4]/50 bg-[#06b6d4]/10 flex items-center justify-center">
            <Shield className="h-7 w-7 text-[#06b6d4]" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold" data-testid="heading-privacy">
              {page.title}{" "}
              <span className="bg-gradient-to-r from-[#9333ea] to-[#06b6d4] bg-clip-text text-transparent">
                {page.highlight}
              </span>
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
              {section.body?.map((paragraph) => (
                <p key={paragraph} className="text-white/70 leading-relaxed mt-4 first:mt-0">
                  {paragraph.includes("privacy@propertypilotai.com") && paragraph.startsWith("Email:") ? (
                    <>
                      Email:{" "}
                      <a href="mailto:privacy@propertypilotai.com" className="text-royal-purple hover:underline">
                        privacy@propertypilotai.com
                      </a>
                    </>
                  ) : (
                    paragraph
                  )}
                </p>
              ))}
              {section.lists?.map((group) => (
                <div key={group.title} className="mt-4 space-y-2">
                  <h3 className="font-semibold text-foreground">{group.title}</h3>
                  <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
              {section.items ? (
                <ul className="list-disc list-inside text-muted-foreground mt-4 space-y-2">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
              {section.contacts ? (
                <ul className="text-muted-foreground mt-4 space-y-2">
                  {section.contacts.map((contact) => (
                    <li key={contact}>
                      {contact.startsWith("Email:") ? (
                        <>
                          Email:{" "}
                          <a href="mailto:privacy@propertypilotai.com" className="text-royal-purple hover:underline">
                            privacy@propertypilotai.com
                          </a>
                        </>
                      ) : (
                        contact
                      )}
                    </li>
                  ))}
                </ul>
              ) : null}
              {section.noteKey === "exerciseRights" ? (
                <p className="text-white/70 leading-relaxed mt-4">
                  {page.exerciseRightsPrefix}
                  <a href="mailto:privacy@propertypilotai.com" className="text-royal-purple hover:underline">
                    privacy@propertypilotai.com
                  </a>
                  {page.exerciseRightsSuffix}
                </p>
              ) : null}
              {section.noteKey === "dpaItaly" ? (
                <p className="text-white/70 leading-relaxed mt-4">
                  {page.dpaItalyBefore}
                  <a
                    href={page.dpaLinkHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-royal-purple hover:underline"
                  >
                    {page.dpaLinkLabel}
                  </a>
                  {page.dpaItalyAfter}
                </p>
              ) : null}
              {section.note && !section.noteKey ? <p className="text-white/70 leading-relaxed mt-4">{section.note}</p> : null}
            </section>
          );
        })}
      </div>

      <div className="mt-12 flex flex-wrap gap-4 justify-center">
        <Link href="/terms">
          <Button variant="outline" className="gap-2">
            <Lock className="h-4 w-4" />
            {page.terms}
          </Button>
        </Link>
        <Link href="/refund">
          <Button variant="outline" className="gap-2">
            <Shield className="h-4 w-4" />
            {page.refund}
          </Button>
        </Link>
      </div>
    </main>
  );
}
