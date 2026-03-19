import axios from 'axios';
import * as cheerio from 'cheerio';
import type { CheerioAPI } from 'cheerio';
import { ScraperResult } from './types';

export abstract class BaseScraper {
  protected userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_6_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.6367.207 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.6367.201 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15',
  ];
  protected timeout = 15000; // 15 seconds
  protected maxRetries = 3;
  protected minJitterMs = 250;
  protected maxJitterMs = 900;

  abstract scrape(url: string): Promise<ScraperResult>;

  protected async fetchHTML(url: string): Promise<string> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        if (attempt > 1) {
          await this.sleep(this.getRandomDelay(this.minJitterMs, this.maxJitterMs));
        }

        const response = await axios.get(url, {
          headers: this.buildHeaders(url, attempt),
          timeout: this.timeout,
          maxRedirects: 5,
          validateStatus: (status) => status >= 200 && status < 400,
        });

        return response.data;
      } catch (error: any) {
        const statusCode = error?.response?.status;
        const errorMessage = error?.message || 'Unknown scraper error';
        lastError = error instanceof Error ? error : new Error(String(errorMessage));
        console.error(`[Scraper] Attempt ${attempt}/${this.maxRetries} failed:`, error.message);

        if (statusCode === 403 && attempt === this.maxRetries) {
          const blockedError = new Error(`SCRAPER_BLOCKED_403: ${errorMessage}`);
          (blockedError as Error & { code?: string }).code = 'SCRAPER_BLOCKED_403';
          throw blockedError;
        }

        if (attempt < this.maxRetries) {
          // Exponential backoff with jitter: (1s, 2s, 4s) + random delay
          const retryDelayMs =
            1000 * Math.pow(2, attempt - 1) +
            this.getRandomDelay(this.minJitterMs, this.maxJitterMs);
          await this.sleep(retryDelayMs);
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

  protected isBlockedRequestError(error: unknown): boolean {
    const message = (error instanceof Error ? error.message : String(error)).toLowerCase();
    return (
      message.includes('scraper_blocked_403') ||
      message.includes(' 403') ||
      message.includes('403') ||
      message.includes('forbidden')
    );
  }

  private buildHeaders(url: string, attempt: number) {
    const userAgent = this.userAgents[(attempt - 1) % this.userAgents.length];
    const referer = this.buildReferer(url);

    return {
      'User-Agent': userAgent,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'it-IT,it;q=0.95,en-US;q=0.85,en;q=0.75',
      'Accept-Encoding': 'gzip, deflate, br',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'DNT': '1',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-User': '?1',
      'Sec-Fetch-Dest': 'document',
      'Sec-CH-UA-Platform': '"Windows"',
      'Referer': referer,
    };
  }

  private buildReferer(url: string) {
    try {
      const target = new URL(url);
      return `${target.protocol}//${target.hostname}/`;
    } catch {
      return 'https://www.google.com/';
    }
  }

  private getRandomDelay(minMs: number, maxMs: number) {
    return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
