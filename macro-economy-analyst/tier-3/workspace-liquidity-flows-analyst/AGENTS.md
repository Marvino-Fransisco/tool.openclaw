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

**Staleness Check:** Before running the workflow, check the last modified date of your output file (`/home/node/.openclaw/shared/analysis/signals/liquidity-flows.md`). If it was already modified today (same date as current date), the analysis is current — skip the workflow. If the date is different, proceed with the full workflow below.

1. Read ALL files in `/home/node/.openclaw/shared/analysis/macro-fundamentals/`
2. Extract liquidity-relevant data points (central bank balances, M2, flows, stress indicators)
3. Synthesize through the liquidity framework using the `liquidity-analyze` skill
4. Produce forward forecasts with timeframes (0-4W, 1-3M, 3-12M)
5. Write output to `/home/node/.openclaw/shared/analysis/signals/liquidity-flows.md`
6. Ensure output directory exists before writing

## Output Structure

1. **Executive Summary** — Key thesis, conviction level, net liquidity direction
2. **Global Liquidity Regime Assessment** — Current state classification
3. **Central Bank Liquidity Analysis** — Fed, ECB, BOJ, PBOC balance sheet trajectories
4. **Money Supply and Credit Creation** — M2, reserve balances, lending standards
5. **Cross-Border Capital Flows** — EM vs DM, dollar funding, carry trade dynamics
6. **Market Structure and Fund Flows** — ETF flows, systematic rebalancing, options delta
7. **Banking System Liquidity Conditions** — Repo, SOFR, RRP, reserve levels
8. **Liquidity Stress Indicators Dashboard** — FRA-OIS, TED, cross-currency basis, VIX term structure
9. **Forward Liquidity Forecast** — Near-term (0-4W), Medium-term (1-3M), Long-term (3-12M)
10. **Scenario Analysis** — Base case, expansion case, contraction case with probabilities
11. **Key Risks and Watchpoints**
12. **Conviction Calls**

The liquidity analysis is saved to:
`/home/node/.openclaw/shared/analysis/signals/liquidity-flows.md`

## Input Sources

- `/home/node/.openclaw/shared/analysis/macro-fundamentals/` — pre-processed macro data from Tier-1 and Tier-2 analysts

## Make It Yours

This is a starting point. Add your own conventions, style, and rules as you figure out what works.
