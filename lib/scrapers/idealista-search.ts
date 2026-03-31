/**
 * Idealista Search Scraper
 * Scrapes search result pages to extract listing URLs
 */

import { BaseScraper } from './base-scraper';
import type { CheerioAPI } from 'cheerio';
import type { ScraperResult } from './types';

export interface SearchCriteria {
  location?: string; // e.g. "Milano", "Roma"
  price_min?: number;
  price_max?: number;
  property_type?: string; // e.g. "appartamenti", "case", "villette"
  rooms_min?: number;
  rooms_max?: number;
}

export interface SearchResult {
  success: boolean;
  urls?: string[];
  error?: string;
  totalFound?: number;
}

export class IdealistaSearchScraper extends BaseScraper {
  /**
   * Implements abstract scrape method from BaseScraper
   * This scraper is designed for search results, not individual listings
   */
  async scrape(_url: string): Promise<ScraperResult> {
    return {
      success: false,
      error: 'IdealistaSearchScraper is designed for search results. Use IdealistaScraper for individual listings.',
    };
  }

  /**
   * Builds Idealista search URL from criteria
   */
  private buildSearchUrl(criteria: SearchCriteria, page: number = 1): string {
    const baseUrl = 'https://www.idealista.it/vendita-case';
    
    const params = new URLSearchParams();
    
    // Location (query parameter)
    if (criteria.location) {
      // Idealista uses "localita" parameter
      params.append('localita', criteria.location);
    }
    
    // Price range
    if (criteria.price_min) {
      params.append('precioMin', criteria.price_min.toString());
    }
    if (criteria.price_max) {
      params.append('precioMax', criteria.price_max.toString());
    }
    
    // Property type is in the URL path (already in baseUrl: "vendita-case")
    // For "appartamenti", URL would be "vendita-case/appartamenti"
    
    // Rooms
    if (criteria.rooms_min) {
      params.append('dormitoriosMin', criteria.rooms_min.toString());
    }
    if (criteria.rooms_max) {
      params.append('dormitoriosMax', criteria.rooms_max.toString());
    }
    
    // Pagination
    if (page > 1) {
      params.append('pagina', page.toString());
    }
    
    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  }

  /**
   * Extracts listing URLs from a search results page
   */
  private extractListingUrls($: CheerioAPI): string[] {
    const urls: string[] = [];
    
    // Idealista listing links are typically in elements like:
    // - .item-info-container > a
    // - .item-link
    // - a[href*="/inmueble/"] or a[href*="/annuncio/"]
    
    $('a[href*="/inmueble/"], a[href*="/annuncio/"]').each((_, element) => {
      const href = $(element).attr('href');
      if (href) {
        // Make absolute URL if relative
        const fullUrl = href.startsWith('http') 
          ? href 
          : `https://www.idealista.it${href}`;
        
        // Remove query parameters and fragments
        const cleanUrl = fullUrl.split('?')[0].split('#')[0];
        
        // Avoid duplicates
        if (cleanUrl && !urls.includes(cleanUrl)) {
          urls.push(cleanUrl);
        }
      }
    });
    
    return urls;
  }

  /**
   * Gets total number of results from search page
   */
  private extractTotalResults($: CheerioAPI): number | null {
    // Idealista shows total like "Trovati X annunci"
    const totalText = $('.breadcrumb-list, .search-results-count, .total-results').first().text();
    const match = totalText.match(/(\d+\.?\d*)/);
    
    if (match) {
      return parseInt(match[1].replace(/\./g, ''), 10);
    }
    
    return null;
  }

  /**
   * Searches Idealista for listings matching criteria
   * 
   * @param criteria Search criteria
   * @param maxPages Maximum number of pages to scrape (default: 3)
   * @returns List of listing URLs
   */
  async searchListings(
    criteria: SearchCriteria,
    maxPages: number = 3
  ): Promise<SearchResult> {
    try {
      const allUrls: string[] = [];
      let totalFound: number | null = null;

      for (let page = 1; page <= maxPages; page++) {
        const searchUrl = this.buildSearchUrl(criteria, page);

        try {
          const html = await this.fetchHTML(searchUrl);
          const $ = this.loadCheerio(html);

          // Extract total results from first page
          if (page === 1) {
            totalFound = this.extractTotalResults($);
          }

          // Extract listing URLs
          const pageUrls = this.extractListingUrls($);
          
          if (pageUrls.length === 0) {
            break;
          }

          allUrls.push(...pageUrls);

          // Small delay between pages to avoid rate limiting
          if (page < maxPages) {
            await new Promise(resolve => setTimeout(resolve, 2000)); // 2 seconds delay
          }

        } catch (pageError: any) {
          console.error(`[IdealistaSearch] Error scraping page ${page}:`, pageError.message);
          // Continue with next page if one fails
          if (page === 1) {
            // If first page fails, return error
            return {
              success: false,
              error: `Failed to scrape first page: ${pageError.message}`,
            };
          }
          break;
        }
      }

      // Remove duplicates
      const uniqueUrls = [...new Set(allUrls)];


      return {
        success: true,
        urls: uniqueUrls,
        totalFound: totalFound || undefined,
      };

    } catch (error: any) {
      console.error('[IdealistaSearch] Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to search Idealista listings',
      };
    }
  }

}

