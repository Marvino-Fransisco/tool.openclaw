import type { bybit } from 'ccxt';
import type { OHLCVArray, Trade, PriceLevel, CandleFootprint, FootprintSummary, AggregatedFootprint, FootprintResult } from '../types.js';

function parseIsoDate(dateStr: string): number | null {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return null;
  }
  return date.getTime();
}

async function fetchTradesSince(exchange: bybit, symbol: string, sinceMs: number): Promise<Trade[]> {
  const allTrades: Trade[] = [];
  const nowMs = Date.now();

  while (sinceMs < nowMs) {
    const trades = await exchange.fetchTrades(symbol, sinceMs, 1000);
    if (!trades || trades.length === 0) break;

    allTrades.push(...(trades as Trade[]));

    const lastTimestamp = trades[trades.length - 1].timestamp;
    if (!lastTimestamp || lastTimestamp <= sinceMs) break;
    sinceMs = lastTimestamp + 1;
  }

  return allTrades;
}

function getCandleTimestamp(tsMs: number, timeframeMs: number): number {
  return Math.floor(tsMs / timeframeMs) * timeframeMs;
}

function mapTradesToCandles(
  trades: Trade[],
  candles: OHLCVArray[],
  timeframeMs: number
): Map<number, Trade[]> {
  const candleTrades = new Map<number, Trade[]>();

  const candleTimestamps = new Set<number>();
  for (const ohlcv of candles) {
    const candleTs = ohlcv[0];
    candleTimestamps.add(candleTs);
    candleTrades.set(candleTs, []);
  }

  for (const trade of trades) {
    const tradeTs = trade.timestamp;
    if (tradeTs === undefined) continue;

    const candleTs = getCandleTimestamp(tradeTs, timeframeMs);
    if (candleTrades.has(candleTs)) {
      candleTrades.get(candleTs)!.push(trade);
    }
  }

  return candleTrades;
}

function calculateTickSize(prices: number[], levels: number = 50): number {
  if (prices.length === 0) return 0.000001;

  const priceMin = Math.min(...prices);
  const priceMax = Math.max(...prices);
  const priceRange = priceMax - priceMin;

  if (priceRange > 0) {
    const tickSize = Math.round((priceRange / levels) * 1e6) / 1e6;
    return Math.max(tickSize, 0.000001);
  }
  return 0.000001;
}

interface FootprintAtTick {
  price_levels: PriceLevel[];
  top_levels: PriceLevel[];
  total_bid_volume: number;
  total_ask_volume: number;
  net_delta: number;
}

function aggregateFootprintAtTick(trades: Trade[], tickSize: number): FootprintAtTick {
  if (!trades || trades.length === 0) {
    return {
      price_levels: [],
      top_levels: [],
      total_bid_volume: 0,
      total_ask_volume: 0,
      net_delta: 0,
    };
  }

  const levelMap = new Map<number, { bid_volume: number; ask_volume: number; trade_count: number }>();

  for (const trade of trades) {
    const priceLevel = Math.round(trade.price / tickSize) * tickSize;
    const roundedLevel = Math.round(priceLevel * 1e6) / 1e6;

    if (!levelMap.has(roundedLevel)) {
      levelMap.set(roundedLevel, { bid_volume: 0, ask_volume: 0, trade_count: 0 });
    }

    const level = levelMap.get(roundedLevel)!;
    level.trade_count++;
    if (trade.side === 'sell') {
      level.bid_volume += trade.amount;
    } else {
      level.ask_volume += trade.amount;
    }
  }

  const priceLevels: PriceLevel[] = [];
  for (const [price, data] of levelMap) {
    const totalVolume = data.bid_volume + data.ask_volume;
    const delta = data.ask_volume - data.bid_volume;
    priceLevels.push({
      price,
      bid_volume: Math.round(data.bid_volume * 1e6) / 1e6,
      ask_volume: Math.round(data.ask_volume * 1e6) / 1e6,
      delta: Math.round(delta * 1e6) / 1e6,
      total_volume: Math.round(totalVolume * 1e6) / 1e6,
    });
  }

  priceLevels.sort((a, b) => b.price - a.price);

  const topByVolume = [...priceLevels].sort((a, b) => b.total_volume - a.total_volume).slice(0, 5);

  const totalBid = priceLevels.reduce((sum, l) => sum + l.bid_volume, 0);
  const totalAsk = priceLevels.reduce((sum, l) => sum + l.ask_volume, 0);

  return {
    price_levels: priceLevels,
    top_levels: topByVolume,
    total_bid_volume: Math.round(totalBid * 1e6) / 1e6,
    total_ask_volume: Math.round(totalAsk * 1e6) / 1e6,
    net_delta: Math.round((totalAsk - totalBid) * 1e6) / 1e6,
  };
}

