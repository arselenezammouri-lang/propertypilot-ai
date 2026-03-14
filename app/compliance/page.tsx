"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Download, FileText, Lock, Globe, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/lib/i18n/locale-context";

export default function CompliancePage() {
  const router = useRouter();
  const { locale } = useLocale();
  const isItalian = locale === "it";
  const { toast } = useToast();
  const [selectedCountry, setSelectedCountry] = useState<string>('IT');

  const t = {
    pageTitle: "Compliance Center",
    pageSubtitle: isItalian
      ? "Documenti legali pre-compilati per il tuo paese"
      : "Pre-compiled legal documents for your country",
    encTitle: "Crittografia AES-256",
    encDesc: isItalian
      ? "Tutti i dati sensibili (telefoni, email) sono criptati con standard bancario."
      : "All sensitive data (phones, emails) are encrypted with banking-grade standards.",
    gdprTitle: "GDPR Compliant",
    gdprDesc: isItalian
      ? "Conformità totale con GDPR, CCPA e normative internazionali."
      : "Full compliance with GDPR, CCPA and international regulations.",
    certTitle: isItalian ? "Certificazioni" : "Certifications",
    certDesc: isItalian
      ? "ISO 27001, SOC 2 Type II (in corso di certificazione)."
      : "ISO 27001, SOC 2 Type II (certification in progress).",
    countryTitle: isItalian ? "Seleziona il tuo Paese" : "Select your Country",
    countryDesc: isItalian
      ? "I documenti verranno generati secondo le normative del paese selezionato"
      : "Documents will be generated according to the regulations of the selected country",
    docsTitle: isItalian ? "Documenti Disponibili" : "Available Documents",
    updated: isItalian ? "Aggiornato:" : "Updated:",
    available: isItalian ? "Disponibile" : "Available",
    comingSoon: isItalian ? "In arrivo" : "Coming Soon",
    downloadPdf: isItalian ? "Scarica PDF" : "Download PDF",
    downloadStarted: isItalian ? "Download avviato" : "Download started",
    downloadDesc: (filename: string) => isItalian ? `Scaricando ${filename}...` : `Downloading ${filename}...`,
  };

  const countries = [
    { code: 'IT', name: 'Italia', flag: '🇮🇹' },
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'ES', name: 'España', flag: '🇪🇸' },
    { code: 'FR', name: 'France', flag: '🇫🇷' },
    { code: 'DE', name: 'Deutschland', flag: '🇩🇪' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  ];

  const documents = {
    IT: [
      { name: 'Privacy Policy (GDPR)', type: 'privacy', available: true },
      { name: 'Terms of Service', type: 'terms', available: true },
      { name: 'Cookie Policy', type: 'cookies', available: true },
      { name: 'Data Processing Agreement', type: 'dpa', available: true },
    ],
    US: [
      { name: 'Privacy Policy (CCPA)', type: 'privacy', available: true },
      { name: 'Terms of Service', type: 'terms', available: true },
      { name: 'Cookie Policy', type: 'cookies', available: true },
    ],
    ES: [
      { name: 'Política de Privacidad (GDPR)', type: 'privacy', available: true },
      { name: 'Términos de Servicio', type: 'terms', available: true },
    ],
    FR: [
      { name: 'Politique de Confidentialité (RGPD)', type: 'privacy', available: true },
      { name: 'Conditions d\'Utilisation', type: 'terms', available: true },
    ],
    DE: [
      { name: 'Datenschutzerklärung (DSGVO)', type: 'privacy', available: true },
      { name: 'Nutzungsbedingungen', type: 'terms', available: true },
    ],
    GB: [
      { name: 'Privacy Policy (GDPR)', type: 'privacy', available: true },
      { name: 'Terms of Service', type: 'terms', available: true },
    ],
  };

  const handleDownload = (docType: string) => {
    // In produzione: generare PDF dinamico o scaricare da storage
    const filename = `${docType}_${selectedCountry}_${new Date().getFullYear()}.pdf`;
    // Simula download
    toast({ title: t.downloadStarted, description: t.downloadDesc(filename) });
  };

  return (
    <main id="main-content" className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/30 to-cyan-500/30 flex items-center justify-center border border-purple-500/50">
              <Shield className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">{t.pageTitle}</h1>
              <p className="text-muted-foreground mt-1">
                {t.pageSubtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Security Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-purple-500/30 bg-gradient-to-br from-[#0a0a0a] to-purple-900/10">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-purple-400" />
                <CardTitle className="text-lg text-white">{t.encTitle}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300">
                {t.encDesc}
              </p>
            </CardContent>
          </Card>

          <Card className="border-cyan-500/30 bg-gradient-to-br from-[#0a0a0a] to-cyan-900/10">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-cyan-400" />
                <CardTitle className="text-lg text-white">{t.gdprTitle}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300">
                {t.gdprDesc}
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-500/30 bg-gradient-to-br from-[#0a0a0a] to-green-900/10">
            <CardHeader>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <CardTitle className="text-lg text-white">{t.certTitle}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300">
                {t.certDesc}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Country Selector */}
        <Card className="border-purple-500/30 bg-gradient-to-br from-[#0a0a0a] to-purple-900/10 mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-white">{t.countryTitle}</CardTitle>
            <CardDescription>
              {t.countryDesc}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {countries.map((country) => (
                <Button
                  key={country.code}
                  variant={selectedCountry === country.code ? 'default' : 'outline'}
                  onClick={() => setSelectedCountry(country.code)}
                  className={`h-auto py-4 ${
                    selectedCountry === country.code
                      ? 'bg-purple-500 hover:bg-purple-600'
                      : 'border-purple-500/30 hover:border-purple-500/50'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-2xl">{country.flag}</span>
                    <span className="text-sm font-semibold">{country.name}</span>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Documents List */}
        <Card className="border-cyan-500/30 bg-gradient-to-br from-[#0a0a0a] to-cyan-900/10">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-cyan-400" />
              {t.docsTitle}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {documents[selectedCountry as keyof typeof documents]?.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-[#111111] border border-cyan-500/20 rounded-lg hover:border-cyan-500/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-cyan-400" />
                    <div>
                      <p className="text-sm font-semibold text-white">{doc.name}</p>
                      <p className="text-xs text-gray-400">
                        {t.updated} {new Date().toLocaleDateString(locale === 'it' ? 'it-IT' : 'en-US')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {doc.available ? (
                      <>
                        <Badge className="bg-green-500 text-white">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          {t.available}
                        </Badge>
                        <Button
                          size="sm"
                          onClick={() => handleDownload(doc.type)}
                          className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                        >
                          <Download className="h-4 w-4 mr-2" />
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