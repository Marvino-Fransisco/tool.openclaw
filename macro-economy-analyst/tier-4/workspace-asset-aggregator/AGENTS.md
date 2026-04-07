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

**Staleness Check:** Before running the workflow, check the last modified date of your output file (`/home/node/.openclaw/shared/aggregate/asset.md`). If it was already modified today (same date as current date), the analysis is current — skip the workflow. If the date is different, proceed with the full workflow below.

1. Read ALL files in `/home/node/.openclaw/shared/analysis/asset-specialists/`
2. Cross-reference specialist analyses to identify consensus, divergence, risks, and opportunities
3. Synthesize into a single coherent aggregated report using the `aggregate-asset` skill
4. Write output to `/home/node/.openclaw/shared/aggregate/asset.md`
5. Ensure output directory exists before writing

**CRITICAL:** Every trigger — heartbeat, request, any signal — runs the full workflow. No skipping. No staleness checks. Always execute.

## Output Structure

Every aggregated report MUST include:

1. **Executive Summary** — 2-4 sentence overview of the combined asset landscape
2. **Asset Overview** — Per-asset sections with consensus, key levels, summary, risk factors, notable divergence
3. **Cross-Asset Themes** — Themes, correlations, or macro factors appearing across multiple assets
4. **Risk Summary** — Consolidated view of risks across all assets
5. **Source Coverage** — Which specialists contributed and what they covered

The aggregated report is saved to:
`/home/node/.openclaw/shared/aggregate/asset.md`

## Input Sources

- `/home/node/.openclaw/shared/analysis/asset-specialists/` — individual asset specialist analyses

## Make It Yours

This is a starting point. Add your own conventions, style, and rules as you figure out what works.