function aggregateCandleFootprint(
  trades: Trade[],
  ohlcv: OHLCVArray,
  tickSize?: number | null
): CandleFootprint {
  if (!trades || trades.length === 0) {
    return {
      timestamp: ohlcv[0],
      open: ohlcv[1],
      high: ohlcv[2],
      low: ohlcv[3],
      close: ohlcv[4],
      total_volume: Math.round(ohlcv[5] * 1e6) / 1e6,
      delta: 0,
      top_levels: [],
    };
  }

  const actualTickSize = tickSize ?? calculateTickSize(trades.map(t => t.price));
  const footprint = aggregateFootprintAtTick(trades, actualTickSize);

  return {
    timestamp: ohlcv[0],
    open: ohlcv[1],
    high: ohlcv[2],
    low: ohlcv[3],
    close: ohlcv[4],
    total_volume: Math.round(ohlcv[5] * 1e6) / 1e6,
    delta: footprint.net_delta,
    top_levels: footprint.top_levels,
  };
}

function aggregateTotalFootprint(allTrades: Trade[], tickSize?: number | null): AggregatedFootprint {
  if (!allTrades || allTrades.length === 0) {
    return {
      price_levels: [],
      top_levels: [],
      summary: {
        total_bid_volume: 0,
        total_ask_volume: 0,
        net_delta: 0,
        max_bid_volume_price: 0,
        max_ask_volume_price: 0,
        price_levels_count: 0,
      },
    };
  }

  const actualTickSize = tickSize ?? calculateTickSize(allTrades.map(t => t.price));
  const footprint = aggregateFootprintAtTick(allTrades, actualTickSize);

  const priceLevels = footprint.price_levels;
  let maxBidPrice = 0;
  let maxAskPrice = 0;

  if (priceLevels.length > 0) {
    const maxBidLevel = priceLevels.reduce((max, l) => l.bid_volume > max.bid_volume ? l : max, priceLevels[0]);
    const maxAskLevel = priceLevels.reduce((max, l) => l.ask_volume > max.ask_volume ? l : max, priceLevels[0]);
    maxBidPrice = maxBidLevel.price;
    maxAskPrice = maxAskLevel.price;
  }

  const summary: FootprintSummary = {
    total_bid_volume: footprint.total_bid_volume,
    total_ask_volume: footprint.total_ask_volume,
    net_delta: footprint.net_delta,
    max_bid_volume_price: maxBidPrice,
    max_ask_volume_price: maxAskPrice,
    price_levels_count: priceLevels.length,
    tick_size: actualTickSize,
  };

  return {
    price_levels: priceLevels.slice(0, 20),
    top_levels: footprint.top_levels,
    summary,
  };
}

