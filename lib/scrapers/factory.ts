import { BaseScraper } from './base-scraper';
import { ImmobiliareScraper } from './immobiliare-scraper';
import { IdealistaScraper } from './idealista-scraper';
import { CasaScraper } from './casa-scraper';
import { SubitoScraper } from './subito-scraper';
import { ZillowScraper } from './zillow-scraper';

export class ScraperFactory {
  private static scrapers: Map<string, BaseScraper> = new Map<string, BaseScraper>([
    ['immobiliare.it', new ImmobiliareScraper()],
    ['idealista.it', new IdealistaScraper()],
    ['casa.it', new CasaScraper()],
    ['subito.it', new SubitoScraper()],
    ['zillow.com', new ZillowScraper()],
  ]);

  static getScraper(url: string): BaseScraper | null {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.replace('www.', '');

      // Find matching scraper
      for (const [domain, scraper] of this.scrapers.entries()) {
        if (hostname.includes(domain)) {
          return scraper;
        }
      }

      return null;
    } catch (error) {
      console.error('[ScraperFactory] Invalid URL:', error);
      return null;
    }
  }

  static getSupportedDomains(): string[] {
    return Array.from(this.scrapers.keys());
  }

  static isSupportedDomain(url: string): boolean {
    return this.getScraper(url) !== null;
  }
}
