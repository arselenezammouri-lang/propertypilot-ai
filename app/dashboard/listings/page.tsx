'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Trash2, Sparkles, Eye, Calendar, MapPin } from 'lucide-react';
import { SavedListing } from '@/lib/types/database.types';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function ListingsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedListing, setSelectedListing] = useState<SavedListing | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const { data: listingsData, isLoading, error } = useQuery<{ success: boolean; data: SavedListing[] }>({
    queryKey: ['/api/listings'],
  });

  const listings = listingsData?.data || [];

  if (error && !isLoading) {
    console.warn('[LISTINGS] Failed to fetch listings:', error);
  }

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/listings?id=${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || result.error);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/listings'] });
      toast({
        title: 'Annuncio eliminato',
        description: 'L\'annuncio è stato eliminato con successo.',
        duration: 5000,
      });
      setSelectedListing(null);
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Errore',
        description: error.message || 'Impossibile eliminare l\'annuncio.',
        duration: 8000,
      });
    },
  });

  const regenerateMutation = useMutation({
    mutationFn: async (listing: SavedListing) => {
      const response = await fetch('/api/generate-comprehensive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(listing.property_data),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || result.error);
      return result;
    },
    onSuccess: (data, listing) => {
      if (selectedListing && selectedListing.id === listing.id) {
        setSelectedListing({
          ...selectedListing,
          generated_content: data.data,
        });
      }
      
      toast({
        title: 'Contenuto rigenerato',
        description: 'Il contenuto AI è stato rigenerato con successo!',
        duration: 5000,
      });
      setIsRegenerating(false);
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Errore AI',
        description: error.message || 'Impossibile rigenerare il contenuto.',
        duration: 8000,
      });
      setIsRegenerating(false);
    },
  });

  const handleRegenerate = (listing: SavedListing) => {
    setIsRegenerating(true);
    regenerateMutation.mutate(listing);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" data-testid="loading-spinner" />
      </div>
    );
  }

  if (error && !listingsData) {
    return (
      <div className="container max-w-6xl py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <h2 className="text-2xl font-bold mb-2">Impossibile caricare gli annunci</h2>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              Si è verificato un errore durante il caricamento della libreria. Riprova più tardi.
            </p>
            <p className="text-sm text-muted-foreground">
              Se il problema persiste, contatta il supporto.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2" data-testid="heading-listings">Annunci Salvati</h1>
        <p className="text-muted-foreground" data-testid="text-description">
          Gestisci la tua libreria di annunci generati con AI
        </p>
      </div>

      {listings.length === 0 ? (
        <Card data-testid="card-empty">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Sparkles className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Nessun annuncio salvato</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Gli annunci che generi con AI appariranno qui. Inizia a creare il tuo primo annuncio!
            </p>
            <Button asChild data-testid="button-create-first">
              <a href="/dashboard/scraper">
                <Sparkles className="h-4 w-4 mr-2" />
                Crea Annuncio
              </a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Card
              key={listing.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedListing(listing)}
              data-testid={`card-listing-${listing.id}`}
            >
              <CardHeader>
                <CardTitle className="line-clamp-2 text-lg" data-testid={`text-title-${listing.id}`}>
                  {listing.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-2" data-testid={`text-date-${listing.id}`}>
                  <Calendar className="h-3 w-3" />
                  {format(new Date(listing.created_at), 'dd MMM yyyy', { locale: it })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {listing.property_data.location && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-1" data-testid={`text-location-${listing.id}`}>
                        {listing.property_data.location}
                      </span>
                    </div>
                  )}
                  <div className="flex gap-2 flex-wrap">
                    {listing.property_data.propertyType && (
                      <span className="text-xs bg-muted px-2 py-1 rounded">
                        {listing.property_data.propertyType}
                      </span>
                    )}
                    {listing.property_data.rooms && (
                      <span className="text-xs bg-muted px-2 py-1 rounded">
                        {listing.property_data.rooms} locali
                      </span>
                    )}
                    {listing.property_data.size && (
                      <span className="text-xs bg-muted px-2 py-1 rounded">
                        {listing.property_data.size} m²
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedListing(listing);
                  }}
                  data-testid={`button-view-${listing.id}`}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Visualizza
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selectedListing} onOpenChange={(open: boolean) => !open && setSelectedListing(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle data-testid="dialog-title">{selectedListing?.title}</DialogTitle>
            <DialogDescription data-testid="dialog-date">
              Creato il {selectedListing && format(new Date(selectedListing.created_at), 'dd MMMM yyyy', { locale: it })}
            </DialogDescription>
          </DialogHeader>

          {selectedListing && (
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Dettagli Immobile</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Località:</span>
                      <p className="font-medium" data-testid="detail-location">{selectedListing.property_data.location}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Tipologia:</span>
                      <p className="font-medium" data-testid="detail-type">{selectedListing.property_data.propertyType}</p>
                    </div>
                    {selectedListing.property_data.size && (
                      <div>
                        <span className="text-muted-foreground">Superficie:</span>
                        <p className="font-medium" data-testid="detail-size">{selectedListing.property_data.size} m²</p>
                      </div>
                    )}
                    {selectedListing.property_data.rooms && (
                      <div>
                        <span className="text-muted-foreground">Locali:</span>
                        <p className="font-medium" data-testid="detail-rooms">{selectedListing.property_data.rooms}</p>
                      </div>
                    )}
                    {selectedListing.property_data.price && (
                      <div>
                        <span className="text-muted-foreground">Prezzo:</span>
                        <p className="font-medium" data-testid="detail-price">{selectedListing.property_data.price}</p>
                      </div>
                    )}
                  </div>
                  {selectedListing.property_data.features && (
                    <div className="mt-3">
                      <span className="text-muted-foreground text-sm">Caratteristiche:</span>
                      <p className="text-sm mt-1" data-testid="detail-features">{selectedListing.property_data.features}</p>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Contenuto Generato</h3>
                  <Tabs defaultValue="professional" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="professional" data-testid="tab-professional">Professionale</TabsTrigger>
                      <TabsTrigger value="short" data-testid="tab-short">Breve</TabsTrigger>
                      <TabsTrigger value="titles" data-testid="tab-titles">Titoli</TabsTrigger>
                      <TabsTrigger value="english" data-testid="tab-english">Inglese</TabsTrigger>
                    </TabsList>
                    <TabsContent value="professional" className="mt-4">
                      <div className="bg-muted p-4 rounded-lg">
                        <p className="whitespace-pre-wrap text-sm" data-testid="content-professional">
                          {selectedListing.generated_content.professional}
                        </p>
                      </div>
                    </TabsContent>
                    <TabsContent value="short" className="mt-4">
                      <div className="bg-muted p-4 rounded-lg">
                        <p className="whitespace-pre-wrap text-sm" data-testid="content-short">
                          {selectedListing.generated_content.short}
                        </p>
                      </div>
                    </TabsContent>
                    <TabsContent value="titles" className="mt-4">
                      <div className="space-y-2">
                        {selectedListing.generated_content.titles.map((title, i) => (
                          <div key={i} className="bg-muted p-3 rounded-lg">
                            <p className="text-sm font-medium" data-testid={`content-title-${i}`}>
                              {i + 1}. {title}
                            </p>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="english" className="mt-4">
                      <div className="bg-muted p-4 rounded-lg">
                        <p className="whitespace-pre-wrap text-sm" data-testid="content-english">
                          {selectedListing.generated_content.english}
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={() => handleRegenerate(selectedListing)}
                    disabled={isRegenerating}
                    data-testid="button-regenerate"
                    variant="default"
                  >
                    {isRegenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Rigenerazione...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Rigenera Contenuto
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => deleteMutation.mutate(selectedListing.id)}
                    disabled={deleteMutation.isPending}
                    data-testid="button-delete"
                    variant="destructive"
                  >
                    {deleteMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Trash2 className="h-4 w-4 mr-2" />
                    )}
                    Elimina
                  </Button>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
