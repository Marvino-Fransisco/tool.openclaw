import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { logger } from './logger'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface Speaker {
  slug: string
  name: string
  role: string
  tier: number
  weight: number
  institution: string
}

interface Communication {
  id: string
  type: string
  date: string
  speaker?: Speaker
  title: string
  venue?: string
  sourceUrl: string
  content: string
}

interface ProjectionMedian {
  2026: number | null
  2027: number | null
  2028: number | null
  longerRun: number | null
}

interface ProjectionRange {
  2026: string
  2027: string
  2028: string
  longerRun: string
}

interface ProjectionData {
  median: ProjectionMedian
  centralTendency: ProjectionRange
  range: ProjectionRange
}

interface Projection {
  id: string
  date: string
  sourceUrl: string
  gdp: ProjectionData
  unemployment: ProjectionData
  pceInflation: ProjectionData
  corePceInflation: ProjectionData
  federalFundsRate: ProjectionData
}

interface Summary {
  totalCommunications: number
  totalProjections: number
  bySpeaker: Record<string, number>
  byType: Record<string, number>
}

interface InputJSON {
  fetchedAt: string
  period: { start: string; end: string }
  communications: Communication[]
  projections: Projection[]
  summary: Summary
}

function parseJSON(filepath: string): InputJSON {
  const content = fs.readFileSync(filepath, 'utf-8')
  return JSON.parse(content)
}

function formatDate(dateStr: string): string {
  return dateStr.split('T')[0]
}

function formatDateTime(dateStr: string): string {
  return dateStr.replace('T', ' ').substring(0, 16)
}

function getTierLabel(tier: number): string {
  switch (tier) {
    case 1: return 'Tier 1 (Chair)'
    case 2: return 'Tier 2 (Vice Chair)'
    case 3: return 'Tier 3 (Governor)'
    case 4: return 'Tier 4 (Regional President)'
    default: return `Tier ${tier}`
  }
}

function getTypeIcon(type: string): string {
  switch (type) {
    case 'speech': return '🎤'
    case 'statement': return '📜'
    case 'testimony': return '🏛️'
    default: return '📄'
  }
}

function extractKeyThemes(content: string): string[] {
  const themes: string[] = []
  const keywords: Record<string, string[]> = {
    'Inflation': ['inflation', 'price stability', '2 percent', 'disinflation'],
    'Labor Market': ['employment', 'unemployment', 'job gains', 'labor market', 'payroll'],
    'Monetary Policy': ['federal funds rate', 'policy rate', 'monetary policy', 'FOMC', 'rate cut', 'rate hike'],
    'Economic Growth': ['economic activity', 'GDP', 'growth', 'expansion'],
    'Financial Stability': ['financial stability', 'banking system', 'liquidity', 'capital'],
    'AI & Technology': ['artificial intelligence', 'AI', 'technology', 'productivity'],
    'Regulation': ['regulation', 'supervision', 'capital requirements', 'Basel'],
    'Housing': ['mortgage', 'housing', 'real estate'],
  }

  const lowerContent = content.toLowerCase()
  for (const [theme, words] of Object.entries(keywords)) {
    if (words.some(w => lowerContent.includes(w))) {
      themes.push(theme)
    }
  }
  return themes.slice(0, 5)
}

