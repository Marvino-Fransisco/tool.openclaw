# AGENTS.md - Your Workspace

This folder is home. Treat it that way.

## Session Startup

Before doing anything else:

1. Read `SOUL.md` — this is who you are
2. Read `USER.md` — this is who you're helping
3. Read `memory/YYYY-MM-DD.md` (today + yesterday) for recent context
4. **If in MAIN SESSION** (direct chat with your human): Also read `MEMORY.md`

Don’t ask permission. Just do it.

## External vs Internal

**Safe to do freely:**

- Read files, explore, organize, learn
- Search the web, check calendars
- Work within this `workspace` and `/home/node/.openclaw/shared`

## Workflow

**Staleness Check:** Before running the workflow, check if a report file matching today's date already exists in `/home/node/.openclaw/shared/report/` (filename pattern: `macro-report-[YYYYMMDD]-*.pdf`). If a report was already generated today, the analysis is current — skip the workflow. If no report exists for today, proceed with the full workflow below.

1. Read ALL files in `/home/node/.openclaw/shared/aggregate/`
2. Read `/home/node/.openclaw/shared/thesis/final.md`
3. Read `/home/node/.openclaw/shared/advice/portfolio.md`
4. Synthesize into a cohesive report
5. Generate PDF using the pdf skill
6. Save to `/home/node/.openclaw/shared/report/macro-report-[YYYYMMDD-HHMM].pdf`
7. Ensure output directory exists before writing

## Report Structure

The PDF report should follow this structure:

1. **Title Page** — Report title, date, system identifier
2. **Executive Summary** — Key findings in 3-5 bullet points
3. **Macro Outlook** — Probability-weighted thesis (bull/bear/neutral percentages)
4. **Analysis Summary** — Synthesized findings from aggregated analysis
   - Monetary Policy & Central Banks
   - Economic Indicators & Growth
   - Market Prices & Cross-Asset
   - Sentiment & Positioning
   - Liquidity & Flows
5. **Portfolio Positioning** — Allocation advice and risk management
6. **Key Risks** — Top risks to the base case
7. **Disclaimer** — Standard research disclaimer

The final PDF report is saved to:
`/home/node/.openclaw/shared/report/macro-report-[YYYYMMDD-HHMM].pdf`

Where `[YYYYMMDD-HHMM]` is the current date and time when the report is generated.

## Input Sources

- `/home/node/.openclaw/shared/aggregate/` — aggregated analyses from tiers 1-4
- `/home/node/.openclaw/shared/thesis/final.md` — the final probability-weighted macro thesis from tier 5
- `/home/node/.openclaw/shared/advice/portfolio.md` — portfolio allocation advice from tier 6

## Make It Yours

This is a starting point. Add your own conventions, style, and rules as you figure out what works.
