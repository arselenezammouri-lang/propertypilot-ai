"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Download, FileText, Lock, Globe, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function CompliancePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedCountry, setSelectedCountry] = useState<string>('IT');

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
    toast({
      title: "Download avviato",
      description: `Scaricando ${filename}...`,
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/30 to-cyan-500/30 flex items-center justify-center border border-purple-500/50">
              <Shield className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Compliance Center</h1>
              <p className="text-muted-foreground mt-1">
                Documenti legali pre-compilati per il tuo paese
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
                <CardTitle className="text-lg text-white">Crittografia AES-256</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300">
                Tutti i dati sensibili (telefoni, email) sono criptati con standard bancario.
              </p>
            </CardContent>
          </Card>

          <Card className="border-cyan-500/30 bg-gradient-to-br from-[#0a0a0a] to-cyan-900/10">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-cyan-400" />
                <CardTitle className="text-lg text-white">GDPR Compliant</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300">
                Conformità totale con GDPR, CCPA e normative internazionali.
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-500/30 bg-gradient-to-br from-[#0a0a0a] to-green-900/10">
            <CardHeader>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <CardTitle className="text-lg text-white">Certificazioni</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300">
                ISO 27001, SOC 2 Type II (in corso di certificazione).
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Country Selector */}
        <Card className="border-purple-500/30 bg-gradient-to-br from-[#0a0a0a] to-purple-900/10 mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-white">Seleziona il tuo Paese</CardTitle>
            <CardDescription>
              I documenti verranno generati secondo le normative del paese selezionato
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
              Documenti Disponibili
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
                        Aggiornato: {new Date().toLocaleDateString('it-IT')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {doc.available ? (
                      <>
                        <Badge className="bg-green-500 text-white">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Disponibile
                        </Badge>
                        <Button
                          size="sm"
                          onClick={() => handleDownload(doc.type)}
                          className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Scarica PDF
                        </Button>
                      </>
                    ) : (
                      <Badge variant="outline" className="border-white/10 text-white/40">
                        In arrivo
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}