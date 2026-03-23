import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { logger } from './logger'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface VIXObservation {
  date: string
  value: number
}

interface VIXData {
  series_id: string
  series_name: string
  source: string
  description: string
  observations: VIXObservation[]
}

interface FearGreedData {
  value: number
  classification: string
  previousClose: number
  weekAgo: number
  monthAgo: number
  yearAgo: number
  timestamp: string
}

interface AAIIHistorical {
  date: string
  bullish: number
  neutral: number
  bearish: number
}

interface AAIISentiment {
  bullish: number
  bearish: number
  neutral: number
  date: string
  historical: AAIIHistorical[]
}

interface InputJSON {
  fetchedAt: string
  volatilityIndicators: {
    vix: VIXData
  }
  sentimentIndicators: {
    fearGreedIndex: FearGreedData
    aaiiSentiment: AAIISentiment
  }
  positioningData: {
    cotReports: Record<string, unknown>
  }
  notes: Record<string, string>
}

interface ValidObservation {
  date: Date
  value: number
}

function parseJSON(filepath: string): InputJSON {
  const content = fs.readFileSync(filepath, 'utf-8')
  return JSON.parse(content)
}

function filterValidObservations(observations: VIXObservation[]): ValidObservation[] {
  return observations
    .filter(obs => obs.value !== null && obs.value !== undefined && !isNaN(obs.value))
    .map(obs => ({
      date: new Date(obs.date),
      value: obs.value
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
}

function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatDateShort(date: Date): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

function formatNumber(value: number, decimals: number = 2): string {
  if (!isFinite(value)) return '--'
  return value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

function getVIXLevel(value: number): { level: string; color: string } {
  if (value < 12) return { level: 'Complacent/Low Vol', color: 'green' }
  if (value < 20) return { level: 'Normal', color: 'yellow' }
  if (value < 30) return { level: 'Elevated', color: 'orange' }
  return { level: 'High Fear/Panic', color: 'red' }
}

function getFearGreedLevel(value: number): { level: string; signal: string } {
  if (value <= 25) return { level: 'Extreme Fear', signal: 'Potential buying opportunity' }
  if (value <= 45) return { level: 'Fear', signal: 'Bearish sentiment' }
  if (value <= 55) return { level: 'Neutral', signal: 'Balanced market' }
  if (value <= 75) return { level: 'Greed', signal: 'Bullish sentiment' }
  return { level: 'Extreme Greed', signal: 'Potential correction risk' }
}

function calculatePercentile(value: number, historical: number[]): number {
  const sorted = [...historical].sort((a, b) => a - b)
  const below = sorted.filter(v => v < value).length
  return (below / sorted.length) * 100
}

function calculateStats(values: number[]): { mean: number; median: number; std: number; min: number; max: number } {
  if (values.length === 0) return { mean: 0, median: 0, std: 0, min: 0, max: 0 }
  
  const sorted = [...values].sort((a, b) => a - b)
  const mean = values.reduce((a, b) => a + b, 0) / values.length
  const median = values.length % 2 === 0
    ? (sorted[values.length / 2 - 1] + sorted[values.length / 2]) / 2
    : sorted[Math.floor(values.length / 2)]
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length
  const std = Math.sqrt(variance)
  
  return { mean, median, std, min: sorted[0], max: sorted[sorted.length - 1] }
}

function generateVIXSection(vix: VIXData): string {
  const observations = filterValidObservations(vix.observations)
  
  if (observations.length === 0) {
    return '## VIX (Volatility Index)\n\nNo valid observations available.\n\n---\n\n'
  }
  
  const last = observations[observations.length - 1]
  const values = observations.map(o => o.value)
  const stats = calculateStats(values)
  const percentile = calculatePercentile(last.value, values)
  const level = getVIXLevel(last.value)
  
  const last30 = observations.slice(-30)
  const last90 = observations.slice(-90)
  const last252 = observations.slice(-252)
  
  const stats30 = calculateStats(last30.map(o => o.value))
  const stats90 = last90.length >= 60 ? calculateStats(last90.map(o => o.value)) : stats30
  const stats252 = last252.length >= 200 ? calculateStats(last252.map(o => o.value)) : stats90
  const hasSufficientData = observations.length >= 200
  
  let md = `## VIX - CBOE Volatility Index\n\n`
  md += `**Source:** ${vix.source} | **Series:** ${vix.series_id}\n\n`
  md += `**Description:** ${vix.description}\n\n`
  
  md += `### Current Reading\n\n`
  md += `| Metric | Value |\n`
  md += `|--------|-------|\n`
  md += `| **Latest Value** | ${formatNumber(last.value)} |\n`
  md += `| **Date** | ${formatDateShort(last.date)} |\n`
  md += `| **Level** | ${level.level} |\n`
  md += `| **Historical Percentile** | ${formatNumber(percentile, 1)}% |\n\n`
  
  md += `### Statistical Summary\n\n`
  md += `| Period | Mean | Median | Std Dev | Min | Max |\n`
  md += `|--------|------|--------|---------|-----|-----|\n`
  md += `| 30 Days | ${formatNumber(stats30.mean)} | ${formatNumber(stats30.median)} | ${formatNumber(stats30.std)} | ${formatNumber(stats30.min)} | ${formatNumber(stats30.max)} |\n`
  if (last90.length >= 60) {
    md += `| 90 Days | ${formatNumber(stats90.mean)} | ${formatNumber(stats90.median)} | ${formatNumber(stats90.std)} | ${formatNumber(stats90.min)} | ${formatNumber(stats90.max)} |\n`
  }
  if (hasSufficientData) {
    md += `| 1 Year | ${formatNumber(stats252.mean)} | ${formatNumber(stats252.median)} | ${formatNumber(stats252.std)} | ${formatNumber(stats252.min)} | ${formatNumber(stats252.max)} |\n`
    md += `| Full History | ${formatNumber(stats.mean)} | ${formatNumber(stats.median)} | ${formatNumber(stats.std)} | ${formatNumber(stats.min)} | ${formatNumber(stats.max)} |\n`
  }
  md += '\n---\n\n'
  
  return md
}

function generateFearGreedSection(fgi: FearGreedData): string {
  const level = getFearGreedLevel(fgi.value)
  const changes: { period: string; value: number; change: number }[] = [
    { period: 'Previous Close', value: fgi.previousClose, change: fgi.value - fgi.previousClose },
    { period: 'Week Ago', value: fgi.weekAgo, change: fgi.value - fgi.weekAgo },
    { period: 'Month Ago', value: fgi.monthAgo, change: fgi.value - fgi.monthAgo },
    { period: 'Year Ago', value: fgi.yearAgo, change: fgi.value - fgi.yearAgo }
  ]
  
  let md = `## Fear & Greed Index\n\n`
  md += `**Timestamp:** ${fgi.timestamp}\n\n`
  
  md += `### Current Reading\n\n`
  md += `| Metric | Value |\n`
  md += `|--------|-------|\n`
  md += `| **Score** | ${fgi.value} / 100 |\n`
  md += `| **Classification** | ${level.level} |\n`
  md += `| **Signal** | ${level.signal} |\n\n`
  
  md += `### Historical Comparison\n\n`
  md += `| Period | Value | Change |\n`
  md += `|--------|-------|--------|\n`
  for (const c of changes) {
    const changeStr = c.change >= 0 ? `+${c.change}` : `${c.change}`
    md += `| ${c.period} | ${c.value} | ${changeStr} |\n`
  }
  md += '\n---\n\n'
  
  return md
}

function generateAAIISection(aaii: AAIISentiment): string {
  const historical = aaii.historical || []
  
  const bullSpread = aaii.bullish - aaii.bearish
  
  const historicalSpreads = historical.map(h => h.bullish - h.bearish)
  const stats = calculateStats(historicalSpreads)
  
  const bullishValues = historical.map(h => h.bullish)
  const bearishValues = historical.map(h => h.bearish)
  const bullishStats = calculateStats(bullishValues)
  const bearishStats = calculateStats(bearishValues)
  
  const spreadPercentile = historicalSpreads.length > 0 
    ? calculatePercentile(bullSpread, historicalSpreads)
    : 50
  
  let md = `## AAII Sentiment Survey\n\n`
  md += `**Latest Survey Date:** ${aaii.date}\n\n`
  
  md += `### Current Sentiment\n\n`
  md += `| Sentiment | Percentage |\n`
  md += `|-----------|------------|\n`
  md += `| **Bullish** | ${aaii.bullish}% |\n`
  md += `| **Neutral** | ${aaii.neutral}% |\n`
  md += `| **Bearish** | ${aaii.bearish}% |\n`
  md += `| **Bull-Bear Spread** | ${bullSpread >= 0 ? '+' : ''}${bullSpread} |\n`
  md += `| **Spread Percentile** | ${formatNumber(spreadPercentile, 1)}% |\n\n`
  
  if (historical.length > 0) {
    md += `### Historical Statistics (Available Data)\n\n`
    md += `| Metric | Bullish | Bearish | Spread |\n`
    md += `|--------|---------|---------|--------|\n`
    md += `| Mean | ${formatNumber(bullishStats.mean, 1)}% | ${formatNumber(bearishStats.mean, 1)}% | ${formatNumber(stats.mean, 1)} |\n`
    md += `| Median | ${formatNumber(bullishStats.median, 1)}% | ${formatNumber(bearishStats.median, 1)}% | ${formatNumber(stats.median, 1)} |\n`
    md += `| Std Dev | ${formatNumber(bullishStats.std, 1)}% | ${formatNumber(bearishStats.std, 1)}% | ${formatNumber(stats.std, 1)} |\n`
    md += `| Min | ${formatNumber(bullishStats.min, 1)}% | ${formatNumber(bearishStats.min, 1)}% | ${formatNumber(stats.min, 1)} |\n`
    md += `| Max | ${formatNumber(bullishStats.max, 1)}% | ${formatNumber(bearishStats.max, 1)}% | ${formatNumber(stats.max, 1)} |\n\n`
    
    md += `### Recent Survey Results\n\n`
    md += `| Date | Bullish | Neutral | Bearish | Spread |\n`
    md += `|------|---------|---------|---------|--------|\n`
    
    for (const h of historical.slice(0, 12)) {
      const spread = h.bullish - h.bearish
      const spreadStr = spread >= 0 ? `+${spread.toFixed(1)}` : spread.toFixed(1)
      md += `| ${h.date} | ${h.bullish}% | ${h.neutral}% | ${h.bearish}% | ${spreadStr} |\n`
    }
    md += '\n---\n\n'
  }
  
  return md
}

function generateSummarySection(data: InputJSON): string {
  const vixObs = filterValidObservations(data.volatilityIndicators.vix.observations)
  const latestVIX = vixObs.length > 0 ? vixObs[vixObs.length - 1].value : null
  const vixLevel = latestVIX !== null ? getVIXLevel(latestVIX) : null
  
  const fgi = data.sentimentIndicators.fearGreedIndex
  const fgiLevel = getFearGreedLevel(fgi.value)
  
  const aaii = data.sentimentIndicators.aaiiSentiment
  const aaiiSpread = aaii.bullish - aaii.bearish
  
  let md = `## Sentiment & Positioning Summary\n\n`
  
  md += `| Indicator | Current Value | Level | Interpretation |\n`
  md += `|-----------|---------------|-------|----------------|\n`
  md += `| VIX | ${latestVIX !== null ? formatNumber(latestVIX) : '--'} | ${vixLevel?.level || '--'} | Volatility expectations |\n`
  md += `| Fear & Greed | ${fgi.value} | ${fgiLevel.level} | ${fgiLevel.signal} |\n`
  md += `| AAII Bullish | ${aaii.bullish}% | -- | Retail sentiment |\n`
  md += `| AAII Spread | ${aaiiSpread >= 0 ? '+' : ''}${aaiiSpread} | -- | Bull-Bear difference |\n\n`
  
  md += `### Overall Market Sentiment\n\n`
  
  const sentimentScore = 
    (latestVIX !== null && latestVIX < 20 ? 1 : latestVIX !== null && latestVIX < 30 ? 0 : -1) +
    (fgi.value > 50 ? 1 : fgi.value < 50 ? -1 : 0) +
    (aaiiSpread > 0 ? 1 : aaiiSpread < -20 ? -1 : 0)
  
  let overallSentiment = 'Neutral'
  if (sentimentScore >= 2) overallSentiment = 'Bullish'
  else if (sentimentScore <= -2) overallSentiment = 'Bearish'
  else if (sentimentScore === 1) overallSentiment = 'Slightly Bullish'
  else if (sentimentScore === -1) overallSentiment = 'Slightly Bearish'
  
  md += `**Aggregate Assessment:** ${overallSentiment}\n\n`
  md += `**Score:** ${sentimentScore} (range: -3 to +3)\n\n`
  md += `---\n\n`
  
  return md
}

function generateMarkdown(data: InputJSON): string {
  let md = `# Sentiment & Positioning\n\n`
  
  md += generateSummarySection(data)
  md += generateVIXSection(data.volatilityIndicators.vix)
  md += generateFearGreedSection(data.sentimentIndicators.fearGreedIndex)
  md += generateAAIISection(data.sentimentIndicators.aaiiSentiment)
  
  if (Object.keys(data.positioningData.cotReports).length > 0) {
    md += `## COT Reports\n\n`
    md += `COT positioning data available.\n\n---\n\n`
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

export function createSentimentPositioningMD(inputPath: string): string {
  const data = parseJSON(inputPath)
  const markdown = generateMarkdown(data)
  const outputPath = getOutputPath(inputPath)
  
  fs.writeFileSync(outputPath, markdown, 'utf-8')
  
  logger.success('GENERATE', `Sentiment & Positioning report saved to ${outputPath}`)
  return outputPath
}

export function createSentimentPositioningMDFromString(jsonString: string, outputDir?: string): string {
  const data: InputJSON = JSON.parse(jsonString)
  const markdown = generateMarkdown(data)
  
  const dir = outputDir || path.resolve(__dirname, '../../../shared/data/processed')
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  
  const reportDate = new Date().toISOString().split('T')[0]
  const outputPath = path.join(dir, `sentiment-positioning-${reportDate}.md`)
  
  fs.writeFileSync(outputPath, markdown, 'utf-8')
  
  logger.success('GENERATE', `Sentiment & Positioning report saved to ${outputPath}`)
  return outputPath
}
