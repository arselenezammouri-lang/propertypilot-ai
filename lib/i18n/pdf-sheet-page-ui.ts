/** `/dashboard/pdf` — property PDF sheet generator */

export type PdfSheetPageUi = {
  pageTitle: string;
  pageSubtitle: string;
  backDashboard: string;
  pdfGenerated: string;
  pdfGeneratedDesc: string;
  errorTitle: string;
  limitReached: string;
  maxImages: string;
  invalidUrl: string;
  invalidUrlDesc: string;
  pdfError: string;
  templateSection: string;
  chooseTemplateHeading: string;
  templateModernTitle: string;
  templateModernDesc: string;
  templateLuxuryTitle: string;
  templateLuxuryDesc: string;
  brandingPdfHeading: string;
  brandingAgencyTitle: string;
  /** `{name}` agency name */
  brandingUseAgencyWithName: string;
  brandingConfigureFirst: string;
  brandingConfigureCta: string;
  colorPrimary: string;
  colorSecondary: string;
  colorAccent: string;
  brandingDefaultPropertyPilot: string;
  propertyInfoSection: string;
  titleLabel: string;
  titlePlaceholder: string;
  descLabel: string;
  descPlaceholder: string;
  aiRewriteSection: string;
  aiRewriteLabel: string;
  aiRewritePlaceholder: string;
  featuresSection: string;
  priceLabel: string;
  pricePlaceholder: string;
  surfaceLabel: string;
  surfacePlaceholder: string;
  roomsLabel: string;
  roomsPlaceholder: string;
  bathroomsLabel: string;
  bathroomsPlaceholder: string;
  floorLabel: string;
  floorPlaceholder: string;
  propertyTypeShortLabel: string;
  propertyTypePlaceholder: string;
  addressLabel: string;
  addressPlaceholder: string;
  statusLabel: string;
  statusPlaceholder: string;
  energyLabel: string;
  energyPlaceholder: string;
  yearLabel: string;
  yearPlaceholder: string;
  heatingLabel: string;
  heatingPlaceholder: string;
  parkingLabel: string;
  parkingPlaceholder: string;
  imagesSection: string;
  imageUrlPlaceholder: string;
  addImageBtn: string;
  imageAltTemplate: string;
  imageLoadError: string;
  imagesEmptyHint: string;
  agentSectionHeading: string;
  agentNameShort: string;
  agentNamePlaceholder: string;
  agentPhoneShort: string;
  agentPhonePlaceholder: string;
  agentEmailShort: string;
  agentEmailPlaceholder: string;
  generateBtn: string;
  generatingBtn: string;
  downloadBtn: string;
  sidebarReadyTitle: string;
  sidebarReadyDesc: string;
  previewTitle: string;
  previewDesc: string;
  proTipsTitle: string;
  proTipHighRes: string;
  proTipFirstImage: string;
  proTipAiVersion: string;
  proTipLuxury: string;
  zodTitleRequired: string;
  zodDescriptionMin: string;
  checkRequiredFields: string;
};

