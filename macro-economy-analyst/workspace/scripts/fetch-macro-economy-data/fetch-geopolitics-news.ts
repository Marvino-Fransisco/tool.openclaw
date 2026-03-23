import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import logger from './logger';

const SCRIPT_NAME = 'Geopolitics News Fetcher';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  sourceUrl: string;
  category: string;
  region: string;
  publishedAt: string;
  fetchedAt: string;
}

interface GeopoliticsNewsOutput {
  fetchedAt: string;
  dateRange: {
    start: string;
    end: string;
  };
  totalItems: number;
  news: NewsItem[];
}

const RSS_FEEDS = [
  { url: 'https://feeds.bbci.co.uk/news/world/rss.xml', source: 'BBC World' },
  { url: 'https://www.aljazeera.com/xml/rss/all.xml', source: 'Al Jazeera' },
  { url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml', source: 'NYT World' },
  { url: 'https://feeds.npr.org/1004/rss.xml', source: 'NPR World' },
  { url: 'https://www.theguardian.com/world/rss', source: 'Guardian World' },
];

const GEOPOLITICAL_KEYWORDS = [
  'war', 'conflict', 'military', 'missile', 'strike', 'attack', 'invasion',
  'sanctions', 'tariff', 'trade war', 'trade deal', 'diplomacy', 'treaty', 'summit',
  'coup', 'protest', 'unrest', 'crisis', 'nuclear', 'weapons', 'border',
  'refugee', 'humanitarian', 'terror', 'ceasefire', 'peace talks', 'negotiation',
  'hezbollah', 'hamas', 'israel', 'iran', 'russia', 'china', 'ukraine',
  'nato', 'eu summit', 'united nations', 'g7', 'g20', 'opec',
  'federal reserve', 'central bank', 'interest rate', 'inflation',
  'oil price', 'energy crisis', 'supply chain', 'embargo',
];

const EXCLUDED_KEYWORDS = [
  'messi', 'ronaldo', 'mls', 'premier league', 'nba', 'nfl', 'world cup',
  'banksy', 'artist', 'art world', 'exhibition', 'museum',
  'cyclone', 'hurricane', 'tornado', 'earthquake', 'flood',
  'celebrity', 'actor', 'actress', 'singer', 'movie', 'film',
  'fashion', 'model', 'beauty', 'lifestyle',
  'recipe', 'restaurant', 'food', 'cooking',
  'travel', 'tourism', 'vacation', 'hotel',
  'denmark election', 'local election', 'mayor', 'city council',
  'weather', 'temperature', 'forecast',
];

const REGION_KEYWORDS: Record<string, string[]> = {
  'Middle East': ['israel', 'iran', 'gaza', 'lebanon', 'syria', 'iraq', 'yemen', 'saudi', 'hezbollah', 'hamas', 'palestin'],
  'Europe': ['europe', 'eu', 'ukraine', 'russia', 'germany', 'france', 'uk', 'britain', 'nato'],
  'Asia Pacific': ['china', 'taiwan', 'japan', 'korea', 'india', 'pakistan', 'philippines', 'australia'],
  'Americas': ['us', 'usa', 'america', 'canada', 'mexico', 'brazil', 'venezuela', 'cuba', 'argentina'],
  'Africa': ['africa', 'nigeria', 'egypt', 'sudan', 'ethiopia', 'congo', 'kenya', 'somalia'],
};

function generateId(source: string, title: string, date: string): string {
  const hash = `${source}-${title}-${date}`.toLowerCase().replace(/[^a-z0-9]/g, '-');
  return hash.slice(0, 64);
}

function parseRssDate(dateStr: string): Date {
  const parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) {
    return new Date();
  }
  return parsed;
}

function isWithinLast2Days(date: Date): boolean {
  const now = new Date();
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
  return date >= twoDaysAgo && date <= now;
}

function detectRegion(title: string, summary: string): string {
  const text = `${title} ${summary}`.toLowerCase();
  
  for (const [region, keywords] of Object.entries(REGION_KEYWORDS)) {
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        return region;
      }
    }
  }
  return 'Global';
}

