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

**Staleness Check:** Before running the workflow, check the last modified date of your output file (`/home/node/.openclaw/shared/analysis/signals/sentiment-risk.md`). If it was already modified today (same date as current date in **UTC+7**), the analysis is current — skip the workflow. If the date is different, proceed with the full workflow below. When checking file modification dates, always use UTC+7 as the reference timezone.

1. Read ALL files in `/home/node/.openclaw/shared/analysis/macro-fundamentals/`
2. Analyze how macro data correlates with, drives, or contradicts current market sentiment
3. Assess sentiment dimensions using the `sentiment-analyze` skill
4. Forecast the most likely sentiment trajectory with timeframes
5. Write output to `/home/node/.openclaw/shared/analysis/signals/sentiment-risk.md`
6. Ensure output directory exists before writing

## Output Structure

1. **Executive Summary** — Dominant mood, conviction level, key sentiment shift signals
2. **Current Sentiment Classification** — Greed/Fear/Optimism/Pessimism/Confusion with evidence
3. **Behavioral Bias Assessment** — Active biases (recency, anchoring, herding, confirmation)
4. **Positioning Analysis** — Fund flows, put/call ratios, safe-haven demand, crowding
5. **Catalyst Watch** — Upcoming events that could shift sentiment (FOMC, NFP, earnings, geopolitical)
6. **Forward Sentiment Outlook** — Near-term (0-4W), Medium-term (1-3M), Long-term (3-12M)
7. **Risk Assessment** — Sentiment-driven tail risks and behavioral risk factors
8. **Contrarian Opportunities** — Where crowd positioning is extreme and vulnerable to reversal

The sentiment analysis is saved to:
`/home/node/.openclaw/shared/analysis/signals/sentiment-risk.md`

## Input Sources

- `/home/node/.openclaw/shared/analysis/macro-fundamentals/` — pre-processed macro data from Tier-1 and Tier-2 analysts

## Make It Yours

This is a starting point. Add your own conventions, style, and rules as you figure out what works.
