import { BaseScraper } from './base-scraper';
import { ScraperResult, ScrapedListing } from './types';
import type { CheerioAPI } from 'cheerio';

export class CasaScraper extends BaseScraper {
  async scrape(url: string): Promise<ScraperResult> {
    try {
      const html = await this.fetchHTML(url);
      const $ = this.loadCheerio(html);

      const listing: ScrapedListing = {
        title: this.cleanText($('h1.title').text()),
        price: this.cleanText($('.price').text()),
        location: this.cleanText($('.location').text()),
        surface: this.extractSurface($),
        rooms: this.extractRooms($),
        features: this.extractFeatures($),
        description_raw: this.cleanText($('.description').text()),
        images: this.extractImages($),
      };

      if (!listing.title || !listing.price) {
        return {
          success: false,
          error: 'Unable to extract required fields from Casa.it listing',
        };
      }

      return {
        success: true,
        data: listing,
      };
    } catch (error: any) {
      console.error('[CasaScraper] Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to scrape Casa.it listing',
      };
    }
  }

  private extractSurface($: CheerioAPI): string {
    const surfaceText = $('.features li').filter((_: number, el: any) => {
      return $(el).text().toLowerCase().includes('superficie');
    }).first().text();
    return this.extractNumber(surfaceText) + ' m²';
  }

  private extractRooms($: CheerioAPI): string {
    const roomsText = $('.features li').filter((_: number, el: any) => {
      return $(el).text().toLowerCase().includes('locali');
    }).first().text();
    return this.extractNumber(roomsText);
  }

  private extractFeatures($: CheerioAPI): string[] {
    const features: string[] = [];
    
    $('.features li').each((_: number, el: any) => {
      const feature = this.cleanText($(el).text());
      if (feature) features.push(feature);
    });

    return features;
  }

  private extractImages($: CheerioAPI): string[] {
    const images: string[] = [];
    
    $('.gallery img').each((index: number, el: any) => {
      if (index >= 10) return false;
      
      const src = $(el).attr('src') || $(el).attr('data-src');
      if (src && !src.includes('placeholder')) {
        images.push(src);
      }
    });

    return [...new Set(images)];
  }
}
