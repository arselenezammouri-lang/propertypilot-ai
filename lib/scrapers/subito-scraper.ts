import { BaseScraper } from './base-scraper';
import { ScraperResult, ScrapedListing } from './types';
import type { CheerioAPI } from 'cheerio';

export class SubitoScraper extends BaseScraper {
  async scrape(url: string): Promise<ScraperResult> {
    try {
      const html = await this.fetchHTML(url);
      const $ = this.loadCheerio(html);

      const listing: ScrapedListing = {
        title: this.cleanText($('h1[data-cy="ad-title"]').text()),
        price: this.cleanText($('.price').text() || $('[data-cy="ad-price"]').text()),
        location: this.cleanText($('.locality').text() || $('[data-cy="ad-location"]').text()),
        surface: this.extractSurface($),
        rooms: this.extractRooms($),
        features: this.extractFeatures($),
        description_raw: this.cleanText($('.description').text() || $('[data-cy="ad-description"]').text()),
        images: this.extractImages($),
      };

      if (!listing.title || !listing.price) {
        return {
          success: false,
          error: 'Unable to extract required fields from Subito.it listing',
        };
      }

      return {
        success: true,
        data: listing,
      };
    } catch (error: any) {
      console.error('[SubitoScraper] Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to scrape Subito.it listing',
        };
    }
  }

  private extractSurface($: CheerioAPI): string {
    const surfaceText = $('.features dd, .features-list dd').filter((_: number, el: any) => {
      const prevLabel = $(el).prev('dt').text().toLowerCase();
      return prevLabel.includes('superficie') || prevLabel.includes('mq');
    }).first().text();
    return this.cleanText(surfaceText);
  }

  private extractRooms($: CheerioAPI): string {
    const roomsText = $('.features dd, .features-list dd').filter((_: number, el: any) => {
      const prevLabel = $(el).prev('dt').text().toLowerCase();
      return prevLabel.includes('locali') || prevLabel.includes('vani');
    }).first().text();
    return this.cleanText(roomsText);
  }

  private extractFeatures($: CheerioAPI): string[] {
    const features: string[] = [];
    
    $('.features dl, .features-list dl').each((_: number, dl: any) => {
      $(dl).find('dt, dd').each((index: number, el: any) => {
        const text = this.cleanText($(el).text());
        if (text && index % 2 === 0) { // Only DT labels
          const value = this.cleanText($(el).next('dd').text());
          if (value) {
            features.push(`${text}: ${value}`);
          }
        }
      });
    });

    return features;
  }

  private extractImages($: CheerioAPI): string[] {
    const images: string[] = [];
    
    $('.gallery-thumbnails img, .item-image img, [data-cy="gallery-image"]').each((index: number, el: any) => {
      if (index >= 10) return false;
      
      const src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-lazy-src');
      if (src && !src.includes('placeholder') && !src.includes('no-image')) {
        // Try to get higher resolution
        const highResSrc = src.replace(/thumb|small/gi, 'large');
        images.push(highResSrc);
      }
    });

    return [...new Set(images)];
  }
}
