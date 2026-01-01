import { BaseScraper } from './base-scraper';
import { ScraperResult, ScrapedListing } from './types';
import type { CheerioAPI } from 'cheerio';

export class ImmobiliareScraper extends BaseScraper {
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
