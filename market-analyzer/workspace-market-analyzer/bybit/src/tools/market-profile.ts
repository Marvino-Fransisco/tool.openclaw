import type { bybit } from "ccxt";
import type {
  OHLCVArray,
  VolumeCluster,
  MarketProfileResult,
  VolumeProfileData,
} from "../types.js";

function parseIsoDate(dateStr: string): number | null {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return null;
  }
  return date.getTime();
}

interface DataFrame {
  timestamp: number[];
  open: number[];
  high: number[];
  low: number[];
  close: number[];
  volume: number[];
  length: number;
}

function createDataFrame(ohlcv: OHLCVArray[]): DataFrame {
  return {
    timestamp: ohlcv.map((c) => c[0]),
    open: ohlcv.map((c) => c[1]),
    high: ohlcv.map((c) => c[2]),
    low: ohlcv.map((c) => c[3]),
    close: ohlcv.map((c) => c[4]),
    volume: ohlcv.map((c) => c[5]),
    length: ohlcv.length,
  };
}

function calculateVolumeProfile(
  df: DataFrame,
  tickSize: number,
): VolumeProfileData {
  if (df.length === 0) {
    return {
      bin_centers: [],
      bin_edges: [],
      volume_profile: [],
      total_volume: 0,
    };
  }

  const allPrices = [...df.high, ...df.low];
  const priceMin = Math.min(...allPrices);
  const priceMax = Math.max(...allPrices);
  const priceRange = priceMax - priceMin;

  const numBins = priceRange === 0 ? 1 : Math.max(1, Math.floor(priceRange / tickSize) + 1);

  const binEdges: number[] = [];
  for (let i = 0; i <= numBins; i++) {
    binEdges.push(priceMin + tickSize * i);
  }

  const binCenters: number[] = [];
  for (let i = 0; i < numBins; i++) {
    binCenters.push((binEdges[i] + binEdges[i + 1]) / 2);
  }

  const volumeProfile: number[] = new Array(numBins).fill(0);

  for (let i = 0; i < df.length; i++) {
    const high = df.high[i];
    const low = df.low[i];
    const volume = df.volume[i];
    const candleRange = high - low;

    if (candleRange === 0) {
      let binIdx = 0;
      for (let j = 0; j < numBins; j++) {
        if (high >= binEdges[j] && high < binEdges[j + 1]) {
          binIdx = j;
          break;
        }
        if (j === numBins - 1 && high >= binEdges[j]) {
          binIdx = j;
        }
      }
      if (binIdx >= 0 && binIdx < numBins) {
        volumeProfile[binIdx] += volume;
      }
    } else {
      for (let j = 0; j < numBins; j++) {
        const binLow = binEdges[j];
        const binHigh = binEdges[j + 1];

        const overlapLow = Math.max(low, binLow);
        const overlapHigh = Math.min(high, binHigh);
        const overlap = Math.max(overlapHigh - overlapLow, 0);

        const volumeContrib = (volume * overlap) / candleRange;
        volumeProfile[j] += volumeContrib;
      }
    }
  }

  const totalVolume = volumeProfile.reduce((a, b) => a + b, 0);

  return {
    bin_centers: binCenters,
    bin_edges: binEdges,
    volume_profile: volumeProfile,
    total_volume: totalVolume,
  };
}

function extractCluster(
  volumeProfile: number[],
  binCenters: number[],
  binEdges: number[],
  startIdx: number,
  endIdx: number,
  totalVolume: number,
): VolumeCluster {
  const clusterVolume = volumeProfile
    .slice(startIdx, endIdx)
    .reduce((a, b) => a + b, 0);

  let maxVol = volumeProfile[startIdx];
  let pocIdx = startIdx;
  for (let i = startIdx; i < endIdx; i++) {
    if (volumeProfile[i] > maxVol) {
      maxVol = volumeProfile[i];
      pocIdx = i;
    }
  }
  const poc = binCenters[pocIdx];

  const clusterVolArray = volumeProfile.slice(startIdx, endIdx);
  const cumulative: number[] = [];
  let cumSum = 0;
  for (const v of clusterVolArray) {
    cumSum += v;
    cumulative.push(cumSum);
  }
  const cumulativePct = cumulative.map((c) => c / clusterVolume);

  let valLocalIdx = 0;
  let vahLocalIdx = clusterVolArray.length - 1;

  for (let i = 0; i < cumulativePct.length; i++) {
    if (cumulativePct[i] >= 0.15) {
      valLocalIdx = i;
      break;
    }
  }
  for (let i = 0; i < cumulativePct.length; i++) {
    if (cumulativePct[i] >= 0.85) {
      vahLocalIdx = i;
      break;
    }
  }

  const valGlobalIdx = startIdx + valLocalIdx;
  const vahGlobalIdx = startIdx + vahLocalIdx;

  const val = binEdges[valGlobalIdx];
  const vah = binEdges[vahGlobalIdx + 1];

  return {
    poc: Math.round(poc * 1e6) / 1e6,
    val: Math.round(val * 1e6) / 1e6,
    vah: Math.round(vah * 1e6) / 1e6,
    volume: Math.round(clusterVolume * 100) / 100,
    volume_pct: Math.round((clusterVolume / totalVolume) * 10000) / 100,
  };
}

