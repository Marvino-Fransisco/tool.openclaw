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

interface CalculatedSpread {
  name: string
  description: string
  observations: Observation[]
}

interface FixedIncomeData {
  governmentBonds: Record<string, Indicator>
  yieldCurve: Record<string, Indicator>
  creditSpreads: Record<string, Indicator>
  calculatedSpreads: CalculatedSpread[]
}

interface InputJSON {
  fetchedAt: string
  totalSeries: number
  fixedIncome: FixedIncomeData
}

interface ValidObservation {
  date: Date
  value: number
}

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

function calculateBasisPoints(current: number, previous: number): number {
  return (current - previous) * 100
}

function calculateDailyChange(values: number[]): number[] {
  const changes: number[] = []
  for (let i = 1; i < values.length; i++) {
    changes.push(values[i] - values[i - 1])
  }
  return changes
}

function assessTrend(recentChanges: number[], threshold: number = 0.05): string {
  if (recentChanges.length < 5) return 'Insufficient Data'
  
  const last5 = recentChanges.slice(-5)
  const last10 = recentChanges.slice(-10)
  
  const avg5 = last5.reduce((a, b) => a + b, 0) / last5.length
  const avg10 = last10.length >= 10 ? last10.reduce((a, b) => a + b, 0) / last10.length : avg5
  
  const positive5 = last5.filter(c => c > 0).length
  const negative5 = last5.filter(c => c < 0).length
  
  if (Math.abs(avg5) < threshold && Math.abs(avg10) < threshold) {
    return 'Range-Bound'
  }
  
  if (positive5 > negative5 * 1.5) {
    if (avg5 > avg10 * 1.2) return 'Strong Rising'
    return 'Rising'
  }
  
  if (negative5 > positive5 * 1.5) {
    if (Math.abs(avg5) > Math.abs(avg10) * 1.2) return 'Strong Falling'
    return 'Falling'
  }
  
  return 'Mixed'
}

function formatDateShort(date: Date): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

function formatYield(value: number, decimals: number = 2): string {
  if (!isFinite(value)) return '--'
  return value.toFixed(decimals) + '%'
}

function formatBps(value: number): string {
  if (!isFinite(value)) return '--'
  const sign = value >= 0 ? '+' : ''
  return `${sign}${(value * 100).toFixed(1)}bps`
}

function getLast5Years(observations: ValidObservation[]): ValidObservation[] {
  if (observations.length === 0) return []
  const latestDate = observations[observations.length - 1].date
  const startDate = new Date(latestDate)
  startDate.setFullYear(startDate.getFullYear() - 5)
  return observations.filter(obs => obs.date >= startDate && obs.date <= latestDate)
}

function generateYieldCurveSection(data: FixedIncomeData): string {
  const govBonds = data.governmentBonds
  const curvePoints = ['DGS3MO', 'DGS6MO', 'DGS1', 'DGS2', 'DGS5', 'DGS7', 'DGS10', 'DGS20', 'DGS30']
  
  const latestValues: { tenor: string; value: number; date: Date }[] = []
  const prevMonthValues: { tenor: string; value: number }[] = []
  
  for (const tenor of curvePoints) {
    const indicator = govBonds[tenor]
    if (indicator) {
      const obs = filterValidObservations(indicator.observations)
      if (obs.length > 0) {
        latestValues.push({
          tenor: tenor.replace('DGS', ''),
          value: obs[obs.length - 1].value,
          date: obs[obs.length - 1].date
        })
        if (obs.length >= 22) {
          prevMonthValues.push({
            tenor: tenor.replace('DGS', ''),
            value: obs[obs.length - 22].value
          })
        }
      }
    }
  }
  
  if (latestValues.length === 0) return ''
  
  let md = '## Current Yield Curve Snapshot\n\n'
  
  const latestDate = latestValues[0].date
  md += `**As of:** ${formatDateShort(latestDate)}\n\n`
  
  md += '| Tenor | Current | 1M Ago | 1M Chg |\n'
  md += '|-------|---------|--------|--------|\n'
  
  for (let i = 0; i < latestValues.length; i++) {
    const curr = latestValues[i]
    const prev = prevMonthValues.find(p => p.tenor === curr.tenor)
    const chg = prev ? formatBps(curr.value - prev.value) : '--'
    md += `| ${curr.tenor} | ${formatYield(curr.value)} | ${prev ? formatYield(prev.value) : '--'} | ${chg} |\n`
  }
  md += '\n'
  
  if (latestValues.length >= 2) {
    const twoY = latestValues.find(v => v.tenor === '2')
    const tenY = latestValues.find(v => v.tenor === '10')
    const threeM = latestValues.find(v => v.tenor === '3MO')
    
    md += '### Key Curve Metrics\n\n'
    if (twoY && tenY) {
      md += `- **2Y-10Y Spread:** ${formatYield(tenY.value - twoY.value)}\n`
    }
    if (threeM && tenY) {
      md += `- **3M-10Y Spread:** ${formatYield(tenY.value - threeM.value)}\n`
    }
    if (threeM && twoY) {
      md += `- **3M-2Y Spread:** ${formatYield(twoY.value - threeM.value)}\n`
    }
    md += '\n---\n\n'
  }
  
  return md
}

