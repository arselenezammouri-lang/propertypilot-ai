"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Book,
  Zap,
  Phone,
  Box,
  Target,
  Building2,
  Map,
  FileText,
  Sparkles,
  TrendingDown,
  ArrowRight,
  Users,
  CreditCard,
  Rocket,
  Lightbulb,
  Glasses,
} from "lucide-react";
import Link from "next/link";
import { useLocale } from "@/lib/i18n/locale-context";
import { getTranslation, type SupportedLocale } from "@/lib/i18n/dictionary";
import { DOCS_INDEX_QUICK_LINK_PATHS } from "@/lib/docs/doc-static-links";
import type { DocsHubSection } from "@/lib/i18n/docs-hub-ui";

export const dynamic = "force-static";

const SECTION_ICONS: Record<DocsHubSection["id"], ReactNode> = {
  "getting-started": <Book className="h-5 w-5" />,
  crm: <Users className="h-5 w-5" />,
  account: <CreditCard className="h-5 w-5" />,
  prospecting: <Zap className="h-5 w-5" />,
  "ai-voice": <Phone className="h-5 w-5" />,
  "3d-staging": <Box className="h-5 w-5" />,
  "aura-vr": <Glasses className="h-5 w-5" />,
  "price-sniper": <Target className="h-5 w-5" />,
  commercial: <Building2 className="h-5 w-5" />,
  territory: <Map className="h-5 w-5" />,
  "smart-briefing": <FileText className="h-5 w-5" />,
  xray: <Sparkles className="h-5 w-5" />,
  competitor: <TrendingDown className="h-5 w-5" />,
};

export default function DocumentationPage() {
  const { locale } = useLocale();
  const [searchQuery, setSearchQuery] = useState("");

  const t = useMemo(() => getTranslation(locale as SupportedLocale).docsHub, [locale]);

  const filteredSections = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return t.sections.map((section) => ({ ...section, icon: SECTION_ICONS[section.id] }));
    }
    return t.sections
      .map((section) => ({
        ...section,
        icon: SECTION_ICONS[section.id],
        articles: section.articles.filter(
          (article) =>
            article.title.toLowerCase().includes(q) || article.description.toLowerCase().includes(q)
        ),
      }))
      .filter((section) => section.articles.length > 0);
  }, [t.sections, searchQuery]);

  return (
    <main id="main-content" className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">{t.pageTitle}</h1>
          <p className="text-muted-foreground text-lg">{t.pageSubtitle}</p>
        </div>

        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 bg-background/50 border-purple-500/30 focus:border-purple-500 text-white"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSections.map((section) => (
            <Card
              key={section.id}
              className="border-purple-500/30 bg-gradient-to-br from-[#0a0a0a] to-purple-900/10 hover:border-purple-500/50 transition-colors"
            >
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">{section.icon}</div>
                  <CardTitle className="text-xl text-white">{section.title}</CardTitle>
                </div>
                <CardDescription className="text-gray-400">
                  {section.articles.length}{" "}
                  {section.articles.length === 1 ? t.articleSingular : t.articlePlural}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {section.articles.map((article) => (
                    <Link
                      key={article.id}
                      href={`/docs/${article.slug}`}
                      className="block p-3 rounded-lg bg-white/[0.03] border border-white/10 hover:border-purple-500/50 transition-colors group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-white mb-1 group-hover:text-purple-400 transition-colors">
                            {article.title}
                          </h3>
                          <p className="text-xs text-gray-400">{article.description}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-500 group-hover:text-purple-400 transition-colors flex-shrink-0 mt-0.5" />
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card className="border-cyan-500/30 bg-gradient-to-br from-[#0a0a0a] to-cyan-900/10">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Rocket className="h-5 w-5 text-cyan-400 shrink-0" aria-hidden />
                {t.quickStartTitle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300 mb-4">{t.quickStartDesc}</p>
              <Link href={DOCS_INDEX_QUICK_LINK_PATHS.quickStart}>
                <Button variant="outline" className="w-full border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10">
                  {t.quickStartBtn}
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-purple-500/30 bg-gradient-to-br from-[#0a0a0a] to-purple-900/10">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-purple-400 shrink-0" aria-hidden />
                {t.bestPracticesTitle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300 mb-4">{t.bestPracticesDesc}</p>
              <Link href={DOCS_INDEX_QUICK_LINK_PATHS.bestPractices}>
                <Button variant="outline" className="w-full border-purple-500/30 text-purple-400 hover:bg-purple-500/10">
                  {t.bestPracticesBtn}
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-green-500/30 bg-gradient-to-br from-[#0a0a0a] to-green-900/10">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Target className="h-5 w-5 text-green-400 shrink-0" aria-hidden />
                {t.goalsTitle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300 mb-4">{t.goalsDesc}</p>
              <Link href={DOCS_INDEX_QUICK_LINK_PATHS.goals}>
                <Button variant="outline" className="w-full border-green-500/30 text-green-400 hover:bg-green-500/10">
                  {t.goalsBtn}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
