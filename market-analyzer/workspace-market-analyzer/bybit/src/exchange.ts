import ccxt, { type bybit } from 'ccxt';
import dotenv from 'dotenv';

dotenv.config();

let exchange: bybit | null = null;

export function getExchange(): bybit {
  if (!exchange) {
    exchange = new ccxt.bybit({
      apiKey: process.env.BYBIT_API_KEY,
      secret: process.env.BYBIT_API_SECRET,
      enableRateLimit: true,
    });
  }
  return exchange;
}
