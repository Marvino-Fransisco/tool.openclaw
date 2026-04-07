import { execSync, exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const AGENT_TIMEOUT_MS = 600_000;
const AGENT_MESSAGE = 'Do your job';
const LOG_DIR = '/home/node/.openclaw/logs';
const LOG_FILE = path.join(LOG_DIR, 'pipeline.log');
const SHARED_DIR = '/home/node/.openclaw/shared';
const REPORT_DIR = '/home/node/.openclaw/shared/report';
const WORKSPACE_DIR = '/home/node/.openclaw/workspace';

const LOG_FILES_TO_CLEAN = [
  LOG_FILE,
  path.join(LOG_DIR, 'last-fetch.log'),
  path.join(LOG_DIR, 'last-processed.log'),
  path.join(LOG_DIR, 'merge-data.log'),
];

const TIER_1_AGENTS = [
  'monetary-policy-analyst',
  'fiscal-policy-analyst',
  'inflation-growth-analyst',
  'global-markets-analyst',
];

const TIER_2_AGENTS = [
  'equity-analyst',
  'fixed-income-analyst',
  'commodities-analyst',
  'crypto-analyst',
];

const TIER_3_AGENTS = [
  'sentiment-risk-analyst',
  'regime-classifier',
  'liquidity-flows-analyst',
];

const TIER_4_AGENTS = [
  'signal-aggregator',
  'asset-aggregator',
];

const TIER_5A_AGENTS = [
  'bullish-forecaster',
  'bearish-forecaster',
  'neutral-forecaster',
];

const TIER_5B_AGENTS = ['final-forecaster'];
const TIER_6_AGENTS = ['portfolio-manager'];
const TIER_7_AGENTS = ['synthesizer'];

let stepCounter = 0;
let totalSteps = 11;

interface TierConfig {
  step: number;
  label: string;
  description: string;
  agents: string[];
  deliver?: boolean;
}

function timestamp(): string {
  return new Date().toISOString();
}

function logToFile(message: string): void {
  try {
    fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
    fs.appendFileSync(LOG_FILE, `[${timestamp()}] ${message}\n`);
  } catch {}
}

function banner(text: string, char = '='): void {
  const line = char.repeat(60);
  console.log(`\n${line}`);
  console.log(`  ${text}`);
  console.log(`${line}\n`);
  logToFile(text);
}

function phaseHeader(phase: string, step: number, desc: string): void {
  const line = '-'.repeat(60);
  console.log(`\n${line}`);
  console.log(`  [${step}/${totalSteps}] ${phase}`);
  console.log(`  ${desc}`);
  console.log(`${line}\n`);
  logToFile(`STEP ${step}/${totalSteps}: ${phase} — ${desc}`);
}

function logInfo(msg: string): void {
  console.log(`[${timestamp()}]   → ${msg}`);
  logToFile(`INFO: ${msg}`);
}

function logOk(msg: string): void {
  console.log(`[${timestamp()}]   ✓ ${msg}`);
  logToFile(`OK: ${msg}`);
}

function logWarn(msg: string): void {
  console.log(`[${timestamp()}]   ⚠ ${msg}`);
  logToFile(`WARN: ${msg}`);
}

function logFail(msg: string): void {
  console.error(`[${timestamp()}]   ✗ ${msg}`);
  logToFile(`FAIL: ${msg}`);
}

function logAgentStart(name: string, deliver: boolean): void {
  logInfo(`Calling: ${name}${deliver ? ' [deliver→Discord]' : ''}`);
}

function logAgentOk(name: string, elapsedMs: number): void {
  const sec = (elapsedMs / 1000).toFixed(1);
  logOk(`${name} done (${sec}s)`);
}

function logAgentFail(name: string, error: string): void {
  logFail(`${name} FAILED: ${error}`);
}

function execAsync(command: string, timeout: number): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, { timeout }, (error, stdout, stderr) => {
      if (error) {
        const detail = stderr?.trim() || error.message;
        reject(new Error(detail));
        return;
      }
      resolve(stdout);
    });
  });
}

async function callAgent(name: string, deliver = false): Promise<string> {
  const parts = [
    'openclaw',
    'agent',
    '--agent', name,
    '--message', `"${AGENT_MESSAGE}"`,
    '--json',
  ];
  if (deliver) parts.push('--deliver');
  const command = parts.join(' ');
  logAgentStart(name, deliver);
  return execAsync(command, AGENT_TIMEOUT_MS);
}

