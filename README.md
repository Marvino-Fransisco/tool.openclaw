# OpenClaw

A collection of AI-powered agent workspaces built with OpenClaw framework. Each project contains specialized agents for different automation tasks.

## Projects

### Market Analyzer
Cryptocurrency market analysis suite with multi-agent architecture.

**Agents:**
- `market-analyzer` - Main market analysis agent
- `volume-profile-analyzer` - Volume profile analysis
- `synthesizer` - Synthesizes analysis results
- `technical-analysis-reviewer` - Reviews technical analysis
- `trade-planner` - Generates trade plans

**Features:**
- Market profile analysis
- Footprint charts
- Volume spread analysis
- ATR range detection
- Candle data export
- Bybit exchange integration

**Port:** 18789

---

### System Designer
Automated codebase analysis and system design generation.

**Agents:**
- `main` - Primary interface
- `explore` - Explores and analyzes codebases
- `designer` - Generates system designs
- `scanner` - Scans project structure

**Usage:**
```bash
npx tsx workspace/scripts/run-task.ts "I want to add user authentication with OAuth2"
```

**Workflow:**
1. Scans project structure
2. Explorer agent analyzes codebase
3. Designer agent generates system design

**Port:** 18002

---

### Summarizer
URL scraping and content synthesis workflow.

**Agents:**
- `main` - Workflow orchestrator
- `url-scrapper` - Scrapes URLs for content
- `synthesizer` - Synthesizes documentation

**Usage:**
```bash
npx tsx workspace/scripts/start-workflow.ts "Learn about React hooks"
```

**Output:**
- `shared/url.md` - Scraped URLs
- `shared/summary.md` - Synthesized documentation

**Port:** 18003

---

### Macro Economy Analyst
Macroeconomic analysis agent.

**Port:** 18004

---

## Technology Stack

- **LLM Provider:** ZAI (GLM-5, GLM-4.7 models)
- **Integration:** Discord bots for each project
- **Gateway:** Local HTTP API with token authentication

## Structure

```
.openclaw/
├── <project>/
│   ├── openclaw.json       # Project configuration
│   ├── agents/             # Agent definitions and sessions
│   ├── workspace/          # Working directory
│   ├── identity/           # Device identity
│   ├── credentials/        # Stored credentials
│   └── cron/               # Scheduled jobs
```

## Requirements

- OpenClaw CLI installed
- ZAI API key configured
- Node.js (for workspace scripts)