function assessHawkishDovish(content: string): { stance: string; confidence: string } {
  const lowerContent = content.toLowerCase()
  
  const hawkishSignals = [
    'inflation remains elevated',
    'remain vigilant',
    'higher for longer',
    'need to see more',
    'carefully assess',
    'sustainably return',
    'risk of persistent inflation',
  ]
  
  const dovishSignals = [
    'labor market remains weak',
    'downside risks',
    'further easing',
    'cut the policy rate',
    'fragile',
    'vulnerable',
    'substantial deterioration',
    'remove policy restraint',
  ]
  
  let hawkishScore = 0
  let dovishScore = 0
  
  for (const signal of hawkishSignals) {
    if (lowerContent.includes(signal)) hawkishScore++
  }
  
  for (const signal of dovishSignals) {
    if (lowerContent.includes(signal)) dovishScore++
  }
  
  const total = hawkishScore + dovishScore
  
  if (total === 0) return { stance: 'Neutral/Unclear', confidence: 'Low' }
  
  const diff = hawkishScore - dovishScore
  
  if (diff >= 3) return { stance: 'Hawkish', confidence: 'High' }
  if (diff >= 1) return { stance: 'Leaning Hawkish', confidence: 'Medium' }
  if (diff <= -3) return { stance: 'Dovish', confidence: 'High' }
  if (diff <= -1) return { stance: 'Leaning Dovish', confidence: 'Medium' }
  return { stance: 'Balanced', confidence: 'Medium' }
}

function generateHeader(): string {
  return `# Central Bank Signals\n\n`
}

function generateSummarySection(data: InputJSON): string {
  const periodStart = formatDate(data.period.start)
  const periodEnd = formatDate(data.period.end)
  
  let md = `## Summary (${periodStart} to ${periodEnd})\n\n`
  
  md += `### Overview\n\n`
  md += `| Metric | Value |\n`
  md += `|--------|-------|\n`
  md += `| Total Communications | ${data.summary.totalCommunications} |\n`
  md += `| Total Projections | ${data.summary.totalProjections} |\n\n`
  
  md += `### Communications by Speaker\n\n`
  md += `| Speaker | Count |\n`
  md += `|---------|-------|\n`
  const sortedSpeakers = Object.entries(data.summary.bySpeaker)
    .sort((a, b) => b[1] - a[1])
  for (const [speaker, count] of sortedSpeakers) {
    md += `| ${speaker} | ${count} |\n`
  }
  md += '\n'
  
  md += `### Communications by Type\n\n`
  md += `| Type | Count |\n`
  md += `|------|-------|\n`
  for (const [type, count] of Object.entries(data.summary.byType)) {
    md += `| ${type} | ${count} |\n`
  }
  md += '\n---\n\n'
  
  return md
}

