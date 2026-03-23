import axios from 'axios';
import * as cheerio from 'cheerio';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import { execSync } from 'child_process';
import logger from './logger';

dotenv.config();

const SCRIPT_NAME = 'Sentiment & Positioning Fetcher';
const FRED_API_BASE = 'https://api.stlouisfed.org/fred/series/observations';
const FRED_API_KEY = process.env.FRED_API_KEY;
const DAYS_LOOKBACK = 400;

function getDate90DaysAgo(): string {
  const date = new Date();
  date.setDate(date.getDate() - DAYS_LOOKBACK);
  return date.toISOString().split('T')[0];
}

interface Observation {
  date: string;
  value: string | number;
}

interface SeriesData {
  series_id: string;
  series_name: string;
  source: string;
  description: string;
  observations: Observation[];
}

interface FearGreedData {
  value: number;
  classification: string;
  previousClose: number;
  weekAgo: number;
  monthAgo: number;
  timestamp: string;
}

interface AAIIResponse {
  bullish: number;
  bearish: number;
  neutral: number;
  date: string;
  historical: Array<{ date: string; bullish: number; neutral: number; bearish: number }>;
}

interface COTData {
  reportDate: string;
  asset: string;
  openInterest: number;
  commercialLong: number;
  commercialShort: number;
  nonCommercialLong: number;
  nonCommercialShort: number;
  netCommercial: number;
  netNonCommercial: number;
}

interface SentimentOutput {
  fetchedAt: string;
  volatilityIndicators: {
    vix: SeriesData | null;
  };
  sentimentIndicators: {
    fearGreedIndex: FearGreedData | null;
    aaiiSentiment: AAIIResponse | null;
  };
  positioningData: {
    cotReports: Record<string, COTData[]>;
  };
  notes: {
    moveIndex: string;
    putCallRatio: string;
  };
}

async function fetchFredSeries(seriesId: string, seriesName: string, description: string): Promise<SeriesData | null> {
  logger.functionCall('fetchFredSeries', seriesId);
  
  if (!FRED_API_KEY) {
    logger.warn('API_KEY_MISSING', `${seriesId}: FRED_API_KEY not configured`);
    return null;
  }

  const params = {
    series_id: seriesId,
    api_key: FRED_API_KEY,
    file_type: 'json',
    observation_start: getDate90DaysAgo(),
    sort_order: 'desc',
    limit: 1000,
  };

  try {
    logger.apiRequest(`${FRED_API_BASE}?series_id=${seriesId}`);
    const response = await axios.get(FRED_API_BASE, { params });
    const observations: Observation[] = response.data.observations
      .filter((obs: any) => obs.value !== '.')
      .map((obs: any) => ({
        date: obs.date,
        value: parseFloat(obs.value),
      }));

    logger.apiResponse(`${FRED_API_BASE}?series_id=${seriesId}`, '200 OK');
    logger.dataFetched(seriesId, observations.length);

    return {
      series_id: seriesId,
      series_name: seriesName,
      source: 'FRED',
      description,
      observations,
    };
  } catch (error: any) {
    logger.error('FRED_ERROR', `${seriesId}: ${error.response?.status || error.message}`);
    return null;
  }
}

async function fetchFearGreedIndex(): Promise<FearGreedData | null> {
  logger.functionCall('fetchFearGreedIndex');
  
  try {
    const url = 'https://api.alternative.me/fng/?limit=90';
    logger.apiRequest(url);
    const response = await axios.get(url);
    const data = response.data.data;
    
    if (!data || data.length === 0) {
      logger.warn('NO_DATA', 'Fear & Greed Index: No data returned');
      return null;
    }

    const latest = data[0];
    const value = parseInt(latest.value);

    let classification = 'Neutral';
    if (value <= 25) classification = 'Extreme Fear';
    else if (value <= 45) classification = 'Fear';
    else if (value <= 55) classification = 'Neutral';
    else if (value <= 75) classification = 'Greed';
    else classification = 'Extreme Greed';

    logger.apiResponse(url, '200 OK');
    logger.info('FEAR_GREED', `Value: ${value} (${classification})`);

    return {
      value,
      classification,
      previousClose: data[1] ? parseInt(data[1].value) : value,
      weekAgo: data[7] ? parseInt(data[7].value) : value,
      monthAgo: data[30] ? parseInt(data[30].value) : value,
      timestamp: new Date(parseInt(latest.timestamp) * 1000).toISOString(),
    };
  } catch (error: any) {
    logger.error('FEAR_GREED_ERROR', error.message);
    return null;
  }
}

