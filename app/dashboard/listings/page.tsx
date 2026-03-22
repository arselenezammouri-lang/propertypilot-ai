'use client';

import { useState, useEffect, useMemo } from 'react';
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
import { Loader2, Trash2, Sparkles, Eye, Calendar, MapPin, Plus, ArrowLeft } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { SavedListing } from '@/lib/types/database.types';
import { fetchApi } from '@/lib/api/client';
import Link from 'next/link';
import { useLocale } from "@/lib/i18n/locale-context";
import { getTranslation } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/config";
import { formatDateForLocale } from "@/lib/i18n/intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TableSkeleton } from '@/components/ui/skeleton-loaders';
import { DashboardPageShell } from '@/components/dashboard-page-shell';
import { DashboardPageHeader } from '@/components/dashboard-page-header';
import { useUsageLimits } from '@/hooks/use-usage-limits';
import {
  apiFailureToast,
  networkFailureToast,
} from '@/lib/i18n/api-feature-feedback';

function errWithStatus(message: string, status?: number): Error & { status?: number } {
  const e = new Error(message) as Error & { status?: number };
  e.status = status;
  return e;
}

export default function ListingsPage() {
  const { toast } = useToast();
  const { locale } = useLocale();
  const isItalian = locale === "it";
  const feedbackLocale = isItalian ? 'it' : 'en';
  const usage = useUsageLimits();
  const [pageReady, setPageReady] = useState(false);
  const queryClient = useQueryClient();
  const [selectedListing, setSelectedListing] = useState<SavedListing | null>(null);
  const [listingToDelete, setListingToDelete] = useState<SavedListing | null>(null);
  const [isCreateListingDialogOpen, setIsCreateListingDialogOpen] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const t = useMemo(() => getTranslation(locale).dashboard.listingsLibraryPage, [locale]);

  useEffect(() => {
    const id = requestAnimationFrame(() => setPageReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const dash = useMemo(() => getTranslation(locale).dashboard, [locale]);
  const planBadgeLabel =
    usage.plan === 'agency'
      ? dash.planAgency
      : usage.plan === 'pro'
        ? dash.planPro
        : usage.plan === 'starter'
          ? dash.planStarter
          : dash.planFree;

  const { data: listingsData, isLoading, error, refetch } = useQuery<{ success: boolean; data: SavedListing[] }>({
    queryKey: ['/api/listings'],
  });

  const listings = listingsData?.data || [];

  if (error && !isLoading) {
    console.warn('[LISTINGS] Failed to fetch listings:', error);
  }

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetchApi<unknown>(`/api/listings?id=${id}`, { method: 'DELETE' });
      if (!res.success) {
        throw errWithStatus(res.message || res.error || t.deleteError, res.status);
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/listings'] });
      toast({
        title: t.successDeletedTitle,
        description: t.deletedDesc,
        duration: 5000,
      });
      setSelectedListing(null);
      setListingToDelete(null);
    },
    onError: (err: Error & { status?: number }) => {
      const fail = apiFailureToast(feedbackLocale, 'listingsLibrary', {
        status: err.status,
        message: err.message,
        error: err.message,
      }, t.deleteError);
      toast({ variant: 'destructive', title: fail.title, description: fail.description, duration: 8000 });
    },
  });

  const regenerateMutation = useMutation({
    mutationFn: async (listing: SavedListing) => {
      const res = await fetchApi<SavedListing['generated_content']>('/api/generate-comprehensive', {
        method: 'POST',
        body: JSON.stringify(listing.property_data),
      });
      if (!res.success) {
        throw errWithStatus(res.message || res.error || t.regenError, res.status);
      }
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
        title: t.successRegenTitle,
        description: t.regeneratedDesc,
        duration: 5000,
      });
      setIsRegenerating(false);
    },
    onError: (err: Error & { status?: number }) => {
      const fail = apiFailureToast(feedbackLocale, 'listingsLibrary', {
        status: err.status,
        message: err.message,
        error: err.message,
      }, t.regenError);
      toast({ variant: 'destructive', title: fail.title, description: fail.description, duration: 8000 });
      setIsRegenerating(false);
    },
  });

  const handleRegenerate = (listing: SavedListing) => {
    setIsRegenerating(true);
    regenerateMutation.mutate(listing);
  };

  if (isLoading || !pageReady || usage.isLoading) {
    return (
      <DashboardPageShell className="max-w-6xl">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 text-sm"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
          {t.backDashboard}
        </Link>
        <DashboardPageHeader
          variant="dark"
          title={t.pageTitle}
          titleDataTestId="heading-listings"
          subtitle={t.pageDesc}
          planBadge={{ label: planBadgeLabel, variant: 'outline' }}
        />
        <Card className="border-white/10 bg-card/40">
          <CardHeader>
            <CardTitle className="text-lg text-white">{t.pageTitle}</CardTitle>
            <CardDescription className="text-white/60">{t.pageDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <TableSkeleton rows={6} />
          </CardContent>
        </Card>
      </DashboardPageShell>
    );
  }

  if (error && !listingsData) {
    const fail = apiFailureToast(
      feedbackLocale,
      'listingsLibrary',
      { message: error instanceof Error ? error.message : String(error) },
      t.loadErrorDesc
    );
    return (
      <DashboardPageShell className="max-w-6xl">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 text-sm"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
          {t.backDashboard}
        </Link>
        <DashboardPageHeader
          variant="dark"
          title={t.pageTitle}
          titleDataTestId="heading-listings"
          subtitle={t.pageDesc}
          planBadge={{ label: planBadgeLabel, variant: 'outline' }}
        />
        <Card className="border-white/10 bg-card/40">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <h2 className="text-xl font-semibold mb-2 text-white">{fail.title}</h2>
            <p className="text-white/65 mb-6 text-center max-w-md text-sm">
              {fail.description}
            </p>
            <p className="text-xs text-white/45 mb-4">{t.contactSupport}</p>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" onClick={() => refetch()}>
              {t.retryLoad}
            </Button>
          </CardContent>
        </Card>
      </DashboardPageShell>
    );
  }

  return (
    <DashboardPageShell className="max-w-6xl space-y-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
      >
        <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
        {t.backDashboard}
      </Link>

      <DashboardPageHeader
        variant="dark"
        title={t.pageTitle}
        subtitle={t.pageDesc}
        planBadge={{ label: planBadgeLabel, variant: 'outline' }}
        titleDataTestId="heading-listings"
        actions={
          <Button
            className="bg-gradient-to-r from-[#9333ea] to-[#06b6d4] text-white border-0"
            onClick={() => setIsCreateListingDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            {t.createListing}
          </Button>
        }
      />

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
                  onClick: () => setIsCreateListingDialogOpen(true),
                  icon: <Plus className="h-4 w-4" />,
                },
                {
                  label: t.searchMarket,
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
                  {formatDateForLocale(listing.created_at, locale as Locale)}
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
                        {listing.property_data.size} {t.sizeUnitSuffix}
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
              {t.createdOn}{' '}
              {selectedListing && formatDateForLocale(selectedListing.created_at, locale as Locale)}
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
            <AlertDialogCancel disabled={deleteMutation.isPending}>{t.cancelDialog}</AlertDialogCancel>
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
    </DashboardPageShell>
  );
}