async function callAgentsConcurrently(
  agents: string[],
  deliver = false,
): Promise<void> {
  const count = agents.length;
  logInfo(`Launching ${count} agent(s) in parallel...`);

  const startTimes = new Map<string, number>();

  const results = await Promise.all(
    agents.map(async (name) => {
      startTimes.set(name, Date.now());
      try {
        const output = await callAgent(name, deliver);
        const elapsed = Date.now() - (startTimes.get(name) ?? Date.now());
        return { name, status: 'success' as const, output, elapsed };
      } catch (err) {
        const elapsed = Date.now() - (startTimes.get(name) ?? Date.now());
        return {
          name,
          status: 'failed' as const,
          error: err instanceof Error ? err.message : String(err),
          elapsed,
        };
      }
    }),
  );

  const succeeded = results.filter((r) => r.status === 'success');
  const failed = results.filter((r) => r.status === 'failed');

  for (const r of succeeded) {
    logAgentOk(r.name, r.elapsed);
  }

  if (failed.length > 0) {
    for (const f of failed) {
      logAgentFail(f.name, f.error);
    }
    logFail(
      `${failed.length}/${count} agent(s) failed in this tier. Aborting pipeline.`,
    );
    process.exit(1);
  }

  logOk(`All ${count} agent(s) completed successfully`);
}

function getLastFetchDate(): string | null {
  const logPath = path.join(LOG_DIR, 'last-fetch.log');
  try {
    if (fs.existsSync(logPath)) {
      return fs.readFileSync(logPath, 'utf-8').trim();
    }
  } catch {}
  return null;
}

function checkStaleData(): void {
  const today = new Date().toISOString().split('T')[0];
  const lastFetch = getLastFetchDate();

  if (lastFetch === today) {
    logFail(`Data already fetched today (${today}). Skipping pipeline to avoid stale re-analysis.`);
    logInfo(`If you want to re-run, delete ${path.join(LOG_DIR, 'last-fetch.log')} first.`);
    process.exit(0);
  }

  if (lastFetch) {
    logInfo(`Last fetch was ${lastFetch}. Proceeding with fresh data.`);
  }
}

async function runDataPreparation(): Promise<void> {
  banner('PHASE A: DATA PREPARATION', '#');

  checkStaleData();

  phaseHeader('Fetch Raw Data', 1, 'Fetching all macro economy data from external sources');
  execSync('npm run fetch', { stdio: 'inherit', timeout: 120_000 });
  logOk('Raw data fetched → /shared/data/raw/');

  phaseHeader('Process to Markdown', 2, 'Converting raw JSON data into structured markdown files');
  execSync('npm run process', { stdio: 'inherit', timeout: 120_000 });
  logOk('Markdown generated → /shared/data/processed/');

  phaseHeader('Merge Data', 3, 'Merging all markdown files into daily-brief.md');
  execSync('npm run merge:data', { stdio: 'inherit', timeout: 60_000 });
  logOk('Daily brief created → /shared/data/processed/daily-brief.md');
}

async function runAgentTiers(): Promise<void> {
  banner('PHASE B: MULTI-AGENT ANALYSIS', '#');

  const tiers: TierConfig[] = [
    {
      step: 4,
      label: 'Tier 1 — Macro Fundamentals',
      description:
        'Analysing daily brief → monetary policy, fiscal policy, inflation/growth, global markets',
      agents: TIER_1_AGENTS,
    },
    {
      step: 5,
      label: 'Tier 2 — Asset Specialists',
      description:
        'Translating macro fundamentals → equity, fixed-income, commodities, crypto outlook',
      agents: TIER_2_AGENTS,
    },
    {
      step: 6,
      label: 'Tier 3 — Signal Analysts',
      description:
        'Extracting signals → sentiment/risk, regime classification, liquidity flows',
      agents: TIER_3_AGENTS,
    },
    {
      step: 7,
      label: 'Tier 4 — Aggregators',
      description:
        'Consolidating → signal aggregation + asset aggregation into unified views',
      agents: TIER_4_AGENTS,
    },
    {
      step: 8,
      label: 'Tier 5a — Bullish / Bearish / Neutral Forecasters',
      description:
        'Constructing competing theses → bull case, bear case, base case',
      agents: TIER_5A_AGENTS,
    },
    {
      step: 9,
      label: 'Tier 5b — Final Forecaster',
      description:
        'Adjudicating the three theses into a single probability-weighted outlook',
      agents: TIER_5B_AGENTS,
    },
    {
      step: 10,
      label: 'Tier 6 — Portfolio Manager',
      description:
        'Translating final thesis + aggregated analysis → concrete portfolio allocation advice',
      agents: TIER_6_AGENTS,
    },
    {
      step: 11,
      label: 'Tier 7 — Synthesizer',
      description:
        'Synthesizing all analysis into final report → PDF + deliver to Discord',
      agents: TIER_7_AGENTS,
      deliver: true,
    },
  ];

  for (const tier of tiers) {
    phaseHeader(tier.label, tier.step, tier.description);
    await callAgentsConcurrently(tier.agents, tier.deliver ?? false);
  }
}

