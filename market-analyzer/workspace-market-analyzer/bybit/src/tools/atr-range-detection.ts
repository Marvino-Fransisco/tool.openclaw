import type { RangeAnalysis, OHLCVArray } from "../types.js";

interface DataFrame {
  timestamp: number[];
  open: number[];
  high: number[];
  low: number[];
  close: number[];
  volume: number[];
  length: number;
}

interface ATRData {
  atr: number[];
  atrMa: number[];
}

function calculateTrueRange(df: DataFrame): number[] {
  const tr: number[] = [];
  
  for (let i = 0; i < df.length; i++) {
    if (i === 0) {
      tr.push(df.high[i] - df.low[i]);
    } else {
      const highLow = df.high[i] - df.low[i];
      const highClose = Math.abs(df.high[i] - df.close[i - 1]);
      const lowClose = Math.abs(df.low[i] - df.close[i - 1]);
      tr.push(Math.max(highLow, highClose, lowClose));
    }
  }
  
  return tr;
}

function calculateSMA(data: number[], period: number): number[] {
  const sma: number[] = [];
  
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      sma.push(0);
    } else {
      let sum = 0;
      for (let j = i - period + 1; j <= i; j++) {
        sum += data[j];
      }
      sma.push(sum / period);
    }
  }
  
  return sma;
}

function calculateATR(df: DataFrame, period: number = 14): ATRData {
  const tr = calculateTrueRange(df);
  const atr = calculateSMA(tr, period);
  const atrMa = calculateSMA(atr, period);
  
  return { atr, atrMa };
}

export function detectRange(df: DataFrame): RangeAnalysis {
  const emptyResult: RangeAnalysis = {
    consolidation_start_ts: 0,
    consolidation_end_ts: 0,
    range_high: 0,
    range_low: 0,
    breakout_type: null,
    breakout_ts: 0,
    atr_at_breakout: 0,
  };
  
  if (df.length < 28) {
    return emptyResult;
  }
  
  const { atr, atrMa } = calculateATR(df, 14);
  
  const atrThreshold = 0.5;
  
  let consolidationStartIdx = -1;
  
  for (let i = atrMa.length - 1; i >= 27; i--) {
    if (atrMa[i] > 0 && atr[i] < atrMa[i] * atrThreshold) {
      consolidationStartIdx = i;
      break;
    }
  }
  
  if (consolidationStartIdx === -1) {
    return emptyResult;
  }
  
  let breakoutIdx = -1;
  let breakoutType: "bullish" | "bearish" | null = null;
  
  let rangeHigh = df.high[consolidationStartIdx];
  let rangeLow = df.low[consolidationStartIdx];
  
  for (let i = consolidationStartIdx; i < df.length; i++) {
    rangeHigh = Math.max(rangeHigh, df.high[i]);
    rangeLow = Math.min(rangeLow, df.low[i]);
  }
  
  for (let i = consolidationStartIdx + 1; i < df.length; i++) {
    const close = df.close[i];
    const atrRising = atr[i] > atr[i - 1];
    
    if (close > rangeHigh && atrRising) {
      breakoutIdx = i;
      breakoutType = "bullish";
      break;
    }
    
    if (close < rangeLow && atrRising) {
      breakoutIdx = i;
      breakoutType = "bearish";
      break;
    }
  }
  
  if (breakoutIdx === -1) {
    return emptyResult;
  }
  
  rangeHigh = df.high[consolidationStartIdx];
  rangeLow = df.low[consolidationStartIdx];
  for (let i = consolidationStartIdx; i < breakoutIdx; i++) {
    rangeHigh = Math.max(rangeHigh, df.high[i]);
    rangeLow = Math.min(rangeLow, df.low[i]);
  }
  
  return {
    consolidation_start_ts: df.timestamp[consolidationStartIdx],
    consolidation_end_ts: df.timestamp[breakoutIdx - 1] ?? df.timestamp[consolidationStartIdx],
    range_high: Math.round(rangeHigh * 1e6) / 1e6,
    range_low: Math.round(rangeLow * 1e6) / 1e6,
    breakout_type: breakoutType,
    breakout_ts: df.timestamp[breakoutIdx],
    atr_at_breakout: Math.round(atr[breakoutIdx] * 1e8) / 1e8,
  };
}

export function filterOhlcvByRange(
  ohlcv: OHLCVArray[],
  rangeInfo: RangeAnalysis
): OHLCVArray[] {
  if (rangeInfo.consolidation_start_ts === 0 || rangeInfo.breakout_ts === 0) {
    return [];
  }
  
  return ohlcv.filter((c) => 
    c[0] >= rangeInfo.consolidation_start_ts && c[0] <= rangeInfo.breakout_ts
  );
}
