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
}

export interface ScraperResult {
  success: boolean;
  data?: ScrapedListing;
  error?: string;
}
