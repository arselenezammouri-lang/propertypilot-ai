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
import { Loader2, Trash2, Sparkles, Eye, Calendar, MapPin, Plus, Wand2, Home, DollarSign, Ruler, BedDouble } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { SavedListing } from '@/lib/types/database.types';
import { fetchApi } from '@/lib/api/client';
import { format } from 'date-fns';
import { it, enUS } from 'date-fns/locale';
import { useLocale } from "@/lib/i18n/locale-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TableSkeleton } from '@/components/ui/skeleton-loaders';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function ListingsPage() {
  const { toast } = useToast();
  const { locale } = useLocale();
  const isItalian = locale === "it";
  const queryClient = useQueryClient();
  const [selectedListing, setSelectedListing] = useState<SavedListing | null>(null);
  const [listingToDelete, setListingToDelete] = useState<SavedListing | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [createForm, setCreateForm] = useState({
    propertyType: '',
    location: '',
    price: '',
    size: '',
    rooms: '',
    features: '',
    notes: '',
    style: 'standard' as 'luxury' | 'investment' | 'standard',
    market: 'italy' as 'usa' | 'italy' | 'middle-east',
  });

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
    createTitle: isItalian ? "Genera Nuovo Annuncio" : "Generate New Listing",
    createDesc: isItalian ? "Inserisci i dati dell'immobile per generare contenuti professionali con AI" : "Enter property details to generate professional AI content",
    propertyType: isItalian ? "Tipo Immobile *" : "Property Type *",
    propertyTypePlaceholder: isItalian ? "es. Appartamento, Villa, Ufficio" : "e.g. Apartment, Villa, Office",
    locationLabel: isItalian ? "Località *" : "Location *",
    locationPlaceholder: isItalian ? "es. Milano Centro, Roma EUR" : "e.g. Downtown Miami, London W1",
    priceLabel: isItalian ? "Prezzo" : "Price",
    pricePlaceholder: isItalian ? "es. €350.000" : "e.g. $350,000",
    sizeLabel: isItalian ? "Superficie (m²)" : "Size (sq ft)",
    roomsLabel: isItalian ? "Locali" : "Rooms",
    featuresLabel: isItalian ? "Caratteristiche" : "Features",
    featuresPlaceholder: isItalian ? "es. Terrazza, garage, giardino, piscina" : "e.g. Terrace, garage, garden, pool",
    notesLabel: isItalian ? "Note aggiuntive" : "Additional Notes",
    notesPlaceholder: isItalian ? "Qualsiasi dettaglio extra per l'AI..." : "Any extra details for the AI...",
    styleLabel: isItalian ? "Stile" : "Style",
    marketLabel: isItalian ? "Mercato" : "Market",
    generating: isItalian ? "Generazione in corso..." : "Generating...",
    generate: isItalian ? "Genera con AI" : "Generate with AI",
    generated: isItalian ? "Annuncio generato!" : "Listing generated!",
    generatedDesc: isItalian ? "Il tuo annuncio è stato generato con successo." : "Your listing has been generated successfully.",
    genError: isItalian ? "Errore nella generazione" : "Generation error",
    fillRequired: isItalian ? "Compila tipo immobile e località" : "Fill in property type and location",
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
      const res = await fetchApi<{ data: SavedListing['generated_content'] }>('/api/generate-comprehensive', {
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

  const createMutation = useMutation({
    mutationFn: async (formData: typeof createForm) => {
      if (!formData.propertyType || !formData.location) {
        throw new Error(t.fillRequired);
      }
      const payload = {
        propertyType: formData.propertyType,
        location: formData.location,
        price: formData.price || undefined,
        size: formData.size ? Number(formData.size) : undefined,
        rooms: formData.rooms ? Number(formData.rooms) : undefined,
        features: formData.features || undefined,
        notes: formData.notes || undefined,
        style: formData.style,
        market: formData.market,
      };
      const res = await fetchApi<any>('/api/generate', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (!res.success) throw new Error(res.message || res.error || 'Generation failed');

      const content = res.data;
      if (!content) throw new Error('No content returned');

      try {
        await fetchApi<any>('/api/listings/save', {
          method: 'POST',
          body: JSON.stringify({
            title: content.titles?.[0] || `${formData.propertyType} - ${formData.location}`,
            property_data: payload,
            generated_content: content,
          }),
        });
      } catch {
        // Save failed (table may not exist) - still return content
      }
      return content;
    },
    onSuccess: (content) => {
      queryClient.invalidateQueries({ queryKey: ['/api/listings'] });
      toast({ title: t.generated, description: t.generatedDesc, duration: 5000 });
      setShowCreateDialog(false);
      setCreateForm({ propertyType: '', location: '', price: '', size: '', rooms: '', features: '', notes: '', style: 'standard', market: 'italy' });
      if (content?.professional) {
        setSelectedListing({
          id: Date.now(),
          title: content.titles?.[0] || 'Generated Listing',
          created_at: new Date().toISOString(),
          property_data: {},
          generated_content: content,
        } as any);
      }
    },
    onError: (error: Error) => {
      toast({ variant: 'destructive', title: t.genError, description: error.message, duration: 8000 });
    },
  });

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
        <Card data-testid="card-empty" className="border-dashed border-white/20 bg-white/[0.02]">
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
                  onClick: () => setShowCreateDialog(true),
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

      {/* Create Listing Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Wand2 className="h-6 w-6 text-royal-purple" />
              {t.createTitle}
            </DialogTitle>
            <DialogDescription>{t.createDesc}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="propertyType">{t.propertyType}</Label>
                <div className="relative">
                  <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="propertyType"
                    placeholder={t.propertyTypePlaceholder}
                    value={createForm.propertyType}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, propertyType: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">{t.locationLabel}</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder={t.locationPlaceholder}
                    value={createForm.location}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, location: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">{t.priceLabel}</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="price"
                    placeholder={t.pricePlaceholder}
                    value={createForm.price}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, price: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="size">{t.sizeLabel}</Label>
                <div className="relative">
                  <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="size"
                    type="number"
                    placeholder="120"
                    value={createForm.size}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, size: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rooms">{t.roomsLabel}</Label>
                <div className="relative">
                  <BedDouble className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="rooms"
                    type="number"
                    placeholder="3"
                    value={createForm.rooms}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, rooms: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="features">{t.featuresLabel}</Label>
              <Input
                id="features"
                placeholder={t.featuresPlaceholder}
                value={createForm.features}
                onChange={(e) => setCreateForm(prev => ({ ...prev, features: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">{t.notesLabel}</Label>
              <Textarea
                id="notes"
                placeholder={t.notesPlaceholder}
                value={createForm.notes}
                onChange={(e) => setCreateForm(prev => ({ ...prev, notes: e.target.value }))}
                rows={2}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t.styleLabel}</Label>
                <div className="flex gap-2">
                  {(['standard', 'luxury', 'investment'] as const).map((s) => (
                    <Button
                      key={s}
                      type="button"
                      variant={createForm.style === s ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCreateForm(prev => ({ ...prev, style: s }))}
                      className={createForm.style === s ? 'bg-royal-purple hover:bg-royal-purple/90' : ''}
                    >
                      {s === 'standard' ? 'Standard' : s === 'luxury' ? 'Luxury' : 'Investment'}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t.marketLabel}</Label>
                <div className="flex gap-2">
                  {([{ value: 'italy', label: '🇮🇹 EU' }, { value: 'usa', label: '🇺🇸 USA' }, { value: 'middle-east', label: '🇦🇪 ME' }] as const).map((m) => (
                    <Button
                      key={m.value}
                      type="button"
                      variant={createForm.market === m.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCreateForm(prev => ({ ...prev, market: m.value }))}
                      className={createForm.market === m.value ? 'bg-royal-purple hover:bg-royal-purple/90' : ''}
                    >
                      {m.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              {isItalian ? "Annulla" : "Cancel"}
            </Button>
            <Button
              onClick={() => createMutation.mutate(createForm)}
              disabled={createMutation.isPending || !createForm.propertyType || !createForm.location}
              className="bg-gradient-to-r from-royal-purple to-electric-blue hover:opacity-90 text-white min-w-[180px]"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {t.generating}
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  {t.generate}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
