export interface ScrapedListing {
  title: string;
  price: string;
  location: string;
  surface: string;
  rooms: string;
  features: string[];
  description_raw: string;
  images: string[];
  propertyType?: string;
  isFallback?: boolean;
  fallbackReason?: string;
  sourcePortal?: string;
}

export interface ScraperResult {
  success: boolean;
  data?: ScrapedListing;
  error?: string;
}
