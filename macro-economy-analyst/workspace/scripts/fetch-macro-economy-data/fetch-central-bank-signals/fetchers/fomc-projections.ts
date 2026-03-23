import axios from 'axios';
import * as cheerio from 'cheerio';
import { FomcProjection, ProjectionVariable } from '../types';
import { extractDateFromUrl, generateId, isWithinDateRange, sleep } from '../utils';
import logger from '../../logger';

const FOMC_CALENDAR_URL = 'https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm';
const REQUEST_DELAY_MS = 200;

interface ProjectionLink {
  url: string;
  date: string;
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

function extractProjectionUrls(html: string): ProjectionLink[] {
  logger.functionCall('extractProjectionUrls');
  
  const $ = cheerio.load(html);
  const projections: ProjectionLink[] = [];
  const seen = new Set<string>();
  
  $('a[href*="fomcprojtabl"]').each((_, el) => {
    const href = $(el).attr('href') || '';
    
    if (!seen.has(href)) {
      seen.add(href);
      
      const fullUrl = href.startsWith('http') ? href : `https://www.federalreserve.gov${href}`;
      const date = extractDateFromUrl(href);
      
      if (date) {
        projections.push({
          url: fullUrl,
          date,
        });
      }
    }
  });
  
  projections.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  logger.info('PROJECTION_URLS', `Found ${projections.length} projection URLs`);
  return projections;
}

async function fetchProjectionPage(url: string): Promise<string> {
  logger.functionCall('fetchProjectionPage');
  logger.apiRequest(url);
  
  const response = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; FedSignalsBot/1.0)',
    },
  });
  
  logger.apiResponse(url, '200 OK');
  return response.data;
}