function generateSummaryDashboard(data: FixedIncomeData, allObservations: Map<string, ValidObservation[]>): string {
  let md = '## Summary Dashboard\n\n'
  md += '| Series | Latest | 1M Chg | 1Y Chg | 5Y Avg | Trend |\n'
  md += '|--------|--------|--------|--------|--------|-------|\n'
  
  const seriesToShow = [
    { id: 'DGS2', name: '2Y Treasury' },
    { id: 'DGS10', name: '10Y Treasury' },
    { id: 'DGS30', name: '30Y Treasury' },
    { id: 'T10Y2Y', name: '2Y10Y Spread' },
    { id: 'T10Y3M', name: '3M10Y Spread' },
    { id: 'BAMLC0A0CM', name: 'IG OAS' },
    { id: 'BAMLH0A0HYM2', name: 'HY OAS' }
  ]
  
  for (const series of seriesToShow) {
    const obs = allObservations.get(series.id)
    if (!obs || obs.length < 2) continue
    
    const last = obs[obs.length - 1]
    const oneMonthAgo = obs.length >= 22 ? obs[obs.length - 22] : obs[0]
    const oneYearAgo = obs.length >= 252 ? obs[obs.length - 252] : obs[0]
    
    const last5Years = getLast5Years(obs)
    const avg5Y = last5Years.length > 0 
      ? last5Years.map(o => o.value).reduce((a, b) => a + b, 0) / last5Years.length 
      : last.value
    
    const dailyChanges = calculateDailyChange(obs.slice(-30).map(o => o.value))
    const trend = assessTrend(dailyChanges)
    
    const oneMChg = formatBps(last.value - oneMonthAgo.value)
    const oneYChg = formatBps(last.value - oneYearAgo.value)
    
    md += `| ${series.name} | ${formatYield(last.value)} | ${oneMChg} | ${oneYChg} | ${formatYield(avg5Y)} | ${trend} |\n`
  }
  
  md += '\n---\n\n'
  return md
}

function generateMarkdown(input: InputJSON): string {
  const allObservations = new Map<string, ValidObservation[]>()
  
  for (const [seriesId, indicator] of Object.entries(input.fixedIncome.governmentBonds)) {
    allObservations.set(seriesId, filterValidObservations(indicator.observations))
  }
  for (const [seriesId, indicator] of Object.entries(input.fixedIncome.yieldCurve)) {
    allObservations.set(seriesId, filterValidObservations(indicator.observations))
  }
  for (const [seriesId, indicator] of Object.entries(input.fixedIncome.creditSpreads)) {
    allObservations.set(seriesId, filterValidObservations(indicator.observations))
  }
  
  let md = `# Fixed Income\n\n`
  md += generateSummaryDashboard(input.fixedIncome, allObservations)
  md += generateYieldCurveSection(input.fixedIncome)
  
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

export function createFixedIncomeMD(inputPath: string): string {
  const data = parseJSON(inputPath)
  const markdown = generateMarkdown(data)
  const outputPath = getOutputPath(inputPath)
  
  fs.writeFileSync(outputPath, markdown, 'utf-8')
  
  logger.success('GENERATE', `Fixed Income report saved to ${outputPath}`)
  return outputPath
}

export function createFixedIncomeMDFromString(jsonString: string, outputDir?: string): string {
  const data: InputJSON = JSON.parse(jsonString)
  const markdown = generateMarkdown(data)
  
  const dir = outputDir || path.resolve(__dirname, '../../../shared/data/processed')
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  
  const reportDate = new Date().toISOString().split('T')[0]
  const outputPath = path.join(dir, `fixed-income-${reportDate}.md`)
  
  fs.writeFileSync(outputPath, markdown, 'utf-8')
  
  logger.success('GENERATE', `Fixed Income report saved to ${outputPath}`)
  return outputPath
}
