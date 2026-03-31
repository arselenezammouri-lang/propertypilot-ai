'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2, Trash2, Sparkles, Eye, Calendar, MapPin, Plus } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { SavedListing } from '@/lib/types/database.types';
import { fetchApi } from '@/lib/api/client';
import Link from 'next/link';
import { format } from 'date-fns';
import { it, enUS } from 'date-fns/locale';
import { useLocale } from "@/lib/i18n/locale-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TableSkeleton } from '@/components/ui/skeleton-loaders';

export default function ListingsPage() {
  const { toast } = useToast();
  const { locale } = useLocale();
  const isItalian = locale === "it";
  const queryClient = useQueryClient();
  const [selectedListing, setSelectedListing] = useState<SavedListing | null>(null);
  const [listingToDelete, setListingToDelete] = useState<SavedListing | null>(null);
  const [isCreateListingDialogOpen, setIsCreateListingDialogOpen] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const t = {
    deleted: isItalian ? "Annuncio eliminato" : "Listing deleted",
    deletedDesc: isItalian ? "L'annuncio è stato eliminato con successo." : "The listing has been deleted successfully.",
    errorTitle: isItalian ? "Errore" : "Error",
    deleteError: isItalian ? "Impossibile eliminare l'annuncio." : "Cannot delete the listing.",
    regenerated: isItalian ? "Contenuto rigenerato" : "Content regenerated",
    regeneratedDesc: isItalian ? "Il contenuto AI è stato rigenerato con successo!" : "The AI content has been regenerated successfully!",
    aiError: isItalian ? "Errore AI" : "AI Error",
    regenError: isItalian ? "Impossibile rigenerare il contenuto." : "Cannot regenerate the content.",
    loadError: isItalian ? "Impossibile caricare gli annunci" : "Cannot load listings",
    loadErrorDesc: isItalian ? "Si è verificato un errore durante il caricamento della libreria. Riprova più tardi." : "An error occurred while loading the library. Try again later.",
    contactSupport: isItalian ? "Se il problema persiste, contatta il supporto." : "If the problem persists, contact support.",
    pageTitle: isItalian ? "Annunci Salvati" : "Saved Listings",
    pageDesc: isItalian ? "Gestisci la tua libreria di annunci generati con AI" : "Manage your AI-generated listings library",
    emptyTitle: isItalian ? "Nessun annuncio salvato" : "No saved listings",
    emptyDesc: isItalian ? "Gli annunci che generi con AI appariranno qui. Inizia a creare il tuo primo annuncio!" : "Listings you generate with AI will appear here. Start creating your first listing!",
    createListing: isItalian ? "Crea Annuncio" : "Create Listing",
    createdOn: isItalian ? "Creato il" : "Created on",
    view: isItalian ? "Visualizza" : "View",
    propertyDetails: isItalian ? "Dettagli Immobile" : "Property Details",
    locality: isItalian ? "Località:" : "Location:",
    type: isItalian ? "Tipologia:" : "Type:",
    size: isItalian ? "Superficie:" : "Size:",
    rooms: isItalian ? "Locali:" : "Rooms:",
    price: isItalian ? "Prezzo:" : "Price:",
    features: isItalian ? "Caratteristiche:" : "Features:",
    generatedContent: isItalian ? "Contenuto Generato" : "Generated Content",
    tabProfessional: isItalian ? "Professionale" : "Professional",
    tabShort: isItalian ? "Breve" : "Short",
    tabTitles: isItalian ? "Titoli" : "Titles",
    tabEnglish: isItalian ? "Inglese" : "English",
    roomsUnit: isItalian ? "locali" : "rooms",
    regenerating: isItalian ? "Rigenerazione..." : "Regenerating...",
    regenerate: isItalian ? "Rigenera Contenuto" : "Regenerate Content",
    delete: isItalian ? "Elimina" : "Delete",
    deleteConfirmTitle: isItalian ? "Elimina annuncio?" : "Delete listing?",
    deleteConfirmDesc: isItalian
      ? "L'annuncio verrà rimosso dalla libreria. Questa azione non può essere annullata."
      : "The listing will be removed from your library. This action cannot be undone.",
    deleting: isItalian ? "Eliminazione..." : "Deleting...",
    createDialogTitle: isItalian ? "Crea Nuovo Annuncio" : "Create New Listing",
    createDialogDesc: isItalian
      ? "Scegli come vuoi iniziare: compilazione guidata o ricerca opportunità dal mercato."
      : "Choose how to start: guided generation or market prospecting.",
    createFromWorkspace: isItalian ? "Apri Workspace Generazione" : "Open Generation Workspace",
    searchMarket: isItalian ? "Cerca sul Mercato" : "Search Market",
  };

  const { data: listingsData, isLoading, error } = useQuery<{ success: boolean; data: SavedListing[] }>({
    queryKey: ['/api/listings'],
  });

  const listings = listingsData?.data || [];

  if (error && !isLoading) {
    console.warn('[LISTINGS] Failed to fetch listings:', error);
  }

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetchApi<unknown>(`/api/listings?id=${id}`, { method: 'DELETE' });
      if (!res.success) throw new Error(res.message || res.error || 'Delete failed');
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/listings'] });
      toast({
        title: t.deleted,
        description: t.deletedDesc,
        duration: 5000,
      });
      setSelectedListing(null);
      setListingToDelete(null);
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: t.errorTitle,
        description: error.message || t.deleteError,
        duration: 8000,
      });
    },
  });

  const regenerateMutation = useMutation({
    mutationFn: async (listing: SavedListing) => {
      const res = await fetchApi<SavedListing['generated_content']>('/api/generate-comprehensive', {
        method: 'POST',
        body: JSON.stringify(listing.property_data),
      });
      if (!res.success) throw new Error(res.message || res.error || 'Regenerate failed');
      return res;
    },
    onSuccess: (res, listing) => {
      if (selectedListing && selectedListing.id === listing.id && res.data != null) {
        setSelectedListing({
          ...selectedListing,
          generated_content: res.data,
        });
      }
      
      toast({
        title: t.regenerated,
        description: t.regeneratedDesc,
        duration: 5000,
      });
      setIsRegenerating(false);
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: t.aiError,
        description: error.message || t.regenError,
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
      <div className="container max-w-6xl py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2" data-testid="heading-listings-skeleton">
            {t.pageTitle}
          </h1>
          <p className="text-muted-foreground">
            {t.pageDesc}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t.pageTitle}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {t.pageDesc}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TableSkeleton rows={6} />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error && !listingsData) {
    return (
      <div className="container max-w-6xl py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <h2 className="text-2xl font-bold mb-2">{t.loadError}</h2>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              {t.loadErrorDesc}
            </p>
            <p className="text-sm text-muted-foreground">
              {t.contactSupport}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2" data-testid="heading-listings">{t.pageTitle}</h1>
        <p className="text-muted-foreground" data-testid="text-description">
          {t.pageDesc}
        </p>
      </div>

      {listings.length === 0 ? (
        <Card data-testid="card-empty" className="border-dashed border-border bg-muted/20">
          <CardContent className="p-0">
            <EmptyState
              icon={<Sparkles />}
              title={t.emptyTitle}
              description={t.emptyDesc}
              gradient="from-purple-500/20 to-violet-500/20"
              size="lg"
              actions={[
                {
                  label: t.createListing,
                  onClick: () => setIsCreateListingDialogOpen(true),
                  icon: <Plus className="h-4 w-4" />,
                },
                {
                  label: isItalian ? "Cerca sul Mercato" : "Search Market",
                  href: "/dashboard/prospecting",
                  variant: "outline",
                  icon: <Sparkles className="h-4 w-4" />,
                },
              ]}
            />
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
                  {format(new Date(listing.created_at), 'dd MMM yyyy', { locale: isItalian ? it : enUS })}
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
                        {listing.property_data.rooms} {t.roomsUnit}
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
                  {t.view}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isCreateListingDialogOpen} onOpenChange={setIsCreateListingDialogOpen}>
        {isCreateListingDialogOpen ? (
          <DialogContent className="sm:max-w-md" data-testid="dialog-create-listing">
            <DialogHeader>
              <DialogTitle>{t.createDialogTitle}</DialogTitle>
              <DialogDescription>{t.createDialogDesc}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 pt-2">
              <Button asChild onClick={() => setIsCreateListingDialogOpen(false)} data-testid="button-open-generation-workspace">
                <Link href="/dashboard/perfect-copy">
                  <Plus className="h-4 w-4 mr-2" />
                  {t.createFromWorkspace}
                </Link>
              </Button>
              <Button asChild variant="outline" onClick={() => setIsCreateListingDialogOpen(false)} data-testid="button-open-market-search">
                <Link href="/dashboard/prospecting">
                  <Sparkles className="h-4 w-4 mr-2" />
                  {t.searchMarket}
                </Link>
              </Button>
            </div>
          </DialogContent>
        ) : null}
      </Dialog>

      <Dialog open={!!selectedListing} onOpenChange={(open: boolean) => !open && setSelectedListing(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle data-testid="dialog-title">{selectedListing?.title}</DialogTitle>
            <DialogDescription data-testid="dialog-date">
              {t.createdOn} {selectedListing && format(new Date(selectedListing.created_at), 'dd MMMM yyyy', { locale: isItalian ? it : enUS })}
            </DialogDescription>
          </DialogHeader>

          {selectedListing && (
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">{t.propertyDetails}</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">{t.locality}</span>
                      <p className="font-medium" data-testid="detail-location">{selectedListing.property_data.location}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{t.type}</span>
                      <p className="font-medium" data-testid="detail-type">{selectedListing.property_data.propertyType}</p>
                    </div>
                    {selectedListing.property_data.size && (
                      <div>
                        <span className="text-muted-foreground">{t.size}</span>
                        <p className="font-medium" data-testid="detail-size">{selectedListing.property_data.size} m²</p>
                      </div>
                    )}
                    {selectedListing.property_data.rooms && (
                      <div>
                        <span className="text-muted-foreground">{t.rooms}</span>
                        <p className="font-medium" data-testid="detail-rooms">{selectedListing.property_data.rooms}</p>
                      </div>
                    )}
                    {selectedListing.property_data.price && (
                      <div>
                        <span className="text-muted-foreground">{t.price}</span>
                        <p className="font-medium" data-testid="detail-price">{selectedListing.property_data.price}</p>
                      </div>
                    )}
                  </div>
                  {selectedListing.property_data.features && (
                    <div className="mt-3">
                      <span className="text-muted-foreground text-sm">{t.features}</span>
                      <p className="text-sm mt-1" data-testid="detail-features">{selectedListing.property_data.features}</p>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold mb-3">{t.generatedContent}</h3>
                  <Tabs defaultValue="professional" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="professional" data-testid="tab-professional">{t.tabProfessional}</TabsTrigger>
                      <TabsTrigger value="short" data-testid="tab-short">{t.tabShort}</TabsTrigger>
                      <TabsTrigger value="titles" data-testid="tab-titles">{t.tabTitles}</TabsTrigger>
                      <TabsTrigger value="english" data-testid="tab-english">{t.tabEnglish}</TabsTrigger>
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
                        {t.regenerating}
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        {t.regenerate}
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => setListingToDelete(selectedListing)}
                    disabled={deleteMutation.isPending}
                    data-testid="button-delete"
                    variant="destructive"
                  >
                    {deleteMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Trash2 className="h-4 w-4 mr-2" />
                    )}
                    {t.delete}
                  </Button>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!listingToDelete} onOpenChange={(open) => !open && setListingToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.deleteConfirmTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.deleteConfirmDesc}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>{isItalian ? "Annulla" : "Cancel"}</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                if (listingToDelete) deleteMutation.mutate(listingToDelete.id);
              }}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete-listing"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              {deleteMutation.isPending ? t.deleting : t.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