export const pdfSheetPageUiIt: PdfSheetPageUi = {
  pageTitle: 'Scheda immobile PDF',
  pageSubtitle: 'Crea schede professionali per i tuoi annunci',
  backDashboard: 'Torna alla dashboard',
  pdfGenerated: 'PDF generato!',
  pdfGeneratedDesc: 'La tua scheda immobile è pronta per il download.',
  errorTitle: 'Errore',
  limitReached: 'Limite raggiunto',
  maxImages: 'Puoi aggiungere massimo 6 immagini',
  invalidUrl: 'URL non valido',
  invalidUrlDesc: "Inserisci un URL valido per l'immagine",
  pdfError: 'Errore durante la generazione del PDF',
  templateSection: 'Template',
  chooseTemplateHeading: 'Scegli il template',
  templateModernTitle: 'Modern Real Estate',
  templateModernDesc: 'Professionale e moderno',
  templateLuxuryTitle: 'Luxury Premium',
  templateLuxuryDesc: 'Elegante e raffinato',
  brandingPdfHeading: 'Branding PDF',
  brandingAgencyTitle: 'Branding agenzia (white label)',
  brandingUseAgencyWithName: 'Usa il brand di {name}',
  brandingConfigureFirst: 'Configura prima il branding della tua agenzia',
  brandingConfigureCta: 'Configura',
  colorPrimary: 'Primario',
  colorSecondary: 'Secondario',
  colorAccent: 'Accento',
  brandingDefaultPropertyPilot: 'Il PDF verrà generato con il branding PropertyPilot AI',
  propertyInfoSection: 'Informazioni immobile',
  titleLabel: 'Titolo annuncio *',
  titlePlaceholder: 'Es: Villa di lusso con vista mare',
  descLabel: 'Descrizione *',
  descPlaceholder: "Descrivi l'immobile in dettaglio...",
  aiRewriteSection: 'Riscrittura AI (opzionale)',
  aiRewriteLabel: 'Testo da riscrivere con AI',
  aiRewritePlaceholder: "Incolla qui la versione riscritta dall'AI...",
  featuresSection: 'Caratteristiche',
  priceLabel: 'Prezzo',
  pricePlaceholder: '€ 450.000',
  surfaceLabel: 'Superficie',
  surfacePlaceholder: '120 mq',
  roomsLabel: 'Locali',
  roomsPlaceholder: '4 locali',
  bathroomsLabel: 'Bagni',
  bathroomsPlaceholder: '2 bagni',
  floorLabel: 'Piano',
  floorPlaceholder: '3° piano',
  propertyTypeShortLabel: 'Tipologia',
  propertyTypePlaceholder: 'Appartamento',
  addressLabel: 'Indirizzo',
  addressPlaceholder: 'Via Roma, 15 — Milano',
  statusLabel: 'Stato',
  statusPlaceholder: 'Ottimo stato',
  energyLabel: 'Classe energetica',
  energyPlaceholder: 'A+',
  yearLabel: 'Anno',
  yearPlaceholder: '2020',
  heatingLabel: 'Riscaldamento',
  heatingPlaceholder: 'Autonomo',
  parkingLabel: 'Parcheggio',
  parkingPlaceholder: 'Box auto',
  imagesSection: 'Immagini (max 6)',
  imageUrlPlaceholder: 'Incolla URL immagine...',
  addImageBtn: 'Aggiungi',
  imageAltTemplate: 'Immagine {n}',
  imageLoadError: 'Errore',
  imagesEmptyHint: 'Aggiungi fino a 6 immagini per la scheda PDF',
  agentSectionHeading: 'Info agente (opzionale)',
  agentNameShort: 'Nome',
  agentNamePlaceholder: 'Mario Rossi',
  agentPhoneShort: 'Telefono',
  agentPhonePlaceholder: '+39 333 1234567',
  agentEmailShort: 'Email',
  agentEmailPlaceholder: 'mario@agenzia.it',
  generateBtn: 'Genera scheda PDF',
  generatingBtn: 'Generazione in corso...',
  downloadBtn: 'Scarica PDF',
  sidebarReadyTitle: 'PDF pronto!',
  sidebarReadyDesc: 'La tua scheda immobile è stata generata con successo',
  previewTitle: 'Anteprima PDF',
  previewDesc: 'Compila i dati e genera la tua scheda PDF professionale',
  proTipsTitle: 'Consigli pro',
  proTipHighRes: 'Usa immagini di alta qualità (almeno 800px)',
  proTipFirstImage: "La prima immagine sarà l'hero principale",
  proTipAiVersion: 'Aggiungi la versione AI per un impatto premium',
  proTipLuxury: 'Il template Luxury è ideale per immobili di pregio',
  zodTitleRequired: 'Il titolo è obbligatorio',
  zodDescriptionMin: 'La descrizione deve avere almeno 10 caratteri',
  checkRequiredFields: 'Controlla i campi obbligatori.',
};

