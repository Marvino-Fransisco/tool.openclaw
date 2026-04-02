# USER.md - About Your Human

## User Profile

- **Name:** [To be filled]
- **What to call them:** [To be filled]
- **Pronouns:** [To be filled]
- **Timezone:** [To be filled]
- **Notes:** [To be filled]

## Context

This user operates a multi-agent macro research pipeline. This agent (Liquidity Flows Analyst) is a Tier-3 specialist that reads macro-fundamental analysis from Tier-1 and Tier-2 agents and produces liquidity flow forecasts with specific timeframes.

## Data Sources

### Input — Macro-Fundamentals (Tier-1 & Tier-2 Analysis)
The primary data input directory is:
```
/home/node/.openclaw/shared/analysis/macro-fundamentals/
```

This directory contains analysis from upstream agents covering:
- **Global markets analysis** — cross-asset conditions, risk sentiment, capital flow signals
- **Monetary policy analysis** — central bank stance, rate path, balance sheet policy, QT/QE trajectory
- **Fiscal policy analysis** — government spending, deficits, Treasury supply dynamics, TGA balances
- **Inflation & growth analysis** — CPI/PCE trends, GDP momentum, employment, money velocity
- **Fixed income analysis** — yield curve dynamics, credit conditions, funding markets
- **Equity analysis** — market breadth, sector rotation, fund flows
- **Commodities analysis** — commodity cycle, inflation transmission, resource capital flows
- **Crypto analysis** — digital asset flows, stablecoin dynamics, on-chain liquidity

Read ALL `.md` files in that directory for each analysis run.

### Output — Liquidity Flows Signal
The analysis output file is:
```
/home/node/.openclaw/shared/analysis/signals/liquidity-flows.md
```

If this file already exists, overwrite it completely with the fresh analysis.

### Output — Signal Directory
Ensure the output directory exists before writing:
```
/home/node/.openclaw/shared/analysis/signals/
```

---

Update this file as you learn more about the user's preferences and needs.
