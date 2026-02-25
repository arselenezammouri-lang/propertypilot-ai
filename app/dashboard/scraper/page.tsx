'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Link2, 
  Search, 
  Sparkles, 
  Save, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  FileText,
  Video,
  Mail,
  TrendingUp,
  TrendingDown,
  Home,
  Globe
} from 'lucide-react';
import { ScrapedListing } from '@/lib/scrapers/types';
import { GeneratedContent } from '@/lib/ai/generateListingContent';

export default function ScraperPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [url, setUrl] = useState('');
  const [isScrapingLoading, setIsScrapingLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [scrapedData, setScrapedData] = useState<ScrapedListing | null>(null);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [sourceUrl, setSourceUrl] = useState('');

  const handleScrape = async () => {
    if (!url.trim()) {
      toast({
        title: 'URL richiesto',
        description: 'Inserisci l\'URL di un annuncio immobiliare.',
        variant: 'destructive',
      });
      return;
    }

    setIsScrapingLoading(true);
    setScrapedData(null);
    setGeneratedContent(null);

    try {
      const response = await fetch('/api/scrape-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      // Try to parse JSON response, handle parse errors
      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        console.error('[SCRAPER UI] Failed to parse response:', parseError);
        toast({
          title: 'Errore',
          description: 'Errore di comunicazione con il server. Riprova tra qualche secondo.',
          variant: 'destructive',
          duration: 8000,
        });
        return;
      }

      if (!response.ok) {
        // Don't throw Error - preserve result payload with message/suggestion
        const errorMessage = result.message || result.error || 'Errore durante lo scraping';
        const suggestion = result.suggestion;
        
        toast({
          title: 'Errore',
          description: suggestion ? `${errorMessage}\n\n💡 ${suggestion}` : errorMessage,
          variant: 'destructive',
          duration: 8000,
        });
        return;
      }

      setScrapedData(result.data);
      setSourceUrl(result.meta.sourceUrl);
      
      toast({
        title: 'Scraping completato!',
        description: 'Dati estratti con successo. Generazione contenuti AI in corso...',
        duration: 5000,
      });

      // Auto-generate AI content after successful scraping
      await handleGenerateAI(result.data);

    } catch (error: any) {
      // Catch only for network/parsing errors
      console.error('[SCRAPER UI] Error:', error);
      
      toast({
        title: 'Errore',
        description: error.message || 'Impossibile connettersi al server.',
        variant: 'destructive',
        duration: 8000,
      });
    } finally {
      setIsScrapingLoading(false);
    }
  };

  const handleGenerateAI = async (data: ScrapedListing) => {
    setIsAiLoading(true);

    try {
      const response = await fetch('/api/generate-comprehensive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      // Try to parse JSON response, handle parse errors
      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        console.error('[AI GENERATION] Failed to parse response:', parseError);
        toast({
          title: 'Errore AI',
          description: 'Errore di comunicazione con il server. Riprova tra qualche secondo.',
          variant: 'destructive',
          duration: 8000,
        });
        return;
      }

      if (!response.ok) {
        // Don't throw Error - preserve result payload with message/suggestion
        const errorMessage = result.message || result.error || 'Errore durante la generazione AI';
        const suggestion = result.suggestion;
        
        toast({
          title: 'Errore AI',
          description: suggestion ? `${errorMessage}\n\n💡 ${suggestion}` : errorMessage,
          variant: 'destructive',
          duration: 8000,
        });
        return;
      }

      setGeneratedContent(result.data);
      
      toast({
        title: 'Contenuti AI generati!',
        description: 'Tutti i contenuti sono stati creati con successo.',
        duration: 5000,
      });

    } catch (error: any) {
      // Catch only for network/parsing errors
      console.error('[AI GENERATION] Error:', error);
      
      toast({
        title: 'Errore AI',
        description: error.message || 'Impossibile connettersi al server.',
        variant: 'destructive',
        duration: 8000,
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSaveToLibrary = async () => {
    if (!scrapedData || !generatedContent) {
      toast({
        title: 'Nessun dato da salvare',
        description: 'Genera prima i contenuti AI.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch('/api/listings/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: scrapedData.title || 'Annuncio senza titolo',
          property_data: scrapedData,
          generated_content: generatedContent,
          source_url: sourceUrl,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || result.error || 'Errore durante il salvataggio');
      }

      toast({
        title: 'Salvato!',
        description: 'L\'annuncio è stato salvato nella tua libreria.',
      });

      // Redirect to listings page
      setTimeout(() => {
        router.push('/dashboard/listings');
      }, 1500);

    } catch (error: any) {
      console.error('[SAVE] Error:', error);
      toast({
        title: 'Errore',
        description: error.message || 'Impossibile salvare l\'annuncio.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          <Sparkles className="inline-block mr-2 h-8 w-8 text-primary" />
          Analisi Annuncio AI
        </h1>
        <p className="text-muted-foreground text-lg">
          Importa annunci da portali immobiliari e genera contenuti professionali con AI
        </p>
      </div>

      {/* URL Input */}
      <Card className="mb-8" data-testid="card-url-input">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            URL Annuncio
          </CardTitle>
          <CardDescription>
            Supportati: Immobiliare.it, Idealista.it, Casa.it, Subito.it
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              type="url"
              placeholder="https://www.immobiliare.it/annunci/12345..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleScrape()}
              className="flex-1"
              data-testid="input-url"
            />
            <Button 
              onClick={handleScrape} 
              disabled={isScrapingLoading || isAiLoading}
              data-testid="button-scrape"
            >
              {isScrapingLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analisi...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Analizza Annuncio
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loading State - AI Generation */}
      {isAiLoading && (
        <Card className="mb-8 border-primary" data-testid="card-ai-loading">
          <CardContent className="py-12">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Generazione contenuti AI in corso...</h3>
              <p className="text-muted-foreground">
                Stiamo creando descrizioni, titoli, email, video script e molto altro.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scraped Data Preview */}
      {scrapedData && !isAiLoading && (
        <Card className="mb-8" data-testid="card-scraped-preview">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Dati Estratti
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2" data-testid="text-scraped-title">{scrapedData.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {scrapedData.price && (
                      <Badge variant="secondary" data-testid="badge-price">{scrapedData.price}</Badge>
                    )}
                    {scrapedData.location && (
                      <Badge variant="outline" data-testid="badge-location">{scrapedData.location}</Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {scrapedData.surface && (
                    <div>
                      <p className="text-sm text-muted-foreground">Superficie</p>
                      <p className="font-medium" data-testid="text-surface">{scrapedData.surface}</p>
                    </div>
                  )}
                  {scrapedData.rooms && (
                    <div>
                      <p className="text-sm text-muted-foreground">Locali</p>
                      <p className="font-medium" data-testid="text-rooms">{scrapedData.rooms}</p>
                    </div>
                  )}
                </div>

                {scrapedData.description_raw && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Descrizione originale</p>
                    <p className="text-sm line-clamp-4" data-testid="text-description-raw">
                      {scrapedData.description_raw}
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div>
                {scrapedData.features && scrapedData.features.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Caratteristiche</p>
                    <div className="flex flex-wrap gap-2">
                      {scrapedData.features.slice(0, 6).map((feature, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs" data-testid={`badge-feature-${idx}`}>
                          {feature}
                        </Badge>
                      ))}
                      {scrapedData.features.length > 6 && (
                        <Badge variant="outline" className="text-xs">
                          +{scrapedData.features.length - 6} altre
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generated AI Content */}
      {generatedContent && (
        <>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Contenuti AI Generati</h2>
            <Button 
              onClick={handleSaveToLibrary} 
              disabled={isSaving}
              size="lg"
              data-testid="button-save-library"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvataggio...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salva nella Libreria
                </>
              )}
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Professional Listing */}
            <Card data-testid="card-professional">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Descrizione Professionale
                </CardTitle>
                <CardDescription>150-200 parole, SEO ottimizzato</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap" data-testid="text-professional">
                  {generatedContent.professional}
                </p>
              </CardContent>
            </Card>

            {/* Short Listing */}
            <Card data-testid="card-short">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  Descrizione Breve
                </CardTitle>
                <CardDescription>Max 50 parole per portali</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm" data-testid="text-short">{generatedContent.short}</p>
              </CardContent>
            </Card>

            {/* Emotional Listing */}
            <Card data-testid="card-emotional">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  Descrizione Emozionale
                </CardTitle>
                <CardDescription>Storytelling e lifestyle</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap" data-testid="text-emotional">
                  {generatedContent.emotional}
                </p>
              </CardContent>
            </Card>

            {/* Titles */}
            <Card data-testid="card-titles">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-orange-600" />
                  Titoli Accattivanti
                </CardTitle>
                <CardDescription>5 varianti SEO-friendly</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {generatedContent.titles.map((title, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2" data-testid={`text-title-${idx}`}>
                      <span className="text-muted-foreground">{idx + 1}.</span>
                      <span>{title}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Video Script */}
            <Card data-testid="card-video-script" className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-red-600" />
                  Script Video (Reels/TikTok)
                </CardTitle>
                <CardDescription>30-45 secondi per social media</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap" data-testid="text-video-script">
                  {generatedContent.videoScript}
                </p>
              </CardContent>
            </Card>

            {/* Email Follow-up */}
            <Card data-testid="card-email" className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  Email Follow-up
                </CardTitle>
                <CardDescription>Template per potenziali acquirenti</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap" data-testid="text-email">
                  {generatedContent.emailFollowUp}
                </p>
              </CardContent>
            </Card>

            {/* Strengths & Weaknesses */}
            <Card data-testid="card-strengths">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Punti di Forza
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {generatedContent.strengths.map((strength, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2" data-testid={`text-strength-${idx}`}>
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card data-testid="card-weaknesses">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-orange-600" />
                  Punti di Debolezza
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {generatedContent.weaknesses.map((weakness, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2" data-testid={`text-weakness-${idx}`}>
                      <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span>{weakness}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Home Staging */}
            <Card data-testid="card-home-staging">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-indigo-600" />
                  Suggerimenti Home Staging
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {generatedContent.homeStaging.map((suggestion, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2" data-testid={`text-staging-${idx}`}>
                      <span className="text-muted-foreground">{idx + 1}.</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Portal Description */}
            <Card data-testid="card-portal">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-teal-600" />
                  Descrizione per Portali
                </CardTitle>
                <CardDescription>Ottimizzata per Immobiliare.it, Idealista</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap" data-testid="text-portal">
                  {generatedContent.portalDescription}
                </p>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
