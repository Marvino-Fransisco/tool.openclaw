import * as fs from 'fs';
import * as path from 'path';

const PROJECT_PATH = path.resolve(__dirname, '../../project');
const OUTPUT_PATH = path.resolve(__dirname, '../../project-context/project-tree.md');

const EXCLUDED_DIRS = new Set([
  'node_modules',
  'vendor',
  'Pods',
  '.cargo',
  'dist',
  'build',
  'out',
  'target',
  '.next',
  '.nuxt',
  'venv',
  '.venv',
  'env',
  '__pycache__',
  '.idea',
  '.vscode',
  '.vs',
  '.git',
  '.svn',
  '.hg',
  '.gradle',
  'coverage',
  '.cache',
  'bin',
  'obj',
  '.mvn',
  'gradle',
  '.idea',
  '*.egg-info',
  '.pytest_cache',
  '.mypy_cache',
  '.tox',
  'bower_components',
  'jspm_packages',
]);

const EXCLUDED_FILES = new Set([
  '.DS_Store',
  'Thumbs.db',
  '.gitignore',
  '.gitattributes',
  'yarn.lock',
  'pnpm-lock.yaml',
  'composer.lock',
  'Cargo.lock',
  'Podfile.lock',
  'Gemfile.lock',
  'poetry.lock',
  'Pipfile.lock',
]);

const EXCLUDED_FILE_PATTERNS = [
  /^package-lock\.json$/,
  /-lock\.json$/,
  /\.lock$/,
  /\.pyc$/,
  /\.pyo$/,
  /\.o$/,
  /\.obj$/,
  /\.class$/,
  /\.exe$/,
  /\.dll$/,
  /\.so$/,
  /\.dylib$/,
  /\.log$/,
  /\.bak$/,
  /\.swp$/,
  /\.swo$/,
];

function shouldExcludeFile(filename: string): boolean {
  if (EXCLUDED_FILES.has(filename)) return true;
  return EXCLUDED_FILE_PATTERNS.some(pattern => pattern.test(filename));
}

function buildTree(dirPath: string, prefix: string = '', isLast: boolean = true): string[] {
  const lines: string[] = [];
  
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dirPath, { withFileTypes: true });
  } catch {
    return lines;
  }

  const filteredEntries = entries.filter(entry => {
    if (entry.isDirectory()) {
      return !EXCLUDED_DIRS.has(entry.name);
    }
    if (entry.isFile()) {
      return !shouldExcludeFile(entry.name);
    }
    return true;
  });

  filteredEntries.sort((a, b) => {
    if (a.isDirectory() && !b.isDirectory()) return -1;
    if (!a.isDirectory() && b.isDirectory()) return 1;
    return a.name.localeCompare(b.name);
  });

  filteredEntries.forEach((entry, index) => {
    const isLastEntry = index === filteredEntries.length - 1;
    const connector = isLastEntry ? '└── ' : '├── ';
    const newPrefix = prefix + (isLastEntry ? '    ' : '│   ');
    
    lines.push(prefix + connector + entry.name);
    
    if (entry.isDirectory()) {
      const subPath = path.join(dirPath, entry.name);
      const subLines = buildTree(subPath, newPrefix, isLastEntry);
      lines.push(...subLines);
    }
  });

  return lines;
}

function generateMarkdown(): string {
  const projectName = path.basename(PROJECT_PATH);
  const treeLines = buildTree(PROJECT_PATH);
  
  const content = `# Project Tree

\`\`\`
${projectName}/
${treeLines.join('\n')}
\`\`\`
`;
  
  return content;
}

function main(): void {
  console.log(`Scanning project at: ${PROJECT_PATH}`);
  
  if (!fs.existsSync(PROJECT_PATH)) {
    console.error(`Error: Project directory does not exist: ${PROJECT_PATH}`);
    process.exit(1);
  }

  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`Created output directory: ${outputDir}`);
  }

  const markdown = generateMarkdown();
  fs.writeFileSync(OUTPUT_PATH, markdown, 'utf-8');
  
  console.log(`Project tree written to: ${OUTPUT_PATH}`);
}

main();
