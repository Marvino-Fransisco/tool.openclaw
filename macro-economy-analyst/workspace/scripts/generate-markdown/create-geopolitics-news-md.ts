import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { logger } from './logger'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface NewsItem {
  title: string
  sourceUrl: string
}

interface InputJSON {
  news: NewsItem[]
}

function parseJSON(filepath: string): InputJSON {
  const content = fs.readFileSync(filepath, 'utf-8')
  return JSON.parse(content)
}

const NON_MACRO_PATTERNS = [
  /\bobituary\b/i,
  /\bdies at\b/i,
  /\bLa Liga\b/i,
  /\bReal Madrid\b/i,
  /\bAtletico\b/i,
  /\bsoccer\b/i,
  /\bderby\b.*\d-\d/i,
  /\bstrike\b.*staff\b/i,
  /\bpodcast\b/i,
  /\bbriefing\b.*podcast\b/i,
]

function isMacroRelevant(title: string): boolean {
  return !NON_MACRO_PATTERNS.some(pattern => pattern.test(title))
}

function generateMarkdown(data: InputJSON): string {
  let md = `# Geopolitics News\n\n`
  
  const filtered = data.news.filter(item => isMacroRelevant(item.title))
  
  for (const item of filtered) {
    md += `- [${item.title}](${item.sourceUrl})\n`
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

export function createGeopoliticsNewsMD(inputPath: string): string {
  const data = parseJSON(inputPath)
  const markdown = generateMarkdown(data)
  const outputPath = getOutputPath(inputPath)
  
  fs.writeFileSync(outputPath, markdown, 'utf-8')
  
  logger.success('GENERATE', `Geopolitics News report saved to ${outputPath}`)
  return outputPath
}

export function createGeopoliticsNewsMDFromString(jsonString: string, outputDir?: string): string {
  const data: InputJSON = JSON.parse(jsonString)
  const markdown = generateMarkdown(data)
  
  const dir = outputDir || path.resolve(__dirname, '../../../shared/data/processed')
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  
  const reportDate = new Date().toISOString().split('T')[0]
  const outputPath = path.join(dir, `geopolitics-news-${reportDate}.md`)
  
  fs.writeFileSync(outputPath, markdown, 'utf-8')
  
  logger.success('GENERATE', `Geopolitics News report saved to ${outputPath}`)
  return outputPath
}
