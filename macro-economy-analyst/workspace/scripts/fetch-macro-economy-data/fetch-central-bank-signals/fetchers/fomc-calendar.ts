import axios from 'axios';
import * as cheerio from 'cheerio';
import { Communication } from '../types';
import { extractDateFromUrl, generateId, isWithinDateRange } from '../utils';
import logger from '../../logger';

const FOMC_CALENDAR_URL = 'https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm';

interface StatementLink {
  url: string;
  date: string;
  title: string;
}

async function fetchCalendarPage(): Promise<string> {
  logger.functionCall('fetchCalendarPage');
  logger.apiRequest(FOMC_CALENDAR_URL);
  
  const response = await axios.get(FOMC_CALENDAR_URL, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; FedSignalsBot/1.0)',
    },
  });
  
  logger.apiResponse(FOMC_CALENDAR_URL, '200 OK');
  return response.data;
}

function extractStatementUrls(html: string): StatementLink[] {
  logger.functionCall('extractStatementUrls');
  
  const $ = cheerio.load(html);
  const statements: StatementLink[] = [];
  const seen = new Set<string>();
  
  $('a[href*="monetary"][href$="a.htm"]').each((_, el) => {
    const href = $(el).attr('href') || '';
    
    if (href.includes('/pressreleases/monetary') && !seen.has(href)) {
      seen.add(href);
      
      const fullUrl = href.startsWith('http') ? href : `https://www.federalreserve.gov${href}`;
      const date = extractDateFromUrl(href);
      
      if (date) {
        statements.push({
          url: fullUrl,
          date,
          title: 'FOMC Statement',
        });
      }
    }
  });
  
  statements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  logger.info('STATEMENT_URLS', `Found ${statements.length} statement URLs`);
  return statements;
}

export async function fetchFomcStatementUrls(
  startDate: Date,
  endDate: Date
): Promise<Partial<Communication>[]> {
  logger.functionCall('fetchFomcStatementUrls');
  logger.info('CALENDAR_FETCH', 'Fetching FOMC calendar');
  
  let html: string;
  try {
    html = await fetchCalendarPage();
  } catch (error: any) {
    logger.error('CALENDAR_ERROR', `Error fetching FOMC calendar: ${error.message}`);
    return [];
  }
  
  const allStatements = extractStatementUrls(html);
  
  const filtered = allStatements.filter(s => {
    const statementDate = new Date(s.date);
    return isWithinDateRange(statementDate, startDate, endDate);
  });
  
  logger.info('STATEMENT_FILTERED', `Found ${filtered.length} FOMC statements in date range`);
  
  return filtered.map(s => ({
    id: generateId(s.url),
    type: 'statement' as const,
    date: s.date,
    title: s.title,
    sourceUrl: s.url,
  }));
}
