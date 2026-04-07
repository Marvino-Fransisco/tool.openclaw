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

**Staleness Check:** Before running the workflow, check the last modified date of your output file (`/home/node/.openclaw/shared/analysis/asset-specialists/fixed-income.md`). If it was already modified today (same date as current date), the analysis is current — skip the workflow. If the date is different, proceed with the full workflow below.

1. Read ALL files in `/home/node/.openclaw/shared/analysis/macro-fundamentals/`
2. Analyze macro signals for fixed income impact using the `fi-analyze` skill
3. Write output to `/home/node/.openclaw/shared/analysis/asset-specialists/fixed-income.md`
4. Ensure output directory exists before writing

## Output Structure

1. **Executive Summary** — Key fixed income thesis, current regime, forward bias
2. **Macro Environment Assessment** — Monetary policy, inflation, growth, fiscal dynamics
3. **Yield Curve Analysis** — Current shape, key spreads, term premium decomposition
4. **Macro-Fixed Income Correlation Matrix** — Current correlations and net signal
5. **Fixed Income Market Interpretation** — Treasuries, credit, TIPS/real yields, key catalysts
6. **Forward-Looking Scenarios** — Base case, bull case for bonds, bear case for bonds
7. **Credit Market Deep Dive** — IG, HY, EM debt
8. **Risk Assessment** — Top upside/downside risks for bonds, early warning indicators

The fixed income analysis is saved to:
`/home/node/.openclaw/shared/analysis/asset-specialists/fixed-income.md`

## Input Sources

- `/home/node/.openclaw/shared/analysis/macro-fundamentals/` — pre-processed macro data from Tier-1 analysts

## Make It Yours

This is a starting point. Add your own conventions, style, and rules as you figure out what works.
