#!/usr/bin/env npx tsx
import { spawnSync } from "child_process";
import { existsSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SHARED_DIR = join(__dirname, "..", "..", "shared");
const DEFAULT_TIMEOUT_MS = 300000;

interface AgentResult {
  success: boolean;
  output: string;
  error: string;
  exitCode: number;
}

function parseArgs(): { prompt: string; timeoutMs: number } {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
    console.log(`
Usage: npx tsx start-workflow.ts "<prompt>" [--timeout <ms>]

Arguments:
  <prompt>              The topic/question to research and summarize
  --timeout <ms>        Timeout for each agent in milliseconds (default: ${DEFAULT_TIMEOUT_MS})

Example:
  npx tsx start-workflow.ts "Learn about React hooks" --timeout 600000
`);
    process.exit(args[0] === "--help" || args[0] === "-h" ? 0 : 1);
  }

  let prompt = "";
  let timeoutMs = DEFAULT_TIMEOUT_MS;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--timeout") {
      timeoutMs = parseInt(args[++i], 10);
      if (isNaN(timeoutMs) || timeoutMs <= 0) {
        console.error("Error: --timeout must be a positive number");
        process.exit(1);
      }
    } else if (!args[i].startsWith("--")) {
      prompt = args[i];
    }
  }

  if (!prompt) {
    console.error("Error: No prompt provided");
    process.exit(1);
  }

  return { prompt, timeoutMs };
}

function runAgent(agentId: string, message: string, timeoutMs: number): AgentResult {
  const timeoutSec = Math.ceil(timeoutMs / 1000);
  
  console.log(`\n[${new Date().toISOString()}] Running ${agentId} agent...`);
  console.log(`  Message: ${message.substring(0, 100)}${message.length > 100 ? "..." : ""}`);
  console.log(`  Timeout: ${timeoutSec}s`);

  const result = spawnSync("openclaw", [
    "agent",
    "--agent", agentId,
    "--message", message,
    "--timeout", String(timeoutSec),
  ], {
    encoding: "utf-8",
    maxBuffer: 10 * 1024 * 1024,
    shell: process.platform === "win32",
  });

  return {
    success: result.status === 0,
    output: result.stdout?.trim() || "",
    error: result.stderr?.trim() || "",
    exitCode: result.status ?? 1,
  };
}

function checkOutputFile(filename: string): { exists: boolean; path: string } {
  const path = join(SHARED_DIR, filename);
  return { exists: existsSync(path), path };
}

function printFilePreview(path: string, lines: number = 5): void {
  try {
    const content = readFileSync(path, "utf-8");
    const contentLines = content.split("\n").slice(0, lines);
    console.log(`\n  Preview (${path}):`);
    contentLines.forEach((line) => console.log(`    ${line}`));
    if (content.split("\n").length > lines) {
      console.log("    ...");
    }
  } catch {
  }
}

async function main(): Promise<void> {
  const { prompt, timeoutMs } = parseArgs();
  
  console.log("=".repeat(60));
  console.log("OpenClaw Workflow: URL Scraper → Synthesizer");
  console.log("=".repeat(60));
  console.log(`\nPrompt: "${prompt}"`);

  // Step 1: Run url-scrapper agent
  console.log("\n" + "-".repeat(60));
  console.log("Step 1: Scraping URLs");
  console.log("-".repeat(60));

  const scraperResult = runAgent("url-scrapper", prompt, timeoutMs);

  if (!scraperResult.success) {
    console.error("\n❌ URL scraper failed:");
    console.error(scraperResult.error || scraperResult.output);
    process.exit(1);
  }

  console.log("\n✅ URL scraper completed");
  if (scraperResult.output) {
    console.log("\nOutput:");
    console.log(scraperResult.output);
  }

  const urlFile = checkOutputFile("url.md");
  if (!urlFile.exists) {
    console.warn("\n⚠️  Warning: shared/url.md not found, continuing anyway...");
  } else {
    printFilePreview(urlFile.path);
  }

  // Step 2: Run synthesizer agent
  console.log("\n" + "-".repeat(60));
  console.log("Step 2: Synthesizing documentation");
  console.log("-".repeat(60));

  const synthesizerResult = runAgent("synthesizer", prompt, timeoutMs);

  if (!synthesizerResult.success) {
    console.error("\n❌ Synthesizer failed:");
    console.error(synthesizerResult.error || synthesizerResult.output);
    console.log("\n⚠️  Partial success: URLs were scraped but synthesis failed");
    console.log(`   Check: ${urlFile.path}`);
    process.exit(1);
  }

  console.log("\n✅ Synthesizer completed");
  if (synthesizerResult.output) {
    console.log("\nOutput:");
    console.log(synthesizerResult.output);
  }

  const summaryFile = checkOutputFile("summary.md");
  if (!summaryFile.exists) {
    console.warn("\n⚠️  Warning: shared/summary.md not found");
  } else {
    printFilePreview(summaryFile.path);
  }

  // Final summary
  console.log("\n" + "=".repeat(60));
  console.log("✅ Workflow completed successfully!");
  console.log("=".repeat(60));
  console.log(`\nOutput files:`);
  console.log(`  - URLs:      ${urlFile.path}`);
  console.log(`  - Summary:   ${summaryFile.path}`);
  console.log("");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
