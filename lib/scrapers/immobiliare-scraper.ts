import { BaseScraper } from './base-scraper';
import { ScraperResult, ScrapedListing } from './types';
import type { CheerioAPI } from 'cheerio';
import { createFallbackListing } from './fallback-listing';

export class ImmobiliareScraper extends BaseScraper {
  constructor() {
    super();
    // Stronger anti-403 profile for Immobiliare: more retries + wider UA rotation.
    this.maxRetries = 4;
    this.minJitterMs = 450;
    this.maxJitterMs = 1400;
    this.userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_6_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.6367.207 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.6367.201 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15',
    ];
  }

  async scrape(url: string): Promise<ScraperResult> {
    try {
      const html = await this.fetchHTML(url);
      const $ = this.loadCheerio(html);

      const listing: ScrapedListing = {
        title: this.cleanText($('h1.im-titleBlock__title').text()),
        price: this.cleanText($('.im-mainFeatures__price').text()),
        location: this.cleanText($('.im-breadcrumb__list li:last-child').text()),
        surface: this.extractSurface($),
        rooms: this.extractRooms($),
        features: this.extractFeatures($),
        description_raw: this.cleanText($('.im-description__text').text()),
        images: this.extractImages($),
        propertyType: this.cleanText($('.im-mainFeatures__title').first().text()),
      };

      // Validate required fields
      if (!listing.title || !listing.price) {
        return {
          success: false,
          error: 'Unable to extract required fields from Immobiliare.it listing',
        };
      }

      return {
        success: true,
        data: listing,
      };
    } catch (error: any) {
      console.error('[ImmobiliareScraper] Error:', error);

      if (this.isBlockedRequestError(error)) {
        return {
          success: true,
          data: createFallbackListing(url, 'immobiliare.it', 'blocked_403'),
        };
      }

      return {
        success: false,
        error: error.message || 'Failed to scrape Immobiliare.it listing',
      };
    }
  }

  private extractSurface($: CheerioAPI): string {
    const surfaceText = $('.im-features__item--surface .im-features__value').text();
    return this.cleanText(surfaceText);
  }

  private extractRooms($: CheerioAPI): string {
    const roomsText = $('.im-features__item--rooms .im-features__value').text();
    return this.cleanText(roomsText);
  }

  private extractFeatures($: CheerioAPI): string[] {
    const features: string[] = [];
    
    $('.im-features__list .im-features__item').each((_: number, el: any) => {
      const feature = this.cleanText($(el).text());
      if (feature) features.push(feature);
    });

    $('.im-features__tags .im-tags__tag').each((_: number, el: any) => {
      const tag = this.cleanText($(el).text());
      if (tag) features.push(tag);
    });

    return features;
  }

  private extractImages($: CheerioAPI): string[] {
    const images: string[] = [];
    
    $('.im-gallery__thumbs img, .im-carousel__item img').each((index: number, el: any) => {
      if (index >= 10) return false; // Max 10 images
      
      const src = $(el).attr('src') || $(el).attr('data-src');
      if (src && !src.includes('placeholder')) {
        // Get high-res version if available
        const highResSrc = src.replace(/\/thumb\//g, '/medium/');
        images.push(highResSrc);
      }
    });

    return [...new Set(images)]; // Remove duplicates
  }
}
