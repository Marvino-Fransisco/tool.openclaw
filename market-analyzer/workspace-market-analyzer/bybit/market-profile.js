#!/usr/bin/env node
import { getMarketProfile } from './dist/index.js';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname } from 'path';

const [,, pair, timeframe, tick, startDate, endDate, outputPath] = process.argv;

if (!pair || !timeframe || !tick || !startDate) {
  console.error('Usage: node market-profile.js <pair> <timeframe> <tick> <startDate> [endDate] [outputPath]');
  console.error('');
  console.error('Arguments:');
  console.error('  pair       Trading pair (e.g., XRPUSDT)');
  console.error('  timeframe  Timeframe (e.g., 1m, 5m, 15m, 1h, 4h, 1d)');
  console.error('  tick       Tick size for volume bins (e.g., 0.01)');
  console.error('  startDate  Start date in ISO format');
  console.error('  endDate    End date in ISO format (optional, defaults to now)');
  console.error('  outputPath Path to save output JSON (optional, auto-generated if not provided)');
  console.error('');
  console.error('Example:');
  console.error('  node market-profile.js XRPUSDT 5m 0.01 "2024-03-05T00:00:00Z"');
  console.error('  node market-profile.js XRPUSDT 1h 0.05 "2024-03-05T00:00:00Z" "2024-03-05T08:00:00Z"');
  console.error('  node market-profile.js XRPUSDT 1h 0.05 "2024-03-05T00:00:00Z" "2024-03-05T08:00:00Z" custom.json');
  process.exit(1);
}

const result = await getMarketProfile({
  symbol: pair,
  timeframe,
  tickSize: parseFloat(tick),
  startDate,
  endDate
});

if (!result.success) {
  console.error('Error:', result.error);
  process.exit(1);
}

// Generate filename based on parameters if not provided
const formatDate = (isoStr) => isoStr.replace(/[:.]/g, '-').replace('T', '_').replace('Z', '');
const endPart = endDate ? formatDate(endDate) : 'now';
const startPart = formatDate(startDate);
const autoFileName = `${pair}_${timeframe}_${startPart}_${endPart}.json`;
const finalOutputPath = outputPath || autoFileName;

const output = JSON.stringify(result, null, 2);

// Create directory if it doesn't exist
const dir = dirname(finalOutputPath);
if (dir && dir !== '.' && !existsSync(dir)) {
  mkdirSync(dir, { recursive: true });
}

writeFileSync(finalOutputPath, output);
console.log(`Output saved to: ${finalOutputPath}`);
