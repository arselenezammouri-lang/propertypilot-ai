/**
 * Zillow Search Scraper
 * Scrapes search result pages to extract listing URLs for US market
 */

import { BaseScraper } from './base-scraper';
import type { CheerioAPI } from 'cheerio';
import type { ScraperResult } from './types';

export interface ZillowSearchCriteria {
  city?: string; // e.g. "Miami", "New York", "Los Angeles"
  state?: string; // e.g. "FL", "NY", "CA" (optional, can be inferred from city)
  price_min?: number;
  price_max?: number;
  property_type?: string; // e.g. "house", "condo", "townhouse"
  bedrooms_min?: number;
  bathrooms_min?: number;
}

export interface ZillowSearchResult {
  success: boolean;
  urls?: string[];
  error?: string;
  totalFound?: number;
}

export class ZillowSearchScraper extends BaseScraper {
  /**
   * Implements abstract scrape method from BaseScraper
   * This scraper is designed for search results, not individual listings
   */
  async scrape(_url: string): Promise<ScraperResult> {
    return {
      success: false,
      error: 'ZillowSearchScraper is designed for search results. Use ZillowScraper for individual listings.',
    };
  }

  /**
   * Builds Zillow search URL from criteria
   */
  private buildSearchUrl(criteria: ZillowSearchCriteria, page: number = 1): string {
    const baseUrl = 'https://www.zillow.com/homes';
    
    // Zillow uses path-based search: /homes/{city}-{state}/...
    let path = '';
    
    if (criteria.city) {
      const citySlug = criteria.city.toLowerCase().replace(/\s+/g, '-');
      const stateSlug = (criteria.state || '').toLowerCase();
      path = stateSlug ? `${citySlug}-${stateSlug}` : citySlug;
    }
    
    const params = new URLSearchParams();
    
    // Price range
    if (criteria.price_min) {
      params.append('priceMin', criteria.price_min.toString());
    }
    if (criteria.price_max) {
      params.append('priceMax', criteria.price_max.toString());
    }
    
    // Property type (Zillow uses different paths: /houses/, /condos/, etc.)
    // For now, we'll use generic /homes/ path
    
    // Bedrooms
    if (criteria.bedrooms_min) {
      params.append('bedsMin', criteria.bedrooms_min.toString());
    }
    
    // Bathrooms
    if (criteria.bathrooms_min) {
      params.append('bathsMin', criteria.bathrooms_min.toString());
    }
    
    // Pagination (Zillow uses /pg-2/, /pg-3/, etc. in path, but also supports query params)
    if (page > 1) {
      params.append('page', page.toString());
    }
    
    const queryString = params.toString();
    const fullPath = path ? `/homes/${path}` : '/homes';
    
    return queryString ? `https://www.zillow.com${fullPath}/${queryString ? '?' + queryString : ''}` : `https://www.zillow.com${fullPath}`;
  }

  /**
   * Extracts listing URLs from a Zillow search results page
   */
  private extractListingUrls($: CheerioAPI): string[] {
    const urls: string[] = [];
    
    // Zillow listing links are typically in:
    // - a[data-test="property-card-link"]
    // - .PropertyCardContainer a[href*="/homedetails/"]
    // - article[data-test="property-card"] a
    
    $('a[data-test="property-card-link"], a[href*="/homedetails/"], article[data-test="property-card"] a').each((_, element) => {
      const href = $(element).attr('href');
      if (href) {
        // Make absolute URL if relative
        const fullUrl = href.startsWith('http') 
          ? href 
          : `https://www.zillow.com${href}`;
        
        // Remove query parameters and fragments, but keep /homedetails/ path
        const cleanUrl = fullUrl.split('?')[0].split('#')[0];
        
        // Only include actual listing URLs (homedetails)
        if (cleanUrl.includes('/homedetails/') && !urls.includes(cleanUrl)) {
          urls.push(cleanUrl);
        }
      }
    });
    
    // Fallback: try to find links with zpid in URL
    $('a[href*="zpid"]').each((_, element) => {
      const href = $(element).attr('href');
      if (href) {
        const fullUrl = href.startsWith('http') ? href : `https://www.zillow.com${href}`;
        const cleanUrl = fullUrl.split('?')[0].split('#')[0];
        if (cleanUrl.includes('/homedetails/') && !urls.includes(cleanUrl)) {
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
    // Zillow shows total like "1,234 results" or "Showing 1-20 of 1,234"
    const totalText = $('[data-test="total-count"], .result-count, .search-results-count').first().text();
    const match = totalText.match(/(\d{1,3}(?:,\d{3})*)/);
    
    if (match) {
      return parseInt(match[1].replace(/,/g, ''), 10);
    }
    
    return null;
  }

  /**
   * Searches Zillow for listings matching criteria
   * 
   * @param criteria Search criteria
   * @param maxPages Maximum number of pages to scrape (default: 3)
   * @returns List of listing URLs
   */
  async searchListings(
    criteria: ZillowSearchCriteria,
    maxPages: number = 3
  ): Promise<ZillowSearchResult> {
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

          // Small delay between pages to avoid rate limiting (Zillow is strict)
          if (page < maxPages) {
            await new Promise(resolve => setTimeout(resolve, 3000)); // 3 seconds delay for Zillow
          }

        } catch (pageError: any) {
          console.error(`[ZillowSearch] Error scraping page ${page}:`, pageError.message);
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
      console.error('[ZillowSearch] Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to search Zillow listings',
      };
    }
  }
}

