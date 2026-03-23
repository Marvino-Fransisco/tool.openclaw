import * as fs from 'fs';
import * as path from 'path';

const inputDir = '/home/node/.openclaw/shared/analysis/macro-fundamentals';
const outputFile = '/home/node/.openclaw/shared/analysis/macro-fundamental/analysis.md';

const inputFiles = [
  'fiscal-policy-analysis.md',
  'global-markets-analysis.md',
  'inflation-growth-analysis.md',
  'monetary-policy-analysis.md',
];

function mergeFiles(): void {
  const sections: string[] = [];

  for (const filename of inputFiles) {
    const filePath = path.join(inputDir, filename);
    
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const sectionTitle = filename.replace('.md', '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      
      sections.push(`## ${sectionTitle}\n\n${content}`);
    } else {
      console.warn(`Warning: ${filename} not found`);
    }
  }

  const header = `# Macro Fundamentals Analysis\n\nGenerated: ${new Date().toISOString()}\n\n---\n\n`;
  const mergedContent = header + sections.join('\n\n---\n\n');

  const outputDir = path.dirname(outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputFile, mergedContent, 'utf-8');
  console.log(`Merged ${sections.length} files into ${outputFile}`);
}

mergeFiles();
