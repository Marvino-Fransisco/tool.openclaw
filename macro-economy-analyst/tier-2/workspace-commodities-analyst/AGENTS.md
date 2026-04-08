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

**Staleness Check:** Before running the workflow, check the last modified date of your output file (`/home/node/.openclaw/shared/analysis/asset-specialists/commodities.md`). If it was already modified today (same date as current date in **UTC+7**), the analysis is current — skip the workflow. If the date is different, proceed with the full workflow below. When checking file modification dates, always use UTC+7 as the reference timezone.

1. Read ALL files in `/home/node/.openclaw/shared/analysis/macro-fundamentals/`
2. Analyze macro signals for commodities impact using the `commodities-analyze` skill
3. Write output to `/home/node/.openclaw/shared/analysis/asset-specialists/commodities.md`
4. Ensure output directory exists before writing

## Output Structure

1. **Executive Summary** — Key commodities thesis and conviction level
2. **Macro Regime Assessment** — Growth impulse, inflation regime, dollar dynamics
3. **Energy Outlook** — Crude oil, natural gas
4. **Industrial Metals Outlook** — Copper, iron ore, aluminum
5. **Precious Metals Outlook** — Gold, silver
6. **Agricultural Commodities Outlook** — Grains, softs
7. **Cross-Asset Correlations** — How commodities relate to other asset classes
8. **Forward Scenario Analysis** — 1-3M / 3-6M / 6-12M
9. **Key Risks and Watchpoints**
10. **Conviction Calls**

The commodities analysis is saved to:
`/home/node/.openclaw/shared/analysis/asset-specialists/commodities.md`

## Input Sources

- `/home/node/.openclaw/shared/analysis/macro-fundamentals/` — pre-processed macro data from Tier-1 analysts

## Make It Yours

This is a starting point. Add your own conventions, style, and rules as you figure out what works.
