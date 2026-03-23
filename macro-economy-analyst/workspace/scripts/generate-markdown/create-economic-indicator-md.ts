import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { logger } from './logger'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface Observation {
  date: string
  value: string
}

interface Indicator {
  series_id: string
  series_name: string
  category: string
  units: string
  frequency: string
  observations: Observation[]
}

interface InputJSON {
  fetchedAt: string
  totalSeries: number
  indicators: Record<string, Indicator>
}

interface ValidObservation {
  date: Date
  value: number
}

interface CategoryConfig {
  name: string
  order: number
  indicators: string[]
}

const CATEGORY_CONFIG: CategoryConfig[] = [
  { name: 'Consumer Price Index (CPI)', order: 1, indicators: ['CPIAUCSL', 'CPILFESL'] },
  { name: 'Gross Domestic Product (GDP)', order: 2, indicators: ['GDP', 'GDPC1'] },
  { name: 'Employment', order: 3, indicators: ['PAYEMS', 'UNRATE'] },
  { name: 'Wages', order: 4, indicators: ['AHETPI'] },
  { name: 'Retail Sales', order: 5, indicators: ['RSXFS', 'RSAFS'] }
]

function parseJSON(filepath: string): InputJSON {
  const content = fs.readFileSync(filepath, 'utf-8')
  return JSON.parse(content)
}

function filterValidObservations(observations: Observation[]): ValidObservation[] {
  return observations
    .filter(obs => obs.value !== '.' && obs.value !== null && obs.value !== undefined)
    .map(obs => ({
      date: new Date(obs.date),
      value: parseFloat(obs.value)
    }))
    .filter(obs => !isNaN(obs.value))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
}

function calculateCAGR(startValue: number, endValue: number, years: number): number {
  if (years <= 0 || startValue <= 0 || endValue <= 0) return 0
  return Math.pow(endValue / startValue, 1 / years) - 1
}

function calculateMoM(current: number, previous: number): number {
  if (previous === 0) return 0
  return (current - previous) / Math.abs(previous)
}

function calculateYoY(current: number, sameMonthLastYear: number): number {
  if (sameMonthLastYear === 0) return 0
  return (current - sameMonthLastYear) / Math.abs(sameMonthLastYear)
}

function calculate3MMA(values: number[]): number {
  if (values.length < 3) return values.length > 0 ? values[values.length - 1] : 0
  const last3 = values.slice(-3)
  return last3.reduce((a, b) => a + b, 0) / 3
}

function calculateVolatility(momChanges: number[]): number {
  if (momChanges.length === 0) return 0
  const mean = momChanges.reduce((a, b) => a + b, 0) / momChanges.length
  const squaredDiffs = momChanges.map(change => Math.pow(change - mean, 2))
  return Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / momChanges.length)
}

function assessTrend(recentMoMs: number[]): string {
  if (recentMoMs.length < 3) return 'Insufficient Data'
  
  const positiveCount = recentMoMs.filter(m => m > 0).length
  const negativeCount = recentMoMs.filter(m => m < 0).length
  
  const last3 = recentMoMs.slice(-3)
  const first3OfLast6 = recentMoMs.slice(-6, -3)
  
  const avgLast3 = last3.reduce((a, b) => a + b, 0) / last3.length
  const avgFirst3 = first3OfLast6.length > 0 
    ? first3OfLast6.reduce((a, b) => a + b, 0) / first3OfLast6.length 
    : avgLast3
  
  const isGenerallyRising = positiveCount > negativeCount * 1.5
  const isGenerallyFalling = negativeCount > positiveCount * 1.5
  
  if (isGenerallyRising) {
    if (avgLast3 > avgFirst3 * 1.2) return 'Accelerating Rise'
    if (avgLast3 < avgFirst3 * 0.8) return 'Decelerating Rise'
    return 'Steady Rise'
  }
  
  if (isGenerallyFalling) {
    if (Math.abs(avgLast3) > Math.abs(avgFirst3) * 1.2) return 'Accelerating Fall'
    if (Math.abs(avgLast3) < Math.abs(avgFirst3) * 0.8) return 'Decelerating Fall'
    return 'Steady Fall'
  }
  
  if (Math.abs(avgLast3 - avgFirst3) < 0.001) return 'Stable'
  
  return 'Mixed'
}

function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
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

function getObservationsByDateRange(observations: ValidObservation[], startDate: Date, endDate: Date): ValidObservation[] {
  return observations.filter(obs => obs.date >= startDate && obs.date <= endDate)
}

function getLast12Months(observations: ValidObservation[]): ValidObservation[] {
  if (observations.length === 0) return []
  const latestDate = observations[observations.length - 1].date
  const startDate = new Date(latestDate)
  startDate.setMonth(startDate.getMonth() - 11)
  return getObservationsByDateRange(observations, startDate, latestDate)
}

