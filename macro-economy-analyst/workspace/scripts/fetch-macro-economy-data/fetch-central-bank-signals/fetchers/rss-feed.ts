import axios from 'axios';
import * as cheerio from 'cheerio';
import { Communication } from '../types';
import { getSpeakerBySlug, extractSpeakerSlugFromUrl, extractSpeakerSlugFromTitle } from '../config/speakers';
import { parseRssDate, extractDateFromUrl, generateId, isWithinDateRange } from '../utils';
import logger from '../../logger';

const RSS_FEEDS = {
  speeches: 'https://www.federalreserve.gov/feeds/speeches.xml',
  testimony: 'https://www.federalreserve.gov/feeds/speeches_and_testimony.xml',
};

interface RssItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  category: string;
}

async function fetchRssFeed(url: string): Promise<RssItem[]> {
  logger.functionCall('fetchRssFeed');
  logger.apiRequest(url);
  
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; FedSignalsBot/1.0)',
      },
    });
    
    const $ = cheerio.load(response.data, { xmlMode: true });
    const items: RssItem[] = [];
    
    $('item').each((_, el) => {
      const $item = $(el);
      items.push({
        title: $item.find('title').text(),
        link: $item.find('link').text(),
        pubDate: $item.find('pubDate').text(),
        description: $item.find('description').text(),
        category: $item.find('category').text(),
      });
    });
    
    logger.apiResponse(url, '200 OK');
    logger.info('RSS_ITEMS', `Found ${items.length} items in feed`);
    
    return items;
  } catch (error: any) {
    logger.error('RSS_ERROR', `Error fetching RSS feed ${url}: ${error.message}`);
    return [];
  }
}

function parseRssItem(item: RssItem, type: 'speech' | 'testimony'): Partial<Communication> {
  const speakerSlug = extractSpeakerSlugFromUrl(item.link) || 
                      extractSpeakerSlugFromTitle(item.title);
  const speaker = speakerSlug ? getSpeakerBySlug(speakerSlug) : undefined;
  
  const venueMatch = item.description.match(/(?:At|Speech)\s+(?:the\s+)?(.+?)(?:,|\.|$)/i);
  const venue = venueMatch ? venueMatch[1].trim() : item.description;
  
  return {
    id: generateId(item.link),
    type,
    date: extractDateFromUrl(item.link) || parseRssDate(item.pubDate).toISOString().split('T')[0],
    speaker: speaker ? {
      slug: speaker.slug,
      name: speaker.name,
      role: speaker.role,
      tier: speaker.tier,
      weight: speaker.weight,
      institution: speaker.institution,
    } : undefined,
    title: item.title,
    venue: venue !== item.description ? venue : undefined,
    sourceUrl: item.link,
  };
}

export async function fetchSpeeches(
  startDate: Date,
  endDate: Date,
  onProgress?: (fetched: number, total: number) => void
): Promise<Partial<Communication>[]> {
  logger.functionCall('fetchSpeeches');
  logger.info('RSS_FETCH', 'Fetching speeches from RSS feed');
  
  const items = await fetchRssFeed(RSS_FEEDS.speeches);
  
  const filtered: Partial<Communication>[] = [];
  
  for (const item of items) {
    const itemDate = parseRssDate(item.pubDate);
    if (isWithinDateRange(itemDate, startDate, endDate)) {
      filtered.push(parseRssItem(item, 'speech'));
    }
  }
  
  logger.info('SPEECHES_FILTERED', `Found ${filtered.length} speeches in date range`);
  onProgress?.(filtered.length, filtered.length);
  
  return filtered;
}

export async function fetchTestimony(
  startDate: Date,
  endDate: Date,
  onProgress?: (fetched: number, total: number) => void
): Promise<Partial<Communication>[]> {
  logger.functionCall('fetchTestimony');
  logger.info('RSS_FETCH', 'Fetching testimony from RSS feed');
  
  const items = await fetchRssFeed(RSS_FEEDS.testimony);
  
  const filtered: Partial<Communication>[] = [];
  
  for (const item of items) {
    if (!item.link.includes('/testimony/') && !item.title.toLowerCase().includes('testimony')) {
      continue;
    }
    
    const itemDate = parseRssDate(item.pubDate);
    if (isWithinDateRange(itemDate, startDate, endDate)) {
      filtered.push(parseRssItem(item, 'testimony'));
    }
  }
  
  logger.info('TESTIMONY_FILTERED', `Found ${filtered.length} testimony items in date range`);
  onProgress?.(filtered.length, filtered.length);
  
  return filtered;
}
