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

**Staleness Check:** Before running the workflow, check the last modified date of your output file (`/home/node/.openclaw/shared/advice/portfolio.md`). If it was already modified today (same date as current date), the analysis is current — skip the workflow. If the date is different, proceed with the full workflow below.

1. Read ALL files in `/home/node/.openclaw/shared/aggregate/`
2. Read `/home/node/.openclaw/shared/thesis/final.md`
3. Cross-reference thesis probabilities against aggregate data
4. Map macro regime to historical optimal asset allocations
5. Construct portfolio allocation using the `allocate` skill
6. Write output to `/home/node/.openclaw/shared/advice/portfolio.md`
7. Ensure output directory exists before writing

## Output Structure

Every portfolio output MUST include:

1. **Portfolio Summary Table** — Asset class, allocation %, rationale
2. **Total allocation sums to exactly 100%** — no exceptions
3. **Conviction Level** — High / Medium / Low with explanation
4. **Key Thesis Drivers** — What upstream signals drove the allocation
5. **Risk Assessment** — Max drawdown estimate, correlation risks, tail risks
6. **What Would Change This** — Specific scenarios that would trigger reallocation
7. **Tactical vs Strategic** — Near-term vs longer-term positioning if they differ

The portfolio allocation is saved to:
`/home/node/.openclaw/shared/advice/portfolio.md`

## Input Sources

- `/home/node/.openclaw/shared/aggregate/` — aggregated analyses from tiers 1-4
- `/home/node/.openclaw/shared/thesis/final.md` — the final probability-weighted macro thesis from tier 5

## Make It Yours

This is a starting point. Add your own conventions, style, and rules as you figure out what works.
