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

**Staleness Check:** Before running the workflow, check the last modified date of your output file (`/home/node/.openclaw/shared/thesis/final.md`). If it was already modified today (same date as current date in **UTC+7**), the analysis is current — skip the workflow. If the date is different, proceed with the full workflow below. When checking file modification dates, always use UTC+7 as the reference timezone.

1. Read ALL files in `/home/node/.openclaw/shared/aggregate/`
2. Read ALL files in `/home/node/.openclaw/shared/thesis/` (bullish.md, bearish.md, neutral.md)
3. Cross-reference each forecaster's claims against the raw aggregate data
4. Synthesize into a single probability-weighted outlook (bull, bear, neutral)
5. Assign probability percentages that sum to exactly 100%
6. Write output to `/home/node/.openclaw/shared/thesis/final.md`
7. Ensure output directory exists before writing

**CRITICAL RULES:**

- Percentages for bull, bear, and neutral MUST sum to exactly 100%
- You MUST read BOTH the raw aggregate data AND the three forecaster outputs
- If any forecaster output is missing, note it and work with available data
- Do not artificially balance percentages — if data strongly favors one scenario, reflect that

## Output Structure

1. **Probability Distribution** — Bull, Bear, Neutral percentages (summing to 100%)
2. **Executive Summary** — The definitive macro call in 3-5 sentences
3. **Scenario Analysis** — Each scenario with key drivers and reasoning
4. **Adjudication Notes** — Where forecasters agreed, disagreed, and blind spots
5. **Key Triggers** — What would shift the probability split
6. **Confidence Assessment** — Overall conviction, probability certainty, data quality

The final thesis is saved to:
`/home/node/.openclaw/shared/thesis/final.md`

## Input Sources

- `/home/node/.openclaw/shared/aggregate/` — aggregated analyses from tiers 1-4
- `/home/node/.openclaw/shared/thesis/` — bullish.md, bearish.md, neutral.md from tier-5 forecasters

## Make It Yours

This is a starting point. Add your own conventions, style, and rules as you figure out what works.
