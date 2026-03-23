#!/usr/bin/env npx tsx
import { spawnSync } from "child_process";
import { existsSync, readFileSync, appendFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SHARED_DIR = join(__dirname, "..", "..", "shared");
const DEFAULT_TIMEOUT_MS = 300000;
const LOG_FILE = "/tmp/workflow.log";

function log(message: string, level: "INFO" | "ERROR" | "WARN" | "DEBUG" = "INFO"): void {
  const timestamp = new Date().toISOString();
  const logLine = `[${timestamp}] [${level}] ${message}`;
  console.log(logLine);
  try {
    appendFileSync(LOG_FILE, logLine + "\n");
  } catch (e) {
    console.error(`Failed to write to log file: ${e}`);
  }
}

function logSeparator(char: string = "-", length: number = 60): void {
  log(char.repeat(length));
}

function logObject(label: string, obj: Record<string, unknown>): void {
  log(`${label}: ${JSON.stringify(obj, null, 2)}`, "DEBUG");
}

interface AgentResult {
  success: boolean;
  output: string;
  error: string;
  exitCode: number;
}

function parseArgs(): { prompt: string; timeoutMs: number } {
  log("Step: Parsing command line arguments");
  log(`Raw arguments: ${JSON.stringify(process.argv.slice(2))}`, "DEBUG");
  
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
    const helpText = `
Usage: npx tsx start-workflow.ts "<prompt>" [--timeout <ms>]

Arguments:
  <prompt>              The topic/question to research and summarize
  --timeout <ms>        Timeout for each agent in milliseconds (default: ${DEFAULT_TIMEOUT_MS})

Example:
  npx tsx start-workflow.ts "Learn about React hooks" --timeout 600000
`;
    console.log(helpText);
    process.exit(args[0] === "--help" || args[0] === "-h" ? 0 : 1);
  }

  let prompt = "";
  let timeoutMs = DEFAULT_TIMEOUT_MS;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--timeout") {
      timeoutMs = parseInt(args[++i], 10);
      log(`Timeout argument found: ${timeoutMs}ms`, "DEBUG");
      if (isNaN(timeoutMs) || timeoutMs <= 0) {
        log("Error: --timeout must be a positive number", "ERROR");
        console.error("Error: --timeout must be a positive number");
        process.exit(1);
      }
    } else if (!args[i].startsWith("--")) {
      prompt = args[i];
      log(`Prompt argument found: ${prompt.substring(0, 50)}...`, "DEBUG");
    }
  }

  if (!prompt) {
    log("Error: No prompt provided", "ERROR");
    console.error("Error: No prompt provided");
    process.exit(1);
  }

  log(`Arguments parsed successfully - prompt: "${prompt}", timeout: ${timeoutMs}ms`);
  return { prompt, timeoutMs };
}

function runAgent(agentId: string, message: string, timeoutMs: number): AgentResult {
  const timeoutSec = Math.ceil(timeoutMs / 1000);
  const startTime = Date.now();
  
  logSeparator("=");
  log(`Starting agent execution: ${agentId}`);
  log(`Agent ID: ${agentId}`);
  log(`Message (truncated): ${message.substring(0, 100)}${message.length > 100 ? "..." : ""}`);
  log(`Full message length: ${message.length} characters`);
  log(`Timeout: ${timeoutSec}s (${timeoutMs}ms)`);
  log(`Command: openclaw agent --agent ${agentId} --message "<message>" --timeout ${timeoutSec}`);
  logSeparator("-");

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

  const duration = Date.now() - startTime;
  const agentResult: AgentResult = {
    success: result.status === 0,
    output: result.stdout?.trim() || "",
    error: result.stderr?.trim() || "",
    exitCode: result.status ?? 1,
  };

  log(`Agent ${agentId} completed in ${duration}ms`);
  log(`Exit code: ${agentResult.exitCode}`);
  log(`Success: ${agentResult.success}`);
  log(`Output length: ${agentResult.output.length} characters`);
  
  if (agentResult.error) {
    log(`Error output: ${agentResult.error.substring(0, 500)}${agentResult.error.length > 500 ? "..." : ""}`, "ERROR");
  }
  
  if (agentResult.output) {
    log(`Output preview: ${agentResult.output.substring(0, 200)}${agentResult.output.length > 200 ? "..." : ""}`, "DEBUG");
  }

  logObject(`Agent ${agentId} result`, {
    success: agentResult.success,
    exitCode: agentResult.exitCode,
    outputLength: agentResult.output.length,
    errorLength: agentResult.error.length,
    durationMs: duration,
  });

  return agentResult;
}

function checkOutputFile(filename: string): { exists: boolean; path: string } {
  const path = join(SHARED_DIR, filename);
  const exists = existsSync(path);
  
  log(`Checking output file: ${filename}`);
  log(`Full path: ${path}`);
  log(`File exists: ${exists}`);
  
  return { exists, path };
}

function printFilePreview(path: string, lines: number = 5): void {
  log(`Generating file preview for: ${path}`);
  
  try {
    const content = readFileSync(path, "utf-8");
    const contentLines = content.split("\n");
    const previewLines = contentLines.slice(0, lines);
    
    log(`File size: ${content.length} characters, ${contentLines.length} lines`);
    log(`Preview (${lines} lines):`);
    
    previewLines.forEach((line) => {
      log(`  | ${line}`);
    });
    
    if (contentLines.length > lines) {
      log(`  ... (${contentLines.length - lines} more lines)`);
    }
    
    console.log(`\n  Preview (${path}):`);
    previewLines.forEach((line) => console.log(`    ${line}`));
    if (contentLines.length > lines) {
      console.log("    ...");
    }
  } catch (err) {
    log(`Failed to read file for preview: ${err}`, "WARN");
  }
}

