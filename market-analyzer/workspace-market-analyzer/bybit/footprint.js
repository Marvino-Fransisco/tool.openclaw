#!/usr/bin/env node
import { getFootprint } from './dist/index.js';

const [,, symbol, timeframe, startDate, endDate] = process.argv;

if (!symbol || !timeframe || !startDate) {
  console.error('Usage: node footprint.js <symbol> <timeframe> <startDate> [endDate]');
  console.error('');
  console.error('Example:');
  console.error('  node footprint.js XRPUSDT 5m "2024-03-05T08:00:00Z"');
  console.error('  node footprint.js XRPUSDT 5m "2024-03-05T08:00:00Z" "2024-03-05T09:00:00Z"');
  process.exit(1);
}

const result = await getFootprint(symbol, timeframe, startDate, endDate);

if (!result.success) {
  console.error('Error:', result.error);
  process.exit(1);
}

console.log(JSON.stringify(result, null, 2));