function getLast5Years(observations: ValidObservation[]): ValidObservation[] {
  if (observations.length === 0) return []
  const latestDate = observations[observations.length - 1].date
  const startDate = new Date(latestDate)
  startDate.setFullYear(startDate.getFullYear() - 5)
  return getObservationsByDateRange(observations, startDate, latestDate)
}

function getFullPeriod(observations: ValidObservation[]): ValidObservation[] {
  return observations
}

function generateIndicatorSection(indicator: Indicator, observations: ValidObservation[]): string {
  if (observations.length < 2) return ''
  
  const first = observations[0]
  const last = observations[observations.length - 1]
  const years = (last.date.getTime() - first.date.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
  const totalChange = (last.value - first.value) / Math.abs(first.value)
  const cagr = calculateCAGR(first.value, last.value, years)
  const values = observations.map(o => o.value)
  const peak = Math.max(...values)
  const trough = Math.min(...values)
  const peakObs = observations.find(o => o.value === peak)
  const troughObs = observations.find(o => o.value === trough)
  
  let md = `## ${indicator.series_id} - ${indicator.series_name}\n\n`
  md += `- **Starting Value:** ${formatNumber(first.value)} (${formatDateShort(first.date)})\n`
  md += `- **Current Value:** ${formatNumber(last.value)} (${formatDateShort(last.date)})\n`
  md += `- **Total Change:** ${formatPercent(totalChange)}\n`
  md += `- **CAGR:** ${formatPercent(cagr)}/year\n`
  md += `- **Peak:** ${formatNumber(peak)} (${peakObs ? formatDateShort(peakObs.date) : 'N/A'})\n`
  md += `- **Trough:** ${formatNumber(trough)} (${troughObs ? formatDateShort(troughObs.date) : 'N/A'})\n\n`
  md += '---\n\n'
  
  return md
}

function generateSummaryDashboard(indicators: Record<string, Indicator>, allObservations: Map<string, ValidObservation[]>): string {
  let md = '## Summary Dashboard\n\n'
  md += '| Series | Latest | 12M YoY | 5Y CAGR | Full CAGR | Trend |\n'
  md += '|--------|--------|---------|---------|-----------|-------|\n'
  
  for (const category of CATEGORY_CONFIG) {
    for (const seriesId of category.indicators) {
      const indicator = indicators[seriesId]
      const observations = allObservations.get(seriesId)
      
      if (!indicator || !observations || observations.length < 2) continue
      
      const last = observations[observations.length - 1]
      const first = observations[0]
      const fullYears = (last.date.getTime() - first.date.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
      const fullCAGR = calculateCAGR(first.value, last.value, fullYears)
      
      const last12 = getLast12Months(observations)
      const yoy = last12.length >= 13 ? calculateYoY(last12[last12.length - 1].value, last12[0].value) : 0
      
      const last5 = getLast5Years(observations)
      const fiveYears = last5.length >= 2 ? 
        (last5[last5.length - 1].date.getTime() - last5[0].date.getTime()) / (1000 * 60 * 60 * 24 * 365.25) : 0
      const fiveCAGR = last5.length >= 2 ? calculateCAGR(last5[0].value, last5[last5.length - 1].value, fiveYears) : 0
      
      const momChanges: number[] = []
      for (let i = 1; i < last12.length; i++) {
        momChanges.push(calculateMoM(last12[i].value, last12[i - 1].value))
      }
      const trend = assessTrend(momChanges)
      
      md += `| ${seriesId} | ${formatNumber(last.value)} | ${formatPercent(yoy)} | ${formatPercent(fiveCAGR)} | ${formatPercent(fullCAGR)} | ${trend} |\n`
    }
  }
  
  md += '\n---\n\n'
  return md
}

function generateMarkdown(data: InputJSON): string {
  const allObservations = new Map<string, ValidObservation[]>()
  
  for (const [seriesId, indicator] of Object.entries(data.indicators)) {
    allObservations.set(seriesId, filterValidObservations(indicator.observations))
  }
  
  let md = `# Economic Indicators\n\n`
  md += generateSummaryDashboard(data.indicators, allObservations)
  
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

export function createEconomicIndicatorMD(inputPath: string): string {
  const data = parseJSON(inputPath)
  const markdown = generateMarkdown(data)
  const outputPath = getOutputPath(inputPath)
  
  fs.writeFileSync(outputPath, markdown, 'utf-8')
  
  logger.success('GENERATE', `Economic Indicators report saved to ${outputPath}`)
  return outputPath
}

export function createEconomicIndicatorMDFromString(jsonString: string, outputDir?: string): string {
  const data: InputJSON = JSON.parse(jsonString)
  const markdown = generateMarkdown(data)
  
  const dir = outputDir || path.resolve(__dirname, '../../../shared/data/processed')
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  
  const reportDate = new Date().toISOString().split('T')[0]
  const outputPath = path.join(dir, `economic-indicators-${reportDate}.md`)
  
  fs.writeFileSync(outputPath, markdown, 'utf-8')
  
  logger.success('GENERATE', `Economic Indicators report saved to ${outputPath}`)
  return outputPath
}
