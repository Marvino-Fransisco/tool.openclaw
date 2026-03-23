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

function extractSpeechContent(html: string): string {
  logger.functionCall('extractSpeechContent');
  
  const $ = cheerio.load(html);
  
  const contentSelectors = [
    '.col-md-8.col-xs-12',
    '#article',
    '.content',
    'article',
    '#content',
  ];
  
  for (const selector of contentSelectors) {
    const $content = $(selector);
    if ($content.length > 0) {
      $content.find('script, style, nav, header, footer, .nav, .menu').remove();
      
      const paragraphs: string[] = [];
      $content.find('p').each((_, el) => {
        const text = $(el).text().trim();
        if (text && text.length > 20) {
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
    .replace(/\n\s*\n/g, '\n\n')
    .trim();
  
  return cleaned.substring(0, 50000);
}

export async function fetchSpeechContent(
  url: string,
  retries: number = 3
): Promise<string> {
  logger.functionCall('fetchSpeechContent', url);
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const html = await fetchPage(url);
      const content = extractSpeechContent(html);
      
      if (attempt > 1) {
        await sleep(REQUEST_DELAY_MS * 2);
      } else {
        await sleep(REQUEST_DELAY_MS);
      }
      
      logger.info('SPEECH_FETCHED', `Successfully fetched speech content (${content.length} chars)`);
      return content;
    } catch (error: any) {
      if (attempt === retries) {
        logger.error('SPEECH_ERROR', `Failed to fetch ${url} after ${retries} attempts: ${error.message}`);
        return '';
      }
      
      logger.warn('SPEECH_RETRY', `Attempt ${attempt}/${retries} failed for ${url}, retrying...`);
      await sleep(REQUEST_DELAY_MS * attempt * 2);
    }
  }
  
  return '';
}

export async function fetchAllSpeechContent(
  items: Array<{ sourceUrl: string; id: string }>,
  onProgress?: (completed: number, total: number) => void
): Promise<Map<string, string>> {
  logger.functionCall('fetchAllSpeechContent');
  logger.info('SPEECH_BATCH', `Fetching ${items.length} speech contents`);
  
  const results = new Map<string, string>();
  let completed = 0;
  
  for (const item of items) {
    const content = await fetchSpeechContent(item.sourceUrl);
    results.set(item.id, content);
    
    completed++;
    onProgress?.(completed, items.length);
    
    if (completed % 5 === 0) {
      logger.info('SPEECH_PROGRESS', `Fetched ${completed}/${items.length} speech contents`);
    }
  }
  
  return results;
}
