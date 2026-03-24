"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Download, FileText, Lock, Globe, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/lib/i18n/locale-context";
import { getTranslation, type SupportedLocale } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/config";
import { formatDateForLocale } from "@/lib/i18n/intl";
import type { ComplianceCountryCode } from "@/lib/i18n/compliance-center-ui";

export default function CompliancePage() {
  const { locale } = useLocale();
  const { toast } = useToast();
  const [selectedCountry, setSelectedCountry] = useState<ComplianceCountryCode>("IT");
  const t = getTranslation(locale as SupportedLocale).complianceCenter;
  const intlLocale = locale as Locale;
  const docList = t.documents[selectedCountry] ?? [];

  const handleDownload = (docType: string) => {
    const filename = `${docType}_${selectedCountry}_${new Date().getFullYear()}.pdf`;
    toast({
      title: t.downloadStarted,
      description: t.downloadDesc.replace("{filename}", filename),
    });
  };

  return (
    <main
      id="main-content"
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="min-h-screen bg-[#0a0a0a] text-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/30 to-cyan-500/30 flex items-center justify-center border border-purple-500/50">
              <Shield className="h-6 w-6 text-purple-400" aria-hidden />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">{t.pageTitle}</h1>
              <p className="text-muted-foreground mt-1">{t.pageSubtitle}</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-purple-500/30 bg-gradient-to-br from-[#0a0a0a] to-purple-900/10">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-purple-400 shrink-0" aria-hidden />
                <CardTitle className="text-lg text-white">{t.encTitle}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300">{t.encDesc}</p>
            </CardContent>
          </Card>

          <Card className="border-cyan-500/30 bg-gradient-to-br from-[#0a0a0a] to-cyan-900/10">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-cyan-400 shrink-0" aria-hidden />
                <CardTitle className="text-lg text-white">{t.gdprTitle}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300">{t.gdprDesc}</p>
            </CardContent>
          </Card>

          <Card className="border-green-500/30 bg-gradient-to-br from-[#0a0a0a] to-green-900/10">
            <CardHeader>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" aria-hidden />
                <CardTitle className="text-lg text-white">{t.certTitle}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300">{t.certDesc}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-purple-500/30 bg-gradient-to-br from-[#0a0a0a] to-purple-900/10 mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-white">{t.countryTitle}</CardTitle>
            <CardDescription className="text-white/60">{t.countryDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {t.countries.map((country) => (
                <Button
                  key={country.code}
                  variant={selectedCountry === country.code ? "default" : "outline"}
                  onClick={() => setSelectedCountry(country.code)}
                  className={`h-auto py-4 ${
                    selectedCountry === country.code
                      ? "bg-purple-500 hover:bg-purple-600"
                      : "border-purple-500/30 hover:border-purple-500/50"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2 w-full">
                    <span
                      className="font-mono text-xs tracking-widest text-white/80 border border-white/20 rounded px-2 py-0.5"
                      aria-hidden
                    >
                      {country.code}
                    </span>
                    <span className="text-sm font-semibold text-center leading-tight">
                      {country.name}
                    </span>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-cyan-500/30 bg-gradient-to-br from-[#0a0a0a] to-cyan-900/10">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-cyan-400 shrink-0" aria-hidden />
              {t.docsTitle}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {docList.map((doc) => (
                <div
                  key={`${doc.type}-${doc.name}`}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-[#111111] border border-cyan-500/20 rounded-lg hover:border-cyan-500/40 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="h-5 w-5 text-cyan-400 shrink-0" aria-hidden />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white break-words">{doc.name}</p>
                      <p className="text-xs text-gray-400">
                        {t.updated}{" "}
                        {formatDateForLocale(new Date(), intlLocale)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {doc.available ? (
                      <>
                        <Badge className="bg-green-500 text-white">
                          <CheckCircle2 className="h-3 w-3 mr-1" aria-hidden />
                          {t.available}
                        </Badge>
                        <Button
                          size="sm"
                          onClick={() => handleDownload(doc.type)}
                          className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                        >
                          <Download className="h-4 w-4 mr-2" aria-hidden />
                          {t.downloadPdf}
                        </Button>
                      </>
                    ) : (
                      <Badge variant="outline" className="border-white/10 text-white/40">
                        {t.comingSoon}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
