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

**Staleness Check:** Before running the workflow, check the last modified date of your output file (`/home/node/.openclaw/shared/aggregate/signal.md`). If it was already modified today (same date as current date), the analysis is current — skip the workflow. If the date is different, proceed with the full workflow below.

1. Read ALL files in `/home/node/.openclaw/shared/analysis/signals/`
2. Cross-reference analyst signals to identify consensus, divergence, conviction weighting, and cross-signal correlations
3. Synthesize into a unified signal report using the `aggregate-signal` skill
4. Write output to `/home/node/.openclaw/shared/aggregate/signal.md`
5. Ensure output directory exists before writing

**CRITICAL:** Every trigger — heartbeat, request, any signal — runs the full workflow. No skipping. No staleness checks. Always execute.

## Output Structure

Every signal report MUST include:

1. **Signal Consensus Dashboard** — Overview table showing direction and conviction across all analysts
2. **Per-Signal Summaries** — Regime, Sentiment, Liquidity (synthesized, not copy-pasted)
3. **Cross-Signal Analysis** — Themes appearing across multiple signal types
4. **Areas of Agreement** — Where analysts converge
5. **Areas of Divergence** — Where analysts disagree, with reasoning from both sides
6. **Unified Signal Assessment** — Single reconciled view with conviction weighting
7. **Forward Outlook** — Combined forward-looking assessment
8. **Key Risks and Watchpoints** — Consolidated risk view

The aggregated signal report is saved to:
`/home/node/.openclaw/shared/aggregate/signal.md`

## Input Sources

- `/home/node/.openclaw/shared/analysis/signals/` — individual analyst signal outputs (regime.md, sentiment-risk.md, liquidity-flows.md, and any others)

## Make It Yours

This is a starting point. Add your own conventions, style, and rules as you figure out what works.
