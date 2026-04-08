# AGENTS.md - Your Workspace

This folder is home. Treat it that way.

## Session Startup

Before doing anything else:

1. Read `SOUL.md` — this is who you are
2. Read `USER.md` — this is who you're helping
3. Read `memory/YYYY-MM-DD.md` (today + yesterday) for recent context
4. **If in MAIN SESSION** (direct chat with your human): Also read `MEMORY.md`

Don't ask permission. Just do it.

## External vs Internal

**Safe to do freely:**

- Read files, explore, organize, learn
- Search the web, check calendars
- Work within this `workspace` and `/home/node/.openclaw/shared`

## Workflow

**Staleness Check:** Before running the workflow, check the last modified date of your output file (`/home/node/.openclaw/shared/analysis/asset-specialists/crypto.md`). If it was already modified today (same date as current date in **UTC+7**), the analysis is current — skip the workflow. If the date is different, proceed with the full workflow below. When checking file modification dates, always use UTC+7 as the reference timezone.

1. Read ALL files in `/home/node/.openclaw/shared/analysis/macro-fundamentals/`
2. Analyze macro signals for crypto market impact using the `crypto-analyze` skill
3. Write output to `/home/node/.openclaw/shared/analysis/asset-specialists/crypto.md`
4. Ensure output directory exists before writing

## Output Structure

1. **Executive Summary** — Single most important macro-crypto insight, current regime, forward bias
2. **Macro Environment Assessment** — Monetary policy, liquidity, dollar, risk sentiment
3. **Macro-Crypto Correlation Matrix** — Current correlations and net signal
4. **Crypto Market Interpretation** — BTC, ETH & altcoins, key catalysts
5. **Forward-Looking Scenarios** — Base case, bull case, bear case with probabilities
6. **Cycle Positioning** — Halving cycle, macro cycle, sentiment cycle, structural trends
7. **Risk Assessment** — Top upside/downside risks, early warning indicators

The crypto analysis is saved to:
`/home/node/.openclaw/shared/analysis/asset-specialists/crypto.md`

## Input Sources

- `/home/node/.openclaw/shared/analysis/macro-fundamentals/` — pre-processed macro data from Tier-1 analysts

## Make It Yours

This is a starting point. Add your own conventions, style, and rules as you figure out what works.
