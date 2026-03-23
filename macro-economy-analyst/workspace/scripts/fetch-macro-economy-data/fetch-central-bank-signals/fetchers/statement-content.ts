import axios from 'axios';
import * as cheerio from 'cheerio';
import { sleep } from '../utils';
import logger from '../../logger';

const REQUEST_DELAY_MS = 200;

async function fetchPage(url: string): Promise<string> {
  logger.functionCall('fetchPage');
  logger.apiRequest(url);
  
  const response = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; FedSignalsBot/1.0)',
    },
  });
  
  logger.apiResponse(url, '200 OK');
  return response.data;
}

function extractStatementContent(html: string): string {
  logger.functionCall('extractStatementContent');
  
  const $ = cheerio.load(html);
  
  const contentSelectors = [
    '.col-md-8.col-xs-12',
    '#article',
    '.pressRelease',
    'article',
  ];
  
  for (const selector of contentSelectors) {
    const $content = $(selector);
    if ($content.length > 0) {
      $content.find('script, style, nav, header, footer').remove();
      
      const paragraphs: string[] = [];
      $content.find('p').each((_, el) => {
        const text = $(el).text().trim();
        if (text && text.length > 10 && !text.includes('For immediate release')) {
          paragraphs.push(text);
        }
      });
      
      if (paragraphs.length > 0) {
        return paragraphs.join('\n\n');
      }
    }
  }
  
  const bodyText = $('body').text();
  const cleaned = bodyText
    .replace(/\s+/g, ' ')
    .trim();
  
  return cleaned.substring(0, 10000);
}

export async function fetchStatementContent(
  url: string,
  retries: number = 3
): Promise<string> {
  logger.functionCall('fetchStatementContent', url);
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const html = await fetchPage(url);
      const content = extractStatementContent(html);
      
      if (attempt > 1) {
        await sleep(REQUEST_DELAY_MS * 2);
      } else {
        await sleep(REQUEST_DELAY_MS);
      }
      
      logger.info('STATEMENT_FETCHED', `Successfully fetched statement content (${content.length} chars)`);
      return content;
    } catch (error: any) {
      if (attempt === retries) {
        logger.error('STATEMENT_ERROR', `Failed to fetch statement ${url} after ${retries} attempts: ${error.message}`);
        return '';
      }
      
      logger.warn('STATEMENT_RETRY', `Attempt ${attempt}/${retries} failed for statement, retrying...`);
      await sleep(REQUEST_DELAY_MS * attempt * 2);
    }
  }
  
  return '';
}

export async function fetchAllStatementContent(
  items: Array<{ sourceUrl: string; id: string }>,
  onProgress?: (completed: number, total: number) => void
): Promise<Map<string, string>> {
  logger.functionCall('fetchAllStatementContent');
  logger.info('STATEMENT_BATCH', `Fetching ${items.length} statement contents`);
  
  const results = new Map<string, string>();
  let completed = 0;
  
  for (const item of items) {
    const content = await fetchStatementContent(item.sourceUrl);
    results.set(item.id, content);
    
    completed++;
    onProgress?.(completed, items.length);
    
    if (completed % 5 === 0) {
      logger.info('STATEMENT_PROGRESS', `Fetched ${completed}/${items.length} statements`);
    }
  }
  
  return results;
}
