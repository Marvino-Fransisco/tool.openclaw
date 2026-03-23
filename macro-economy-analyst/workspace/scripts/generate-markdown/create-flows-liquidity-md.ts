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

interface FlowIndicator {
  series_id: string
  series_name: string
  category: string
  subCategory: string
  units: string
  frequency: string
  observations: Observation[]
}

interface ValidObservation {
  date: Date
  value: number
}

interface CategoryConfig {
  name: string
  order: number
  subCategories: string[]
}

const CATEGORY_CONFIG: CategoryConfig[] = [
  { name: 'Fed Balance Sheet', order: 1, subCategories: ['TotalAssets', 'Securities', 'Treasuries', 'MBS'] },
  { name: 'Liquidity Operations', order: 2, subCategories: ['MonetaryBase', 'AdjustedBase', 'M2', 'M1', 'ExcessReserves'] },
  { name: 'Treasury Operations', order: 3, subCategories: ['Balance', 'FedBalance', 'Overnight'] },
  { name: 'Bank Lending', order: 4, subCategories: ['Deposits', 'TotalLoans', 'CommercialLoans', 'RealEstate', 'ConsumerCredit', 'Delinquencies'] },
  { name: 'Capital Flows', order: 5, subCategories: ['NetInvestment', 'MutualFunds', 'MutualFundsAnnual'] }
]

function parseJSON(filepath: string): { fetchedAt: string; totalSeries: number; flowsLiquidity: Record<string, FlowIndicator> } {
  const content = fs.readFileSync(filepath, 'utf-8')
  return JSON.parse(content)
}

function filterValidObservations(observations: Observation[]): ValidObservation[] {
  return observations
    .filter(obs => obs.value !== '.' && obs.value !== null && obs.value !== undefined && obs.value !== '')
    .map(obs => ({
      date: new Date(obs.date),
      value: parseFloat(obs.value)
    }))
    .filter(obs => !isNaN(obs.value) && !isNaN(obs.date.getTime()))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
}

function calculateCAGR(startValue: number, endValue: number, years: number): number {
  if (years <= 0 || startValue <= 0 || endValue <= 0) return 0
  return Math.pow(endValue / startValue, 1 / years) - 1
}

function calculateWoW(current: number, previous: number): number {
  if (previous === 0) return 0
  return (current - previous) / Math.abs(previous)
}

function calculateYoY(current: number, samePeriodLastYear: number): number {
  if (samePeriodLastYear === 0) return 0
  return (current - samePeriodLastYear) / Math.abs(samePeriodLastYear)
}

function calculate4WMA(values: number[]): number {
  if (values.length < 4) return values.length > 0 ? values[values.length - 1] : 0
  const last4 = values.slice(-4)
  return last4.reduce((a, b) => a + b, 0) / 4
}

function calculateVolatility(changes: number[]): number {
  if (changes.length === 0) return 0
  const mean = changes.reduce((a, b) => a + b, 0) / changes.length
  const squaredDiffs = changes.map(change => Math.pow(change - mean, 2))
  return Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / changes.length)
}

