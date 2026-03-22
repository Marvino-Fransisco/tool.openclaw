// Market Analyzer - Direct callable library
// Export all tools and types for direct use

export { getExchange } from './exchange.js';

// Tools
export { getMarketProfile } from './tools/market-profile.js';
export type { MarketProfileResponse, GetMarketProfileResult, GetMarketProfileError, GetMarketProfileParams } from './tools/market-profile.js';

export { getFootprint } from './tools/footprint.js';
export type { FootprintResponse, GetFootprintResult, GetFootprintError } from './tools/footprint.js';

export { getVolumeSpread } from './tools/volume-spread.js';
export type { VolumeSpreadResponse, GetVolumeSpreadResult, GetVolumeSpreadError } from './tools/volume-spread.js';

// Types
export type {
  OHLCV,
  OHLCVArray,
  Trade,
  PriceLevel,
  CandleFootprint,
  FootprintSummary,
  AggregatedFootprint,
  FootprintResult,
  VSAAnalysis,
  VSASummary,
  VSAResult,
  VolumeProfileData,
  MarketProfileResult,
} from './types.js';
