#!/usr/bin/env node

import { exportCandles5m, exportCandles1m } from './dist/tools/export-candles.js';

const symbol = process.argv[2];

if (!symbol) {
  console.error('Usage: node fetch-candle.js <SYMBOL>');
  console.error('Example: node fetch-candle.js BTC/USDT');
  process.exit(1);
}

async function main() {
  console.log(`Fetching candle data for ${symbol}...\n`);

  console.log('Fetching 5-minute candles (last 7 days)...');
  const result5m = await exportCandles5m(symbol);
  
  if (result5m.success) {
    console.log(`✓ 5m candles: ${result5m.candles_count} candles saved to ${result5m.filepath}`);
  } else {
    console.error(`✗ 5m candles failed: ${result5m.error}`);
  }

  console.log('\nFetching 1-minute candles (last 1 day)...');
  const result1m = await exportCandles1m(symbol);
  
  if (result1m.success) {
    console.log(`✓ 1m candles: ${result1m.candles_count} candles saved to ${result1m.filepath}`);
  } else {
    console.error(`✗ 1m candles failed: ${result1m.error}`);
  }

  console.log('\nDone!');
}

main().catch((error) => {
  console.error('Error:', error.message);
  process.exit(1);
});