function assessTrend(recentChanges: number[]): string {
  if (recentChanges.length < 3) return 'Insufficient Data'
  
  const positiveCount = recentChanges.filter(m => m > 0).length
  const negativeCount = recentChanges.filter(m => m < 0).length
  
  const last3 = recentChanges.slice(-3)
  const first3OfLast6 = recentChanges.slice(-6, -3)
  
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
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
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

function formatLargeNumber(value: number): string {
  if (!isFinite(value)) return '--'
  if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T`
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`
  if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`
  return value.toFixed(2)
}

function getObservationsByDateRange(observations: ValidObservation[], startDate: Date, endDate: Date): ValidObservation[] {
  return observations.filter(obs => obs.date >= startDate && obs.date <= endDate)
}

function getLast13Weeks(observations: ValidObservation[]): ValidObservation[] {
  if (observations.length === 0) return []
  const latestDate = observations[observations.length - 1].date
  const startDate = new Date(latestDate)
  startDate.setDate(startDate.getDate() - 91)
  return getObservationsByDateRange(observations, startDate, latestDate)
}

function getLast52Weeks(observations: ValidObservation[]): ValidObservation[] {
  if (observations.length === 0) return []
  const latestDate = observations[observations.length - 1].date
  const startDate = new Date(latestDate)
  startDate.setFullYear(startDate.getFullYear() - 1)
  return getObservationsByDateRange(observations, startDate, latestDate)
}

function getFullPeriod(observations: ValidObservation[]): ValidObservation[] {
  return observations
}

function generateIndicatorSection(indicator: FlowIndicator, observations: ValidObservation[]): string {
  if (observations.length < 2) return ''
  
  const first = observations[0]
  const last = observations[observations.length - 1]
  const years = (last.date.getTime() - first.date.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
  const totalChange = (last.value - first.value) / Math.abs(first.value)
  const cagr = years >= 1 ? calculateCAGR(first.value, last.value, years) : null
  
  let md = `## ${indicator.series_id} - ${indicator.series_name}\n\n`
  md += `| Metric | Value |\n`
  md += `|--------|-------|\n`
  md += `| Current Value | ${formatLargeNumber(last.value)} (${formatDateShort(last.date)}) |\n`
  md += `| Total Change | ${formatPercent(totalChange)} |\n`
  if (cagr !== null) {
    md += `| CAGR | ${formatPercent(cagr)}/year |\n`
  }
  md += '\n---\n\n'
  
  return md
}

function generateSummaryDashboard(indicators: Record<string, FlowIndicator>, allObservations: Map<string, ValidObservation[]>): string {
  let md = '## Summary Dashboard\n\n'
  md += '| Series | Latest | 13W YoY | 52W Change | Trend |\n'
  md += '|--------|--------|---------|------------|-------|\n'
  
  for (const category of CATEGORY_CONFIG) {
    for (const [seriesId, indicator] of Object.entries(indicators)) {
      if (!category.subCategories.includes(indicator.subCategory)) continue
       
      const observations = allObservations.get(seriesId)
       
      if (!observations || observations.length < 2) continue
       
      const last = observations[observations.length - 1]
       
      const last13 = getLast13Weeks(observations)
      const yoy = last13.length >= 2 ? calculateYoY(last13[last13.length - 1].value, last13[0].value) : 0
       
      const last52 = getLast52Weeks(observations)
      const change52 = last52.length >= 2 ? 
        (last52[last52.length - 1].value - last52[0].value) / Math.abs(last52[0].value) : 0
       
      const wowChanges: number[] = []
      for (let i = 1; i < last13.length; i++) {
        wowChanges.push(calculateWoW(last13[i].value, last13[i - 1].value))
      }
      const trend = assessTrend(wowChanges)
       
      md += `| ${seriesId} | ${formatLargeNumber(last.value)} | ${formatPercent(yoy)} | ${formatPercent(change52)} | ${trend} |\n`
    }
  }
  
  md += '\n---\n\n'
  return md
}

function generateCategorySection(
  categoryName: string, 
  subCategories: string[], 
  indicators: Record<string, FlowIndicator>, 
  allObservations: Map<string, ValidObservation[]>
): string {
  let md = `# ${categoryName}\n\n`
  
  for (const subCat of subCategories) {
    for (const [seriesId, indicator] of Object.entries(indicators)) {
      if (indicator.subCategory !== subCat) continue
      
      const observations = allObservations.get(seriesId)
      if (observations && observations.length > 0) {
        md += generateIndicatorSection(indicator, observations)
      }
    }
  }
  
  return md
}

function generateMarkdown(data: { fetchedAt: string; totalSeries: number; flowsLiquidity: Record<string, FlowIndicator> }): string {
  const allObservations = new Map<string, ValidObservation[]>()
  
  for (const [seriesId, indicator] of Object.entries(data.flowsLiquidity)) {
    allObservations.set(seriesId, filterValidObservations(indicator.observations))
  }
  
  let md = `# Flows & Liquidity Report\n\n`
  md += `**Report Date:** ${new Date().toISOString().split('T')[0]}\n`
  md += `**Data Fetched At:** ${data.fetchedAt}\n\n`
  md += '---\n\n'
  
  md += generateSummaryDashboard(data.flowsLiquidity, allObservations)
  
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

export function createFlowsLiquidityMD(inputPath: string): string {
  const data = parseJSON(inputPath)
  const markdown = generateMarkdown(data)
  const outputPath = getOutputPath(inputPath)
  
  fs.writeFileSync(outputPath, markdown, 'utf-8')
  
  logger.success('GENERATE', `Flows & Liquidity report saved to ${outputPath}`)
  return outputPath
}

export function createFlowsLiquidityMDFromString(jsonString: string, outputDir?: string): string {
  const data = parseJSONFromString(jsonString)
  const markdown = generateMarkdown(data)
  
  const dir = outputDir || path.resolve(__dirname, '../../../shared/data/processed')
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  
  const reportDate = new Date().toISOString().split('T')[0]
  const outputPath = path.join(dir, `flows-liquidity-${reportDate}.md`)
  
  fs.writeFileSync(outputPath, markdown, 'utf-8')
  
  logger.success('GENERATE', `Flows & Liquidity report saved to ${outputPath}`)
  return outputPath
}

function parseJSONFromString(jsonString: string): { fetchedAt: string; totalSeries: number; flowsLiquidity: Record<string, FlowIndicator> } {
  return JSON.parse(jsonString)
}
