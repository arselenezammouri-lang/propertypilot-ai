import { BaseScraper } from './base-scraper';
import { ScraperResult, ScrapedListing } from './types';
import type { CheerioAPI } from 'cheerio';

export class ZillowScraper extends BaseScraper {
  protected userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36';
  protected timeout = 20000;

  async scrape(url: string): Promise<ScraperResult> {
    try {
      const html = await this.fetchHTML(url);
      
      const jsonLdData = this.extractJsonLd(html);
      if (jsonLdData) {
        return { success: true, data: jsonLdData };
      }
      
      const $ = this.loadCheerio(html);

      const listing: ScrapedListing = {
        title: this.extractTitle($),
        price: this.extractPrice($),
        location: this.extractLocation($),
        surface: this.extractSurface($),
        rooms: this.extractRooms($),
        features: this.extractFeatures($),
        description_raw: this.extractDescription($),
        images: this.extractImages($),
        propertyType: this.extractPropertyType($),
      };

      if (!listing.title && !listing.price) {
        return {
          success: false,
          error: 'Unable to extract required fields from Zillow listing. The page structure may have changed.',
        };
      }

      return {
        success: true,
        data: listing,
      };
    } catch (error: any) {
      console.error('[ZillowScraper] Error:', error);
      
      if (error.message?.includes('403') || error.message?.includes('blocked')) {
        return {
          success: false,
          error: 'Zillow has temporarily blocked access. Try again later or use manual input.',
        };
      }
      
      return {
        success: false,
        error: error.message || 'Failed to scrape Zillow listing',
      };
    }
  }

  private extractTitle($: CheerioAPI): string {
    const selectors = [
      'h1[data-test="bdp-home-details-title"]',
      'h1.Text-c11n-8-99-3__sc-aiai24-0',
      '[data-testid="home-details-chip-container"] h1',
      'h1',
    ];

    for (const selector of selectors) {
      const text = this.cleanText($(selector).first().text());
      if (text && text.length > 5) {
        return text;
      }
    }

    const address = this.extractLocation($);
    return address || 'Property Listing';
  }

  private extractPrice($: CheerioAPI): string {
    const selectors = [
      '[data-testid="price"] span',
      'span[data-test="property-card-price"]',
      '.ds-value',
      '.price',
      '[class*="price"]',
    ];

    for (const selector of selectors) {
      const text = this.cleanText($(selector).first().text());
      if (text && text.includes('$')) {
        return text;
      }
    }

    const priceMatch = $.html().match(/\$[\d,]+/);
    return priceMatch ? priceMatch[0] : '';
  }

  private extractLocation($: CheerioAPI): string {
    const selectors = [
      '[data-testid="fs-chip-container"] h1',
      '.ds-address-container',
      '[class*="address"]',
      'h1',
    ];

    for (const selector of selectors) {
      const text = this.cleanText($(selector).first().text());
      if (text && (text.includes(',') || text.match(/\d{5}/))) {
        return text;
      }
    }

    return '';
  }

  private extractSurface($: CheerioAPI): string {
    const selectors = [
      '[data-testid="bed-bath-sqft-fact-container"] span:contains("sqft")',
      'span:contains("sqft")',
      'span:contains("sq ft")',
    ];

    for (const selector of selectors) {
      const el = $(selector).first();
      const text = this.cleanText(el.text());
      const match = text.match(/[\d,]+\s*(sqft|sq ft)/i);
      if (match) {
        return match[0];
      }
    }

    const sqftMatch = $.html().match(/[\d,]+\s*sqft/i);
    return sqftMatch ? sqftMatch[0] : '';
  }

  private extractRooms($: CheerioAPI): string {
    const rooms: string[] = [];

    const bedMatch = $.html().match(/(\d+)\s*(bd|bed|bedroom)/i);
    if (bedMatch) {
      rooms.push(`${bedMatch[1]} bed`);
    }

    const bathMatch = $.html().match(/(\d+\.?\d*)\s*(ba|bath|bathroom)/i);
    if (bathMatch) {
      rooms.push(`${bathMatch[1]} bath`);
    }

    return rooms.join(', ');
  }

  private extractPropertyType($: CheerioAPI): string {
    const typeMatch = $.html().match(/(Single Family|Condo|Townhouse|Multi-Family|Apartment|House|Villa)/i);
    return typeMatch ? typeMatch[0] : 'Property';
  }

  private extractFeatures($: CheerioAPI): string[] {
    const features: string[] = [];
    
    $('[data-testid="facts-container"] li, .ds-home-fact-list li, [class*="fact"] li').each((_: number, el: any) => {
      const feature = this.cleanText($(el).text());
      if (feature && feature.length < 100) {
        features.push(feature);
      }
    });

    const yearBuilt = $.html().match(/Built in (\d{4})/i);
    if (yearBuilt) {
      features.push(`Built: ${yearBuilt[1]}`);
    }

    const lotSize = $.html().match(/Lot: ([\d,.]+ (?:acres?|sqft|sq ft))/i);
    if (lotSize) {
      features.push(`Lot: ${lotSize[1]}`);
    }

    return features.slice(0, 20);
  }

  private extractDescription($: CheerioAPI): string {
    const selectors = [
      '[data-testid="description"] .Text-c11n-8-99-3__sc-aiai24-0',
      '.ds-overview-section',
      '[data-testid="description"]',
      '.home-description',
      '[class*="description"]',
    ];

    for (const selector of selectors) {
      const text = this.cleanText($(selector).first().text());
      if (text && text.length > 50) {
        return text;
      }
    }

    return '';
  }

  private extractImages($: CheerioAPI): string[] {
    const images: string[] = [];
    
    const selectors = [
      '[data-testid="media-stream"] img',
      '.media-stream img',
      '.photo-tile img',
      'picture img',
    ];

    for (const selector of selectors) {
      $(selector).each((index: number, el: any) => {
        if (index >= 10) return false;
        
        const src = $(el).attr('src') || $(el).attr('data-src');
        if (src && !src.includes('placeholder') && !src.includes('logo') && src.startsWith('http')) {
          const highRes = src.replace(/_w\d+/, '_w1024').replace(/_h\d+/, '_h768');
          images.push(highRes);
        }
      });

      if (images.length > 0) break;
    }

    return [...new Set(images)];
  }

  private extractJsonLd(html: string): ScrapedListing | null {
    try {
      const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
      if (!jsonLdMatch) return null;

      const jsonData = JSON.parse(jsonLdMatch[1]);
      
      const product = Array.isArray(jsonData) 
        ? jsonData.find((item: any) => item['@type'] === 'Product' || item['@type'] === 'RealEstateListing')
        : jsonData;
      
      if (!product) return null;

      const listing: ScrapedListing = {
        title: product.name || '',
        price: product.offers?.price ? `$${product.offers.price.toLocaleString()}` : '',
        location: product.address 
          ? `${product.address.streetAddress || ''}, ${product.address.addressLocality || ''}, ${product.address.addressRegion || ''} ${product.address.postalCode || ''}`.trim()
          : '',
        surface: product.floorSize?.value ? `${product.floorSize.value} sqft` : '',
        rooms: '',
        features: [],
        description_raw: product.description || '',
        images: product.image ? (Array.isArray(product.image) ? product.image : [product.image]) : [],
        propertyType: product['@type'] || 'Property',
      };

      if (product.numberOfRooms) {
        listing.rooms = `${product.numberOfRooms} rooms`;
      }

      if (listing.title || listing.description_raw) {
        return listing;
      }

      return null;
    } catch (error) {
      return null;
    }
  }
}
