/**
 * `/dashboard/listings` — saved listings library
 */

export type ListingsLibraryPageUi = {
  successDeletedTitle: string;
  deleted: string;
  deletedDesc: string;
  errorTitle: string;
  deleteError: string;
  successRegenTitle: string;
  regenerated: string;
  regeneratedDesc: string;
  aiError: string;
  regenError: string;
  loadError: string;
  loadErrorDesc: string;
  contactSupport: string;
  retryLoad: string;
  pageTitle: string;
  pageDesc: string;
  emptyTitle: string;
  emptyDesc: string;
  createListing: string;
  createdOn: string;
  view: string;
  propertyDetails: string;
  locality: string;
  type: string;
  size: string;
  rooms: string;
  price: string;
  features: string;
  generatedContent: string;
  tabProfessional: string;
  tabShort: string;
  tabTitles: string;
  tabEnglish: string;
  roomsUnit: string;
  sizeUnitSuffix: string;
  regenerating: string;
  regenerate: string;
  delete: string;
  deleteConfirmTitle: string;
  deleteConfirmDesc: string;
  deleting: string;
  createDialogTitle: string;
  createDialogDesc: string;
  createFromWorkspace: string;
  searchMarket: string;
  backDashboard: string;
  cancelDialog: string;
};

export const listingsLibraryPageUiIt: ListingsLibraryPageUi = {
  successDeletedTitle: 'Libreria annunci — eliminato',
  deleted: 'Annuncio eliminato',
  deletedDesc: "L'annuncio è stato eliminato con successo.",
  errorTitle: 'Errore',
  deleteError: "Impossibile eliminare l'annuncio.",
  successRegenTitle: 'Libreria annunci — contenuto aggiornato',
  regenerated: 'Contenuto rigenerato',
  regeneratedDesc: 'Il contenuto AI è stato rigenerato con successo!',
  aiError: 'Errore AI',
  regenError: 'Impossibile rigenerare il contenuto.',
  loadError: 'Impossibile caricare gli annunci',
  loadErrorDesc:
    'Si è verificato un errore durante il caricamento della libreria. Riprova più tardi.',
  contactSupport: 'Se il problema persiste, contatta il supporto.',
  retryLoad: 'Riprova caricamento',
  pageTitle: 'Annunci salvati',
  pageDesc: 'Gestisci la tua libreria di annunci generati con AI',
  emptyTitle: 'Nessun annuncio salvato',
  emptyDesc:
    'Gli annunci che generi con AI appariranno qui. Inizia a creare il tuo primo annuncio!',
  createListing: 'Crea annuncio',
  createdOn: 'Creato il',
  view: 'Visualizza',
  propertyDetails: 'Dettagli immobile',
  locality: 'Località:',
  type: 'Tipologia:',
  size: 'Superficie:',
  rooms: 'Locali:',
  price: 'Prezzo:',
  features: 'Caratteristiche:',
  generatedContent: 'Contenuto generato',
  tabProfessional: 'Professionale',
  tabShort: 'Breve',
  tabTitles: 'Titoli',
  tabEnglish: 'Inglese',
  roomsUnit: 'locali',
  sizeUnitSuffix: 'm²',
  regenerating: 'Rigenerazione...',
  regenerate: 'Rigenera contenuto',
  delete: 'Elimina',
  deleteConfirmTitle: 'Eliminare annuncio?',
  deleteConfirmDesc:
    "L'annuncio verrà rimosso dalla libreria. Questa azione non può essere annullata.",
  deleting: 'Eliminazione...',
  createDialogTitle: 'Crea nuovo annuncio',
  createDialogDesc:
    'Scegli come iniziare: compilazione guidata o ricerca opportunità dal mercato.',
  createFromWorkspace: 'Apri workspace generazione',
  searchMarket: 'Cerca sul mercato',
  backDashboard: 'Torna alla dashboard',
  cancelDialog: 'Annulla',
};

export const listingsLibraryPageUiEn: ListingsLibraryPageUi = {
  successDeletedTitle: 'Listing library — removed',
  deleted: 'Listing deleted',
  deletedDesc: 'The listing has been deleted successfully.',
  errorTitle: 'Error',
  deleteError: 'Cannot delete the listing.',
  successRegenTitle: 'Listing library — content updated',
  regenerated: 'Content regenerated',
  regeneratedDesc: 'The AI content has been regenerated successfully!',
  aiError: 'AI error',
  regenError: 'Cannot regenerate the content.',
  loadError: 'Cannot load listings',
  loadErrorDesc: 'An error occurred while loading the library. Try again later.',
  contactSupport: 'If the problem persists, contact support.',
  retryLoad: 'Retry loading',
  pageTitle: 'Saved listings',
  pageDesc: 'Manage your AI-generated listings library',
  emptyTitle: 'No saved listings',
  emptyDesc: 'Listings you generate with AI will appear here. Start creating your first listing!',
  createListing: 'Create listing',
  createdOn: 'Created on',
  view: 'View',
  propertyDetails: 'Property details',
  locality: 'Location:',
  type: 'Type:',
  size: 'Size:',
  rooms: 'Rooms:',
  price: 'Price:',
  features: 'Features:',
  generatedContent: 'Generated content',
  tabProfessional: 'Professional',
  tabShort: 'Short',
  tabTitles: 'Titles',
  tabEnglish: 'English',
  roomsUnit: 'rooms',
  sizeUnitSuffix: 'm²',
  regenerating: 'Regenerating...',
  regenerate: 'Regenerate content',
  delete: 'Delete',
  deleteConfirmTitle: 'Delete listing?',
  deleteConfirmDesc: 'The listing will be removed from your library. This action cannot be undone.',
  deleting: 'Deleting...',
  createDialogTitle: 'Create new listing',
  createDialogDesc: 'Choose how to start: guided generation or market prospecting.',
  createFromWorkspace: 'Open generation workspace',
  searchMarket: 'Search market',
  backDashboard: 'Back to dashboard',
  cancelDialog: 'Cancel',
};