async function fetchAAIISentiment(): Promise<AAIIResponse | null> {
  logger.functionCall('fetchAAIISentiment');
  
  try {
    const url = 'https://www.aaii.com/sentimentsurvey/sent_results';
    logger.apiRequest(url);
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html',
      },
    });

    const $ = cheerio.load(response.data);
    const historical: Array<{ date: string; bullish: number; neutral: number; bearish: number }> = [];

    $('table.bordered tr').each((index, element) => {
      const cells = $(element).find('td.tableTxt');
      if (cells.length >= 4) {
        const dateText = $(cells[0]).text().trim();
        const bullishText = $(cells[1]).text().trim();
        const neutralText = $(cells[2]).text().trim();
        const bearishText = $(cells[3]).text().trim();

        const bullish = parseFloat(bullishText.replace('%', '')) || 0;
        const neutral = parseFloat(neutralText.replace('%', '')) || 0;
        const bearish = parseFloat(bearishText.replace('%', '')) || 0;

        if (bullish > 0 || bearish > 0 || neutral > 0) {
          const currentYear = new Date().getFullYear();
          const fullDate = `${dateText} ${currentYear}`;
          historical.push({
            date: fullDate,
            bullish,
            neutral,
            bearish,
          });
        }
      }
    });

    if (historical.length === 0) {
      logger.warn('AAII_NO_DATA', 'No data parsed from page');
      return null;
    }

    logger.apiResponse(url, '200 OK');
    logger.info('AAII', `Bullish: ${historical[0].bullish}%, Bearish: ${historical[0].bearish}%`);

    const latest = historical[0];
    return {
      bullish: latest.bullish,
      bearish: latest.bearish,
      neutral: latest.neutral,
      date: latest.date,
      historical,
    };
  } catch (error: any) {
    logger.error('AAII_ERROR', error.message);
    return null;
  }
}

const CFTC_ASSET_CODES: Record<string, { code: string; name: string }> = {
  'Crude Oil': { code: '067651', name: 'Crude Oil Futures' },
  'Natural Gas': { code: '067652', name: 'Natural Gas Futures' },
  'Gold': { code: '088691', name: 'Gold Futures' },
  'Silver': { code: '084691', name: 'Silver Futures' },
  'Copper': { code: '085692', name: 'Copper Futures' },
  'S&P 500': { code: '13874A', name: 'S&P 500 Futures' },
  '10Y Treasury': { code: '043602', name: '10-Year Treasury Note Futures' },
  'EUR/USD': { code: '099741', name: 'Euro FX Futures' },
  'NASDAQ 100': { code: '20974A', name: 'NASDAQ 100 Futures' },
};

