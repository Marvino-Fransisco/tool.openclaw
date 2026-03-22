import * as fs from 'fs';
import type { bybit } from 'ccxt';

const DATA_DIR = '/home/node/.openclaw/workspace-trade-planner/data';

interface CandleData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface ExportResult {
  success: boolean;
  error?: string;
  filepath?: string;
  candles_count?: number;
}

function symbolToFilename(symbol: string): string {
  return symbol.replace('/', '_');
}

function formatDateISO(ms: number): string {
  return new Date(ms).toISOString();
}

async function fetchAllOHLCV(
  exchange: bybit,
  symbol: string,
  timeframe: string,
  sinceMs: number
): Promise<CandleData[]> {
  const allCandles: CandleData[] = [];
  let currentSince = sinceMs;
  const nowMs = Date.now();

  while (currentSince < nowMs) {
    const ohlcv = await exchange.fetchOHLCV(symbol, timeframe, currentSince, 1000);
    
    if (!ohlcv || ohlcv.length === 0) break;

    for (const candle of ohlcv) {
      allCandles.push({
        timestamp: candle[0] ?? 0,
        open: candle[1] ?? 0,
        high: candle[2] ?? 0,
        low: candle[3] ?? 0,
        close: candle[4] ?? 0,
        volume: candle[5] ?? 0,
      });
    }

    const lastTimestamp = Number(ohlcv[ohlcv.length - 1][0]);
    if (lastTimestamp <= currentSince) break;
    
    currentSince = lastTimestamp + 1;
  }

  return allCandles;
}

async function exportCandles(
  symbol: string,
  timeframe: string,
  sinceMs: number
): Promise<ExportResult> {
  try {
    const { getExchange } = await import('../exchange.js');
    const exchange = getExchange();

    const candles = await fetchAllOHLCV(exchange, symbol, timeframe, sinceMs);

    if (candles.length === 0) {
      return { success: false, error: `No data returned for ${symbol}` };
    }

    const filename = `${symbolToFilename(symbol)}_${timeframe}.json`;
    const filepath = `${DATA_DIR}/${filename}`;

    const outputData = {
      symbol,
      timeframe,
      start_date: formatDateISO(candles[0].timestamp),
      end_date: formatDateISO(candles[candles.length - 1].timestamp),
      candles_count: candles.length,
      exported_at: formatDateISO(Date.now()),
      candles,
    };

    fs.writeFileSync(filepath, JSON.stringify(outputData, null, 2));

    return {
      success: true,
      filepath,
      candles_count: candles.length,
    };
  } catch (error) {
    const err = error as Error;
    return { success: false, error: err.message };
  }
}

export async function exportCandles5m(symbol: string): Promise<ExportResult> {
  const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
  const sinceMs = Date.now() - ONE_WEEK_MS;
  return exportCandles(symbol, '5m', sinceMs);
}

export async function exportCandles1m(symbol: string): Promise<ExportResult> {
  const ONE_DAY_MS = 1 * 24 * 60 * 60 * 1000;
  const sinceMs = Date.now() - ONE_DAY_MS;
  return exportCandles(symbol, '1m', sinceMs);
}