function parseValue(value: string): number | null {
  const cleaned = value.trim();
  if (cleaned === '-' || cleaned === '' || cleaned === '–') {
    return null;
  }
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

function parseRangeValue(value: string): string {
  const cleaned = value.trim();
  if (cleaned === '-' || cleaned === '' || cleaned === '–') {
    return '';
  }
  return cleaned;
}

function extractYearsFromHeader($: cheerio.CheerioAPI, table: cheerio.Element): string[] {
  const years: string[] = [];
  const $table = $(table);
  
  $table.find('thead th.colhead').each((_, th) => {
    const text = $(th).text().trim();
    if (/^\d{4}$/.test(text)) {
      years.push(text);
    } else if (text.toLowerCase().includes('longer')) {
      years.push('longerRun');
    }
  });
  
  return years;
}

function parseTable1(html: string): {
  gdp: ProjectionVariable;
  unemployment: ProjectionVariable;
  pceInflation: ProjectionVariable;
  corePceInflation: ProjectionVariable;
  federalFundsRate: ProjectionVariable;
} | null {
  const $ = cheerio.load(html);
  
  const mainTable = $('table.pubtables').first();
  if (!mainTable.length) return null;
  
  const years = extractYearsFromHeader($, mainTable[0]);
  if (years.length === 0) return null;
  
  const emptyVariable = (): ProjectionVariable => ({
    median: {},
    centralTendency: {},
    range: {},
  });
  
  const result = {
    gdp: emptyVariable(),
    unemployment: emptyVariable(),
    pceInflation: emptyVariable(),
    corePceInflation: emptyVariable(),
    federalFundsRate: emptyVariable(),
  };
  
  let currentVariable: keyof typeof result | null = null;
  let isPreviousRow = false;
  
  mainTable.find('tbody tr').each((_, tr) => {
    const $tr = $(tr);
    const $th = $tr.find('th.stub');
    const headerText = $th.text().trim().toLowerCase();
    
    if (headerText.includes('gdp')) {
      currentVariable = 'gdp';
      isPreviousRow = headerText.includes('december');
    } else if (headerText.includes('unemployment')) {
      currentVariable = 'unemployment';
      isPreviousRow = headerText.includes('december');
    } else if (headerText.includes('pce') && !headerText.includes('core')) {
      currentVariable = 'pceInflation';
      isPreviousRow = headerText.includes('december');
    } else if (headerText.includes('core pce')) {
      currentVariable = 'corePceInflation';
      isPreviousRow = headerText.includes('december');
    } else if (headerText.includes('federal funds')) {
      currentVariable = 'federalFundsRate';
      isPreviousRow = headerText.includes('december');
    }
    
    if (!currentVariable) return;
    
    const $cells = $tr.find('td.data');
    const columnIndexMap: Record<string, number> = {};
    
    years.forEach((year, idx) => {
      columnIndexMap[year] = idx;
    });
    
    if (!isPreviousRow) {
      years.forEach((year, idx) => {
        const cell = $cells.eq(idx);
        const text = cell.text().trim();
        
        if (idx < 4) {
          result[currentVariable!].median[year] = parseValue(text);
        } else if (idx < 8) {
          const yearKey = years[idx - 4];
          result[currentVariable!].centralTendency[yearKey] = parseRangeValue(text);
        } else {
          const yearKey = years[idx - 8];
          result[currentVariable!].range[yearKey] = parseRangeValue(text);
        }
      });
    } else {
      if (!result[currentVariable].previousMedian) {
        result[currentVariable].previousMedian = {};
        result[currentVariable].previousCentralTendency = {};
        result[currentVariable].previousRange = {};
      }
      
      years.forEach((year, idx) => {
        const cell = $cells.eq(idx);
        const text = cell.text().trim();
        
        if (idx < 4) {
          result[currentVariable!].previousMedian![year] = parseValue(text);
        } else if (idx < 8) {
          const yearKey = years[idx - 4];
          result[currentVariable!].previousCentralTendency![yearKey] = parseRangeValue(text);
        } else {
          const yearKey = years[idx - 8];
          result[currentVariable!].previousRange![yearKey] = parseRangeValue(text);
        }
      });
    }
  });
  
  return result;
}

export async function fetchProjectionUrls(
  startDate: Date,
  endDate: Date
): Promise<ProjectionLink[]> {
  logger.functionCall('fetchProjectionUrls');
  logger.info('CALENDAR_FETCH', 'Fetching FOMC calendar for projection materials');
  
  let html: string;
  try {
    html = await fetchCalendarPage();
  } catch (error: any) {
    logger.error('CALENDAR_ERROR', `Error fetching FOMC calendar: ${error.message}`);
    return [];
  }
  
  const allProjections = extractProjectionUrls(html);
  
  const filtered = allProjections.filter(p => {
    const projDate = new Date(p.date);
    return isWithinDateRange(projDate, startDate, endDate);
  });
  
  logger.info('PROJECTION_FILTERED', `Found ${filtered.length} FOMC projections in date range`);
  
  return filtered;
}

export async function fetchProjectionData(
  link: ProjectionLink
): Promise<FomcProjection | null> {
  logger.functionCall('fetchProjectionData', link.date);
  
  try {
    await sleep(REQUEST_DELAY_MS);
    
    const html = await fetchProjectionPage(link.url);
    const data = parseTable1(html);
    
    if (!data) {
      logger.warn('PROJECTION_PARSE', `Could not parse projection table for ${link.date}`);
      return null;
    }
    
    logger.info('PROJECTION_PARSED', `Successfully parsed projection for ${link.date}`);
    
    return {
      id: `proj${link.date.replace(/-/g, '')}`,
      date: link.date,
      sourceUrl: link.url,
      ...data,
    };
  } catch (error: any) {
    logger.error('PROJECTION_ERROR', `Error fetching projection ${link.date}: ${error.message}`);
    return null;
  }
}

export async function fetchAllProjections(
  startDate: Date,
  endDate: Date,
  onProgress?: (completed: number, total: number) => void
): Promise<FomcProjection[]> {
  logger.functionCall('fetchAllProjections');
  
  const links = await fetchProjectionUrls(startDate, endDate);
  
  if (links.length === 0) {
    return [];
  }
  
  logger.info('PROJECTION_BATCH', `Fetching ${links.length} projection data pages`);
  
  const results: FomcProjection[] = [];
  let completed = 0;
  
  for (const link of links) {
    const projection = await fetchProjectionData(link);
    if (projection) {
      results.push(projection);
    }
    
    completed++;
    onProgress?.(completed, links.length);
    
    if (completed % 3 === 0) {
      logger.info('PROJECTION_PROGRESS', `Fetched ${completed}/${links.length} projections`);
    }
  }
  
  return results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