function categorizeNews(title: string, summary: string): string {
  const text = `${title} ${summary}`.toLowerCase();
  
  if (/war|conflict|missile|strike|attack|military|invasion|bomb/i.test(text)) return 'Conflict';
  if (/sanction|tariff|trade|economy|market|oil|energy/i.test(text)) return 'Economy & Trade';
  if (/election|vote|president|minister|coup|government/i.test(text)) return 'Politics';
  if (/diplomacy|summit|treaty|negotiation|peace|talk/i.test(text)) return 'Diplomacy';
  if (/protest|unrest|demonstration|riot/i.test(text)) return 'Civil Unrest';
  if (/nuclear|weapons|missile/i.test(text)) return 'Security';
  if (/climate|disaster|flood|earthquake|hurricane/i.test(text)) return 'Crisis';
  
  return 'General';
}

function isGeopoliticallyRelevant(title: string, summary: string): boolean {
  const text = `${title} ${summary}`.toLowerCase();
  
  if (EXCLUDED_KEYWORDS.some(keyword => text.includes(keyword))) {
    return false;
  }
  
  return GEOPOLITICAL_KEYWORDS.some(keyword => text.includes(keyword));
}

async function fetchRssFeed(feedUrl: string, sourceName: string): Promise<NewsItem[]> {
  logger.functionCall('fetchRssFeed', sourceName);
  
  try {
    logger.apiRequest(feedUrl);
    const response = await axios.get(feedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; GeopoliticsNewsBot/1.0)',
      },
      timeout: 15000,
    });

    const $ = cheerio.load(response.data, { xmlMode: true });
    const items: NewsItem[] = [];
    const fetchedAt = new Date().toISOString();

    $('item').each((_, el) => {
      const $item = $(el);
      const title = $item.find('title').text().trim();
      const link = $item.find('link').text().trim();
      const pubDate = $item.find('pubDate').text().trim();
      const description = $item.find('description').text().trim();
      
      const publishedAt = parseRssDate(pubDate);
      
      if (!isWithinLast2Days(publishedAt)) {
        return;
      }
      
      if (!isGeopoliticallyRelevant(title, description)) {
        return;
      }

      const cleanDescription = description
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 300);

      const newsItem: NewsItem = {
        id: generateId(sourceName, title, publishedAt.toISOString()),
        title,
        summary: cleanDescription,
        source: sourceName,
        sourceUrl: link,
        category: categorizeNews(title, description),
        region: detectRegion(title, description),
        publishedAt: publishedAt.toISOString(),
        fetchedAt,
      };

      items.push(newsItem);
    });

    logger.apiResponse(feedUrl, '200 OK');
    logger.dataFetched(sourceName, items.length);

    return items;
  } catch (error: any) {
    logger.error('RSS_ERROR', `Error fetching ${sourceName}: ${error.message}`);
    return [];
  }
}

async function fetchWebNews(source: { url: string; source: string; selector: string }): Promise<NewsItem[]> {
  logger.functionCall('fetchWebNews', source.source);
  
  try {
    logger.apiRequest(source.url);
    const response = await axios.get(source.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
      timeout: 15000,
    });

    const $ = cheerio.load(response.data);
    const items: NewsItem[] = [];
    const fetchedAt = new Date().toISOString();

    $(source.selector).each((_, el) => {
      const $el = $(el);
      const title = $el.find('a, h2, h3, .title').first().text().trim();
      const link = $el.find('a').attr('href') || '';
      const summary = $el.find('p, .summary, .description').first().text().trim();
      
      if (!title || title.length < 10) return;
      if (!isGeopoliticallyRelevant(title, summary)) return;

      const fullLink = link.startsWith('http') ? link : `${new URL(source.url).origin}${link}`;
      
      const newsItem: NewsItem = {
        id: generateId(source.source, title, fetchedAt),
        title,
        summary: summary.slice(0, 300),
        source: source.source,
        sourceUrl: fullLink,
        category: categorizeNews(title, summary),
        region: detectRegion(title, summary),
        publishedAt: fetchedAt,
        fetchedAt,
      };

      items.push(newsItem);
    });

    logger.apiResponse(source.url, '200 OK');
    logger.dataFetched(source.source, items.length);

    return items;
  } catch (error: any) {
    logger.error('WEB_ERROR', `Error scraping ${source.source}: ${error.message}`);
    return [];
  }
}

