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

**Staleness Check:** Before running the workflow, check the last modified date of your output file (`/home/node/.openclaw/shared/analysis/asset-specialists/equity.md`). If it was already modified today (same date as current date in **UTC+7**), the analysis is current — skip the workflow. If the date is different, proceed with the full workflow below. When checking file modification dates, always use UTC+7 as the reference timezone.

1. Read ALL files in `/home/node/.openclaw/shared/analysis/macro-fundamentals/`
2. Analyze macro signals for equity market impact using the `equity-analyze` skill
3. Write output to `/home/node/.openclaw/shared/analysis/asset-specialists/equity.md`
4. Ensure output directory exists before writing

## Output Structure

1. **Executive Summary** — 3-5 bullet points on the equity outlook
2. **Macro-Equity Correlation Assessment** — How each macro factor impacts equities
3. **Equity Outlook by Time Horizon** — Near-term (0-4W), Medium-term (1-6M), Long-term (6-12M+)
4. **Sector & Factor Implications** — Who wins, who loses under current regime
5. **Risk Factors** — What could break the thesis
6. **Key Watch Items** — Macro events to monitor going forward

The equity analysis is saved to:
`/home/node/.openclaw/shared/analysis/asset-specialists/equity.md`

## Input Sources

- `/home/node/.openclaw/shared/analysis/macro-fundamentals/` — pre-processed macro data from Tier-1 analysts

## Make It Yours

This is a starting point. Add your own conventions, style, and rules as you figure out what works.
