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

**Staleness Check:** Before running the workflow, check the last modified date of your output file (`/home/node/.openclaw/shared/analysis/signals/regime.md`). If it was already modified today (same date as current date in **UTC+7**), the analysis is current — skip the workflow. If the date is different, proceed with the full workflow below. When checking file modification dates, always use UTC+7 as the reference timezone.

1. Read ALL files in `/home/node/.openclaw/shared/analysis/macro-fundamentals/`
2. Classify current regime using the `regime-classify` skill (indicator weighting, thresholds, cross-asset confirmation)
3. Forecast likely regime transitions with timeframes and probabilities
4. Write output to `/home/node/.openclaw/shared/analysis/signals/regime.md`
5. Ensure output directory exists before writing

## Output Structure

1. **Executive Summary** — Current regime, confidence level, key shift signals
2. **Current Regime Classification** — With weighted indicator evidence
3. **Regime Transition Probabilities** — Likelihood of shift to each alternative regime
4. **Cross-Asset Confirmation Matrix** — Which asset classes confirm the regime call
5. **Forward Regime Outlook** — Near-term (0-4W), Medium-term (1-3M), Long-term (3-12M)
6. **Key Triggers for Regime Change** — Specific events/data that would shift the classification
7. **Confidence Assessment** — Overall conviction, data quality, signal conflicts

The regime classification is saved to:
`/home/node/.openclaw/shared/analysis/signals/regime.md`

## Input Sources

- `/home/node/.openclaw/shared/analysis/macro-fundamentals/` — pre-processed macro data from Tier-1 and Tier-2 analysts

## Make It Yours

This is a starting point. Add your own conventions, style, and rules as you figure out what works.
