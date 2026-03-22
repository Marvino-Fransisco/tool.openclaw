import type { OHLCVArray, VSAAnalysis, VSASummary, VSAResult } from '../types.js';

interface DataFrameRow {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  spread: number;
  volumeSma20: number;
  volumeVsAvg: number;
  volumeStatus: string;
  spreadStatus: string;
  interpretation: string;
}

function calculateSMA(values: number[], window: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < values.length; i++) {
    if (i < window - 1) {
      result.push(NaN);
    } else {
      const sum = values.slice(i - window + 1, i + 1).reduce((a, b) => a + b, 0);
      result.push(sum / window);
    }
  }
  return result;
}

function analyzeVolumeSpread(ohlcv: OHLCVArray[], lookback: number = 5): { candles: DataFrameRow[]; summary: VSASummary } {
  const rows: DataFrameRow[] = ohlcv.map(c => ({
    timestamp: c[0],
    open: c[1],
    high: c[2],
    low: c[3],
    close: c[4],
    volume: c[5],
    spread: c[2] - c[3],
    volumeSma20: 0,
    volumeVsAvg: 0,
    volumeStatus: '',
    spreadStatus: '',
    interpretation: '',
  }));

  const volumeSma = calculateSMA(rows.map(r => r.volume), 20);

  for (let i = 0; i < rows.length; i++) {
    rows[i].volumeSma20 = volumeSma[i];
    if (!isNaN(volumeSma[i]) && volumeSma[i] > 0) {
      rows[i].volumeVsAvg = ((rows[i].volume / volumeSma[i]) - 1) * 100;
    }
  }

  const recent = rows.slice(-lookback);
  const avgSpread = recent.reduce((sum, r) => sum + r.spread, 0) / recent.length;

  for (const row of recent) {
    if (row.volumeVsAvg > 50) {
      row.volumeStatus = 'HIGH';
    } else if (row.volumeVsAvg < -30) {
      row.volumeStatus = 'LOW';
    } else {
      row.volumeStatus = 'NORMAL';
    }

    if (row.spread > avgSpread * 1.5) {
      row.spreadStatus = 'WIDE';
    } else if (row.spread < avgSpread * 0.5) {
      row.spreadStatus = 'NARROW';
    } else {
      row.spreadStatus = 'NORMAL';
    }

    if (row.volumeStatus === 'HIGH' && row.spreadStatus === 'NARROW') {
      row.interpretation = 'Potential ACCUMULATION - High volume with narrow spread suggests buying pressure';
    } else if (row.volumeStatus === 'HIGH' && row.spreadStatus === 'WIDE') {
      row.interpretation = 'Strong MOVE - High volume with wide spread indicates strong directional move';
    } else if (row.volumeStatus === 'LOW' && row.spreadStatus === 'NARROW') {
      row.interpretation = 'CONSOLIDATION - Low volume with narrow spread, market is coiling';
    } else if (row.volumeStatus === 'HIGH' && row.spreadStatus === 'NORMAL') {
      row.interpretation = 'Increased activity - Watch for breakout direction';
    } else if (row.volumeStatus === 'LOW' && row.spreadStatus === 'WIDE') {
      row.interpretation = 'Weak MOVE - Wide spread on low volume, move may lack conviction';
    } else {
      row.interpretation = 'NEUTRAL - No significant VSA signal';
    }
  }

  const avgVolumeVsAvg = recent.reduce((sum, r) => sum + r.volumeVsAvg, 0) / recent.length;

  let overallSignal: string;
  if (avgVolumeVsAvg > 30) {
    overallSignal = 'BULLISH - Above average volume suggests institutional buying';
  } else if (avgVolumeVsAvg < -20) {
    overallSignal = 'BEARISH - Below average volume suggests lack of interest';
  } else {
    overallSignal = 'NEUTRAL - Volume around average, no strong signal';
  }

  return {
    candles: recent,
    summary: {
      avg_spread: Math.round(avgSpread * 1e6) / 1e6,
      avg_volume_vs_avg_pct: Math.round(avgVolumeVsAvg * 100) / 100,
      overall_signal: overallSignal,
    },
  };
}

export interface GetVolumeSpreadResult {
  success: true;
  data: VSAResult;
}

export interface GetVolumeSpreadError {
  success: false;
  error: string;
}

export type VolumeSpreadResponse = GetVolumeSpreadResult | GetVolumeSpreadError;

export async function getVolumeSpread(symbol: string): Promise<VolumeSpreadResponse> {
  try {
    const { getExchange } = await import('../exchange.js');
    const exchange = getExchange();

    const ohlcv = await exchange.fetchOHLCV(symbol, '15m', undefined, 25);

    if (!ohlcv || ohlcv.length === 0) {
      return { success: false, error: `No data returned for ${symbol}` };
    }

    const { candles, summary } = analyzeVolumeSpread(ohlcv as OHLCVArray[], 5);

    const candlesAnalysis: VSAAnalysis[] = candles.map(row => ({
      timestamp: Math.round(row.timestamp),
      open: Math.round(row.open * 1e6) / 1e6,
      high: Math.round(row.high * 1e6) / 1e6,
      low: Math.round(row.low * 1e6) / 1e6,
      close: Math.round(row.close * 1e6) / 1e6,
      spread: Math.round(row.spread * 1e6) / 1e6,
      volume: Math.round(row.volume * 100) / 100,
      volume_vs_avg_pct: Math.round(row.volumeVsAvg * 100) / 100,
      volume_status: row.volumeStatus,
      spread_status: row.spreadStatus,
      interpretation: row.interpretation,
    }));

    const result: VSAResult = {
      symbol,
      timeframe: '15m',
      candles: candlesAnalysis,
      summary,
      candles_analyzed: 5,
      volume_ma_period: 20,
    };

    return { success: true, data: result };
  } catch (error) {
    const err = error as Error;
    if (err.message?.includes('symbol')) {
      return { success: false, error: `Invalid symbol: ${symbol}` };
    }
    return { success: false, error: err.message };
  }
}