export const pdfSheetPageUiEn: PdfSheetPageUi = {
  pageTitle: 'Property PDF sheet',
  pageSubtitle: 'Create professional sheets for your listings',
  backDashboard: 'Back to dashboard',
  pdfGenerated: 'PDF generated!',
  pdfGeneratedDesc: 'Your property sheet is ready for download.',
  errorTitle: 'Error',
  limitReached: 'Limit reached',
  maxImages: 'You can add a maximum of 6 images',
  invalidUrl: 'Invalid URL',
  invalidUrlDesc: 'Enter a valid URL for the image',
  pdfError: 'Error during PDF generation',
  templateSection: 'Template',
  chooseTemplateHeading: 'Choose template',
  templateModernTitle: 'Modern Real Estate',
  templateModernDesc: 'Professional and modern',
  templateLuxuryTitle: 'Luxury Premium',
  templateLuxuryDesc: 'Elegant and refined',
  brandingPdfHeading: 'PDF branding',
  brandingAgencyTitle: 'Agency branding (white label)',
  brandingUseAgencyWithName: 'Use branding for {name}',
  brandingConfigureFirst: 'Configure your agency branding first',
  brandingConfigureCta: 'Configure',
  colorPrimary: 'Primary',
  colorSecondary: 'Secondary',
  colorAccent: 'Accent',
  brandingDefaultPropertyPilot: 'The PDF will use PropertyPilot AI branding',
  propertyInfoSection: 'Property information',
  titleLabel: 'Listing title *',
  titlePlaceholder: 'e.g. Luxury villa with sea view',
  descLabel: 'Description *',
  descPlaceholder: 'Describe the property in detail...',
  aiRewriteSection: 'AI rewrite (optional)',
  aiRewriteLabel: 'Text to rewrite with AI',
  aiRewritePlaceholder: 'Paste the AI-rewritten version here...',
  featuresSection: 'Features',
  priceLabel: 'Price',
  pricePlaceholder: '$ 450,000',
  surfaceLabel: 'Surface',
  surfacePlaceholder: '120 sqm',
  roomsLabel: 'Rooms',
  roomsPlaceholder: '4 rooms',
  bathroomsLabel: 'Bathrooms',
  bathroomsPlaceholder: '2 baths',
  floorLabel: 'Floor',
  floorPlaceholder: '3rd floor',
  propertyTypeShortLabel: 'Type',
  propertyTypePlaceholder: 'Apartment',
  addressLabel: 'Address',
  addressPlaceholder: '123 Main St — Miami',
  statusLabel: 'Condition',
  statusPlaceholder: 'Excellent',
  energyLabel: 'Energy class',
  energyPlaceholder: 'A+',
  yearLabel: 'Year',
  yearPlaceholder: '2020',
  heatingLabel: 'Heating',
  heatingPlaceholder: 'Independent',
  parkingLabel: 'Parking',
  parkingPlaceholder: 'Garage',
  imagesSection: 'Images (max 6)',
  imageUrlPlaceholder: 'Paste image URL...',
  addImageBtn: 'Add',
  imageAltTemplate: 'Image {n}',
  imageLoadError: 'Error',
  imagesEmptyHint: 'Add up to 6 images for the PDF sheet',
  agentSectionHeading: 'Agent info (optional)',
  agentNameShort: 'Name',
  agentNamePlaceholder: 'Jane Smith',
  agentPhoneShort: 'Phone',
  agentPhonePlaceholder: '+1 555 123 4567',
  agentEmailShort: 'Email',
  agentEmailPlaceholder: 'jane@agency.com',
  generateBtn: 'Generate PDF sheet',
  generatingBtn: 'Generating...',
  downloadBtn: 'Download PDF',
  sidebarReadyTitle: 'PDF ready!',
  sidebarReadyDesc: 'Your property sheet was generated successfully',
  previewTitle: 'PDF preview',
  previewDesc: 'Fill in the data and generate your professional PDF sheet',
  proTipsTitle: 'Pro tips',
  proTipHighRes: 'Use high-quality images (at least 800px)',
  proTipFirstImage: 'The first image will be the main hero',
  proTipAiVersion: 'Add the AI version for a premium impact',
  proTipLuxury: 'The Luxury template is ideal for high-end properties',
  zodTitleRequired: 'Title is required',
  zodDescriptionMin: 'Description must be at least 10 characters',
  checkRequiredFields: 'Check required fields.',
};
