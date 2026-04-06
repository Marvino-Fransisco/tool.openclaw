---
name: liquidity-analyze
description: Analyze macro fundamentals for global liquidity and capital flow implications
output: /home/node/.openclaw/shared/analysis/signals/liquidity-flows.md
---

# Liquidity Analysis Skill

## Source Data

- **Directory:** `/home/node/.openclaw/shared/analysis/macro-fundamentals/`
- All `.md` files in that directory are source data
- If directory is empty or missing, write a minimal report stating no data available

## Analytical Framework

When analyzing macro-fundamentals for liquidity implications, consider:

1. **Central bank balance sheet trajectory** — QT vs QE, pace of runoff, reinvestment policies, emergency lending facilities
2. **Money supply dynamics** — M2 growth, reserve balances, monetary base expansion/contraction
3. **Fiscal-monetary interaction** — Deficit spending vs Treasury issuance, TGA balances, refunding, fiscal multiplier effects
4. **Cross-border capital flows** — EM vs DM allocation, dollar funding markets, eurodollar creation, carry trade dynamics
5. **Banking system liquidity** — Reserve levels, repo rates (SOFR, repo vs reverse repo), lending standards, credit creation velocity
6. **Market structure flows** — ETF flows (equity, bond, commodity), mutual fund redemptions, hedge fund leverage, systematic rebalancing, options delta hedging
7. **Seasonal and technical flows** — Month-end/quarter-end rebalancing, tax-loss harvesting, pension rebalancing, corporate buyback windows, Treasury auction cycles
8. **Liquidity stress indicators** — FRA-OIS spreads, TED spread, cross-currency basis, VIX term structure, high-yield OAS, EM risk premia

## Key Metrics to Track

- Central bank balance sheets (Fed, ECB, BOJ, PBOC) — direction and rate of change
- M2 growth rate and money velocity
- Reserve balances and RRP facility usage
- TGA (Treasury General Account) balance
- SOFR and repo market rates
- Cross-currency basis (EUR/USD, JPY/USD)
- ETF fund flows (equity, bond, commodity)
- Credit spreads (IG, HY, EM)
- Dollar index (DXY)

## Report Template

```markdown
# Liquidity Flows Analysis
**As-of:** [date based on source data timestamps]
**Analyst:** Liquidity Flows Analyst (Tier-3 Agent)

## Executive Summary
## Global Liquidity Regime Assessment
## Central Bank Liquidity Analysis
## Money Supply and Credit Creation
## Cross-Border Capital Flows
## Market Structure and Fund Flows
## Banking System Liquidity Conditions
## Liquidity Stress Indicators Dashboard
## Forward Liquidity Forecast
### Near-Term (0-4 Weeks)
### Medium-Term (1-3 Months)
### Long-Term (3-12 Months)
## Scenario Analysis
### Base Case (probability: X%)
### Liquidity Expansion Case (probability: Y%)
### Liquidity Contraction Case (probability: Z%)
## Key Risks and Watchpoints
## Conviction Calls
```

## Downstream Consumers

- Tier-4 signal aggregator reads this file as a primary input
- Tier-5 forecasters use this for positioning context
- Tier-6 portfolio manager uses this for allocation decisions
- Tier-7 synthesizer includes this in the final report
