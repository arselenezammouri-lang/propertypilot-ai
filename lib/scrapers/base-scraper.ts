import axios from 'axios';
import * as cheerio from 'cheerio';
import type { CheerioAPI } from 'cheerio';
import { ScraperResult } from './types';

export abstract class BaseScraper {
  protected userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  protected timeout = 15000; // 15 seconds
  protected maxRetries = 3;

  abstract scrape(url: string): Promise<ScraperResult>;

  protected async fetchHTML(url: string): Promise<string> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await axios.get(url, {
          headers: {
            'User-Agent': this.userAgent,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
          },
          timeout: this.timeout,
          maxRedirects: 5,
        });

        return response.data;
      } catch (error: any) {
        lastError = error;
        console.error(`[Scraper] Attempt ${attempt}/${this.maxRetries} failed:`, error.message);
        
        if (attempt < this.maxRetries) {
          // Exponential backoff: 1s, 2s, 4s
          await this.sleep(1000 * Math.pow(2, attempt - 1));
        }
      }
    }

    throw new Error(`Failed to fetch URL after ${this.maxRetries} attempts: ${lastError?.message}`);
  }

  protected loadCheerio(html: string): CheerioAPI {
    return cheerio.load(html);
  }

  protected cleanText(text: string | undefined): string {
    if (!text) return '';
    return text.trim().replace(/\s+/g, ' ');
  }

  protected extractNumber(text: string): string {
    const match = text.match(/[\d.,]+/);
    return match ? match[0] : '';
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