function generateProjectionsSection(projections: Projection[]): string {
  if (projections.length === 0) return ''
  
  let md = `## FOMC Economic Projections\n\n`
  
  for (const proj of projections) {
    md += `### Projections as of ${formatDate(proj.date)}\n\n`
    md += `[Source](${proj.sourceUrl})\n\n`
    
    md += `#### GDP Growth (%)\n\n`
    md += `| Year | Median | Central Tendency | Range |\n`
    md += `|------|--------|------------------|-------|\n`
    md += `| 2026 | ${proj.gdp.median['2026'] ?? '--'} | ${proj.gdp.centralTendency['2026'] || '--'} | ${proj.gdp.range['2026'] || '--'} |\n`
    md += `| 2027 | ${proj.gdp.median['2027'] ?? '--'} | ${proj.gdp.centralTendency['2027'] || '--'} | ${proj.gdp.range['2027'] || '--'} |\n`
    md += `| 2028 | ${proj.gdp.median['2028'] ?? '--'} | ${proj.gdp.centralTendency['2028'] || '--'} | ${proj.gdp.range['2028'] || '--'} |\n`
    md += `| Longer Run | ${proj.gdp.median.longerRun ?? '--'} | ${proj.gdp.centralTendency.longerRun || '--'} | ${proj.gdp.range.longerRun || '--'} |\n\n`
    
    md += `#### Unemployment Rate (%)\n\n`
    md += `| Year | Median | Central Tendency | Range |\n`
    md += `|------|--------|------------------|-------|\n`
    md += `| 2026 | ${proj.unemployment.median['2026'] ?? '--'} | ${proj.unemployment.centralTendency['2026'] || '--'} | ${proj.unemployment.range['2026'] || '--'} |\n`
    md += `| 2027 | ${proj.unemployment.median['2027'] ?? '--'} | ${proj.unemployment.centralTendency['2027'] || '--'} | ${proj.unemployment.range['2027'] || '--'} |\n`
    md += `| 2028 | ${proj.unemployment.median['2028'] ?? '--'} | ${proj.unemployment.centralTendency['2028'] || '--'} | ${proj.unemployment.range['2028'] || '--'} |\n`
    md += `| Longer Run | ${proj.unemployment.median.longerRun ?? '--'} | ${proj.unemployment.centralTendency.longerRun || '--'} | ${proj.unemployment.range.longerRun || '--'} |\n\n`
    
    md += `#### PCE Inflation (%)\n\n`
    md += `| Year | Median | Central Tendency | Range |\n`
    md += `|------|--------|------------------|-------|\n`
    md += `| 2026 | ${proj.pceInflation.median['2026'] ?? '--'} | ${proj.pceInflation.centralTendency['2026'] || '--'} | ${proj.pceInflation.range['2026'] || '--'} |\n`
    md += `| 2027 | ${proj.pceInflation.median['2027'] ?? '--'} | ${proj.pceInflation.centralTendency['2027'] || '--'} | ${proj.pceInflation.range['2027'] || '--'} |\n`
    md += `| 2028 | ${proj.pceInflation.median['2028'] ?? '--'} | ${proj.pceInflation.centralTendency['2028'] || '--'} | ${proj.pceInflation.range['2028'] || '--'} |\n`
    md += `| Longer Run | ${proj.pceInflation.median.longerRun ?? '--'} | ${proj.pceInflation.centralTendency.longerRun || '--'} | ${proj.pceInflation.range.longerRun || '--'} |\n\n`
    
    md += `#### Federal Funds Rate (%)\n\n`
    md += `| Year | Median | Central Tendency | Range |\n`
    md += `|------|--------|------------------|-------|\n`
    md += `| 2026 | ${proj.federalFundsRate.median['2026'] ?? '--'} | ${proj.federalFundsRate.centralTendency['2026'] || '--'} | ${proj.federalFundsRate.range['2026'] || '--'} |\n`
    md += `| 2027 | ${proj.federalFundsRate.median['2027'] ?? '--'} | ${proj.federalFundsRate.centralTendency['2027'] || '--'} | ${proj.federalFundsRate.range['2027'] || '--'} |\n`
    md += `| 2028 | ${proj.federalFundsRate.median['2028'] ?? '--'} | ${proj.federalFundsRate.centralTendency['2028'] || '--'} | ${proj.federalFundsRate.range['2028'] || '--'} |\n`
    md += `| Longer Run | ${proj.federalFundsRate.median.longerRun ?? '--'} | ${proj.federalFundsRate.centralTendency.longerRun || '--'} | ${proj.federalFundsRate.range.longerRun || '--'} |\n\n`
  }
  
  md += `---\n\n`
  return md
}

function generateCommunicationsSection(communications: Communication[]): string {
  let md = `## All Communications\n\n`
  md += `| Date | Speaker | Type | Stance | Key Themes | Link |\n`
  md += `|------|---------|------|--------|------------|------|\n`
  
  const sortedComms = [...communications].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  
  for (const comm of sortedComms) {
    const stance = assessHawkishDovish(comm.content)
    const themes = extractKeyThemes(comm.content).slice(0, 3).join(', ')
    const speaker = comm.speaker ? comm.speaker.name.split(' ').pop() : 'FOMC'
    const typeIcon = getTypeIcon(comm.type)
    
    md += `| ${formatDate(comm.date)} | ${speaker} | ${typeIcon} ${comm.type} | ${stance.stance} | ${themes || '--'} | [Full](${comm.sourceUrl}) |\n`
  }
  
  md += '\n---\n\n'
  return md
}

