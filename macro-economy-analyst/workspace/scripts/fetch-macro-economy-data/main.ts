import * as fs from 'fs';
import * as path from 'path';
import { main as fetchEconomicIndicators } from './fetch-economic-indicators';
import { main as fetchFixedIncome } from './fetch-fixed-income';
import { main as fetchSentimentPositioning } from './fetch-sentiment-positioning';
import { main as fetchFlowsLiquidity } from './fetch-flows-liquidity';
import { main as fetchGeopoliticsNews } from './fetch-geopolitics-news';
import { main as fetchMarketPrice } from './fetch-market-price';
import { main as fetchFedSignals } from './fetch-central-bank-signals/main';
import logger from './logger';

const LAST_FETCH_LOG = '/home/node/.openclaw/logs/last-fetch.log';
const SCRIPT_NAME = 'Macro Economy Data Fetcher';

function getLastFetchDate(): string | null {
  logger.functionCall('getLastFetchDate');
  try {
    if (fs.existsSync(LAST_FETCH_LOG)) {
      const date = fs.readFileSync(LAST_FETCH_LOG, 'utf-8').trim();
      logger.info('LAST_FETCH', `Previous fetch date: ${date}`);
      return date;
    }
    logger.info('LAST_FETCH', 'No previous fetch date found');
  } catch (error: any) {
    logger.error('LAST_FETCH_ERROR', `Error reading last fetch log: ${error.message}`);
  }
  return null;
}

function saveLastFetchDate(date: string): void {
  logger.functionCall('saveLastFetchDate', date);
  try {
    const logDir = path.dirname(LAST_FETCH_LOG);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    fs.writeFileSync(LAST_FETCH_LOG, date, 'utf-8');
    logger.info('LAST_FETCH_SAVED', `Saved fetch date: ${date}`);
  } catch (error: any) {
    logger.error('LAST_FETCH_SAVE_ERROR', `Error saving last fetch log: ${error.message}`);
  }
}

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

const FETCHERS = [
  { name: 'Economic Indicators', fn: fetchEconomicIndicators },
  { name: 'Fixed Income', fn: fetchFixedIncome },
  { name: 'Sentiment & Positioning', fn: fetchSentimentPositioning },
  { name: 'Flows & Liquidity', fn: fetchFlowsLiquidity },
  { name: 'Geopolitics News', fn: fetchGeopoliticsNews },
  { name: 'Market Prices', fn: fetchMarketPrice },
  { name: 'Fed Signals', fn: fetchFedSignals },
];

async function runAllFetchers(): Promise<void> {
  logger.start(SCRIPT_NAME);
  logger.functionCall('runAllFetchers');
  
  const today = getTodayDate();
  const lastFetchDate = getLastFetchDate();

  if (lastFetchDate === today) {
    logger.info('SKIP', `Data already fetched today (${today}). Skipping.`);
    logger.end(SCRIPT_NAME, true);
    return;
  }

  logger.info('BATCH_START', `Starting batch fetch for ${today}`);
  logger.info('CONFIG', `Total fetchers: ${FETCHERS.length}`);

  const results: { name: string; status: 'success' | 'failed'; error?: string }[] = [];

  for (const fetcher of FETCHERS) {
    logger.info('FETCHER_START', `Running: ${fetcher.name}`);

    try {
      await fetcher.fn();
      results.push({ name: fetcher.name, status: 'success' });
      logger.info('FETCHER_SUCCESS', `${fetcher.name} completed`);
    } catch (error: any) {
      logger.error('FETCHER_FAILED', `${fetcher.name} failed: ${error.message}`);
      results.push({ name: fetcher.name, status: 'failed', error: error.message });
    }
  }

  const succeeded = results.filter(r => r.status === 'success');
  const failed = results.filter(r => r.status === 'failed');

  logger.info('BATCH_SUMMARY', `Succeeded: ${succeeded.length}/${results.length}, Failed: ${failed.length}/${results.length}`);

  if (failed.length > 0) {
    logger.error('FAILED_FETCHERS', failed.map(f => `${f.name}: ${f.error}`).join('; '));
    saveLastFetchDate(today);
    logger.end(SCRIPT_NAME, false);
    process.exit(1);
  }

  saveLastFetchDate(today);
  logger.end(SCRIPT_NAME, true);
}

runAllFetchers();
