#!/usr/bin/env node
import { getVolumeSpread } from './dist/index.js';

const [,, symbol] = process.argv;

if (!symbol) {
  console.error('Usage: node volume-spread.js <symbol>');
  console.error('');
  console.error('Example:');
  console.error('  node volume-spread.js XRPUSDT');
  process.exit(1);
}

const result = await getVolumeSpread(symbol);

if (!result.success) {
  console.error('Error:', result.error);
  process.exit(1);
}

console.log(JSON.stringify(result, null, 2));
