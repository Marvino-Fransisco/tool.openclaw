import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

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

function generateLayer1(indicator: Indicator, observations: ValidObservation[]): string {
  if (observations.length < 2) return '### Layer 1: 30-Year Structural View\n\nInsufficient data for long-term analysis.\n'
  
  const first = observations[0]
  const last = observations[observations.length - 1]
  const years = (last.date.getTime() - first.date.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
  const totalChange = (last.value - first.value) / Math.abs(first.value)
  const cagr = calculateCAGR(first.value, last.value, years)
  
  const decades: { period: string; start: number; end: number; change: number; cagr: number }[] = []
  
  const periodStart = new Date(first.date)
  let periodEnd = new Date(periodStart)
  periodEnd.setFullYear(periodEnd.getFullYear() + 10)
  
  while (periodStart < last.date) {
    const periodObs = observations.filter(obs => 
      obs.date >= periodStart && obs.date <= periodEnd && obs.date <= last.date
    )
    
    if (periodObs.length >= 2) {
      const pStart = periodObs[0]
      const pEnd = periodObs[periodObs.length - 1]
      const pYears = (pEnd.date.getTime() - pStart.date.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
      
      decades.push({
        period: `${pStart.date.getFullYear()}-${pEnd.date.getFullYear()}`,
        start: pStart.value,
        end: pEnd.value,
        change: (pEnd.value - pStart.value) / Math.abs(pStart.value),
        cagr: calculateCAGR(pStart.value, pEnd.value, pYears)
      })
    }
    
    periodStart.setFullYear(periodStart.getFullYear() + 10)
    periodEnd.setFullYear(periodEnd.getFullYear() + 10)
  }
  
  let md = `### Layer 1: ${Math.round(years)}-Year Structural View (${first.date.getFullYear()}-${last.date.getFullYear()})\n\n`
  md += `- **Starting Value:** ${formatNumber(first.value)} (${formatDateShort(first.date)})\n`
  md += `- **Current Value:** ${formatNumber(last.value)} (${formatDateShort(last.date)})\n`
  md += `- **Total Change:** ${formatPercent(totalChange)}\n`
  md += `- **CAGR:** ${formatPercent(cagr)}/year\n\n`
  
  if (decades.length > 0) {
    md += '| Period | Start | End | Total Change | CAGR |\n'
    md += '|--------|-------|-----|--------------|------|\n'
    for (const d of decades) {
      md += `| ${d.period} | ${formatNumber(d.start)} | ${formatNumber(d.end)} | ${formatPercent(d.change)} | ${formatPercent(d.cagr)}/yr |\n`
    }
    md += '\n'
  }
  
  return md
}

function generateLayer2(indicator: Indicator, observations: ValidObservation[]): string {
  if (observations.length < 2) return '### Layer 2: 5-Year Cyclical View\n\nInsufficient data for 5-year analysis.\n'
  
  const first = observations[0]
  const last = observations[observations.length - 1]
  const years = (last.date.getTime() - first.date.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
  const totalChange = (last.value - first.value) / Math.abs(first.value)
  const avgAnnualRate = years > 0 ? totalChange / years : 0
  
  const momChanges: number[] = []
  for (let i = 1; i < observations.length; i++) {
    momChanges.push(calculateMoM(observations[i].value, observations[i - 1].value))
  }
  const volatility = calculateVolatility(momChanges)
  
  const values = observations.map(o => o.value)
  const peak = Math.max(...values)
  const trough = Math.min(...values)
  const peakObs = observations.find(o => o.value === peak)
  const troughObs = observations.find(o => o.value === trough)
  
  const yearlyData: { year: number; avg: number; yoy: number }[] = []
  const yearMap = new Map<number, number[]>()
  
  for (const obs of observations) {
    const year = obs.date.getFullYear()
    if (!yearMap.has(year)) yearMap.set(year, [])
    yearMap.get(year)!.push(obs.value)
  }
  
  const sortedYears = Array.from(yearMap.keys()).sort()
  let prevAvg: number | null = null
  
  for (const year of sortedYears) {
    const values = yearMap.get(year)!
    const avg = values.reduce((a, b) => a + b, 0) / values.length
    const yoy = prevAvg !== null ? (avg - prevAvg) / Math.abs(prevAvg) : 0
    yearlyData.push({ year, avg, yoy })
    prevAvg = avg
  }
  
  let md = `### Layer 2: 5-Year Cyclical View (${first.date.getFullYear()}-${last.date.getFullYear()})\n\n`
  md += `- **Starting Value:** ${formatNumber(first.value)} (${formatDateShort(first.date)})\n`
  md += `- **Current Value:** ${formatNumber(last.value)} (${formatDateShort(last.date)})\n`
  md += `- **Total Change:** ${formatPercent(totalChange)}\n`
  md += `- **Average Annual Rate:** ${formatPercent(avgAnnualRate)}/year\n`
  md += `- **Volatility (σ):** ${formatPercent(volatility)}\n`
  md += `- **Peak:** ${formatNumber(peak)} (${peakObs ? formatDateShort(peakObs.date) : 'N/A'})\n`
  md += `- **Trough:** ${formatNumber(trough)} (${troughObs ? formatDateShort(troughObs.date) : 'N/A'})\n\n`
  
  if (yearlyData.length > 0) {
    md += '| Year | Average Value | YoY Change |\n'
    md += '|------|---------------|------------|\n'
    for (const y of yearlyData) {
      const yoyStr = y.yoy === 0 ? '--' : formatPercent(y.yoy)
      md += `| ${y.year} | ${formatNumber(y.avg)} | ${yoyStr} |\n`
    }
    md += '\n'
  }
  
  return md
}

function generateLayer3(indicator: Indicator, observations: ValidObservation[]): string {
  if (observations.length < 2) return '### Layer 3: 12-Month Current View\n\nInsufficient data for 12-month analysis.\n'
  
  const momChanges: number[] = []
  const tableData: { date: Date; value: number; mom: number; ma3: number; yoy: number }[] = []
  
  for (let i = 0; i < observations.length; i++) {
    const current = observations[i]
    const mom = i > 0 ? calculateMoM(current.value, observations[i - 1].value) : 0
    
    const yearAgoObs = observations.find(obs => 
      obs.date.getMonth() === current.date.getMonth() &&
      obs.date.getFullYear() === current.date.getFullYear() - 1
    )
    const yoy = yearAgoObs ? calculateYoY(current.value, yearAgoObs.value) : 0
    
    const valuesUpToNow = observations.slice(0, i + 1).map(o => o.value)
    const ma3 = calculate3MMA(valuesUpToNow)
    
    tableData.push({
      date: current.date,
      value: current.value,
      mom,
      ma3,
      yoy
    })
    
    if (mom !== 0) momChanges.push(mom)
  }
  
  const trend = assessTrend(momChanges)
  
  let md = `### Layer 3: 12-Month Current View (${formatDateShort(observations[0].date)} - ${formatDateShort(observations[observations.length - 1].date)})\n\n`
  md += `**Trend Assessment:** ${trend}\n\n`
  md += '| Date | Value | MoM | 3M MA | YoY |\n'
  md += '|------|-------|-----|-------|-----|\n'
  
  for (const row of tableData) {
    md += `| ${formatDateShort(row.date)} | ${formatNumber(row.value)} | ${formatPercent(row.mom)} | ${formatNumber(row.ma3)} | ${formatPercent(row.yoy)} |\n`
  }
  md += '\n'
  
  return md
}

function generateIndicatorSection(indicator: Indicator, observations: ValidObservation[]): string {
  const fullPeriod = getFullPeriod(observations)
  const last5Years = getLast5Years(observations)
  const last12Months = getLast12Months(observations)
  
  let md = `## ${indicator.series_id} - ${indicator.series_name}\n\n`
  md += `**Category:** ${indicator.category} | **Frequency:** ${indicator.frequency}\n\n`
  
  md += generateLayer1(indicator, fullPeriod)
  md += '---\n\n'
  md += generateLayer2(indicator, last5Years.length >= 2 ? last5Years : fullPeriod)
  md += '---\n\n'
  md += generateLayer3(indicator, last12Months.length >= 2 ? last12Months : observations.slice(-12))
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

function findMissingData(indicators: Record<string, Indicator>): string[] {
  const missing: string[] = []
  
  for (const [seriesId, indicator] of Object.entries(indicators)) {
    for (const obs of indicator.observations) {
      if (obs.value === '.' || obs.value === null || obs.value === undefined) {
        missing.push(`${seriesId}: ${obs.date}`)
      }
    }
  }
  
  return missing
}

function generateMarkdown(data: InputJSON): string {
  const allObservations = new Map<string, ValidObservation[]>()
  
  for (const [seriesId, indicator] of Object.entries(data.indicators)) {
    allObservations.set(seriesId, filterValidObservations(indicator.observations))
  }
  
  const latestDate = Array.from(allObservations.values())
    .flatMap(obs => obs.map(o => o.date))
    .sort((a, b) => b.getTime() - a.getTime())[0]
  
  const earliestDate = Array.from(allObservations.values())
    .flatMap(obs => obs.map(o => o.date))
    .sort((a, b) => a.getTime() - b.getTime())[0]
  
  const dataYears = (latestDate.getTime() - earliestDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
  
  let md = `# Economic Indicators Report\n\n`
  md += `**Report Date:** ${new Date().toISOString().split('T')[0]}\n`
  md += `**Data Fetched At:** ${data.fetchedAt}\n`
  md += `**Data Coverage:** ${earliestDate.getFullYear()} - ${latestDate.getFullYear()} (${Math.round(dataYears)} years)\n`
  md += `**Indicators:** ${data.totalSeries} series\n\n`
  md += '---\n\n'
  
  md += generateSummaryDashboard(data.indicators, allObservations)
  
  for (const category of CATEGORY_CONFIG) {
    md += `# ${category.name}\n\n`
    
    for (const seriesId of category.indicators) {
      const indicator = data.indicators[seriesId]
      const observations = allObservations.get(seriesId)
      
      if (indicator && observations && observations.length > 0) {
        md += generateIndicatorSection(indicator, observations)
      }
    }
  }
  
  const missingData = findMissingData(data.indicators)
  if (missingData.length > 0) {
    md += '# Data Notes\n\n'
    md += '## Missing Data\n\n'
    md += 'The following periods have missing or unavailable data:\n\n'
    for (const m of missingData) {
      md += `- ${m}\n`
    }
    md += '\n'
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

export function createEconomicIndicatorMD(inputPath: string): string {
  const data = parseJSON(inputPath)
  const markdown = generateMarkdown(data)
  const outputPath = getOutputPath(inputPath)
  
  fs.writeFileSync(outputPath, markdown, 'utf-8')
  
  console.log(`Markdown report generated: ${outputPath}`)
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
  
  console.log(`Markdown report generated: ${outputPath}`)
  return outputPath
}

const args = process.argv.slice(2)

if (args.length === 0) {
  const defaultPath = path.join(__dirname, 'economic-indicators-2026-03-23.json')
  if (fs.existsSync(defaultPath)) {
    createEconomicIndicatorMD(defaultPath)
  } else {
    console.error('Usage: npx tsx create-economic-indicator-md.ts <input-json-path>')
    console.error('       or ensure economic-indicators-YYYY-MM-DD.json exists in the same directory')
    process.exit(1)
  }
} else {
  createEconomicIndicatorMD(args[0])
}