function cleanMarkdownFiles(dir: string): void {
  logInfo(`Deleting markdown files in ${dir}...`);
  try {
    if (!fs.existsSync(dir)) {
      logInfo('Directory does not exist, skipping markdown cleanup.');
      return;
    }
    let deletedCount = 0;
    const entries = fs.readdirSync(dir, { withFileTypes: true, recursive: true });
    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith('.md')) {
        const fullPath = path.join(entry.parentPath ?? (entry as any).path, entry.name);
        try {
          fs.unlinkSync(fullPath);
          deletedCount++;
        } catch (err) {
          logWarn(`Could not remove ${entry.name}: ${err instanceof Error ? err.message : String(err)}`);
        }
      }
    }
    logOk(`Deleted ${deletedCount} markdown file(s) from ${dir}.`);
  } catch (err) {
    logWarn(`Failed to clean markdown files: ${err instanceof Error ? err.message : String(err)}`);
  }
}

function cleanLogs(): void {
  logInfo('Cleaning up log files...');
  for (const file of LOG_FILES_TO_CLEAN) {
    try {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
        logOk(`Removed ${path.basename(file)}`);
      }
    } catch (err) {
      logWarn(`Could not remove ${path.basename(file)}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
}

function cleanSharedFolder(): void {
  logInfo(`Cleaning up files in shared folder: ${SHARED_DIR}`);
  try {
    if (!fs.existsSync(SHARED_DIR)) {
      logInfo('Shared folder does not exist, skipping cleanup.');
      return;
    }
    let deletedCount = 0;
    const entries = fs.readdirSync(SHARED_DIR, { withFileTypes: true, recursive: true });
    for (const entry of entries) {
      if (entry.isFile()) {
        const fullPath = path.join(entry.parentPath ?? entry.path, entry.name);
        const relPath = path.relative(SHARED_DIR, fullPath);
        if (relPath.split(path.sep).includes('reports') && fullPath.endsWith('.pdf')) {
          logInfo(`Skipping PDF report: ${relPath}`);
          continue;
        }
        try {
          fs.unlinkSync(fullPath);
          deletedCount++;
        } catch (err) {
          logWarn(`Could not remove ${entry.name}: ${err instanceof Error ? err.message : String(err)}`);
        }
      }
    }
    logOk(`Shared folder cleaned (${deletedCount} file(s) removed).`);
  } catch (err) {
    logWarn(`Failed to clean shared folder: ${err instanceof Error ? err.message : String(err)}`);
  }
}

function moveReportToWorkspace(): void {
  logInfo(`Looking for PDF report in ${REPORT_DIR}...`);
  try {
    if (!fs.existsSync(REPORT_DIR)) {
      logWarn('Report directory does not exist.');
      return;
    }
    const pdfFiles = fs.readdirSync(REPORT_DIR).filter((f) => f.endsWith('.pdf'));
    if (pdfFiles.length === 0) {
      logWarn('No PDF files found in report directory.');
      return;
    }
    fs.mkdirSync(WORKSPACE_DIR, { recursive: true });
    for (const pdf of pdfFiles) {
      const src = path.join(REPORT_DIR, pdf);
      const dest = path.join(WORKSPACE_DIR, pdf);
      fs.renameSync(src, dest);
      logOk(`Moved ${pdf} → ${WORKSPACE_DIR}`);
    }
  } catch (err) {
    logWarn(`Failed to move report: ${err instanceof Error ? err.message : String(err)}`);
  }
}

async function main(): Promise<void> {
  const pipelineStart = Date.now();

  console.log('');
  console.log('  ╔══════════════════════════════════════════════════════╗');
  console.log('  ║       MACRO ECONOMY ANALYSIS PIPELINE               ║');
  console.log('  ║       Multi-Agent Parallel Orchestration            ║');
  console.log(`  ║       Started: ${timestamp()}         ║`);
  console.log('  ╚══════════════════════════════════════════════════════╝');
  console.log('');

  logToFile('=== PIPELINE START ===');

  try {
    cleanMarkdownFiles(SHARED_DIR);
    await runDataPreparation();
    await runAgentTiers();

    const elapsed = ((Date.now() - pipelineStart) / 1000).toFixed(1);
    const mins = ((Date.now() - pipelineStart) / 60_000).toFixed(1);

    console.log('');
    console.log('  ╔══════════════════════════════════════════════════════╗');
    console.log('  ║       PIPELINE COMPLETED SUCCESSFULLY               ║');
    console.log(`  ║       Duration: ${elapsed}s (${mins}m)                       ║`);
    console.log(`  ║       Finished: ${timestamp()}         ║`);
    console.log('  ╚══════════════════════════════════════════════════════╝');
    console.log('');

    logToFile(`=== PIPELINE COMPLETE (${elapsed}s) ===`);

    moveReportToWorkspace();

  } catch (err) {
    const elapsed = ((Date.now() - pipelineStart) / 1000).toFixed(1);
    const msg = err instanceof Error ? err.message : String(err);

    console.log('');
    console.log('  ╔══════════════════════════════════════════════════════╗');
    console.log('  ║       PIPELINE FAILED                              ║');
    console.log(`  ║       After: ${elapsed}s                                 ║`);
    console.log('  ╚══════════════════════════════════════════════════════╝');
    console.log('');
    logFail(msg);

    logToFile(`=== PIPELINE FAILED (${elapsed}s): ${msg} ===`);
    process.exit(1);
  }
}

main();