function generateSpeakerAnalysis(communications: Communication[]): string {
  const speakerMap = new Map<string, { speaker: Speaker; comms: Communication[] }>()
  
  for (const comm of communications) {
    if (!comm.speaker) continue
    const slug = comm.speaker.slug
    if (!speakerMap.has(slug)) {
      speakerMap.set(slug, { speaker: comm.speaker, comms: [] })
    }
    speakerMap.get(slug)!.comms.push(comm)
  }
  
  if (speakerMap.size === 0) return ''
  
  let md = `## Speaker Analysis\n\n`
  
  const sortedSpeakers = Array.from(speakerMap.values())
    .sort((a, b) => a.speaker.tier - b.speaker.tier || b.comms.length - a.comms.length)
  
  md += `| Speaker | Role | Tier | Communications | Avg Stance |\n`
  md += `|---------|------|------|----------------|------------|\n`
  
  for (const { speaker, comms } of sortedSpeakers) {
    let totalHawkish = 0
    let totalDovish = 0
    
    for (const comm of comms) {
      const stance = assessHawkishDovish(comm.content)
      if (stance.stance.includes('Hawkish')) totalHawkish++
      if (stance.stance.includes('Dovish')) totalDovish++
    }
    
    const avgStance = totalHawkish > totalDovish ? 'Hawkish' 
      : totalDovish > totalHawkish ? 'Dovish' 
      : 'Balanced'
    
    md += `| ${speaker.name} | ${speaker.role} | Tier ${speaker.tier} | ${comms.length} | ${avgStance} |\n`
  }
  
  md += '\n---\n\n'
  return md
}

function generateStanceSummary(communications: Communication[]): string {
  let hawkish = 0
  let dovish = 0
  let neutral = 0
  
  for (const comm of communications) {
    const stance = assessHawkishDovish(comm.content)
    if (stance.stance.includes('Hawkish')) hawkish++
    else if (stance.stance.includes('Dovish')) dovish++
    else neutral++
  }
  
  let md = `## Overall Stance Summary\n\n`
  md += `| Stance | Count | Percentage |\n`
  md += `|--------|-------|------------|\n`
  const total = hawkish + dovish + neutral
  md += `| Hawkish | ${hawkish} | ${total > 0 ? ((hawkish / total) * 100).toFixed(1) : 0}% |\n`
  md += `| Dovish | ${dovish} | ${total > 0 ? ((dovish / total) * 100).toFixed(1) : 0}% |\n`
  md += `| Neutral/Balanced | ${neutral} | ${total > 0 ? ((neutral / total) * 100).toFixed(1) : 0}% |\n\n`
  
  const overallStance = hawkish > dovish + neutral ? 'Overall: Hawkish Bias'
    : dovish > hawkish + neutral ? 'Overall: Dovish Bias'
    : 'Overall: Mixed/Neutral'
  
  md += `**Assessment:** ${overallStance}\n\n`
  md += `---\n\n`
  
  return md
}

function generateMarkdown(data: InputJSON): string {
  let md = generateHeader()
  
  md += generateSummarySection(data)
  
  if (data.projections.length > 0) {
    md += generateProjectionsSection(data.projections)
  }
  
  if (data.communications.length > 0) {
    md += generateStanceSummary(data.communications)
    md += generateSpeakerAnalysis(data.communications)
    md += generateCommunicationsSection(data.communications)
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

export function createCentralBankSignalMD(inputPath: string): string {
  const data = parseJSON(inputPath)
  const markdown = generateMarkdown(data)
  const outputPath = getOutputPath(inputPath)
  
  fs.writeFileSync(outputPath, markdown, 'utf-8')
  
  logger.success('GENERATE', `Central Bank Signals report saved to ${outputPath}`)
  return outputPath
}

export function createCentralBankSignalMDFromString(jsonString: string, outputDir?: string): string {
  const data: InputJSON = JSON.parse(jsonString)
  const markdown = generateMarkdown(data)
  
  const dir = outputDir || path.resolve(__dirname, '../../../shared/data/processed')
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  
  const reportDate = new Date().toISOString().split('T')[0]
  const outputPath = path.join(dir, `central-bank-signals-${reportDate}.md`)
  
  fs.writeFileSync(outputPath, markdown, 'utf-8')
  
  logger.success('GENERATE', `Central Bank Signals report saved to ${outputPath}`)
  return outputPath
}
