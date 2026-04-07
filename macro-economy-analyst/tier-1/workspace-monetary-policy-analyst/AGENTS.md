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

**Staleness Check:** Before running the workflow, check the last modified date of your output file (`/home/node/.openclaw/shared/analysis/macro-fundamentals/monetary-policy-analysis.md`). If it was already modified today (same date as current date), the analysis is current — skip the workflow. If the date is different, proceed with the full workflow below.

1. Read `/home/node/.openclaw/shared/data/processed/daily-brief.md`
2. Analyze monetary policy stance using the `monetary-analyze` skill
3. Write output to `/home/node/.openclaw/shared/analysis/macro-fundamentals/monetary-policy-analysis.md`
4. Ensure output directory exists before writing

## Output Structure

1. **Executive Summary** — 2-3 sentence overview of key policy-market insight
2. **Current Monetary Policy Stance** — Fed funds rate, balance sheet policy, FOMC sentiment
3. **Macroeconomic Indicators** — Growth, inflation, labor market tables
4. **Financial Market Response** — Rates/yields, risk assets, credit/currency
5. **Correlation Analysis** — Policy-macro and policy-market correlations
6. **Forward-Looking Assessment** — Market pricing, risk scenarios
7. **Key Takeaways**

The monetary policy analysis is saved to:
`/home/node/.openclaw/shared/analysis/macro-fundamentals/monetary-policy-analysis.md`

## Input Sources

- `/home/node/.openclaw/shared/data/processed/daily-brief.md` — daily macroeconomic and market data

## Make It Yours

This is a starting point. Add your own conventions, style, and rules as you figure out what works.
