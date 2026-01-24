import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sparkles,
  Globe,
  Zap,
  TrendingUp,
  Check,
  ArrowRight,
  Phone,
  Bot,
  BarChart3,
  Clock,
} from "lucide-react";

export default function MarketingLandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-8">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">AI-Powered Real Estate Automation</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Il tuo Agente Immobiliare AI
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              che lavora 24/7
            </span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Trova immobili, chiama proprietari e fissa appuntamenti automaticamente. 
            Svegliati ogni mattina con nuovi affari pronti da chiudere.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/auth/signup">
                Inizia Gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" asChild>
              <Link href="/dashboard">
                Vedi Demo
              </Link>
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground mt-1">Automazione</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">100+</div>
              <div className="text-sm text-muted-foreground mt-1">Annunci/Giorno</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">80%</div>
              <div className="text-sm text-muted-foreground mt-1">Conversion Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Reach Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Copertura Globale</h2>
            <p className="text-xl text-muted-foreground">
              Operiamo su tutti i principali portali immobiliari internazionali
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">🇺🇸</span>
                  <CardTitle>Stati Uniti</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Zillow</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>MLS</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Redfin</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">🇮🇹</span>
                  <CardTitle>Italia</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Immobiliare.it</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Idealista</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Casa.it</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">🇪🇸</span>
                  <CardTitle>Spagna</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Idealista.es</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Fotocasa</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Pisos.com</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Come Funziona</h2>
            <p className="text-xl text-muted-foreground">
              Automatizza tutto il processo di ricerca e contatto
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Scraping Intelligente</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  L'AI analizza migliaia di annunci ogni giorno e identifica le migliori opportunità
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Chiamate Automatiche</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Voice AI chiama i proprietari, gestisce obiezioni e fissa appuntamenti 24/7
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Lead Scoring AI</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Ogni annuncio riceve un punteggio 0-100. Focus sugli "Affari Oro" (80+)
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Prezzi</h2>
            <p className="text-xl text-muted-foreground">
              Scegli il piano perfetto per il tuo business
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* PRO Plan */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl">PRO</CardTitle>
                <CardDescription>Per agenti immobiliari</CardDescription>
                <div className="mt-4">
                  <span className="text-5xl font-bold">€297</span>
                  <span className="text-muted-foreground">/mese</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>500 annunci/giorno</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>10 filtri attivi</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Voice AI illimitato</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Lead Scoring AI</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Supporto prioritario</span>
                  </li>
                </ul>
                <Button className="w-full" size="lg" asChild>
                  <Link href="/auth/signup?plan=pro">
                    Inizia Ora
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* AGENCY Plan */}
            <Card className="border-2 border-primary">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-2xl">AGENCY</CardTitle>
                  <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                    POPOLARE
                  </span>
                </div>
                <CardDescription>Per agenzie e team</CardDescription>
                <div className="mt-4">
                  <span className="text-5xl font-bold">€597</span>
                  <span className="text-muted-foreground">/mese</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>2000 annunci/giorno</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>50 filtri attivi</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Voice AI illimitato</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Lead Scoring AI</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Multi-utente</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Supporto dedicato</span>
                  </li>
                </ul>
                <Button className="w-full" size="lg" asChild>
                  <Link href="/auth/signup?plan=agency">
                    Inizia Ora
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-3xl mb-4">
                Pronto a moltiplicare i tuoi affari?
              </CardTitle>
              <CardDescription className="text-lg">
                Unisciti a centinaia di agenti che già usano PropertyPilot AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="lg" className="text-lg px-8" asChild>
                <Link href="/auth/signup">
                  Get Started Gratis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

