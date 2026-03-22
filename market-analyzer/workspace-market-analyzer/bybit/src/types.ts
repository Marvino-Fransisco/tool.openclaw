export interface OHLCV {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface OHLCVArray extends Array<number> {
  0: number;
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}

export interface CandlestickData {
  symbol: string;
  timeframe: string;
  period: string;
  candle_count: number;
  timestamps: string[];
  open: number[];
  high: number[];
  low: number[];
  close: number[];
  volume: number[];
}

export interface VolumeCluster {
  poc: number;
  val: number;
  vah: number;
  volume: number;
  volume_pct: number;
}

export interface Trade {
  timestamp?: number;
  price: number;
  amount: number;
  side: 'buy' | 'sell';
}

export interface PriceLevel {
  price: number;
  bid_volume: number;
  ask_volume: number;
  delta: number;
  total_volume: number;
}

export interface CandleFootprint {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  total_volume: number;
  delta: number;
  top_levels: PriceLevel[];
}

export interface FootprintSummary {
  total_bid_volume: number;
  total_ask_volume: number;
  net_delta: number;
  max_bid_volume_price: number;
  max_ask_volume_price: number;
  price_levels_count: number;
  tick_size?: number;
}

export interface AggregatedFootprint {
  price_levels: PriceLevel[];
  top_levels: PriceLevel[];
  summary: FootprintSummary;
}

export interface FootprintResult {
  symbol: string;
  timeframe: string;
  period: string;
  candles: CandleFootprint[];
  aggregated: AggregatedFootprint;
  candles_analyzed: number;
  trades_analyzed: number;
}

export interface VSAAnalysis {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  spread: number;
  volume: number;
  volume_vs_avg_pct: number;
  volume_status: string;
  spread_status: string;
  interpretation: string;
}

export interface VSASummary {
  avg_spread: number;
  avg_volume_vs_avg_pct: number;
  overall_signal: string;
}

export interface VSAResult {
  symbol: string;
  timeframe: string;
  candles: VSAAnalysis[];
  summary: VSASummary;
  candles_analyzed: number;
  volume_ma_period: number;
}

export interface VolumeProfileData {
  bin_centers: number[];
  bin_edges: number[];
  volume_profile: number[];
  total_volume: number;
}

export interface RangeAnalysis {
  consolidation_start_ts: number;
  consolidation_end_ts: number;
  range_high: number;
  range_low: number;
  breakout_type: 'bullish' | 'bearish' | null;
  breakout_ts: number;
  atr_at_breakout: number;
}

export interface MarketProfileResult {
  symbol: string;
  timeframe: string;
  period: string;
  current_price: number;
  value_areas: VolumeCluster[];
}