async function main(): Promise<void> {
  const workflowStartTime = Date.now();
  
  try {
    writeFileSync(LOG_FILE, "");
    log("=".repeat(60));
    log("WORKFLOW STARTED");
    log("=".repeat(60));
    log(`Log file: ${LOG_FILE}`);
    log(`Working directory: ${process.cwd()}`);
    log(`Node version: ${process.version}`);
    log(`Platform: ${process.platform}`);
    log(`Shared directory: ${SHARED_DIR}`);
    logSeparator();
  } catch (e) {
    console.error(`Failed to initialize log file: ${e}`);
  }
  
  const { prompt, timeoutMs } = parseArgs();
  
  log("=".repeat(60));
  log("OpenClaw Workflow: URL Scraper → Synthesizer");
  log("=".repeat(60));
  log(`Prompt: "${prompt}"`);
  log(`Timeout per agent: ${timeoutMs}ms`);

  // Step 1: Run url-scrapper agent
  log("\n" + "-".repeat(60));
  log("STEP 1: Scraping URLs");
  log("-".repeat(60));
  log(`Starting url-scrapper agent at ${new Date().toISOString()}`);

  const scraperResult = runAgent("url-scrapper", prompt, timeoutMs);

  if (!scraperResult.success) {
    log("URL SCRAPER FAILED", "ERROR");
    log(`Error details: ${scraperResult.error || scraperResult.output}`, "ERROR");
    console.error("\n❌ URL scraper failed:");
    console.error(scraperResult.error || scraperResult.output);
    process.exit(1);
  }

  log("URL SCRAPER COMPLETED SUCCESSFULLY");
  if (scraperResult.output) {
    log(`Scraper output (${scraperResult.output.length} chars):`);
    log(scraperResult.output.substring(0, 500) + (scraperResult.output.length > 500 ? "..." : ""), "DEBUG");
  }

  const urlFile = checkOutputFile("url.md");
  if (!urlFile.exists) {
    log("Warning: shared/url.md not found, continuing anyway...", "WARN");
    console.warn("\n⚠️  Warning: shared/url.md not found, continuing anyway...");
  } else {
    log("URL output file found: " + urlFile.path);
    printFilePreview(urlFile.path);
  }

  // Step 2: Run synthesizer agent
  log("\n" + "-".repeat(60));
  log("STEP 2: Synthesizing documentation");
  log("-".repeat(60));
  log(`Starting synthesizer agent at ${new Date().toISOString()}`);

  const synthesizerResult = runAgent("synthesizer", prompt, timeoutMs);

  if (!synthesizerResult.success) {
    log("SYNTHESIZER FAILED", "ERROR");
    log(`Error details: ${synthesizerResult.error || synthesizerResult.output}`, "ERROR");
    console.error("\n❌ Synthesizer failed:");
    console.error(synthesizerResult.error || synthesizerResult.output);
    console.log("\n⚠️  Partial success: URLs were scraped but synthesis failed");
    console.log(`   Check: ${urlFile.path}`);
    process.exit(1);
  }

  log("SYNTHESIZER COMPLETED SUCCESSFULLY");
  if (synthesizerResult.output) {
    log(`Synthesizer output (${synthesizerResult.output.length} chars):`);
    log(synthesizerResult.output.substring(0, 500) + (synthesizerResult.output.length > 500 ? "..." : ""), "DEBUG");
  }

  const summaryFile = checkOutputFile("summary.md");
  if (!summaryFile.exists) {
    log("Warning: shared/summary.md not found", "WARN");
    console.warn("\n⚠️  Warning: shared/summary.md not found");
  } else {
    log("Summary output file found: " + summaryFile.path);
    printFilePreview(summaryFile.path);
  }

  // Final summary
  const totalDuration = Date.now() - workflowStartTime;
  log("\n" + "=".repeat(60));
  log("WORKFLOW COMPLETED SUCCESSFULLY");
  log("=".repeat(60));
  log(`Total workflow duration: ${totalDuration}ms (${(totalDuration / 1000).toFixed(2)}s)`);
  log(`Output files:`);
  log(`  - URLs:      ${urlFile.path}`);
  log(`  - Summary:   ${summaryFile.path}`);
  log(`Log file: ${LOG_FILE}`);
  log("=".repeat(60));
  
  console.log("\n" + "=".repeat(60));
  console.log("✅ Workflow completed successfully!");
  console.log("=".repeat(60));
  console.log(`\nOutput files:`);
  console.log(`  - URLs:      ${urlFile.path}`);
  console.log(`  - Summary:   ${summaryFile.path}`);
  console.log(`  - Log:       ${LOG_FILE}`);
  console.log("");
}

main().catch((err) => {
  log("FATAL ERROR in workflow", "ERROR");
  log(`Error: ${err}`, "ERROR");
  log(`Stack trace: ${err instanceof Error ? err.stack : "N/A"}`, "ERROR");
  console.error("Fatal error:", err);
  process.exit(1);
});
