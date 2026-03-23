import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { logger } from './logger'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface PricePoint {
  date: string
  open: number | null
  high: number | null
  low: number | null
  close: number | null
  volume: number | null
}

interface AssetData {
  symbol: string
  name: string
  category: string
  currency: string
  exchangeTimezoneName: string
  prices: PricePoint[]
}

interface InputJSON {
  fetchedAt: string
  totalAssets: number
  marketPrices: Record<string, AssetData>
}

interface ValidPrice {
  date: Date
  open: number
  high: number
  low: number
  close: number
  volume: number
}

interface CategoryConfig {
  name: string
  order: number
  symbols: string[]
}

const CATEGORY_CONFIG: CategoryConfig[] = [
  { name: 'Equity Indices', order: 1, symbols: ['^GSPC', '^DJI', '^IXIC', '^RUT', '^VIX'] },
  { name: 'FX Rates', order: 2, symbols: ['EURUSD=X', 'JPYUSD=X', 'GBPUSD=X', 'CNYUSD=X', 'DX-Y.NYB'] },
  { name: 'Commodities', order: 3, symbols: ['GC=F', 'SI=F', 'CL=F', 'BZ=F', 'NG=F', 'HG=F'] },
  { name: 'Crypto', order: 4, symbols: ['BTC-USD', 'ETH-USD'] }
]

function parseJSON(filepath: string): InputJSON {
  const content = fs.readFileSync(filepath, 'utf-8')
  return JSON.parse(content)
}

