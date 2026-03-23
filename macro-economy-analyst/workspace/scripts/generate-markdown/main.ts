import { createEconomicIndicatorMD } from './create-economic-indicator-md'
import { createMarketPriceMD } from './create-market-price-md'
import { createGeopoliticsNewsMD } from './create-geopolitics-news-md'
import { createSentimentPositioningMD } from './create-sentiment-positioning-md'
import { createFixedIncomeMD } from './create-fixed-income-md'
import { createFlowsLiquidityMD } from './create-flows-liquidity-md'
import { createCentralBankSignalMD } from './create-central-bank-signal-md'
import { logger } from './logger'
import * as path from 'path'
import * as fs from 'fs'

const dataDir = '/home/node/.openclaw/shared/data/raw'

const generators: { file: string; fn: (path: string) => string; name: string }[] = [
  { file: 'economic-indicators.json', fn: createEconomicIndicatorMD, name: 'Economic Indicators' },
  { file: 'market-prices.json', fn: createMarketPriceMD, name: 'Market Prices' },
  { file: 'geopolitics-news.json', fn: createGeopoliticsNewsMD, name: 'Geopolitics News' },
  { file: 'sentiment-positioning.json', fn: createSentimentPositioningMD, name: 'Sentiment & Positioning' },
  { file: 'fixed-income.json', fn: createFixedIncomeMD, name: 'Fixed Income' },
  { file: 'flows-liquidity.json', fn: createFlowsLiquidityMD, name: 'Flows & Liquidity' },
  { file: 'central-bank-signals.json', fn: createCentralBankSignalMD, name: 'Central Bank Signals' },
]

function runAll() {
  logger.info('START', 'Running all markdown generators...')
  logger.info('CONFIG', `Data directory: ${dataDir}`)

  let success = 0
  let skipped = 0

  for (const gen of generators) {
    const inputPath = path.join(dataDir, gen.file)
    
    if (!fs.existsSync(inputPath)) {
      logger.warn('SKIP', `${gen.name}: ${gen.file} not found`)
      skipped++
      continue
    }

    try {
      logger.info('RUN', `Processing ${gen.name}...`)
      gen.fn(inputPath)
      logger.success('DONE', `${gen.name} completed successfully`)
      success++
    } catch (err) {
      logger.error('FAIL', `${gen.name}: ${err}`)
    }
  }

  logger.info('SUMMARY', `${success} succeeded, ${skipped} skipped`)

  const logPath = '/home/node/.openclaw/logs/last-processed.log'
  const timestamp = new Date().toISOString()
  fs.mkdirSync(path.dirname(logPath), { recursive: true })
  fs.writeFileSync(logPath, timestamp)
  logger.info('TIMESTAMP', `Last processed time saved: ${timestamp}`)
}

runAll()
