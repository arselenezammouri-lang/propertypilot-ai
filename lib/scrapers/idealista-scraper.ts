import { BaseScraper } from './base-scraper';
import { ScraperResult, ScrapedListing } from './types';
import type { CheerioAPI } from 'cheerio';

export class IdealistaScraper extends BaseScraper {
  async scrape(url: string): Promise<ScraperResult> {
    try {
      const html = await this.fetchHTML(url);
      const $ = this.loadCheerio(html);

      const listing: ScrapedListing = {
        title: this.cleanText($('h1.main-info__title-main').text()),
        price: this.cleanText($('.info-data-price span').first().text()),
        location: this.cleanText($('.main-info__title-minor').text()),
        surface: this.extractSurface($),
        rooms: this.extractRooms($),
        features: this.extractFeatures($),
        description_raw: this.cleanText($('.comment').text()),
        images: this.extractImages($),
        propertyType: this.cleanText($('.typology').text()),
      };

      if (!listing.title || !listing.price) {
        return {
          success: false,
          error: 'Unable to extract required fields from Idealista listing',
        };
      }

      return {
        success: true,
        data: listing,
      };
    } catch (error: any) {
      console.error('[IdealistaScraper] Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to scrape Idealista listing',
      };
    }
  }

  private extractSurface($: CheerioAPI): string {
    const surfaceText = $('.info-features li').filter((_: number, el: any) => {
      return $(el).text().includes('m²');
    }).first().text();
    return this.extractNumber(surfaceText) + ' m²';
  }

  private extractRooms($: CheerioAPI): string {
    const roomsText = $('.info-features li').filter((_: number, el: any) => {
      const text = $(el).text().toLowerCase();
      return text.includes('camere') || text.includes('locali');
    }).first().text();
    return this.extractNumber(roomsText);
  }

  private extractFeatures($: CheerioAPI): string[] {
    const features: string[] = [];
    
    $('.details-property_features li').each((_: number, el: any) => {
      const feature = this.cleanText($(el).text());
      if (feature) features.push(feature);
    });

    $('.info-features li').each((_: number, el: any) => {
      const feature = this.cleanText($(el).text());
      if (feature && !features.includes(feature)) {
        features.push(feature);
      }
    });

    return features;
  }

  private extractImages($: CheerioAPI): string[] {
    const images: string[] = [];
    
    $('.detail-gallery-image img, .fullscreen-gallery img').each((index: number, el: any) => {
      if (index >= 10) return false;
      
      const src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-ondemand-img');
      if (src && !src.includes('placeholder') && !src.includes('logo')) {
        images.push(src);
      }
    });

    return [...new Set(images)];
  }
}