function deduplicateNews(items: NewsItem[]): NewsItem[] {
  logger.functionCall('deduplicateNews');
  
  const seen = new Map<string, NewsItem>();
  
  for (const item of items) {
    const key = item.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!seen.has(key) || item.summary.length > (seen.get(key)?.summary.length || 0)) {
      seen.set(key, item);
    }
  }
  
  const deduped = Array.from(seen.values());
  logger.info('DEDUP', `Deduplicated ${items.length} items to ${deduped.length}`);
  
  return deduped;
}

function sortByDate(items: NewsItem[]): NewsItem[] {
  return items.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

async function fetchAllGeopoliticsNews(): Promise<GeopoliticsNewsOutput> {
  logger.functionCall('fetchAllGeopoliticsNews');
  
  const allItems: NewsItem[] = [];
  const now = new Date();
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

  logger.info('DATE_RANGE', `${twoDaysAgo.toISOString().split('T')[0]} to ${now.toISOString().split('T')[0]}`);
  logger.info('RSS_START', `Fetching ${RSS_FEEDS.length} RSS feeds`);

  for (const feed of RSS_FEEDS) {
    logger.info('FEED_START', `Fetching ${feed.source}`);
    const items = await fetchRssFeed(feed.url, feed.source);
    allItems.push(...items);
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  logger.info('PROCESS_START', 'Processing results');
  const deduped = deduplicateNews(allItems);
  const sorted = sortByDate(deduped);

  logger.info('PROCESS_SUMMARY', `Total raw items: ${allItems.length}, After deduplication: ${deduped.length}`);

  return {
    fetchedAt: now.toISOString(),
    dateRange: {
      start: twoDaysAgo.toISOString(),
      end: now.toISOString(),
    },
    totalItems: sorted.length,
    news: sorted,
  };
}

function saveOutput(data: GeopoliticsNewsOutput): string {
  logger.functionCall('saveOutput');
  
  const filepath = '/home/node/.openclaw/shared/data/raw/geopolitics-news.json';
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
  logger.dataSaved(filepath);
  return filepath;
}

function printSummary(data: GeopoliticsNewsOutput): void {
  logger.functionCall('printSummary');
  
  const byRegion: Record<string, number> = {};
  const byCategory: Record<string, number> = {};
  const bySource: Record<string, number> = {};

  for (const item of data.news) {
    byRegion[item.region] = (byRegion[item.region] || 0) + 1;
    byCategory[item.category] = (byCategory[item.category] || 0) + 1;
    bySource[item.source] = (bySource[item.source] || 0) + 1;
  }

  logger.info('SUMMARY_REGION', Object.entries(byRegion).sort((a, b) => b[1] - a[1]).map(([r, c]) => `${r}: ${c}`).join(', '));
  logger.info('SUMMARY_CATEGORY', Object.entries(byCategory).sort((a, b) => b[1] - a[1]).map(([c, n]) => `${c}: ${n}`).join(', '));
  logger.info('SUMMARY_SOURCE', Object.entries(bySource).sort((a, b) => b[1] - a[1]).map(([s, n]) => `${s}: ${n}`).join(', '));

  logger.info('TOP_HEADLINES', data.news.slice(0, 10).map((item, i) => `${i + 1}. [${item.source}] ${item.title}`).join(' | '));
}

export async function main(): Promise<void> {
  logger.start(SCRIPT_NAME);
  
  try {
    const data = await fetchAllGeopoliticsNews();
    const outputPath = saveOutput(data);
    
    logger.info('COMPLETE', `Total items: ${data.totalItems}`);
    printSummary(data);
    logger.end(SCRIPT_NAME, true);
  } catch (error: any) {
    logger.error('FATAL_ERROR', error.message);
    logger.end(SCRIPT_NAME, false);
    process.exit(1);
  }
}