function filterValidPrices(prices: PricePoint[]): ValidPrice[] {
  return prices
    .filter(p => p.close !== null && p.close !== undefined)
    .map(p => ({
      date: new Date(p.date),
      open: p.open ?? 0,
      high: p.high ?? 0,
      low: p.low ?? 0,
      close: p.close ?? 0,
      volume: p.volume ?? 0
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
}

function calculateReturn(startValue: number, endValue: number): number {
  if (startValue === 0) return 0
  return (endValue - startValue) / startValue
}

function calculateCAGR(startValue: number, endValue: number, years: number): number {
  if (years <= 0 || startValue <= 0 || endValue <= 0) return 0
  return Math.pow(endValue / startValue, 1 / years) - 1
}

function calculateDailyReturns(prices: ValidPrice[]): number[] {
  const returns: number[] = []
  for (let i = 1; i < prices.length; i++) {
    if (prices[i - 1].close > 0) {
      returns.push((prices[i].close - prices[i - 1].close) / prices[i - 1].close)
    }
  }
  return returns
}

function calculateVolatility(dailyReturns: number[]): number {
  if (dailyReturns.length === 0) return 0
  const mean = dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length
  const squaredDiffs = dailyReturns.map(r => Math.pow(r - mean, 2))
  return Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / dailyReturns.length)
}

function calculateMaxDrawdown(prices: ValidPrice[]): number {
  if (prices.length === 0) return 0
  let peak = prices[0].close
  let maxDrawdown = 0
  
  for (const p of prices) {
    if (p.close > peak) peak = p.close
    const drawdown = (peak - p.close) / peak
    if (drawdown > maxDrawdown) maxDrawdown = drawdown
  }
  
  return maxDrawdown
}

function calculateSMA(prices: ValidPrice[], period: number): number | null {
  if (prices.length < period) return null
  const lastN = prices.slice(-period)
  return lastN.reduce((sum, p) => sum + p.close, 0) / period
}

function calculateRSI(prices: ValidPrice[], period: number = 14): number | null {
  if (prices.length < period + 1) return null
  
  let gains = 0
  let losses = 0
  
  for (let i = prices.length - period; i < prices.length; i++) {
    const change = prices[i].close - prices[i - 1].close
    if (change >= 0) {
      gains += change
    } else {
      losses += Math.abs(change)
    }
  }
  
  const avgGain = gains / period
  const avgLoss = losses / period
  
  if (avgLoss === 0) return 100
  
  const rs = avgGain / avgLoss
  return 100 - (100 / (1 + rs))
}

function assessTrend(prices: ValidPrice[]): string {
  if (prices.length < 20) return 'Insufficient Data'
  
  const last20 = prices.slice(-20)
  const sma20 = last20.reduce((sum, p) => sum + p.close, 0) / 20
  const lastClose = prices[prices.length - 1].close
  
  const dailyReturns = calculateDailyReturns(last20)
  const positiveDays = dailyReturns.filter(r => r > 0).length
  const negativeDays = dailyReturns.filter(r => r < 0).length
  
  const aboveSMA = lastClose > sma20
  const bullishMomentum = positiveDays > negativeDays * 1.3
  const bearishMomentum = negativeDays > positiveDays * 1.3
  
  if (aboveSMA && bullishMomentum) return 'Strong Bullish'
  if (aboveSMA) return 'Bullish'
  if (!aboveSMA && bearishMomentum) return 'Strong Bearish'
  if (!aboveSMA) return 'Bearish'
  return 'Neutral'
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

function formatDateShort(date: Date): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[date.getMonth()]} ${date.getFullYear()}`
}

function formatPercent(value: number, decimals: number = 2): string {
  if (!isFinite(value)) return '--'
  const sign = value >= 0 ? '+' : ''
  return `${sign}${(value * 100).toFixed(decimals)}%`
}

function formatNumber(value: number, decimals: number = 2): string {
  if (!isFinite(value)) return '--'
  return value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

function formatCurrency(value: number, currency: string = 'USD'): string {
  if (!isFinite(value)) return '--'
  return value.toLocaleString('en-US', { style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatVolume(value: number): string {
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`
  if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`
  return value.toString()
}

function getPricesByRange(prices: ValidPrice[], days: number): ValidPrice[] {
  if (prices.length === 0) return []
  const latestDate = prices[prices.length - 1].date
  const startDate = new Date(latestDate)
  startDate.setDate(startDate.getDate() - days)
  return prices.filter(p => p.date >= startDate)
}

function getLast30Days(prices: ValidPrice[]): ValidPrice[] {
  return getPricesByRange(prices, 30)
}

function getLast90Days(prices: ValidPrice[]): ValidPrice[] {
  return getPricesByRange(prices, 90)
}

function getLast1Year(prices: ValidPrice[]): ValidPrice[] {
  return getPricesByRange(prices, 365)
}

function getFullPeriod(prices: ValidPrice[]): ValidPrice[] {
  return prices
}

function generateSummaryDashboard(marketPrices: Record<string, AssetData>, allPrices: Map<string, ValidPrice[]>): string {
  let md = '## Summary Dashboard\n\n'
  md += '| Symbol | Name | Latest | 1Y Return | 5Y CAGR | Volatility | RSI | Trend |\n'
  md += '|--------|------|--------|-----------|---------|------------|-----|-------|\n'
  
  for (const category of CATEGORY_CONFIG) {
    for (const symbol of category.symbols) {
      const asset = marketPrices[symbol]
      const prices = allPrices.get(symbol)
      
      if (!asset || !prices || prices.length < 2) continue
      
      const last = prices[prices.length - 1]
      const first = prices[0]
      const years = (last.date.getTime() - first.date.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
      
      let cagrDisplay = '--'
      if (years >= 1) {
        const last5Y = getPricesByRange(prices, 365 * 5)
        if (last5Y.length >= 2 && last5Y.length >= 252) {
          const years5 = (last5Y[last5Y.length - 1].date.getTime() - last5Y[0].date.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
          if (years5 >= 1) {
            cagrDisplay = formatPercent(calculateCAGR(last5Y[0].close, last5Y[last5Y.length - 1].close, years5))
          }
        }
      }
      
      const last1Year = getLast1Year(prices)
      const y1Return = last1Year.length >= 2 ? calculateReturn(last1Year[0].close, last1Year[last1Year.length - 1].close) : 0
      
      const dailyReturns = calculateDailyReturns(prices)
      const volatility = calculateVolatility(dailyReturns) * Math.sqrt(252)
      
      const rsi = calculateRSI(prices)
      const trend = assessTrend(prices)
      
      md += `| ${symbol} | ${asset.name} | ${formatCurrency(last.close, asset.currency)} | ${formatPercent(y1Return)} | ${cagrDisplay} | ${formatPercent(volatility)} | ${rsi ? formatNumber(rsi, 0) : '--'} | ${trend} |\n`
    }
  }
  
  md += '\n---\n\n'
  return md
}

function generateCategorySummary(category: string, assets: AssetData[], allPrices: Map<string, ValidPrice[]>): string {
  let md = `## ${category} Overview\n\n`
  
  md += '| Symbol | Name | Latest | 1W Change | 1M Change | 1Y Change | 52W High | 52W Low |\n'
  md += '|--------|------|--------|-----------|-----------|-----------|----------|----------|\n'
  
  for (const asset of assets) {
    const prices = allPrices.get(asset.symbol)
    if (!prices || prices.length < 2) continue
    
    const last = prices[prices.length - 1]
    
    const last1W = prices.slice(-7)
    const w1Change = last1W.length >= 2 ? calculateReturn(last1W[0].close, last.close) : 0
    
    const last1M = prices.slice(-30)
    const m1Change = last1M.length >= 2 ? calculateReturn(last1M[0].close, last.close) : 0
    
    const last1Y = getLast1Year(prices)
    const y1Change = last1Y.length >= 2 ? calculateReturn(last1Y[0].close, last.close) : 0
    
    const high52W = last1Y.length > 0 ? Math.max(...last1Y.map(p => p.high)) : last.high
    const low52W = last1Y.length > 0 ? Math.min(...last1Y.map(p => p.low)) : last.low
    
    md += `| ${asset.symbol} | ${asset.name} | ${formatCurrency(last.close, asset.currency)} | ${formatPercent(w1Change)} | ${formatPercent(m1Change)} | ${formatPercent(y1Change)} | ${formatCurrency(high52W, asset.currency)} | ${formatCurrency(low52W, asset.currency)} |\n`
  }
  
  md += '\n---\n\n'
  return md
}

function generateMarkdown(data: InputJSON): string {
  const allPrices = new Map<string, ValidPrice[]>()
  
  for (const [symbol, asset] of Object.entries(data.marketPrices)) {
    allPrices.set(symbol, filterValidPrices(asset.prices))
  }
  
  let md = `# Market Prices\n\n`
  md += generateSummaryDashboard(data.marketPrices, allPrices)
  
  for (const category of CATEGORY_CONFIG) {
    const categoryAssets = category.symbols
      .map(s => data.marketPrices[s])
      .filter((a): a is AssetData => a !== undefined)
    
    if (categoryAssets.length > 0) {
      md += `# ${category.name}\n\n`
      md += generateCategorySummary(category.name, categoryAssets, allPrices)
    }
  }
  
  return md
}

function getOutputPath(inputPath: string): string {
  const inputDir = path.dirname(inputPath)
  const inputFilename = path.basename(inputPath, '.json')
  const outputDir = path.resolve(inputDir, '../../../shared/data/processed')
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }
  
  return path.join(outputDir, `${inputFilename}.md`)
}

export function createMarketPriceMD(inputPath: string): string {
  const data = parseJSON(inputPath)
  const markdown = generateMarkdown(data)
  const outputPath = getOutputPath(inputPath)
  
  fs.writeFileSync(outputPath, markdown, 'utf-8')
  
  logger.success('GENERATE', `Market Prices report saved to ${outputPath}`)
  return outputPath
}

export function createMarketPriceMDFromString(jsonString: string, outputDir?: string): string {
  const data: InputJSON = JSON.parse(jsonString)
  const markdown = generateMarkdown(data)
  
  const dir = outputDir || path.resolve(__dirname, '../../../shared/data/processed')
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  
  const reportDate = new Date().toISOString().split('T')[0]
  const outputPath = path.join(dir, `market-prices-${reportDate}.md`)
  
  fs.writeFileSync(outputPath, markdown, 'utf-8')
  
  logger.success('GENERATE', `Market Prices report saved to ${outputPath}`)
  return outputPath
}