async function buildFootprintData(
  symbol: string,
  timeframe: string,
  sinceMs: number,
  periodLabel: string
): Promise<FootprintResult | { error: string }> {
  const { getExchange } = await import('../exchange.js');
  const exchange = getExchange();

  const timeframeMsMap: Record<string, number> = {
    '1m': 60 * 1000,
    '3m': 3 * 60 * 1000,
    '5m': 5 * 60 * 1000,
    '15m': 15 * 60 * 1000,
    '30m': 30 * 60 * 1000,
    '1h': 60 * 60 * 1000,
    '2h': 2 * 60 * 60 * 1000,
    '4h': 4 * 60 * 60 * 1000,
    '6h': 6 * 60 * 60 * 1000,
    '12h': 12 * 60 * 60 * 1000,
    '1d': 24 * 60 * 60 * 1000,
    '3d': 3 * 24 * 60 * 60 * 1000,
    '1w': 7 * 24 * 60 * 60 * 1000,
  };
  const timeframeMs = timeframeMsMap[timeframe];

  if (!timeframeMs) {
    return { error: `Unsupported timeframe: ${timeframe}` };
  }

  const ohlcv = await exchange.fetchOHLCV(symbol, timeframe, sinceMs, 1000);

  if (!ohlcv || ohlcv.length === 0) {
    return { error: `No OHLCV data returned for ${symbol}` };
  }

  const trades = await fetchTradesSince(exchange, symbol, sinceMs);

  if (!trades || trades.length === 0) {
    return { error: `No trades returned for ${symbol}` };
  }

  const allPrices = trades.map(t => t.price);
  const tickSize = calculateTickSize(allPrices);

  const candleTrades = mapTradesToCandles(trades, ohlcv as OHLCVArray[], timeframeMs);

  const candlesFootprint: CandleFootprint[] = [];
  for (const ohlcvItem of ohlcv) {
    const candleTs = Number(ohlcvItem[0]);
    const candleTradeList = candleTrades.get(candleTs) || [];
    const candleFp = aggregateCandleFootprint(candleTradeList, ohlcvItem as OHLCVArray, tickSize);
    candlesFootprint.push(candleFp);
  }

  const aggregated = aggregateTotalFootprint(trades, tickSize);

  return {
    symbol,
    timeframe,
    period: periodLabel,
    candles: candlesFootprint,
    aggregated,
    candles_analyzed: ohlcv.length,
    trades_analyzed: trades.length,
  };
}

function formatPeriodLabel(startMs: number, endMs: number): string {
  const diffMs = endMs - startMs;
  const diffMins = Math.round(diffMs / (60 * 1000));
  const diffHours = Math.round(diffMs / (60 * 60 * 1000));
  const diffDays = Math.round(diffMs / (24 * 60 * 60 * 1000));

  if (diffMins < 60) {
    return `${diffMins}_minutes`;
  } else if (diffHours < 24) {
    return `${diffHours}_hours`;
  } else {
    return `${diffDays}_days`;
  }
}

export interface GetFootprintResult {
  success: true;
  data: FootprintResult;
}

export interface GetFootprintError {
  success: false;
  error: string;
}

export type FootprintResponse = GetFootprintResult | GetFootprintError;

export async function getFootprint(
  symbol: string,
  timeframe: string,
  startDate: string,
  endDate?: string
): Promise<FootprintResponse> {
  try {
    const startMs = parseIsoDate(startDate);
    if (startMs === null) {
      return { success: false, error: `Invalid start_date format: ${startDate}. Expected ISO 8601 format (e.g., 2024-01-15T00:00:00Z)` };
    }

    const endMs = endDate ? parseIsoDate(endDate) : Date.now();
    if (endDate && endMs === null) {
      return { success: false, error: `Invalid end_date format: ${endDate}. Expected ISO 8601 format (e.g., 2024-01-15T23:59:59Z)` };
    }

    const endTime = endMs ?? Date.now();
    const periodLabel = formatPeriodLabel(startMs, endTime);

    const result = await buildFootprintData(symbol, timeframe, startMs, periodLabel);

    if ('error' in result) {
      return { success: false, error: result.error };
    }

    return { success: true, data: result };
  } catch (error) {
    const err = error as Error;
    if (err.message?.includes('symbol')) {
      return { success: false, error: `Invalid symbol: ${symbol}` };
    }
    return { success: false, error: err.message };
  }
}
