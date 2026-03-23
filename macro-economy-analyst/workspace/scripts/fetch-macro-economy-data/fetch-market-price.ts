import axios from 'axios';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import logger from './logger';

dotenv.config();

const SCRIPT_NAME = 'Market Price Fetcher';
const YAHOO_FINANCE_BASE = 'https://query1.finance.yahoo.com/v8/finance/chart';

interface MarketConfig {
  symbol: string;
  name: string;
  category: 'EquityIndices' | 'FXRates' | 'Commodities' | 'Crypto';
}

interface PricePoint {
  date: string;
  open: number | null;
  high: number | null;
  low: number | null;
  close: number | null;
  volume: number | null;
}

interface AssetData {
  symbol: string;
  name: string;
  category: string;
  currency: string;
  exchangeTimezoneName: string;
  prices: PricePoint[];
}

interface CombinedOutput {
  fetchedAt: string;
  totalAssets: number;
  marketPrices: Record<string, AssetData>;
}

const MARKET_ASSETS: MarketConfig[] = [
  { symbol: '^GSPC', name: 'S&P 500', category: 'EquityIndices' },
  { symbol: '^DJI', name: 'Dow Jones Industrial Average', category: 'EquityIndices' },
  { symbol: '^IXIC', name: 'NASDAQ Composite', category: 'EquityIndices' },
  { symbol: '^RUT', name: 'Russell 2000', category: 'EquityIndices' },
  { symbol: '^VIX', name: 'CBOE Volatility Index', category: 'EquityIndices' },

  { symbol: 'EURUSD=X', name: 'EUR/USD', category: 'FXRates' },
  { symbol: 'JPYUSD=X', name: 'JPY/USD', category: 'FXRates' },
  { symbol: 'GBPUSD=X', name: 'GBP/USD', category: 'FXRates' },
  { symbol: 'CNYUSD=X', name: 'CNY/USD', category: 'FXRates' },
  { symbol: 'DX-Y.NYB', name: 'US Dollar Index', category: 'FXRates' },

  { symbol: 'GC=F', name: 'Gold Futures', category: 'Commodities' },
  { symbol: 'SI=F', name: 'Silver Futures', category: 'Commodities' },
  { symbol: 'CL=F', name: 'Crude Oil WTI Futures', category: 'Commodities' },
  { symbol: 'BZ=F', name: 'Brent Crude Oil Futures', category: 'Commodities' },
  { symbol: 'NG=F', name: 'Natural Gas Futures', category: 'Commodities' },
  { symbol: 'HG=F', name: 'Copper Futures', category: 'Commodities' },

  { symbol: 'BTC-USD', name: 'Bitcoin USD', category: 'Crypto' },
  { symbol: 'ETH-USD', name: 'Ethereum USD', category: 'Crypto' },
];

function getUnixTimestamp(daysAgo: number): number {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return Math.floor(date.getTime() / 1000);
}

async function fetchAssetPrices(config: MarketConfig): Promise<AssetData | null> {
  logger.functionCall('fetchAssetPrices', config.symbol);
  
  const period1 = getUnixTimestamp(1825);
  const period2 = Math.floor(Date.now() / 1000);
  const interval = '1d';

  const url = `${YAHOO_FINANCE_BASE}/${config.symbol}`;
  const params = {
    period1,
    period2,
    interval,
    includePrePost: false,
  };

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  };

  try {
    logger.apiRequest(`${url}?symbol=${config.symbol}`);
    const response = await axios.get(url, { params, headers });
    const result = response.data.chart?.result?.[0];

    if (!result) {
      logger.warn('NO_DATA', `${config.symbol}: No data returned`);
      return null;
    }

    const { timestamp, indicators, meta } = result;
    const quotes = indicators.quote?.[0];

    if (!timestamp || !quotes) {
      logger.warn('INVALID_DATA', `${config.symbol}: Invalid data structure`);
      return null;
    }

    const prices: PricePoint[] = timestamp.map((ts: number, i: number) => ({
      date: new Date(ts * 1000).toISOString().split('T')[0],
      open: quotes.open?.[i] ?? null,
      high: quotes.high?.[i] ?? null,
      low: quotes.low?.[i] ?? null,
      close: quotes.close?.[i] ?? null,
      volume: quotes.volume?.[i] ?? null,
    }));

    logger.apiResponse(url, '200 OK');
    logger.dataFetched(config.symbol, prices.length);

    return {
      symbol: config.symbol,
      name: config.name,
      category: config.category,
      currency: meta.currency || 'USD',
      exchangeTimezoneName: meta.exchangeTimezoneName || 'Unknown',
      prices,
    };
  } catch (error: any) {
    const errorMsg = error.response 
      ? `${error.response.status} - ${error.response.data?.error?.description || error.message}`
      : error.message;
    logger.error('FETCH_ERROR', `${config.symbol}: ${errorMsg}`);
    return null;
  }
}

async function fetchAllMarketPrices(): Promise<CombinedOutput> {
  logger.functionCall('fetchAllMarketPrices');
  logger.info('BATCH_START', `Fetching ${MARKET_ASSETS.length} market assets from Yahoo Finance`);
  
  const results: Record<string, AssetData> = {};
  let successCount = 0;
  let failCount = 0;

  for (const asset of MARKET_ASSETS) {
    logger.info('ASSET_START', `Fetching ${asset.symbol} (${asset.category})`);

    const data = await fetchAssetPrices(asset);

    if (data) {
      results[asset.symbol] = data;
      successCount++;
    } else {
      failCount++;
    }

    await new Promise(resolve => setTimeout(resolve, 200));
  }

  logger.info('BATCH_SUMMARY', `Summary: ${successCount} succeeded, ${failCount} failed`);

  return {
    fetchedAt: new Date().toISOString(),
    totalAssets: Object.keys(results).length,
    marketPrices: results,
  };
}

function saveOutput(data: CombinedOutput): string {
  logger.functionCall('saveOutput');
  
  const filepath = '/home/node/.openclaw/shared/data/raw/market-prices.json';
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
  logger.dataSaved(filepath);
  return filepath;
}

export async function main(): Promise<void> {
  logger.start(SCRIPT_NAME);

  try {
    const data = await fetchAllMarketPrices();
    const outputPath = saveOutput(data);

    logger.info('COMPLETE', `Total assets: ${data.totalAssets}`);
    logger.end(SCRIPT_NAME, true);
  } catch (error: any) {
    logger.error('FATAL_ERROR', error.message);
    logger.end(SCRIPT_NAME, false);
    process.exit(1);
  }
}