function findVolumeClusters(
  profileData: VolumeProfileData,
  thresholdPct: number = 0.3,
  minVolumePct: number = 10,
): VolumeCluster[] {
  const { bin_centers, bin_edges, volume_profile, total_volume } = profileData;

  if (volume_profile.length === 0 || total_volume === 0) {
    return [];
  }

  const maxVolume = Math.max(...volume_profile);
  const threshold = maxVolume * thresholdPct;

  const clusters: VolumeCluster[] = [];
  let inCluster = false;
  let clusterStart = 0;

  for (let i = 0; i < volume_profile.length; i++) {
    if (volume_profile[i] >= threshold) {
      if (!inCluster) {
        inCluster = true;
        clusterStart = i;
      }
    } else {
      if (inCluster) {
        const cluster = extractCluster(
          volume_profile,
          bin_centers,
          bin_edges,
          clusterStart,
          i,
          total_volume,
        );
        clusters.push(cluster);
        inCluster = false;
      }
    }
  }

  if (inCluster) {
    const cluster = extractCluster(
      volume_profile,
      bin_centers,
      bin_edges,
      clusterStart,
      volume_profile.length,
      total_volume,
    );
    clusters.push(cluster);
  }

  clusters.sort((a, b) => b.volume - a.volume);

  return clusters.filter((c) => c.volume_pct >= minVolumePct);
}

async function fetchOhlcvRange(
  exchange: bybit,
  symbol: string,
  timeframe: string,
  startMs: number,
  endMs: number,
): Promise<OHLCVArray[]> {
  const allCandles: OHLCVArray[] = [];

  while (startMs < endMs) {
    const ohlcv = await exchange.fetchOHLCV(symbol, timeframe, startMs, 1000);
    if (!ohlcv || ohlcv.length === 0) break;

    const filtered = (ohlcv as OHLCVArray[]).filter((c) => c[0] < endMs);
    allCandles.push(...filtered);

    const lastTimestamp = ohlcv[ohlcv.length - 1][0];
    if (lastTimestamp === undefined || lastTimestamp <= startMs) break;
    startMs = lastTimestamp + 1;

    if (lastTimestamp >= endMs) break;
  }

  return allCandles;
}

export interface GetMarketProfileParams {
  symbol: string;
  timeframe: string;
  startDate: string;
  endDate: string;
  minVolumePct?: number;
  tickSize?: number;  // Optional: price tick size for volume bins (default: auto-calculated)
}

export interface GetMarketProfileResult {
  success: true;
  data: MarketProfileResult;
}

export interface GetMarketProfileError {
  success: false;
  error: string;
}

export type MarketProfileResponse = GetMarketProfileResult | GetMarketProfileError;

export async function getMarketProfile(params: GetMarketProfileParams): Promise<MarketProfileResponse> {
  const { symbol, timeframe, startDate, endDate, minVolumePct = 10, tickSize: providedTickSize } = params;

  try {
    const { getExchange } = await import("../exchange.js");
    const exchange = getExchange();

    const parsedEnd = parseIsoDate(endDate);
    if (parsedEnd === null) {
      return { success: false, error: `Invalid end_date format: ${endDate}. Expected ISO 8601 format (e.g., 2024-01-15T23:59:59Z)` };
    }
    const endMs = parsedEnd;

    const parsedStart = parseIsoDate(startDate);
    if (parsedStart === null) {
      return { success: false, error: `Invalid start_date format: ${startDate}. Expected ISO 8601 format (e.g., 2024-01-15T00:00:00Z)` };
    }
    const startMs = parsedStart;

    if (startMs >= endMs) {
      return { success: false, error: `start_date must be before end_date` };
    }

    const ohlcv = await fetchOhlcvRange(exchange, symbol, timeframe, startMs, endMs);

    if (!ohlcv || ohlcv.length === 0) {
      return { success: false, error: `No data returned for ${symbol}` };
    }

    const df = createDataFrame(ohlcv);

    // Use provided tick size or calculate dynamically based on price range
    let tickSize: number;
    if (providedTickSize && providedTickSize > 0) {
      tickSize = providedTickSize;
    } else {
      const allPrices = [...df.high, ...df.low];
      const priceRange = Math.max(...allPrices) - Math.min(...allPrices);
      const targetBins = 100;
      tickSize = Math.max(priceRange / targetBins, 0.01);
    }

    const profileData = calculateVolumeProfile(df, tickSize);
    const clusters = findVolumeClusters(profileData, 0.15, minVolumePct);

    const currentPrice = df.close[df.close.length - 1];

    const result: MarketProfileResult = {
      symbol,
      timeframe,
      period: `${startDate} to ${endDate}`,
      current_price: Math.round(currentPrice * 1e6) / 1e6,
      value_areas: clusters,
    };

    return { success: true, data: result };
  } catch (error) {
    const err = error as Error;
    if (err.message?.includes("symbol")) {
      return { success: false, error: `Invalid symbol: ${symbol}` };
    }
    return { success: false, error: err.message };
  }
}
