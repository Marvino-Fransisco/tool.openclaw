import * as fs from 'fs';
import * as path from 'path';

const INPUT_DIR = '/home/node/.openclaw/shared/data/processed';
const OUTPUT_FILE = '/home/node/.openclaw/shared/data/processed/daily-brief.md';
const LOG_FILE = '/home/node/.openclaw/logs/merge-data.log';

function log(message: string): void {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  
  console.log(logMessage.trim());
  
  const logDir = path.dirname(LOG_FILE);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  fs.appendFileSync(LOG_FILE, logMessage);
}

function mergeMarkdownFiles(): void {
  log('='.repeat(60));
  log('Starting markdown merge process');
  log(`Input directory: ${INPUT_DIR}`);
  log(`Output file: ${OUTPUT_FILE}`);
  
  try {
    if (!fs.existsSync(INPUT_DIR)) {
      throw new Error(`Input directory does not exist: ${INPUT_DIR}`);
    }
    
    const files = fs.readdirSync(INPUT_DIR)
      .filter(file => file.endsWith('.md') && file !== 'daily-brief.md')
      .sort();
    
    log(`Found ${files.length} markdown files to merge`);
    
    if (files.length === 0) {
      log('Warning: No markdown files found to merge');
      return;
    }
    
    const mergedContent: string[] = [];
    
    for (const file of files) {
      const filePath = path.join(INPUT_DIR, file);
      log(`Reading: ${file}`);
      const content = fs.readFileSync(filePath, 'utf-8');
      mergedContent.push(content);
    }
    
    const outputDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      log(`Created output directory: ${outputDir}`);
    }
    
    if (!fs.existsSync(OUTPUT_FILE)) {
      fs.writeFileSync(OUTPUT_FILE, '');
      log(`Created output file: ${OUTPUT_FILE}`);
    }
    
    const finalContent = mergedContent.join('\n\n---\n\n');
    fs.writeFileSync(OUTPUT_FILE, finalContent);
    
    const fileSizeKB = (fs.statSync(OUTPUT_FILE).size / 1024).toFixed(2);
    log(`Successfully merged ${files.length} files into ${OUTPUT_FILE}`);
    log(`Output file size: ${fileSizeKB} KB`);
    log('Merge process completed successfully');
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    log(`ERROR: ${errorMessage}`);
    throw error;
  }
}

mergeMarkdownFiles();