async function fetchCFTCCOTData(): Promise<Record<string, COTData[]>> {
  logger.functionCall('fetchCFTCCOTData');
  
  const cotReports: Record<string, COTData[]> = {};
  const currentYear = new Date().getFullYear();
  const tempDir = '/tmp/cftc_cot';
  
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const zipUrl = `https://www.cftc.gov/files/dea/history/deacot${currentYear}.zip`;
  const zipPath = path.join(tempDir, `deacot${currentYear}.zip`);

  logger.info('CFTC_DOWNLOAD', `Downloading from ${zipUrl}`);

  try {
    const response = await axios({
      method: 'GET',
      url: zipUrl,
      responseType: 'arraybuffer',
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      timeout: 30000,
    });

    fs.writeFileSync(zipPath, response.data);
    logger.info('CFTC_DOWNLOADED', `ZIP file (${(response.data.length / 1024).toFixed(1)} KB)`);

    try {
      execSync(`unzip -o "${zipPath}" -d "${tempDir}" 2>/dev/null`, { stdio: 'pipe' });
    } catch {
      logger.warn('UNZIP_WARN', 'unzip command issue, trying to find extracted files');
    }

    const files = fs.readdirSync(tempDir);
    const txtFile = files.find(f => f.toLowerCase().endsWith('.txt') && !f.toLowerCase().endsWith('.zip'));
    
    if (!txtFile) {
      logger.error('CFTC_NO_FILE', `No text file found in ZIP. Files: ${files.join(', ')}`);
      return cotReports;
    }
    logger.info('CFTC_FILE_FOUND', txtFile);

    const actualTxtPath = path.join(tempDir, txtFile);
    const content = fs.readFileSync(actualTxtPath, 'utf-8');
    const lines = content.split('\n');

    const assetDataMap: Record<string, COTData[]> = {};

    for (const line of lines) {
      if (!line.trim() || line.includes('Report_Date')) continue;

      const parts = line.split(',').map(p => p.trim().replace(/"/g, ''));
      if (parts.length < 30) continue;

      const marketCode = parts[1] || '';
      const reportDate = parts[2] || '';
      const openInterest = parseInt(parts[3]) || 0;
      const commercialLong = parseInt(parts[5]) || 0;
      const commercialShort = parseInt(parts[6]) || 0;
      const nonCommercialLong = parseInt(parts[9]) || 0;
      const nonCommercialShort = parseInt(parts[10]) || 0;

      let matchedAsset: string | null = null;
      for (const [assetName, info] of Object.entries(CFTC_ASSET_CODES)) {
        if (marketCode.includes(info.code) || marketCode === info.code) {
          matchedAsset = assetName;
          break;
        }
      }

      if (matchedAsset && openInterest > 0) {
        if (!assetDataMap[matchedAsset]) {
          assetDataMap[matchedAsset] = [];
        }

        assetDataMap[matchedAsset].push({
          reportDate,
          asset: CFTC_ASSET_CODES[matchedAsset].name,
          openInterest,
          commercialLong,
          commercialShort,
          nonCommercialLong,
          nonCommercialShort,
          netCommercial: commercialLong - commercialShort,
          netNonCommercial: nonCommercialLong - nonCommercialShort,
        });
      }
    }

    for (const [assetName, data] of Object.entries(assetDataMap)) {
      const sortedData = data.sort((a, b) => new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime());
      cotReports[assetName] = sortedData;
      logger.info('CFTC_ASSET', `${assetName}: ${sortedData.length} reports`);
    }

    fs.rmSync(tempDir, { recursive: true, force: true });

  } catch (error: any) {
    logger.error('CFTC_ERROR', error.message);
    
    if (error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
      logger.warn('CFTC_NETWORK', 'CFTC site may be unavailable');
    }
  }

  return cotReports;
}

async function fetchAllSentimentData(): Promise<SentimentOutput> {
  logger.functionCall('fetchAllSentimentData');
  
  logger.info('PHASE_START', '1. Fetching Volatility Indicators (VIX from FRED)');
  const vix = await fetchFredSeries('VIXCLS', 'CBOE Volatility Index (VIX)', 'Market expectation of near term volatility');

  logger.info('PHASE_START', '2. Fetching Sentiment Indicators');
  const [fearGreed, aaii] = await Promise.all([
    fetchFearGreedIndex(),
    fetchAAIISentiment(),
  ]);

  logger.info('PHASE_START', '3. Fetching CFTC COT Positioning Data');
  const cotReports = await fetchCFTCCOTData();

  logger.info('NOTES', 'MOVE Index and Put/Call Ratio require paid subscriptions');

  return {
    fetchedAt: new Date().toISOString(),
    volatilityIndicators: {
      vix,
    },
    sentimentIndicators: {
      fearGreedIndex: fearGreed,
      aaiiSentiment: aaii,
    },
    positioningData: {
      cotReports,
    },
    notes: {
      moveIndex: 'MOVE Index is proprietary ICE/BofA data requiring paid subscription. Not available in FRED or free APIs.',
      putCallRatio: 'CBOE Put/Call ratio data is no longer freely available via FRED. Consider CBOE direct data subscription.',
    },
  };
}

function saveOutput(data: SentimentOutput): string {
  logger.functionCall('saveOutput');
  
  const outputDir = path.join(process.cwd(), '../shared/data/raw');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const filename = 'sentiment-positioning.json';
  const filepath = path.join(outputDir, filename);

  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
  logger.dataSaved(filepath);
  
  return filepath;
}

export async function main(): Promise<void> {
  logger.start(SCRIPT_NAME);
  
  try {
    const data = await fetchAllSentimentData();
    const outputPath = saveOutput(data);
    
    logger.info('COMPLETE', `VIX: ${data.volatilityIndicators.vix ? 'Yes' : 'No'}, Fear & Greed: ${data.sentimentIndicators.fearGreedIndex ? 'Yes' : 'No'}, AAII: ${data.sentimentIndicators.aaiiSentiment ? 'Yes' : 'No'}, COT: ${Object.keys(data.positioningData.cotReports).length} assets`);
    logger.end(SCRIPT_NAME, true);
  } catch (error: any) {
    logger.error('FATAL_ERROR', error.message);
    logger.end(SCRIPT_NAME, false);
    process.exit(1);
  }
}
